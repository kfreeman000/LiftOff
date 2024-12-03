import React, { useState } from 'react';
import { Alert, Button, Image, Keyboard, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { firestore } from './firebase'; // Make sure the path is correct


const WorkoutForm = () => {
  const [workout, setWorkout] = useState(null);
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [comments, setComments] = useState("");
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: 'Dead Lift', value: 'deadlift' },
    { label: 'Squats', value: 'squats' },
    { label: 'Bench Press', value: 'bench' },
    { label: 'Romanian Dead Lift', value: 'rdl' },
  ]);
  const calculate1RM = (weight, reps) => {
    const oneRepMax = weight * (1 + 0.0333 * reps);
    return Math.round(oneRepMax);
  };

  const handleSubmit = async () => {
    if (!workout || !reps || !weight) {
      Alert.alert("Please fill in all required fields: Workout, Reps, Weight.");
      return;
    }

  const oneRepMax = calculate1RM(parseFloat(weight), parseInt(reps));

  const workoutData = {
    workout,
    reps: parseInt(reps),
    weight: parseFloat(weight),
    comments,
    oneRepMax, // Add the 1RM value to the data
    date: Timestamp.now(),
  };

    // Save the workout data to Firestore
    await saveWorkoutToFirestore(workoutData);
    Alert.alert(`Your calculated 1RM is: ${oneRepMax.toFixed(2)}`);
    Keyboard.dismiss();
  };

  const saveWorkoutToFirestore = async (workoutData) => {
    try {
      const workoutRef = collection(firestore, 'workouts');
      const docRef = await addDoc(workoutRef, workoutData);
      console.log('Workout added with ID: ', docRef.id);
    } catch (e) {
      console.error('Error adding workout: ', e);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={true}>
      <View style={styles.container}>
        <Image 
          source={require('./assets/liftoff_logo.png')} 
          style={styles.image} 
        />
        <Text>{'\n'}</Text>
        
        <Text style={styles.label}>Select Workout</Text>
        <DropDownPicker
          open={open}
          value={workout}
          items={items}
          setOpen={setOpen}
          setValue={setWorkout}  // Use setWorkout to update the workout state
          placeholder="Choose a workout"
          containerStyle={{ height: 60, width: '100%' }}
          style={styles.dropdown}
          dropDownStyle={{ backgroundColor: '#fafafa' }}
        />

        <Text style={styles.label}>Reps</Text>
        <TextInput
          style={styles.input}
          value={reps}
          onChangeText={setReps}
          placeholder="Enter number of reps"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Weight (lbs)</Text>
        <TextInput
          style={styles.input}
          value={weight}
          onChangeText={setWeight}
          placeholder="Enter weight used"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Comments (optional)</Text>
        <TextInput
          style={styles.input}
          value={comments}
          onChangeText={setComments}
          placeholder="Enter any comments"
        />

        <Button title="Submit" onPress={handleSubmit} />
      </View>
    </TouchableWithoutFeedback>
  );
};


const styles = StyleSheet.create({
container: {
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
    alignItems: 'center',
    flexDirection: 'column',
},
label: {
    marginBottom: 5,
    fontWeight: 'bold',
},
input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    width: '100%',
},
dropdown: {
    backgroundColor: '#fafafa',
    marginBottom: 30,
},
image: {
    width: 200,
    height: 200,
    marginBottom: 20,
},
},
);

export default WorkoutForm;