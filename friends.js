

import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';


const friends = [
  { id: '1', name: 'Kat Freeman' },
  { id: '2', name: 'Cole Prochelio' },
  { id: '3', name: 'Matt Stevens' },
];

const FriendList = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigation = useNavigation();
  
    const handlePress = (friend) => {
      navigation.navigate('Profile', { friend });
    };
  
    const lookUp = () => {
      const foundFriend = friends.find((friend) =>
        friend.name.toLowerCase() === searchQuery.toLowerCase()
      );
  
      if (foundFriend) {
        handlePress(foundFriend);
      } else {
        Alert.alert('Not Found', 'This person is not a saved friend');
      }
    };
  
    const renderFriend = ({ item }) => (
      <TouchableOpacity
        onPress={() => handlePress(item)}
        style={styles.friendContainer}
      >
        <Text style={styles.friendName}>{item.name}</Text>
      </TouchableOpacity>
    );
  
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="look up a friend"
          placeholderTextColor="grey"
          value={searchQuery}
          onChangeText={setSearchQuery} 
        />
        
        <TouchableOpacity style={styles.buttonContainer} onPress={lookUp}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>

        <FlatList
          data={friends}
          keyExtractor={(item) => item.id}
          renderItem={renderFriend}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#f8f8f8',
      marginTop: 70

    },
    input: {
      color: 'black',  
      height: 40,
      borderColor: 'black',
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
      marginBottom: 10,
      backgroundColor: 'white',
    },
    friendContainer: {
      paddingVertical: 15,
      paddingHorizontal: 20,
      backgroundColor: 'white',
    },
    friendName: {
      borderColor: 'black',
      fontSize: 18,
      color: 'black',
    },
    separator: {
      height: 1,
      backgroundColor: '#e0e0e0',
    },
    buttonContainer: {
    justifyContent: "center",
    width: 200,
    height: 60,
    borderRadius: 32,
    backgroundColor: "#60B5F9",
    overflow: "hidden",
    alignSelf: "center",
    marginBottom: 50,
  
  },
  buttonText: {
    fontFamily: 'Comfortaa-Bold',
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
  });
  
  export default FriendList;