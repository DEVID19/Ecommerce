import { Client, Databases, Query } from "appwrite";
import { toast } from "react-toastify";

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const databases = new Databases(client);
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const ORDERS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_ORDERS_COLLECTION_ID;
const PRODUCTS_COLLECTION_ID = import.meta.env
  .VITE_APPWRITE_PRODUCTS_COLLECTION_ID;

// Get dashboard statistics
export const getDashboardStats = async () => {
  try {
    // Get all orders for revenue calculation
    const ordersResponse = await databases.listDocuments(
      DATABASE_ID,
      ORDERS_COLLECTION_ID,
      [Query.limit(1000)] // Adjust limit as needed
    );

    // Get products count
    const productsResponse = await databases.listDocuments(
      DATABASE_ID,
      PRODUCTS_COLLECTION_ID,
      [Query.limit(1)]
    );

    const orders = ordersResponse.documents;
    const totalOrders = ordersResponse.total;
    const totalProducts = productsResponse.total;

    // Calculate total revenue from all orders
    const totalRevenue = orders.reduce(
      (sum, order) => sum + parseFloat(order.grandTotal || 0),
      0
    );

    // Calculate unique customers using phone numbers as unique identifier
    const uniqueCustomers = new Set();
    orders.forEach((order) => {
      if (order.customerPhone) {
        uniqueCustomers.add(order.customerPhone);
      }
    });
    const totalCustomers = uniqueCustomers.size;

    // Get previous period data for calculating changes (last 30 days)
    const currentDate = new Date();
    const lastMonth = new Date(
      currentDate.getTime() - 30 * 24 * 60 * 60 * 1000
    );

    const lastMonthOrdersResponse = await databases.listDocuments(
      DATABASE_ID,
      ORDERS_COLLECTION_ID,
      [
        Query.lessThan("$createdAt", currentDate.toISOString()),
        Query.greaterThan("$createdAt", lastMonth.toISOString()),
        Query.limit(1000),
      ]
    );

    const lastMonthOrders = lastMonthOrdersResponse.documents;
    const lastMonthRevenue = lastMonthOrders.reduce(
      (sum, order) => sum + parseFloat(order.grandTotal || 0),
      0
    );

    // Calculate unique customers from last month
    const lastMonthUniqueCustomers = new Set();
    lastMonthOrders.forEach((order) => {
      if (order.customerPhone) {
        lastMonthUniqueCustomers.add(order.customerPhone);
      }
    });

    // Calculate percentage changes
    const revenueChange =
      lastMonthRevenue > 0
        ? (
            ((totalRevenue - lastMonthRevenue) / lastMonthRevenue) *
            100
          ).toFixed(1)
        : totalRevenue > 0
        ? "100.0"
        : "0.0";

    const ordersChange =
      lastMonthOrdersResponse.total > 0
        ? (
            ((totalOrders - lastMonthOrdersResponse.total) /
              lastMonthOrdersResponse.total) *
            100
          ).toFixed(1)
        : totalOrders > 0
        ? "100.0"
        : "0.0";

    const customersChange =
      lastMonthUniqueCustomers.size > 0
        ? (
            ((totalCustomers - lastMonthUniqueCustomers.size) /
              lastMonthUniqueCustomers.size) *
            100
          ).toFixed(1)
        : totalCustomers > 0
        ? "100.0"
        : "0.0";

    return {
      totalRevenue,
      totalOrders,
      totalProducts,
      totalCustomers,
      revenueChange,
      ordersChange,
      productsChange: "15.3", // Static for now, can be calculated if you track historical product data
      customersChange,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    toast.error("Failed to fetch dashboard statistics");
    throw error;
  }
};

// Get recent orders
export const getRecentOrders = async (limit = 10) => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      ORDERS_COLLECTION_ID,
      [Query.orderDesc("$createdAt"), Query.limit(limit)]
    );

    // Transform the data to match your UI expectations
    const transformedOrders = response.documents.map((order) => {
      const orderItems = JSON.parse(order.orderItems || "[]");
      const firstProduct = orderItems[0];

      return {
        id: `#${order.$id.slice(-5).toUpperCase()}`, // Use last 5 characters of document ID
        customer: order.customerName || "Unknown Customer",
        product: firstProduct ? firstProduct.title : "Multiple Items",
        amount: `$${parseFloat(order.grandTotal || 0).toFixed(2)}`,
        status: order.orderStatus || "pending",
        orderId: order.$id,
        createdAt: order.$createdAt,
      };
    });

    return transformedOrders;
  } catch (error) {
    console.error("Error fetching recent orders:", error);
    toast.error("Failed to fetch recent orders");
    throw error;
  }
};

// Get all orders (for orders management page)
export const getAllOrders = async () => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      ORDERS_COLLECTION_ID,
      [
        Query.orderDesc("$createdAt"),
        Query.limit(100), // Adjust as needed
      ]
    );

    return response.documents.map((order) => {
      const orderItems = JSON.parse(order.orderItems || "[]");

      return {
        id: order.$id,
        orderId: `#${order.$id.slice(-5).toUpperCase()}`,
        customer: order.customerName || "Unknown Customer",
        customerEmail: order.customerEmail || "",
        customerPhone: order.customerPhone || "",
        items: orderItems,
        totalAmount: parseFloat(order.grandTotal || 0),
        status: order.orderStatus || "pending",
        paymentStatus: order.paymentStatus || "pending",
        createdAt: order.$createdAt,
        shippingAddress: {
          address: order.customerAddress || "",
          state: order.customerState || "",
          postcode: order.customerPostcode || "",
          country: order.customerCountry || "",
        },
      };
    });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    toast.error("Failed to fetch orders");
    throw error;
  }
};

// Update order status
export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const updated = await databases.updateDocument(
      DATABASE_ID,
      ORDERS_COLLECTION_ID,
      orderId,
      {
        orderStatus: newStatus,
      }
    );

    toast.success(`Order status updated to ${newStatus}`);
    return updated;
  } catch (error) {
    console.error("Error updating order status:", error);
    toast.error("Failed to update order status");
    throw error;
  }
};

//chnage kiya tha yee
// Update payment status
export const updatePaymentStatus = async (orderId, newPaymentStatus) => {
  try {
    const updated = await databases.updateDocument(
      DATABASE_ID,
      ORDERS_COLLECTION_ID,
      orderId,
      {
        paymentStatus: newPaymentStatus,
      }
    );

    toast.success(`Payment status updated to ${newPaymentStatus}`);
    return updated;
  } catch (error) {
    console.error("Error updating payment status:", error);
    toast.error("Failed to update payment status");
    throw error;
  }
};

// Get order by ID
export const getOrderById = async (orderId) => {
  try {
    const order = await databases.getDocument(
      DATABASE_ID,
      ORDERS_COLLECTION_ID,
      orderId
    );

    return order;
  } catch (error) {
    console.error("Error fetching order:", error);
    toast.error("Failed to fetch order details");
    throw error;
  }
};

// Delete order
export const deleteOrder = async (orderId) => {
  try {
    await databases.deleteDocument(DATABASE_ID, ORDERS_COLLECTION_ID, orderId);

    toast.success("Order deleted successfully");
    return orderId;
  } catch (error) {
    console.error("Error deleting order:", error);
    toast.error("Failed to delete order");
    throw error;
  }
};

// Get customer analytics (derived from orders)
export const getCustomerAnalytics = async () => {
  try {
    const allOrders = await getAllOrders();
    const customerData = {};

    // Group orders by customer phone (unique identifier)
    allOrders.forEach((order) => {
      const phone = order.customerPhone;
      if (!customerData[phone]) {
        customerData[phone] = {
          customerName: order.customer,
          customerPhone: order.customerPhone,
          customerEmail: order.customerEmail,
          customerAddress: order.shippingAddress.address,
          customerState: order.shippingAddress.state,
          customerCountry: order.shippingAddress.country,
          totalOrders: 0,
          totalSpent: 0,
          joinedDate: order.createdAt,
          status: "active",
        };
      }
      customerData[phone].totalOrders += 1;
      customerData[phone].totalSpent += order.totalAmount;

      // Keep the earliest join date
      if (order.createdAt < customerData[phone].joinedDate) {
        customerData[phone].joinedDate = order.createdAt;
      }
    });

    return Object.values(customerData);
  } catch (error) {
    console.error("Error getting customer analytics:", error);
    toast.error("Failed to fetch customer analytics");
    throw error;
  }
};

// Search orders
export const searchOrders = async (searchTerm) => {
  try {
    const allOrders = await getAllOrders();

    return allOrders.filter((order) => {
      const orderId = order.orderId.toLowerCase();
      const customerName = order.customer.toLowerCase();
      const search = searchTerm.toLowerCase();

      return orderId.includes(search) || customerName.includes(search);
    });
  } catch (error) {
    console.error("Error searching orders:", error);
    toast.error("Failed to search orders");
    throw error;
  }
};

// Get monthly revenue data
export const getMonthlyRevenue = async () => {
  try {
    const allOrders = await getAllOrders();
    const monthlyData = {};

    allOrders.forEach((order) => {
      const date = new Date(order.createdAt);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: monthKey,
          revenue: 0,
          orders: 0,
        };
      }

      monthlyData[monthKey].revenue += order.totalAmount;
      monthlyData[monthKey].orders += 1;
    });

    return Object.values(monthlyData).sort((a, b) =>
      a.month.localeCompare(b.month)
    );
  } catch (error) {
    console.error("Error getting monthly revenue:", error);
    toast.error("Failed to fetch monthly revenue data");
    throw error;
  }
};
