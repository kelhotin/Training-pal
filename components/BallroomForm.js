import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { getSettings } from '../storage';

/**
 * Form for logging ballroom dance practice.  Users can select
 * multiple dances and provide feedback for each selected dance.
 */
export default function BallroomForm({ onSave, initialData }) {
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(initialData?.date || today);
  const [selected, setSelected] = useState(
    initialData?.dances ? Object.fromEntries(initialData.dances.map(d => [d, true])) : {}
  );
  const [feedbacks, setFeedbacks] = useState(
    initialData?.perDanceFeedback 
      ? Object.fromEntries(initialData.perDanceFeedback.map(p => [p.name, p.feedback]))
      : {}
  );
  const [ratings, setRatings] = useState(
    initialData?.perDanceFeedback 
      ? Object.fromEntries(initialData.perDanceFeedback.map(p => [p.name, p.rating || 0]))
      : {}
  );
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [dances, setDances] = useState([]);

  useEffect(() => {
    const loadDances = async () => {
      const settings = await getSettings();
      const enabledDances = settings.dances
        .filter((dance) => dance.enabled)
        .map((dance) => dance.name);
      setDances(enabledDances);
    };
    loadDances();
  }, []);

  const toggleDance = (name) => {
    const updated = { ...selected, [name]: !selected[name] };
    setSelected(updated);
    if (!updated[name]) {
      // clear feedback and rating if deselected
      const { [name]: _, ...restFeedback } = feedbacks;
      const { [name]: __, ...restRating } = ratings;
      setFeedbacks(restFeedback);
      setRatings(restRating);
    }
  };

  const handleFeedbackChange = (name, text) => {
    setFeedbacks({ ...feedbacks, [name]: text });
  };

  const handleRatingChange = (name, rating) => {
    setRatings({ ...ratings, [name]: rating });
  };

  const handleSave = () => {
    // extract names of selected dances
    const selectedDances = Object.keys(selected).filter((n) => selected[n]);
    const perDanceFeedback = selectedDances.map((name) => ({ 
      name, 
      feedback: feedbacks[name] || '',
      rating: ratings[name] || 0
    }));
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
          <Text style={[styles.label, { marginTop: 8 }]}>How did you feel?</Text>
          <View style={styles.starsRow}>
            {[0, 1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => handleRatingChange(name, star)}
                style={styles.star}
              >
                <Text style={[styles.starText, star <= (ratings[name] || 0) && styles.starFilled]}>
                  ★
                </Text>
              </TouchableOpacity>
            ))}
          </View>
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
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 8,
    marginTop: 8,
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
