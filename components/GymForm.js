import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

/**
 * Form for logging gym workouts.  Allows the user to add multiple
 * exercises with sets, reps and weight.  The exercises are stored
 * in an array and persisted together when the user saves.
 */
export default function GymForm({ onSave }) {
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const [exercises, setExercises] = useState([
    { name: '', sets: '', reps: '', weight: '', rating: 0 },
  ]);
  const [notes, setNotes] = useState('');

  const addExercise = () => {
    setExercises([...exercises, { name: '', sets: '', reps: '', weight: '', rating: 0 }]);
  };

  const updateExercise = (index, field, value) => {
    const updated = exercises.map((ex, i) =>
      i === index ? { ...ex, [field]: value } : ex
    );
    setExercises(updated);
  };

  const handleSave = () => {
    onSave({ date, exercises, notes });
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
      {exercises.map((exercise, index) => (
        <View key={index} style={styles.exerciseContainer}>
          <Text style={styles.exerciseTitle}>Exercise {index + 1}</Text>
          <TextInput
            style={styles.input}
            value={exercise.name}
            onChangeText={(text) => updateExercise(index, 'name', text)}
            placeholder="Exercise name"
          />
          <View style={styles.row}>
            <View style={styles.flexItem}>
              <Text style={styles.smallLabel}>Sets</Text>
              <TextInput
                style={styles.input}
                value={exercise.sets}
                onChangeText={(text) => updateExercise(index, 'sets', text)}
                placeholder="3"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.flexItem}>
              <Text style={styles.smallLabel}>Reps</Text>
              <TextInput
                style={styles.input}
                value={exercise.reps}
                onChangeText={(text) => updateExercise(index, 'reps', text)}
                placeholder="10"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.flexItem}>
              <Text style={styles.smallLabel}>Weight</Text>
              <TextInput
                style={styles.input}
                value={exercise.weight}
                onChangeText={(text) => updateExercise(index, 'weight', text)}
                placeholder="50"
                keyboardType="numeric"
              />
            </View>
          </View>
          <View style={styles.ratingContainer}>
            <Text style={styles.smallLabel}>How did you feel? (0-5 stars)</Text>
            <View style={styles.starsRow}>
              {[0, 1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => updateExercise(index, 'rating', star)}
                  style={styles.star}
                >
                  <Text style={[styles.starText, star <= exercise.rating && styles.starFilled]}>
                    ★
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      ))}
      <TouchableOpacity style={styles.addButton} onPress={addExercise}>
        <Text style={styles.addButtonText}>Add Exercise</Text>
      </TouchableOpacity>
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Any general notes"
          multiline
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Workout</Text>
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
  exerciseContainer: {
    marginBottom: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fafafa',
  },
  exerciseTitle: {
    fontWeight: '600',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  flexItem: {
    flex: 1,
    marginRight: 8,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    color: '#333',
  },
  smallLabel: {
    fontSize: 12,
    marginBottom: 4,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
    marginBottom: 8,
  },
  ratingContainer: {
    marginTop: 8,
    marginBottom: 8,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 8,
  },
  star: {
    padding: 4,
  },
  starText: {
    fontSize: 24,
    color: '#ddd',
  },
  starFilled: {
    color: '#ffc107',
  },
  textarea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  addButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  addButtonText: {
    color: '#2e86de',
    fontSize: 16,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#2e86de',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});