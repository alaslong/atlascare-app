import React, { createContext, useContext, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./Auth";
import { fetchPractices } from "../hooks/fetch/practices";
import { fetchInventoryStock } from "../hooks/fetch/inventoryStock"; // Import the new fetch function
import { fetchInventories } from "../hooks/fetch/inventories"; // Import the new fetch function
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
  const [selectedInventory, setSelectedInventory] = useState(null); // State for selected practice
  const [scanMode, setScanMode] = useState(null);
  const [scannedProducts, setScannedProducts] = useState([]);

  // New state for filtered inventory stock
  const [filteredInventoryStock, setFilteredInventoryStock] = useState([]);

  // Function to filter inventory stock based on clientInventoryId
  const filterInventoryStock = (clientInventoryId) => {
    if (!inventoryStock) {
      console.warn("Inventory stock data is not loaded yet.");
      return;
    }

    const filtered = inventoryStock.filter(
      (item) => item.clientInventoryId === clientInventoryId
    );

    setFilteredInventoryStock(filtered);
  };

  // Load scanMode from AsyncStorage on mount
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
        console.error("Failed to load scanMode from storage:", error);
      }
    };

    loadScanMode();
  }, []);

  // Save scanMode to AsyncStorage whenever it changes
  useEffect(() => {
    const storeScanMode = async () => {
      if (scanMode) {
        try {
          await AsyncStorage.setItem("scanMode", scanMode);
        } catch (error) {
          console.error("Failed to save scanMode to storage:", error);
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

  // Save selectedPractice to AsyncStorage whenever it changes
  useEffect(() => {
    if (selectedInventory) {
      filterInventoryStock(selectedInventory.id);
    } else {
      setFilteredInventoryStock([]);
    }
  }, [selectedInventory]);

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

  // Fetch inventories for the selected practice
  const {
    data: inventories,
    isLoading: isInventoriesLoading,
    isError: isInventoriesError,
    error: inventoriesError,
    refetch: refetchInventories,
  } = useQuery({
    queryKey: ["inventories", selectedPractice?.id],
    queryFn: () => fetchInventories(selectedPractice.id),
    enabled: !!selectedPractice?.id, // Only fetch if a practice is selected
    retry: 1,
    staleTime: 1000 * 60 * 10,
  });

  // Fetch all inventory stock data for the selected practice
  const {
    data: inventoryStock,
    isLoading: isInventoryStockLoading,
    isError: isInventoryStockError,
    error: inventoryStockError,
    refetch: refetchInventoryStock,
  } = useQuery({
    queryKey: ["inventoryStock", selectedPractice?.id],
    queryFn: () => fetchInventoryStock(selectedPractice.id),
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
    inventories: {
      data: inventories,
      isLoading: isInventoriesLoading,
      isError: isInventoriesError,
      error: inventoriesError,
      refetch: refetchInventories,
      selected: selectedInventory,
      setSelected: setSelectedInventory,
    },
    inventoryStock: {
      data: inventoryStock,
      isLoading: isInventoryStockLoading,
      isError: isInventoryStockError,
      error: inventoryStockError,
      refetch: refetchInventoryStock,
      filter: filterInventoryStock, // Expose filterInventoryStock function
      filtered: filteredInventoryStock, // Expose filteredInventoryStock
      setFiltered: setFilteredInventoryStock, // Expose setFilteredInventoryStock
    },
    products: {
      scanned: scannedProducts,
      setScanned: setScannedProducts,
    },
    scanMode,
    setScanMode,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
