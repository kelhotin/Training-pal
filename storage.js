import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'trainingDiaryEntries';
const SETTINGS_KEY = 'trainingDiarySettings';

/**
 * Fetch all stored entries from AsyncStorage.  Returns an
 * empty array if nothing has been stored yet.  Data is
 * serialized as JSON.
 */
export async function getEntries() {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json != null ? JSON.parse(json) : [];
  } catch (err) {
    console.warn('Failed to read entries', err);
    return [];
  }
}

/**
 * Save a new entry.  Each entry is an object with a timestamp,
 * sport name and data payload defined by the sport form.  The
 * list is appended and persisted back to AsyncStorage.
 *
 * @param {string} sport - Name of the sport (e.g. "Running").
 * @param {object} data - Arbitrary data from the form.
 */
export async function saveEntry(sport, data) {
  const entry = {
    timestamp: Date.now(),
    sport,
    data,
  };
  try {
    const existing = await getEntries();
    existing.push(entry);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch (err) {
    console.warn('Failed to save entry', err);
  }
}

/**
 * Remove all entries from storage.  Primarily useful for
 * development or resetting the diary.  This function is not
 * exposed in the UI but can be called manually if needed.
 */
export async function clearEntries() {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('Failed to clear entries', err);
  }
}

/**
 * Update an existing entry by timestamp.
 *
 * @param {number} timestamp - The timestamp of the entry to update.
 * @param {string} sport - Name of the sport.
 * @param {object} data - Updated data from the form.
 */
export async function updateEntry(timestamp, sport, data) {
  try {
    const existing = await getEntries();
    const index = existing.findIndex((entry) => entry.timestamp === timestamp);
    if (index !== -1) {
      existing[index] = { timestamp, sport, data };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    }
  } catch (err) {
    console.warn('Failed to update entry', err);
  }
}

/**
 * Get current settings. Returns default settings if none exist.
 */
export async function getSettings() {
  try {
    const json = await AsyncStorage.getItem(SETTINGS_KEY);
    if (json != null) {
      return JSON.parse(json);
    }
    // Return default settings
    return {
      dances: [
        { name: 'Waltz', enabled: true },
        { name: 'Tango', enabled: true },
        { name: 'Viennese Waltz', enabled: true },
        { name: 'Foxtrot', enabled: true },
        { name: 'Quickstep', enabled: true },
        { name: 'Samba', enabled: true },
        { name: 'Cha Cha', enabled: true },
        { name: 'Rumba', enabled: true },
        { name: 'Paso Doble', enabled: true },
        { name: 'Jive', enabled: true },
      ],
    };
  } catch (err) {
    console.warn('Failed to read settings', err);
    return {};
  }
}

/**
 * Save settings to storage.
 *
 * @param {object} settings - Settings object with enabled dances.
 */
export async function saveSettings(settings) {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.warn('Failed to save settings', err);
  }
}