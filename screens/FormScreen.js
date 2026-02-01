import React from 'react';
import { View } from 'react-native';
import { saveEntry } from '../storage';

/**
 * A generic screen that receives a sport configuration via route
 * parameters. It renders the appropriate form component and
 * binds a save handler that writes the entry to AsyncStorage.
 */
export default function FormScreen({ route, navigation }) {
  const { sport } = route.params;
  const FormComponent = sport.component;

  // Callback invoked by child forms when the user saves an entry.
  const handleSave = async (data) => {
    await saveEntry(sport.name, data);
    // After saving, navigate back to the home screen
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1 }}>
      <FormComponent onSave={handleSave} />
    </View>
  );
}