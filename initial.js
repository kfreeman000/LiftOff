import { Text, TouchableOpacity, View } from "react-native";
import styles from "./style";

function FirstScreen({ navigation }) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
      }}
    >
      <TouchableOpacity
        style={styles.InbuttonContainer}
        onPress={() => navigation.navigate("CreateAcc")}>
        <Text style={styles.InbuttonText}>Create Account</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.InbuttonContainer}
        onPress={() => navigation.navigate("SignIn")}>
        <Text style={styles.InbuttonText}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}

export default FirstScreen;
