import axios from "axios";

// Add to inventory mutation function
export const addProduct = async (body) => {
  const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/api/inventory/add`, body);
  return response.data;
};

// Remove from inventory mutation function
export const removeProduct = async (body) => {
  const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/api/inventory/remove`, body);
  return response.data;
};

