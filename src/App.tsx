import React from 'react';
import { TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { LanguageProvider } from './context/LanguageContext.tsx';
import SettingsScreen from './components/SettingsScreen.tsx';
import {MainScreen, MainScreenName} from './components/MainScreen/MainScreen';
import {PillboxConfigScreen, PillboxConfigScreenName} from './components/PillboxConfigScreen/PillboxConfigScreen'; // Import Pillbox screen
import { SidePanel } from './components/Drawer/SidePanel';
import {PillboxProvider} from './context/PillboxContext.tsx';
import {
  MedicationListScreen,
  MedicationListScreenName,
} from './components/MedicationListScreen/MedicationListScreen.tsx';
import {MedicationProvider} from './context/MedicationContext.tsx';

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
          // Removed 'title' here
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

      {/* PillboxConfigScreen */}
      <Stack.Screen
        name={PillboxConfigScreenName}
        component={PillboxConfigScreen}
        options={{
          // Removed 'title' here
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
          // Removed 'title' here
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

export default function App() {
  return (
    <LanguageProvider>
      <PillboxProvider>
        <MedicationProvider>
          <NavigationContainer>
            <DrawerScreen />
          </NavigationContainer>
        </MedicationProvider>
      </PillboxProvider>
    </LanguageProvider>
  );
}
