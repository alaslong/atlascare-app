import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { FontAwesome6 } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

const ProductListItemScan = ({ item, onRemove }) => {
  const { t } = useTranslation();



  return (
    <View className="flex-row items-center justify-between h-14">
      <Image
        source={{ uri: item.image || "https://via.placeholder.com/50" }}
        className="w-12 h-12 rounded-lg"
      />
      <View className="flex-3 mx-2">
        {/* Display expiry date and batch number */}
        <View className="flex-row justify-begin">
          <Text className="text-sm text-gray-500 px-1 items-center mr-2">
            <FontAwesome6 name="hourglass-end" color="gray" /> {item.expiryDate || "N/A"}
          </Text>
          <Text className="text-sm text-gray-500">
            <FontAwesome6 name="tag" color="gray" /> {item.batchNumber || "N/A"}
          </Text>
        </View>

        {/* Display primary product name or product number */}
        <Text className="text-base">
          {item.primaryName
            ? item.primaryName
            : `${t("productNumber")}: ${item.productNumber}`}
        </Text>

        {/* Display client inventory location */}
        <Text className="text-sm text-gray-500">
          <FontAwesome6 name="location-dot" color="gray" />{" "}
          {item.clientInventoryName ? item.clientInventoryName : t("noLocation")}
        </Text>
      </View>

      {/* Quantity and remove button */}
      <View className="flex-1 flex-row h-full justify-end items-center mr-2">
        <Text className='text-xl pr-5'>{item.quantity}</Text>
        <TouchableOpacity className="m-1" onPress={onRemove}>
          <FontAwesome6 name={item.quantity > 1 ? "circle-minus" : "circle-xmark"} solid color="#FF3B30" size={18} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProductListItemScan;
