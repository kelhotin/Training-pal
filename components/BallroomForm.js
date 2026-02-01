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
      <View style={styles.card}>
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
      <View style={styles.danceGrid}>
        {dances.map((name) => (
          <TouchableOpacity
            key={name}
            accessibilityRole="button"
            accessibilityState={{ selected: !!selected[name] }}
            activeOpacity={0.7}
            style={[styles.danceButton, selected[name] && styles.danceButtonSelected]}
            onPress={() => toggleDance(name)}
          >
            <Text style={[styles.danceButtonText, selected[name] && styles.danceButtonTextSelected]}>
              {name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
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
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    width: '100%',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  fieldGroup: {
    marginBottom: 16,
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
  danceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginBottom: 16,
    gap: 8,
  },
  danceButton: {
    width: 80,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  danceButtonSelected: {
    backgroundColor: '#2e86de',
  },
  danceButtonText: {
    color: '#2e86de',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  danceButtonTextSelected: {
    color: '#fff',
  },
});
