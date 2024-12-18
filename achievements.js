import React, { useState, useEffect, useRef } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, FlatList, Button, Animated, Alert } from 'react-native';
import { firestore } from './firebase.js'; 
import { collection, query, getDocs, orderBy, addDoc, serverTimestamp } from 'firebase/firestore'; 
import styles from './style.js'; 


const achievements = [
  { id: '1', title: 'Muscle Power', details: 'You increased weight in a workout!', image: require('./assets/mp.jpg') },
  { id: '2', title: 'Workout Star', details: 'Completed a five-day workout week!', image: require('./assets/fiveDay.png') },
  { id: '3', title: 'Goal Setter', details: 'You created your own unique goal!', image: require('./assets/gs.png') },
];

const AchievementsForm = ({ navigation }) => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', paddingTop: 0 }}>
      <Image source={require('./assets/liftoff_logo.png')} style={{ width: 200, height: 200, position: 'absolute', top: 30 }} />
      <Text>{'\n\n'}{'\n\n'}{'\n\n'}{'\n\n'}{'\n\n'}</Text>
      <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate('View Achievements')} activeOpacity={0.2}>
        <Text style={styles.buttonText}>View Achievements</Text>
      </TouchableOpacity>
      <Text>{'\n\n'}</Text>
      <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate('Create Goal')} activeOpacity={0.2}>
        <Text style={styles.buttonText}>Create Goal</Text>
      </TouchableOpacity>
      <Text>{'\n\n'}</Text>
      <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate('View Goals')} activeOpacity={0.2}>
        <Text style={styles.buttonText}>View Goals</Text>
      </TouchableOpacity>
    </View>
  );
};

// View Achievements Form with flip animation for each achievement
const ViewAchievementsForm = () => {
  const flipAnim = useRef({}).current;
  const [flippedCards, setFlippedCards] = useState({});

  useEffect(() => {
    achievements.forEach((item) => {
      if (!flipAnim[item.id]) {
        flipAnim[item.id] = new Animated.Value(0);
      }
    });
  }, []);

  const flipCard = (id) => {
    const isFlipped = flippedCards[id] || false;

    Animated.timing(flipAnim[id], {
      toValue: isFlipped ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setFlippedCards((prev) => ({ ...prev, [id]: !isFlipped }));
  };

  const renderCard = ({ item }) => {
    if (!flipAnim[item.id]) {
      flipAnim[item.id] = new Animated.Value(0);
    }

    const frontOpacity = flipAnim[item.id].interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    });

    const backOpacity = flipAnim[item.id].interpolate({
      inputRange: [0, 0.01, 1],
      outputRange: [0, 0, 1],
    });

    return (
      <TouchableOpacity onPress={() => flipCard(item.id)} style={{ width: 150, height: 150, margin: 10 }}>
        <Animated.View style={[styles.cardFace, { opacity: frontOpacity }]}>
          <Text style={styles.achievementTitle}>{item.title}</Text>
          <Image source={item.image} style={styles.achievementImage} />
        </Animated.View>

        <Animated.View style={[styles.cardFace, { opacity: backOpacity, backgroundColor: '#ccc' }]}>
          <Text style={{ fontSize: 18 }}>{item.details}</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={achievements}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
      />
    </View>
  );
};

const addGoal = async (goal) => {
  try {
    await addDoc(collection(firestore, 'goals'), {
      goal,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    throw new Error('Failed to save goal: ' + error.message);
  }
};


const CreateGoalForm = ({ navigation }) => {
  const [goal, setGoal] = useState('');

  const saveGoal = async () => {
    if (!goal.trim()) {
      Alert.alert('Error', 'Goal cannot be empty.');
      return;
    }

    try {
      await addGoal(goal); // Save goal to Firestore
      Alert.alert('Success', 'Goal saved!');
      setGoal(''); // Clear input
      navigation.navigate('View Goals'); // Navigate to the View Goals screen
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Create a goal of your own</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your goal"
        value={goal}
        onChangeText={setGoal}
      />
      <Button title="Save Goal" onPress={saveGoal} />
    </View>
  );
};


const ViewGoalsForm = () => {
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const q = query(collection(firestore, 'goals'), orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(q);
        const goalsArray = querySnapshot.docs.map((doc) => doc.data().goal);
        setGoals(goalsArray);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch goals: ' + error.message);
      }
    };

    fetchGoals();
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Check out your goals</Text>
      <FlatList
        data={goals}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text style={styles.goalItem}>{item}</Text>}
      />
    </View>
  );
};

export { AchievementsForm, ViewAchievementsForm, ViewGoalsForm, CreateGoalForm};