
import { Picker } from '@react-native-picker/picker';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { db } from './firebase'; 
import { SwipeListView } from 'react-native-swipe-list-view';
       
        const WorkoutsList = () => {
          const [workouts, setWorkouts] = useState([]);
          const [selectedExercise, setSelectedExercise] = useState('Squat');
         
          // Fetch workouts data on component mount
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
                    date: data.date ? data.date.toDate() : null, // Safely convert date
                  };
                });
               
                setWorkouts(workoutsData);
              } catch (error) {
                console.error("Error fetching workouts: ", error);
              }
            };
       
            fetchWorkouts();
          }, []);

          const handleDelete = async (rowKey) => {
          Alert.alert('Delete Workout', 'Are you sure you want to delete this workout?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: async () => {
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

          const handleEdit = (item) => {
            Alert.alert('Edit Workout', `Workout: ${item.workout}`);
            // TODO: Open edit modal or navigate to edit screen
          };

          const filteredWorkouts = workouts.filter(workout => workout.workout === selectedExercise);

          const renderItem = ({ item }) => (
            <View style={styles.item}>
              <Text style={styles.itemText}>Workout: {item.workout}</Text>
              <Text style={styles.itemText}>Reps: {item.reps}</Text>
              <Text style={styles.itemText}>Weight: {item.weight}</Text>
              <Text style={styles.itemText}>Date: {item.date ? item.date.toLocaleDateString() : 'No date'}</Text>
            </View>
          );

          const renderHiddenItem = ({ item }) => (
            <View style={styles.rowBack}>
              <TouchableOpacity style={[styles.backButton, styles.editButton]} onPress={() => handleEdit(item)}>
                <Text style={{ color: '#fff' }}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.backButton, styles.deleteButton]} onPress={() => handleDelete(item.id)}>
                <Text style={{ color: '#fff' }}>Delete</Text>
              </TouchableOpacity>
            </View>
          );

          return (
            <View style={styles.container}>
              <Text style={styles.header}>Workouts List</Text>
              <Picker
              selectedValue={selectedExercise}
              onValueChange={(itemValue) => setSelectedExercise(itemValue)}
              style={{ width: '100%', marginVertical: 10 }}
              itemStyle={{ color: 'black', fontFamily: 'Comfortaa-Bold' }}
              >
                <Picker.Item  label="Bench" value="bench" />
                <Picker.Item  label="Squat" value="squats" />
                <Picker.Item  label="Deadlift" value="deadlift" />
                <Picker.Item  label="RDL" value="rdl" />
              </Picker>
            
              <SwipeListView
                data={filteredWorkouts}
                keyExtractor={item => item.id}
                renderItem={({ item }) => {
                  renderHiddenItem={renderHiddenItem}
                  rightOpenValue={-150} // Amount row opens to reveal hidden buttons
                  disableRightSwipe
                  // Format the date if it's available
                  const formattedDate = item.date ? item.date.toLocaleDateString() : 'No date"
              />
            </View>
          );
        };
       
        const styles = StyleSheet.create({
          container: {
            flex: 1,
            padding: 20,
            backgroundColor: '#fff',
          },
          header: {
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 10,
          },
          item: {
            padding: 10,
            marginBottom: 15,
            backgroundColor: '#f0f0f0',
            borderRadius: 5,
          },
          itemText: {
            fontSize: 16,
          },
        });
       
        export default WorkoutsList;
     