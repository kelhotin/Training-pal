import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import RunningForm from '../components/RunningForm';
import CyclingForm from '../components/CyclingForm';
import GymForm from '../components/GymForm';
import BallroomForm from '../components/BallroomForm';

/**
 * Configuration for each sport.  Each entry defines the sport
 * name, an emoji used on the button and the component that
 * renders its form.  Adding a new sport requires only adding
 * another entry here with a name and component.
 */
export const sportsConfig = [
  {
    key: 'running',
    name: 'Running',
    icon: '🏃',
    component: RunningForm,
  },
  {
    key: 'cycling',
    name: 'Cycling',
    icon: '🚴',
    component: CyclingForm,
  },
  {
    key: 'gym',
    name: 'Gym',
    icon: '🏋️',
    component: GymForm,
  },
  {
    key: 'ballroom',
    name: 'Ballroom',
    icon: '💃',
    component: BallroomForm,
  },
];

/**
 * HomeScreen shows a simple list of sports that the user can log.
 * Pressing a sport navigates to the generic Form screen with
 * configuration information for the selected sport.  A button
 * appears at the bottom to view all entries.
 */
export default function HomeScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {sportsConfig.map((sport) => (
        <TouchableOpacity
          key={sport.key}
          style={styles.card}
          onPress={() => navigation.navigate('Form', { sport })}
        >
          <Text style={styles.icon}>{sport.icon}</Text>
          <Text style={styles.label}>{sport.name}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity
        style={[styles.card, styles.entriesButton]}
        onPress={() => navigation.navigate('Entries')}
      >
        <Text style={styles.icon}>📖</Text>
        <Text style={styles.label}>View Entries</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    width: '42%',
    margin: 8,
    paddingVertical: 24,
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
  icon: {
    fontSize: 32,
    marginBottom: 8,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
  },
  entriesButton: {
    backgroundColor: '#d0e8ff',
  },
});