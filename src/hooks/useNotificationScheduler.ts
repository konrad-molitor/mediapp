import { useEffect } from 'react';
import { Medication } from '../entities/Medication.entity';
import { Pillbox } from '../entities/Pillbox.entity';
import { scheduleMedicationNotifications } from '../NotificationService';

export const useNotificationScheduler = (
  medications: Medication[],
  pillbox: Pillbox | null
) => {
  useEffect(() => {
    scheduleMedicationNotifications(medications, pillbox);
  }, [medications, pillbox]);
};
