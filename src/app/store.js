import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../features/product/productSlice";
import categoryReducer from "../features/category/categorySlice"; // Import the category reducer
import cartReducer from "../features/cart/cartSlice";
export default configureStore({
  reducer: {
    products: productReducer,
    category: categoryReducer, // Ensure you import and add the category reducer
    cart: cartReducer,
  },
});
