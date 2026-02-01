import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { getSettings, saveSettings } from '../storage';

/**
 * Settings screen where users can customize the app behavior,
 * such as enabling/disabling specific dance styles for the
 * Ballroom form.
 */
export default function SettingsScreen() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const load = async () => {
      const loaded = await getSettings();
      setSettings(loaded);
    };
    load();
  }, []);

  const toggleDance = async (danceName) => {
    if (!settings) return;

    const updated = {
      ...settings,
      dances: settings.dances.map((dance) =>
        dance.name === danceName ? { ...dance, enabled: !dance.enabled } : dance
      ),
    };

    setSettings(updated);
    await saveSettings(updated);
  };

  if (!settings) {
    return (
      <View style={styles.container}>
        <Text>Loading settings...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dance Styles</Text>
        <Text style={styles.sectionDescription}>
          Select which dance styles you want to track in your Ballroom form.
        </Text>

        {settings.dances && settings.dances.map((dance) => (
          <View key={dance.name} style={styles.danceRow}>
            <Text style={styles.danceName}>{dance.name}</Text>
            <Switch
              value={dance.enabled}
              onValueChange={() => toggleDance(dance.name)}
              trackColor={{ false: '#ccc', true: '#2e86de' }}
              thumbColor={dance.enabled ? '#2e86de' : '#f0f0f0'}
            />
          </View>
        ))}
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          💡 Disabled dance styles won't appear in your Ballroom form, but previously logged entries will still show them.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
    color: '#333',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  sectionDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
  },
  danceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  danceName: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  infoBox: {
    backgroundColor: '#d0e8ff',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2e86de',
  },
  infoText: {
    fontSize: 13,
    color: '#1a5fb0',
    lineHeight: 18,
  },
});
