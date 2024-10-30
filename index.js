import { AppRegistry, NativeModules } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import fullScreenNotification from './src/components/FullScreenNotification/FullScreenNotification';
import notifee, {EventType} from '@notifee/react-native';
import FullScreenNotification from './src/components/FullScreenNotification/FullScreenNotification';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { FullScreenModule } = NativeModules;

// Register the main app component
AppRegistry.registerComponent(appName, () => App);

// Register the full-screen notification component
AppRegistry.registerComponent(fullScreenNotification.name, () => FullScreenNotification);

// Handle background events
notifee.onBackgroundEvent(async ({ type, detail }) => {
  console.log('background event', type, detail);

  if (type === EventType.DELIVERED) {
    const { notification } = detail;

    await AsyncStorage.setItem('notificationData', JSON.stringify(notification.data));


    // if (notification.data) {
    //   console.log('native module run');
    //
    //   FullScreenModule.launchFullScreenNotification();
    // }
  }
});
