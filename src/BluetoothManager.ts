import {BleManager, Device} from 'react-native-ble-plx';
import {PermissionsAndroid, Platform} from 'react-native';
import {useState, useEffect} from 'react';
import {Buffer} from 'buffer';
import AsyncStorage from '@react-native-async-storage/async-storage';

export let BluetoothManager = new BleManager();

export const useBluetooth = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);

  // Request Bluetooth permissions for Android
  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);

        console.log('Permissions granted:', granted);
      } catch (error) {
        console.error('Failed to request permissions:', error);
      }
    }
  };

  // Load connected device from AsyncStorage and attempt reconnection
  const loadConnectedDevice = async () => {
    const deviceId = await AsyncStorage.getItem('connectedDeviceId');
    if (deviceId) {
      try {
        await connectToDevice(deviceId);
      } catch (error) {
        console.log('Failed to reconnect to saved device, clearing stored connection info');
        await AsyncStorage.removeItem('connectedDeviceId'); // Clear connection info if reconnection fails
      }
    }
  };

  // Scan for devices function
  const scanForDevices = () => {
    setIsScanning(true);
    BluetoothManager.destroy();
    BluetoothManager = new BleManager(); // Re-initialize the manager to clear any previous state
    BluetoothManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log('Error during scanning:', error);
        setIsScanning(false);
        return;
      }

      if (device && device.name && !devices.some(d => d.id === device.id)) {
        console.log(`Detected device: ${device.name}`);
        setDevices(prevDevices => {
          const existingDevice = prevDevices.find(d => d.id === device.id);
          if (!existingDevice) {
            return [...prevDevices, device];
          }
          return prevDevices;
        });
      }
    });

    setTimeout(() => {
      BluetoothManager.stopDeviceScan();
      setIsScanning(false);
    }, 5000); // Stop scanning after 5 seconds
  };

  // Connect to device function
  const connectToDevice = async (deviceId: string) => {
    try {
      const device = await BluetoothManager.connectToDevice(deviceId);
      await device.discoverAllServicesAndCharacteristics();
      setConnectedDevice(device);
      console.log('Connected to device:', device.name);

      // Save connected device in AsyncStorage
      await AsyncStorage.setItem('connectedDeviceId', deviceId);

      device.onDisconnected((error, disconnectedDevice) => {
        console.log(`Device ${disconnectedDevice.id} disconnected, attempting to reconnect...`);
        reconnectToDevice(disconnectedDevice.id);
      });
    } catch (error) {
      console.log('Failed to connect:', error);
      throw error;  // Re-throw the error for loadConnectedDevice to handle it
    }
  };

  // Reconnect function with retry mechanism and error handling
  const reconnectToDevice = async (deviceId: string, retryCount = 3) => {
    for (let attempt = 0; attempt < retryCount; attempt++) {
      try {
        const connectedDevice = await BluetoothManager.isDeviceConnected(deviceId);
        if (connectedDevice) {
          console.log('Device is already connected:', connectedDevice.name);
          return connectedDevice;
        }

        console.log(`Reconnecting to device ${deviceId}...`);
        const device = await BluetoothManager.connectToDevice(deviceId);
        await device.discoverAllServicesAndCharacteristics();
        setConnectedDevice(device);
        console.log('Reconnected to device:', device.name);
        return device;
      } catch (error) {
        console.log(`Failed to reconnect (Attempt ${attempt + 1}):`, error);
      }
    }
    console.log('Reconnection attempts exhausted, clearing stored device info');
    await AsyncStorage.removeItem('connectedDeviceId');  // Clear connection info if reconnection fails
  };

  // Send test message function
  const sendTestMessage = async () => {
    if (connectedDevice) {
      try {
        const isConnected = await connectedDevice.isConnected();

        if (!isConnected) {
          await connectedDevice.connect();
          await connectedDevice.discoverAllServicesAndCharacteristics();
        }

        const serviceUUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';  // UART Service UUID
        const characteristicUUID = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';  // UART TX Characteristic UUID
        const message = 'test_string\n';  // Test message

        // Attempt writing with response
        try {
          await connectedDevice.writeCharacteristicWithResponseForService(
            serviceUUID,
            characteristicUUID,
            Buffer.from(message).toString('base64')
          );
          console.log('Test message sent using writeWithResponse');
        } catch (error) {
          console.log('Failed to send test message using writeWithResponse:', error);
        }
      } catch (error) {
        console.log('Failed to send test message:', error, error?.reason || error);
      }
    }
  };

  // Effect to request permissions and load the connected device on app start
  useEffect(() => {
    requestPermissions();
    loadConnectedDevice();
  }, []);

  return {
    scanForDevices,
    isScanning,
    devices,
    connectedDevice,
    connectToDevice,
    sendTestMessage,
  };
};
