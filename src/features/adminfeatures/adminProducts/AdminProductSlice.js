import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as productService from "./AdminproductService";

// Async thunks for product operations

// Fetch all products with pagination
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({ limit = 10, offset = 0 }, { rejectWithValue }) => {
    try {
      const response = await productService.getAllProducts(limit, offset);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch single product by ID
export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (productId, { rejectWithValue }) => {
    try {
      const product = await productService.getProductById(productId);
      return product;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create new product
export const createProduct = createAsyncThunk(
  "products/createProduct",
  async ({ productData, imageFile }, { rejectWithValue }) => {
    try {
      const newProduct = await productService.createProduct(
        productData,
        imageFile
      );
      return newProduct;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update existing product
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ productId, productData, imageFile }, { rejectWithValue }) => {
    try {
      const updatedProduct = await productService.updateProduct(
        productId,
        productData,
        imageFile
      );
      return updatedProduct;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete product
export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (productId, { rejectWithValue }) => {
    try {
      await productService.deleteProduct(productId);
      return productId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Search products
export const searchProducts = createAsyncThunk(
  "products/searchProducts",
  async (searchTerm, { rejectWithValue }) => {
    try {
      const response = await productService.searchProducts(searchTerm);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Filter products by category
export const filterProductsByCategory = createAsyncThunk(
  "products/filterProductsByCategory",
  async (category, { rejectWithValue }) => {
    try {
      const response = await productService.filterProductsByCategory(category);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Filter products by status
export const filterProductsByStatus = createAsyncThunk(
  "products/filterProductsByStatus",
  async (status, { rejectWithValue }) => {
    try {
      const response = await productService.filterProductsByStatus(status);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch products statistics
export const fetchProductsStats = createAsyncThunk(
  "products/fetchProductsStats",
  async (_, { rejectWithValue }) => {
    try {
      const stats = await productService.getProductsStats();
      return stats;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Export products data
export const exportProducts = createAsyncThunk(
  "products/exportProducts",
  async (_, { rejectWithValue }) => {
    try {
      const products = await productService.exportProductsData();
      return products;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  products: [],
  selectedProduct: null,
  searchResults: [],
  filteredProducts: [],
  stats: {
    totalProducts: 0,
    activeProducts: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0,
    popularProducts: 0,
    onSaleProducts: 0,
    totalValue: 0,
    averagePrice: 0,
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasMore: false,
  },
  filters: {
    category: "all",
    status: "all",
    searchTerm: "",
  },
  loading: {
    fetch: false,
    create: false,
    update: false,
    delete: false,
    search: false,
    filter: false,
    stats: false,
    export: false,
  },
  error: null,
};

// Product slice
const adminProductSlice = createSlice({
  name: "adminProducts",
  initialState,
  reducers: {
    // Reset error
    clearError: (state) => {
      state.error = null;
    },

    // Reset selected product
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },

    // Set current page
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },

    // Set items per page
    setItemsPerPage: (state, action) => {
      state.pagination.itemsPerPage = action.payload;
      state.pagination.currentPage = 1; // Reset to first page
    },

    // Set filters
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.currentPage = 1; // Reset to first page when filtering
    },

    // Clear filters
    clearFilters: (state) => {
      state.filters = {
        category: "all",
        status: "all",
        searchTerm: "",
      };
      state.pagination.currentPage = 1;
      state.searchResults = [];
      state.filteredProducts = [];
    },

    // Reset products state
    resetProductsState: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading.fetch = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.products = action.payload.products;
        state.pagination.totalItems = action.payload.total;
        state.pagination.hasMore = action.payload.hasMore;
        state.pagination.totalPages = Math.ceil(
          action.payload.total / state.pagination.itemsPerPage
        );
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error = action.payload;
      })

      // Fetch Product By ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading.fetch = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error = action.payload;
      })

      // Create Product
      .addCase(createProduct.pending, (state) => {
        state.loading.create = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading.create = false;
        state.products.unshift(action.payload);
        state.pagination.totalItems += 1;
        state.pagination.totalPages = Math.ceil(
          state.pagination.totalItems / state.pagination.itemsPerPage
        );
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading.create = false;
        state.error = action.payload;
      })

      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.loading.update = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading.update = false;
        const index = state.products.findIndex(
          (product) => product.id === action.payload.$id
        );
        if (index !== -1) {
          state.products[index] = {
            ...state.products[index],
            ...action.payload,
            id: action.payload.$id,
          };
        }
        if (
          state.selectedProduct &&
          state.selectedProduct.id === action.payload.$id
        ) {
          state.selectedProduct = {
            ...state.selectedProduct,
            ...action.payload,
            id: action.payload.$id,
          };
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading.update = false;
        state.error = action.payload;
      })

      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.loading.delete = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading.delete = false;
        state.products = state.products.filter(
          (product) => product.id !== action.payload
        );
        state.pagination.totalItems -= 1;
        state.pagination.totalPages = Math.ceil(
          state.pagination.totalItems / state.pagination.itemsPerPage
        );
        if (
          state.selectedProduct &&
          state.selectedProduct.id === action.payload
        ) {
          state.selectedProduct = null;
        }
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading.delete = false;
        state.error = action.payload;
      })

      // Search Products
      .addCase(searchProducts.pending, (state) => {
        state.loading.search = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading.search = false;
        state.searchResults = action.payload.products;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading.search = false;
        state.error = action.payload;
      })

      // Filter Products by Category
      .addCase(filterProductsByCategory.pending, (state) => {
        state.loading.filter = true;
        state.error = null;
      })
      .addCase(filterProductsByCategory.fulfilled, (state, action) => {
        state.loading.filter = false;
        state.filteredProducts = action.payload.products;
      })
      .addCase(filterProductsByCategory.rejected, (state, action) => {
        state.loading.filter = false;
        state.error = action.payload;
      })

      // Filter Products by Status
      .addCase(filterProductsByStatus.pending, (state) => {
        state.loading.filter = true;
        state.error = null;
      })
      .addCase(filterProductsByStatus.fulfilled, (state, action) => {
        state.loading.filter = false;
        state.filteredProducts = action.payload.products;
      })
      .addCase(filterProductsByStatus.rejected, (state, action) => {
        state.loading.filter = false;
        state.error = action.payload;
      })

      // Fetch Products Stats
      .addCase(fetchProductsStats.pending, (state) => {
        state.loading.stats = true;
        state.error = null;
      })
      .addCase(fetchProductsStats.fulfilled, (state, action) => {
        state.loading.stats = false;
        state.stats = action.payload;
      })
      .addCase(fetchProductsStats.rejected, (state, action) => {
        state.loading.stats = false;
        state.error = action.payload;
      })

      // Export Products
      .addCase(exportProducts.pending, (state) => {
        state.loading.export = true;
        state.error = null;
      })
      .addCase(exportProducts.fulfilled, (state) => {
        state.loading.export = false;
      })
      .addCase(exportProducts.rejected, (state, action) => {
        state.loading.export = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const {
  clearError,
  clearSelectedProduct,
  setCurrentPage,
  setItemsPerPage,
  setFilters,
  clearFilters,
  resetProductsState,
} = adminProductSlice.actions;

// Selectors
export const selectProducts = (state) => state.adminProducts.products;
export const selectSelectedProduct = (state) =>
  state.adminProducts.selectedProduct;
export const selectSearchResults = (state) => state.adminProducts.searchResults;
export const selectFilteredProducts = (state) =>
  state.adminProducts.filteredProducts;
export const selectProductsStats = (state) => state.adminProducts.stats;
export const selectPagination = (state) => state.adminProducts.pagination;
export const selectFilters = (state) => state.adminProducts.filters;
export const selectLoading = (state) => state.adminProducts.loading;
export const selectError = (state) => state.adminProducts.error;

// Export reducer
export default adminProductSlice.reducer;
