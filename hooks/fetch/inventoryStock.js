// hooks/fetch/inventory.js
import axios from "axios";

// Fetch inventory for a specific client practice
export const fetchInventoryStock = async (clientPracticeId) => {
  const response = await axios.get(
    `${process.env.EXPO_PUBLIC_API_URL}/api/inventory`,
    { params: { client_practice_id: clientPracticeId } }
  );
  return response.data.inventory; // Assuming the API returns { inventory: [...] }
};


// Fetch product function using axios
export const fetchInventoryProduct = async ({ clientPracticeId, productNumber, batchNumber }) => {
  const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/api/inventory/product`, {
    params: { clientPracticeId, productNumber, batchNumber },
  });
  return response.data.stock;  // Assuming the API returns { stock: {...} }
};
