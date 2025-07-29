import { databases, Query } from "../appwrite/appwriteClient";

/**
 * Fetch single product by your custom `id` (not Appwrite $id).
 * @param {number|string} id - The custom product ID (e.g., 2, 3, etc.)
 * @returns {Promise<object>} - The product document
 */
export const getSingleProduct = async (id) => {
  try {
    const response = await databases.listDocuments(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      import.meta.env.VITE_APPWRITE_PRODUCTS_COLLECTION_ID,
      [
        Query.equal("id", Number(id)),
        Query.limit(1), // Optional: Optimizes query
      ]
    );

    if (response.documents.length === 0) {
      throw new Error("Product not found");
    }

    return response.documents[0];
  } catch (error) {
    console.error("Error fetching product by custom id:", error);
    throw error;
  }
};






















// import { databases } from "../appwrite/appwriteClient";

// export const getSingleProduct = async (documentId) => {
//   try {
//     const product = await databases.getDocument(
//       import.meta.env.VITE_APPWRITE_DATABASE_ID,
//       import.meta.env.VITE_APPWRITE_COLLECTION_ID,
//       documentId
//     );

//     console.log(product);
//     return product;
//   } catch (error) {
//     console.error("Error fetching single product:", error);
//     throw error;
//   }
// };

// import axios from "axios";

// export const getSingleProduct = async (id) => {
//   try {
//     //  const res = await axios.get(`https://fakestoreapi.in/api/products/${id}`);
//     const res = await axios.get(`http://localhost:5000/products/${id}`);
//     const product = res.data; //.product
//     console.log(product);
//     return product;
//   } catch (error) {
//     console.log("error in fetching the singleProduct", error);
//   }
// };
