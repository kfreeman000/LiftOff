import { Text, TouchableOpacity, View } from "react-native";
import styles from "./style";
import { LinearGradient } from 'expo-linear-gradient';

function FirstScreen({ navigation }) {
  return (
    <LinearGradient
    colors={['#e6eff5', '#def0fa', '#71c4f5']}
    style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <TouchableOpacity
        style={styles.InbuttonContainer}
        onPress={() => navigation.navigate("CreateAcc")}>
        <Text style={styles.InbuttonText}>Create account</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.InbuttonContainer}
        onPress={() => navigation.navigate("SignIn")}>
        <Text style={styles.InbuttonText}>Sign in</Text>
      </TouchableOpacity>
    </View>
    </LinearGradient>
  );
}

export default FirstScreen;
