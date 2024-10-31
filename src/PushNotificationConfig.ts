import notifee, {AndroidImportance, AuthorizationStatus} from '@notifee/react-native';

async function requestNotificationPermission() {
  const settings = await notifee.requestPermission();

  if (settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
    console.log('Notification permissions granted.');
  } else {
    console.log('Notification permissions not granted.');
  }
}

// Call this function when your app initializes
requestNotificationPermission();


async function createNotificationChannel() {
  await notifee.createChannel({
    id: 'medication-reminders',
    name: 'Medication Reminders',
    importance: AndroidImportance.HIGH,
  });
}

// Call this function when your app initializes
createNotificationChannel();
