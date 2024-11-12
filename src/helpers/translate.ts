// translate.ts
import { translations } from '../translations';
import AsyncStorage from '@react-native-async-storage/async-storage';


const getCurrentLanguage = async (): Promise<'en' | 'es' | 'ru' | 'pt'> => {
  const lang = await AsyncStorage.getItem('appLanguage') as 'en' | 'es' | 'ru' | 'pt';

  return lang || 'en';
};

/**
 * Translates a key into the current language, replacing placeholders with provided data.
 *
 * @param key - The translation key.
 * @param placeholders - An object containing placeholder keys and their replacement values.
 * @returns The translated and formatted string.
 */
export const translate = async (
  key: keyof typeof translations['en'],
  placeholders?: { [key: string]: string | number }
): Promise<string> => {
  const language = await getCurrentLanguage();
  let translation = translations[language][key] || '';

  if (placeholders) {
    Object.keys(placeholders).forEach((placeholder) => {
      const regex = new RegExp(`{${placeholder}}`, 'g');
      translation = translation.replace(regex, String(placeholders[placeholder]));
    });
  }

  return translation;
};
