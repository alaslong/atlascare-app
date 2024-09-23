import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { TouchableOpacity, Text, FlatList } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { useNavigationState, useNavigation } from "@react-navigation/native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
  runOnJS,
  Easing,
} from "react-native-reanimated";
import { useData } from "@/contexts/Data";
import { useAuth } from "@/contexts/Auth";
import { useTranslation } from "react-i18next";

/**
 * Custom hook to retrieve the active route name from the navigation state.
 */
const useActiveRoute = () => {
  const navigationState = useNavigationState((state) => state);

  const getActiveRouteName = (state) => {
    if (!state || !state.routes.length) return null;
    let route = state.routes[state.index];
    while (route.state && route.state.index !== undefined) {
      route = route.state.routes[route.state.index];
    }
    return route.name;
  };

  return getActiveRouteName(navigationState);
};

/**
 * Helper function to get button configurations based on current state.
 */
const getButtonConfig = (
  scanMode,
  setScanMode,
  handleLogout,
  navigation,
  inventories,
  handleExpand,
  t
) => {
  const capitalizedScanMode =
    scanMode.charAt(0).toUpperCase() + scanMode.slice(1);

  return {
    inventory: {
      text: inventories.selected ? inventories.selected.name : 'allInventories',
      onPress: handleExpand,
      icon: "eye",
      color: "#3b8ae6",
    },
    inventoryTab: {
      text: inventories.selected ? inventories.selected.name : 'allInventories',
      onPress: handleExpand,
      icon: "eye",
      color: "#3b8ae6",
    },
    productDetails: {
      text: 'back',
      onPress: () => navigation.navigate("inventoryTab"),
      icon: "arrow-left",
      color: "#3b8ae6",
    },
    scan: {
      text: `Mode: ${capitalizedScanMode}`,
      onPress: () =>
        setScanMode(scanMode === "retrieve" ? "restock" : "retrieve"),
      icon: "arrows-rotate",
      color: "#3b8ae6",
    },
    settings: {
      text: "Logout",
      onPress: handleLogout,
      icon: "right-from-bracket",
      color: "#ef4444",
    },
  };
};

/**
 * Helper function to calculate animation duration based on delta.
 */
const calculateDuration = (delta, speed = 1, maxDuration = 200) => {
  const duration = Math.max(delta / speed, delta > 100 ? 100 : 50);
  return Math.min(duration, maxDuration);
};

const MainButton = () => {
  const { scanMode, setScanMode, products, inventories } = useData();
  const { logout } = useAuth();
  const activeRoute = useActiveRoute();
  const navigation = useNavigation();
  const { t } = useTranslation();

  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    navigation.replace("login");
  }, [logout]);

  const buttonConfig = useMemo(
    () =>
      getButtonConfig(
        scanMode,
        setScanMode,
        handleLogout,
        navigation,
        inventories,
        handleExpand,
        t
      ),
    [scanMode, setScanMode, logout, navigation, inventories, handleExpand]
  );

  const initialRoute = activeRoute || "scan";

  const [currentConfig, setCurrentConfig] = useState(
    buttonConfig[initialRoute] || buttonConfig.scan
  );

  const [previousColor, setPreviousColor] = useState(currentConfig.color);

  const [pendingUpdate, setPendingUpdate] = useState(null);

  // Shared animation values
  const animatedColorProgress = useSharedValue(1);
  const animatedWidth = useSharedValue(300);
  const textOpacity = useSharedValue(1);
  const buttonVisibility = useSharedValue(
    products.scanned.length === 0 ? 1 : 0
  );

  // Reference to store the last width
  const lastWidthRef = useRef(animatedWidth.value);

  // Animated styles
  const animatedViewStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      animatedColorProgress.value,
      [0, 1],
      [previousColor, currentConfig.color]
    ),
    width: animatedWidth.value,
    opacity: buttonVisibility.value,
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    width: "full",
  }));

  /**
   * Effect to handle changes in activeRoute or scanMode.
   */
  useEffect(() => {
    if (!activeRoute) return;

    const newConfig = buttonConfig[activeRoute] || buttonConfig.scan;

    if (
      newConfig.text !== currentConfig.text ||
      newConfig.color !== currentConfig.color
    ) {
      setPendingUpdate(newConfig);
    }
  }, [activeRoute, scanMode, buttonConfig, currentConfig]);

  /**
   * Effect to reset isExpanded when route changes.
   */
  useEffect(() => {
    if (activeRoute !== "inventory" && activeRoute !== "inventoryTab") {
      setIsExpanded(false);
    }
  }, [activeRoute]);

  /**
   * Effect to handle pending updates for button configuration.
   */
  useEffect(() => {
    if (!pendingUpdate) return;

    // Start fade-out animation
    textOpacity.value = withTiming(0, { duration: 100 }, (isFinished) => {
      if (isFinished) {
        runOnJS(updateButtonState)(pendingUpdate);
      }
    });
  }, [pendingUpdate]);

  /**
   * Function to update button state and trigger animations.
   */
  const updateButtonState = useCallback(
    (newConfig) => {
      setPreviousColor(currentConfig.color);
      setCurrentConfig(newConfig);

      // Reset last width to force recalculation
      lastWidthRef.current = 0;

      // Animate color transition
      animatedColorProgress.value = 0;
      animatedColorProgress.value = withTiming(1, {
        duration: 200,
        easing: Easing.inOut(Easing.ease),
      });

      // Start fade-in animation for text
      textOpacity.value = withTiming(1, { duration: 100 });

      // Reset pending update
      setPendingUpdate(null);
    },
    [
      currentConfig.color,
      currentConfig.text,
      animatedColorProgress,
      textOpacity,
    ]
  );

  /**
   * Handler to measure and animate button width based on text content size.
   */
  const handleTextLayout = useCallback(
    (event) => {
      const { width } = event.nativeEvent.layout;

      const padding = 65; // Padding on both sides

      const totalWidth = width + padding;

      const deltaWidth = Math.abs(totalWidth - lastWidthRef.current);
      const durationWidth = calculateDuration(deltaWidth);

      animatedWidth.value = withTiming(totalWidth, {
        duration: durationWidth,
        easing: Easing.inOut(Easing.ease),
      });

      lastWidthRef.current = totalWidth;
    },
    [animatedWidth]
  );

  /**
   * Effect to handle visibility based on products.scanned.length.
   */
  useEffect(() => {
    if (products.scanned.length > 0) {
      // Hide the button with animation
      buttonVisibility.value = withTiming(0, { duration: 200 });
    } else {
      // Show the button with animation
      setTimeout(
        () => (buttonVisibility.value = withTiming(1, { duration: 200 })),
        350
      );
    }
  }, [products.scanned.length, buttonVisibility]);

  /**
   * Handler for selecting an inventory.
   */
  const handleInventorySelect = useCallback(
    (input) => {
      if (input) {
        inventories.setSelected(input);
      } else {
        inventories.setSelected(null);
      }
      setIsExpanded(false);
    },
    [inventories]
  );

  /**
   * Animated styles for the inventory list.
   */
  const inventoryListStyle = useAnimatedStyle(() => ({
    height: withTiming(isExpanded ? (inventories.data.length + 1) * 50 : 0, {
      duration: 200,
    }),
    opacity: withTiming(isExpanded ? 1 : 0, { duration: 200 }),
  }));

  const { onPress, icon } = currentConfig;

  const InventoryButton = ({ item = null }) => {
    return (
      <TouchableOpacity
        onPress={() => handleInventorySelect(item)}
        className="flex-row justify-center items-center p-1 w-full bg-white rounded-xl"
      >
        <Animated.Text
          className="text-[#3b8ae6] text-lg font-semibold"
          style={animatedTextStyle}
          onLayout={handleTextLayout}
        >
          {item?.name || t("allInventories")}
        </Animated.Text>
      </TouchableOpacity>
    );
  };

  return (
    <Animated.View
      style={animatedViewStyle}
      className="absolute self-center bottom-24 mb-1 rounded-2xl flex-row justify-center items-center overflow-hidden"
    >
      {!isExpanded && (
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={1}
          className="flex-row justify-center items-center gap-2 py-1"
        >
          <Animated.Text
            style={animatedTextStyle}
            onLayout={handleTextLayout}
            className="text-white font-semibold text-lg"
          >
            {t(currentConfig.text)}

          </Animated.Text>
          <Animated.View style={animatedTextStyle}>
            <FontAwesome6 name={icon} size={16} color="white" />
          </Animated.View>
        </TouchableOpacity>
      )}

      {/* Always render the inventory list container */}
      <Animated.View style={[inventoryListStyle]} className="gap-1">
        {/* Optionally, you can conditionally render the FlatList or control its data */}
        {isExpanded && (
          <FlatList
            data={inventories.data || []}
            keyExtractor={(item) => item.id.toString()}
            ListHeaderComponent={InventoryButton}
            contentContainerStyle={{
              flex: 1,
              justifyContent: "space-evenly",
              gap: 1,
            }}
            renderItem={InventoryButton}
            ListEmptyComponent={
              <Text className="text-center text-gray-500">
                No inventories available
              </Text>
            }
          />
        )}
      </Animated.View>
    </Animated.View>
  );
};

export default MainButton;
