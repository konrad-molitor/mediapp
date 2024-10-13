import React from 'react';
import {View, Text, Modal, FlatList, Button, TouchableOpacity} from 'react-native';
import {Device} from 'react-native-ble-plx'; // Assuming you're using Device type from ble-plx
import { styles } from './DeviceSelectionModalStyles.ts';

interface DeviceSelectionModalProps {
  isVisible: boolean;
  onClose: () => void;
  devices: Device[];
  isScanning: boolean;
  onDeviceSelect: (device: Device) => void;
  selectedDevice: Device | null;
  onConnect: () => void;
}

const DeviceSelectionModal: React.FC<DeviceSelectionModalProps> = ({
                                                                     isVisible,
                                                                     onClose,
                                                                     devices,
                                                                     isScanning,
                                                                     onDeviceSelect,
                                                                     selectedDevice,
                                                                     onConnect,
                                                                   }) => {

  const renderDevice = ({item}: {item: Device}) => {
    const isSelected = selectedDevice && selectedDevice.id === item.id;
    return (
      <TouchableOpacity
        style={[
          styles.deviceItem,
          isSelected && styles.selectedDeviceItem // Apply special style if this is the selected device
        ]}
        onPress={() => onDeviceSelect(item)}
      >
        <Text style={styles.deviceText}>{item.name || 'Unnamed Device'}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal visible={isVisible} transparent={true} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Available Devices</Text>
          {isScanning ? (
            <Text>Scanning for devices...</Text>
          ) : devices.length > 0 ? ( // Check if there are devices to display
            <FlatList data={devices} keyExtractor={(item) => item.id} renderItem={renderDevice} />
          ) : (
            <Text>No devices found</Text> // Show this message if no devices were detected
          )}
          <View style={styles.modalButtons}>
            <Button title="Cancel" onPress={onClose} />
            <Button title="Select" disabled={!selectedDevice} onPress={onConnect} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DeviceSelectionModal;
