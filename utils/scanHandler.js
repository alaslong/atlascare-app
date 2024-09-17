import { Vibration, Animated } from "react-native";
import { throttle } from "lodash";
import { useData } from "@/contexts/Data";
import { useAddToInventory, useFetchInventoryProduct, useRemoveFromInventory } from "./mutations/inventory/products";
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
  scannedProducts,
  setScannedProducts, // Pass setScannedProducts to update modal content
}) => {
  const { scanMode, practices } = useData(); // Fetch the selected practice

  
  
  // Fetch product info mutation
  const fetchInventoryProduct = useFetchInventoryProduct();

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
          const payload = {
            clientPracticeId: practices.selectedPractice.id,
            productNumber: parsedBarcode.productNumber,
            batchNumber: parsedBarcode.batchNumber,
          };

          // Fetch product info using mutation
          const productInfo = await fetchInventoryProduct.mutateAsync(payload);

          if (productInfo) {
            // Check if product already exists in the scannedProducts (ensure it's an array)
            const existingProductIndex = scannedProducts.findIndex(
              (item) =>
                item.productNumber === payload.productNumber &&
                item.batchNumber === payload.batchNumber
            );

            // If product exists, increment the local quantity
            if (existingProductIndex !== -1) {
              const updatedProducts = [...scannedProducts];
              updatedProducts[existingProductIndex].quantity += 1; // Increment local quantity
              setScannedProducts(updatedProducts);
            } else {
              // If product doesn't exist, add it with quantity = 1
              setScannedProducts((prevProducts) => [
                ...prevProducts,
                {
                  ...productInfo,
                  quantity: 1, // Initialize quantity to 1 for the first scan
                },
              ]);
            }
          } else {
            console.error("Product not found");
          }
        } catch (error) {
          console.error("Error fetching product information", error);
        }
  
      }
    },
    1000, // Throttle function to prevent too many requests
    { leading: true, trailing: false }
  );
};

export default scanHandler;
