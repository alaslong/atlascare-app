import React from "react";
import { SafeAreaView, View, Text, TouchableOpacity } from "react-native";
import { useAuth } from "@/contexts/Auth";
import PracticeSelector from "../../components/settings/PracticeSelector";
import LanguageSelector from "../../components/settings/LanguageSelector";
import { useTranslation } from "react-i18next";
import ScanModeSelector from "../../components/settings/ScanModeSelector";

const Settings = () => {

  const { t } = useTranslation();

  const { logout } = useAuth();

  return (
    <SafeAreaView className="flex-1" edges={['top']}>
      <View className="flex-1 justify-between items-center p-2">
        <View className="w-full gap-6">
        <LanguageSelector />

        <PracticeSelector />

        <ScanModeSelector />
        </View>

        <TouchableOpacity
          className="p-3 bg-red-500 rounded-lg w-full"
          onPress={logout}
        >
          <Text className="text-white text-center font-semibold text-xl">
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Settings;
