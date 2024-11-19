// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import * as React from 'react';
// import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import WorkoutForm from './workout.js';

// function HomeScreen({ navigation }) {
//   return (
//     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//       <Text>Lift Off</Text>
//       <Text>{'\n'}</Text>
//       <Image source={require('./images/unnamed.png')} style={{ width: 200, height: 200 }} />
//       <Text>{'\n\n'}</Text>
//       <TouchableOpacity onPress={() => navigation.navigate('Reps')} activeOpacity={0.2}>
//         <Text style={styles.button}>Rep Calculator</Text>
//       </TouchableOpacity>
//       <Text>{'\n\n'}</Text>
//       <TouchableOpacity onPress={() => navigation.navigate('Submit')} activeOpacity={0.2}>
//         <Text style={styles.button}>Submit Workout</Text>
//       </TouchableOpacity>
//       <Text>{'\n\n'}</Text>
//       <TouchableOpacity onPress={() => navigation.navigate('Achievements')} activeOpacity={0.2}>
//         <Text style={styles.button}>Achievements</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// function RepScreen() {
//   return (
//     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//       <Text>Rep Calculator</Text>
//       <Text>{'\n'}</Text>
//       <Image source={require('./images/unnamed.png')} style={{width: 200,     height: 200}}/>
//     </View>
//   );
// }

// function WorkoutScreen() {
//   return (
//       <WorkoutForm />
//   );
// }

// function AchievementsScreen() {
//   return (
//     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//       <Text>Achievements</Text>
//       <Text>{'\n'}</Text>
//       <Image source={require('./images/unnamed.png')} style={{width: 200,     height: 200}}/>
//     </View>
//   );
// }

// const Stack = createNativeStackNavigator();

// function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Home">
//         <Stack.Screen name="Home" component={HomeScreen} />
//         <Stack.Screen name="Reps" component={RepScreen} />
//         <Stack.Screen name="Submit" component={WorkoutScreen} />
//         <Stack.Screen name="Achievements" component={AchievementsScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }


// const styles = StyleSheet.create({
//   button: {
//     alignItems: "center",
//     marginTop:10,
//     paddingTop:15,
//     paddingBottom:15,
//     marginLeft:30,
//     marginRight:30,
//     borderRadius:10,
//     borderWidth: 1,
//     backgroundColor: "#40E0D0",
//     padding: 10,
//      overflow: "hidden"
//   }
// }
// )

// export default App;

/* Cole added this trying to get everything on git */

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
import styles from './style.js'
 
function HomeScreen({navigation}) {
  return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', paddingTop: 0 }}>
          <Image source={require('./liftoff_logo.png')} style={{width: 200, height: 200, position: 'absolute', top: 30 }}/>
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
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Profile Screen</Text>
    </View>
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
    <AchievementsStack.Navigator screenOptions={{headerTintColor: '#60B5F9'}}>
      <AchievementsStack.Screen name="Achievements" component={AchievementsScreen} />
      <AchievementsStack.Screen name="View Achievements" component={ViewAchievementsScreen} />
      <AchievementsStack.Screen name="Create Goal" component={CreateGoalScreen} />
      <AchievementsStack.Screen name="View Goals" component={ViewGoalsScreen} />
      <AchievementsStack.Screen name="Save Goal" component={SaveGoalScreen} />
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