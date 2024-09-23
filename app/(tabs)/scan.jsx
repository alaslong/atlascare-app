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

// Camera Permission UI Component
const CameraPermissionPrompt = ({ requestPermission }) => (
  <View className="flex-1 justify-center items-center p-4">
    <Text className="text-center mb-4">
      Please grant access to the camera to proceed.
    </Text>
    <TouchableOpacity onPress={requestPermission}>
      <Text className="text-blue-500">Grant Camera Permission</Text>
    </TouchableOpacity>
  </View>
);

const Scan = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanState, setScanState] = useState({
    canScan: true,
    paused: false,
    lastScannedData: null,
    colourStatus: "default",
  });

  const [cameraMounted, setCameraMounted] = useState(false);

  const cameraRef = useRef(null);
  const { products } = useData();
  const { t } = useTranslation();

  const { width, height } = Dimensions.get("window");
  const windowSize = { width: 350, height: 350 };
  const windowPosition = {
    x: width / 2 - windowSize.width / 2,
    y: height / 20 - windowSize.height / 20,
  };

  // Set camera mounted state when screen is focused/unfocused
  useFocusEffect(() => {
    setCameraMounted(true);
    return () => setCameraMounted(false);
  });

  // Check if barcode is within the scanning window
  const barcodeWithin = (cornerPoints) => {
    if (!cornerPoints) return false;
    return cornerPoints.every(
      (point) =>
        point.x >= windowPosition.x &&
        point.x <= windowPosition.x + windowSize.width &&
        point.y >= windowPosition.y &&
        point.y <= windowPosition.y + windowSize.height
    );
  };

  // Handle barcode scanning logic
  const handleBarcodeScanned = useCallback(
    scanHandler({
      canScan: scanState.canScan,
      paused: scanState.paused,
      lastScannedData: scanState.lastScannedData,
      setCanScan: (value) => setScanState((prev) => ({ ...prev, canScan: value })),
      setPaused: (value) => setScanState((prev) => ({ ...prev, paused: value })),
      setLastScannedData: (value) => setScanState((prev) => ({ ...prev, lastScannedData: value })),
      barcodeWithin,
      setColourStatus: (value) => setScanState((prev) => ({ ...prev, colourStatus: value })),
    }),
    [scanState, barcodeWithin]
  );

  // Unpause scanning and reset the state
  const unpauseScanning = useCallback(() => {
    setScanState({
      paused: false,
      canScan: true,
      lastScannedData: null,
      colourStatus: "default",
    });
  }, []);

  // Return loading or camera permission screen if necessary
  if (!permission) return <LoadingScreen />;
  if (!permission.granted)
    return <CameraPermissionPrompt requestPermission={requestPermission} />;

  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1">
          {cameraMounted && (
            <CameraView
              style={{ flex: 1, zIndex: -30 }}
              facing="back"
              onBarcodeScanned={scanState.canScan && !scanState.paused ? handleBarcodeScanned : null}
              ref={cameraRef}
            />
          )}

          <ViewFinderBorder
            windowX={windowPosition.x}
            windowY={windowPosition.y}
            windowWidth={windowSize.width}
            windowHeight={windowSize.height}
            colourStatus={scanState.colourStatus}
          />

          <Overlay
            width={width}
            height={height}
            windowX={windowPosition.x}
            windowY={windowPosition.y}
            windowWidth={windowSize.width}
            windowHeight={windowSize.height}
            paused={scanState.paused}
            unpauseScanning={unpauseScanning}
          />

          <View className="absolute h-full w-full flex-col p-5">
            <View className="flex-1 justify-end items-center">
              <View className="h-1/2 pt-3 flex-col items-center gap-3">
                {!scanState.paused ? (
                  <Text className="text-xl text-gray-600">
                    {products.scanned.length === 0
                      ? t("Scan first product to start")
                      : t("Scan the next product")}
                  </Text>
                ) : (
                  <TouchableOpacity onPress={unpauseScanning}>
                    <Text className="text-xl text-gray-600">
                      {t("Tap to continue")}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>

          <ScannedProductsList out={false} unpauseScanning={unpauseScanning} />
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Scan;
