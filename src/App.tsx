import React, { useContext } from 'react';
import 'react-native-get-random-values';
import { TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { LanguageProvider } from './context/LanguageContext';
import SettingsScreen from './components/SettingsScreen';
import { MainScreen, MainScreenName } from './components/MainScreen/MainScreen';
import {
  PillboxConfigScreen,
  PillboxConfigScreenName,
} from './components/PillboxConfigScreen/PillboxConfigScreen';
import { SidePanel } from './components/Drawer/SidePanel';
import { PillboxProvider, PillboxContext } from './context/PillboxContext';
import {
  MedicationListScreen,
  MedicationListScreenName,
} from './components/MedicationListScreen/MedicationListScreen';
import { MedicationProvider, MedicationContext } from './context/MedicationContext';
import { useNotificationScheduler } from './hooks/useNotificationScheduler'; // Custom hook for scheduling notifications
import { useNotificationHandler } from './hooks/useNotificationHandler'; // Custom hook for handling notifications

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function AppStack({ navigation }) {
  return (
    <Stack.Navigator>
      {/* Main screen */}
      <Stack.Screen
        name={MainScreenName}
        component={MainScreen}
        options={{
          headerStyle: {
            backgroundColor: '#001f3f',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.toggleDrawer()}
              style={{ paddingLeft: 15 }}
            >
              <FontAwesomeIcon icon={faBars} size={20} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />

      {/* PillboxConfigScreen */}
      <Stack.Screen
        name={PillboxConfigScreenName}
        component={PillboxConfigScreen}
        options={{
          headerStyle: {
            backgroundColor: '#001f3f',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />

      {/* MedicationListScreen */}
      <Stack.Screen
        name={MedicationListScreenName}
        component={MedicationListScreen}
        options={{
          headerStyle: {
            backgroundColor: '#001f3f',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
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

// New AppContent component where we can access contexts
function AppContent() {
  // Access contexts
  const { pillbox } = useContext(PillboxContext);
  const { medications } = useContext(MedicationContext);

  // Use custom hooks
  useNotificationScheduler(medications, pillbox);
  useNotificationHandler(); // Handles notification actions

  return (
    <NavigationContainer>
      <DrawerScreen />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <PillboxProvider>
        <MedicationProvider>
          <AppContent />
        </MedicationProvider>
      </PillboxProvider>
    </LanguageProvider>
  );
}
