import React, { useState, useEffect, useRef } from 'react';
import { Image, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View, FlatList, Animated, Alert, Keyboard, Modal } from 'react-native';
import { db } from './firebase';
import { collection, query, getDocs, orderBy, addDoc, serverTimestamp } from 'firebase/firestore'; 
import styles from './style.js'; 
import { SwipeListView } from 'react-native-swipe-list-view';


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
      <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate('ViewAchievements')} activeOpacity={0.2}>
        <Text style={styles.buttonText}>View Achievements</Text>
      </TouchableOpacity>
      <Text>{'\n\n'}</Text>
      <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate('CreateGoal')} activeOpacity={0.2}>
        <Text style={styles.buttonText}>Create Goal</Text>
      </TouchableOpacity>
      <Text>{'\n\n'}</Text>
      <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate('ViewGoals')} activeOpacity={0.2}>
        <Text style={styles.buttonText}>View Goals</Text>
      </TouchableOpacity>
    </View>
  );
};

// view achievemnets button with flip animation for each achievement
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

// create goal button
const addGoal = async (goal) => {
  try {
    await addDoc(collection(db, 'goals'), {
      goal,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    throw new Error('Failed to save goal: ' + error.message);
  }
};


const CreateGoalForm = () => {
  const [goal, setGoal] = useState('');
  const inputRef = useRef(null);

  const saveGoal = async () => {
    if (!goal.trim()) {
      Alert.alert('Error', 'Goal cannot be empty.');
      return;
    }

    try {
      await addGoal(goal); // Save goal to Firestore
      Alert.alert('success', 'goal saved!✅');
      setGoal(''); // Clear input
      inputRef.current?.blur();
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 15, marginBottom: 300 }}>
      <Text>Create a goal of your own</Text>
      <TextInput
        ref={inputRef}
        style={styles.input}
        placeholder="Squat 200lbs"
        placeholderTextColor="grey"
        value={goal}
        onChangeText={setGoal}
      />
      <TouchableOpacity style={styles.buttonContainer} onPress={saveGoal} activeOpacity={0.5}>
      <Text style={styles.buttonText}>save goal</Text>
      </TouchableOpacity>
    </View>
    </TouchableWithoutFeedback>
  );
};

// view goals button
const ViewGoalsForm = () => {
  const [goals, setGoals] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const q = query(collection(db, "goals"), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);

        const goalsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          text: doc.data().goal,
          date: doc.data().timestamp?.toDate() ?? null
        }));

        setGoals(goalsData);
      } catch (error) {
        Alert.alert("Error", error.message);
      }
    };

    fetchGoals();
  }, []);

  const handleDelete = async (id) => {
    Alert.alert("Delete Goal?", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteDoc(doc(db, "goals", id));
          setGoals(prev => prev.filter(g => g.id !== id));
          setModalVisible(false);
        }
      }
    ]);
  };

  const openModal = (item) => {
    setSelectedGoal(item);
    setModalVisible(true);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => openModal(item)}>
      <View style={styles.goalCard}>
        <Text style={styles.goalText}>{item.text}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.goalsContainer}>
      <Text style={styles.goalsHeader}>Your Goals 🎯</Text>

      <SwipeListView
        data={goals}
        contentContainerStyle={styles.listContentContainer}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        rightOpenValue={-150}
        disableRightSwipe
      />

      {/* Modal for goal details */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalGoalText}>{selectedGoal?.text}</Text>
            <Text style={styles.modalDate}>
              {selectedGoal?.date
                ? selectedGoal.date.toLocaleString()
                : "No date recorded"}
            </Text>

            <TouchableOpacity
              style={[styles.deleteBtn]}
              onPress={() => handleDelete(selectedGoal?.id)}
            >
              <Text style={styles.deleteText}>Delete Goal</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelText}>Close</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>
    </View>
  );
};


export { AchievementsForm, ViewAchievementsForm, ViewGoalsForm, CreateGoalForm};