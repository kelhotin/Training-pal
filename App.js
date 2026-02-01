import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import FormScreen from './screens/FormScreen';
import EntriesScreen from './screens/EntriesScreen';

/**
 * The root of the application. It wires together our screens using
 * React Navigation. Each sport form lives on its own screen and
 * persists data using AsyncStorage. A separate screen lists all
 * saved entries.  The stack navigator allows simple navigation
 * between these pages.
 */
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Training Diary' }}
        />
        <Stack.Screen
          name="Form"
          component={FormScreen}
          // Show the sport name in the header if available
          options={({ route }) => ({
            title: route.params?.sport?.name || 'Log Entry'
          })}
        />
        <Stack.Screen
          name="Entries"
          component={EntriesScreen}
          options={{ title: 'Entries' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}