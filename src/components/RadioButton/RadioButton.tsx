import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCircle, faDotCircle } from '@fortawesome/free-solid-svg-icons';

export default function RadioButton({ label, selected, onPress }) {
  return (
    <TouchableOpacity style={styles.radioButton} onPress={onPress}>
      <FontAwesomeIcon
        icon={selected ? faDotCircle : faCircle}
        size={20}
        color="#007bff"
      />
      <Text style={styles.radioButtonLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioButtonLabel: {
    marginLeft: 10,
    fontSize: 16,
    color: '#000',
  },
});
