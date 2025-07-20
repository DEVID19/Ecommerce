import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchProductData } from "../../api/ProductDataApi";

export const getProductData = createAsyncThunk(
  "product/getProductData",
  async () => {
    const data = await fetchProductData();
    return data; //products
  }
);

const initialState = {
  products: [],
  filteredProducts: [],
  categories: [],
  brands: [],
  status: "idle",
  error: null,
};
export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    filterProductData: (state, action) => {
      const { search, category, brand, priceRange } = action.payload;

      state.filteredProducts = state.products.filter(
        (item) =>
          item.title.toLowerCase().includes(search.toLowerCase()) &&
          (category.toLowerCase() === "all" ||
            item.category.toLowerCase() === category.toLowerCase()) &&
          (brand.toLowerCase() === "all" ||
            item.brand.toLowerCase() === brand.toLowerCase()) &&
          item.price >= priceRange[0] &&
          item.price <= priceRange[1]
      );
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getProductData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getProductData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload;
        state.filteredProducts = [...action.payload]; // Clone to avoid mutation issues
        // 🔥 Extract categories dynamically here
        const uniqueCategories = [
          "ALL",
          ...new Set(action.payload.map((item) => item.category)),
        ];
        state.categories = uniqueCategories;
        const uniqueBrands = [
          "ALL",
          ...new Set(action.payload.map((item) => item.brand)),
        ];
        state.brands = uniqueBrands;
      })
      .addCase(getProductData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { filterProductData } = productSlice.actions;

export default productSlice.reducer;
