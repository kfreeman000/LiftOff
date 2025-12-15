import React, { useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  Switch,
  Text,
  TextInput
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import styles from './style';

/**
 * CREATE ACCOUNT SCREEN
 */
export default function CreateAcc() {
  // ---------- Profile picture ----------
  const defaultPic = Image.resolveAssetSource(
    require('./assets/blankProfilePic.webp')
  ).uri;

  const [pic, setPic] = useState({ uri: defaultPic });

  // ---------- User info ----------
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');

  // ---------- Preferences ----------
  const [publicProfile, setPublicProfile] = useState(false);
  const [units, setUnits] = useState(true); // true = lbs, false = kg

  // ---------- Pick profile picture ----------
  const updatePic = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        'Permission required',
        'You need to allow access to your photos.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setPic({ uri: result.assets[0].uri });
    }
  };

  // ---------- Submit profile ----------
  const saveProfile = () => {
    if (!name || !email) {
      Alert.alert('Missing info', 'Name and email are required.');
      return;
    }

    const profileData = {
      name,
      email,
      height,
      weight,
      gender,
      dob,
      publicProfile,
      units: units ? 'lbs' : 'kg',
      pic,
    };

    console.log('Profile saved:', profileData);
    Alert.alert('Success', 'Profile created!');
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.text}>Create Profile</Text>

      {/* Profile Picture */}
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <TouchableOpacity onPress={updatePic}>
          <Image
            source={{ uri: pic.uri }}
            style={{ width: 120, height: 120, borderRadius: 60 }}
          />
          <Text style={{ marginTop: 10, color: '#60B5F9' }}>
            Change Profile Picture
          </Text>
        </TouchableOpacity>
      </View>

      {/* Inputs */}
      <Text style={styles.editText}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="#BFBFBF"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.editText}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#BFBFBF"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.editText}>Height</Text>
      <TextInput
        style={styles.input}
        placeholder="Height"
        placeholderTextColor="#BFBFBF"
        keyboardType="numeric"
        value={height}
        onChangeText={setHeight}
      />

      <Text style={styles.editText}>Weight</Text>
      <TextInput
        style={styles.input}
        placeholder="Weight"
        placeholderTextColor="#BFBFBF"
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
      />

      <Text style={styles.editText}>Gender</Text>
      <TextInput
        style={styles.input}
        placeholder="Gender"
        placeholderTextColor="#BFBFBF"
        value={gender}
        onChangeText={setGender}
      />

      <Text style={styles.editText}>Birthday</Text>
      <TextInput
        style={styles.input}
        placeholder="MM/DD/YYYY"
        placeholderTextColor="#BFBFBF"
        value={dob}
        onChangeText={setDob}
      />

      {/* Privacy */}
      <Text style={styles.editText}>Privacy</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
        <Switch
          value={publicProfile}
          onValueChange={setPublicProfile}
        />
        <Text style={{ marginLeft: 10 }}>
          {publicProfile ? 'Public' : 'Private'}
        </Text>
      </View>

      {/* Units */}
      <Text style={styles.editText}>Units</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 30 }}>
        <Switch
          value={units}
          onValueChange={setUnits}
        />
        <Text style={{ marginLeft: 10 }}>
          {units ? 'lbs' : 'kg'}
        </Text>
      </View>

      {/* Submit */}
      <View style={{ alignItems: 'center' }}>
        <TouchableOpacity
          style={styles.ProfileButtonContainer}
          onPress={saveProfile}
        >
          <Text style={styles.buttonText}>Complete</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};


