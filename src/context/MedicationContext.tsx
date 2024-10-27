import React, { createContext, useState, useEffect } from 'react';
import { Medication } from '../entities/Medication.entity';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface MedicationContextProps {
  medications: Medication[];
  setMedications: React.Dispatch<React.SetStateAction<Medication[]>>;
}

export const MedicationContext = createContext<MedicationContextProps>({
  medications: [],
  setMedications: () => {},
});

export const MedicationProvider: React.FC = ({ children }) => {
  const [medications, setMedications] = useState<Medication[]>([]);

  useEffect(() => {
    const loadMedications = async () => {
      try {
        const medicationsData = await AsyncStorage.getItem('medications');
        if (medicationsData) {
          const medicationsArray = JSON.parse(medicationsData);
          const medicationsWithDates = medicationsArray.map((medication) => ({
            ...medication,
            times: medication.times.map((time) => new Date(time)),
            createdAt: new Date(medication.createdAt),
          }));
          setMedications(medicationsWithDates);
        }
      } catch (error) {
        console.error('Failed to load medications:', error);
      }
    };

    loadMedications();
  }, []);

  useEffect(() => {
    const saveMedications = async () => {
      try {
        const medicationsToSave = medications.map((medication) => ({
          ...medication,
          times: medication.times.map((time) => time.toISOString()),
          createdAt: medication.createdAt.toISOString(),
        }));
        await AsyncStorage.setItem('medications', JSON.stringify(medicationsToSave));
      } catch (error) {
        console.error('Failed to save medications:', error);
      }
    };

    saveMedications();
  }, [medications]);

  return (
    <MedicationContext.Provider value={{ medications, setMedications }}>
      {children}
    </MedicationContext.Provider>
  );
};
