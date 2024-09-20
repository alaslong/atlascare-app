import React from "react";
import { View, Text } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";

// Utility to calculate the expiry badge based on expiry date
const calculateExpiryColour = (expiryDate) => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const timeDifference = expiry - today;
  const daysUntilExpiry = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)); // Convert milliseconds to days

  if (daysUntilExpiry < 0) {
    return { label: "Expired", colour: "red" }; // Already expired
  } else if (daysUntilExpiry <= 14) {
    return { label: "2 weeks", colour: "orange" }; // Expiring within 2 weeks
  } else if (daysUntilExpiry <= 30) {
    return { label: "1 month", colour: "#f4b800" }; // Expiring within 1 month
  }

  return null; // No badge needed
};

export const ExpiryBadge = ({ expiryDate }) => {
  const { label, colour } = calculateExpiryColour(expiryDate) || {};

  if (!label) {
    return null; // Don't render anything if no badge is needed
  }

  return (
    <View className={`self-end p-1`}>
      <FontAwesome6 size={18} name="clock" solid color={colour} />
    </View>
  );
};

// Utility to calculate stock level badge color
const calculateQuantityColour = (
  quantity,
  { criticalLevel, warningLevel, normalLevel }
) => {
  if (quantity <= criticalLevel) return "text-red-600";
  if (quantity <= warningLevel) return "text-yellow-600";
  if (quantity <= normalLevel) return "text-green-600";
};

export const QuantityText = ({ quantity, item }) => {
  const quantityColour = calculateQuantityColour(quantity, item);

  return (
    <Text className={`text-sm mt-1`}>
      Quantity: <Text className={quantityColour}>{quantity}</Text> / {item.normalLevel}
    </Text>
  );
};
