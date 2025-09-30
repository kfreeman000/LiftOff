import React, { useState } from 'react';
import { View, Image, TouchableOpacity, Alert, ScrollView, Modal, Text, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import styles from './style.js';

const ProfileScreen = () => {
  const defaultPic = Image.resolveAssetSource(require('./assets/blankProfilePic.webp')).uri;
  const [pic, setPic] = useState({ uri: defaultPic });

  const [name, setName] = useState('Jill Doe');
  const [email, setEmail] = useState('johndoe@example.com');
  const [height, setHeight] = useState("6'0");
  const [weight, setWeight] = useState('180 lbs');
  const [gender, setGender] = useState('Female');
  const [dob, setDob] = useState('12/15/2000');
  const [notificiations, setNot] = useState('ON');
  const [lang, setLang] = useState('English');
  const [publicP, setPublicP] = useState('public');
  const [units, setUnits] = useState('pounds');
  const [isProfileModalVisible, setProfileModalVisible] = useState(false);
  const [isSettingsModalVisible, setSettingsModalVisible] = useState(false);

  const saveProfile = () => {
    setProfileModalVisible(false);
    Alert.alert("Success", "Profile updated!");
  };

  const saveSettings = () => {
    setSettingsModalVisible(false);
    Alert.alert("Success", "Settings updated!");
  };

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

      <TouchableOpacity style={[styles.ProfileButtonContainer, { backgroundColor: '#FF5757'}]}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>

      <Modal style={styles.modal} visible={isProfileModalVisible} animationType="fade" transparent={false}>
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <Text style={styles.text}>Edit Profile</Text>

          <Text style={styles.editText}>Name</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Name" />

          <Text style={styles.editText}>Email</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email" />

          <Text style={styles.editText}>Height</Text>
          <TextInput style={styles.input} value={height} onChangeText={setHeight} placeholder="Height" />

          <Text style={styles.editText}>Weight</Text>
          <TextInput style={styles.input} value={weight} onChangeText={setWeight} placeholder="Weight" />

          <Text style={styles.editText}>Gender</Text>
          <TextInput style={styles.input} value={gender} onChangeText={setGender} placeholder="Gender" />

          <Text style={styles.editText}>Birthday</Text>
          <TextInput style={styles.input} value={dob} onChangeText={setDob} placeholder="Birthday" />

          {/* Buttons stacked in column */}
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

          <Text style={styles.editText}>Notifications</Text>
          <TextInput style={styles.input} value={notificiations} onChangeText={setNot} placeholder="Notifications" />

          <Text style={styles.editText}>Language</Text>
          <TextInput style={styles.input} value={lang} onChangeText={setLang} placeholder="Language" />

          <Text style={styles.editText}>Privacy</Text>
          <TextInput style={styles.input} value={publicP} onChangeText={setPublicP} placeholder="Privacy" />

          <Text style={styles.editText}>Units</Text>
          <TextInput style={styles.input} value={units} onChangeText={setUnits} placeholder="Units" />

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
