import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllCustomers,
  getCustomerByUserId,
  searchCustomers,
  getCustomerStats,
  exportCustomersData,
} from "./AdminCustomerService.js";

const initialState = {
  // Customer data
  customers: [],
  selectedCustomer: null,

  // Statistics
  stats: {
    totalCustomers: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    topCustomers: [],
  },

  // Loading states
  customersLoading: false,
  customerDetailsLoading: false,
  statsLoading: false,
  exportLoading: false,

  // UI states
  filters: {
    searchTerm: "",
  },

  // Modal state
  isCustomerModalOpen: false,

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

// Fetch all customers
export const fetchAllCustomers = createAsyncThunk(
  "adminCustomers/fetchAllCustomers",
  async () => {
    const customers = await getAllCustomers();
    return customers;
  }
);

// Fetch customer by userId
export const fetchCustomerByUserId = createAsyncThunk(
  "adminCustomers/fetchCustomerByUserId",
  async (userId) => {
    const customer = await getCustomerByUserId(userId);
    return customer;
  }
);

// Search customers
export const searchCustomersAsync = createAsyncThunk(
  "adminCustomers/searchCustomers",
  async (searchTerm) => {
    const results = await searchCustomers(searchTerm);
    return results;
  }
);

// Fetch customer statistics
export const fetchCustomerStats = createAsyncThunk(
  "adminCustomers/fetchCustomerStats",
  async () => {
    const stats = await getCustomerStats();
    return stats;
  }
);

// Export customers data
export const exportCustomersAsync = createAsyncThunk(
  "adminCustomers/exportCustomers",
  async (_, thunkAPI) => {
    try {
      const customers = await exportCustomersData();
      // Here you would typically trigger a CSV download
      // For now, just return the data
      return customers;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const adminCustomerSlice = createSlice({
  name: "adminCustomers",
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Clear selected customer
    clearSelectedCustomer: (state) => {
      state.selectedCustomer = null;
    },

    // Set selected customer
    setSelectedCustomer: (state, action) => {
      state.selectedCustomer = action.payload;
    },

    // Update filters
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    // Reset filters
    resetFilters: (state) => {
      state.filters = {
        searchTerm: "",
      };
    },

    // Update pagination
    updatePagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },

    // Open customer modal
    openCustomerModal: (state, action) => {
      state.isCustomerModalOpen = true;
      if (action.payload) {
        state.selectedCustomer = action.payload;
      }
    },

    // Close customer modal
    closeCustomerModal: (state) => {
      state.isCustomerModalOpen = false;
      state.selectedCustomer = null;
    },

    // Reset customers state
    resetCustomersState: (state) => {
      state.customers = [];
      state.selectedCustomer = null;
      state.error = null;
      state.status = "idle";
      state.isCustomerModalOpen = false;
    },
  },

  extraReducers: (builder) => {
    builder
      // Fetch All Customers
      .addCase(fetchAllCustomers.pending, (state) => {
        state.customersLoading = true;
        state.error = null;
        state.status = "loading";
      })
      .addCase(fetchAllCustomers.fulfilled, (state, action) => {
        state.customersLoading = false;
        state.customers = action.payload;
        state.status = "succeeded";
        state.pagination.totalItems = action.payload.length;
      })
      .addCase(fetchAllCustomers.rejected, (state, action) => {
        state.customersLoading = false;
        state.error = action.error.message;
        state.status = "failed";
      })

      // Fetch Customer By UserId
      .addCase(fetchCustomerByUserId.pending, (state) => {
        state.customerDetailsLoading = true;
        state.error = null;
      })
      .addCase(fetchCustomerByUserId.fulfilled, (state, action) => {
        state.customerDetailsLoading = false;
        state.selectedCustomer = action.payload;
      })
      .addCase(fetchCustomerByUserId.rejected, (state, action) => {
        state.customerDetailsLoading = false;
        state.error = action.error.message;
      })

      // Search Customers
      .addCase(searchCustomersAsync.pending, (state) => {
        state.customersLoading = true;
        state.error = null;
      })
      .addCase(searchCustomersAsync.fulfilled, (state, action) => {
        state.customersLoading = false;
        state.customers = action.payload;
        state.status = "search_results";
      })
      .addCase(searchCustomersAsync.rejected, (state, action) => {
        state.customersLoading = false;
        state.error = action.error.message;
      })

      // Fetch Customer Statistics
      .addCase(fetchCustomerStats.pending, (state) => {
        state.statsLoading = true;
        state.error = null;
      })
      .addCase(fetchCustomerStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchCustomerStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.error = action.error.message;
      })

      // Export Customers
      .addCase(exportCustomersAsync.pending, (state) => {
        state.exportLoading = true;
        state.error = null;
      })
      .addCase(exportCustomersAsync.fulfilled, (state, action) => {
        state.exportLoading = false;
        // Handle export success
      })
      .addCase(exportCustomersAsync.rejected, (state, action) => {
        state.exportLoading = false;
        state.error = action.error.message;
      });
  },
});

// Export actions
export const {
  clearError,
  clearSelectedCustomer,
  setSelectedCustomer,
  updateFilters,
  resetFilters,
  updatePagination,
  openCustomerModal,
  closeCustomerModal,
  resetCustomersState,
} = adminCustomerSlice.actions;

// Export selectors
export const selectCustomers = (state) => state.adminCustomers.customers;
export const selectSelectedCustomer = (state) =>
  state.adminCustomers.selectedCustomer;
export const selectCustomersLoading = (state) =>
  state.adminCustomers.customersLoading;
export const selectCustomersError = (state) => state.adminCustomers.error;
export const selectCustomerStats = (state) => state.adminCustomers.stats;
export const selectFilters = (state) => state.adminCustomers.filters;
export const selectPagination = (state) => state.adminCustomers.pagination;
export const selectIsCustomerModalOpen = (state) =>
  state.adminCustomers.isCustomerModalOpen;

export default adminCustomerSlice.reducer;
