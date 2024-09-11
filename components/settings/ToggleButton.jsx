import { TouchableOpacity, Text } from "react-native";

const ToggleButton = ({ listVisible, toggleListVisibility }) => {
    return (
      <TouchableOpacity
        onPress={toggleListVisibility}
        className="p-2 bg-teal-500 rounded-lg"
      >
        <Text className="text-white font-semibold">
          {listVisible ? "Hide" : "Change"}
        </Text>
      </TouchableOpacity>
    );
  };

  export default ToggleButton