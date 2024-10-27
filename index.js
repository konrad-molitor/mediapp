/**
 * @format
 */
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import './src/PushNotificationConfig'; // Import PushNotificationConfig


AppRegistry.registerComponent(appName, () => App);
