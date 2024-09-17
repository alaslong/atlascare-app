import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import LoadingScreen from "@/components/LoadingScreen";
import Overlay from "@/components/scan/Overlay";
import ViewFinderBorder from "@/components/scan/ViewFinderBorder";
import scanHandler from "../../utils/scanHandler";
import ScannedProductsList from "../../components/scan/ScannedProductsList";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useData } from "@/contexts/Data";

const Scan = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [canScan, setCanScan] = useState(true);
  const [paused, setPaused] = useState(false);
  const [lastScannedData, setLastScannedData] = useState(null);
  const [scannedProducts, setScannedProducts] = useState([]);
  const [colourStatus, setColourStatus] = useState("default");
  
  const cameraRef = useRef(null);
  const { scanMode } = useData();

  const { width, height } = Dimensions.get("window");

  const windowWidth = 350;
  const windowHeight = 350;
  const windowX = width / 2 - windowWidth / 2;
  const windowY = height / 20 - windowHeight / 20;

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
    scannedProducts,
    setScannedProducts,
    setColourStatus
  });

  const unpauseScanning = () => {
    setPaused(false);
    setCanScan(true);

setColourStatus('default')

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
    <GestureHandlerRootView className="bg-gray-50 flex-1">
      <SafeAreaView className="flex-1">
        <View className="flex-1">
          <CameraView
            style={{ flex: 1 }}
            facing="back"
            onBarcodeScanned={canScan && !paused ? handleBarcodeScanned : null}
            ref={cameraRef}
          />
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
              <View className="h-1/2 pt-3">
                {!paused ? (
                  <Text className="text-xl text-gray-600">{`Scan to ${scanMode}`}</Text>
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
            scannedProducts={scannedProducts}
            setScannedProducts={setScannedProducts}
            out={false}
          />
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Scan;
