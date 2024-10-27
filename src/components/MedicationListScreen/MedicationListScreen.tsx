import React, {useState, useContext, useEffect} from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { styles } from './MedicationListScreenStyles';
import { Medication } from '../../entities/Medication.entity';
import { MedicationContext } from '../../context/MedicationContext';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faPlus,
  faTrash,
  faEdit,
  faChevronDown,
  faChevronUp,
} from '@fortawesome/free-solid-svg-icons';
import AddMedicationScreen from '../AddMedicationScreen/AddMedicationScreen';
import { useLanguage } from '../../context/LanguageContext';

export function MedicationListScreen({ navigation }) {
  const { medications, setMedications } = useContext(MedicationContext);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [medicationToEdit, setMedicationToEdit] = useState<Medication | null>(null);

  const { language, translations } = useLanguage(); // Get current language and translations

  useEffect(() => {
    navigation.setOptions({
      title: translations.medicationManagement,
    });
  }, [navigation, translations]);

  const handleAddMedication = () => {
    setMedicationToEdit(null);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const toggleExpandCard = (medicationId: string) => {
    setExpandedCard(expandedCard === medicationId ? null : medicationId);
  };

  const handleEditMedication = (medicationId: string) => {
    const med = medications.find((m) => m.id === medicationId);
    if (med) {
      setMedicationToEdit(med);
      setIsModalVisible(true);
    }
  };

  const handleRemoveMedication = (medicationId: string) => {
    setMedications((prevMedications) =>
      prevMedications.filter((med) => med.id !== medicationId)
    );
  };

  const renderTimes = (medication: Medication) => {
    return medication.times.map((time, index) => (
      <Text key={index} style={styles.medicationTime}>
        {medication.timeType === 'By Time'
          ? `${translations.onceAt} ${new Date(time).toLocaleString(language)}`
          : `${translations.everyNDaysAt
            .replace('{interval}', medication.interval?.toString() || '')
          } ${new Date(time).toLocaleTimeString(language)}`}
      </Text>
    ));
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {medications
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
          .map((medication) => (
            <View key={medication.id} style={styles.card}>
              <TouchableOpacity
                onPress={() => toggleExpandCard(medication.id)}
                style={styles.cardHeader}
              >
                <Text style={styles.medicationName}>{medication.name}</Text>
                <FontAwesomeIcon
                  icon={expandedCard === medication.id ? faChevronUp : faChevronDown}
                  size={20}
                  color="#fff"
                />
              </TouchableOpacity>
              {/* Display times at all times */}
              <View style={styles.cardContent}>
                {renderTimes(medication)}
                {expandedCard === medication.id && (
                  <View style={styles.actionButtonsContainer}>
                    <TouchableOpacity
                      style={styles.fullWidthButton}
                      onPress={() => handleEditMedication(medication.id)}
                    >
                      <FontAwesomeIcon icon={faEdit} size={16} color="#fff" />
                      <Text style={styles.buttonText}>{translations.edit}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.fullWidthButton, styles.deleteButton]}
                      onPress={() => handleRemoveMedication(medication.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} size={16} color="#fff" />
                      <Text style={styles.buttonText}>{translations.remove}</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          ))}
      </ScrollView>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.addButton} onPress={handleAddMedication}>
          <FontAwesomeIcon icon={faPlus} size={20} color="#fff" />
          <Text style={styles.buttonText}>{translations.addMedication}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <FontAwesomeIcon icon={faTrash} size={20} color="#fff" />
          <Text style={styles.buttonText}>{translations.cancel}</Text>
        </TouchableOpacity>
      </View>
      <AddMedicationScreen
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSave={(medication: Medication) => {
          setMedications((prevMedications) => {
            const index = prevMedications.findIndex((m) => m.id === medication.id);
            if (index !== -1) {
              const updatedMedications = [...prevMedications];
              updatedMedications[index] = medication;
              return updatedMedications;
            } else {
              return [...prevMedications, medication];
            }
          });
          setIsModalVisible(false);
        }}
        medication={medicationToEdit}
      />
    </View>
  );
}

export const MedicationListScreenName = 'MedicationListScreen';
