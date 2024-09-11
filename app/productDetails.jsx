import React from "react";
import { View, Text, FlatList } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useData } from "../contexts/Data";
import { ExpiryBadge } from "../components/inventory/ColourCalculators"; // Import the badge utility

const ProductDetails = () => {
  const params = useLocalSearchParams();
  const { inventory } = useData();
  const { productId } = params; // Get the productId from the query params

  // Filter the inventory to get only the batches for the selected productId
  const productBatches = inventory.data.filter(
    (item) => item.productId === parseInt(productId, 10)
  );

  // Render each batch for the selected product
  const renderBatchItem = ({ item }) => {
    return (
      <View className="flex-row mb-4 border border-gray-300 rounded-lg p-4">
        <View className="flex-1">
          <Text className="text-lg font-bold">
            Batch Number: {item.batchNumber}
          </Text>
          <Text className="text-gray-500">Expiry Date: {item.expiryDate}</Text>
          <Text className="text-gray-500">Quantity: {item.quantity}</Text>
        </View>

        {/* Expiry Badge */}
        <ExpiryBadge expiryDate={item.expiryDate} />
      </View>
    );
  };

  return (
    <View className="flex-1 bg-white p-4">
      {productBatches.length > 0 ? (
        <>
          <Text className="text-xl font-bold mb-4">
            {productBatches[0].primaryName} Details
          </Text>
          <FlatList
            data={productBatches} // List of batches for the selected product
            keyExtractor={(item) => `${item.batchNumber}-${item.expiryDate}`}
            renderItem={renderBatchItem}
            contentContainerStyle={{ paddingBottom: 16 }}
          />
        </>
      ) : (
        <Text>No details available for this product.</Text>
      )}
    </View>
  );
};

export default ProductDetails;
