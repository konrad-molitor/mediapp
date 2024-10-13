import React, { useState } from 'react';
import {View, Text, TouchableOpacity, Modal, Dimensions, LayoutChangeEvent} from 'react-native';
import { styles } from './PillboxPreviewStyles';
import { Pillbox } from '../../entities/Pillbox.entity'; // Assuming Pillbox and PBCell are imported

// Define an enum for the cell colors
enum CellColors {
  Filled = '#28a745',
  ToBeTakenNow = '#ffc107',
  Taken = '#17a2b8',
  Skipped = '#ff6f61',
  Overdue = '#dc3545',
  NotUsed = '#ccc',
}

interface PillboxPreviewProps {
  pillbox: Pillbox | null;
}

export function PillboxPreview({ pillbox }: PillboxPreviewProps) {
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
  const rowLabelWidth = hasRowLabels ? 11 : 0; // Estimate row label width
  const availableWidth = previewWidth - rowLabelWidth; // Use entire available width
  const maxCellWidth = Math.min(availableWidth / pillbox.cols - 5, 60); // Adjust cell width to fit

  const showCellLabels = maxCellWidth > 30; // Show labels only if width allows enough space

  return (
    <View style={[styles.gridContainer]} onLayout={onLayout}>
      {Array.from({ length: pillbox.rows }, (_, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {/* Row labels */}
          {hasRowLabels && !showCellLabels && (
            <Text style={[styles.rowLabel, { width: rowLabelWidth }]}>
              {String.fromCharCode(65 + rowIndex)}
            </Text>
          )}
          {/* Display cells */}
          {pillbox.cells
            .filter(cell => cell.position.row === rowIndex)
            .map((cell, colIndex) => (
              <TouchableOpacity
                key={colIndex}
                style={[
                  styles.cell,
                  {
                    backgroundColor: CellColors[cell.state], // Use enum for colors
                    width: maxCellWidth,
                    height: maxCellWidth,
                  },
                ]}
                onPress={() => !showCellLabels && setSelectedCellLabel(cell.label)} // Modal for hidden labels
              >
                {showCellLabels && (
                  <Text style={styles.cellText}>
                    {cell.label}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
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
