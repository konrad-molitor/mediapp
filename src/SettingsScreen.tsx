import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLanguage } from './LanguageContext';
import { Picker } from '@react-native-picker/picker'; // Using Picker for the dropdown
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'; // Icon for back button

const SettingsScreen = ({ navigation }) => {
  const { switchLanguage, translations } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState('en'); // Default to English

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    switchLanguage(language);
  };

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FontAwesomeIcon icon={faArrowLeft} size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{translations.settings}</Text>
      </View>

      {/* Language Selector */}
      <Text style={styles.label}>{translations.settings}</Text>
      <Picker
        selectedValue={selectedLanguage}
        style={styles.picker}
        onValueChange={(itemValue) => handleLanguageChange(itemValue)}
      >
        <Picker.Item label="English" value="en" />
        <Picker.Item label="Español" value="es" />
        <Picker.Item label="Русский" value="ru" />
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#001f3f', // Navy blue background to match app theme
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 15,
    padding: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff', // White text for title
  },
  label: {
    fontSize: 18,
    color: '#fff', // White text
    marginBottom: 10,
  },
  picker: {
    backgroundColor: '#fff',
    borderRadius: 5,
    height: 50,
    marginBottom: 20,
  },
});

export default SettingsScreen;
