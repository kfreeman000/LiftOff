import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import styles from './style';
import { LinearGradient } from 'expo-linear-gradient';

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';

export default function SignIn() {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Whoops! ⚠️', 'Please enter your email and password.');
      return;
    }

    try {
      await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });

    } catch (error) {
      Alert.alert('Sign in failed', error.message);
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
      <View style={{ alignItems: 'center' }}>
        <Text style={styles.text}>Welcome back!</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#BFBFBF"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#BFBFBF"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={handleSignIn}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.buttonContainer, { marginTop: 12, backgroundColor: '#ccc' }]}
          onPress={() =>
            Alert.alert(
              'Reset password',
              'Password reset can be wired to Firebase next.'
            )
          }
        >
          <Text style={[styles.buttonText, { color: 'black' }]}>
            Can’t sign in?
          </Text>
        </TouchableOpacity>
      </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}
