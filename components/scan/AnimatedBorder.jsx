import React from 'react';
import { Animated } from 'react-native';

const AnimatedBorder = ({ windowX, windowY, windowWidth, windowHeight, interpolatedBorderColor }) => {
  return (
    <Animated.View
      className="absolute rounded-[30px] border-4"
      style={{
        left: windowX,
        top: windowY,
        width: windowWidth,
        height: windowHeight,
        borderColor: interpolatedBorderColor, // Animated border color
      }}
    />
  );
};

export default AnimatedBorder;
