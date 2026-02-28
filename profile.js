// can edit profile and settings, update profile pic, and can logout

import React, { useEffect, useState } from 'react';
import { View, Image, TouchableOpacity, Alert, ScrollView, Switch, Modal, Text, TextInput, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import styles from './style.js';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

import { auth, db } from './firebase';
import { onAuthStateChanged, signOut, deleteUser } from 'firebase/auth';
import { doc, getDoc, updateDoc, deleteDoc, collection, getDocs } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
  const navigation = useNavigation();

  const defaultPic = Image.resolveAssetSource(require('./assets/blankProfilePic.webp')).uri;
  const [pic, setPic] = useState({ uri: defaultPic });

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [weightModalVisible, setWeightModalVisible] = useState(false);
  const [heightModalVisible, setHeightModalVisible] = useState(false);
  const [weightPickerValue, setWeightPickerValue] = useState(150);
  const [weightUnit, setWeightUnit] = useState('lbs');
  const [heightPickerValue, setHeightPickerValue] = useState(170);
  const [heightUnit, setHeightUnit] = useState('cm');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [publicP, setPublicP] = useState(false);  // true = public profile
  const [units, setUnits] = useState(true);   // true = lbs
  const [isProfileModalVisible, setProfileModalVisible] = useState(false);
  const [isSettingsModalVisible, setSettingsModalVisible] = useState(false);
  const [isLearnModalVisible, setLearnModalVisible] = useState(false);

  const [uid, setUid] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      try {
        if (!user) {
          setUid(null);
          setName('');
          setEmail('');
          setHeight('');
          setWeight('');
          setGender('');
          setDob('');
          setPublicP(false);
          setUnits(true);
          setPic({ uri: defaultPic });
          setLoadingProfile(false);
          return;
        }

        setUid(user.uid);

        const ref = doc(db, 'users', user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();

          setName(data.name ?? '');
          setEmail(data.email ?? user.email ?? '');
          setHeight(data.height ?? '');
          setWeight(data.weight ?? '');
          setGender(data.gender ?? '');

          if (data.birthMonth && data.birthDay && data.birthYear) {
            setDob(`${data.birthMonth}/${data.birthDay}/${data.birthYear}`);
          } else {
            setDob(data.dob ?? '');
          }

          setPublicP(Boolean(data.publicProfile));
          setUnits((data.units ?? 'lbs') === 'lbs');

          const url = data.photoURL ?? defaultPic;
          setPic({ uri: url });
        } else {
          setEmail(user.email ?? '');
          setPic({ uri: defaultPic });
        }
      } catch (e) {
        console.error('Error loading profile:', e);
      } finally {
        setLoadingProfile(false);
      }
    });

    return unsub;
  }, []);

  const updatePic = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permission required", "You need to allow access to your photos.");
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setPic({ uri: result.assets[0].uri });
      }
    } catch (e) {
      return;
    }
  };

  const saveProfile = async () => {
    if (!uid) {
      Alert.alert("Not signed in", "Please sign in again.");
      return;
    }

    try {
      const userRef = doc(db, 'users', uid);

      await updateDoc(userRef, {
        name,
        email,
        height,
        weight,
        gender,
        dob,
        photoURL: pic?.uri ?? defaultPic,
      });

      setProfileModalVisible(false);
      Alert.alert("Success", "profile updated!✔️");
    } catch (e) {
      console.error('Error saving profile:', e);
      Alert.alert("Error", "Could not update profile.");
    }
  };

  const saveSettings = async () => {
    if (!uid) {
      Alert.alert("Not signed in", "Please sign in again.");
      return;
    }

    try {
      const userRef = doc(db, 'users', uid);

      await updateDoc(userRef, {
        publicProfile: publicP,
        units: units ? 'lbs' : 'kg',
      });

      setSettingsModalVisible(false);
      Alert.alert("Success ✔️", "settings updated!");
    } catch (e) {
      Alert.alert("Error", "Could not update settings.");
    }
  };

  
  const handleLearnMore = async () => {
    

  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      navigation.reset({
        index: 0,
        routes: [{ name: 'FirstScreen' }],
      });
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete account ⚠️',
      'Are you sure you want to delete your account? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const user = auth.currentUser;
            if (!user) {
              navigation.reset({ index: 0, routes: [{ name: 'FirstScreen' }] });
              return;
            }
            try {
              // Remove the user from Firebase Auth so the email can be reused
              await deleteUser(user);
              // Clear saved login credentials
              await AsyncStorage.multiRemove(['savedEmail', 'savedPassword']);
              // Optionally delete Firestore user data (profile + subcollections)
              const uid = user.uid;
              const workoutsSnap = await getDocs(collection(db, 'users', uid, 'workouts'));
              for (const d of workoutsSnap.docs) {
                await deleteDoc(doc(db, 'users', uid, 'workouts', d.id));
              }
              const goalsSnap = await getDocs(collection(db, 'users', uid, 'goals'));
              for (const d of goalsSnap.docs) {
                await deleteDoc(doc(db, 'users', uid, 'goals', d.id));
              }
              await deleteDoc(doc(db, 'users', uid));
            } catch (e) {
              console.error('Deletion error:', e);
              const msg = e?.message || String(e);
              if (msg.includes('requires-recent-login')) {
                Alert.alert(
                  'Sign in again',
                  'For security, please sign out, sign back in, then try Delete Account again.'
                );
                return;
              }
              Alert.alert('Could not delete account', msg);
              return;
            }
            navigation.reset({
              index: 0,
              routes: [{ name: 'FirstScreen' }],
            });
          },
        },
      ]
    );
  };

  if (loadingProfile) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', padding: 20 }}>
      <TouchableOpacity onPress={updatePic}>
        <Image
          source={{ uri: pic?.uri ?? defaultPic }}
          style={{
            marginTop: 50,
            width: 150,
            height: 150,
            borderRadius: 75,
            marginBottom: 20,
            borderWidth: 3,
            borderColor: '#60B5F9',
          }}
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.ProfileButtonContainer} onPress={() => setProfileModalVisible(true)}>
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.ProfileButtonContainer} onPress={() => setSettingsModalVisible(true)}>
        <Text style={styles.buttonText}>Edit Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.ProfileButtonContainer}> 
          <Text style={styles.buttonText}>Learn More</Text> 
      </TouchableOpacity> 

      <TouchableOpacity style={[styles.ProfileButtonContainer, { backgroundColor: '#FF5757'}]} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.ProfileButtonContainer, { backgroundColor: '#FF5757'}]} onPress={handleDelete}>
        <Text style={styles.buttonText}>Delete Account</Text>
      </TouchableOpacity>

      <Modal style={styles.modal} visible={isProfileModalVisible} animationType="fade" transparent={false}>
        <ScrollView contentContainerStyle={{ padding: 20, alignItems: 'center' }}>
          <Text style={styles.text}>Edit Profile</Text>

          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <TouchableOpacity onPress={updatePic}>
              <Image
                source={{ uri: pic?.uri ?? defaultPic }}
                style={{ width: 120, height: 120, borderRadius: 60 }}
              />
            </TouchableOpacity>
          </View>

          <TextInput placeholderTextColor="#BFBFBF" style={styles.input} value={name} onChangeText={setName} placeholder="Name" />

          <TextInput placeholderTextColor="#BFBFBF" style={styles.input} value={email} onChangeText={setEmail} placeholder="Email" autoCapitalize="none" />

          <TouchableOpacity
          style={[styles.input, { justifyContent: 'center', backgroundColor: "white" }]}
          onPress={() => {

            if (height) {
              const match = height.match(/^(\d+)\s*(cm|in|inches)?$/i);
              if (match) {
                setHeightPickerValue(parseInt(match[1], 10));
                setHeightUnit((match[2] || 'cm').toLowerCase() === 'in' || (match[2] || '').toLowerCase() === 'inches' ? 'in' : 'cm');
              }
            } else {
              setHeightPickerValue(170);
              setHeightUnit('cm');
            }
            setHeightModalVisible(true);
          }}
        >
          <Text style={{ color: height ? 'black' : '#BFBFBF' }}>
            {height || 'Height'}
          </Text>
        </TouchableOpacity>

        {/* Height modal - number + unit pickers -- other modals within a modal must have their modal code within modal tags*/}
      <Modal visible={heightModalVisible} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            backgroundColor: 'rgba(0,0,0,0.4)',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              width: '100%',
              alignItems: 'center',
            }}
          >
            <Text style={[styles.editText, { marginBottom: 8 }]}>Height</Text>
            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
              <Picker
                selectedValue={heightPickerValue}
                onValueChange={setHeightPickerValue}
                style={{ flex: 1, maxWidth: 120 }}
                itemStyle={{ color: 'black', fontFamily: 'Comfortaa-Bold' }}
              >
                {(heightUnit === 'cm'
                  ? Array.from({ length: 151 }, (_, i) => i + 100)
                  : Array.from({ length: 49 }, (_, i) => i + 48)
                ).map((n) => (
                  <Picker.Item key={n} label={String(n)} value={n} />
                ))}
              </Picker>
              <Picker
                selectedValue={heightUnit}
                onValueChange={(unit) => {
                  setHeightUnit(unit);
                  if (unit === 'cm' && (heightPickerValue < 100 || heightPickerValue > 250)) {
                    setHeightPickerValue(170);
                  }
                  if (unit === 'in' && (heightPickerValue < 48 || heightPickerValue > 96)) {
                    setHeightPickerValue(70);
                  }
                }}
                style={{ flex: 1, maxWidth: 100 }}
                itemStyle={{ color: 'black', fontFamily: 'Comfortaa-Bold' }}
              >
                <Picker.Item label="cm" value="cm" />
                <Picker.Item label="in" value="in" />
              </Picker>
            </View>
            <TouchableOpacity
              style={[styles.ProfileButtonContainer, { marginTop: 10 }]}
              onPress={() => {
                setHeight(`${heightPickerValue} ${heightUnit}`);
                setHeightModalVisible(false);
              }}
            >
              <Text style={styles.buttonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
        </Modal>

          <TouchableOpacity
          style={[styles.input, { justifyContent: 'center', backgroundColor: "white" }]}
          onPress={() => {
            if (weight) {
              const match = weight.match(/^(\d+)\s*(lbs|kg)?$/i);
              if (match) {
                setWeightPickerValue(parseInt(match[1], 10));
                setWeightUnit((match[2] || 'lbs').toLowerCase() === 'kg' ? 'kg' : 'lbs');
              }
            } else {
              setWeightPickerValue(150);
              setWeightUnit('lbs');
            }
            setWeightModalVisible(true);
          }}
        >
          <Text style={{ color: weight ? 'black' : '#BFBFBF' }}>
            {weight || 'Weight'}
          </Text>
        </TouchableOpacity>

         {/* Weight modal - number + unit pickers */}
      <Modal visible={weightModalVisible} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            backgroundColor: 'rgba(0,0,0,0.4)',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              width: '100%',
              alignItems: 'center',
            }}
          >
            <Text style={[styles.editText, { marginBottom: 8 }]}>Weight</Text>
            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
              <Picker
                selectedValue={weightPickerValue}
                onValueChange={setWeightPickerValue}
                style={{ flex: 1, maxWidth: 120 }}
                itemStyle={{ color: 'black', fontFamily: 'Comfortaa-Bold' }}
              >
                {Array.from({ length: 281 }, (_, i) => i + 20).map((n) => (
                  <Picker.Item key={n} label={String(n)} value={n} />
                ))}
              </Picker>
              <Picker
                selectedValue={weightUnit}
                onValueChange={setWeightUnit}
                style={{ flex: 1, maxWidth: 100 }}
                itemStyle={{ color: 'black', fontFamily: 'Comfortaa-Bold' }}
              >
                <Picker.Item label="lbs" value="lbs" />
                <Picker.Item label="kg" value="kg" />
              </Picker>
            </View>
            <TouchableOpacity
              style={[styles.ProfileButtonContainer, { marginTop: 10 }]}
              onPress={() => {
                setWeight(`${weightPickerValue} ${weightUnit}`);
                setWeightModalVisible(false);
              }}
            >
              <Text style={styles.buttonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>


          
          <View style={{ marginTop: 30, alignItems: 'center' }}>
            <TouchableOpacity style={[styles.ProfileButtonContainer, { marginBottom: 10 }]} onPress={saveProfile}>
              <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.ProfileButtonContainer, { backgroundColor: '#FF5757' }]} onPress={() => setProfileModalVisible(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>

     

      {/* Settings Modal */}
      <Modal visible={isSettingsModalVisible} animationType='fade' transparent={false}>
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <Text style={styles.text}>Edit Settings</Text>

          <Text style={styles.editText}>Privacy</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
            <Switch
              value={publicP}
              onValueChange={setPublicP}
              trackColor={{ false: '#ccc', true: '#4CAF50' }}
              thumbColor={publicP ? '#fff' : '#f4f3f4'}
            />
            <Text style={{ marginLeft: 10 }}>
              {publicP ? 'Public' : 'Private'}
            </Text>
          </View>

          <Text style={styles.editText}>Units</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
            <Switch
              value={units}
              onValueChange={setUnits}
              trackColor={{ false: '#ccc', true: '#4CAF50' }}
              thumbColor={units ? '#fff' : '#f4f3f4'}
            />
            <Text style={{ marginLeft: 10 }}>
              {units ? 'lbs' : 'kg'}
            </Text>
          </View>

          <View style={{ marginTop: 30, alignItems: 'center' }}>
            <TouchableOpacity style={[styles.ProfileButtonContainer, { marginBottom: 10 }]} onPress={saveSettings}>
              <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.ProfileButtonContainer, { backgroundColor: '#FF5757' }]} onPress={() => setSettingsModalVisible(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>

      {/* Learn More Modal */}
      <Modal visible={isLearnModalVisible} animationType='fade' transparent={false} >
         {/* write stuff about me and why i created app and such */}
      </Modal>
    </ScrollView>
  );
};

export default ProfileScreen;
