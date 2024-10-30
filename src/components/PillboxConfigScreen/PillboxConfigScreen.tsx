import React, { useEffect, useState, useContext } from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { styles } from './PillboxConfigScreenStyles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faFilePdf,
  faMinus,
  faPlus,
  faSave,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { PillboxContext } from '../../context/PillboxContext'; // Import context for global state
import { Pillbox } from '../../entities/Pillbox.entity';
import { PBCell, PBCellState } from '../../entities/PBCell.entity';
import { PillboxPreview } from '../PillboxPreview/PillboxPreview';
import { createPdfAndShare } from '../../helpers/PDFHelper';
import { useLanguage } from '../../context/LanguageContext'; // Import useLanguage

export function PillboxConfigScreen({ navigation }) {
  const { pillbox: savedPillbox, setPillbox: savePillbox } = useContext(PillboxContext); // Get savePillbox function from context
  const [rows, setRows] = useState(1); // Default to 1 row
  const [cellsPerRow, setCellsPerRow] = useState(7); // Default to 7 cells per row
  const [pillbox, setPillbox] = useState<Pillbox | null>(null);

  const { language, translations } = useLanguage(); // Get current language and translations

  useEffect(() => {
    navigation.setOptions({
      title: translations.pillboxConfiguration,
    });
  }, [navigation, translations]);

  useEffect(() => {
    if (savedPillbox) {
      setRows(savedPillbox.rows);
      setCellsPerRow(savedPillbox.cols);
      setPillbox(savedPillbox);
    } else {
      const newPillbox = generatePillbox(rows, cellsPerRow);
      setPillbox(newPillbox);
    }
  }, []);

  // Generate or update pillbox when rows or cellsPerRow change
  useEffect(() => {
    const newPillbox = generatePillbox(rows, cellsPerRow);
    setPillbox(newPillbox);
  }, [rows, cellsPerRow]);

  const handleSave = () => {
    if (pillbox) {
      savePillbox(pillbox); // Save to global state and AsyncStorage
      navigation.goBack(); // Navigate back after saving
    }
  };

  const handleCancel = () => {
    navigation.goBack(); // Go back without saving
  };

  const handleDownloadPdf = async () => {
    if (!pillbox) {
      console.error('No pillbox set for generating PDF');
      return;
    }

    try {
      const pdfPath = await createPdfAndShare(pillbox);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  // Generate the pillbox based on rows and columns
  const generatePillbox = (rows: number, cols: number): Pillbox => {
    return new Pillbox(rows, cols);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{translations.pillboxConfiguration}</Text>

      {/* Row Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{translations.numberOfRows}</Text>
        <View style={styles.rowInput}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setRows(Math.max(1, rows - 1))}
          >
            <FontAwesomeIcon
              icon={faMinus}
              size={20}
              style={styles.iconButtonText}
            />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={String(rows)}
            onChangeText={(value) =>
              setRows(Math.max(1, parseInt(value, 10) || 1))
            }
          />
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setRows(rows + 1)}
          >
            <FontAwesomeIcon
              icon={faPlus}
              size={20}
              style={styles.iconButtonText}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Cells per Row Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{translations.cellsPerRow}</Text>
        <View style={styles.rowInput}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setCellsPerRow(Math.max(1, cellsPerRow - 1))}
          >
            <FontAwesomeIcon
              icon={faMinus}
              size={20}
              style={styles.iconButtonText}
            />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={String(cellsPerRow)}
            onChangeText={(value) =>
              setCellsPerRow(Math.max(1, parseInt(value, 10) || 1))
            }
          />
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setCellsPerRow(cellsPerRow + 1)}
          >
            <FontAwesomeIcon
              icon={faPlus}
              size={20}
              style={styles.iconButtonText}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Pillbox Preview */}
      <PillboxPreview pillbox={pillbox} />

      {/* Download PDF Button */}
      <TouchableOpacity
        style={styles.downloadButton}
        onPress={handleDownloadPdf}
      >
        <FontAwesomeIcon icon={faFilePdf} size={20} color="#fff" />
        <Text style={styles.buttonText}>{translations.downloadLabelsPdf}</Text>
      </TouchableOpacity>

      {/* Save and Cancel Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <FontAwesomeIcon icon={faSave} size={20} color="#fff" />
          <Text style={styles.buttonText}>{translations.save}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <FontAwesomeIcon icon={faTimes} size={20} color="#fff" />
          <Text style={styles.buttonText}>{translations.cancel}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

export const PillboxConfigScreenName = 'PillboxConfigScreen';
