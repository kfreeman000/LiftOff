import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import styles from './style.js';

const PRscreen = () => {
  const [selectedExercise, setSelectedExercise] = useState('Bench');
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const workoutRef = collection(db, 'workouts');
        const querySnapshot = await getDocs(workoutRef);

        const workoutsData = querySnapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            ...data,
            date: data.date ? data.date.toDate() : null,
          };
        });

        setWorkouts(workoutsData);
      } catch (e) {
        console.error('Error fetching workouts:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  const best = useMemo(() => {
    const relevant = workouts.filter((w) => w.workout === selectedExercise);

    const candidates = relevant
      .map((w) => {
        const weight = Number(w.weight);
        const reps = Number(w.reps);

        if (!Number.isFinite(weight) || weight <= 0) return null;
        if (!Number.isFinite(reps) || reps <= 0) return null;

        const r = Math.min(reps, 20);
        const oneRM = weight * (1 + r / 30); // Epley

        return {
          oneRM,
          weight,
          reps,
          date: w.date,
          comments: w.comments ?? '',
        };
      })
      .filter(Boolean);

    if (candidates.length === 0) return null;

    const top = candidates.reduce((a, b) => (b.oneRM > a.oneRM ? b : a));
    return {
      ...top,
      oneRM: Math.round(top.oneRM),
    };
  }, [workouts, selectedExercise]);

  return (
    <View style={styles.PRcontainer}>
      <Text style={styles.header}>One Rep Max Calculator📈</Text>

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
        <ActivityIndicator size="large" />
      ) : best ? (
        <View style={{ marginTop: 20 }}>
          <TouchableOpacity style={styles.buttonContainer}>
            <Text style={styles.buttonText}>Calculate</Text>
          </TouchableOpacity>

            <Text style={styles.estimationText}>Estimated {selectedExercise} 1 rep max = </Text>

        </View>
      ) : (
        <Text style={{ marginTop: 20, fontSize: 16 }}>
          No valid {selectedExercise} sets found yet. Log a workout first!
        </Text>
      )}
    </View>
  );
};

export default PRscreen;
