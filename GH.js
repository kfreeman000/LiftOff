import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import WorkoutForm from './workout.JS';

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Lift Off</Text>
      <Text>{'\n'}</Text>
      <Image source={require('./images/unnamed.png')} style={{ width: 200, height: 200 }} />
      <Text>{'\n\n'}</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Reps')} activeOpacity={0.2}>
        <Text style={styles.button}>Rep Calculator</Text>
      </TouchableOpacity>
      <Text>{'\n\n'}</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Submit')} activeOpacity={0.2}>
        <Text style={styles.button}>Submit Workout</Text>
      </TouchableOpacity>
      <Text>{'\n\n'}</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Achievements')} activeOpacity={0.2}>
        <Text style={styles.button}>Achievements</Text>
      </TouchableOpacity>
    </View>
  );
};

function RepScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Rep Calculator</Text>
      <Text>{'\n'}</Text>
      <Image source={require('./images/unnamed.png')} style={{width: 200,     height: 200}}/>
    </View>
  );
}

function WorkoutScreen() {
  return (
      <WorkoutForm />
  );
}

function AchievementsScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Achievements</Text>
      <Text>{'\n'}</Text>
      <Image source={require('./images/unnamed.png')} style={{width: 200,     height: 200}}/>
    </View>
  );
}

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Reps" component={RepScreen} />
        <Stack.Screen name="Submit" component={WorkoutScreen} />
        <Stack.Screen name="Achievements" component={AchievementsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    marginTop:10,
    paddingTop:15,
    paddingBottom:15,
    marginLeft:30,
    marginRight:30,
    borderRadius:10,
    borderWidth: 1,
    backgroundColor: "#40E0D0",
    padding: 10,
     overflow: "hidden"
  }
}
)

export default App;