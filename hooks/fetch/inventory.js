// hooks/fetch/inventory.js
import axios from "axios";

// Fetch inventory for a specific client practice
export const fetchInventory = async (clientPracticeId) => {
  const response = await axios.get(
    `${process.env.EXPO_PUBLIC_API_URL}/api/inventory`,
    { params: { client_practice_id: clientPracticeId } }
  );
  return response.data.inventory; // Assuming the API returns { inventory: [...] }
};
