import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Button,
  Animated,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import LoadingScreen from "@/components/LoadingScreen";
import Overlay from "@/components/scan/Overlay";
import AnimatedBorder from "@/components/scan/AnimatedBorder";
import scanHandler from "@/utils/scanHandler"; // Import the refactored function

const Scan = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [canScan, setCanScan] = useState(true);
  const [paused, setPaused] = useState(false);
  const [lastScannedData, setLastScannedData] = useState(null);
  const cameraRef = useRef(null);

  const borderColor = useRef(new Animated.Value(0)).current;
  const { width, height } = Dimensions.get("window");

  const windowWidth = 350;
  const windowHeight = 350;
  const windowX = width / 2 - windowWidth / 2;
  const windowY = height / 9 - windowHeight / 9;

  const barcodeWithin = (cornerPoints) => {
    if (!cornerPoints) return false;
    return cornerPoints.every(
      (point) =>
        point.x >= windowX &&
        point.x <= windowX + windowWidth &&
        point.y >= windowY &&
        point.y <= windowY + windowHeight
    );
  };

  const handleBarcodeScanned = scanHandler({
    canScan,
    paused,
    lastScannedData,
    borderColor,
    setCanScan,
    setPaused,
    setLastScannedData,
    barcodeWithin,
    addOrRemove: "add",
  });

  const unpauseScanning = () => {
    setPaused(false);
    setCanScan(true);

    Animated.timing(borderColor, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start();

    setTimeout(() => setLastScannedData(null), 1000);
  };

  if (!permission) return <LoadingScreen />;
  if (!permission.granted)
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-center mb-4">
          Please grant access to the camera to proceed.
        </Text>
        <TouchableOpacity onPress={requestPermission}>
          <Text className="text-blue-500">Grant Camera Permission</Text>
        </TouchableOpacity>
      </View>
    );

  const interpolatedBorderColor = borderColor.interpolate({
    inputRange: [0, 1],
    outputRange: ["#FFFFFF", "#90EE90"],
  });

  return (
    <View className="flex-1">
      <CameraView
        style={{ flex: 1 }}
        facing="back"
        onBarcodeScanned={canScan && !paused ? handleBarcodeScanned : null}
        ref={cameraRef}
      />
      <AnimatedBorder
        windowX={windowX}
        windowY={windowY}
        windowWidth={windowWidth}
        windowHeight={windowHeight}
        interpolatedBorderColor={interpolatedBorderColor}
      />

      <Overlay
        width={width}
        height={height}
        windowX={windowX}
        windowY={windowY}
        windowWidth={windowWidth}
        windowHeight={windowHeight}
        paused={paused}
        unpauseScanning={unpauseScanning}
      />

      <View className="absolute h-full w-full flex-col justify-between items-center p-5 pb-14">
        <View className="flex-row h-1/2 w-full justify-between">
          
        </View>
        <View className="flex-1 justify-between items-center mt-11">
          {!paused ? (
            <Text className="text-xl text-gray-600">Scan to retrieve</Text>
          ) : (
            <TouchableOpacity onPress={unpauseScanning}>
              <Text className="text-xl text-gray-600">Tap to continue</Text>
            </TouchableOpacity>
          )}
          <Button
            title="Button"
            color="red"
            onPress={() => console.log("pressed")}
          />
        </View>
      </View>
    </View>
  );
};

export default Scan;
