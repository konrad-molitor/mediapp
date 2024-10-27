import { useBluetooth } from './BluetoothManager';

export const sendMessageToMicrobit = async (message: string) => {
  const { connectedDevice } = useBluetooth(); // Adjust according to your Bluetooth implementation

  if (connectedDevice) {
    try {
      const serviceUUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e'; // UART Service UUID
      const characteristicUUID = '6e400002-b5a3-f393-e0a9-e50e24dcca9e'; // UART RX Characteristic UUID

      await connectedDevice.writeCharacteristicWithResponseForService(
        serviceUUID,
        characteristicUUID,
        Buffer.from(message + '\n').toString('base64')
      );

      console.log('Message sent to micro:bit:', message);
    } catch (error) {
      console.log('Failed to send message to micro:bit:', error);
    }
  }
};
