import React from "react";
import { View, Text, FlatList, SafeAreaView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useData } from "@/contexts/Data";
import { ExpiryBadge } from "@/components/inventory/ColourCalculators";
import { FontAwesome6 } from "@expo/vector-icons";
import formatDate from "../../../utils/dateFormatter";
import { Image } from "expo-image";
import { useTranslation } from "react-i18next";

// Header component to display product details
const ListHeader = ({ product, t }) => (
  <View className="mb-4 flex-row justify-between items-center">
    <View>
      <Text className="text-xl font-bold">{product.primaryName}</Text>
      <View className="flex-col justify-between">
        <Text className="text-sm text-gray-500">
         {t('productNumber')}: {product.productNumber}
        </Text>
        <Text className="text-sm text-gray-500">
          <FontAwesome6 name="location-dot" color="gray" />{" "}
          {product.clientInventoryName}
        </Text>
      </View>
    </View>
    <View className="bg-white rounded-lg p-1 border border-gray-100">
      <Image source={{ uri: product.image }} style={{ width: 50, height: 50 }} />
    </View>
  </View>
);

// Function to render each batch item
const renderBatchItem = ({ item, t }) => {
  const date = formatDate(item.expiryDate);

  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-1">
        <Text className="text-md">{t('batchNumber')}: {item.batchNumber || "N/A"}</Text>
        <View className="flex-row items-center gap-2 mt-1">
          <FontAwesome6 name="hourglass-end" color="gray" />
          <Text className="text-sm text-gray-500">
            {item.expiryDate ? date : "N/A"}
          </Text>
        </View>
      </View>
      <View className="flex-col gap-1">
        <Text className="text-gray-500 text-sm self-end">
          {t('quantity')}: {item.quantity}
        </Text>
        <ExpiryBadge expiryDate={item.expiryDate} />
      </View>
    </View>
  );
};

const ProductDetails = () => {
  const { t } = useTranslation(); // Call useTranslation inside the component
  const { productId } = useLocalSearchParams();
  const { inventoryStock } = useData();

  const productBatches = inventoryStock?.data?.filter(
    (item) => item.productId === parseInt(productId, 10)
  );

  if (!productBatches || productBatches.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 p-4">
          <Text>{t('noDetailsAvailable')}</Text> {/* Use t() for translation */}
        </View>
      </SafeAreaView>
    );
  }

  const product = productBatches[0];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 p-4">
        <FlatList
          ListHeaderComponent={<ListHeader product={product} t={t}/>}
          data={productBatches}
          keyExtractor={(item) => item.batchNumber}
          renderItem={({ item }) => renderBatchItem({ item, t })} // Pass t() function to renderBatchItem
          contentContainerStyle={{ paddingBottom: 16 }}
          ItemSeparatorComponent={() => (
            <View className="border-b m-2 border-gray-200" />
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default ProductDetails;
