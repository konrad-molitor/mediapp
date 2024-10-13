import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translations } from '../translations.ts';

// Define types for the context and translations
export type Translations = {
  [key: string]: string; // Will hold UI keys and their translated values
};

export type LanguageContextType = {
  language: string;
  switchLanguage: (newLanguage: string) => Promise<void>;
  translations: Translations;
};

// Create the context with a default value
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Define the LanguageProvider component with proper typing
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<string>('en'); // Default to English
  const [currentTranslations, setCurrentTranslations] = useState<Translations>(translations['en']);

  // Load language from AsyncStorage when the app starts
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('appLanguage');
        if (savedLanguage && translations[savedLanguage]) {
          setLanguage(savedLanguage);
          setCurrentTranslations(translations[savedLanguage]);
        } else {
          // Fallback to English if saved language is not found or invalid
          setLanguage('en');
          setCurrentTranslations(translations['en']);
        }
      } catch (error) {
        console.error('Failed to load language from storage, falling back to English', error);
        setLanguage('en');
        setCurrentTranslations(translations['en']); // Fallback to English on error
      }
    };
    loadLanguage();
  }, []);

  // Function to switch language and save it to AsyncStorage
  const switchLanguage = async (newLanguage: string) => {
    if (translations[newLanguage]) {
      setLanguage(newLanguage);
      setCurrentTranslations(translations[newLanguage]);
      try {
        await AsyncStorage.setItem('appLanguage', newLanguage);
      } catch (error) {
        console.error('Failed to save language to storage', error);
      }
    } else {
      console.warn(`Language "${newLanguage}" not available, falling back to English`);
      setLanguage('en');
      setCurrentTranslations(translations['en']);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, switchLanguage, translations: currentTranslations }}>
      {children}
    </LanguageContext.Provider>
  );
};
