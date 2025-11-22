// WorkoutsList.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, Modal, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { SwipeListView } from 'react-native-swipe-list-view';

const WorkoutsList = () => {
  const [workouts, setWorkouts] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState('Bench');

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [editReps, setEditReps] = useState('');
  const [editSets, setEditSets] = useState('');
  const [editWeight, setEditWeight] = useState('');
  const [editComments, setEditComments] = useState('');

  // Fetch workouts from Firestore
  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const workoutRef = collection(db, 'workouts');
        const querySnapshot = await getDocs(workoutRef);

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
      }
    };

    fetchWorkouts();
  }, []);

  // Delete workout
  const handleDelete = async (rowKey) => {
    Alert.alert('Delete Workout', 'Are you sure you want to delete this workout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          setWorkouts(prev => prev.filter(item => item.id !== rowKey));
          try {
            await deleteDoc(doc(db, 'workouts', rowKey));
          } catch (error) {
            console.error("Error deleting workout:", error);
          }
        }
      },
    ]);
  };

  // Open edit modal
  const handleEdit = (item) => {
    setEditingWorkout(item);
    setEditReps(item.reps?.toString() || '');
    setEditSets(item.sets?.toString() || '');
    setEditWeight(item.weight?.toString() || '');
    setEditComments(item.comments || '');
    setEditModalVisible(true);
  };

  // Save edited workout
  const saveEdit = async () => {
    if (!editingWorkout) return;

    try {
      const workoutRef = doc(db, 'workouts', editingWorkout.id);
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
      <Text style={styles.itemText}>Reps: {item.reps}</Text>
      <Text style={styles.itemText}>Sets: {item.sets}</Text>
      <Text style={styles.itemText}>Weight: {item.weight}</Text>
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
      <Text style={styles.header}>Workout list🏋🏽‍♀️</Text>
      <Picker
        selectedValue={selectedExercise}
        onValueChange={(itemValue) => setSelectedExercise(itemValue)}
        style={{ width: '100%', marginVertical: 10 }}
        itemStyle={{ color: 'black', fontFamily: 'Comfortaa-Bold' }}
      >
        <Picker.Item label="Bench" value="Bench" />
        <Picker.Item label="Squat" value="Squat" />
        <Picker.Item label="Deadlift" value="Deadlift" />
        <Picker.Item label="Row" value="Row" />
      </Picker>

      <SwipeListView
        data={filteredWorkouts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={-150}
        disableRightSwipe
      />

      {/* Edit Workout Modal */}
      <Modal visible={editModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Edit Workout: {editingWorkout?.workout}</Text>
            <TextInput placeholder="Reps" value={editReps} onChangeText={setEditReps} keyboardType="numeric" style={styles.input} />
            <TextInput placeholder="Sets" value={editSets} onChangeText={setEditSets} keyboardType="numeric" style={styles.input} />
            <TextInput placeholder="Weight" value={editWeight} onChangeText={setEditWeight} keyboardType="numeric" style={styles.input} />
            <TextInput placeholder="Comments" value={editComments} onChangeText={setEditComments} style={styles.input} />
            <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.buttonContainer} onPress={saveEdit}>
              <Text style={styles.buttonText}>Update</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.buttonContainer, { backgroundColor: '#FF5757'}]} 
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
  gap: 15, // spacing between update/cancel buttons
},
rowBack: {
  flex: 1,
  flexDirection: "column",
  justifyContent: "space-between",
  height: "100%",
  alignItems: "flex-end",
},
backButtonFull: {
  width: 150,            // must match your rightOpenValue
  height: "50%",         // edit top half / delete bottom half
  justifyContent: "center",
  alignItems: "center",
},
backButtonText: {
  color: "#fff",
  fontWeight: "600",
  fontSize: 16,
},
rightActions: {
  width: 90,                 // controls swipe width
  height: '100%',            // make it fill the row height
  flexDirection: 'column',   // STACK vertically
  borderTopRightRadius: 12,
  borderBottomRightRadius: 12,
  overflow: 'hidden',        // required for rounded corners to work
},

editButton: {
  flex: 1,                   // split space evenly
  backgroundColor: '#4CAF50',
  justifyContent: 'center',
  alignItems: 'center',
},

deleteButton: {
  flex: 1,
  backgroundColor: '#F44336',
  justifyContent: 'center',
  alignItems: 'center',
},

actionText: {
  color: 'white',
  fontWeight: 'bold',
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
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  item: { padding: 10, marginBottom: 15, backgroundColor: '#f0f0f0', borderRadius: 5 },
  itemText: { fontSize: 16 },
  rowBack: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 15 },
  backButton: { width: 75, justifyContent: 'center', alignItems: 'center', borderRadius: 5, marginLeft: 5 },
  editButton: { backgroundColor: '#60B5F9' },
  deleteButton: { backgroundColor: 'red' },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)',  },
  modalContent: { width: '80%', backgroundColor: '#fff', padding: 20, borderRadius: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 10 },
});

export default WorkoutsList;
