import axios from "axios";

export const getSingleProduct = async (id) => {
  try {
    const res = await axios.get(`https://fakestoreapi.in/api/products/${id}`);
    const product = res.data.product;
    console.log(product);
    return product;
  } catch (error) {
    console.log("error in fetching the singleProduct", error);
  }
};
