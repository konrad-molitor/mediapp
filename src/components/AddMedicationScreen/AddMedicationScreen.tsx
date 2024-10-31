// src/components/AddMedicationScreen.tsx

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  Platform,
} from 'react-native';
import { styles } from './AddMedicationScreenStyles';
import {
  Medication,
  MedicationTimeType,
} from '../../entities/Medication.entity';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus, faMinus, faTrash } from '@fortawesome/free-solid-svg-icons';
import RadioButton from '../RadioButton/RadioButton'; // Adjust the path as needed
import { useLanguage } from '../../context/LanguageContext';

interface AddMedicationScreenProps {
  visible: boolean;
  onClose: () => void;
  onSave: (medication: Medication) => void;
  medication?: Medication | null;
}

export default function AddMedicationScreen({
                                              visible,
                                              onClose,
                                              onSave,
                                              medication,
                                            }: AddMedicationScreenProps) {
  const [name, setName] = useState('');
  const [timeType, setTimeType] = useState<MedicationTimeType>(
    MedicationTimeType.ByTime
  );
  const [byTimeTimes, setByTimeTimes] = useState<Date[]>([]);
  const [everyNDaysTimes, setEveryNDaysTimes] = useState<Date[]>([]);
  const [interval, setInterval] = useState<number>(1);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [currentPickerMode, setCurrentPickerMode] = useState<
    'date' | 'time' | 'datetime'
  >('date');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { language, translations } = useLanguage();

  // Refs for double-tap detection
  const lastTapRef = useRef<number>(0);
  const DOUBLE_TAP_DELAY = 300; // milliseconds

  useEffect(() => {
    if (visible) {
      if (medication) {
        // Editing an existing medication
        setName(medication.name);
        setTimeType(medication.timeType);
        if (medication.timeType === MedicationTimeType.ByTime) {
          setByTimeTimes(medication.times.map((time) => new Date(time)));
          setEveryNDaysTimes([]);
        } else {
          setEveryNDaysTimes(medication.times.map((time) => new Date(time)));
          setByTimeTimes([]);
        }
        setInterval(medication.interval || 1);
      } else {
        // Adding a new medication
        setName('');
        setTimeType(MedicationTimeType.ByTime);
        setByTimeTimes([]);
        setEveryNDaysTimes([]);
        setInterval(1);
      }
    }
  }, [visible, medication]);

  const handleAddTime = (event, date) => {
    if (event.type === 'set' && date) {
      if (timeType === MedicationTimeType.ByTime) {
        if (Platform.OS === 'android') {
          if (currentPickerMode === 'date') {
            // Date selected, now show time picker
            setSelectedDate(date);
            setCurrentPickerMode('time');
            setShowDatePicker(true);
          } else if (currentPickerMode === 'time') {
            // Time selected, combine with date
            const combinedDate = new Date(
              selectedDate.getFullYear(),
              selectedDate.getMonth(),
              selectedDate.getDate(),
              date.getHours(),
              date.getMinutes(),
              0,
              0
            );
            setByTimeTimes([...byTimeTimes, combinedDate]);
            setShowDatePicker(false);
            setCurrentPickerMode('date'); // Reset to date for next time
          }
        } else {
          // iOS, date and time selected together
          setByTimeTimes([...byTimeTimes, date]);
          setShowDatePicker(false);
        }
      } else {
        // Every N Days mode, time picker
        setEveryNDaysTimes([...everyNDaysTimes, date]);
        setShowDatePicker(false);
      }
    } else {
      // User dismissed the picker
      setShowDatePicker(false);
      setCurrentPickerMode('date'); // Reset mode in case of dismissal
    }
  };

  const handleRemoveTime = (index: number) => {
    if (timeType === MedicationTimeType.ByTime) {
      setByTimeTimes(byTimeTimes.filter((_, i) => i !== index));
    } else {
      setEveryNDaysTimes(everyNDaysTimes.filter((_, i) => i !== index));
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert(translations.validationError, translations.enterMedicationName);
      return;
    }
    const timesToSave =
      timeType === MedicationTimeType.ByTime ? byTimeTimes : everyNDaysTimes;

    if (timesToSave.length === 0) {
      Alert.alert(translations.validationError, translations.addAtLeastOneTime);
      return;
    }

    const newMedication: Medication = {
      id: medication?.id || `${Date.now()}`,
      name,
      timeType,
      times: timesToSave,
      interval:
        timeType === MedicationTimeType.EveryNDays ? interval : undefined,
      createdAt: medication?.createdAt || new Date(),
    };
    onSave(newMedication);
  };

  const handleTimeTypeChange = (newType: MedicationTimeType) => {
    if (timeType !== newType) {
      setTimeType(newType);
    }
  };

  const timesToDisplay =
    timeType === MedicationTimeType.ByTime ? byTimeTimes : everyNDaysTimes;

  // Double-tap handler
  const handleTimesDoubleTap = () => {
    const now = Date.now();
    const lastTap = lastTapRef.current;

    if (now - lastTap < DOUBLE_TAP_DELAY) {
      // Double-tap detected
      addTwoTestTimes();
      lastTapRef.current = 0; // Reset lastTap
    } else {
      lastTapRef.current = now;
    }
  };

  const addTwoTestTimes = () => {
    const now = new Date();
    const firstTime = new Date(now.getTime() + 1 * 30 * 1000); // +0.5 minute
    const secondTime = new Date(now.getTime() + 1 * 60 * 1000); // 1 minutes

    if (timeType === MedicationTimeType.ByTime) {
      setByTimeTimes([...byTimeTimes, firstTime, secondTime]);
      console.log('Added two test times to ByTime:', firstTime, secondTime);
    } else {
      setEveryNDaysTimes([...everyNDaysTimes, firstTime, secondTime]);
      console.log('Added two test times to EveryNDays:', firstTime, secondTime);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.modalTitle}>{translations.addEditMedication}</Text>
            <TextInput
              style={styles.medicationNameInput}
              placeholder={translations.medicationName}
              value={name}
              onChangeText={setName}
            />
            <View style={styles.timeTypeContainer}>
              <RadioButton
                label={translations.byTime}
                selected={timeType === MedicationTimeType.ByTime}
                onPress={() => handleTimeTypeChange(MedicationTimeType.ByTime)}
              />
              <RadioButton
                label={translations.everyNDays}
                selected={timeType === MedicationTimeType.EveryNDays}
                onPress={() =>
                  handleTimeTypeChange(MedicationTimeType.EveryNDays)
                }
              />
            </View>

            {timeType === MedicationTimeType.EveryNDays && (
              <View style={styles.everyNDaysContainer}>
                <Text style={styles.sectionTitle}>{translations.intervalDays}</Text>
                <View style={styles.intervalInputContainer}>
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => setInterval(Math.max(1, interval - 1))}
                  >
                    <FontAwesomeIcon icon={faMinus} size={16} color="#fff" />
                  </TouchableOpacity>
                  <TextInput
                    style={styles.intervalInput}
                    keyboardType="numeric"
                    value={interval.toString()}
                    onChangeText={(text) => {
                      const num = parseInt(text, 10);
                      if (!isNaN(num)) {
                        setInterval(Math.max(1, Math.min(7, num)));
                      } else {
                        setInterval(1);
                      }
                    }}
                  />
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => setInterval(Math.min(7, interval + 1))}
                  >
                    <FontAwesomeIcon icon={faPlus} size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Modified Times Section with Double-Tap Detection */}
            <TouchableOpacity
              activeOpacity={1}
              onPress={handleTimesDoubleTap}
              style={styles.timesContainer}
            >
              <Text style={styles.sectionTitle}>{translations.times}</Text>
              {timesToDisplay.map((time, index) => (
                <View key={index} style={styles.timeItem}>
                  <Text style={styles.timeText}>
                    {timeType === MedicationTimeType.ByTime
                      ? time.toLocaleString(language)
                      : time.toLocaleTimeString(language)}
                  </Text>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveTime(index)}
                  >
                    <FontAwesomeIcon icon={faTrash} size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
            </TouchableOpacity>
          </ScrollView>

          {/* Add Time Button */}
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              if (timeType === MedicationTimeType.ByTime) {
                if (Platform.OS === 'android') {
                  setCurrentPickerMode('date');
                } else {
                  setCurrentPickerMode('datetime');
                }
              } else {
                setCurrentPickerMode('time');
              }
              setShowDatePicker(true);
            }}
          >
            <FontAwesomeIcon icon={faPlus} size={16} color="#fff" />
            <Text style={styles.addButtonText}>{translations.addTime}</Text>
          </TouchableOpacity>

          {/* Save/Cancel Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.buttonText}>{translations.save}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>{translations.cancel}</Text>
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={currentPickerMode === 'date' ? selectedDate : new Date()}
              mode={currentPickerMode}
              display="default"
              onChange={handleAddTime}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}
