import { TouchableOpacity } from "react-native";

function firstScreen() {
    return (
        <View>
            <TouchableOpacity>
                <Text>Create Accout</Text>
            </TouchableOpacity>

            <TouchableOpacity>
                <Text>Sign In</Text>
            </TouchableOpacity>
        </View>
    )
}