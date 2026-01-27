import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { auth, db } from './firebase';
import { doc, getDoc, collection, query, orderBy, limit, getDocs, addDoc } from 'firebase/firestore';

const FriendProfile = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { friendUid, friendName, friendPhotoURL, friendCreatedAt, lastWorkout: initialLastWorkout } = route.params || {};

  const [loading, setLoading] = useState(true);
  const [friendData, setFriendData] = useState(null);
  const [lastWorkout, setLastWorkout] = useState(initialLastWorkout || null);
  const [isFriend, setIsFriend] = useState(false);

  const defaultPic = Image.resolveAssetSource(require('./assets/blankProfilePic.webp')).uri;

  useEffect(() => {
    loadFriendProfile();
    checkIfFriend();
  }, [friendUid]);

  const loadFriendProfile = async () => {
    try {
      setLoading(true);
      
      if (!friendUid) {
        Alert.alert('Error', 'Friend information not available');
        navigation.goBack();
        return;
      }

      // Get user data
      const userRef = doc(db, 'users', friendUid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        Alert.alert('Error', 'User not found');
        navigation.goBack();
        return;
      }

      const userData = userSnap.data();

      // Check if profile is public
      if (!userData.publicProfile) {
        Alert.alert('Private Profile', 'This profile is private');
        navigation.goBack();
        return;
      }

      // Get last workout if not provided
      let workout = lastWorkout;
      if (!workout) {
        workout = await getLastWorkout(friendUid);
      }

      setFriendData({
        name: userData.name || 'Unknown',
        photoURL: userData.photoURL || defaultPic,
        createdAt: userData.createdAt,
      });
      setLastWorkout(workout);
    } catch (error) {
      console.error('Error loading friend profile:', error);
      Alert.alert('Error', 'Failed to load profile');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const getLastWorkout = async (uid) => {
    try {
      const workoutsRef = collection(db, 'users', uid, 'workouts');
      const q = query(workoutsRef, orderBy('date', 'desc'), limit(1));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const workout = querySnapshot.docs[0].data();
        return {
          workout: workout.workout,
          date: workout.date?.toDate(),
          weight: workout.weight,
          reps: workout.reps,
          sets: workout.sets,
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting last workout:', error);
      return null;
    }
  };

  const checkIfFriend = async () => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid || !friendUid) return;

      const friendsRef = collection(db, 'users', uid, 'friends');
      const querySnapshot = await getDocs(friendsRef);

      const isAlreadyFriend = querySnapshot.docs.some(
        (doc) => doc.data().friendUid === friendUid
      );

      setIsFriend(isAlreadyFriend);
    } catch (error) {
      console.error('Error checking if friend:', error);
    }
  };

  const addFriend = async () => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) {
        Alert.alert('Error', 'You must be signed in to add friends');
        return;
      }

      // Check if already a friend
      const friendsRef = collection(db, 'users', uid, 'friends');
      const querySnapshot = await getDocs(friendsRef);

      const isAlreadyFriend = querySnapshot.docs.some(
        (doc) => doc.data().friendUid === friendUid
      );

      if (isAlreadyFriend) {
        Alert.alert('Already Added', 'This user is already in your friends list');
        return;
      }

      // Add friend
      await addDoc(friendsRef, {
        friendUid: friendUid,
        addedAt: new Date(),
      });

      setIsFriend(true);
      Alert.alert('Success', 'Friend added!');
    } catch (error) {
      console.error('Error adding friend:', error);
      Alert.alert('Error', 'Failed to add friend');
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
      return 'Unknown';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!friendData) {
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <Image
          source={{ uri: friendData.photoURL || defaultPic }}
          style={styles.profileImage}
        />
        <Text style={styles.name}>{friendData.name}</Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Account Information</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Sign Up Date:</Text>
          <Text style={styles.infoValue}>
            {formatDate(friendData.createdAt)}
          </Text>
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Last Workout</Text>
        {lastWorkout ? (
          <View style={styles.workoutCard}>
            <Text style={styles.workoutType}>{lastWorkout.workout}</Text>
            <View style={styles.workoutDetails}>
              {lastWorkout.weight && (
                <Text style={styles.workoutDetail}>Weight: {lastWorkout.weight}</Text>
              )}
              {lastWorkout.sets && (
                <Text style={styles.workoutDetail}>Sets: {lastWorkout.sets}</Text>
              )}
              {lastWorkout.reps && (
                <Text style={styles.workoutDetail}>Reps: {lastWorkout.reps}</Text>
              )}
              {lastWorkout.date && (
                <Text style={styles.workoutDate}>
                  {lastWorkout.date.toLocaleDateString()}
                </Text>
              )}
            </View>
          </View>
        ) : (
          <Text style={styles.noWorkoutText}>No workouts logged yet</Text>
        )}
      </View>

      {!isFriend && (
        <TouchableOpacity style={styles.addButton} onPress={addFriend}>
          <Text style={styles.addButtonText}>Add Friend</Text>
        </TouchableOpacity>
      )}

      {isFriend && (
        <View style={styles.friendBadge}>
          <Text style={styles.friendBadgeText}>✓ In Your Friends List</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHeader: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: 'white',
    marginBottom: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#60B5F9',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  infoSection: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 20,
    marginHorizontal: 20,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#60B5F9',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 16,
    color: 'grey',
  },
  infoValue: {
    fontSize: 16,
    color: 'black',
    fontWeight: '500',
  },
  workoutCard: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  workoutType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#60B5F9',
    marginBottom: 10,
  },
  workoutDetails: {
    marginTop: 5,
  },
  workoutDetail: {
    fontSize: 14,
    color: 'black',
    marginBottom: 5,
  },
  workoutDate: {
    fontSize: 12,
    color: 'grey',
    marginTop: 10,
    fontStyle: 'italic',
  },
  noWorkoutText: {
    fontSize: 14,
    color: 'grey',
    fontStyle: 'italic',
  },
  addButton: {
    backgroundColor: '#60B5F9',
    padding: 15,
    borderRadius: 32,
    margin: 20,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Comfortaa-Bold',
  },
  friendBadge: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 32,
    margin: 20,
    alignItems: 'center',
  },
  friendBadgeText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FriendProfile;
