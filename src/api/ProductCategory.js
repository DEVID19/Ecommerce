import axios from "axios";

export const fetchDataByCategory = async (category) => {
  try {
    const response = await axios.get(
      // `https://fakestoreapi.in/api/products/category?type=${category}`
      `http://localhost:5000/products?category=${category}`
    );
    const data = response.data; //.products
    console.log("Fetched categories data :", data);
    return data;
  } catch (error) {
    console.log("Error fetching categories:", error);
    throw error;
  }
};
