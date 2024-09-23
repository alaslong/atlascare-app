import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { QuantityText, ExpiryBadge } from "./ColourCalculators";
import { useNavigation } from "expo-router";

const InventoryItem = ({ item }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const {
    primaryName,
    productNumber,
    clientInventoryName,
    totalQuantity,
    earliestExpiry,
    productId,
  } = item;

  const handlePress = () => {
    navigation.navigate("productDetails", {
      productId: productId,
    });
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View className="flex-row items-center justify-between">
        {/* Product Information */}
        <View>
          <Text className="text-base">
            {primaryName
              ? primaryName
              : `${t("productNumber")}: ${productNumber}`}
          </Text>

          <Text className="text-sm text-gray-500 mt-1">
            <FontAwesome6 name="location-dot" color="gray" />{" "}
            {clientInventoryName ? clientInventoryName : t("noLocation")}
          </Text>
        </View>

        {/* Quantity and Expiry */}
        <View className="flex-col self-end">
          <QuantityText quantity={totalQuantity} item={item} />
          <ExpiryBadge expiryDate={earliestExpiry} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default InventoryItem;
