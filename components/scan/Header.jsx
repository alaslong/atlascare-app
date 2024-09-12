import { SafeAreaView, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome6 } from "@expo/vector-icons";

const ScanHeader = () => {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-row justify-between items-center mx-6 mb-3">
      <TouchableOpacity onPress={() => router.navigate("inventory")}>
        <FontAwesome6 size={24} name="warehouse" regular color="gray" />
      </TouchableOpacity>

      <Text className="text-xl font-semibold">Atlascare</Text>
      <TouchableOpacity onPress={() => router.navigate("settings")}>
        <FontAwesome6 size={24} name="gear" regular color="gray" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ScanHeader;
