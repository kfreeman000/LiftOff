import React, { useState } from 'react';
import { View, Image, TouchableOpacity, Alert, ScrollView, Switch, Modal, Text, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import styles from './style.js';

const createAcc = () => {
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

}  

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
            <TouchableOpacity style={[styles.ProfileButtonContainer, { marginBottom: 10 }]} onPress={saveProfile}>
              <Text style={styles.buttonText}>Complete Profile</Text>
            </TouchableOpacity>
        </View>  
    </ScrollView>      

  );        