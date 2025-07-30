import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus,
  deleteOrder,
  searchOrders,
  filterOrdersByStatus,
  filterOrdersByPaymentStatus,
  getOrdersStats,
  exportOrdersData,
} from "./AdminOrderService.js";

const initialState = {
  // Orders data
  orders: [],
  selectedOrder: null,
  
  // Statistics
  stats: {
    totalOrders: 0,
    pendingOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
    paidOrders: 0,
    pendingPayments: 0,
    failedPayments: 0,
  },

  // Loading states
  ordersLoading: false,
  orderDetailsLoading: false,
  statsLoading: false,
  updateLoading: false,
  exportLoading: false,

  // UI states
  filters: {
    searchTerm: "",
    statusFilter: "all",
    paymentFilter: "all",
  },

  // Pagination
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20,
  },

  // Error handling
  error: null,
  
  // General status
  status: "idle", // idle | loading | succeeded | failed
};

// Async Thunks

// Fetch all orders
export const fetchAllOrders = createAsyncThunk(
  "adminOrders/fetchAllOrders",
  async ({ limit = 100, offset = 0 } = {}) => {
    const orders = await getAllOrders(limit, offset);
    return orders;
  }
);

// Fetch order by ID
export const fetchOrderById = createAsyncThunk(
  "adminOrders/fetchOrderById",
  async (orderId) => {
    const order = await getOrderById(orderId);
    return order;
  }
);

// Update order status
export const updateOrderStatusAsync = createAsyncThunk(
  "adminOrders/updateOrderStatus",
  async ({ orderId, newStatus }) => {
    const updatedOrder = await updateOrderStatus(orderId, newStatus);
    return { orderId, newStatus, updatedOrder };
  }
);

// Update payment status
export const updatePaymentStatusAsync = createAsyncThunk(
  "adminOrders/updatePaymentStatus",
  async ({ orderId, newPaymentStatus }) => {
    const updatedOrder = await updatePaymentStatus(orderId, newPaymentStatus);
    return { orderId, newPaymentStatus, updatedOrder };
  }
);

// Delete order
export const deleteOrderAsync = createAsyncThunk(
  "adminOrders/deleteOrder",
  async (orderId) => {
    await deleteOrder(orderId);
    return orderId;
  }
);

// Search orders
export const searchOrdersAsync = createAsyncThunk(
  "adminOrders/searchOrders",
  async (searchTerm) => {
    const results = await searchOrders(searchTerm);
    return results;
  }
);

// Filter orders by status
export const filterOrdersByStatusAsync = createAsyncThunk(
  "adminOrders/filterOrdersByStatus",
  async (status) => {
    const results = await filterOrdersByStatus(status);
    return results;
  }
);

// Filter orders by payment status
export const filterOrdersByPaymentStatusAsync = createAsyncThunk(
  "adminOrders/filterOrdersByPaymentStatus",
  async (paymentStatus) => {
    const results = await filterOrdersByPaymentStatus(paymentStatus);
    return results;
  }
);

// Fetch orders statistics
export const fetchOrdersStats = createAsyncThunk(
  "adminOrders/fetchOrdersStats",
  async () => {
    const stats = await getOrdersStats();
    return stats;
  }
);

// Export orders data
export const exportOrdersAsync = createAsyncThunk(
  "adminOrders/exportOrders",
  async () => {
    const data = await exportOrdersData();
    return data;
  }
);

const adminOrderSlice = createSlice({
  name: "adminOrders",
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Clear selected order
    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
    },

    // Set selected order
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload;
    },

    // Update filters
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    // Reset filters
    resetFilters: (state) => {
      state.filters = {
        searchTerm: "",
        statusFilter: "all",
        paymentFilter: "all",
      };
    },

    // Update pagination
    updatePagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },

    // Reset orders state
    resetOrdersState: (state) => {
      state.orders = [];
      state.selectedOrder = null;
      state.error = null;
      state.status = "idle";
    },
  },

  extraReducers: (builder) => {
    builder
      // Fetch All Orders
      .addCase(fetchAllOrders.pending, (state) => {
        state.ordersLoading = true;
        state.error = null;
        state.status = "loading";
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.ordersLoading = false;
        state.orders = action.payload;
        state.status = "succeeded";
        state.pagination.totalItems = action.payload.length;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.ordersLoading = false;
        state.error = action.error.message;
        state.status = "failed";
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

      // Update Order Status
      .addCase(updateOrderStatusAsync.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateOrderStatusAsync.fulfilled, (state, action) => {
        state.updateLoading = false;
        const { orderId, newStatus } = action.payload;

        // Update in orders array
        const orderIndex = state.orders.findIndex(
          (order) => order.id === orderId
        );
        if (orderIndex !== -1) {
          state.orders[orderIndex].status = newStatus;
        }

        // Update selected order if it's the same
        if (state.selectedOrder && state.selectedOrder.id === orderId) {
          state.selectedOrder.status = newStatus;
        }
      })
      .addCase(updateOrderStatusAsync.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.error.message;
      })

      // Update Payment Status
      .addCase(updatePaymentStatusAsync.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updatePaymentStatusAsync.fulfilled, (state, action) => {
        state.updateLoading = false;
        const { orderId, newPaymentStatus } = action.payload;

        // Update in orders array
        const orderIndex = state.orders.findIndex(
          (order) => order.id === orderId
        );
        if (orderIndex !== -1) {
          state.orders[orderIndex].paymentStatus = newPaymentStatus;
        }

        // Update selected order if it's the same
        if (state.selectedOrder && state.selectedOrder.id === orderId) {
          state.selectedOrder.paymentStatus = newPaymentStatus;
        }
      })
      .addCase(updatePaymentStatusAsync.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.error.message;
      })

      // Delete Order
      .addCase(deleteOrderAsync.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(deleteOrderAsync.fulfilled, (state, action) => {
        state.updateLoading = false;
        const deletedOrderId = action.payload;
        
        // Remove from orders array
        state.orders = state.orders.filter(
          (order) => order.id !== deletedOrderId
        );

        // Clear selected order if it's the deleted one
        if (state.selectedOrder && state.selectedOrder.id === deletedOrderId) {
          state.selectedOrder = null;
        }

        // Update pagination
        state.pagination.totalItems = state.orders.length;
      })
      .addCase(deleteOrderAsync.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.error.message;
      })

      // Search Orders
      .addCase(searchOrdersAsync.pending, (state) => {
        state.ordersLoading = true;
        state.error = null;
      })
      .addCase(searchOrdersAsync.fulfilled, (state, action) => {
        state.ordersLoading = false;
        state.orders = action.payload;
        state.status = "search_results";
      })
      .addCase(searchOrdersAsync.rejected, (state, action) => {
        state.ordersLoading = false;
        state.error = action.error.message;
      })

      // Filter Orders by Status
      .addCase(filterOrdersByStatusAsync.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.status = "filtered";
      })

      // Filter Orders by Payment Status
      .addCase(filterOrdersByPaymentStatusAsync.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.status = "filtered";
      })

      // Fetch Orders Statistics
      .addCase(fetchOrdersStats.pending, (state) => {
        state.statsLoading = true;
        state.error = null;
      })
      .addCase(fetchOrdersStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchOrdersStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.error = action.error.message;
      })

      // Export Orders
      .addCase(exportOrdersAsync.pending, (state) => {
        state.exportLoading = true;
        state.error = null;
      })
      .addCase(exportOrdersAsync.fulfilled, (state, action) => {
        state.exportLoading = false;
        // Handle export success (could trigger download)
      })
      .addCase(exportOrdersAsync.rejected, (state, action) => {
        state.exportLoading = false;
        state.error = action.error.message;
      });
  },
});

// Export actions
export const {
  clearError,
  clearSelectedOrder,
  setSelectedOrder,
  updateFilters,
  resetFilters,
  updatePagination,
  resetOrdersState,
} = adminOrderSlice.actions;

// Export selectors
export const selectOrders = (state) => state.adminOrders.orders;
export const selectSelectedOrder = (state) => state.adminOrders.selectedOrder;
export const selectOrdersLoading = (state) => state.adminOrders.ordersLoading;
export const selectOrdersError = (state) => state.adminOrders.error;
export const selectOrdersStats = (state) => state.adminOrders.stats;
export const selectFilters = (state) => state.adminOrders.filters;
export const selectPagination = (state) => state.adminOrders.pagination;

export default adminOrderSlice.reducer;