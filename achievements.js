import React, { useState, useEffect, useRef } from 'react';
import { Image, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View, FlatList, Animated, Alert, Keyboard, Modal } from 'react-native';
import { db, auth } from './firebase';
import { collection, query, getDocs, getDoc, updateDoc, orderBy, addDoc, serverTimestamp, deleteDoc, doc, limit, where } from 'firebase/firestore'; 
import styles from './style.js'; 
import { SwipeListView } from 'react-native-swipe-list-view';


const achievements = [
  { key: '1', title: 'Muscle Power', details: 'You increased weight in a workout!', image: require('./assets/mp.jpg') },
  { key: '2', title: 'Getting Started', details: 'You logged your first workout!', image: require('./assets/first.png') },
  { key: '3', title: 'Goal Setter', details: 'You logged your first goal!', image: require('./assets/gs.png') },
  { key: '4', title: 'Friend Finder', details: 'Your first friend was added!', image: require('./assets/friend.png')},
  { key: '5', title: 'Community Driven', details: 'At least 10 friends have been added!', image: require('./assets/community.png')}
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


async function AwardAchievement(uid, key) { // for achievements page; still need functions for each specific achievement
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) return;

  const achievements = snap.data().achievements || {};

  if (achievements[key]) return; //already earned 

  await updateDoc(userRef, {
    [`achievements.${key}`]: true,
  });
}

async function maybeAwardWorkoutAchievements(uid, exerciseName, newWeight) {
  const workoutsRef = collection(db, "users", uid, "workouts");

  const q = query(
    workoutsRef,
    where("workout", "==", exerciseName),
    orderBy("weight", "desc"),
    limit(1)
  );

  const snap = await getDocs(q);

  // GETTING STARTED
  const allSnap = await getDocs(workoutsRef);
  if (allSnap.size === 0) {
    await AwardAchievement(uid, '2');
  }

  // MUSCLE POWER
  if (!snap.empty) {
    const prevMax = Number(snap.docs[0].data().weight);

    if (newWeight > prevMax) {
      await AwardAchievement(uid, '1');
    }
  }
}


async function GoalSetter_achievement(uid, key) {
  await AwardAchievement(uid, key);
}

async function getEarnedAchievements(uid) {
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) return {};

  return snap.data().achievements || {};
}



// view achievemnets button with flip animation for each achievement
const ViewAchievementsForm = () => {


  const flipAnim = useRef({}).current;
  const [flippedCards, setFlippedCards] = useState({});
  const [earned, setEarned] = useState({}); // how many achievements are shown 

  useEffect(() => {
    achievements.forEach((item) => {
      if (!flipAnim[item.key]) {
        flipAnim[item.key] = new Animated.Value(0);
      }
    });
  }, []);

  const uid = auth.currentUser?.uid;
  useEffect(() => {
    
    if (uid) {
      getEarnedAchievements(uid).then(setEarned);
    }
      }, []);

  const earnedList = achievements.filter(a => earned[a.key]);

  const flipCard = (key) => {
    const isFlipped = flippedCards[key] || false;

    Animated.timing(flipAnim[key], {
      toValue: isFlipped ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setFlippedCards((prev) => ({ ...prev, [key]: !isFlipped }));
  };

  const renderCard = ({ item }) => {
    if (!flipAnim[item.key]) {
      flipAnim[item.key] = new Animated.Value(0);
    }

    const frontOpacity = flipAnim[item.key].interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    });

    const backOpacity = flipAnim[item.key].interpolate({
      inputRange: [0, 0.01, 1],
      outputRange: [0, 0, 1],
    });

    return (
      <TouchableOpacity onPress={() => flipCard(item.key)} style={styles.container}>
        <Animated.View style={[styles.cardFace, { opacity: frontOpacity }]}>
          <Text style={styles.achievementTitle}>{item.title}</Text>
          <Image source={item.image} style={styles.achievementImage} />
        </Animated.View>

        <Animated.View style={[styles.cardFace, { opacity: backOpacity, backgroundColor: '#56c5f5', borderRadius:10, borderWidth: 1, borderColor: 'white', padding: 10}]}>
          <Text style={{ fontSize: 18, color: 'white', fontFamily: 'Comfortaa-Bold', fontWeight: 'bold' }}>{item.details}</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {earnedList.length === 0 && (
        <Text style={{ fontStyle: 'italic' }}>
          no achievements yet
        </Text>
      )}

      <FlatList 
        data={earnedList}
        keyExtractor={(item) => item.key}
        renderItem={renderCard}
      />
    </View>
  );
};

// ADD GOALS
const addGoal = async (goal) => {
  const uid = auth.currentUser?.uid;
   
  try {
  
    if (!uid) {
      throw new Error('You must be signed in to create a goal.');
    }
    await addDoc(collection(db, "users", uid, "goals"), {
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

      const uid = auth.currentUser?.uid;
      const goalsRef = collection(db, "users", uid, "goals");
      const goalsSnap = await getDocs(goalsRef);
      
      await addGoal(goal); // Save goal to Firestore
      Alert.alert('success', 'goal saved!✅');

      if (goalsSnap.size == 0) {
        await GoalSetter_achievement(uid, '3');
      }  

      setGoal(''); // Clear input
      
      inputRef.current?.blur();
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 15, backgroundColor: 'white' }}>
      <Text style={styles.header}>Create a goal of your own 💭</Text>
      <TextInput
        ref={inputRef}
        style={styles.input}
        placeholder="Squat 200lbs"
        placeholderTextColor="grey"
        value={goal}
        onChangeText={setGoal}
      />
      <TouchableOpacity style={styles.buttonContainer} onPress={saveGoal} activeOpacity={0.5}>
      <Text style={styles.buttonText}>save</Text>
      </TouchableOpacity>
    </View>
    </TouchableWithoutFeedback>
  );
};



// VIEW GOALS 
const ViewGoalsForm = () => {
  const [goals, setGoals] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const uid = auth.currentUser?.uid;
        if (!uid) {
          console.log('No user signed in');
          return;
        }
        const q = query(collection(db, "users", uid, "goals"), orderBy("timestamp", "desc"));
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
          const uid = auth.currentUser?.uid;
          if (!uid) {
            Alert.alert('Error', 'You must be signed in to delete a goal.');
            return;
          }
          await deleteDoc(doc(db, "users", uid, "goals", id));
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
      <Text style={styles.header}>Your Goals 🎯</Text>

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


export { AchievementsForm, ViewAchievementsForm, ViewGoalsForm, CreateGoalForm, AwardAchievement, maybeAwardWorkoutAchievements, GoalSetter_achievement};