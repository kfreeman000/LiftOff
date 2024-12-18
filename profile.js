import React from 'react';
import { Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import styles from './style.js';
const ProfileScreen = () => {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', padding: 20 }}>
      <Image source={require('./assets/someGuy.png')} 
      style={{
        marginTop: 50, 
        width: 150, 
        height: 150, 
        borderRadius: 75,
        marginBottom: 20,
        borderWidth: 3,
        borderColor: '#60B5F9', 
      }}/>
      <Text style={[styles.blueHeaderText, { fontSize: 28, marginBottom: 20 }]}>
        John Doe
      </Text>
      <Text style={[styles.blueHeaderText, { fontSize: 22, marginBottom: 10 }]}>
        Contact Info
      </Text>
      <Text style={[styles.blueHeaderText, { fontSize: 16, marginBottom: 5 }]}>
        Email: johndoe@example.com
      </Text>
      <Text style={[styles.blueHeaderText, { fontSize: 16, marginBottom: 20 }]}>
        Phone: (123) 456-7890
      </Text>
      <Text style={[styles.blueHeaderText, { fontSize: 22, marginBottom: 10 }]}>
        Personal Health Info
      </Text>
      <Text style={[styles.blueHeaderText, { fontSize: 16, marginBottom: 5 }]}>
        Height: 6'1"
      </Text>
      <Text style={[styles.blueHeaderText, { fontSize: 16, marginBottom: 5 }]}>
        Weight: 180 lbs
      </Text>
      <Text style={[styles.blueHeaderText, { fontSize: 16, marginBottom: 5 }]}>
        Gender: Male
      </Text>
      <Text style={[styles.blueHeaderText, { fontSize: 16, marginBottom: 20 }]}>
        DOB: 12/15/2000
      </Text>
      <Text style={[styles.blueHeaderText, { fontSize: 22, marginBottom: 10 }]}>
        App Settings
      </Text>
      <Text style={[styles.blueHeaderText, { fontSize: 16, marginBottom: 5 }]}>
        Notifications: ON
      </Text>
      <Text style={[styles.blueHeaderText, { fontSize: 16, marginBottom: 5 }]}>
        Language: English
      </Text>
      <Text style={[styles.blueHeaderText, { fontSize: 16, marginBottom: 5 }]}>
        Public profile: ON
      </Text>
      <Text style={[styles.blueHeaderText, { fontSize: 16, marginBottom: 20 }]}>
        Weight Units: Imperial
      </Text>
      <TouchableOpacity style={styles.buttonContainer}>
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.buttonContainer, { backgroundColor: '#FF5757', marginTop: 20 }]}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
export default ProfileScreen;