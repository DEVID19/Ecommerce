// import { createSlice } from "@reduxjs/toolkit";
// import { toast } from "react-toastify";

// const initialState = {
//   cartItems: [],
//   totalQuantity: 0,
//   totalPrice: 0,
// };

// const cartSlice = createSlice({
//   name: "cart",
//   initialState,
//   reducers: {
//     addToCart(state, action) {
//       const newItem = action.payload;
//       const exsistingItem = state.cartItems.find(
//         (item) => item.id === newItem.id
//       );
//       if (exsistingItem) {
//         exsistingItem.quantity += newItem.quantity;
//          toast.warning("Product is already in cart")
//       } else {
//         state.cartItems.push({ ...newItem, quantity: newItem.quantity });
//         toast.success("Product is added to cart")
//       }
//     },
//     removeFromCart(state, action) {
//       state.cartItems = state.cartItems.filter(
//         (item) => item.id !== action.payload.id
//       );
//       toast.error("Item removed from cart")
//     },
//     increaseQuantity(state, action) {
//       const cartItems = state.cartItems.find(
//         (item) => item.id === action.payload.id
//       );
//       if (cartItems) {
//         cartItems.quantity += 1;
//       }
//       toast.info("Item quantity increased")
//     },
//     decreaseQuantity(state, action) {
//       const cartItems = state.cartItems.find(
//         (item) => item.id === action.payload.id
//       );
//       if (cartItems.quantity > 1) {
//         cartItems.quantity -= 1;
//       } else {
//         state.cartItems = state.cartItems.filter(
//           (item) => item.id !== action.payload.id
//         );
//       }
//       toast.error("Item quantity decreased")
//     },

//     calculateTotal: (state) => {
//       state.totalQuantity = state.cartItems.reduce(
//         (total, items) => total + items.quantity,
//         0
//       );
//       state.totalPrice = state.cartItems.reduce(
//         (total, items) => total + items.price * items.quantity,
//         0
//       );
//     },
//   },
// });

// export const {
//   addToCart,
//   removeFromCart,
//   increaseQuantity,
//   decreaseQuantity,
//   calculateTotal,
// } = cartSlice.actions;
// export default cartSlice.reducer;

// cartSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addToCart, removeFromCart, updateQuantity } from "./cartService";

const initialState = {
  cartItems: [],
  totalQuantity: 0,
  totalPrice: 0,
  status: "idle",
};

export const addItemToCart = createAsyncThunk(
  "cart/addItemToCart",
  async ({ userId, product }) => {
    // const res = await addToCart(userId, product);
    const res = await addToCart({ userId, product });
    return res;
  }
  
);

export const removeItemFromCart = createAsyncThunk(
  "cart/removeItemFromCart",
  async (documentId) => {
    await removeFromCart(documentId);
    return documentId;
  }
);

export const updateItemQuantity = createAsyncThunk(
  "cart/updateItemQuantity",
  async ({ documentId, quantity, unitPrice }) => {
    const res = await updateQuantity(documentId, quantity, unitPrice);
    return res;
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartItems: (state, action) => {
      state.cartItems = action.payload;
    },
    calculateTotal: (state) => {
      state.totalQuantity = state.cartItems.reduce(
        (total, item) => total + item.quantity,
        0
      );
      state.totalPrice = state.cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.totalAmount = 0;
      state.totalQuantity = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addItemToCart.fulfilled, (state, action) => {
        const newItem = action.payload;
        const existingItemIndex = state.cartItems.findIndex(
          (item) => item.$id === newItem.$id
        );

        if (existingItemIndex !== -1) {
          // ✅ If item exists, update its quantity
          state.cartItems[existingItemIndex].quantity = newItem.quantity;
        } else {
          // 🆕 If not, add new item
          state.cartItems.push(newItem);
        }

        cartSlice.caseReducers.calculateTotal(state);
      })

      .addCase(removeItemFromCart.fulfilled, (state, action) => {
        state.cartItems = state.cartItems.filter(
          (item) => item.$id !== action.payload
        );
        cartSlice.caseReducers.calculateTotal(state);
      })
      .addCase(updateItemQuantity.fulfilled, (state, action) => {
        const updatedItem = action.payload;

        if (updatedItem.deleted) {
          // Remove item from state if deleted on server
          state.cartItems = state.cartItems.filter(
            (item) => item.$id !== updatedItem.$id
          );
        } else {
          const index = state.cartItems.findIndex(
            (item) => item.$id === updatedItem.$id
          );
          if (index !== -1) {
            state.cartItems[index].quantity = updatedItem.quantity;
            state.cartItems[index].total = updatedItem.total;
          }
        }
        cartSlice.caseReducers.calculateTotal(state);
      });
  },
});

export const { setCartItems, calculateTotal, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
