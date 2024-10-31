import React, { useContext, useEffect } from 'react';
import 'react-native-get-random-values';
import {Alert, PermissionsAndroid, Platform, TouchableOpacity} from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
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
import { useNotificationHandler } from './hooks/useNotificationHandler';
import FullScreenNotification from './components/FullScreenNotification/FullScreenNotification';
import notifee, {AuthorizationStatus} from '@notifee/react-native';
import BackgroundService from 'react-native-background-actions';
import {startBackgroundService} from './BackgroundService.ts';
import {createNotificationChannel} from './NotificationService.ts';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function AppStack() {
  const navigation = useNavigation();

  useEffect(() => {
    // Handle initial notification when the app is opened via a notification
    async function checkInitialNotification() {
      console.log('Checking initial notification...');
      const initialNotification = await notifee.getInitialNotification();
      console.log('Initial notification:', initialNotification);
      if (initialNotification) {
        console.log('App opened via notification:', initialNotification);

        // Navigate to the FullScreenNotification screen
        console.log('Navigating to FullScreenNotification screen...');
        // navigation.navigate('FullScreenNotification', {
        //   notification: initialNotification.notification,
        //   pressAction: initialNotification.pressAction,
        // });
      } else {
        console.log('No initial notification found.');
      }
      console.log('Initial notification check complete.');
    }

    checkInitialNotification();
  }, [navigation]);

  useEffect(() => {
    const startService = async () => {
      await startBackgroundService();
    };

    createNotificationChannel();
    startService();
  }, []);

  return (
    <Stack.Navigator>
      {/* Main screen */}
      <Stack.Screen
        name={MainScreenName}
        component={MainScreen}
        options={({ navigation }) => ({
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
        })}
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

      {/* Full Screen Notification Screen */}
      <Stack.Screen
        name="FullScreenNotification"
        component={FullScreenNotification}
        options={{
          headerShown: false, // Hide the header for full-screen experience
          presentation: 'transparentModal', // Makes the screen appear over the lock screen
          gestureEnabled: false, // Disable gestures to prevent closing the screen accidentally
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

  useEffect(() => {
    async function requestNotificationPermission() {
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
            {
              title: 'MediApp Notification Permission',
              message: 'MediApp needs access to send you notifications.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          } else {
            Alert.alert(
              'Permissions Required',
              'Please enable notifications in settings to receive medication reminders.'
            );
          }
        } catch (err) {
          console.warn(err);
        }
      } else {
        // For Android versions below 13 and iOS (if needed)
        const settings = await notifee.requestPermission();
        if (settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
        } else {
          Alert.alert(
            'Permissions Required',
            'Please enable notifications in settings to receive medication reminders.'
          );
        }
      }
    }

    requestNotificationPermission();
  }, []);

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
