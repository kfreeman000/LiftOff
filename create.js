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
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import styles from './style';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

import { auth, db } from './firebase';
import { createUserWithEmailAndPassword, sendEmailVerification  } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function CreateAcc() {
  const navigation = useNavigation();

  const defaultPic = Image.resolveAssetSource(
    require('./assets/blankProfilePic.webp')
  ).uri;

  const [pic, setPic] = useState({ uri: defaultPic });

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthYear, setBirthYear] = useState('');


  const [publicProfile, setPublicProfile] = useState(false);
  const [units, setUnits] = useState(true);

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
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setPic({ uri: result.assets[0].uri });
    }
  };

  const handleCompleteProfile = async () => {
    if (!name || !email || !password || !birthDay || !birthMonth || !birthYear) {
      Alert.alert(
        'Whoops! ⚠️',
        'Name, email, password, and date of birth are required.'
      );
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      const uid = userCredential.user.uid;


      await setDoc(doc(db, 'users', uid), {
        name,
        email,
        height,
        weight,
        gender,
        birthDay,
        birthMonth,
        birthYear,
        publicProfile,
        units: units ? 'lbs' : 'kg',
        photoURL: pic.uri,
        createdAt: serverTimestamp(),
      });

      Alert.alert('Success! 🎉', 'Account created');

      navigation.reset({
        index: 0,
        routes: [{ name: 'SignIn' }],
      });

    } catch (error) {
      Alert.alert('Whoops! ⚠️', error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
      colors={['#e6eff5', '#def0fa', '#71c4f5']}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ScrollView contentContainerStyle={{ padding: 20, alignItems: 'center' }}>
        <Text style={styles.text}>Create Profile</Text>

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
          backgroundColor="white"
          placeholderTextColor="#BFBFBF"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          backgroundColor="white"
          placeholderTextColor="#BFBFBF"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          backgroundColor="white"
          placeholderTextColor="#BFBFBF"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TextInput
          style={styles.input}
          placeholder="Height"
          backgroundColor="white"
          placeholderTextColor="#BFBFBF"
          keyboardType="numeric"
          value={height}
          onChangeText={setHeight}
        />

        <TextInput
          style={styles.input}
          placeholder="Weight"
          backgroundColor="white"
          placeholderTextColor="#BFBFBF"
          keyboardType="numeric"
          value={weight}
          onChangeText={setWeight}
        />

        <TouchableOpacity
          style={{height: 40,
                  borderColor: 'gray',
                  borderWidth: 1,
                  borderRadius: 5,
                  paddingHorizontal: 10,
                  width: '80%',
                  marginBottom: 20,
                  justifyContent: 'center',
                  backgroundColor: 'white'}}
          onPress={() => {
            if (!gender) setGender('Woman');
            setGenderModalVisible(true);
        }}
        >
          <Text style={{ color: gender ? 'black' : '#BFBFBF' }}>
            {gender || 'Gender'}
          </Text>
        </TouchableOpacity>

    <View style={{ flexDirection: 'row', gap: 10 }}>
        <TextInput
          style={[styles.input, { flex: 1, marginLeft: 35}]}
          placeholder="DD"
          backgroundColor="white"
          placeholderTextColor="#BFBFBF"
          keyboardType="numeric"
          maxLength={2}
          value={birthDay}
          onChangeText={setBirthDay}
        />

        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="MM"
          backgroundColor="white"
          placeholderTextColor="#BFBFBF"
          keyboardType="numeric"
          maxLength={2}
          value={birthMonth}
          onChangeText={setBirthMonth}
        />

        <TextInput
          style={[styles.input, { flex: 1, marginRight: 35 }]}
          placeholder="YYYY"
          backgroundColor="white"
          placeholderTextColor="#BFBFBF"
          keyboardType="numeric"
          maxLength={4}
          value={birthYear}
          onChangeText={setBirthYear}
        />
    </View>


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

        <TouchableOpacity
          style={styles.ProfileButtonContainer}
          onPress={handleCompleteProfile}
        >
          <Text style={styles.buttonText}>Complete</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={genderModalVisible} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            backgroundColor: 'rgba(0,0,0,0.4)',
            alignItems: "center"
          }}
        >
          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}
          >
            <Picker
              selectedValue={gender}
              onValueChange={(value) => setGender(value)}
              itemStyle={{ color: 'black', fontFamily: 'Comfortaa-Bold' }}
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
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}
