import notifee, {AndroidCategory, AndroidImportance, TimestampTrigger, TriggerType} from '@notifee/react-native';
import {Medication} from './entities/Medication.entity.ts';
import {Pillbox} from './entities/Pillbox.entity.ts';
import {PBCellState} from './entities/PBCell.entity.ts';
import {FullScreenNotificationData} from './components/FullScreenNotification/FullScreenNotification.tsx';
import {translate} from './helpers/translate.ts';


// Function to create the notification channel
export async function createNotificationChannel() {
  await notifee.createChannel({
    id: 'medication-reminders',
    name: 'Medication Reminders',
    importance: AndroidImportance.HIGH,
  });
}

// Function to schedule medication notifications
export async function scheduleMedicationNotifications(
  medications: Medication[],
  pillbox: Pillbox | null
) {
  if (!pillbox) {
    return;
  }

  // Cancel all existing notifications to avoid duplicates
  await notifee.cancelAllNotifications();

  // Get medication IDs assigned to cells in the pillbox that are not yet taken
  const medicationIdsInPillbox = pillbox.cells
    .filter((cell) => cell.medicationId && cell.state !== PBCellState.Taken)
    .map((cell) => cell.medicationId as string);

  const uniqueMedicationIdsInPillbox = Array.from(new Set(medicationIdsInPillbox));

  // Filter medications
  const medicationsToSchedule = medications.filter((med) =>
    uniqueMedicationIdsInPillbox.includes(med.id)
  );

  for (const medication of medicationsToSchedule) {
    // Only schedule times in the future
    const upcomingTimes = medication.times.filter((time) => new Date(time) > new Date());

    for (let index = 0; index < upcomingTimes.length; index++) {
      const time = upcomingTimes[index];
      const notificationId = `medication-${medication.id}-${index}`;

      // Create a timestamp trigger
      const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: new Date(time).getTime(), // Schedule for the medication time
        alarmManager: true, // Ensure the notification fires at the exact time
      };

      const nextAvailablePillboxCell = pillbox.cells.find(
        (cell) =>
          cell.medicationId === medication.id && cell.state === PBCellState.Filled
      );

      const data: FullScreenNotificationData = {
        notificationId,
        medicationName: medication.name,
        medicationId: medication.id,
        snoozeCount: 0,
      };

      // Prepare translated strings
      const [title, body, takeTitle, snoozeTitle] = await Promise.all([
        translate('notificationTitle', {
          medicationName: data.medicationName,
        }),
        translate('notificationBody'),
        translate('take'),
        translate('snooze'),
      ]);

      await notifee.createTriggerNotification(
        {
          id: notificationId,
          title: title,
          body: body,
          android: {
            smallIcon: 'mediapp',
            channelId: 'medication-reminders',
            importance: AndroidImportance.HIGH,
            category: AndroidCategory.ALARM,
            sound: 'default',
            loopSound: true,
            fullScreenAction: {
              id: 'default',
              launchActivity: 'com.mediapp.FullScreenNotificationActivity',
            },
            pressAction: {
              id: 'default',
            },
            actions: [
              {
                title: takeTitle,
                pressAction: { id: 'take' },
              },
              {
                title: snoozeTitle,
                pressAction: { id: 'snooze' },
              },
            ],
          },
          data,
        },
        trigger
      );
    }
  }
}

export const rescheduleMedicationNotification = async (data: FullScreenNotificationData) => {
  const [title, body, takeTitle, snoozeTitle] = await Promise.all([
    translate('notificationTitle', {
      medicationName: data.medicationName,
    }),
    translate('notificationBody'),
    translate('take'),
    translate('snooze'),
  ]);

  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: new Date().getTime() + 1000 * 60 * 5, // 5 minutes from now
    alarmManager: true,
  };

  await notifee.createTriggerNotification(
    {
      id: data.notificationId,
      title: title,
      body: body,
      android: {
        smallIcon: 'mediapp',
        channelId: 'medication-reminders',
        importance: AndroidImportance.HIGH,
        category: AndroidCategory.ALARM,
        sound: 'default',
        loopSound: true,
        fullScreenAction: {
          id: 'default',
          // launchActivity: 'com.mediapp.FullScreenNotificationActivity',
        },
        pressAction: {
          id: 'default',
        },
        actions: [
          {
            title: takeTitle,
            pressAction: { id: 'take' },
          },
          {
            title: snoozeTitle,
            pressAction: { id: 'snooze' },
          },
        ],
      },
      data,
    },
    trigger
  );

  console.log('Notification rescheduled:', JSON.stringify(data), new Date(trigger.timestamp).toLocaleDateString());
};

