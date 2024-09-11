import { Vibration, Animated } from "react-native";
import { throttle } from "lodash";
import { useData } from "@/contexts/Data";

import { useAddToInventory, useRemoveFromInventory } from "./mutations/inventory/products";

import parseBarcode from "./barcodes/parseBarcode";

// Scan handler that works with the API
const scanHandler = ({
  canScan,
  paused,
  lastScannedData,
  borderColor,
  setCanScan,
  setPaused,
  setLastScannedData,
  barcodeWithin,
  addOrRemove, // Determines whether to add or remove product
}) => {
  // Initialize the mutations
  const addToInventory = useAddToInventory();
  const removeFromInventory = useRemoveFromInventory();

  const { practices } = useData(); // Fetch the selected practice

  return throttle(
    async ({ data, cornerPoints }) => {
      if (
        canScan &&
        !paused &&
        data &&
        data !== lastScannedData &&
        barcodeWithin(cornerPoints)
      ) {
        setCanScan(false);
        setPaused(true);

        const parsedBarcode = parseBarcode(data); // Parse the scanned barcode
        setLastScannedData(data);
        Vibration.vibrate(); // Trigger vibration

        // Trigger border color animation
        Animated.timing(borderColor, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }).start();

        try {
          const payload = { ...parsedBarcode, clientPracticeId: practices.selectedPractice.id };

          if (addOrRemove === "add") {
            await addToInventory.mutateAsync(payload);
          } else if (addOrRemove === "remove") {
            await removeFromInventory.mutateAsync(payload);
          }
        } catch (error) {
          console.error("Error in inventory mutation");
        } finally {
  

        }
      }
    },
    1000, // Throttle function to prevent too many requests
    { leading: true, trailing: false }
  );
};

export default scanHandler;
