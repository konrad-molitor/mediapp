import {useLanguage} from '../../context/LanguageContext.tsx';
import React, {useContext, useEffect, useState} from 'react';
import SplashScreen from 'react-native-splash-screen';
import {Text, TouchableOpacity, View} from 'react-native';
import {useBluetooth} from '../../BluetoothManager.ts';
import {styles} from './MainScreenStyles.ts';
import DeviceSelectionModal from '../DeviceSelectionModal/DeviceSelectionModal.tsx';
import { PillboxConfigScreenName } from '../PillboxConfigScreen/PillboxConfigScreen.tsx';
import { PillboxPreview } from '../PillboxPreview/PillboxPreview'; // Import PillboxPreview
import { Pillbox } from '../../entities/Pillbox.entity';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PillboxContext} from '../../context/PillboxContext.tsx';
import {MedicationListScreenName} from '../MedicationListScreen/MedicationListScreen.tsx';

export function MainScreen({ navigation }) {
  const { translations } = useLanguage();
  const {
    scanForDevices,
    isScanning,
    devices,
    connectToDevice,
    sendTestMessage,
    connectedDevice,
  } = useBluetooth();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const { pillbox } = useContext(PillboxContext);

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: translations.mediApp,
    });
  }, [navigation, translations]);

  return (
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
        <Text style={styles.placeholderText}>{translations.disconnected}</Text>
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
              scanForDevices();
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
            connectToDevice(selectedDevice.id); // Connect to the selected device
            setIsModalVisible(false);
          }
        }}
      />
    </View>
  );
}

export const MainScreenName = 'MainScreen';
