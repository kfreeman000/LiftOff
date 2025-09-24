import React, { useState } from 'react';
import { View, Image, TouchableOpacity, Alert, ScrollView, Modal, Text, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import styles from './style.js';


const ProfileScreen = () => {
      const [pic, setPic] = useState('./assets/blankProfilePic.webp');
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
      if (permissionResult.granted === false) {
        Alert.alert("Permission required", "You need to allow access to your photos.");
        return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      allowsEditing: true,   // crop
      aspect: [1, 1],        // square profile pic
      quality: 1,
    });

      if (!result.canceled) {
        setProfilePic(result.assets[0].uri);
    }
  };
      
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', padding: 20 }}>
      <Image source={require('./assets/blankProfilePic.webp')} onPress={() => updatePic()}
      style={{
        marginTop: 50, 
        width: 150, 
        height: 150, 
        borderRadius: 75,
        marginBottom: 20,
        borderWidth: 3,
        borderColor: '#60B5F9', 
      }}/>


  
      <TouchableOpacity style={styles.ProfileButtonContainer} onPress={() => setProfileModalVisible(true)}>
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.ProfileButtonContainer} onPress={() => setSettingsModalVisible(true)}>
        <Text style={styles.buttonText}>Edit Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.ProfileButtonContainer, { backgroundColor: '#FF5757'}]}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>

  

      <Modal visible={isProfileModalVisible} animationType="fade" transparent={false}>
    
            <Text style={styles.text}>Edit Profile</Text>

            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Name" />
            <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email" />
            <TextInput style={styles.input} value={height} onChangeText={setHeight} placeholder="Height" />
            <TextInput style={styles.input} value={weight} onChangeText={setWeight} placeholder="Weight" />
            <TextInput style={styles.input} value={gender} onChangeText={setGender} placeholder="Gender" />
            <TextInput style={styles.input} value={dob} onChangeText={setDob} placeholder="Birthday" />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
              <TouchableOpacity style={[styles.ProfileButtonContainer, { flex: 1, marginRight: 5 }]} onPress={saveProfile}>
                <Text style={styles.buttonText}>Save Changes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.ProfileButtonContainer, { flex: 1, marginLeft: 5, backgroundColor: '#FF5757' }]} onPress={() => setProfileModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
      </Modal>


      <Modal visible={isSettingsModalVisible} animationType='fade' transparent={false}>
    
            <Text style={styles.text}>Edit Settings</Text>

            <TextInput style={styles.input} value={notificiations} onChangeText={setNot} placeholder="notificiations" />
            <TextInput style={styles.input} value={lang} onChangeText={setLang} placeholder="lang" />
            <TextInput style={styles.input} value={publicP} onChangeText={setPublicP} placeholder="publicP" />
            <TextInput style={styles.input} value={units} onChangeText={setUnits} placeholder="units" />
        

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
              <TouchableOpacity style={[styles.ProfileButtonContainer, { flex: 1, marginRight: 5 }]} onPress={saveSettings}>
                <Text style={styles.buttonText}>Save Changes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.ProfileButtonContainer, { flex: 1, marginLeft: 5, backgroundColor: '#FF5757' }]} onPress={() => setSettingsModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
      </Modal>



    </ScrollView>
  );
};
export default ProfileScreen;