import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

/**
 * Form for logging ballroom dance practice.  Users can select
 * multiple dances and provide feedback for each selected dance.
 */
export default function BallroomForm({ onSave }) {
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const [selected, setSelected] = useState({});
  const [feedbacks, setFeedbacks] = useState({});
  const [notes, setNotes] = useState('');

  const dances = [
    'Waltz',
    'Tango',
    'Viennese Waltz',
    'Foxtrot',
    'Quickstep',
    'Samba',
    'Cha Cha',
    'Rumba',
    'Paso Doble',
    'Jive',
  ];

  const toggleDance = (name) => {
    const updated = { ...selected, [name]: !selected[name] };
    setSelected(updated);
    if (!updated[name]) {
      // clear feedback if deselected
      const { [name]: _, ...rest } = feedbacks;
      setFeedbacks(rest);
    }
  };

  const handleFeedbackChange = (name, text) => {
    setFeedbacks({ ...feedbacks, [name]: text });
  };

  const handleSave = () => {
    // extract names of selected dances
    const selectedDances = Object.keys(selected).filter((n) => selected[n]);
    const perDanceFeedback = selectedDances.map((name) => ({ name, feedback: feedbacks[name] || '' }));
    onSave({ date, dances: selectedDances, perDanceFeedback, notes });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
        <TextInput
          style={styles.input}
          value={date}
          onChangeText={setDate}
          placeholder="2026-02-01"
        />
      </View>
      <Text style={[styles.label, { marginBottom: 8 }]}>Select dances</Text>
      {dances.map((name) => (
        <View key={name} style={styles.danceRow}>
          <Text style={styles.danceName}>{name}</Text>
          <TouchableOpacity
            accessibilityRole="button"
            style={[styles.toggleButton, selected[name] && styles.toggleButtonSelected]}
            onPress={() => toggleDance(name)}
          >
            <Text style={[styles.toggleButtonText, selected[name] && styles.toggleButtonTextSelected]}>
              {selected[name] ? 'Selected' : 'Select'}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
      {Object.keys(selected).filter((n) => selected[n]).map((name) => (
        <View key={name} style={styles.fieldGroup}>
          <Text style={styles.label}>Feedback for {name}</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            value={feedbacks[name] || ''}
            onChangeText={(text) => handleFeedbackChange(name, text)}
            placeholder={`Comments on ${name}`}
            multiline
          />
        </View>
      ))}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Overall notes</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          value={notes}
          onChangeText={setNotes}
          placeholder="General remarks"
          multiline
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Session</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  danceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ddd',
  },
  danceName: {
    fontSize: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
  },
  textarea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#2e86de',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  toggleButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2e86de',
    backgroundColor: '#fff',
  },
  toggleButtonSelected: {
    backgroundColor: '#2e86de',
  },
  toggleButtonText: {
    color: '#2e86de',
    fontSize: 14,
    fontWeight: '600',
  },
  toggleButtonTextSelected: {
    color: '#fff',
  },
});
