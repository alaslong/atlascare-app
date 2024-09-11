import React, { useState, useRef } from "react";
import {
  FlatList,
  TouchableOpacity,
  View,
  Text,
  Animated,
  Easing,
} from "react-native";

import ToggleButton from "./ToggleButton";
import { useTranslation } from "react-i18next";
import { useData } from "@/contexts/Data";

const PracticeSelector = () => {
  const { practices } = useData(); // Get practices from context

  const [listVisible, setListVisible] = useState(false); // State to toggle list visibility
  const animation = useRef(new Animated.Value(0)).current; // Animation value for showing/hiding the list

  const { t } = useTranslation();

  // Toggle the visibility of the practice list
  const toggleListVisibility = () => {
    // If the list is visible, animate it out; otherwise, animate it in
    Animated.timing(animation, {
      toValue: listVisible ? 0 : 1,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();

    setListVisible(!listVisible); // Toggle the visibility state
  };

  // Interpolating height and opacity for the animated view
  const animatedStyle = {
    height: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 200], // Adjust height if needed
    }),
    opacity: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
  };

  // Render individual practice item
  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => practices.setSelectedPractice(item)}
      className={`flex-1 p-4 border-gray-300 rounded-xl items-center ${
        practices.selectedPractice?.id === item.id ? "bg-teal-300" : ""
      }`}
    >
      <Text className="text-base">{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View className="w-full">
      <View className="flex-row justify-between items-center">
        <Text>
          <Text className="text-xl font-semibold">{t("currentPractice")}:</Text>
          {practices.selectedPractice && (
            <Text className="text-xl"> {practices.selectedPractice.name}</Text>
          )}
        </Text>
        {/* Button to show/hide the list */}
        <ToggleButton
          listVisible={listVisible}
          toggleListVisibility={toggleListVisibility}
        />
      </View>

      {/* Animated list view */}
      <Animated.View style={animatedStyle} className="w-full overflow-hidden">
        <FlatList
          data={practices.data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          className="mt-3 rounded-xl"
          contentContainerStyle={{ flex: 1, justifyContent: "space-between" }}
          numColumns={3}
        />
      </Animated.View>
    </View>
  );
};

export default PracticeSelector;
