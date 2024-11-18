


import * as ImagePicker from 'expo-image-picker';
import * as SQLite from 'expo-sqlite';
import React, { useState } from 'react';
import { Alert, Button, Image, Keyboard, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

const db = SQLite.openDatabase('workoutDB.db');

const createSchema = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT UNIQUE,
        name TEXT
      )`,
      [],
      (tx, result) => {
        console.log('Users table created or already exists.');
      },
      (tx, error) => {
        console.error('Error creating users table:', error);
      }
    );

    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS workouts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT,
        exercise TEXT,
        reps INTEGER,
        weight INTEGER,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
      )`,
      [],
      (tx, result) => {
        console.log('Workouts table created or already exists.');
      },
      (tx, error) => {
        console.error('Error creating workouts table:', error);
      }
    );
  });
};
createSchema();


const insertWorkoutData = (workout, reps, weight, comments, media) => {
    const userId = 'fakeUser123';

    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO workouts (user_id, exercise, reps, weight, comments, media) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, workout, reps, weight, comments, JSON.stringify(media)], // Convert media array to string
        (tx, result) => {
          console.log('Workout inserted successfully', result);
          Alert.alert('Workout saved successfully!');
        },
        (tx, error) => {
          console.error('Error inserting workout:', error);
          Alert.alert('Error saving workout.');
        }
      );
    });
  };

const insertFakeUser = () => {
    const userId = 'fakeUser123';
    const userName = 'John Doe';
  
    db.transaction(tx => {
      tx.executeSql(
        'INSERT OR IGNORE INTO users (user_id, name) VALUES (?, ?)',
        [userId, userName],
        (tx, result) => {
          console.log('Fake user inserted:', result);
        },
        (tx, error) => {
          console.error('Error inserting fake user:', error);
        }
      );
    });
  };

insertFakeUser();

const WorkoutForm = () => {
    const [workout, setWorkout] = useState(null);
    const [reps, setReps] = useState("");
    const [weight, setWeight] = useState("");
    const [comments, setComments] = useState("");
    const [media, setMedia] = useState(null);
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([
      { label: 'Dead Lift', value: 'deadlift' },
      { label: 'Squats', value: 'squats' },
      { label: 'Bench Press', value: 'Bench' },
      { label: 'Romanian Dead Lift', value: 'RDL' },
    ]);

  const handleFilePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setMedia(result.assets);
    }
  };

  const handleSubmit = async () => {
    if (!workout || !reps || !weight) {
      Alert.alert("Please fill in all required fields: Workout, Reps, Weight.");
      return;
    }

    Keyboard.dismiss();

    insertWorkoutData(workout, reps, weight, comments, media);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={true}>
      <View style={styles.container}>
      <Image 
              source={require('./images/unnamed.png')} 
              style={styles.image} 
            />
      <Text>{'\n'}</Text>
        <Text style={styles.label}>Select Workout</Text>
        <DropDownPicker
          open={open}
          value={workout}
          items={items}
          setOpen={setOpen}
          setValue={setWorkout}
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

        <Text style={styles.label}>Comments</Text>
        <TextInput
          style={styles.input}
          value={comments}
          onChangeText={setComments}
          placeholder="Add any comments"
          multiline
          numberOfLines={4}
        />

        <Button title="Upload Media" onPress={handleFilePick} />
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