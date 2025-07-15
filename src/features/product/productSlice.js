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
  status: "idle",
  error: null,
};
export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getProductData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getProductData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload;
      })
      .addCase(getProductData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

// export const {products , error, status} = productSlice.actions;

export default productSlice.reducer;