import React, { useEffect } from "react";
import { useNavigation } from "expo-router";
import { useAuth } from "@/contexts/Auth";
import LoadingScreen from '@/components/LoadingScreen';

const Index = () => {
  const navigation = useNavigation();
  const { user, loading } = useAuth();

  useEffect(() => {
    const redirect = () => {
      // Avoid running redirection logic if loading or the screen is not focused
      if (!loading) {
        try {
          if (user) {
            console.log("User is authenticated, navigating to /scan");
            navigation.replace("(tabs)");
          } else {
            console.log("User is not authenticated, navigating to /login");
            navigation.replace("login");
          }
        } catch (error) {
          console.error("Navigation Error:", error);
        }
      }
    };

    redirect();
  }, [user, loading, navigation]);

  // Show loading screen if loading is true or the screen isn't ready for navigation yet
  if (loading) {
    return <LoadingScreen />;
  }

  return null; 
};

export default Index;
