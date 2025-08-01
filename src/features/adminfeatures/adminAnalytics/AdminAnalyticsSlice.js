import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getProductsByCategory,
  getSalesByCategory,
  getOverviewStats,
  getRecentOrdersAnalytics,
  getMonthlySalesData,
  getTopSellingProducts,
} from "./AdminAnalyticsService.js";

const initialState = {
  // Products by category data
  productsByCategory: {
    data: [],
    totalProducts: 0,
  },

  // Sales by category data
  salesByCategory: {
    data: [],
    totalRevenue: 0,
  },

  // Overview statistics
  overviewStats: {
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    completedOrders: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
    averageOrderValue: 0,
  },

  // Recent orders
  recentOrders: [],

  // Monthly sales data
  monthlySales: [],

  // Top selling products
  topProducts: [],

  // Loading states
  productsCategoryLoading: false,
  salesCategoryLoading: false,
  overviewLoading: false,
  recentOrdersLoading: false,
  monthlySalesLoading: false,
  topProductsLoading: false,

  // UI states
  selectedTimeRange: "30days", // 7days, 30days, 90days

  // Error handling
  error: null,

  // General status
  status: "idle", // idle | loading | succeeded | failed
};

// Async Thunks

// Fetch products by category
export const fetchProductsByCategory = createAsyncThunk(
  "adminAnalytics/fetchProductsByCategory",
  async () => {
    const data = await getProductsByCategory();
    return data;
  }
);

// Fetch sales by category
export const fetchSalesByCategory = createAsyncThunk(
  "adminAnalytics/fetchSalesByCategory",
  async () => {
    const data = await getSalesByCategory();
    return data;
  }
);

// Fetch overview statistics
export const fetchOverviewStats = createAsyncThunk(
  "adminAnalytics/fetchOverviewStats",
  async () => {
    const stats = await getOverviewStats();
    return stats;
  }
);

// Fetch recent orders
export const fetchRecentOrders = createAsyncThunk(
  "adminAnalytics/fetchRecentOrders",
  async (limit = 10) => {
    const orders = await getRecentOrdersAnalytics(limit);
    return orders;
  }
);

// Fetch monthly sales data
export const fetchMonthlySales = createAsyncThunk(
  "adminAnalytics/fetchMonthlySales",
  async () => {
    const data = await getMonthlySalesData();
    return data;
  }
);

// Fetch top selling products
export const fetchTopProducts = createAsyncThunk(
  "adminAnalytics/fetchTopProducts",
  async (limit = 5) => {
    const products = await getTopSellingProducts(limit);
    return products;
  }
);

// Fetch all analytics data
export const fetchAllAnalyticsData = createAsyncThunk(
  "adminAnalytics/fetchAllAnalyticsData",
  async (_, { dispatch }) => {
    try {
      // Fetch all analytics data in parallel
      await Promise.all([
        dispatch(fetchProductsByCategory()),
        dispatch(fetchSalesByCategory()),
        dispatch(fetchOverviewStats()),
        dispatch(fetchRecentOrders()),
        dispatch(fetchMonthlySales()),
        dispatch(fetchTopProducts()),
      ]);
      return true;
    } catch (error) {
      throw error;
    }
  }
);

const adminAnalyticsSlice = createSlice({
  name: "adminAnalytics",
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Set time range
    setTimeRange: (state, action) => {
      state.selectedTimeRange = action.payload;
    },

    // Reset analytics state
    resetAnalyticsState: (state) => {
      return { ...initialState };
    },
  },

  extraReducers: (builder) => {
    builder
      // Fetch Products by Category
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.productsCategoryLoading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.productsCategoryLoading = false;
        state.productsByCategory = action.payload;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.productsCategoryLoading = false;
        state.error = action.error.message;
      })

      // Fetch Sales by Category
      .addCase(fetchSalesByCategory.pending, (state) => {
        state.salesCategoryLoading = true;
        state.error = null;
      })
      .addCase(fetchSalesByCategory.fulfilled, (state, action) => {
        state.salesCategoryLoading = false;
        state.salesByCategory = action.payload;
      })
      .addCase(fetchSalesByCategory.rejected, (state, action) => {
        state.salesCategoryLoading = false;
        state.error = action.error.message;
      })

      // Fetch Overview Stats
      .addCase(fetchOverviewStats.pending, (state) => {
        state.overviewLoading = true;
        state.error = null;
      })
      .addCase(fetchOverviewStats.fulfilled, (state, action) => {
        state.overviewLoading = false;
        state.overviewStats = action.payload;
      })
      .addCase(fetchOverviewStats.rejected, (state, action) => {
        state.overviewLoading = false;
        state.error = action.error.message;
      })

      // Fetch Recent Orders
      .addCase(fetchRecentOrders.pending, (state) => {
        state.recentOrdersLoading = true;
        state.error = null;
      })
      .addCase(fetchRecentOrders.fulfilled, (state, action) => {
        state.recentOrdersLoading = false;
        state.recentOrders = action.payload;
      })
      .addCase(fetchRecentOrders.rejected, (state, action) => {
        state.recentOrdersLoading = false;
        state.error = action.error.message;
      })

      // Fetch Monthly Sales
      .addCase(fetchMonthlySales.pending, (state) => {
        state.monthlySalesLoading = true;
        state.error = null;
      })
      .addCase(fetchMonthlySales.fulfilled, (state, action) => {
        state.monthlySalesLoading = false;
        state.monthlySales = action.payload;
      })
      .addCase(fetchMonthlySales.rejected, (state, action) => {
        state.monthlySalesLoading = false;
        state.error = action.error.message;
      })

      // Fetch Top Products
      .addCase(fetchTopProducts.pending, (state) => {
        state.topProductsLoading = true;
        state.error = null;
      })
      .addCase(fetchTopProducts.fulfilled, (state, action) => {
        state.topProductsLoading = false;
        state.topProducts = action.payload;
      })
      .addCase(fetchTopProducts.rejected, (state, action) => {
        state.topProductsLoading = false;
        state.error = action.error.message;
      })

      // Fetch All Analytics Data
      .addCase(fetchAllAnalyticsData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAllAnalyticsData.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(fetchAllAnalyticsData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

// Export actions
export const {
  clearError,
  setTimeRange,
  resetAnalyticsState,
} = adminAnalyticsSlice.actions;

// Export selectors
export const selectProductsByCategory = (state) => state.adminAnalytics.productsByCategory;
export const selectSalesByCategory = (state) => state.adminAnalytics.salesByCategory;
export const selectOverviewStats = (state) => state.adminAnalytics.overviewStats;
export const selectRecentOrders = (state) => state.adminAnalytics.recentOrders;
export const selectMonthlySales = (state) => state.adminAnalytics.monthlySales;
export const selectTopProducts = (state) => state.adminAnalytics.topProducts;
export const selectAnalyticsLoading = (state) => state.adminAnalytics.status === "loading";
export const selectAnalyticsError = (state) => state.adminAnalytics.error;
export const selectTimeRange = (state) => state.adminAnalytics.selectedTimeRange;

export default adminAnalyticsSlice.reducer;