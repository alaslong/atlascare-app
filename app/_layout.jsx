import { useState, useEffect } from "react";
import { Stack } from "expo-router";
import { AuthProvider } from "@/contexts/Auth";
import { DataProvider } from "@/contexts/Data";
import "@/global.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

import en from "@/utils/languages/en-GB.json";
import de from "@/utils/languages/de-DE.json";
import fr from "@/utils/languages/fr-FR.json";
import es from "@/utils/languages/es-ES.json";
import pt from "@/utils/languages/pt-PT.json";
import it from "@/utils/languages/it-IT.json";
import ja from "@/utils/languages/ja-JP.json";
import zh from "@/utils/languages/zh-CN.json";
import ko from "@/utils/languages/ko-KR.json";

const queryClient = new QueryClient();

const RootLayout = () => {
  const resources = { en, de, fr, es, pt, it, ja, zh, ko };
  const [languageLoaded, setLanguageLoaded] = useState(false);

  useEffect(() => {
    const initializeLanguage = async () => {
      const savedLanguage = await AsyncStorage.getItem("selectedLanguage");
      const initialLanguage =
        savedLanguage || Localization.getLocales()?.[0]?.languageTag || "en-GB";

      i18n.use(initReactI18next).init({
        compatibilityJSON: "v3",
        resources,
        lng: initialLanguage,
        fallbackLng: "en",
      });

      setLanguageLoaded(true);
    };

    initializeLanguage();
  }, []);

  if (!languageLoaded) {
    return null; // Return null or a loading component until language is loaded
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DataProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              gestureEnabled: false,
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen
              name="login"
              options={{
                title: "Login",
              }}
            />
            <Stack.Screen name="(tabs)" />

            <Stack.Screen
              name="productDetails"
              options={{
                title: "Product Details",
              }}
            />
          </Stack>
        </DataProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default RootLayout;
