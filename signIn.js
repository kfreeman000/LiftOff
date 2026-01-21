import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import styles from './style';
import { LinearGradient } from 'expo-linear-gradient';

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
          'Verify your email',
          'Please verify your email address before signing in.',
          [
            {
              text: 'Resend verification',
              onPress: async () => {
                try {
                  await sendEmailVerification(userCredential.user);
                  Alert.alert('Sent', 'Verification email sent.');
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
      Alert.alert('Sign in failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    const isValidEmailFormat = (email) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim().toLowerCase());
    };

    if (!email) {
      Alert.alert('Reset password', 'Enter your email above, then tap this button.');
      return;
    }

    if (!isValidEmailFormat(email)) {
      Alert.alert('Reset password', 'Please enter a valid email.');
      return;
    }

    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email.trim());
      Alert.alert('Reset email sent', 'Check your inbox for password reset instructions.');
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
