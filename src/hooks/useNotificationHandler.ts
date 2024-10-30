import {useContext, useEffect} from 'react';
import notifee, {EventType} from '@notifee/react-native';
import {PillboxContext} from '../context/PillboxContext.tsx';
import {MedicationContext} from '../context/MedicationContext.tsx';
import {FullScreenNotificationData} from '../components/FullScreenNotification/FullScreenNotification.tsx';
import {NativeModules} from 'react-native';
import {PBCellState} from '../entities/PBCell.entity.ts';
import {rescheduleMedicationNotification} from '../NotificationService.ts';
const {FullScreenModule} = NativeModules;

export const useNotificationHandler = () => {
  const {pillbox, setPillbox} = useContext(PillboxContext);
  const {medications, setMedications} = useContext(MedicationContext);

  useEffect(() => {
    const unsubscribe = notifee.onForegroundEvent(async ({type, detail}) => {
      if (type === EventType.ACTION_PRESS) {
        const {pressAction, notification} = detail;
        const notificationId = notification?.id;
        const data = notification?.data as FullScreenNotificationData;

        if (!data || !notificationId || !pressAction) {
          return;
        }

        if (pressAction.id === 'take') {
          await handleMedicationTaken(data);
          await notifee.cancelNotification(notificationId);
        } else if (pressAction.id === 'snooze') {
          await handleMedicationSnooze(data);
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [pillbox, medications]);

  const handleMedicationTaken = async (data: FullScreenNotificationData) => {
    if (data && pillbox) {
      pillbox.markCellAs(data.medicationId, PBCellState.Taken);
      setPillbox(pillbox); // Trigger re-render if necessary

      FullScreenModule.closeFullScreenNotification();

    } else {
      console.warn('Notification data or Pillbox context is missing.');
    }
  };

  // Handle "Snooze" action
  const handleMedicationSnooze = async (data: FullScreenNotificationData) => {
    if (data && pillbox) {
      const {snoozeCount, medicationId} = data;

      if (snoozeCount >= 2) {
        pillbox.markCellAs(medicationId, PBCellState.Overdue);
        setPillbox(pillbox);
      } else {
        // Increment snoozeCount and reschedule the notification
        const updatedData: FullScreenNotificationData = {
          ...data,
          snoozeCount: snoozeCount + 1,
        };

        await rescheduleMedicationNotification(updatedData);
      }

      await notifee.cancelNotification(data.notificationId);

      FullScreenModule.closeFullScreenNotification();
    } else {
      console.warn('Notification data or Pillbox context is missing.');
    }
  };
};
