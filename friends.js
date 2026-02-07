
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { auth, db } from './firebase';
import { collection, query, where, getDocs, addDoc, doc, getDoc, orderBy, limit } from 'firebase/firestore';

const FriendList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const navigation = useNavigation();

  const defaultPic = Image.resolveAssetSource(require('./assets/blankProfilePic.webp')).uri;

  // Refetch friends whenever this screen comes into focus (e.g. after adding a friend)
  useFocusEffect(
    useCallback(() => {
      loadFriends();
    }, [])
  );

  const loadFriends = async () => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const friendsRef = collection(db, 'users', uid, 'friends');
      const querySnapshot = await getDocs(friendsRef);

      const friendsData = [];
      for (const friendDoc of querySnapshot.docs) {
        const friendData = friendDoc.data();
        const friendUid = friendData.friendUid;
        
        // Get friend's user data
        const userRef = doc(db, 'users', friendUid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists() && userSnap.data().publicProfile) {
          const userData = userSnap.data();
          // Get last workout
          const lastWorkout = await getLastWorkout(friendUid);
          
          friendsData.push({
            id: friendDoc.id,
            uid: friendUid,
            name: userData.name || 'Unknown',
            photoURL: userData.photoURL || defaultPic,
            createdAt: userData.createdAt,
            lastWorkout: lastWorkout,
          });
        }
      }

      setFriends(friendsData);
    } catch (error) {
      console.error('Error loading friends:', error);
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
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting last workout:', error);
      return null;
    }
  };

  const searchUser = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Error', 'Please enter a name to search');
      return;
    }

    setSearching(true);
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) {
        Alert.alert('Error', 'You must be signed in to search for users');
        return;
      }

      // Search for users by name (case-insensitive partial match)
      const usersRef = collection(db, 'users');
      const searchLower = searchQuery.toLowerCase().trim();
      
      // Firestore doesn't support case-insensitive search directly,
      // so we'll get all users and filter (for small datasets this is fine)
      // For production, consider using Algolia or storing lowercase name field
      const querySnapshot = await getDocs(usersRef);
      
      const matchingUsers = [];
      querySnapshot.forEach((docSnap) => {
        const userData = docSnap.data();
        const userName = (userData.name || '').toLowerCase();
        
        // Only include public profiles and exclude current user
        if (
          docSnap.id !== uid &&
          userData.publicProfile === true &&
          userName.includes(searchLower) &&
          userName.trim() !== '' // Ensure name is not empty
        ) {
          matchingUsers.push({
            uid: docSnap.id,
            name: userData.name || 'Unknown',
            photoURL: userData.photoURL || defaultPic,
            createdAt: userData.createdAt,
          });
        }
      });

      if (matchingUsers.length === 0) {
        Alert.alert('Not Found', 'No public profiles found with that name');
        setSearching(false);
        return;
      }

      // If multiple matches, show the first one (or you could show a list to choose from)
      const foundUser = matchingUsers[0];
      
      // Get last workout for the found user
      const lastWorkout = await getLastWorkout(foundUser.uid);
      
      // Navigate to friend profile
      navigation.navigate('FriendProfile', {
        friendUid: foundUser.uid,
        friendName: foundUser.name,
        friendPhotoURL: foundUser.photoURL,
        friendCreatedAt: foundUser.createdAt,
        lastWorkout: lastWorkout,
      });

    } catch (error) {
      console.error('Error searching user:', error);
      Alert.alert('Error', 'Failed to search for user');
    } finally {
      setSearching(false);
    }
  };

  const addFriend = async (friendUid) => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      // Check if already a friend
      const friendsRef = collection(db, 'users', uid, 'friends');
      const querySnapshot = await getDocs(
        query(friendsRef, where('friendUid', '==', friendUid))
      );

      if (!querySnapshot.empty) {
        Alert.alert('Already Added', 'This user is already in your friends list');
        return;
      }

      // Add friend
      await addDoc(friendsRef, {
        friendUid: friendUid,
        addedAt: new Date(),
      });

      Alert.alert('Success', 'Friend added!');
      loadFriends(); // Reload friends list
    } catch (error) {
      console.error('Error adding friend:', error);
      Alert.alert('Error', 'Failed to add friend');
    }
  };

  const handlePress = async (friend) => {
    const lastWorkout = await getLastWorkout(friend.uid);
    navigation.navigate('FriendProfile', {
      friendUid: friend.uid,
      friendName: friend.name,
      friendPhotoURL: friend.photoURL,
      friendCreatedAt: friend.createdAt,
      lastWorkout: lastWorkout,
    });
  };

  const renderFriend = ({ item }) => (
    <TouchableOpacity
      onPress={() => handlePress(item)}
      style={styles.friendContainer}
    >
      <Image
        source={{ uri: item.photoURL }}
        style={styles.friendImage}
      />
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{item.name}</Text>
        {item.lastWorkout && (
          <Text style={styles.lastWorkoutText}>
            Last: {item.lastWorkout.workout} - {item.lastWorkout.date?.toLocaleDateString() || 'Unknown date'}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search for a friend"
        placeholderTextColor="grey"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      
      <TouchableOpacity 
        style={styles.buttonContainer} 
        onPress={searchUser}
        disabled={searching}
      >
        {searching ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Search</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>My Friends</Text>

      {friends.length > 0 ? (
        <FlatList
          data={friends}
          keyExtractor={(item) => item.id}
          renderItem={renderFriend}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      ) : (
        <Text style={styles.emptyText}>No friends yet. Search for users to add them!</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
    marginTop: 70,
  },
  input: {
    color: 'black',
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  friendContainer: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  friendImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
  },
  lastWorkoutText: {
    fontSize: 14,
    color: 'grey',
    marginTop: 4,
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  buttonContainer: {
    justifyContent: 'center',
    width: 200,
    height: 60,
    borderRadius: 32,
    backgroundColor: '#60B5F9',
    overflow: 'hidden',
    alignSelf: 'center',
    marginBottom: 20,
  },
  buttonText: {
    fontFamily: 'Comfortaa-Bold',
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
    color: 'black',
  },
  emptyText: {
    textAlign: 'center',
    color: 'grey',
    marginTop: 20,
    fontSize: 16,
  },
});

export default FriendList;
