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
import ScannedProductsItem from "@/components/scan/ScannedProductsItem";
import { useTranslation } from "react-i18next";
import {
  useAddToInventory,
  useRemoveFromInventory,
} from "@/utils/mutations/inventory/products";
import { useData } from "@/contexts/Data";
import { FontAwesome6 } from "@expo/vector-icons";


import { useQueryClient } from "@tanstack/react-query";

// Function to calculate snap points for the bottom sheet modal
const calculateSnapPoints = (itemCount) => {
  const { height } = Dimensions.get("window");
  const itemHeight = 70; // Estimated height of each item (including padding/margin)
  const maxHeight = height * 0.8;
  const minHeight = Math.min(itemCount * itemHeight + 90, maxHeight); // Minimum height based on item count

  return [minHeight, maxHeight]; // Two snap points: min and max heights
};

const ScannedProductsList = ({

  onClose,
  unpauseScanning,
}) => {
  const { t } = useTranslation();
  const { practices, scanMode, products } = useData(); // Fetch the selected practice
  const bottomSheetModalRef = useRef(null);
  const [scannedProductsListVisible, setScannedProductsListVisible] =
    useState(false); // To control modal visibility
  const snapPoints = useMemo(
    () => calculateSnapPoints(products.scanned.length),
    [products.scanned.length]
  );

  const queryClient = useQueryClient();

  // Mutations for inventory management
  const addToInventory = useAddToInventory();
  const removeFromInventory = useRemoveFromInventory();

  // Effect to hide the scanned products list when all items are removed
  useEffect(() => {
    if (products.scanned.length > 0) {
      setScannedProductsListVisible(true);
    } else if (products.scanned.length === 0) {
      setScannedProductsListVisible(false);
    }
  }, [products.scanned]); // Trigger this effect whenever `scannedProducts` changes

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
    const clientPracticeId = practices?.selected?.id;
    if (!clientPracticeId) {
      console.error("No practice selected.");
      return;
    }

    const mutation =
      scanMode === "retrieve" ? removeFromInventory : addToInventory;

    try {
      await mutation.mutateAsync({
        clientPracticeId,
        products: products.scanned,
      });
      // onConfirm(); // Post mutation success handling
    } catch (error) {
      console.error("Error processing inventory action:", error);
    } finally {
      queryClient.invalidateQueries("inventory", practices.selected.id);
      products.setScanned([]);
      unpauseScanning();
    }
  };

  // Footer without using BottomSheetFooter directly (just pass the footer content)
  const renderFooter = useCallback(
    (props) => (
      <BottomSheetFooter {...props} bottomInset={0}>
        <View className="flex-row m-2 gap-2 z-10">
          <TouchableOpacity
            onPress={handleConfirmAction}
            className="bg-[#3b8ae6] px-4 py-2 rounded-2xl justify-between items-center flex-row flex-grow"
          >
            <Text className="text-white text-center text-lg font-semibold">
              {scanMode === "retrieve"
                ? t("removeFromInventory")
                : t("addToInventory")}
            </Text>
            <FontAwesome6
              name={scanMode === "retrieve" ? "minus" : "plus"}
              color="white"
              size={16}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              products.setScanned([]);
              unpauseScanning();
            }}
            className="bg-gray-300 px-4 py-2 rounded-2xl justify-center items-center"
          >
            <FontAwesome6 name="xmark" color="gray" size={16} />
          </TouchableOpacity>
        </View>
      </BottomSheetFooter>
    ),
    [handleConfirmAction, t, scanMode]
  );

  const handleRemoveItem = useCallback(
    (productNumber, expiryDate, batchNumber) => {
      products.setScanned(
        (prevProducts) =>
          prevProducts
            .map((item) => {
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
            })
            .filter(Boolean) // Remove null entries from the array
      );
    },
    [products.setScanned]
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
        backgroundStyle={{
          backgroundColor: "#fefefe",
          shadowColor: "#000000",
          shadowOpacity: 0.1,
          shadowRadius: 20,
        }}
      >
        <View className="flex-1 px-2 z-10">
          <Text className="px-2 mb-2 font-semibold">{t('scannedArticles')}</Text>
          <FlatList
            data={products.scanned.slice().reverse()}
            scrollEnabled={false}
            keyExtractor={(item, index) =>
              item.productNumber?.toString() || index.toString()
            }
            renderItem={({ item }) => (
              <ScannedProductsItem
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
