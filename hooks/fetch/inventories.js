import axios from "axios";

export const fetchInventories = async (clientPracticeId) => {
    const response = await axios.get(
      `${process.env.EXPO_PUBLIC_API_URL}/api/inventories?clientPracticeId=${clientPracticeId}`
    );
    return response.data.inventories; 
  };