import PushNotification from 'react-native-push-notification';
import {Medication} from './entities/Medication.entity.ts';
import {Pillbox} from './entities/Pillbox.entity.ts';
import {PBCellState} from './entities/PBCell.entity.ts';

export const scheduleMedicationNotifications = (
  medications: Medication[],
  pillbox: Pillbox | null
) => {
  // First, cancel all existing notifications to avoid duplicates
  PushNotification.cancelAllLocalNotifications();

  if (!pillbox) {
    console.warn('No pillbox configured, skipping notification scheduling.');
    return;
  }

  // Get medication IDs that are assigned to cells in the pillbox and have at least one cell not taken
  const medicationIdsInPillbox = pillbox.cells
    .filter((cell) => cell.medicationId && cell.state !== PBCellState.Taken)
    .map((cell) => cell.medicationId as string);

  const uniqueMedicationIdsInPillbox = Array.from(new Set(medicationIdsInPillbox));

  // Filter medications
  const medicationsToSchedule = medications.filter((med) =>
    uniqueMedicationIdsInPillbox.includes(med.id)
  );

  medicationsToSchedule.forEach((medication) => {
    // Only schedule times in the future
    const upcomingTimes = medication.times.filter((time) => new Date(time) > new Date());

    upcomingTimes.forEach((time, index) => {
      const notificationId = `${medication.id}-${index}`;

      // Schedule the notification
      PushNotification.localNotificationSchedule({
        // Android-only properties
        channelId: 'medication-reminders',
        id: notificationId,
        autoCancel: false,
        largeIcon: 'ic_launcher', // optional, add an icon in android/app/src/main/res/mipmap
        smallIcon: 'ic_notification', // optional, add an icon in android/app/src/main/res/drawable

        // iOS and Android properties
        title: 'Medication Reminder',
        message: `Time to take your medication: ${medication.name}`,
        date: new Date(time),
        allowWhileIdle: true,
        priority: 'high',
        importance: 'high',
        playSound: true,
        soundName: 'default',
        vibrate: true,
        vibration: 1000,
        actions: ['Take', 'Snooze'],
        userInfo: {
          medicationId: medication.id,
          notificationId: notificationId,
        },
        invokeApp: false, // Prevent the app from opening automatically
        visibility: 'public',
      });
    });
  });
};
