import { useEffect } from 'react';
import { Medication } from '../entities/Medication.entity';
import { Pillbox } from '../entities/Pillbox.entity';
import {scheduleMedicationNotifications} from '../NotificationService.ts';


export const useNotificationScheduler = (
  medications: Medication[],
  pillbox: Pillbox | null
) => {
  useEffect(() => {
    if (pillbox) {
      scheduleMedicationNotifications(medications, pillbox);
    } else {
    }
  }, [medications, pillbox]);
};
