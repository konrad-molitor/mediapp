import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, LayoutChangeEvent } from 'react-native';
import { styles } from './PillboxPreviewStyles';
import { Pillbox } from '../../entities/Pillbox.entity';
import {PBCell, PBCellState} from '../../entities/PBCell.entity';

// Define an enum for the cell colors
export const CellColors: Record<PBCellState, string> = {
  [PBCellState.Filled]: '#28a745',        // Green
  [PBCellState.ToBeTakenNow]: '#ffc107',  // Yellow
  [PBCellState.Taken]: '#17a2b8',         // Teal
  [PBCellState.Skipped]: '#ff6f61',       // Salmon
  [PBCellState.Overdue]: '#dc3545',       // Red
  [PBCellState.NotUsed]: '#ccc',          // Light Gray
};

interface PillboxPreviewProps {
  pillbox: Pillbox | null;
  selectedCells?: string[];
  onCellPress?: (cellId: string) => void;
  medicationId?: string;
}

export function PillboxPreview({
                                 pillbox,
                                 selectedCells = [],
                                 onCellPress,
                                 medicationId,
                               }: PillboxPreviewProps) {
  const [selectedCellLabel, setSelectedCellLabel] = useState<string | null>(null);
  const [previewWidth, setPreviewWidth] = useState(0);

  const onLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setPreviewWidth(width * 0.9);
  };

  if (!pillbox || !pillbox.cells || !pillbox.rows || !pillbox.cols) {
    return (
      <View style={styles.noPillboxContainer}>
        <Text style={styles.noPillboxText}>No pillbox set</Text>
      </View>
    );
  }

  const hasRowLabels = pillbox.rows > 1;
  const rowLabelWidth = hasRowLabels ? 11 : 0;
  const availableWidth = previewWidth - rowLabelWidth;
  const maxCellWidth = Math.min(availableWidth / pillbox.cols - 5, 60);
  const showCellLabels = maxCellWidth > 30;

  const renderCell = (cell: PBCell) => {
    const isSelected = selectedCells.includes(cell.id);
    const isAssignedToMedication = cell.medicationId === medicationId;

    const cellStyle = [
      styles.cell,
      {
        backgroundColor: CellColors[cell.state],
        width: maxCellWidth,
        height: maxCellWidth,
      },
      isSelected && styles.selectedCell,
      isAssignedToMedication && styles.assignedCell,
    ];

    return (
      <TouchableOpacity
        key={cell.id}
        style={cellStyle}
        onPress={() => {
          if (onCellPress) {
            onCellPress(cell.id);
          } else if (!showCellLabels) {
            setSelectedCellLabel(cell.label);
          }
        }}
      >
        {showCellLabels && <Text style={styles.cellText}>{cell.label}</Text>}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.gridContainer]} onLayout={onLayout}>
      {Array.from({ length: pillbox.rows }, (_, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {hasRowLabels && !showCellLabels && (
            <Text style={[styles.rowLabel, { width: rowLabelWidth }]}>
              {String.fromCharCode(65 + rowIndex)}
            </Text>
          )}
          {pillbox.cells
            .filter((cell) => cell.position.row === rowIndex)
            .map((cell) => renderCell(cell))}
        </View>
      ))}

      {/* Modal to display cell label on tap */}
      <Modal visible={!!selectedCellLabel} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Cell: {selectedCellLabel}</Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setSelectedCellLabel(null)}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
