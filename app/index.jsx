import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/Auth"; // Assuming the context is in this path
import LoadingScreen from '@/components/LoadingScreen';

const Index = () => {
  const router = useRouter();
  const { checkAuth } = useAuth();
  const [loading, setLoading] = useState(true); // Loading state for showing a spinner

  useEffect(() => {
    const checkAuthentication = async () => {
      const isAuthenticated = await checkAuth(); // Use the checkAuth function from context

      if (isAuthenticated) {
        // If the user is authenticated, redirect to the scan screen
        router.navigate("/main");
      } else {
        // If not authenticated, redirect to the login screen
        router.navigate("/login");
      }
    };

    checkAuthentication().finally(() => setLoading(false)); // Stop loading after check
  }, []);

  // While loading, show a spinner or loading message
  if (loading) return <LoadingScreen />;

  return null; // Optionally return null if the component has nothing to render
};

export default Index;
