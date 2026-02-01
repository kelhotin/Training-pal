import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'trainingDiaryEntries';

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