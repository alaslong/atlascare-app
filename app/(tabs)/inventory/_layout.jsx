import { Stack } from "expo-router";

const InventoryLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Show the header
      }}
      initialRouteName="inventoryTab"
    >
      {/* Inventory Screen with custom header */}
      <Stack.Screen
        name="inventoryTab"  // Refers to inventory/index.js
        options={{
          title: "Inventory",  // Set custom title for the Inventory screen
        }}
      />

      {/* Product Details Screen with custom header */}
      <Stack.Screen
        name="productDetails"  // Refers to inventory/productDetails.js
        options={{
          title: "Product Details",  // Set custom title for Product Details screen
        }}
      />
    </Stack>
  );
};

export default InventoryLayout;
