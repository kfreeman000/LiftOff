import {StyleSheet} from 'react-native';

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
      backgroundColor: "#56c5f5",
      padding: 10,
       overflow: "hidden"
    },
    achievementItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 10,
    },
    achievementImage: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 15,
    },
    achievementTitle: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
      width: '100%',
      marginBottom: 20,
    },
    buttonContainer: {
      alignItems: "center",
      justifyContent: "center",
      marginTop: 10,
      width: 300,
      height: 60,
      borderRadius: 32,
      backgroundColor: "#60B5F9",
      overflow: "hidden"
    },
    buttonText: {
      fontFamily: 'Comfortaa-Bold',
      color: 'white',
      fontSize: 20,
      textAlign: 'center'
    },
    blueBackgroundContainer: {
      alignItems: "center",
      justifyContent: "center",
      marginTop: 10,
      width: 300,
      height: 60,
      borderRadius: 25,
      backgroundColor: "#60B5F9",
      overflow: "hidden"
    }
  }
  )

  export default styles;