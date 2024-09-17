import { Tabs } from "expo-router";
import { FontAwesome6 } from "@expo/vector-icons";

export default TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "blue",
        headerShown: false,
        gestureEnabled: false,
        tabBarIconStyle: {marginBottom: -3},
        tabBarLabelStyle: {marginBottom: -3, fontSize: 11}
      }}
    >
      <Tabs.Screen
        name="inventory"
        options={{
          title: "Inventory",
          tabBarIcon: ({ color }) => (
            <FontAwesome6 size={28} name="boxes-stacked" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: "Scan",
          tabBarIcon: ({ color }) => (
            <FontAwesome6 size={28} name="barcode" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <FontAwesome6 size={28} name="gears" color={color} />
          ),
        }}
      />
    </Tabs>
  );
};
