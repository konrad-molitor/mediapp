import {useLanguage} from '../../context/LanguageContext.tsx';
import {Text, View} from 'react-native';
import {faCog, faMedkit, faPills} from '@fortawesome/free-solid-svg-icons';
import {faBluetooth} from '@fortawesome/free-brands-svg-icons';
import React from 'react';
import {DrawerItem} from './DrawerItem.tsx';
import {styles} from './DrawerStyles.ts';
import {PillboxConfigScreenName} from '../PillboxConfigScreen/PillboxConfigScreen.tsx';
import {MedicationListScreenName} from '../MedicationListScreen/MedicationListScreen.tsx';
import {SettingsScreenName} from '../SettingsScreen.tsx';

export function SidePanel({ navigation }) {
  const { translations } = useLanguage();

  return (
    <View style={styles.drawerContent}>
      <Text style={styles.appName}>MediApp</Text>
      <DrawerItem icon={faMedkit} title={translations.pillbox} onPress={() => navigation.navigate(PillboxConfigScreenName)} />
      <DrawerItem icon={faPills} title={translations.medication} onPress={() => navigation.navigate(MedicationListScreenName)} />
      <DrawerItem icon={faBluetooth} title={translations.microbit} onPress={() => navigation.navigate('Home')} />
      <DrawerItem icon={faCog} title={translations.settings} onPress={() => navigation.navigate(SettingsScreenName)} />
    </View>
  );
}
