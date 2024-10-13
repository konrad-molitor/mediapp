import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const PillboxContext = createContext();

export const PillboxProvider = ({ children }) => {
  const [pillbox, setPillbox] = useState(null);

  // Load pillbox from AsyncStorage on app startup
  useEffect(() => {
    const loadPillbox = async () => {
      try {
        const savedPillbox = await AsyncStorage.getItem('pillbox');
        if (savedPillbox) {
          setPillbox(JSON.parse(savedPillbox));
        }
      } catch (error) {
        console.error('Failed to load pillbox from storage:', error);
      }
    };

    loadPillbox();
  }, []);

  // Save pillbox to AsyncStorage whenever it's updated
  const savePillbox = async (newPillbox) => {
    try {
      setPillbox(newPillbox);
      await AsyncStorage.setItem('pillbox', JSON.stringify(newPillbox));
    } catch (error) {
      console.error('Failed to save pillbox to storage:', error);
    }
  };

  return (
    <PillboxContext.Provider value={{ pillbox, setPillbox, savePillbox }}>
      {children}
    </PillboxContext.Provider>
  );
};
