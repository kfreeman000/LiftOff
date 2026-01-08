
// home screen with two different forms of navigation 

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AchievementsForm, ViewAchievementsForm, CreateGoalForm, ViewGoalsForm } from './achievements.js';
import RepForm from './reps.js';
import ProfileForm from './profile.js';
import Friends from './friends.js';
import styles from './style.js';
import AddWorkout from './addWorkout.js';
import PR from './oneRepMax.js'


function HomeMainScreen ({ navigation }) {

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', paddingTop: 0 }}>
          <Image source={require('./assets/liftoff_logo.png')} style={{ width: 200, height: 200, position: 'absolute', top: 40 }} />
          <Text>{'\n\n'}{'\n\n'}{'\n\n'}{'\n\n'}{'\n\n'}</Text>

      <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate("Reps")}>
        <Text style={styles.buttonText}>View Workouts</Text>
      </TouchableOpacity>

      <Text>{'\n\n'}</Text>

      <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate("Submit")}>
        <Text style={styles.buttonText}>Submit Workout</Text>
      </TouchableOpacity>

      <Text>{'\n\n'}</Text>

      {/*launches achievements stack*/} 
      <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate("AchievementsStack", { screen: "AchievementsMain" })}>
        <Text style={styles.buttonText}>Achievements</Text>
      </TouchableOpacity>
    </View>
  );
}

/******** HOME STACK ********/
const HomeStack = createNativeStackNavigator();
function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={HomeMainScreen} />
      <HomeStack.Screen name="Reps" component={RepForm} />
      <HomeStack.Screen name="Submit" component={AddWorkout} />
      <HomeStack.Screen
        name="AchievementsStack"
        component={AchievementsStackScreen}
        options={{ headerShown: false }}
    />
    </HomeStack.Navigator>
  );
}

/******** ACHIEVEMENTS STACK ********/
const AchievementsStack = createNativeStackNavigator();
function AchievementsStackScreen() {
  return (
    <AchievementsStack.Navigator
      initialRouteName="AchievementsMain"
      screenOptions={{
        headerTintColor: '#60B5F9',
        headerTitleAlign: 'center'
      }}
    >
      <AchievementsStack.Screen
        name="AchievementsMain"
        component={AchievementsForm}
        options={{ title: "Achievements" }}
      />
      <AchievementsStack.Screen
        name="ViewAchievements"
        component={ViewAchievementsForm}
        options={{ title: "View Achievements" }}
      />
      <AchievementsStack.Screen
        name="CreateGoal"
        component={CreateGoalForm}
        options={{ title: "Create Goal" }}
      />
      <AchievementsStack.Screen
        name="ViewGoals"
        component={ViewGoalsForm}
        options={{ title: "View Goals" }}
      />
    </AchievementsStack.Navigator>
  );
}

/******** BOTTOM TABS ********/
const Tab = createBottomTabNavigator();

export default function Home() {
  return (
    
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        
        <Tab.Screen name="Home" component={HomeStackScreen}
          options={{
            tabBarIcon: ({ focused, size }) => (
              <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color="#60B5F9" />
            )
          }}
        />

        <Tab.Screen name="Profile" component={ProfileForm}
          options={{
            tabBarIcon: ({ focused, size }) => (
              <Ionicons name={focused ? 'person-circle' : 'person-circle-outline'} size={size} color="#60B5F9" />
            )
          }}
        />

        <Tab.Screen name="Friends" component={Friends}
          options={{
            tabBarIcon: ({ focused, size }) => (
              <Ionicons name={focused ? 'people-circle' : 'people-circle-outline'} size={size} color="#60B5F9" />
            )
          }}
        />

        <Tab.Screen name="PR" component={PR}
          options={{
            tabBarIcon: ({ focused, size }) => (
              <Ionicons name={focused ? 'barbell' : 'barbell-outline'} size={size} color="#60B5F9" />
            )
          }}
        />

        
      </Tab.Navigator>
  );
}
