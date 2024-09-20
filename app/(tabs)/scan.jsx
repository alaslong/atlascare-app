import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

import { useFocusEffect } from "expo-router";
import LoadingScreen from "@/components/LoadingScreen";
import Overlay from "@/components/scan/Overlay";
import ViewFinderBorder from "@/components/scan/ViewFinderBorder";
import scanHandler from "../../utils/scanHandler";
import ScannedProductsList from "../../components/scan/ScannedProductsList";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useData } from "@/contexts/Data";
import { useTranslation } from "react-i18next";

const Scan = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [canScan, setCanScan] = useState(true);

  const [cameraMounted, setCameraMounted] = useState(false);
  
  const [paused, setPaused] = useState(false);
  const [lastScannedData, setLastScannedData] = useState(null);
  
  const [colourStatus, setColourStatus] = useState("default");

  const cameraRef = useRef(null);

  const { products } = useData();


  const { t } = useTranslation();

  const { width, height } = Dimensions.get("window");

  const windowWidth = 350;
  const windowHeight = 350;
  const windowX = width / 2 - windowWidth / 2;
  const windowY = height / 20 - windowHeight / 20;

  useFocusEffect(() => {
  setCameraMounted(true);
    return () => {
      setCameraMounted(false);
    };
  })


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
    setCanScan,
    setPaused,
    setLastScannedData,
    barcodeWithin,
    setColourStatus,
  });

  const unpauseScanning = () => {
    setPaused(false);
    setCanScan(true);

    setColourStatus("default");

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

  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1">
          {cameraMounted &&
            <CameraView
              style={{ flex: 1, zIndex: -30 }}
              facing="back"
              onBarcodeScanned={
                canScan && !paused ? handleBarcodeScanned : null
              }
              ref={cameraRef}
            />}
          

          {/* Pass the unified animated style */}
          <ViewFinderBorder
            windowX={windowX}
            windowY={windowY}
            windowWidth={windowWidth}
            windowHeight={windowHeight}
            colourStatus={colourStatus}
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

          <View className="absolute h-full w-full flex-col p-5">
            <View className="flex-1 justify-end items-center">
              <View className="h-1/2 pt-3 flex-col items-center gap-3">
                {!paused ? (
                  <Text className="text-xl text-gray-600">
                    {products.scanned.length === 0
                      ? `Scan first product to start`
                      : "Scan the next product"}
                  </Text>
                ) : (
                  <TouchableOpacity onPress={unpauseScanning}>
                    <Text className="text-xl text-gray-600">
                      Tap to continue
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>

          {/* Modal for scanned products */}
          <ScannedProductsList
            out={false}
            unpauseScanning={unpauseScanning}
          />
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Scan;
