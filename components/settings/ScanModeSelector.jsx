import React, { useState, useRef } from "react";
import {
  FlatList,
  TouchableOpacity,
  View,
  Text,
  Animated,
  Easing,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useData } from "@/contexts/Data";

import ToggleButton from "./ToggleButton";

const modes = [
  { mode: "retrieve", label: "Retrieve" },
  { mode: "restock", label: "Restock" },
];

const ScanModeSelector = () => {
  const { t } = useTranslation();
  const { scanMode, setScanMode } = useData();

  const [listVisible, setListVisible] = useState(false); // State to toggle list visibility
  const animation = useRef(new Animated.Value(0)).current; // Animation value for showing/hiding the list

  // Toggle the visibility of the mode list
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
      outputRange: [0, 600], // Adjust height if needed
    }),
    opacity: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
  };

  // Render individual mode item
  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => setScanMode(item.mode)}
      className={`flex-1 p-4 border-gray-300 rounded-xl items-center ${
        scanMode === item.mode ? "bg-teal-300" : ""
      }`}
    >
      <Text className="text-base">{t(item.label)}</Text>
    </TouchableOpacity>
  );

  return (
    <View className="w-full">
      <View className="flex-row justify-between items-center">
        <Text>
          <Text className="text-xl font-semibold">{t("scanMode")}:</Text>
          {scanMode && (
            <Text className="text-xl">
              {" "}
              {t(`${modes.find((mode) => mode.mode === scanMode)?.label}`)}
            </Text>
          )}
        </Text>
        {/* Button to show/hide the list */}
        <ToggleButton
          listVisible={listVisible}
          toggleListVisibility={toggleListVisibility}
        />
      </View>
      <View className="w-full items-center">
        {/* Animated list view */}
        <Animated.View style={animatedStyle} className="w-full overflow-hidden">
          <FlatList
            data={modes}
            keyExtractor={(item) => item.mode}
            renderItem={renderItem}
            className="mt-3 rounded-xl"
            contentContainerStyle={{ flex: 1, justifyContent: "space-between" }}
            numColumns={2} // Adjust to show two columns for "Scan" and "Retrieve"
          />
        </Animated.View>
      </View>
    </View>
  );
};

export default ScanModeSelector;
