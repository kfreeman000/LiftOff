import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect } from '@react-navigation/native';
import { auth, db } from "./firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import styles from './style.js';
import { calculate1RM } from './utils';

const PRscreen = () => {
  const [selectedExercise, setSelectedExercise] = useState('Bench');
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchWorkouts = async () => {
      try {
        const uid = auth.currentUser?.uid;
        if (!uid) return;
          const q = query(
          collection(db, "users", uid, "workouts"),
          orderBy("date", "desc")
    );

const querySnapshot = await getDocs(q);

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
    }, [])
  );

  const best = useMemo(() => {
    const relevant = workouts.filter((w) => w.workout === selectedExercise);

    const candidates = relevant
      .map((w) => {
        const weight = Number(w.weight);
        const reps = Number(w.reps);

        if (!Number.isFinite(weight) || weight <= 0) return null;
        if (!Number.isFinite(reps) || reps <= 0) return null;

        const oneRM = calculate1RM(weight, reps);

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

            <Text style={styles.estimationText}>Estimated {selectedExercise} 1 rep max = {best.oneRM} </Text>

        </View>
      ) : (
        <Text style={{ marginTop: 20, fontSize: 16, fontStyle: 'italic' }}>
          No {selectedExercise} sets found yet. Log a workout first!
        </Text>
      )}
    </View>
  );
};

export default PRscreen;
