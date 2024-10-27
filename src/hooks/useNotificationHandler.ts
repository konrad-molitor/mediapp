import { useEffect, useContext } from 'react';
import PushNotification from 'react-native-push-notification';
import { PillboxContext } from '../context/PillboxContext';
import { MedicationContext } from '../context/MedicationContext';
import {PBCell, PBCellState} from '../entities/PBCell.entity';
import { sendMessageToMicrobit } from '../BluetoothService';
import {Pillbox} from '../entities/Pillbox.entity.ts'; // You'll need to implement this

export const useNotificationHandler = () => {
  const { pillbox, setPillbox } = useContext(PillboxContext);
  const { medications } = useContext(MedicationContext);

  useEffect(() => {
    // Configure PushNotification to handle actions
    PushNotification.configure({
      onNotification: function (notification) {
        console.log('Notification received:', notification);

        // Process the notification action
        handleNotificationAction(notification);
      },
      // ... other configurations
    });
  }, [pillbox, medications]);

  const handleNotificationAction = (notification: any) => {
    const action = notification.action;
    const medicationId = notification.userInfo?.medicationId;
    const notificationId = notification.userInfo?.notificationId;

    if (!medicationId) {
      console.warn('Medication ID not found in notification userInfo');
      return;
    }

    if (action === 'Take') {
      handleMedicationTaken(medicationId);
    } else if (action === 'Snooze') {
      handleMedicationSnooze(medicationId, notificationId);
    } else {
      // Default action
    }
  };

  const handleMedicationTaken = (medicationId: string) => {
    if (pillbox) {
      // Update cell states
      const updatedCells = pillbox.cells.map((cell) => {
        if (cell.medicationId === medicationId && cell.state !== PBCellState.Taken) {
          return new PBCell(
            cell.position.row,
            cell.position.col,
            cell.id,
            cell.medicationId,
            PBCellState.Taken
          );
        } else {
          return cell;
        }
      });

      const updatedPillbox = new Pillbox(
        pillbox.rows,
        pillbox.cols,
        updatedCells,
        pillbox.createdAt,
        new Date()
      );

      setPillbox(updatedPillbox);
    }

    // Cancel the notification
    PushNotification.cancelLocalNotifications({ id: medicationId });

    // Send confirmation to micro:bit
    sendMessageToMicrobit(`TAKEN:${medicationId}`);
  };

  const handleMedicationSnooze = (medicationId: string, notificationId: string) => {
    // Implement snooze logic (e.g., manage snooze counts)
    // Reschedule the notification after 5 minutes
    PushNotification.localNotificationSchedule({
      id: notificationId,
      message: `Reminder to take your medication: ${getMedicationName(medicationId)}`,
      date: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes later
      channelId: 'medication-reminders',
      // ... other options
    });

    // Optionally, send snooze command to micro:bit
    sendMessageToMicrobit(`SNOOZE:${medicationId}`);
  };

  const getMedicationName = (medicationId: string): string => {
    const medication = medications.find((med) => med.id === medicationId);
    return medication ? medication.name : 'Medication';
  };
};
