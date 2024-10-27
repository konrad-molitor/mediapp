import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { PillboxContext } from '../../context/PillboxContext';
import { Medication } from '../../entities/Medication.entity';
import {PBCell, PBCellState} from '../../entities/PBCell.entity';
import { styles } from './AssignMedicationModalStyles';
import { PillboxPreview } from '../PillboxPreview/PillboxPreview';
import { useLanguage } from '../../context/LanguageContext';
import {Pillbox} from '../../entities/Pillbox.entity.ts'; // For translations

interface AssignMedicationModalProps {
  visible: boolean;
  onClose: () => void;
  medication: Medication;
}

const AssignMedicationModal: React.FC<AssignMedicationModalProps> = ({
                                                                       visible,
                                                                       onClose,
                                                                       medication,
                                                                     }) => {
  const { pillbox, setPillbox } = useContext(PillboxContext);
  const [selectedCells, setSelectedCells] = useState<string[]>([]);
  const { translations } = useLanguage(); // For translations

  useEffect(() => {
    if (visible && pillbox) {
      // Initialize selectedCells with IDs of cells assigned to this medication
      const assignedCellIds = pillbox.cells
        .filter((cell) => cell.medicationId === medication.id)
        .map((cell) => cell.id);
      setSelectedCells(assignedCellIds);
    }
  }, [visible, pillbox, medication]);

  const toggleCellSelection = (cellId: string) => {
    setSelectedCells((prevSelected) => {
      if (prevSelected.includes(cellId)) {
        // Unselect the cell
        return prevSelected.filter((id) => id !== cellId);
      } else {
        // Select the cell
        return [...prevSelected, cellId];
      }
    });
  };

  // Compute assigned cell labels
  const assignedCellLabels = useMemo(() => {
    if (!pillbox) return [];

    // Map selected cell IDs to cell objects
    const selectedCellObjects = selectedCells
      .map((cellId) => pillbox.cells.find((cell) => cell.id === cellId))
      .filter((cell): cell is PBCell => cell !== undefined);

    // Sort cells by row and column
    selectedCellObjects.sort((a, b) => {
      if (a.position.row !== b.position.row) {
        return a.position.row - b.position.row;
      } else {
        return a.position.col - b.position.col;
      }
    });

    // Map to cell labels
    return selectedCellObjects.map((cell) => cell.label);
  }, [selectedCells, pillbox]);

  const handleSave = () => {
    if (pillbox) {
      const updatedCells = pillbox.cells.map((cell) => {
        if (selectedCells.includes(cell.id)) {
          // Assign medication to this cell
          return new PBCell(
            cell.position.row,
            cell.position.col,
            cell.id,
            medication.id,
            PBCellState.Filled // Set state to Filled
          );
        } else if (cell.medicationId === medication.id) {
          // Unassign medication from this cell
          return new PBCell(
            cell.position.row,
            cell.position.col,
            cell.id,
            null,
            PBCellState.NotUsed // Reset state to NotUsed
          );
        } else {
          return cell;
        }
      });

      const updatedPillbox = new Pillbox(
        pillbox.rows,
        pillbox.cols,
        updatedCells,
        pillbox.createdAt,
        new Date()
      );

      setPillbox(updatedPillbox);
    }
    onClose();
  };



  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {translations.assignCellsTo} {medication.name}
          </Text>
          <ScrollView>
            <PillboxPreview
              pillbox={pillbox}
              selectedCells={selectedCells}
              onCellPress={toggleCellSelection}
              medicationId={medication.id}
            />
          </ScrollView>
          <View style={styles.assignedCellsContainer}>
            <Text style={styles.assignedCellsTitle}>{translations.assignedCells}:</Text>
            <Text style={styles.assignedCellsText}>
              {assignedCellLabels.length > 0
                ? assignedCellLabels.join(', ')
                : translations.noCellsAssigned}
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.buttonText}>{translations.save}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>{translations.cancel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AssignMedicationModal;
