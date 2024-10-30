import {useLanguage} from '../../context/LanguageContext.tsx';
import React, {useContext, useEffect, useState} from 'react';
import SplashScreen from 'react-native-splash-screen';
import {Animated, Dimensions, Text, TouchableOpacity, View} from 'react-native';
import {styles} from './MainScreenStyles.ts';
import DeviceSelectionModal from '../DeviceSelectionModal/DeviceSelectionModal.tsx';
import { PillboxConfigScreenName } from '../PillboxConfigScreen/PillboxConfigScreen.tsx';
import { PillboxPreview } from '../PillboxPreview/PillboxPreview'; // Import PillboxPreview
import {PillboxContext} from '../../context/PillboxContext.tsx';
import {MedicationListScreenName} from '../MedicationListScreen/MedicationListScreen.tsx';
import {PanGestureHandler, State} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Pillbox} from '../../entities/Pillbox.entity.ts';
import {AssignedMedicationList} from '../AssignedMedicationList/AssignedMedicationList.tsx';
import {btEvents, getConnectedDevice, SERVICE_EVENTS} from '../../BackgroundService.ts';
import {Device} from 'react-native-ble-plx';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SWIPE_THRESHOLD = 30; // Adjust based on sensitivity

export function MainScreen({ navigation }) {
  const { translations } = useLanguage();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null)<Device | null>;
  const { pillbox, setPillbox} = useContext(PillboxContext);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null)<Device | null>;

  const translateY = useState(new Animated.Value(0))[0];

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: translations.mediApp,
    });
  }, [navigation, translations]);

  useEffect(() => {
    navigation.setOptions({
      title: translations.mediApp,
    });
  }, [navigation, translations]);

  useEffect(() => {
    btEvents.addListener(SERVICE_EVENTS.UPDATE_CONNECTED_DEVICE, () => {
      const device = getConnectedDevice();
      if (device) {
        setConnectedDevice(device);
      }
    });
  }, []);

  const scanDevices = async () => {
    console.log('Scanning for devices in MainScreen...');
    btEvents.addListener(SERVICE_EVENTS.SCAN_STARTED, () => {
      setIsScanning(true);
    });
    btEvents.addListener(SERVICE_EVENTS.DEVICES_LIST_UPDATED, (devices) =>{
      setDevices(devices);
    });
    btEvents.addListener(SERVICE_EVENTS.SCAN_STOPPED, () => {
      setIsScanning(false);
      btEvents.removeAllListeners(SERVICE_EVENTS.SCAN_STARTED);
      btEvents.removeAllListeners(SERVICE_EVENTS.DEVICES_LIST_UPDATED);
    });
    btEvents.emit(SERVICE_EVENTS.SCAN_DEVICES);
  };

  const connectDevice = async (device: Device | null) => {
    if (!device) {
      console.error('No device selected for connection');
      return;
    }
    btEvents.emit(SERVICE_EVENTS.CONNECT_TO_DEVICE, device.id);
  };

  const sendTestMessage = async () => {
    btEvents.emit(SERVICE_EVENTS.SEND_TEST_MESSAGE, 'Test message');
  };

  // Update function to refresh pillbox status
  const updatePillboxStatus = async () => {
    setIsUpdating(true);
    try {
      const updatedStatus = Pillbox.fromJSON(JSON.parse(await AsyncStorage.getItem('pillbox'))); // Replace with your actual function
      setPillbox(updatedStatus); // Update context
      // Optionally, show a success message
    } catch (error) {
      console.error('Failed to update pillbox status:', error);
      // Optionally, show an error alert
    } finally {
      setIsUpdating(false);
    }
  };

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const { translationY, velocityY } = event.nativeEvent;
      let shouldUpdate = false;

      if (translationY > SWIPE_THRESHOLD || velocityY > 1000) {
        shouldUpdate = true;
      }

      if (shouldUpdate) {
        // Trigger the update
        updatePillboxStatus();

        // Animate the swipe down
        Animated.timing(translateY, {
          toValue: SCREEN_HEIGHT,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          // Reset the animation value
          translateY.setValue(0);
        });
      } else {
        // Reset the animation if swipe is not sufficient
        Animated.spring(translateY, {
          toValue: 0,
          friction: 2,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}>
      <Animated.View style={[
        {
          flex: 1,
          padding: 0,
          backgroundColor: '#f0f0f0',
        },
        {
          transform: [{ translateY: translateY }],
        },
      ]}>
        <View style={styles.container}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{translations.pillbox}</Text>

            {/* Pillbox preview container */}
            <View style={styles.pillboxPreviewContainer}>
              <PillboxPreview pillbox={pillbox} />
            </View>

            <TouchableOpacity
              style={styles.fitContentButton}
              onPress={() => navigation.navigate(PillboxConfigScreenName)}
            >
              <Text style={styles.buttonText}>{translations.pillboxSettings}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>{translations.medication}</Text>
            <View style={styles.pillboxPreviewContainer}>
              <AssignedMedicationList />
            </View>
            <TouchableOpacity
              style={styles.fitContentButton}
              onPress={() => navigation.navigate(MedicationListScreenName)}
            >
              <Text style={styles.buttonText}>{translations.editMedication}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>{translations.microbit}</Text>
            <Text style={styles.deviceStatus}>
              {connectedDevice
                ? `${translations.connected}: ${connectedDevice.name}`
                : translations.disconnected}
            </Text>
            <View style={styles.rowButtons}>
              <TouchableOpacity
                disabled={!connectedDevice}
                style={[styles.smallButton, !connectedDevice && styles.disabledButton]}
                onPress={sendTestMessage}>
                <Text style={styles.buttonText}>{translations.testConnection}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.smallButton}
                onPress={() => {
                  setIsModalVisible(true);
                  scanDevices();
                }}>
                <Text style={styles.buttonText}>{translations.connect}</Text>
              </TouchableOpacity>
            </View>
          </View>

      {/* Device Selection Modal */}
      <DeviceSelectionModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        devices={devices}
        isScanning={isScanning}
        onDeviceSelect={setSelectedDevice}
        selectedDevice={selectedDevice}
        onConnect={() => {
          if (selectedDevice) {
            connectDevice(selectedDevice); // Connect to the selected device
            setIsModalVisible(false);
          }
        }}
      />
    </View>
  </Animated.View>
</PanGestureHandler>
  );
}

export const MainScreenName = 'MainScreen';
