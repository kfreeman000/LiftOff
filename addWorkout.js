// submit workouts button 

import { addDoc, collection } from 'firebase/firestore';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View, Alert} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { db } from './firebase'; // Your firestore config

const AddWorkout = () => {
  const [workout, setWorkout] = useState("Bench");
  const [reps, setReps] = useState('');
  const [sets, setSets] = useState('');
  const [weight, setWeight] = useState('');
  const [comments, setComments] = useState('');
  

  const handleAddWorkout = async () => {
    try {
      await addDoc(collection(db, 'workouts'), {
        workout,
        reps: parseInt(reps, 10),  // parseInt takes a string and turns it into a base-10 integer
        sets: parseInt(sets, 10),
        weight: parseInt(weight, 10),
        comments,
        date: new Date(),
      });
      Alert.alert("workout stored 🔥");
      // Clear the form after adding the workout
      setWorkout('');
      setReps('');
      setSets('');
      setWeight('');
      setComments('');
      
    } catch (error) {
      console.error("Error adding workout: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add your workout🏅</Text>
      <Picker
              selectedValue={workout}
              onValueChange={(itemValue) => setWorkout(itemValue)}
              style={{ width: '100%', marginVertical: 10 }}
              itemStyle={{ color: 'black', fontFamily: 'Comfortaa-Bold' }}
              >
                <Picker.Item  label="Bench" value="Bench" />
                <Picker.Item  label="Squat" value="Squat" />
                <Picker.Item  label="Deadlift" value="Deadlift" />
                <Picker.Item  label="Row" value="Row" />
      </Picker>
      <TextInput
        style={styles.input}
        placeholder="Reps"
        placeholderTextColor="#BFBFBF"
        value={reps}
        onChangeText={setReps}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Sets"
        placeholderTextColor="#BFBFBF"
        value={sets}
        onChangeText={setSets}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Weight"
        placeholderTextColor="#BFBFBF"
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Comments"
        placeholderTextColor="#BFBFBF"
        value={comments}
        onChangeText={setComments}
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
