import { Vibration } from "react-native";
import Animated, { withTiming } from "react-native-reanimated"; // Import withTiming for reanimated animations
import { throttle } from "lodash";
import { useData } from "@/contexts/Data";
import { useFetchInventoryProduct } from "./mutations/inventory/products";
import parseBarcode from "./barcodes/parseBarcode";

// Scan handler that works with the API
const scanHandler = ({
  canScan,
  paused,
  lastScannedData,
  setColourStatus,
  setCanScan,
  setPaused,
  setLastScannedData,
  barcodeWithin,

}) => {
  const { practices, products } = useData(); // Fetch the selected practice



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

        setColourStatus('blue')

        try {
          const payload = {
            clientPracticeId: practices.selected.id,
            productNumber: parsedBarcode.productNumber,
            batchNumber: parsedBarcode.batchNumber,
          };

          // Fetch product info using mutation
          const productInfo = await fetchInventoryProduct.mutateAsync(payload);

          if (productInfo) {
            // Check if product already exists in the scannedProducts (ensure it's an array)
            const existingProductIndex = products.scanned.findIndex(
              (item) =>
                item.productNumber === payload.productNumber &&
                item.batchNumber === payload.batchNumber
            );

            // If product exists, increment the local quantity
            if (existingProductIndex !== -1) {
              const updatedProducts = [...products.scanned];
              updatedProducts[existingProductIndex].quantity += 1; // Increment local quantity
              products.setScanned(updatedProducts);
            } else {
              // If product doesn't exist, add it with quantity = 1
              products.setScanned((prevProducts) => [
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
