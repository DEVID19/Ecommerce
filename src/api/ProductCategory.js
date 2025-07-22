import { databases, Query } from "../appwrite/appwriteClient";

export const fetchDataByCategory = async (category) => {
  try {
    const response = await databases.listDocuments(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      import.meta.env.VITE_APPWRITE_COLLECTION_ID,
      [
        Query.equal("category", category),
        Query.limit(100), // Optional but recommended
        // Query.orderDesc("$createdAt") // Optional: latest products first
      ]
    );

    console.log("Fetched category data:", response.documents);
    return response.documents;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// import axios from "axios";

// export const fetchDataByCategory = async (category) => {
//   try {
//     const response = await axios.get(
//       // `https://fakestoreapi.in/api/products/category?type=${category}`
//       `http://localhost:5000/products?category=${category}`
//     );
//     const data = response.data; //.products
//     console.log("Fetched categories data :", data);
//     return data;
//   } catch (error) {
//     console.log("Error fetching categories:", error);
//     throw error;
//   }
// };
