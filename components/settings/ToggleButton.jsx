import { FontAwesome6 } from "@expo/vector-icons";
import { TouchableOpacity, Text } from "react-native";

const ToggleButton = ({ listVisible, toggleListVisibility }) => {
    return (
      <TouchableOpacity
        onPress={toggleListVisibility}
        className="p-2 bg-[#3b8ae6] rounded-lg"
      >
        <Text className="text-white">
          {listVisible ? <FontAwesome6 size={14} name="check" color="white" /> : <FontAwesome6 size={14} name="arrows-rotate" color="white" />}
        </Text>
      </TouchableOpacity>
    );
  };

  export default ToggleButton