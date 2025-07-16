import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchProductData } from "../../api/ProductDataApi";

export const getProductData = createAsyncThunk(
  "product/getProductData",
  async () => {
    const data = await fetchProductData();
    return data;
  }
);

const initialState = {
  products: [],
  filteredProducts: [],
  status: "idle",
  error: null,
};
export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    filterByCategory: (state, action) => {
      const category = action.payload;
      if (category === "all") {
        state.filteredProducts = state.products;
      } else {
        state.filteredProducts = state.products.filter(
          (item) => item.category.toLowerCase() === category.toLowerCase()
        );
      }
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getProductData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getProductData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.filteredProducts = action.payload;
        state.products = action.payload.products;
      })
      .addCase(getProductData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { filterByCategory } = productSlice.actions;

export default productSlice.reducer;
