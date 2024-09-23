import React from "react";
import { SafeAreaView, View, TouchableOpacity, Text, FlatList } from "react-native";
import { useData } from "@/contexts/Data";
import { useTranslation } from "react-i18next";
import { useNavigation } from "expo-router";
import { FontAwesome6 } from "@expo/vector-icons";
import { QuantityText, ExpiryBadge } from "../../../components/inventory/ColourCalculators";

// Group products by productId and sum their quantities
const groupByProduct = (data) => {
  const grouped = {};

  data.forEach((item) => {
    if (!grouped[item.productId]) {
      grouped[item.productId] = {
        ...item,
        totalQuantity: item.quantity,
        earliestExpiry: item.expiryDate,
      };
    } else {
      grouped[item.productId].totalQuantity += item.quantity;
      if (new Date(item.expiryDate) < new Date(grouped[item.productId].earliestExpiry)) {
        grouped[item.productId].earliestExpiry = item.expiryDate;
      }
    }
  });

  return Object.values(grouped);
};

const ListHeader = () => (
  <View className="mb-4">
    <Text className="text-xl font-bold">Current stock</Text>
  </View>
);

const InventoryItem = ({ item }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  
  const { primaryName, productNumber, clientInventoryName, totalQuantity, earliestExpiry, productId } = item;

  const handlePress = () => {
    navigation.navigate("productDetails", { productId });
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-base">{primaryName || `${t("productNumber")}: ${productNumber}`}</Text>
          <View className="flex-row items-center gap-2 mt-1">
            <FontAwesome6 name="location-dot" color="gray" />
            <Text className="text-sm text-gray-500">
              {clientInventoryName || t("noLocation")}
            </Text>
          </View>
        </View>
        <View className="flex-col gap-1">
          <QuantityText quantity={totalQuantity} item={item} />
          <ExpiryBadge expiryDate={earliestExpiry} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const Inventory = () => {
  const { inventoryStock } = useData();

  if (inventoryStock.data === undefined) {
    inventoryStock.refetch();
  }

  if (inventoryStock.isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 p-4">
          <Text>Loading inventory...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (inventoryStock.isError) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 p-4">
          <Text>Error loading inventory: {inventoryStock.error.message}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const inventoryData = inventoryStock?.filtered.length > 0 ? inventoryStock.filtered : inventoryStock.data;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 p-4">
        <FlatList
          data={groupByProduct(inventoryData)}
          ListHeaderComponent={ListHeader}
          keyExtractor={(item) => item.productId.toString()}
          renderItem={({ item }) => <InventoryItem item={item} />}
          contentContainerStyle={{ paddingBottom: 16}}
          ItemSeparatorComponent={() => <View className="border-b m-2 border-gray-200" />}
        />
      </View>
    </SafeAreaView>
  );
};

export default Inventory;
