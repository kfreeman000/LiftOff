
// can edit profile and settings, update profile pic, and can logout

import React, { useState } from 'react';
import { View, Image, TouchableOpacity, Alert, ScrollView, Switch, Modal, Text, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import styles from './style.js';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const navigation = useNavigation();

  const defaultPic = Image.resolveAssetSource(require('./assets/blankProfilePic.webp')).uri;
  const [pic, setPic] = useState({ uri: defaultPic });

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [publicP, setPublicP] = useState(false);  // true = public profile
  const [units, setUnits] = useState(true);   // true = lbs
  const [isProfileModalVisible, setProfileModalVisible] = useState(false);
  const [isSettingsModalVisible, setSettingsModalVisible] = useState(false);

  const saveProfile = () => {
    setProfileModalVisible(false);
    Alert.alert("success", "profile updated!");
  };

  const saveSettings = () => {
    setSettingsModalVisible(false);
    Alert.alert("success", "settings updated!");
  };

  const updatePic = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permission required", "You need to allow access to your photos.");
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.Images,  // img only
        allowsEditing: true,  // can crop pic
        aspect: [1, 1],  // make it square 
        quality: 1,
      });

      console.log("Picker result:", result);
      if (!result.canceled && result.assets?.length > 0) {
        setPic({ uri: result.assets[0].uri });
      }
    } catch (e) {
        return;
    }
  };


  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', padding: 20 }}>
        <TouchableOpacity onPress={updatePic}>
          <Image
          source={pic}
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

      <TouchableOpacity style={[styles.ProfileButtonContainer, { backgroundColor: '#FF5757'}]} onPress={() => navigation.reset({
        index: 0,
        routes: [{ name: 'FirstScreen' }], })}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>

      <Modal style={styles.modal} visible={isProfileModalVisible} animationType="fade" transparent={false}>
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <Text style={styles.text}>Edit Profile</Text>

          <Text style={styles.editText}>Name</Text>
          <TextInput placeholderTextColor="#BFBFBF" style={styles.input} value={name} onChangeText={setName} placeholder="Name" />

          <Text style={styles.editText}>Email</Text>
          <TextInput placeholderTextColor="#BFBFBF" style={styles.input} value={email} onChangeText={setEmail} placeholder="Email" />

          <Text style={styles.editText}>Height</Text>
          <TextInput placeholderTextColor="#BFBFBF" style={styles.input} value={height} keyboardType='numeric' onChangeText={setHeight} placeholder="Height" />

          <Text style={styles.editText}>Weight</Text>
          <TextInput placeholderTextColor="#BFBFBF" style={styles.input} value={weight} keyboardType='numeric' onChangeText={setWeight} placeholder="Weight" />

          <Text style={styles.editText}>Gender</Text>
          <TextInput placeholderTextColor="#BFBFBF" style={styles.input} value={gender} onChangeText={setGender} placeholder="Gender" />

          <Text style={styles.editText}>Birthday</Text>
          <TextInput placeholderTextColor="#BFBFBF" style={styles.input} value={dob} onChangeText={setDob} placeholder="Birthday" />

          
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
            value={publicP}               // Boolean state
            onValueChange={setPublicP}    // Toggles true/false
            trackColor={{ false: '#ccc', true: '#4CAF50' }} // Gray for off, green for on
            thumbColor={publicP ? '#fff' : '#f4f3f4'}        // Small circle color
          />
          <Text style={{ marginLeft: 10 }}>
            {publicP ? 'Public' : 'Private'}
          </Text>
          </View>

          <Text style={styles.editText}>Units</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
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
    </ScrollView>
  );
};

export default ProfileScreen;
