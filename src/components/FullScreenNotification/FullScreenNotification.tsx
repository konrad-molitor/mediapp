// src/components/FullScreenNotification.tsx

import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  BackHandler,
  Dimensions,
  Easing,
  NativeModules,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PBCell, PBCellState} from '../../entities/PBCell.entity.ts';
import {rescheduleMedicationNotification} from '../../NotificationService.ts';
import notifee from '@notifee/react-native';
import {Pillbox} from '../../entities/Pillbox.entity.ts';
import {btEvents, SERVICE_EVENTS} from '../../BackgroundService.ts';

const {FullScreenModule} = NativeModules;

// Define the shape of your notification data
export type FullScreenNotificationData = {
  notificationId: string;
  medicationName: string;
  medicationId: string;
  snoozeCount: number;
};

const FullScreenNotification = () => {
  const [notificationId, setNotificationId] = useState('');
  const [medicationName, setMedicationName] = useState('');
  const [medicationId, setMedicationId] = useState('');
  const [pillboxCellLabel, setPillboxCellLabel] = useState('');
  const [snoozeCount, setSnoozeCount] = useState(0);
  const [pbCell, setPbCell] = useState({} as PBCell | null | undefined);
  const [pillbox, setPillbox] = useState<Pillbox | null>(null);

  const loadPillbox = async () => {
    try {
      const savedPillbox = await AsyncStorage.getItem('pillbox');
      if (savedPillbox) {
        const pillboxData = JSON.parse(savedPillbox);
        // Deserialize dates and other necessary fields
        return Pillbox.fromJSON(pillboxData);

      }
    } catch (error) {
    }
  };


  const savePillbox = async (pillbox: Pillbox) => {
    if (pillbox) {
      const pillboxData = pillbox.toJSON();
      await AsyncStorage.setItem('pillbox', JSON.stringify(pillboxData));
    }
  };

  // Animated values for optional features
  const backgroundColorAnim = useRef(new Animated.Value(0)).current;
  const labelBounceAnim = useRef(new Animated.Value(0)).current;

  // Get screen dimensions
  const { height: screenHeight } = Dimensions.get('window');

  const getCell = (pillbox: Pillbox, snoozeCount: number, medicationId: string) => {
    if (snoozeCount === 0) {
      return pillbox?.getNextCellForMedication(medicationId);
    } else {
      return pillbox?.getToBeTakenNowCell();
    }
  };

  useEffect(() => {
    // Load notification data from AsyncStorage
    const loadNotificationData = async () => {
      try {
        const notificationDataString = await AsyncStorage.getItem('notificationData');
        const pillbox = await loadPillbox();
        if (notificationDataString) {
          const notificationData: FullScreenNotificationData = JSON.parse(notificationDataString);
          setNotificationId(notificationData.notificationId);
          setMedicationName(notificationData.medicationName);
          setMedicationId(notificationData.medicationId);
          setSnoozeCount(notificationData.snoozeCount);

          const cell = getCell(pillbox, notificationData.snoozeCount, notificationData.medicationId);
          setPbCell(cell);

          if (pillbox && cell) {
            pillbox.markCellAs(cell.id, PBCellState.ToBeTakenNow);
            setPillboxCellLabel(cell.label);
            setPillbox(pillbox);
            savePillbox(pillbox);

            btEvents.emit(SERVICE_EVENTS.SEND_MESSAGE, cell.label);
          } else {
            setPillboxCellLabel('N/A');
          }

        } else {
          console.warn('No notification data found in AsyncStorage.');
        }
      } catch (error) {
        console.error('Error loading notification data:', error);
      }
    };

    loadNotificationData();

    // Start background color animation (optional)
    Animated.loop(
      Animated.sequence([
        Animated.timing(backgroundColorAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
          easing: Easing.linear,
        }),
        Animated.timing(backgroundColorAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
          easing: Easing.linear,
        }),
      ])
    ).start();

    // Start label bounce animation (optional)
    Animated.loop(
      Animated.sequence([
        Animated.timing(labelBounceAnim, {
          toValue: -10,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.ease,
        }),
        Animated.timing(labelBounceAnim, {
          toValue: 10,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.ease,
        }),
        Animated.timing(labelBounceAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.ease,
        }),
      ])
    ).start();

    // Prevent back button from closing the activity
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // Do nothing on back press
      return true;
    });

    return () => backHandler.remove();
  }, [backgroundColorAnim, labelBounceAnim]);

  useEffect(() => {
    const takeListener = () => handleTake();
    const snoozeListener = () => handleSnooze();

    btEvents.addListener(SERVICE_EVENTS.MICROBIT_A_BUTTON, takeListener);
    btEvents.addListener(SERVICE_EVENTS.MICROBIT_B_BUTTON, snoozeListener);

    return () => {
      btEvents.removeAllListeners(SERVICE_EVENTS.MICROBIT_A_BUTTON);
      btEvents.removeAllListeners(SERVICE_EVENTS.MICROBIT_B_BUTTON);
    };
  }, [pillbox, pbCell, medicationName, snoozeCount]);


  const handleTake = async () => {
    if (pbCell && pillbox) {
      console.log('Taking medication:', medicationName);
      pillbox.markCellAs(pbCell.id, PBCellState.Taken);
      setPillbox(pillbox);
      await savePillbox(pillbox);
    }
    await notifee.cancelNotification(notificationId);
    btEvents.emit(SERVICE_EVENTS.STOP_NOTIFICATION);

    console.log('Medication taken:', medicationName);
    FullScreenModule.closeFullScreenNotification();
  };

  const handleSnooze = async () => {
    if (snoozeCount >= 2 && pbCell && pillbox) {
      console.log('Medication overdue:', medicationName);
      pillbox?.markCellAs(pbCell?.id, PBCellState.Overdue);
      setPillbox(pillbox);
      await savePillbox(pillbox);
    } else {
      console.log('Snoozing medication:', medicationName);
      const newData = {
        notificationId: `${notificationId}-snooze-${snoozeCount + 1}`,
        medicationName,
        medicationId,
        snoozeCount: snoozeCount + 1,
      };
      await rescheduleMedicationNotification(newData);
      btEvents.emit(SERVICE_EVENTS.STOP_NOTIFICATION);
    }
    await notifee.cancelNotification(notificationId);

    console.log('Medication snoozed:', medicationName);

    FullScreenModule.closeFullScreenNotification();
  };

  // Interpolate background color animation value
  const backgroundColor = backgroundColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#001f3f', '#FFA500'], // Navy Blue to Orange
  });

  // Calculate dynamic font size for the cell label (30% of screen height)
  const cellLabelFontSize = screenHeight * 0.25; // Adjust as needed

  return (
    <Animated.View style={[styles.container, { backgroundColor }]}>
      {/* Animated Cell Label */}
      <Animated.Text
        style={[
          styles.cellLabel,
          {
            transform: [{ translateY: labelBounceAnim }],
            fontSize: cellLabelFontSize,
          },
        ]}
      >
        {pillboxCellLabel}
      </Animated.Text>

      {/* Medication Name */}
      <Text style={styles.medicationName}>{medicationName}</Text>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.takeButton} onPress={handleTake}>
          <Text style={styles.buttonText}>Take</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.snoozeButton} onPress={handleSnooze}>
          <Text style={styles.buttonText}>Snooze</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

// Helper function to extract medicationId from notificationId
const extractMedicationIdFromNotificationId = (notificationId: string): string => {
  const parts = notificationId.split('-');
  return parts[1] || '';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  cellLabel: {
    color: '#FFD700', // Gold color for prominence
    fontWeight: 'bold',
    marginBottom: 10,
  },
  medicationName: {
    fontSize: 24,
    color: '#FFFFFF', // White color for readability
    marginBottom: 40,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  takeButton: {
    backgroundColor: '#28A745', // Green color for "Take"
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30, // Makes the button round
    marginHorizontal: 10,
    elevation: 2, // Adds shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 }, // Shadow for iOS
    shadowOpacity: 0.3, // Shadow for iOS
    shadowRadius: 2, // Shadow for iOS
  },
  snoozeButton: {
    backgroundColor: '#6C757D', // Gray color for "Snooze"
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30, // Makes the button round
    marginHorizontal: 10,
    elevation: 2, // Adds shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 }, // Shadow for iOS
    shadowOpacity: 0.3, // Shadow for iOS
    shadowRadius: 2, // Shadow for iOS
  },
  buttonText: {
    color: '#FFFFFF', // White color for text readability
    fontSize: 18,
    fontWeight: '600',
  },
});

export default FullScreenNotification;
