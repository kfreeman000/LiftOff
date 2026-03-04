// submit workouts button 

import { addDoc, getDocs, doc, collection, getDoc } from 'firebase/firestore';
import React, { useState, useRef, useEffect } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, View} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { db, auth } from './firebase'; 
import styles from './style';
import { maybeAwardWorkoutAchievements } from './achievements';
import { kgToLbs } from './utils';

const AddWorkout = () => {
  const [workout, setWorkout] = useState('Bench');
  const [reps, setReps] = useState('');
  const [sets, setSets] = useState('');
  const [weight, setWeight] = useState('');
  const [comments, setComments] = useState('');
  const inputRef = useRef(null);
  const [units, setUnits] = useState('lbs'); // 'lbs' or 'kg'

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const uid = auth.currentUser?.uid;
        if (!uid) return;
        const userRef = doc(db, 'users', uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const data = snap.data();
          const u = (data.units ?? 'lbs');
          setUnits(u === 'kg' ? 'kg' : 'lbs');
        }
      } catch (e) {
        console.log('Error fetching user units:', e);
      }
    };
    fetchUnits();
  }, []);
  

  const handleAddWorkout = async () => {
    if (!workout) {
        Alert.alert('Please select a workout type ❌');
          return;
    }
    if (!weight.trim()) {
      Alert.alert('Please log weight used ❌');
      return;
    }
  const repsValue = reps.trim() ? parseInt(reps, 10) : 'unknown';
  const setsValue = sets.trim() ? parseInt(sets, 10) : 'unknown';

    try {
      const uid = auth.currentUser?.uid;
      if (!uid) {
        Alert.alert('Error', 'You must be signed in to add a workout.');
        return;
      }

      const locationToStore = collection(db, "users", uid, "workouts");
      const existing = await getDocs(locationToStore);

      const rawWeight = Number(weight);
      if (!Number.isFinite(rawWeight) || rawWeight <= 0) {
        Alert.alert('Please enter a valid weight ❌');
        return;
      }

      const weightLbs = units === 'kg' ? kgToLbs(rawWeight) : rawWeight;

      console.log("WORKOUT OBJECT:", {
        workout,
        reps: repsValue,
        sets: setsValue,
        weight: weightLbs,
        date: new Date(),
        comments,
      });

      await maybeAwardWorkoutAchievements(uid, workout, weightLbs);

      await addDoc(locationToStore, {
        workout,
        reps: repsValue,
        sets: setsValue,
        weight: weightLbs,
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
    <View style={{ flex: 1, padding: 8, backgroundColor: 'white'}}>
      <Text style={styles.header}>Add your workout 🏅</Text>
    <View style={styles.submitContainer}>
      
      <Picker
              selectedValue={workout}
              onValueChange={(itemValue) => setWorkout(itemValue)}
              style={{ width: '80%', marginVertical: 10 }}
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
        placeholder={units === 'kg' ? 'Weight (kg)' : 'Weight (lbs)'}
        placeholderTextColor="#BFBFBF"
        value={weight}
        onChangeText={setWeight}
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
        placeholder="Reps"
        placeholderTextColor="#BFBFBF"
        value={reps}
        onChangeText={setReps}
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
