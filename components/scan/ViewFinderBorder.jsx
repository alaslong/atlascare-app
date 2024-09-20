import React from "react";
import { View } from "react-native";

const colourMap = {
  default: "transparent",
  red: "#dc3545",
  green: "#28a745",
  yellow: "#ffc107",
  blue: "#3b8ae6",
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
        left: windowX,
        top: windowY,
        width: windowWidth,
        height: windowHeight,
        borderColor: colourMap[colourStatus],
        shadowColor: colourMap[colourStatus],
        shadowRadius: 10,
        shadowOpacity: 1, // Adjusted to valid opacity (0 to 1)
        elevation: 10, // Android shadow
      }}
      className={`absolute rounded-[30] border-2 -z-10`}
    />
  );
};

export default ViewFinderBorder;
