import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { getEntries, updateEntry } from '../storage';
import RunningForm from '../components/RunningForm';
import CyclingForm from '../components/CyclingForm';
import GymForm from '../components/GymForm';
import BallroomForm from '../components/BallroomForm';

/**
 * Renders a list of all saved entries.  It loads data from
 * AsyncStorage when the screen appears.  Each item displays
 * basic metadata such as the date, sport and a short summary.
 */
export default function EntriesScreen() {
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const load = async () => {
      const all = await getEntries();
      setEntries(all.reverse()); // show latest first
    };
    load();
  }, []);

  const handleEditSave = async (updatedData) => {
    if (selectedEntry) {
      await updateEntry(selectedEntry.timestamp, selectedEntry.sport, updatedData);
      // Reload entries
      const all = await getEntries();
      setEntries(all.reverse());
      setIsEditing(false);
      setSelectedEntry(null);
    }
  };

  const getFormComponent = (sport, data, onSave) => {
    switch (sport) {
      case 'Running':
        return <RunningForm key={sport} onSave={onSave} />;
      case 'Cycling':
        return <CyclingForm key={sport} onSave={onSave} />;
      case 'Gym':
        return <GymForm key={sport} onSave={onSave} />;
      case 'Ballroom':
        return <BallroomForm key={sport} onSave={onSave} />;
      default:
        return null;
    }
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.card} onPress={() => setSelectedEntry(item)}>
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

  // Render full details for an entry based on sport type
  function renderEntryDetails(entry) {
    const { sport, data } = entry;
    switch (sport) {
      case 'Running':
        return (
          <View>
            <DetailRow label="Distance" value={`${data.distance} km`} />
            <DetailRow label="Duration" value={data.duration} />
            <DetailRow label="Pace" value={data.pace} />
            {data.rating !== undefined && (
              <View style={styles.ratingDisplay}>
                <Text style={styles.ratingLabel}>Felt: </Text>
                <Text style={styles.starsDisplay}>
                  {Array.from({ length: 5 }, (_, i) => i < data.rating ? '★' : '☆').join('')}
                </Text>
              </View>
            )}
            {data.notes && <DetailRow label="Notes" value={data.notes} />}
          </View>
        );
      case 'Cycling':
        return (
          <View>
            <DetailRow label="Distance" value={`${data.distance} km`} />
            <DetailRow label="Duration" value={data.duration} />
            <DetailRow label="Type" value={data.indoor ? 'Indoor' : 'Outdoor'} />
            {data.rating !== undefined && (
              <View style={styles.ratingDisplay}>
                <Text style={styles.ratingLabel}>Felt: </Text>
                <Text style={styles.starsDisplay}>
                  {Array.from({ length: 5 }, (_, i) => i < data.rating ? '★' : '☆').join('')}
                </Text>
              </View>
            )}
            {data.notes && <DetailRow label="Notes" value={data.notes} />}
          </View>
        );
      case 'Gym':
        return (
          <View>
            <Text style={styles.detailLabel}>Exercises:</Text>
            {data.exercises && data.exercises.map((ex, idx) => (
              <View key={idx} style={styles.exerciseItem}>
                <Text style={styles.exerciseName}>{ex.name}</Text>
                <Text style={styles.exerciseDetails}>{ex.sets} sets × {ex.reps} reps</Text>
                {ex.weight && <Text style={styles.exerciseDetails}>Weight: {ex.weight} kg</Text>}
                {ex.rating !== undefined && (
                  <View style={styles.ratingDisplay}>
                    <Text style={styles.ratingLabel}>Felt: </Text>
                    <Text style={styles.starsDisplay}>
                      {Array.from({ length: 5 }, (_, i) => i < ex.rating ? '★' : '☆').join('')}
                    </Text>
                  </View>
                )}
              </View>
            ))}
            {data.notes && <DetailRow label="Notes" value={data.notes} />}
          </View>
        );
      case 'Ballroom':
        return (
          <View>
            <Text style={styles.detailLabel}>Dances:</Text>
            {data.dances && data.dances.map((dance, idx) => (
              <View key={idx} style={styles.danceItem}>
                <Text style={styles.danceName}>{dance}</Text>
                {data.perDanceFeedback && data.perDanceFeedback[idx] && (
                  <View>
                    {data.perDanceFeedback[idx].feedback && (
                      <Text style={styles.feedbackText}>{data.perDanceFeedback[idx].feedback}</Text>
                    )}
                    {data.perDanceFeedback[idx].rating !== undefined && (
                      <View style={styles.ratingDisplay}>
                        <Text style={styles.ratingLabel}>Felt: </Text>
                        <Text style={styles.starsDisplay}>
                          {Array.from({ length: 5 }, (_, i) => i < data.perDanceFeedback[idx].rating ? '★' : '☆').join('')}
                        </Text>
                      </View>
                    )}
                  </View>
                )}
              </View>
            ))}
            {data.notes && <DetailRow label="Overall Notes" value={data.notes} />}
          </View>
        );
      default:
        return <Text>No details available</Text>;
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
      
      <Modal visible={selectedEntry !== null && !isEditing} animationType="slide">
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedEntry(null)}>
                <Text style={styles.closeButtonText}>✕ Close</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
                <Text style={styles.editButtonText}>✎ Edit</Text>
              </TouchableOpacity>
            </View>
            
            {selectedEntry && (
              <View>
                <Text style={styles.modalDate}>{new Date(selectedEntry.timestamp).toLocaleString()}</Text>
                <Text style={styles.modalSport}>{selectedEntry.sport}</Text>
                <View style={styles.modalDivider} />
                {renderEntryDetails(selectedEntry)}
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>

      <Modal visible={isEditing && selectedEntry !== null} animationType="slide">
        <View style={styles.editModalContainer}>
          <ScrollView>
            <View style={styles.editModalHeader}>
              <TouchableOpacity style={styles.closeButton} onPress={() => setIsEditing(false)}>
                <Text style={styles.closeButtonText}>✕ Cancel</Text>
              </TouchableOpacity>
            </View>
            {selectedEntry && getFormComponent(selectedEntry.sport, selectedEntry.data, handleEditSave)}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

// Helper component for displaying detail rows
function DetailRow({ label, value }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}:</Text>
      <Text style={styles.detailValue}>{value}</Text>
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
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 16,
  },
  modalContent: {
    padding: 16,
  },
  closeButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    marginBottom: 16,
  },
  closeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2e86de',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  editButton: {
    alignSelf: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#2e86de',
    borderRadius: 6,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  editModalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 16,
  },
  editModalHeader: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  modalDate: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  modalSport: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingVertical: 6,
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  detailValue: {
    fontSize: 13,
    color: '#666',
    flex: 1,
    textAlign: 'right',
  },
  exerciseItem: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
    marginLeft: 12,
  },
  exerciseName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  exerciseDetails: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  danceItem: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
    marginLeft: 12,
  },
  danceName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  feedbackText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  ratingDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  ratingLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  starsDisplay: {
    fontSize: 14,
    color: '#ffc107',
    marginLeft: 4,
  },
});