import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({

  //for initial 
  InbuttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 300,
    height: 60,
    borderRadius: 32,
    backgroundColor: "#60B5F9",
    overflow: "hidden",
    marginVertical: 20, 
    
  },
  InbuttonText: {
    fontFamily: 'Comfortaa-Bold',
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    
  },
    
  //for profile
  text: {
    color: "#56c5f5",
    textAlign: "center",
    fontWeight: 'bold',
    fontFamily: 'Comfortaa-Bold',
    fontSize: 20,
    marginTop:10,
    paddingTop:100,
    paddingBottom:15,
  },

  editText: {
    color: "#56c5f5",
    textAlign: "left",
    fontWeight: 'bold',
    fontFamily: 'Comfortaa-Bold',
    fontSize: 15,
    paddingBottom:15,
  },

  ProfileButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
    width: 300,
    height: 60,
    borderRadius: 32,
    backgroundColor: "#60B5F9",
    overflow: "hidden"
  },

  button: {
    alignItems: "center",
    marginLeft:30,
    marginRight:30,
    borderRadius:10,
    borderWidth: 1,
    backgroundColor: "#56c5f5",
    overflow: "hidden"
  },
// for submit workout
submitContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingBottom: 200,
    
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'left',
  },


// for goal submission
item: {
  padding: 10,
  marginBottom: 15,
  backgroundColor: '#f0f0f0',
  borderRadius: 5,
},
itemText: {
  fontSize: 16,
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
    width: '80%',
    marginBottom: 20,
  },
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
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
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    
  },
  listContentContainer: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    
  },

  // view goals page
  goalsContainer: {
    flex: 1,
    display: 'flex',

  },
  goalsContainer: {
  flex: 1,
  backgroundColor: "white",
  paddingTop: 40,
  paddingHorizontal: 15,
},

goalsHeader: {
  fontSize: 28,
  fontWeight: "bold",
  textAlign: "center",
  marginBottom: 20,
  color: "#60B5F9",
},

goalCard: {
  backgroundColor: "#E7F2FE",
  padding: 18,
  borderRadius: 14,
  marginBottom: 12,
  shadowColor: "#000",
  shadowOpacity: 0.1,
  shadowRadius: 3,
  elevation: 2,
},

goalText: {
  fontSize: 18,
  fontWeight: "600",
  color: "#333",
},

modalOverlay: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0,0,0,0.4)",
},

modalContent: {
  width: "80%",
  backgroundColor: "#fff",
  padding: 25,
  borderRadius: 14,
  alignItems: "center",
},

modalGoalText: {
  fontSize: 22,
  fontWeight: "bold",
  marginBottom: 10,
  textAlign: "center",
},

modalDate: {
  fontSize: 15,
  color: "#777",
  marginBottom: 25,
},

deleteBtn: {
  backgroundColor: "#FF5757",
  paddingVertical: 12,
  width: "100%",
  borderRadius: 10,
  marginBottom: 10,
  alignItems: "center",
},

deleteText: {
  color: "white",
  fontWeight: "600",
  fontSize: 18,
},

cancelBtn: {
  backgroundColor: "#60B5F9",
  paddingVertical: 12,
  width: "100%",
  borderRadius: 10,
  alignItems: "center",
},

cancelText: {
  color: "white",
  fontWeight: "600",
  fontSize: 18,
},

});

export default styles;






