
import React, { useState } from "react";
import { View, TextInput, Text, TouchableOpacity, Alert } from "react-native";
import { useAuth } from "@/contexts/Auth"; 
import { useNavigation } from "expo-router";

const LoginScreen = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // Manage submission state
  const navigation = useNavigation(); 

  const handleLogin = () => {
    // Basic validation (optional)
    if (!email || !password) {
      Alert.alert("Validation Error", "Please enter both email and password.");
      return;
    }

    setIsSubmitting(true); // Start submission

    const credentials = { email, password };
    login(credentials, () => {
      // Callback after successful login
      setIsSubmitting(false); // Stop submission
      navigation.replace("(tabs)"); // Navigate to /scan within (tabs)
    });
  };

  return (
    <View className="flex-1 items-center bg-white pt-16 px-8">
      <Text className="text-4xl font-bold text-center mt-40 mb-10">Atlascare</Text>

      <TextInput
        className="w-full border border-gray-300 rounded-lg text-lg p-4 mb-6" 
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoCorrect={false}
        textContentType="emailAddress"
      />

      <TextInput
        className="w-full border border-gray-300 rounded-lg text-lg p-4 mb-8" 
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
        autoCorrect={false}
        textContentType="password"
      />

      <View className="flex-row justify-center w-full">
        <TouchableOpacity 
          onPress={handleLogin} 
          className={`p-3 w-full bg-green-500 rounded-xl ${isSubmitting ? "bg-green-300" : ""}`}
          disabled={isSubmitting} // Disable button during submission
        >
          <Text className="text-lg text-white text-center font-semibold">
            {isSubmitting ? "Logging in..." : "Login"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;
