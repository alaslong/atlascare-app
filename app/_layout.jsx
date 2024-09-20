// app/_layout.js

import React, { useState, useEffect, useMemo } from "react";
import { Slot, Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "@/global.css";

import { AuthProvider } from "@/contexts/Auth";
import { DataProvider } from "@/contexts/Data";
import LoadingScreen from "@/components/LoadingScreen";

// Import language JSON files
import en from "@/utils/languages/en-GB.json";
import de from "@/utils/languages/de-DE.json";
import fr from "@/utils/languages/fr-FR.json";
import es from "@/utils/languages/es-ES.json";
import pt from "@/utils/languages/pt-PT.json";
import it from "@/utils/languages/it-IT.json";
import ja from "@/utils/languages/ja-JP.json";
import zh from "@/utils/languages/zh-CN.json";
import ko from "@/utils/languages/ko-KR.json";

// Define available resources
const resources = { en, de, fr, es, pt, it, ja, zh, ko };


const initializeI18n = async () => {
  try {
    const storedLocale = await AsyncStorage.getItem("storedLocale");
    const initialLanguage =
      storedLocale || Localization.getLocales()?.[0]?.languageTag || "en-GB";

    if (!storedLocale) {
      await AsyncStorage.setItem("storedLocale", initialLanguage);
    }

    await i18n.use(initReactI18next).init({
      compatibilityJSON: "v3",
      resources,
      lng: initialLanguage,
      fallbackLng: "en-GB",
      interpolation: {
        escapeValue: false,
      },
    });

    return true;
  } catch (error) {
    console.error("Failed to initialize language:", error);
    return true;
  }
};

/**
 * RootLayout Component
 */
const RootLayout = () => {
  const [languageLoaded, setLanguageLoaded] = useState(false);

  // Memoize QueryClient to prevent recreation on every render
  const queryClient = useMemo(() => new QueryClient(), []);

  useEffect(() => {
    const setupI18n = async () => {
      const isInitialized = await initializeI18n();
      if (isInitialized) {
        setLanguageLoaded(true);
      }
    };

    setupI18n();
  }, []);

  if (!languageLoaded) {
    return <LoadingScreen />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DataProvider>
          <Stack
          screenOptions={{
            headerShown: false,
          }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="login" />
            <Stack.Screen name="(tabs)" options={{ tabBarVisible: false }} />
          </Stack>
        </DataProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default RootLayout;
