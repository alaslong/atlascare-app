import React from "react";
import { SafeAreaView, View, Text, TouchableOpacity } from "react-native";
import { useAuth } from "@/contexts/Auth";
import PracticeSelector from "../../components/settings/PracticeSelector";
import LanguageSelector from "../../components/settings/LanguageSelector";
import { useTranslation } from "react-i18next";
import ScanModeSelector from "../../components/settings/ScanModeSelector";
import MainButton from "../../components/MainButton";

const Settings = () => {
  const { t } = useTranslation();

  const { logout } = useAuth();

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <View className="flex-1 justify-between items-center p-4 ">
        <View className="w-full gap-6">
          <LanguageSelector />

          <PracticeSelector />

          <ScanModeSelector />
        </View>

        {/* <MainButton
          text={t("Logout")}
          func={logout}
          colour="bg-red-500"
          icon="right-from-bracket"
        /> */}
      </View>
    </SafeAreaView>
  );
};

export default Settings;
