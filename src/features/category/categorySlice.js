import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchDataByCategory } from "../../api/productCategory";


export const getCategoryData = createAsyncThunk(
  "category/getCategoryData",
  async () => {
    const data = await fetchDataByCategory();
    // const data = await fetchProductData();
     const uniqueCategories = [
      "All",
      ...new Set(data.map(item => item.category)),
    ];
    console.log("Fetched categories by unique:", uniqueCategories);

    return uniqueCategories;
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
      })
      .addCase(getCategoryData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default categorySlice.reducer;
