import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { styles } from './PillboxConfigScreenStyles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {faSave, faTimes, faFilePdf, faMinus, faPlus} from '@fortawesome/free-solid-svg-icons';
import { Pillbox } from '../../entities/Pillbox.entity';
import { PBCell } from '../../entities/PBCell.entity';
import { PillboxPreview } from '../PillboxPreview/PillboxPreview';

export function PillboxConfigScreen({ navigation }) {
  const [rows, setRows] = useState(1); // Default to 1 row
  const [cellsPerRow, setCellsPerRow] = useState(7); // Default to 7 cells per row
  const [pillbox, setPillbox] = useState<Pillbox | null>(null);

  // Generate or update pillbox when rows or cellsPerRow change
  useEffect(() => {
    const newPillbox = generatePillbox(rows, cellsPerRow);
    setPillbox(newPillbox);
  }, [rows, cellsPerRow]);

  const handleSave = () => {
    // Save pillbox settings logic here
    console.log('Saved rows:', rows, 'cells per row:', cellsPerRow);
    navigation.goBack(); // Return to the main screen after saving
  };

  const handleCancel = () => {
    navigation.goBack(); // Go back without saving
  };

  const handleDownloadPdf = () => {
    // Logic for generating and downloading PDF
    console.log('Downloading PDF...');
  };

  const generatePillbox = (rows: number, cols: number): Pillbox => {
    const cells: PBCell[] = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const cellLabel = String.fromCharCode(65 + row) + (col + 1); // A1, B2, etc.
        cells.push({
          position: { row, col, rowLabel: String.fromCharCode(65 + row), colLabel: `${col + 1}` },
          label: cellLabel,
          medication: null, // No medication by default
          state: 'NotUsed', // Default state is NotUsed
        });
      }
    }
    return { rows, cols, cells, createdAt: new Date(), updatedAt: new Date() };
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Pillbox Configuration</Text>

      {/* Row Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Number of Rows:</Text>
        <View style={styles.rowInput}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setRows(Math.max(1, rows - 1))}>
            <FontAwesomeIcon icon={faMinus} size={20} style={styles.iconButtonText} />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={String(rows)}
            onChangeText={(value) => setRows(Math.max(1, parseInt(value, 10) || 1))}
          />
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setRows(rows + 1)}>
            <FontAwesomeIcon icon={faPlus} size={20} style={styles.iconButtonText} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Cells per Row Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Cells per Row:</Text>
        <View style={styles.rowInput}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setCellsPerRow(Math.max(1, cellsPerRow - 1))}>
            {/*<Text style={styles.iconButtonText}>-</Text>*/}
            <FontAwesomeIcon icon={faMinus} size={20} style={styles.iconButtonText} />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={String(cellsPerRow)}
            onChangeText={(value) => setCellsPerRow(Math.max(1, parseInt(value, 10) || 1))}
          />
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setCellsPerRow(cellsPerRow + 1)}>
            <FontAwesomeIcon icon={faPlus} size={20} style={styles.iconButtonText} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Pillbox Preview */}
      <PillboxPreview pillbox={pillbox} />

      {/* Download PDF Button */}
      <TouchableOpacity style={styles.downloadButton} onPress={handleDownloadPdf}>
        <FontAwesomeIcon icon={faFilePdf} size={20} color="#fff" />
        <Text style={styles.buttonText}>Download Labels PDF</Text>
      </TouchableOpacity>

      {/* Save and Cancel Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <FontAwesomeIcon icon={faSave} size={20} color="#fff" />
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <FontAwesomeIcon icon={faTimes} size={20} color="#fff" />
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

export const pillboxConfigScreenName = 'PillboxConfigScreen';
