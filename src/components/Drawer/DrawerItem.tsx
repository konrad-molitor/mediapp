import {Text, TouchableOpacity} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import React from 'react';
import {styles} from './DrawerStyles';

export const DrawerItem = ({ icon, title, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.drawerItem}>
    <FontAwesomeIcon icon={icon} size={20} color="#fff" style={styles.drawerIcon} />
    <Text style={styles.drawerText}>{title}</Text>
  </TouchableOpacity>
);
