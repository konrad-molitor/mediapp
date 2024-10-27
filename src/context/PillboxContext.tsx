import React, { createContext, useState, useEffect } from 'react';
import { Pillbox } from '../entities/Pillbox.entity';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PillboxContextProps {
  pillbox: Pillbox | null;
  setPillbox: React.Dispatch<React.SetStateAction<Pillbox | null>>;
}

export const PillboxContext = createContext<PillboxContextProps>({
  pillbox: null,
  setPillbox: () => {},
});

export const PillboxProvider: React.FC = ({ children }) => {
  const [pillbox, setPillbox] = useState<Pillbox | null>(null);

  useEffect(() => {
    // Load pillbox from AsyncStorage when the app starts
    const loadPillbox = async () => {
      try {
        const savedPillbox = await AsyncStorage.getItem('pillbox');
        if (savedPillbox) {
          const pillboxData = JSON.parse(savedPillbox);
          // Deserialize dates and other necessary fields
          const loadedPillbox = Pillbox.fromJSON(pillboxData);
          setPillbox(loadedPillbox);
        }
      } catch (error) {
        console.error('Failed to load pillbox from storage:', error);
      }
    };

    loadPillbox();
  }, []);

  useEffect(() => {
    // Save pillbox to AsyncStorage whenever it changes
    const savePillboxToStorage = async () => {
      try {
        if (pillbox) {
          const pillboxData = pillbox.toJSON();
          await AsyncStorage.setItem('pillbox', JSON.stringify(pillboxData));
        }
      } catch (error) {
        console.error('Failed to save pillbox to storage:', error);
      }
    };

    savePillboxToStorage();
  }, [pillbox]);

  return (
    <PillboxContext.Provider value={{ pillbox, setPillbox }}>
      {children}
    </PillboxContext.Provider>
  );
};
