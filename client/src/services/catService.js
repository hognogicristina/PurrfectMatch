import axios from "axios";

const API_URL = "http://localhost:3000/cats";

const fetchCats = async (page) => {
  try {
    const response = await axios.get(`${API_URL}?page=${page}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch cats", error);
    throw error;
  }
};

export { fetchCats };
