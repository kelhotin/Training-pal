import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

/**
 * Form for logging running workouts.  Tracks date, distance (km),
 * duration (minutes), calculated pace (min/km) and notes.  It
 * calls the provided onSave callback when the user taps save.
 */
export default function RunningForm({ onSave }) {
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [pace, setPace] = useState('');
  const [notes, setNotes] = useState('');
  const [rating, setRating] = useState(0);

  useEffect(() => {
    // Calculate pace if distance and duration are available
    const d = parseFloat(distance);
    const t = parseFloat(duration);
    if (!isNaN(d) && d > 0 && !isNaN(t) && t > 0) {
      const p = t / d;
      setPace(p.toFixed(2));
    } else {
      setPace('');
    }
  }, [distance, duration]);

  const handleSave = () => {
    onSave({ date, distance, duration, pace, notes, rating });
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
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Distance (km)</Text>
        <TextInput
          style={styles.input}
          value={distance}
          onChangeText={setDistance}
          placeholder="5"
          keyboardType="numeric"
        />
      </View>
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Duration (minutes)</Text>
        <TextInput
          style={styles.input}
          value={duration}
          onChangeText={setDuration}
          placeholder="30"
          keyboardType="numeric"
        />
      </View>
      {pace ? (
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Pace (min/km)</Text>
          <Text style={styles.value}>{pace}</Text>
        </View>
      ) : null}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>How did you feel? (0-5 stars)</Text>
        <View style={styles.starsRow}>
          {[0, 1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => setRating(star)}
              style={styles.star}
            >
              <Text style={[styles.starText, star <= rating && styles.starFilled]}>
                ★
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Additional notes"
          multiline
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Run</Text>
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
  value: {
    fontSize: 16,
    paddingVertical: 8,
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