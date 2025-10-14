
import { addDoc, collection } from 'firebase/firestore';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { firestore } from './firebase'; // Your firestore config

const AddWorkout = () => {
  const [workout, setWorkout] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [comments, setComments] = useState('');
  const [oneRepMax, setOneRepMax] = useState('');

  const handleAddWorkout = async () => {
    try {
      await addDoc(collection(firestore, 'workouts'), {
        workout,
        reps: parseInt(reps, 10),
        weight: parseInt(weight, 10),
        comments,
        oneRepMax: parseInt(oneRepMax, 10),
        date: new Date(),
      });
      // Clear the form after adding the workout
      setWorkout('');
      setReps('');
      setWeight('');
      setComments('');
      setOneRepMax('');
    } catch (error) {
      console.error("Error adding workout: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add New Workout</Text>
      <TextInput
        style={styles.input}
        placeholder="Workout (e.g., bench, squats)"
        value={workout}
        onChangeText={setWorkout}
      />
      <TextInput
        style={styles.input}
        placeholder="Reps"
        value={reps}
        onChangeText={setReps}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Weight"
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Comments"
        value={comments}
        onChangeText={setComments}
      />
      <TextInput
        style={styles.input}
        placeholder="1RM"
        value={oneRepMax}
        onChangeText={setOneRepMax}
        keyboardType="numeric"
      />
      <Button title="Add Workout" onPress={handleAddWorkout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default AddWorkout;
