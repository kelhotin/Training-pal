import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { getEntries } from '../storage';

/**
 * Renders a list of all saved entries.  It loads data from
 * AsyncStorage when the screen appears.  Each item displays
 * basic metadata such as the date, sport and a short summary.
 */
export default function EntriesScreen() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const load = async () => {
      const all = await getEntries();
      setEntries(all.reverse()); // show latest first
    };
    load();
  }, []);

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.card}>
        <Text style={styles.date}>{new Date(item.timestamp).toLocaleString()}</Text>
        <Text style={styles.sport}>{item.sport}</Text>
        <Text style={styles.summary}>{summarizeEntry(item)}</Text>
      </TouchableOpacity>
    );
  };

  // Build a one-line summary for an entry based on its sport and data.
  function summarizeEntry(entry) {
    switch (entry.sport) {
      case 'Running': {
        const { distance, duration } = entry.data;
        return `${distance || '?'} km in ${duration || '?'} `;
      }
      case 'Cycling': {
        const { distance, duration } = entry.data;
        return `${distance || '?'} km in ${duration || '?'} ${entry.data.indoor ? '(Indoor)' : '(Outdoor)'}`;
      }
      case 'Gym': {
        const exCount = entry.data.exercises ? entry.data.exercises.length : 0;
        return `${exCount} exercise${exCount === 1 ? '' : 's'}`;
      }
      case 'Ballroom': {
        const dances = entry.data.dances || [];
        return `${dances.length} dance${dances.length === 1 ? '' : 's'}`;
      }
      default:
        return '';
    }
  }

  return (
    <View style={styles.container}>
      {entries.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.empty}>No entries yet. Use the Home screen to add your first entry.</Text>
        </View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  empty: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
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
  date: {
    fontSize: 10,
    color: '#666',
    marginBottom: 1,
  },
  sport: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 1,
  },
  summary: {
    fontSize: 11,
    color: '#333',
  },
});