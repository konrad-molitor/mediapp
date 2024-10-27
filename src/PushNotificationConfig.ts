import PushNotification from 'react-native-push-notification';
import { Platform } from 'react-native';

// Configure PushNotification
PushNotification.configure({
  popInitialNotification: true,

  requestPermissions: Platform.OS === 'ios',
});

// Create notification channels for Android
PushNotification.createChannel(
  {
    channelId: 'medication-reminders', // (required)
    channelName: 'Medication Reminders', // (required)
    channelDescription: 'A channel for medication reminder notifications',
    importance: 4, // High importance
    vibrate: true,
  },
  (created) => console.log(`Notification channel '${created ? 'created' : 'exists'}`) // (optional) callback
);
