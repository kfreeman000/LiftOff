import React, { useState, useEffect } from 'react';
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  ScrollView,
  Button,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Picker } from '@react-native-picker/picker';
import { useFonts } from 'expo-font';
import Ionicons from 'react-native-vector-icons/Ionicons';
import WorkoutForm from './workout';
import RepForm from './reps.js';
import { AchievementsForm, ViewAchievementsForm, CreateGoalForm, ViewGoalsForm, SaveGoalForm } from './achievements.js';
import ProfileForm from './profile.js';
import styles from './style.js'
 
function HomeScreen({navigation}) {
  return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', paddingTop: 0 }}>
          <Image source={require('./assets/liftoff_logo.png')} style={{width: 200, height: 200, position: 'absolute', top: 30 }}/>
          <Text>{'\n\n'}{'\n\n'}{'\n\n'}{'\n\n'}{'\n\n'}</Text>
          <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate("Reps")} activeOpacity={0.2}>
            <Text style={styles.buttonText}>Rep Calculator</Text>
          </TouchableOpacity>
          <Text>{'\n\n'}</Text>
          <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate("Submit")} activeOpacity={0.2}>
            <Text style={styles.buttonText}>Submit Workout</Text>
          </TouchableOpacity>
          <Text>{'\n\n'}</Text>
          <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate("Achievements")} activeOpacity={0.2}>
            <Text style={styles.buttonText}>Achievements</Text>
          </TouchableOpacity>
        </View>
      );
}

function ProfileScreen() {
  return (
    <ProfileForm />
  );
}

function FriendsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Friends Screen</Text>
    </View>
  );
}

function RepScreen() {
  return (
      <RepForm />
  );
}
 
function WorkoutScreen() {
  return (
      <WorkoutForm />
  );
}

function AchievementsScreen() {
  return (
      <AchievementsForm />
  );
}

function ViewAchievementsScreen() {
  return (
      <ViewAchievementsForm />
  );
}

function CreateGoalScreen() {
  return (
      <CreateGoalForm />
  );
}

function ViewGoalsScreen() {
  return (
      <ViewGoalsForm />
  );
}

function SaveGoalScreen() {
  return (
      <SaveGoalForm />
  );
}

const HomeStack = createNativeStackNavigator();
const AchievementsStack = createNativeStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{headerTintColor: '#60B5F9'}}>
        <HomeStack.Screen name="Home" component={HomeScreen} options={{ title: '' }}/>
        <HomeStack.Screen name="Reps" component={RepScreen} options={{ title: '' }}/>
        <HomeStack.Screen name="Submit" component={WorkoutScreen} />
        <HomeStack.Screen name="Achievements" component={AchievementsStackScreen} options={{ title: '' }}/>
    </HomeStack.Navigator>
  );
}

function AchievementsStackScreen() {
  return (
    <AchievementsStack.Navigator
      screenOptions={{
        headerTintColor: '#60B5F9',
        headerBackTitle: 'Achievements',
      }}
    >
      <AchievementsStack.Screen
        name="Achievements"
        component={AchievementsForm}
      />
      <AchievementsStack.Screen
        name="View Achievements"
        component={ViewAchievementsForm}
      />
      <AchievementsStack.Screen
        name="Create Goal"
        component={CreateGoalForm}
      />
      <AchievementsStack.Screen
        name="View Goals"
        component={ViewGoalsForm}
      />
      <AchievementsStack.Screen
        name="Save Goal"
        component={SaveGoalForm}
      />
    </AchievementsStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();
 
export default function App() {
  const [goals, setGoals] = useState([]);
 
  const addGoal = (goal) => {
    setGoals((prevGoals) => [...prevGoals, goal]); 
  };
  return ( 
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="HomeTab" component={HomeStackScreen} options={{ tabBarIcon: ({ focused, color, size }) => ( <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={'#60B5F9'} />)}}/>
        <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: ({ focused, color, size }) => ( <Ionicons name={focused ? 'person-circle' : 'person-circle-outline'} size={size} color={'#60B5F9'} />)}}/>
        <Tab.Screen name="Friends" component={FriendsScreen} options={{ tabBarIcon: ({ focused, color, size }) => ( <Ionicons name={focused ? 'people-circle' : 'people-circle-outline'} size={size} color={'#60B5F9'} />)}}/>
      </Tab.Navigator>
    </NavigationContainer>
 
  );
}