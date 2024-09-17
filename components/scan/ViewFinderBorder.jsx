import React from "react";
import { View } from "react-native";

const colourMap = {
  default: "transparent",
  red: "#dc3545",
  green: "#28a745",
  yellow: "#ffc107",
};

const ViewFinderBorder = ({
  windowX,
  windowY,
  windowWidth,
  windowHeight,
  colourStatus = "default", // Default to "default" if not provided
}) => {
  return (
    <View
      style={{
        position: 'absolute',
        left: windowX,
        top: windowY,
        width: windowWidth,
        height: windowHeight,
        borderRadius: 30,
        borderColor: colourMap[colourStatus],
        borderWidth: 2,
        shadowColor: colourMap[colourStatus], // Dynamic shadow color
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 5,
        opacity: 0.9,
        shadowOpacity: 1, // Adjusted to valid opacity (0 to 1)
        elevation: 10, // Android shadow
        zIndex: 100, // Ensure it's on top
      }}
    />
  );
};

export default ViewFinderBorder;
