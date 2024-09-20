import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import formatDate from "../../utils/dateFormatter";

const ScannedProductsItem = ({ item, onRemove }) => {
  const { t } = useTranslation();

  const date = formatDate(item.expiryDate);

  return (
    <View className="flex-row items-center justify-between">

      <View className="mx-2">
        {/* Display primary product name or product number */}
        <Text className="text-base">
          {item.primaryName
            ? item.primaryName
            : `${t("productNumber")}: ${item.productNumber}`}
        </Text>

        {/* Display client inventory location */}
        <Text className="text-sm text-gray-500">
          <FontAwesome6 name="location-dot" color="gray" />{" "}
          {item.clientInventoryName
            ? item.clientInventoryName
            : t("noLocation")}
        </Text>
        {/* Display expiry date and batch number */}
        <View className="flex-row justify-begin gap-3">
          <Text className="text-sm text-gray-500 items-center">
            <FontAwesome6 name="hourglass-end" color="gray" />{" "}
            {item.expiryDate ? date : "N/A"}
          </Text>
          <Text className="text-sm text-gray-500">
            <FontAwesome6 name="tag" color="gray" /> {item.batchNumber || "N/A"}
          </Text>
        </View>
      </View>

      {/* Quantity and remove button */}
      <View className="flex-row gap-3 m-3 items-center">
        <Text className="text-xl">{item.quantity}</Text>
        <TouchableOpacity onPress={onRemove}>
          <FontAwesome6
            name={item.quantity > 1 ? "circle-minus" : "circle-xmark"}
            solid
            color="#FF3B30"
            size={18}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ScannedProductsItem;
