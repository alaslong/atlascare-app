import React, {
  useRef,
  useEffect,
  useCallback,
  useMemo,
  useState,
} from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import {
  BottomSheetFooter,
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import ProductListItemScan from "@/components/scan/ScannedProductsListItem";
import { useTranslation } from "react-i18next";
import {
  useAddToInventory,
  useRemoveFromInventory,
} from "@/utils/mutations/inventory/products";
import { useData } from "@/contexts/Data";
import { FontAwesome6 } from "@expo/vector-icons";

// Function to calculate snap points for the bottom sheet modal
const calculateSnapPoints = (itemCount) => {
  const { height } = Dimensions.get("window");
  const itemHeight = 70; // Estimated height of each item (including padding/margin)
  const maxHeight = height * 0.8;
  const minHeight = Math.min(itemCount * itemHeight + 70, maxHeight); // Minimum height based on item count

  return [minHeight, maxHeight]; // Two snap points: min and max heights
};

const ScannedProductsList = ({
  scannedProducts,
  setScannedProducts,
  onClose,
}) => {
  const { t } = useTranslation();
  const bottomSheetModalRef = useRef(null);
  const [scannedProductsListVisible, setScannedProductsListVisible] =
    useState(false); // To control modal visibility
  const snapPoints = useMemo(
    () => calculateSnapPoints(scannedProducts.length),
    [scannedProducts.length]
  );
  const { practices, scanMode } = useData(); // Fetch the selected practice

  // Mutations for inventory management
  const addToInventory = useAddToInventory();
  const removeFromInventory = useRemoveFromInventory();

  // Effect to hide the scanned products list when all items are removed
  useEffect(() => {
    if (scannedProducts.length > 0) {
      setScannedProductsListVisible(true);
    } else if (scannedProducts.length === 0) {
      setScannedProductsListVisible(false);
    }
  }, [scannedProducts]); // Trigger this effect whenever `scannedProducts` changes

  // Control modal visibility
  useEffect(() => {
    if (scannedProductsListVisible) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [scannedProductsListVisible]);

  // Centralized confirmation action for adding/removing inventory
  const handleConfirmAction = async () => {
    const clientPracticeId = practices?.selectedPractice?.id;
    if (!clientPracticeId) {
      console.error("No practice selected.");
      return;
    }

    const mutation =
      scanMode === "retrieve" ? removeFromInventory : addToInventory;

    try {
      await mutation.mutateAsync({
        clientPracticeId,
        products: scannedProducts,
      });
      // onConfirm(); // Post mutation success handling
    } catch (error) {
      console.error("Error processing inventory action:", error);
    }
  };

  // Footer without using BottomSheetFooter directly (just pass the footer content)
  const renderFooter = useCallback(
    (props) => (
      <BottomSheetFooter {...props} bottomInset={5}>
        <View className="flex-row mx-2 gap-2">
          <TouchableOpacity
            onPress={handleConfirmAction}
            className="bg-blue-400 rounded-lg p-3 h-12 justify-center items-center flex-grow"
          >
            <Text className="text-white text-center">
              {scanMode === "retrieve"
                ? t("removeFromInventory")
                : t("addToInventory")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setScannedProducts([])}
            className="bg-gray-300 rounded-lg p-4 h-12 justify-center items-center"
          >
            <FontAwesome6 name="xmark" color="gray" size={18} />
          </TouchableOpacity>
        </View>
      </BottomSheetFooter>
    ),
    [handleConfirmAction, t, scanMode]
  );

  const handleRemoveItem = useCallback(
    (productNumber, expiryDate, batchNumber) => {
      setScannedProducts((prevProducts) =>
        prevProducts.map((item) => {
          if (
            item.productNumber === productNumber &&
            item.expiryDate === expiryDate &&
            item.batchNumber === batchNumber
          ) {
            // If quantity is more than 1, reduce by 1
            if (item.quantity > 1) {
              return { ...item, quantity: item.quantity - 1 };
            }
            // If quantity is 1, remove the item (by not returning it in the new array)
            return null;
          }
          return item;
        }).filter(Boolean) // Remove null entries from the array
      );
    },
    [setScannedProducts]
  );

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose={false}
        onDismiss={onClose}
        footerComponent={renderFooter} // Correctly pass the footer content
      >
        <View className="flex-1 px-2">
          <FlatList
            data={scannedProducts.slice().reverse()}
            scrollEnabled={false}
            keyExtractor={(item, index) =>
              item.productNumber?.toString() || index.toString()
            }
            renderItem={({ item }) => (
              <ProductListItemScan
                item={item}
                onRemove={() =>
                  handleRemoveItem(
                    item.productNumber,
                    item.expiryDate,
                    item.batchNumber
                  )
                }
              />
            )}
            ItemSeparatorComponent={() => (
              <View className="w-full mb-2 mt-2 border-b border-gray-300" />
            )}
          />
        </View>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

export default ScannedProductsList;
