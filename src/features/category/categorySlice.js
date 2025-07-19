import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchDataByCategory } from "../../api/ProductCategory";

export const getCategoryData = createAsyncThunk(
  "category/getCategoryData",
  async (category) => {
    const data = await fetchDataByCategory(category);
    return data;
  }
);

const initialState = {
  categories: [],
  status: "idle",
  error: null,
};
export const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getCategoryData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getCategoryData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.categories = action.payload;
        console.log("Fetched categories data :", action.payload);
      })
      .addCase(getCategoryData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      }); 
  },
});

export default categorySlice.reducer;
