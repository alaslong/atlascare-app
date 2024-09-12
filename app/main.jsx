import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { SafeAreaView, StatusBar } from "react-native";
import Inventory from "@/screens/inventory";
import Scan from "@/screens/scan";
import Settings from "@/screens/settings";
import { FontAwesome6 } from "@expo/vector-icons";

const Tab = createMaterialTopTabNavigator();

const Main = () => {
  return (
    <SafeAreaView edges={['top']} className="h-screen">
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <Tab.Navigator
        initialRouteName="scan"
        screenOptions={{
          swipeEnabled: true,
          animationEnabled: true,
          tabBarStyle: {
            backgroundColor: "transparent",
          },
          tabBarShowLabel: true, // Hide label

        }}
      >
        <Tab.Screen
          name="inventory"
          component={Inventory}
          options={{
            tabBarIcon: () => (
              <FontAwesome6 size={24} name="warehouse" regular color="gray" />
            ),
          }}
        />
        <Tab.Screen
          name="scan"
          component={Scan}
          options={{
            tabBarIcon: () => (
              <FontAwesome6 size={24} name="barcode" regular color="gray" />
            ),
          }}
        />
        <Tab.Screen
          name="settings"
          component={Settings}
          options={{
            tabBarIcon: () => (
              <FontAwesome6 size={24} name="gear" regular color="gray" />
            ),
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default Main;
