import { Alert, Text, TextInput, TouchableOpacity, View, } from 'react-native';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import styles from './style';

export default function SignIn() {
  const navigation = useNavigation();

  const [name, setName] = useState('')
  const [pword, setPword] = useState('')

  return (
  <KeyboardAvoidingView
  style={{ flex: 1 }}
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  >
    <View style={{ alignItems: 'center', marginTop: 200 }}>
      <Text style={styles.text}>Welcome back!</Text>
      <TextInput
          style={styles.input}
          placeholder="username"
          placeholderTextColor="#BFBFBF"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="password"
          placeholderTextColor="#BFBFBF"
          value={pword}
          onChangeText={setPword}
        />

        <TouchableOpacity style={styles.buttonContainer}>   
          <Text style={styles.buttonText}>Can't sign in?</Text> 
        </TouchableOpacity>
    </View>
  </KeyboardAvoidingView>
  );
}
