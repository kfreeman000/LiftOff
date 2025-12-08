// submit workouts button 

import { addDoc, collection } from 'firebase/firestore';
import React, { useState, useRef } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, View} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { db } from './firebase'; // Your firestore config
import styles from './style';

const AddWorkout = () => {
  const [workout, setWorkout] = useState('Bench');
  const [reps, setReps] = useState('');
  const [sets, setSets] = useState('');
  const [weight, setWeight] = useState('');
  const [comments, setComments] = useState('');
  const inputRef = useRef(null);
  

  const handleAddWorkout = async () => {
    if (!workout) {
        Alert.alert('Please select a workout type ❌');
          return;
    }
    if (!weight.trim()) {
          Alert.alert('please log weight used ❌');
          return;
    }      
  const repsValue = reps.trim() ? parseInt(reps, 10) : 'unknown';
  const setsValue = sets.trim() ? parseInt(sets, 10) : 'unknown';

    try {
      await addDoc(collection(db, 'workouts'), {
      workout,
      reps: repsValue,
      sets: setsValue,
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={{ flex: 1, padding: 15, backgroundColor: 'white'}}>
      <Text style={styles.header}>Add your workout🏅</Text>
    <View style={styles.submitContainer}>
      
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
        ref={inputRef}
        style={styles.input}
        placeholder="Reps"
        placeholderTextColor="#BFBFBF"
        value={reps}
        onChangeText={setReps}
        keyboardType="numeric"
      />
      <TextInput
        ref={inputRef}
        style={styles.input}
        placeholder="Sets"
        placeholderTextColor="#BFBFBF"
        value={sets}
        onChangeText={setSets}
        keyboardType="numeric"
      />
      <TextInput
        ref={inputRef}
        style={styles.input}
        placeholder="Weight"
        placeholderTextColor="#BFBFBF"
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
      />
      <TextInput
        ref={inputRef}
        style={styles.input}
        placeholder="Comments"
        placeholderTextColor="#BFBFBF"
        value={comments}
        onChangeText={setComments}
      />
      <TouchableOpacity style={styles.buttonContainer} onPress={handleAddWorkout}>
        <Text style={styles.buttonText}>submit</Text>
      </TouchableOpacity>  
    </View>
    </View>
    </TouchableWithoutFeedback>
  );
};

export default AddWorkout;
