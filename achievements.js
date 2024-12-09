import React, { useState } from 'react';
import { Button, FlatList, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import styles from './style.js';

const achievements = [
    { id: '1', title: 'Muscle Power', image: require('./assets/mp.jpg') },    // " you increased weight in an exercise!! ""
    { id: '2', title: 'Workout Star', image: require('./assets/wkout.jpg') },    // five workouts completed or something
    { id: '3', title: 'Goal Setter', image: require('./assets/gs.png') },
  ];

  const AchievementsForm = ({navigation}) => {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', paddingTop: 0 }}>
        <Image source={require('./assets/liftoff_logo.png')} style={{width: 200, height: 200, position: 'absolute', top: 30 }}/>
        <Text>{'\n\n'}{'\n\n'}{'\n\n'}{'\n\n'}{'\n\n'}</Text>
        <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate('View Achievements')} activeOpacity={0.2}>
           <Text style={styles.buttonText}>View Achievements</Text>
      </TouchableOpacity>
        <Text>{'\n\n'}</Text>
        <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate('Create Goal')} activeOpacity={0.2}>
           <Text style={styles.buttonText}>Create Goal</Text>
      </TouchableOpacity>
      <Text>{'\n\n'}</Text>
        <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate('View Goals')} activeOpacity={0.2}>
           <Text style={styles.buttonText}>View Goals</Text>
      </TouchableOpacity>
      </View>
    );
  }
   
  const ViewAchievementsForm = () => {
    return (
      <View style={styles.container}>
        <FlatList
          data={achievements}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.achievementItem}>
              <Image source={item.image} style={styles.achievementImage} />
              <Text style={styles.achievementTitle}>{item.title}</Text>
            </View>
          )}
        />
      </View>
    );
  }
   
  const SaveGoalForm = (goal, addGoal) => {
    console.log("New goal added:", goal);
    addGoal(goal);
  }
   
  const CreateGoalForm = ({ addGoal }) => {
    const [goal, setGoal] = useState('');
   
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Create a goal of your own</Text>
        <Text>{'\n'}</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your goal"
          value={goal}
          onChangeText={setGoal}
        />
        <Button style={styles.button} title="Save Goal" onPress={() => Save(goal, addGoal)} />
      </View>
    );
  }
   
  const ViewGoalsForm = ({ goals }) => {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Check out your goals</Text>
        <Text>{'\n'}</Text>
        <FlatList
          data={goals}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <Text style={styles.goalItem}>{item}</Text>}
        />
      </View> 
    );
  }

export { AchievementsForm, CreateGoalForm, SaveGoalForm, ViewAchievementsForm, ViewGoalsForm };

