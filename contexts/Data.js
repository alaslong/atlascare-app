import React, { createContext, useContext, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./Auth";
import { fetchPractices } from "../hooks/fetch/practices";
import { fetchInventory } from "../hooks/fetch/inventory"; // Import the new fetch function
import AsyncStorage from "@react-native-async-storage/async-storage";

// Create DataContext
const DataContext = createContext();

// Custom hook to use the DataContext
export const useData = () => {
  return useContext(DataContext);
};

// DataProvider component that wraps the app and provides data state
export const DataProvider = ({ children }) => {
  const { user } = useAuth(); // Get user from Auth context

  const [selectedPractice, setSelectedPractice] = useState(null); // State for selected practice
  const [scanMode, setScanMode] = useState(null)

  // Load selectedPractice from AsyncStorage on mount
  useEffect(() => {
    const loadScanMode = async () => {
      try {
        const storedScanMode = await AsyncStorage.getItem("scanMode");
        if (storedScanMode) {
          setScanMode(storedScanMode);
        } else {
          setScanMode("retrieve"); // Default to retrieve mode if none is stored
        }
      } catch (error) {
        console.error("Failed to load selected practice from storage:", error);
      }
    };

    loadScanMode();
  }, []);

  // Save selectedPractice to AsyncStorage whenever it changes
  useEffect(() => {
    const storeScanMode = async () => {
      if (scanMode) {
        try {
          await AsyncStorage.setItem(
            "scanMode",
            scanMode
          );
        } catch (error) {
          console.error("Failed to save selected practice to storage:", error);
        }
      }
    };

    storeScanMode();
  }, [scanMode]);


  // Load selectedPractice from AsyncStorage on mount
  useEffect(() => {
    const loadSelectedPractice = async () => {
      try {
        const storedPractice = await AsyncStorage.getItem("selectedPractice");
        if (storedPractice) {
          setSelectedPractice(JSON.parse(storedPractice));
        }
      } catch (error) {
        console.error("Failed to load selected practice from storage:", error);
      }
    };

    loadSelectedPractice();
  }, []);

  // Save selectedPractice to AsyncStorage whenever it changes
  useEffect(() => {
    const saveSelectedPractice = async () => {
      if (selectedPractice) {
        try {
          await AsyncStorage.setItem(
            "selectedPractice",
            JSON.stringify(selectedPractice)
          );
        } catch (error) {
          console.error("Failed to save selected practice to storage:", error);
        }
      }
    };

    saveSelectedPractice();
  }, [selectedPractice]);

  // Use React Query to fetch practices
  const {
    data: practices,
    isLoading: isPracticesLoading,
    isError: isPracticesError,
    error: practicesError,
    refetch: refetchPractices,
  } = useQuery({
    queryKey: ["practices", user?.clientId],
    queryFn: () => fetchPractices(user.clientId),
    enabled: !!user?.clientId,
    retry: 1,
    staleTime: 1000 * 60 * 10,
    onSuccess: (data) => {
      if (!selectedPractice && data?.length > 0) {
        setSelectedPractice(data[0]);
      }
    },
  });

  // Fetch inventory data for the selected practice
  const {
    data: inventory,
    isLoading: isInventoryLoading,
    isError: isInventoryError,
    error: inventoryError,
    refetch: refetchInventory,
  } = useQuery({
    queryKey: ["inventory", selectedPractice?.id],
    queryFn: () => fetchInventory(selectedPractice.id),
    enabled: !!selectedPractice?.id, // Only fetch if a practice is selected
    retry: 1,
    staleTime: 1000 * 60 * 10,
  });

  // Value provided by the DataContext, namespaced for each data type
  const value = {
    practices: {
      data: practices,
      isLoading: isPracticesLoading,
      isError: isPracticesError,
      error: practicesError,
      refetch: refetchPractices,
      selected: selectedPractice,
      setSelected: setSelectedPractice,
    },
    inventory: {
      data: inventory,
      isLoading: isInventoryLoading,
      isError: isInventoryError,
      error: inventoryError,
      refetch: refetchInventory,
    },
    scanMode,
    setScanMode,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
