import { Tabs } from "expo-router";
import { FontAwesome6 } from "@expo/vector-icons";
import MainButton from "../../components/MainButton";
import { useTranslation } from "react-i18next";

export default TabsLayout = () => {
  const {t} = useTranslation();
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#3b8ae6",
          headerShown: false,
          gestureEnabled: false,
          tabBarIconStyle: { marginBottom: -3 },
          tabBarLabelStyle: { marginBottom: -3, fontSize: 11 },
        }}
        initialRouteName="scan"
       
      >
        <Tabs.Screen
          name="inventory"
          options={{
            title: t('inventory'),
            tabBarIcon: ({ color }) => (
              <FontAwesome6 size={28} name="box" color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="scan"
          options={{
            title: t('scan'),
            tabBarIcon: ({ color }) => (
              <FontAwesome6 size={28} name="barcode" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: t('settings'),
            tabBarIcon: ({ color }) => (
              <FontAwesome6 size={28} name="gears" color={color} />
            ),
          }}
        />
      </Tabs>
      <MainButton />
    </>
  );
};
