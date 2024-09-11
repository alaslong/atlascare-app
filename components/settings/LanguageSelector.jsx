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

import ToggleButton from "./ToggleButton";

const LanguageSelector = () => {
  const { t, i18n } = useTranslation();

  // Language mapping with full names in native language
  const languageMap = {
    en: "English",
    de: "Deutsch",
    fr: "Français",
    es: "Español",
    pt: "Português",
    it: "Italiano",
    ja: "日本語",
    zh: "中文",
    ko: "한국어",
  };

  // Array of language codes
  const languages = Object.keys(languageMap);

  const [listVisible, setListVisible] = useState(false); // State to toggle list visibility
  const animation = useRef(new Animated.Value(0)).current; // Animation value for showing/hiding the list

  // Toggle the visibility of the language list
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

  // Render individual language item with full name
  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => i18n.changeLanguage(item)}
      className={`flex-1 p-4 border-gray-300 rounded-xl items-center ${
        i18n.language === item ? "bg-teal-300" : ""
      }`}
    >
      <Text className="text-base">{languageMap[item]}</Text>
    </TouchableOpacity>
  );

  return (
    <View className="w-full">
      <View className="flex-row justify-between items-center">
        <Text>
          <Text className="text-xl font-semibold">{t("language")}:</Text>
          {i18n && (
            <Text className="text-xl">
              {" "}
              {languageMap[i18n.language] || i18n.language}
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
            data={languages}
            keyExtractor={(item) => item}
            renderItem={renderItem}
            className="mt-3 rounded-xl"
            contentContainerStyle={{ flex: 1, justifyContent: "space-between" }}
            numColumns={3}
          />
        </Animated.View>
      </View>
    </View>
  );
};

export default LanguageSelector;
