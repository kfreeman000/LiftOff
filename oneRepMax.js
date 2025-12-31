

import React, { useState } from 'react';
import { View, Image, TouchableOpacity, Alert, ScrollView, Switch, Modal, Text, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import styles from './style.js';
import { useNavigation } from '@react-navigation/native';

const PRscreen = () => {

    const naviagtion = useNavigation();
    const [selectedExercise, setSelectedExercise] = useState('Bench');


return (
   <View style={styles.PRcontainer}>
    <Text style={styles.header}>One Rep Max Calculator📈</Text>
    <Picker
        selectedValue={selectedExercise}
        onValueChange={(itemValue) => setSelectedExercise(itemValue)}
        style={{ width: '100%', marginVertical: 10 }}
        itemStyle={{ color: 'black', fontFamily: 'Comfortaa-Bold' }}
      >
        <Picker.Item label="Bench" value="Bench" />
        <Picker.Item label="Squat" value="Squat" />
        <Picker.Item label="Deadlift" value="Deadlift" />
        <Picker.Item label="Row" value="Row" />
      </Picker>
    </View> 
)}

export default PRscreen