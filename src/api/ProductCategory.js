import axios, { Axios } from "axios";

export const fetchDataByCategory = async () => {
  try {
    const response = await axios.get("https://dummyjson.com/products/categories")
    // const response = await axios.get(
    //   "https://fakestoreapi.in/api/products?limit=150"
    // );
    const data = response.data;
    console.log("Fetched categories:", data);
    return data;
  } catch (error) {
    console.log("Error fetching categories:", error);
    throw error;
  }
};
