import React from "react";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { useData } from "../contexts/Data";
import { useRouter } from "expo-router"; // Import the router hook
import {
  ExpiryBadge,
  QuantityText,
} from "../components/inventory/ColourCalculators"; // Import the colour utilities

const Inventory = () => {
  const { inventory } = useData();

  const router = useRouter();

  // Group products by productId and sum their quantities
  const groupByProduct = (data) => {
    const grouped = {};

    data.forEach((item) => {
      if (!grouped[item.productId]) {
        grouped[item.productId] = {
          ...item,
          totalQuantity: item.quantity,
          earliestExpiry: item.expiryDate, // Track earliest expiry date
        };
      } else {
        grouped[item.productId].totalQuantity += item.quantity;
        // Update earliest expiry date if the current batch is earlier
        if (
          new Date(item.expiryDate) <
          new Date(grouped[item.productId].earliestExpiry)
        ) {
          grouped[item.productId].earliestExpiry = item.expiryDate;
        }
      }
    });

    return Object.values(grouped);
  };

  // Render each grouped product in the list
  const renderItem = ({ item }) => {
  

    return (
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/productDetails",
            params: { productId: item.productId },
          })
        } // Navigate to ProductDetails
      >
        <View className="flex-row mb-4 border border-gray-300 rounded-lg p-4 items-center">
          {/* Product Image */}
          <Image
            source={{ uri: item.image }}
            className="w-20 h-20 mr-4 rounded-lg"
            resizeMode="contain"
          />

          {/* Product Details */}
          <View className="flex-1 justify-center">
            <Text className="text-lg font-bold">{item.primaryName}</Text>
            <Text className="text-gray-500">{item.secondaryName}</Text>

            {/* Product Number and Total Quantity */}
            <Text className="text-sm text-gray-700 mt-1">
              Product Number: {item.productNumber}
            </Text>
            <QuantityText quantity={item.totalQuantity} item={item} />
          </View>

          {/* Expiry Badge */}
          <ExpiryBadge expiryDate={item.earliestExpiry} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-white p-4">
      {/* Check if inventory is loading or if there was an error */}
      {inventory.isLoading ? (
        <Text>Loading inventory...</Text>
      ) : inventory.isError ? (
        <Text>Error loading inventory: {inventory.error.message}</Text>
      ) : (
        <FlatList
          data={groupByProduct(inventory.data)}
          keyExtractor={(item) => item.productId.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      )}
    </View>
  );
};

export default Inventory;
