import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
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
      <View style={styles.itemContainer}>
        <Text style={styles.date}>{new Date(item.timestamp).toLocaleString()}</Text>
        <Text style={styles.sport}>{item.sport}</Text>
        <Text style={styles.summary}>{summarizeEntry(item)}</Text>
      </View>
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
        <Text style={styles.empty}>No entries yet. Use the Home screen to add your first entry.</Text>
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
  empty: {
    marginTop: 32,
    fontSize: 16,
    textAlign: 'center',
  },
  itemContainer: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
  sport: {
    fontSize: 16,
    fontWeight: '600',
  },
  summary: {
    fontSize: 14,
    color: '#333',
  },
});