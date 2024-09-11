import React from "react";
import Svg, { Rect, Defs, Mask } from "react-native-svg";
import { View } from "react-native";

const Overlay = ({
  width,
  height,
  windowX,
  windowY,
  windowWidth,
  windowHeight,
  paused
}) => {
  return (
    <View className="absolute inset-0">
      <Svg height={height} width={width}>
        <Defs>
          <Mask id="mask" x="0" y="0" width={width} height={height}>
            {/* Mask: White makes the area visible, black creates transparency */}
            <Rect x="0" y="0" width={width} height={height} fill="white" />
            <Rect
              x={windowX}
              y={windowY}
              width={windowWidth}
              height={windowHeight}
              rx="30"
              ry="30"
            />
          </Mask>
        </Defs>

        {/* Use the mask to create a transparent cutout */}
        <Rect
          x="0"
          y="0"
          width={width}
          height={height}
          fill="rgba(255, 255, 255, 0.95)" // Background overlay color
          mask="url(#mask)"
        />
      </Svg>

      {/* Darken the cutout when paused by adding an extra overlay */}
      {paused && (
        <View
          className="absolute bg-black/35 rounded-[30px]"
          style={{
            left: windowX,
            top: windowY,
            width: windowWidth,
            height: windowHeight,
          }}
        />
      )}

    </View>
  );
};

export default Overlay;
