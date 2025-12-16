import React, { useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  Switch,
  Text,
  TextInput,
  Modal
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import styles from './style';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function CreateAcc() {
  const defaultPic = Image.resolveAssetSource(
    require('./assets/blankProfilePic.webp')
  ).uri;

  const [pic, setPic] = useState({ uri: defaultPic });

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');

  const [publicProfile, setPublicProfile] = useState(false);
  const [units, setUnits] = useState(true);   // true = lbs

  const [genderModalVisible, setGenderModalVisible] = useState(false);

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
      mediaTypes: ImagePicker.MediaTypeOptions.Images,  // img only
      allowsEditing: true,  // can crop pic
      aspect: [1, 1],  // make it square
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setPic({ uri: result.assets[0].uri });
    }
  };

  const saveProfile = () => {
    if (!name || !email || !dob) {
      Alert.alert('Missing info', 'name, email, and date of birth are required.');
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ padding: 20, alignItems: "center" }}>
        <Text style={styles.text}>Create Profile</Text>

        {/* Profile Picture */}
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <TouchableOpacity onPress={updatePic}>
            <Image
              source={{ uri: pic.uri }}
              style={{ width: 120, height: 120, borderRadius: 60 }}
            />
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor="#BFBFBF"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"  // make thing that's like "enter valid email"
          placeholderTextColor="#BFBFBF"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Height"  // make this feet and inches + another unit and make optional
          placeholderTextColor="#BFBFBF"
          keyboardType="numeric"
          value={height}
          onChangeText={setHeight}
        />

        <TextInput
          style={styles.input}
          placeholder="Weight" // make optional
          placeholderTextColor="#BFBFBF"
          keyboardType="numeric"
          value={weight}
          onChangeText={setWeight}
        />

        <TouchableOpacity
          style={styles.input}
          onPress={() => setGenderModalVisible(true)}
          activeOpacity={0.7}
        >
          <Text style={{ color: gender ? 'black' : '#BFBFBF' }}>
            {gender || 'Gender'}
          </Text>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Birthday"
          placeholderTextColor="#BFBFBF"
          value={dob}
          onChangeText={setDob}
        />

        <Text style={styles.editText}>Privacy</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
          <Switch
            value={publicProfile}               // Boolean state
            onValueChange={setPublicProfile}    // Toggles true/false
            trackColor={{ false: '#ccc', true: '#4CAF50' }} // Gray for off, green for on
            thumbColor={publicProfile ? '#fff' : '#f4f3f4'}        // Small circle color
          />
          <Text style={{ marginLeft: 10 }}>
            {publicProfile ? 'Public' : 'Private'}
          </Text>
        </View>

        <Text style={styles.editText}>Units</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 30 }}>
          <Switch
            value={units}                // true = lbs, false = kg
            onValueChange={setUnits}
            trackColor={{ false: '#ccc', true: '#4CAF50' }}
            thumbColor={units ? '#fff' : '#f4f3f4'}
          />
          <Text style={{ marginLeft: 10 }}>
            {units ? 'lbs' : 'kg'}
          </Text>
        </View>

        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity
            style={styles.ProfileButtonContainer}
            onPress={saveProfile}
          >
            <Text style={styles.buttonText}>Complete</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal visible={genderModalVisible} transparent animationType="slide">
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
            <Picker
              selectedValue={gender}
              onValueChange={(value) => setGender(value)}
            >
              <Picker.Item label="Woman" value="Woman" />
              <Picker.Item label="Man" value="Man" />
              <Picker.Item label="Non-binary" value="Non-binary" />
              <Picker.Item label="I don't see my gender" value="Other" />
            </Picker>

            <TouchableOpacity
              style={[styles.ProfileButtonContainer, { marginTop: 10 }]}
              onPress={() => setGenderModalVisible(false)}
            >
              <Text style={styles.buttonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};
