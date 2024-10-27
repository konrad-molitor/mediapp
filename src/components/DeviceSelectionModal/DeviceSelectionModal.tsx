import React from 'react';
import { View, Text, Modal, FlatList, TouchableOpacity } from 'react-native';
import { Device } from 'react-native-ble-plx'; // Assuming you're using Device type from ble-plx
import { styles } from './DeviceSelectionModalStyles';
import { useLanguage } from '../../context/LanguageContext'; // Import useLanguage

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
  const { language, translations } = useLanguage(); // Get current language and translations

  const renderDevice = ({ item }: { item: Device }) => {
    const isSelected = selectedDevice && selectedDevice.id === item.id;
    return (
      <TouchableOpacity
        style={[
          styles.deviceItem,
          isSelected && styles.selectedDeviceItem, // Apply special style if this is the selected device
        ]}
        onPress={() => onDeviceSelect(item)}
      >
        <Text style={styles.deviceText}>{item.name || translations.unnamedDevice}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal visible={isVisible} transparent={true} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{translations.availableDevices}</Text>
          {isScanning ? (
            <Text>{translations.scanningForDevices}</Text>
          ) : devices.length > 0 ? (
            <FlatList data={devices} keyExtractor={(item) => item.id} renderItem={renderDevice} />
          ) : (
            <Text>{translations.noDevicesFound}</Text>
          )}
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.modalButton} onPress={onClose}>
              <Text style={styles.buttonText}>{translations.cancel}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modalButton,
                !selectedDevice && styles.disabledButton,
              ]}
              onPress={onConnect}
              disabled={!selectedDevice}
            >
              <Text style={styles.buttonText}>{translations.select}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DeviceSelectionModal;
