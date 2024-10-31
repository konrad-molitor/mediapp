import BackgroundService from 'react-native-background-actions';
import EventEmitter from 'react-native/Libraries/vendor/emitter/EventEmitter';
import {BleManager, Device} from 'react-native-ble-plx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Buffer} from 'buffer';
import debounce from 'lodash/debounce';

export let bleManager = new BleManager();

export const SERVICE_ACTIONS = {
  INIT: 'init',
  START: 'start',
  STOP: 'stop',
  SEND_MESSAGE: 'send_message',
  SCAN_DEVICES: 'scan_devices',
  REQUEST_PERMISSIONS: 'request_permissions',
  LOAD_CONNECTED_DEVICE: 'load_connected_device',
  SEND_TEST_MESSAGE: 'send_test_message',
};

const serviceUUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';  // UART Service UUID
const characteristicUUIDTX = '6e400003-b5a3-f393-e0a9-e50e24dcca9e'; // UART TX Characteristic UUID
const characteristicUUIDRX = '6e400002-b5a3-f393-e0a9-e50e24dcca9e'; // UART RX Characteristic UUID

export const SERVICE_EVENTS = {
  TEST: 'test',
  MESSAGE: 'message',
  RESPONSE: 'response',
  // actual events
  SCAN_DEVICES: 'scan_devices',
  SCAN_STARTED: 'scan_started',
  SCAN_STOPPED: 'scan_stopped',
  DEVICES_LIST_UPDATED: 'devices_list_updated',
  CONNECT_TO_DEVICE: 'connect_to_device',
  UPDATE_CONNECTED_DEVICE: 'update_connected_device',
  SEND_TEST_MESSAGE: 'send_test_message',
  SEND_MESSAGE: 'send_message',
  MICROBIT_A_BUTTON: 'microbit_a_button',
  MICROBIT_B_BUTTON: 'microbit_b_button',
  STOP_NOTIFICATION: 'stop_notification',
};

export const btEvents = new EventEmitter();
let connectedDevice: Device | null = null;

export const getConnectedDevice = () => connectedDevice;

btEvents.addListener(SERVICE_EVENTS.TEST, (data) => {
  console.log('Test event:', data);
  btEvents.emit(SERVICE_EVENTS.RESPONSE, 'Test response' + data);
});

btEvents.addListener(SERVICE_EVENTS.SCAN_DEVICES, async () => {
  console.log('Scanning for devices in background service...');
  btEvents.emit(SERVICE_EVENTS.SCAN_STARTED);
  bleManager.destroy();
  bleManager = new BleManager();
  const devices: Device[] = [];
  bleManager.startDeviceScan(null, null, (error, device) => {
    console.log('Scanning for devices started...');
    if (error) {
      console.log('Error during scanning:', error);
      btEvents.emit(SERVICE_EVENTS.SCAN_STOPPED);
      return;
    }

    if (device && device.name && !devices.some(d => d.id === device.id)) {
      console.log(`Detected device: ${device.name}`);
      devices.push(device);
      btEvents.emit(SERVICE_EVENTS.DEVICES_LIST_UPDATED, devices);
    }

    setTimeout(() => {
      console.log('Stopping device scan...');
      bleManager.stopDeviceScan();
      btEvents.emit(SERVICE_EVENTS.SCAN_STOPPED);
    }, 5000);
  });
});

btEvents.addListener(SERVICE_EVENTS.CONNECT_TO_DEVICE, async (deviceId: string) => {
  console.log('Connecting to device:', deviceId);
  try {
    const device = await bleManager.connectToDevice(deviceId);
    await device.discoverAllServicesAndCharacteristics();
    connectedDevice = device;
    btEvents.emit(SERVICE_EVENTS.UPDATE_CONNECTED_DEVICE);
    console.log('Connected to device:', device.name);

    await AsyncStorage.setItem('connectedDeviceId', deviceId);
    await monitorMicrobit(device);

    device.onDisconnected((error, disconnectedDevice) => {
      connectedDevice = null;
      btEvents.emit(SERVICE_EVENTS.UPDATE_CONNECTED_DEVICE);
      console.log(`Device ${disconnectedDevice.id} disconnected`);
    });
  } catch (error) {
    console.log('Failed to connect:', error);
    throw error;
  }
});

btEvents.addListener(SERVICE_EVENTS.SEND_TEST_MESSAGE, async () => {
  if (!connectedDevice) {
    console.warn('No connected device to send test message.');
    return;
  }

  console.log('Sending test message to connected device:', connectedDevice.name);

  try {
    await connectedDevice.writeCharacteristicWithResponseForService(
      serviceUUID,
      characteristicUUIDTX,
      Buffer.from('test_string\n').toString('base64')
    );

    console.log('Test message sent to connected device:', connectedDevice.name);
  } catch (error) {
    console.log('Failed to send test message:', error, error?.reason || error);
  }
});

btEvents.addListener(SERVICE_EVENTS.SEND_MESSAGE, async (message: string) => {
  if (!connectedDevice) {
    console.warn('No connected device to send message.');
    return;
  }

  console.log('Sending message to connected device:', connectedDevice.name);

  try {
    await connectedDevice.writeCharacteristicWithResponseForService(
      serviceUUID,
      characteristicUUIDTX,
      Buffer.from(message + '\n').toString('base64')
    );

    console.log('Message sent to connected device:', connectedDevice.name);
  } catch (error) {
    console.log('Failed to send message:', error, error?.reason || error);
  }
});

btEvents.addListener(SERVICE_EVENTS.STOP_NOTIFICATION, async () => {
  // send to micro:bit to stop notification
  btEvents.emit(SERVICE_EVENTS.SEND_MESSAGE, 'stop');
});

// Debounced functions for handling A and B button presses
const handleAButtonPress = debounce(() => {
  console.log('A button pressed (debounced)');
  btEvents.emit(SERVICE_EVENTS.MICROBIT_A_BUTTON);
}, 300); // 300ms debounce interval

const handleBButtonPress = debounce(() => {
  console.log('B button pressed (debounced)');
  btEvents.emit(SERVICE_EVENTS.MICROBIT_B_BUTTON);
}, 300); // 300ms debounce interval

export const monitorMicrobit = async (device) => {
  console.log('Monitoring micro:bit:', device.name);

  device.monitorCharacteristicForService(
    serviceUUID,
    characteristicUUIDRX,
    (error, characteristic) => {
      if (error) {
        console.log('Error monitoring characteristic RX:', error);
        return;
      }

      if (characteristic) {
        const data = Buffer.from(characteristic.value, 'base64').toString();
        console.log('Received data:', data);

        if (data === 'A') {
          handleAButtonPress(); // Debounced A button press
        }
        if (data === 'B') {
          handleBButtonPress(); // Debounced B button press
        }
      }
    }
  );
};

const bluetoothTask = async (task) => {
  console.log('Bluetooth task:', task);
  const {action, payload} = task;

  switch (action) {
    case SERVICE_ACTIONS.INIT:
      const deviceId = await AsyncStorage.getItem('connectedDeviceId');
      if (deviceId) {
        try {
          connectedDevice = await bleManager.connectToDevice(deviceId);
          await connectedDevice.discoverAllServicesAndCharacteristics();
          console.log('Connected to device:', connectedDevice.name);
          btEvents.emit(SERVICE_EVENTS.UPDATE_CONNECTED_DEVICE);
          await monitorMicrobit(connectedDevice);
          connectedDevice.onDisconnected((error, disconnectedDevice) => {
            connectedDevice = null;
            btEvents.emit(SERVICE_EVENTS.UPDATE_CONNECTED_DEVICE);
            console.log(`Device ${disconnectedDevice.id} disconnected`);
          });
        } catch (error) {
          await AsyncStorage.removeItem('connectedDeviceId');
          console.log('Failed to connect to device:', error);
        }
      }
      break;
    default:
      console.warn('Invalid action:', action);

      await new Promise((resolve) => setTimeout(resolve, 1000));
  }
};

export const startBackgroundService = async () => {
  if (BackgroundService.isRunning()) {
    console.log('Background service is already running.');
    return;
  }

  const options = {
    taskName: 'MediApp Service',
    taskTitle: 'MediApp Service',
    taskDesc: 'MediApp Service is running...',
    taskIcon: {
      name: 'mediapp',
      type: 'mipmap',
    },
    parameters: {
      action: SERVICE_ACTIONS.INIT,
    },
  };

  await BackgroundService.start(bluetoothTask, options);
};
