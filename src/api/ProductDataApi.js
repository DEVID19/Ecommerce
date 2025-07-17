import axios from "axios";

export const fetchProductData = async () => {
  try {
    const response = await axios.get(
      "https://fakestoreapi.in/api/products?limit=150"
    );
    const data = response.data;
    console.log("Fetched data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

// import axios from "axios";

// export const fetchProductData = async () => {
//   try {
//     const categories = [
//       "smartphones",
//       "laptops",
//       "mens-watches",
//       "womens-watches",
//     ];

//     // Create API requests for all categories
//     const requests = categories.map((category) =>
//       axios.get(`https://dummyjson.com/products/category/${category}`)
//     );

//     // Fetch all in parallel
//     const responses = await Promise.all(requests);

//     // Merge all product arrays together
//     const combinedProducts = responses.flatMap((res) => res.data.products);

//     console.log("Fetched data:", combinedProducts);
//     return combinedProducts;
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     throw error;
//   }
// };



// import axios from "axios";

// export const fetchProductData = async () => {
//   try {
//     const response = await axios.get(
//       "https://dummyjson.com/products?limit=100"
//     );
//     const data = response.data;
//     console.log("Fetched data:", data);
//     return data;
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     throw error;
//   }
// }