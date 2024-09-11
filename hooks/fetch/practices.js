import axios from "axios";

export const fetchPractices = async (clientId) => {
    const response = await axios.get(
      `${process.env.EXPO_PUBLIC_API_URL}/api/practices?clientId=${clientId}`
    );
    return response.data.practices; // Assuming the response contains a "practices" field
  };