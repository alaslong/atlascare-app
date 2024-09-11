import React from "react";
import { View, ActivityIndicator, SafeAreaView } from "react-native";

const LoadingScreen = () => (
  <SafeAreaView className="flex-1">
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size="large" color="lightgray" />
    </View>
  </SafeAreaView>
);

export default LoadingScreen;
