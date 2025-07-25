import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  cartItems: [],
  totalQuantity: 0,
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const newItem = action.payload;
      const exsistingItem = state.cartItems.find(
        (item) => item.id === newItem.id
      );
      if (exsistingItem) {
        exsistingItem.quantity += newItem.quantity;
         toast.warning("Product is already in cart")
      } else {
        state.cartItems.push({ ...newItem, quantity: newItem.quantity });
        toast.success("Product is added to cart")
      }
    },
    removeFromCart(state, action) {
      state.cartItems = state.cartItems.filter(
        (item) => item.id !== action.payload.id
      );
      toast.error("Item removed from cart")
    },
    increaseQuantity(state, action) {
      const cartItems = state.cartItems.find(
        (item) => item.id === action.payload.id
      );
      if (cartItems) {
        cartItems.quantity += 1;
      }
      toast.info("Item quantity increased")
    },
    decreaseQuantity(state, action) {
      const cartItems = state.cartItems.find(
        (item) => item.id === action.payload.id
      );
      if (cartItems.quantity > 1) {
        cartItems.quantity -= 1;
      } else {
        state.cartItems = state.cartItems.filter(
          (item) => item.id !== action.payload.id
        );
      }
      toast.error("Item quantity decreased")
    },

    calculateTotal: (state) => {
      state.totalQuantity = state.cartItems.reduce(
        (total, items) => total + items.quantity,
        0
      );
      state.totalPrice = state.cartItems.reduce(
        (total, items) => total + items.price * items.quantity,
        0
      );
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  calculateTotal,
} = cartSlice.actions;
export default cartSlice.reducer;
























