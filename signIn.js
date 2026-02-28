import React, { useState, useEffect } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native'; // useFocusEffect is used to reload the screen when the user comes back to the sign in screen
import styles from './style';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut,
} from 'firebase/auth';
import { auth } from './firebase';

export default function SignIn() {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); //loading state needed to prevent double taps 

  // Load saved credentials when component mounts or screen comes into focus
  const loadSavedCredentials = async () => {
    try {
      const savedEmail = await AsyncStorage.getItem('savedEmail');
      const savedPassword = await AsyncStorage.getItem('savedPassword');
      
      console.log('Loading saved credentials - Email:', savedEmail ? 'Found' : 'Not found', 'Password:', savedPassword ? 'Found' : 'Not found');
      
      if (savedEmail) {
        setEmail(savedEmail);
      }
      if (savedPassword) {
        setPassword(savedPassword);
      }
    } catch (error) {
      console.log('Could not load saved credentials:', error);
    }
  };

  useEffect(() => {
    loadSavedCredentials();
  }, []);

  // Also reload when screen comes into focus (e.g., after account creation)
  useFocusEffect(
    React.useCallback(() => {
      loadSavedCredentials();
    }, [])
  );

  const handleSignIn = async () => {
    const isValidEmailFormat = (email) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim().toLowerCase());
    };

    if (!email || !password) {
      Alert.alert('Whoops! ⚠️', 'Please enter your email and password.');
      return;
    }

    if (!isValidEmailFormat(email)) {
      Alert.alert('Whoops! ⚠️', 'Please enter a valid email.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Whoops! ⚠️', 'Password must be at least 6 characters.');
      return;
    }

    try {
      setLoading(true);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      // Require email verification before letting users into the app.
      if (!userCredential.user.emailVerified) {
        Alert.alert(
          'Verify your email 🔎',
          "Let's verify your email address before signing in. It miight have gone to the junk folder 🗑️",
          [
            {
              text: 'Resend verification',
              onPress: async () => {
                try {
                  await sendEmailVerification(userCredential.user); // sendEmailVer is a built in FireBase thing
                  Alert.alert('Sent 📨', 'Verification email sent.');
                } catch (e) {
                  Alert.alert('Could not send', e?.message ?? 'Please try again.');
                }
              },
            },
            { text: 'OK' },
          ]
        );

        await signOut(auth);
        return;
      }

      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });

    } catch (error) {
      console.error('Sign in error:', error);
      const errorMessage = error?.message || 'Sign in failed. Please check your email and password.';
      Alert.alert('Sign in failed 🔒', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    const isValidEmailFormat = (email) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim().toLowerCase());
    };

    if (!email) {
      Alert.alert('Reset password 🔒 ', 'Enter your email above, then tap this button.');
      return;
    }

    if (!isValidEmailFormat(email)) {
      Alert.alert('Reset password 🔒', 'Please enter a valid email.');
      return;
    }

    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email.trim());
      Alert.alert('Reset email sent', 'Check out your inbox for password reset instructions. It miight have gone to the junk folder 🗑️');
    } catch (error) {
      Alert.alert('Reset failed', error.message);
    } finally {
      setLoading(false);
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
          style={styles.Ininput}
          placeholder="Email"
          backgroundColor="white"
          placeholderTextColor="#BFBFBF"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.Ininput}
          placeholder="Password"
          backgroundColor="white"
          placeholderTextColor="#BFBFBF"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={handleSignIn}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Signing in…' : 'Sign In'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.buttonContainer,
            {
              marginTop: 12,
              backgroundColor: '#ccc',
              opacity: loading ? 0.6 : 1,
            },
          ]}
          onPress={handleResetPassword}
          disabled={loading}
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
