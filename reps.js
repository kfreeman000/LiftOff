
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, Modal, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { collection, getDocs, deleteDoc, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db, auth } from './firebase';
import { SwipeListView } from 'react-native-swipe-list-view';

const WorkoutsList = () => {
  const [workouts, setWorkouts] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState('Bench');
  const [loading, setLoading] = useState(true);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [editReps, setEditReps] = useState('');
  const [editSets, setEditSets] = useState('');
  const [editWeight, setEditWeight] = useState('');
  const [editComments, setEditComments] = useState('');

  useEffect(() => {
  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      const uid = auth.currentUser?.uid;
      if (!uid) {
        console.log('No user signed in');
        setLoading(false);
        return;
      }

      const workoutRef = collection(db, 'users', uid, 'workouts');

      const q = query(workoutRef, orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);

      const workoutsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          date: data.date ? data.date.toDate() : null,
          reps: data.reps ?? 'unknown',
          sets: data.sets ?? 'unknown',
          weight: data.weight ?? 'unknown',
        };
      });

      setWorkouts(workoutsData);
    } catch (error) {
      console.error("Error fetching workouts: ", error);
    } finally {
      setLoading(false);
    }
  };

  fetchWorkouts();
}, []);

  const handleDelete = async (rowKey) => {
    Alert.alert('Delete Workout', 'Are you sure you want to delete this workout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          const uid = auth.currentUser?.uid;
          if (!uid) {
            Alert.alert('Error', 'You must be signed in to delete a workout.');
            return;
          }
          setWorkouts(prev => prev.filter(item => item.id !== rowKey));
          try {
            await deleteDoc(doc(db, 'users', uid, 'workouts', rowKey));
          } catch (error) {
            console.error("Error deleting workout:", error);
          }
        }
      },
    ]);
  };

  const handleEdit = (item) => {
    setEditingWorkout(item);
    setEditReps(item.reps?.toString() || '');
    setEditSets(item.sets?.toString() || '');
    setEditWeight(item.weight?.toString() || '');
    setEditComments(item.comments || '');
    setEditModalVisible(true);
  };

  const saveEdit = async () => {
    if (!editingWorkout) return;

    try {
      const uid = auth.currentUser?.uid;
      if (!uid) {
        Alert.alert('Error', 'You must be signed in to edit a workout.');
        return;
      }

      const workoutRef = doc(db, 'users', uid, 'workouts', editingWorkout.id);
      await updateDoc(workoutRef, {
        reps: editReps ? parseInt(editReps) : 'unknown',
        sets: editSets ? parseInt(editSets) : 'unknown',
        weight: editWeight ? parseInt(editWeight) : 'unknown',
        comments: editComments,
      });

      setWorkouts(prev =>
        prev.map(w =>
          w.id === editingWorkout.id
            ? { ...w, reps: editReps || 'unknown', sets: editSets || 'unknown', weight: editWeight || 'unknown', comments: editComments }
            : w
        )
      );

      setEditModalVisible(false);
      setEditingWorkout(null);

    } catch (error) {
      console.error("Error updating workout: ", error);
      Alert.alert("Error", "Failed to save changes");
    }
  };

  const filteredWorkouts = workouts.filter(workout => workout.workout === selectedExercise);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.itemText}>Workout: {item.workout}</Text>
      <Text style={styles.itemText}>Weight: {item.weight}</Text>
      <Text style={styles.itemText}>Reps: {item.reps}</Text>
      <Text style={styles.itemText}>Sets: {item.sets}</Text>
      <Text style={styles.itemText}>Comments: {item.comments}</Text>
      <Text style={styles.itemText}>Date: {item.date ? item.date.toLocaleDateString() : 'No date'}</Text>
    </View>
  );

  const renderHiddenItem = ({ item }) => (
    <View style={styles.rowBack}>
      <TouchableOpacity 
        style={[styles.backButtonFull, styles.editButton]}
        onPress={() => handleEdit(item)}
      >
        <Text style={styles.backButtonText}>Edit</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.backButtonFull, styles.deleteButton]}
        onPress={() => handleDelete(item.id)}
      >
        <Text style={styles.backButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Workout list 🏋🏽</Text>

      <Picker
        selectedValue={selectedExercise}
        onValueChange={(itemValue) => setSelectedExercise(itemValue)}
        style={{ width: '80%', marginVertical: 10, alignSelf: "center" }}
        itemStyle={{ color: 'black', fontFamily: 'Comfortaa-Bold' }}
      >
        <Picker.Item label="Bench" value="Bench" />
        <Picker.Item label="Squat" value="Squat" />
        <Picker.Item label="Deadlift" value="Deadlift" />
        <Picker.Item label="Row" value="Row" />
      </Picker>

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : filteredWorkouts.length > 0 ? (
        <SwipeListView
          data={filteredWorkouts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem}
          rightOpenValue={-150}
          disableRightSwipe
        />
      ) : (
        <Text style={{ marginTop: 20, fontSize: 16, fontStyle: 'italic' }}>
          No {selectedExercise} sets found yet. Log a workout first!
        </Text>
      )}

        

      {/* Edit Workout Modal */}
      <Modal visible={editModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Edit Workout: {editingWorkout?.workout}</Text>
            
            <TextInput placeholder="Weight" value={editWeight} onChangeText={setEditWeight} keyboardType="numeric" style={styles.input} />
            <TextInput placeholder="Reps" value={editReps} onChangeText={setEditReps} keyboardType="numeric" style={styles.input} />
            <TextInput placeholder="Sets" value={editSets} onChangeText={setEditSets} keyboardType="numeric" style={styles.input} />
            <TextInput placeholder="Comments" value={editComments} onChangeText={setEditComments} style={styles.input} />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.buttonContainer} onPress={saveEdit}>
                <Text style={styles.buttonText}>Update</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.buttonContainer, { backgroundColor: '#FF5757' }]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalButtons: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 15,
  },

  rowBack: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingBottom: 15
  },

  backButtonFull: {
    width: 150,
    height: "50%",
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 12,
    borderTopLeftRadius: 12,
    borderBottomRightRadius: 12,
    overflow: "hidden",
  },

  backButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },

  editButton: {
    backgroundColor: "#60B5F9",
  },

  deleteButton: {
    backgroundColor: "#F44336",
  },

  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 250,
    height: 60,
    borderRadius: 32,
    backgroundColor: "#60B5F9",
    paddingHorizontal: 20,
  },

  buttonText: {
    fontFamily: 'Comfortaa-Bold',
    color: 'white',
    fontSize: 20,
    textAlign: 'center'
  },

  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center',
    marginTop: 50, },
  item: { padding: 10, marginBottom: 15, backgroundColor: '#f0f0f0', borderRadius: 5 },
  itemText: { fontSize: 16 },

  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { width: '80%', backgroundColor: '#fff', padding: 20, borderRadius: 10 },

  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 10 },
});

export default WorkoutsList;
