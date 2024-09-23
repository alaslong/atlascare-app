import React from "react";
import { View, Text } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";

// Utility to calculate the expiry badge based on expiry date
const calculateExpiryDetails = (expiryDate) => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const timeDifference = expiry - today;
  const daysUntilExpiry = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)); // Convert milliseconds to days

  if (daysUntilExpiry < 0) {
    return { label: "Expired", text: "Expired stock", colour: "#e53e3e" }; // Already expired
  } else if (daysUntilExpiry <= 14) {
    return { label: "2 weeks", text: "Expiring in 2 weeks", colour: "orange" }; // Expiring within 2 weeks
  } else if (daysUntilExpiry <= 30) {
    return {
      label: "1 month",
      text: "Expiring in 1 month",
      colour: "#d69e2e",
    }; // Expiring within 1 month
  }

  return null; // No badge needed
};

export const ExpiryBadge = ({ expiryDate }) => {
  const expiryDetails = calculateExpiryDetails(expiryDate);

  if (!expiryDetails) {
    return null; // Don't render anything if no badge is needed
  }

  const { text, colour } = expiryDetails;

  return (
    <View className={`self-end flex-row items-center gap-1`}>
      <FontAwesome6 size={12} name="clock" solid color={colour} />
      <Text className={`text-sm`} style={{color: colour}}>
        {text}
      </Text>
    </View>
  );
};

// Utility to calculate stock level badge color
const calculateQuantityColour = (quantity, { criticalLevel, warningLevel }) => {
  if (quantity <= criticalLevel) return "#e53e3e";
  if (quantity <= warningLevel) return "#d69e2e";
  return "#38a169"; // Default to green for normal level
};

// Utility to determine stock level text based on the quantity
const getStockLevelText = (quantity, { criticalLevel, warningLevel }) => {
  if (quantity <= criticalLevel) return "Critical stock:";
  if (quantity <= warningLevel) return "Low stock:";
  return "Current stock:"; // Default to current for normal level
};

export const QuantityText = ({ quantity, item }) => {
  const quantityColour = calculateQuantityColour(quantity, item);
  const stockLevelText = getStockLevelText(quantity, item);

  return (
    <View className={`flex-row items-center gap-1 self-end`}>
    {quantityColour !== "#38a169" && <FontAwesome6 size={12} name="triangle-exclamation" solid color={quantityColour} />}
    <Text className={`text-sm`} style={{color: quantityColour}}>
      {stockLevelText} {quantity} / {item.normalLevel}
    </Text>
    </View>
  );
};
