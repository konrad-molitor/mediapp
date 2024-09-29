import React, { useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
} from 'react-native';

import SplashScreen from 'react-native-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBars, faPills, faMedkit, faCog } from '@fortawesome/free-solid-svg-icons';
import { faBluetooth } from '@fortawesome/free-brands-svg-icons';
import { LanguageProvider, useLanguage } from './LanguageContext';
import SettingsScreen from './SettingsScreen';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// Move the Section function outside of the MainScreen component
function Section({ children, title }: { children: React.ReactNode; title: string }): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View style={styles.sectionContainer}>
      <Text style={[styles.sectionTitle, { color: isDarkMode ? Colors.white : Colors.black }]}>{title}</Text>
      <Text style={[styles.sectionDescription, { color: isDarkMode ? Colors.light : Colors.dark }]}>
        {children}
      </Text>
    </View>
  );
}

function MainScreen() {
  const { translations } = useLanguage();

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{translations.pillbox}</Text>
        <View style={styles.redRectangle} />
        <TouchableOpacity style={styles.fitContentButton}>
          <Text style={styles.buttonText}>{translations.pillboxSettings}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{translations.medication}</Text>
        <Text style={styles.placeholderText}>{translations.disconnected}</Text>
        <TouchableOpacity disabled style={[styles.fitContentButton, styles.disabledButton]}>
          <Text style={styles.buttonText}>{translations.editMedication}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{translations.microbit}</Text>
        <Text style={styles.deviceStatus}>{translations.disconnected}</Text>
        <View style={styles.rowButtons}>
          <TouchableOpacity disabled style={[styles.smallButton, styles.disabledButton]}>
            <Text style={styles.buttonText}>{translations.testConnection}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.smallButton}>
            <Text style={styles.buttonText}>{translations.connect}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const DrawerItem = ({ icon, title, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.drawerItem}>
    <FontAwesomeIcon icon={icon} size={20} color="#fff" style={styles.drawerIcon} />
    <Text style={styles.drawerText}>{title}</Text>
  </TouchableOpacity>
);

function SidePanel({ navigation }) {
  const { translations } = useLanguage();

  return (
    <View style={styles.drawerContent}>
      <Text style={styles.appName}>MediApp</Text>
      <DrawerItem icon={faMedkit} title={translations.pillbox} onPress={() => navigation.navigate('Home')} />
      <DrawerItem icon={faPills} title={translations.medication} onPress={() => navigation.navigate('Home')} />
      <DrawerItem icon={faBluetooth} title={translations.microbit} onPress={() => navigation.navigate('Home')} />
      <DrawerItem icon={faCog} title={translations.settings} onPress={() => navigation.navigate('Settings')} />
    </View>
  );
}

function AppStack({ navigation }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        component={MainScreen}
        options={{
          title: 'MediApp',
          headerStyle: {
            backgroundColor: '#001f3f',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={{ paddingLeft: 15 }}>
              <FontAwesomeIcon icon={faBars} size={20} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack.Navigator>
  );
}

function DrawerScreen() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <SidePanel {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Drawer.Screen name="Home" component={AppStack} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <NavigationContainer>
        <DrawerScreen />
      </NavigationContainer>
    </LanguageProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#001f3f', // Navy blue background
    padding: 20,
  },
  drawerContent: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: '#001f3f', // Navy blue background
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff', // White app name
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  drawerIcon: {
    marginRight: 15,
  },
  drawerText: {
    fontSize: 16,
    color: '#fff', // White menu items
  },
  card: {
    backgroundColor: '#fff', // White background
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  redRectangle: {
    height: 50,
    backgroundColor: 'red',
    marginBottom: 10,
  },
  placeholderText: {
    marginBottom: 10,
    fontStyle: 'italic',
    color: '#666',
  },
  deviceStatus: {
    marginBottom: 10,
    fontWeight: 'bold',
    color: 'red', // Disconnected for now
  },
  fitContentButton: {
    alignSelf: 'flex-end', // Align the button to the right
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  smallButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    marginLeft: 10, // Add margin to separate buttons in Micro:bit card
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  rowButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end', // Align buttons to the right
    marginTop: 10,
  },
});
