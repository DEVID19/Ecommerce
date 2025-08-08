import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getRecentOrders,
  getAllOrders,
  updateOrderStatus,
  getOrderById,
  deleteOrder,
  getCustomerAnalytics,
  searchOrders,
  getMonthlyRevenue,
  getDashboardStats,
} from "./AdminDashboardService.js";

const initialState = {
  // Dashboard Statistics
  stats: {
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    revenueChange: "0",
    ordersChange: "0",
    productsChange: "0",
    customersChange: "0",
  },

  // Recent Orders for Dashboard
  recentOrders: [],

  // All Orders for Orders Management
  allOrders: [],

  // Customer Analytics (derived from orders)
  customerAnalytics: [],

  // Monthly Revenue Data
  monthlyRevenue: [],

  // Single Order Details
  selectedOrder: null,

  // Loading States
  statsLoading: false,
  recentOrdersLoading: false,
  allOrdersLoading: false,
  orderDetailsLoading: false,
  customerAnalyticsLoading: false,
  monthlyRevenueLoading: false,

  // Error States
  error: null,

  // General Status
  status: "idle",
};

// Async Thunks
export const fetchDashboardStats = createAsyncThunk(
  "adminDashboard/fetchDashboardStats",
  async () => {
    const stats = await getDashboardStats();
    return stats;
  }
);

export const fetchRecentOrders = createAsyncThunk(
  "adminDashboard/fetchRecentOrders",
  async (limit = 10) => {
    const orders = await getRecentOrders(limit);
    return orders;
  }
);

export const fetchAllOrders = createAsyncThunk(
  "adminDashboard/fetchAllOrders",
  async () => {
    const orders = await getAllOrders();
    return orders;
  }
);

export const updateOrderStatusAsync = createAsyncThunk(
  "adminDashboard/updateOrderStatus",
  async ({ orderId, newStatus }) => {
    const updatedOrder = await updateOrderStatus(orderId, newStatus);
    return { orderId, newStatus, updatedOrder };
  }
);

export const fetchOrderById = createAsyncThunk(
  "adminDashboard/fetchOrderById",
  async (orderId) => {
    const order = await getOrderById(orderId);
    return order;
  }
);

export const deleteOrderAsync = createAsyncThunk(
  "adminDashboard/deleteOrder",
  async (orderId) => {
    await deleteOrder(orderId);
    return orderId;
  }
);

export const fetchCustomerAnalytics = createAsyncThunk(
  "adminDashboard/fetchCustomerAnalytics",
  async () => {
    const analytics = await getCustomerAnalytics();
    return analytics;
  }
);

export const searchOrdersAsync = createAsyncThunk(
  "adminDashboard/searchOrders",
  async (searchTerm) => {
    const results = await searchOrders(searchTerm);
    return results;
  }
);

export const fetchMonthlyRevenue = createAsyncThunk(
  "adminDashboard/fetchMonthlyRevenue",
  async () => {
    const data = await getMonthlyRevenue();
    return data;
  }
);

const adminDashboardSlice = createSlice({
  name: "adminDashboard",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
    },
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload;
    },
    resetSearchResults: (state) => {
      // Reset to show all orders when search is cleared
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Dashboard Stats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.statsLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.error = action.error.message;
        state.status = "failed";
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

      // Fetch All Orders
      .addCase(fetchAllOrders.pending, (state) => {
        state.allOrdersLoading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.allOrdersLoading = false;
        state.allOrders = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.allOrdersLoading = false;
        state.error = action.error.message;
      })

      // Update Order Status
      .addCase(updateOrderStatusAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateOrderStatusAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { orderId, newStatus } = action.payload;

        // Update in recent orders
        const recentOrderIndex = state.recentOrders.findIndex(
          (order) => order.orderId === orderId
        );
        if (recentOrderIndex !== -1) {
          state.recentOrders[recentOrderIndex].status = newStatus;
        }

        // Update in all orders
        const allOrderIndex = state.allOrders.findIndex(
          (order) => order.id === orderId
        );
        if (allOrderIndex !== -1) {
          state.allOrders[allOrderIndex].status = newStatus;
        }
      })
      .addCase(updateOrderStatusAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Fetch Order By ID
      .addCase(fetchOrderById.pending, (state) => {
        state.orderDetailsLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.orderDetailsLoading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.orderDetailsLoading = false;
        state.error = action.error.message;
      })

      // Delete Order
      .addCase(deleteOrderAsync.fulfilled, (state, action) => {
        const deletedOrderId = action.payload;
        state.allOrders = state.allOrders.filter(
          (order) => order.id !== deletedOrderId
        );
        state.recentOrders = state.recentOrders.filter(
          (order) => order.orderId !== deletedOrderId
        );
      })

      // Fetch Customer Analytics
      .addCase(fetchCustomerAnalytics.pending, (state) => {
        state.customerAnalyticsLoading = true;
        state.error = null;
      })
      .addCase(fetchCustomerAnalytics.fulfilled, (state, action) => {
        state.customerAnalyticsLoading = false;
        state.customerAnalytics = action.payload;
      })
      .addCase(fetchCustomerAnalytics.rejected, (state, action) => {
        state.customerAnalyticsLoading = false;
        state.error = action.error.message;
      })

      // Search Orders
      .addCase(searchOrdersAsync.fulfilled, (state, action) => {
        state.allOrders = action.payload;
        state.status = "search_results";
      })

      // Fetch Monthly Revenue
      .addCase(fetchMonthlyRevenue.pending, (state) => {
        state.monthlyRevenueLoading = true;
        state.error = null;
      })
      .addCase(fetchMonthlyRevenue.fulfilled, (state, action) => {
        state.monthlyRevenueLoading = false;
        state.monthlyRevenue = action.payload;
      })
      .addCase(fetchMonthlyRevenue.rejected, (state, action) => {
        state.monthlyRevenueLoading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  clearError,
  clearSelectedOrder,
  setSelectedOrder,
  resetSearchResults,
} = adminDashboardSlice.actions;

export default adminDashboardSlice.reducer;
