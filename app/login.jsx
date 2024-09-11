import React, { useState } from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";
import { useAuth } from "@/contexts/Auth"; // Assuming your Auth context is set up here

const LoginScreen = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    const credentials = { email, password };
    login(credentials);
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
      />

      
      <TextInput
        className="w-full border border-gray-300 rounded-lg text-lg p-4 mb-8" 
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
      />

      <View className="flex-row justify-center">
        <TouchableOpacity onPress={handleLogin} className="p-3 w-full bg-green-500 rounded-xl">
            <Text className="text-lg text-white text-center font-semibold">Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;
