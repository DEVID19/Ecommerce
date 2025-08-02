// import { Client, Databases, ID, Query } from "appwrite";

// // Initialize Appwrite client
// const client = new Client();
// client
//   .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
//   .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

// const databases = new Databases(client);

// // Database and Collection IDs
// const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
// const ORDERS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_ORDERS_COLLECTION_ID;

// /**
//  * Save order to Appwrite database
//  * @param {Object} orderData - Order data to be saved
//  * @returns {Promise} - Promise that resolves to the created document
//  */
// export const saveOrderToAppwrite = async (orderData) => {
//   try {
//     const response = await databases.createDocument(
//       DATABASE_ID,
//       ORDERS_COLLECTION_ID,
//       ID.unique(),
//       {
//         // ✅ Add this line
//         userId: orderData.userId,

//         // Customer Information
//         customerName: orderData.customerInfo.fullName,
//         customerEmail: orderData.customerInfo.email,
//         customerPhone: orderData.customerInfo.phoneNumber,
//         customerAddress: orderData.customerInfo.address,
//         customerState: orderData.customerInfo.state,
//         customerPostcode: orderData.customerInfo.postcode,
//         customerCountry: orderData.customerInfo.country,

//         // Order Items (stored as JSON string)
//         orderItems: JSON.stringify(orderData.items),

//         // Order Summary
//         itemsTotal: orderData.orderSummary.itemsTotal,
//         deliveryCharge: orderData.orderSummary.deliveryCharge,
//         handlingCharge: orderData.orderSummary.handlingCharge,
//         grandTotal: orderData.orderSummary.grandTotal,

//         // Payment and Status (always completed)
//         paymentMethod: orderData.paymentMethod,
//         paymentStatus: orderData.paymentStatus,
//         orderStatus: orderData.orderStatus,
//         orderDate: orderData.orderDate,

//         // Additional fields for admin analytics
//         totalItems: orderData.items.length,
//         orderValue: orderData.orderSummary.grandTotal,
//       }
//     );

//     console.log("Order saved successfully:", response);
//     return response;
//   } catch (error) {
//     console.error("Error saving order to Appwrite:", error);
//     throw error;
//   }
// };

// /**
//  * Get all orders for admin panel
//  * @returns {Promise} - Promise that resolves to list of orders
//  */
// export const getAllOrders = async () => {
//   try {
//     const response = await databases.listDocuments(
//       DATABASE_ID,
//       ORDERS_COLLECTION_ID,
//       [Query.orderDesc("$createdAt")] // Order by creation date, newest first
//     );
//     return response.documents;
//   } catch (error) {
//     console.error("Error fetching orders:", error);
//     throw error;
//   }
// };

// /**
//  * Get orders by status for admin analytics
//  * @param {string} status - Order status to filter by
//  * @returns {Promise} - Promise that resolves to filtered orders
//  */
// export const getOrdersByStatus = async (status) => {
//   try {
//     const response = await databases.listDocuments(
//       DATABASE_ID,
//       ORDERS_COLLECTION_ID,
//       [Query.equal("orderStatus", status), Query.orderDesc("$createdAt")]
//     );
//     return response.documents;
//   } catch (error) {
//     console.error("Error fetching orders by status:", error);
//     throw error;
//   }
// };

// /**
//  * Calculate total revenue from all orders
//  * @returns {Promise} - Promise that resolves to total revenue
//  */
// export const getTotalRevenue = async () => {
//   try {
//     const allOrders = await getAllOrders();
//     const totalRevenue = allOrders.reduce((total, order) => {
//       return total + order.grandTotal;
//     }, 0);
//     return totalRevenue;
//   } catch (error) {
//     console.error("Error calculating total revenue:", error);
//     throw error;
//   }
// };

// /**
//  * Get total orders count for dashboard
//  * @returns {Promise} - Promise that resolves to total orders count
//  */
// export const getTotalOrdersCount = async () => {
//   try {
//     const response = await databases.listDocuments(
//       DATABASE_ID,
//       ORDERS_COLLECTION_ID,
//       [Query.limit(1)] // We only need the count, not the actual documents
//     );
//     return response.total;
//   } catch (error) {
//     console.error("Error getting orders count:", error);
//     throw error;
//   }
// };

// /**
//  * Get total customers count (unique customers)
//  * @returns {Promise} - Promise that resolves to unique customers count
//  */
// export const getTotalCustomersCount = async () => {
//   try {
//     const allOrders = await getAllOrders();
//     const uniqueCustomers = new Set();

//     allOrders.forEach((order) => {
//       // Use phone number as unique identifier since it's required
//       uniqueCustomers.add(order.customerPhone);
//     });

//     return uniqueCustomers.size;
//   } catch (error) {
//     console.error("Error getting customers count:", error);
//     throw error;
//   }
// };

// /**
//  * Get recent orders for dashboard (last 10)
//  * @returns {Promise} - Promise that resolves to recent orders
//  */
// export const getRecentOrders = async () => {
//   try {
//     const response = await databases.listDocuments(
//       DATABASE_ID,
//       ORDERS_COLLECTION_ID,
//       [Query.orderDesc("$createdAt"), Query.limit(10)]
//     );
//     return response.documents;
//   } catch (error) {
//     console.error("Error fetching recent orders:", error);
//     throw error;
//   }
// };

// /**
//  * Get customer analytics data
//  * @returns {Promise} - Promise that resolves to customer analytics
//  */
// export const getCustomerAnalytics = async () => {
//   try {
//     const allOrders = await getAllOrders();
//     const customerData = {};

//     // Group orders by customer phone (unique identifier)
//     allOrders.forEach((order) => {
//       const phone = order.customerPhone;
//       if (!customerData[phone]) {
//         customerData[phone] = {
//           customerName: order.customerName,
//           customerPhone: order.customerPhone,
//           customerAddress: order.customerAddress,
//           customerState: order.customerState,
//           customerCountry: order.customerCountry,
//           totalOrders: 0,
//           totalSpent: 0,
//           joinedDate: order.$createdAt,
//           status: "active", // You can implement logic to determine active/inactive
//         };
//       }
//       customerData[phone].totalOrders += 1;
//       customerData[phone].totalSpent += order.grandTotal;

//       // Keep the earliest join date
//       if (order.$createdAt < customerData[phone].joinedDate) {
//         customerData[phone].joinedDate = order.$createdAt;
//       }
//     });

//     return Object.values(customerData);
//   } catch (error) {
//     console.error("Error getting customer analytics:", error);
//     throw error;
//   }
// };

// /**
//  * Get orders with detailed information for orders page
//  * @returns {Promise} - Promise that resolves to orders with customer and product details
//  */
// export const getOrdersWithDetails = async () => {
//   try {
//     const allOrders = await getAllOrders();

//     return allOrders.map((order) => {
//       const orderItems = JSON.parse(order.orderItems);
//       const firstProduct = orderItems[0]; // Get first product for display

//       return {
//         orderId: order.$id.slice(-5).toUpperCase(), // Last 5 chars as order ID
//         customerName: order.customerName,
//         customerPhone: order.customerPhone,
//         productName: firstProduct ? firstProduct.title : "Multiple Items",
//         totalItems: orderItems.length,
//         amount: order.grandTotal,
//         status: order.orderStatus,
//         paymentStatus: order.paymentStatus,
//         orderDate: order.$createdAt,
//         fullOrderData: order, // Include full order data for detailed view
//       };
//     });
//   } catch (error) {
//     console.error("Error getting orders with details:", error);
//     throw error;
//   }
// };

// /**
//  * Update order status
//  * @param {string} orderId - Order document ID
//  * @param {string} newStatus - New status for the order
//  * @returns {Promise} - Promise that resolves to updated document
//  */
// export const updateOrderStatus = async (orderId, newStatus) => {
//   try {
//     const response = await databases.updateDocument(
//       DATABASE_ID,
//       ORDERS_COLLECTION_ID,
//       orderId,
//       {
//         orderStatus: newStatus,
//       }
//     );
//     return response;
//   } catch (error) {
//     console.error("Error updating order status:", error);
//     throw error;
//   }
// };

// /**
//  * Get dashboard statistics
//  * @returns {Promise} - Promise that resolves to dashboard stats
//  */
// export const getDashboardStats = async () => {
//   try {
//     const [totalRevenue, totalOrders, totalCustomers, recentOrders] =
//       await Promise.all([
//         getTotalRevenue(),
//         getTotalOrdersCount(),
//         getTotalCustomersCount(),
//         getRecentOrders(),
//       ]);

//     return {
//       totalRevenue,
//       totalOrders,
//       totalCustomers,
//       recentOrders: recentOrders.map((order) => {
//         const orderItems = JSON.parse(order.orderItems);
//         const firstProduct = orderItems[0];

//         return {
//           orderId: order.$id.slice(-5).toUpperCase(),
//           customerName: order.customerName,
//           productName: firstProduct ? firstProduct.title : "Multiple Items",
//           amount: order.grandTotal,
//           status: order.orderStatus,
//         };
//       }),
//     };
//   } catch (error) {
//     console.error("Error getting dashboard stats:", error);
//     throw error;
//   }
// };

// /**
//  * Search orders by customer name or order ID
//  * @param {string} searchTerm - Search term
//  * @returns {Promise} - Promise that resolves to filtered orders
//  */
// export const searchOrders = async (searchTerm) => {
//   try {
//     const allOrders = await getAllOrders();

//     return allOrders.filter((order) => {
//       const orderId = order.$id.slice(-5).toUpperCase();
//       const customerName = order.customerName.toLowerCase();
//       const search = searchTerm.toLowerCase();

//       return (
//         orderId.includes(search.toUpperCase()) || customerName.includes(search)
//       );
//     });
//   } catch (error) {
//     console.error("Error searching orders:", error);
//     throw error;
//   }
// };

// /**
//  * Get monthly revenue data for analytics charts
//  * @returns {Promise} - Promise that resolves to monthly revenue data
//  */
// export const getMonthlyRevenue = async () => {
//   try {
//     const allOrders = await getAllOrders();
//     const monthlyData = {};

//     allOrders.forEach((order) => {
//       const date = new Date(order.$createdAt);
//       const monthKey = `${date.getFullYear()}-${String(
//         date.getMonth() + 1
//       ).padStart(2, "0")}`;

//       if (!monthlyData[monthKey]) {
//         monthlyData[monthKey] = {
//           month: monthKey,
//           revenue: 0,
//           orders: 0,
//         };
//       }

//       monthlyData[monthKey].revenue += order.grandTotal;
//       monthlyData[monthKey].orders += 1;
//     });

//     return Object.values(monthlyData).sort((a, b) =>
//       a.month.localeCompare(b.month)
//     );
//   } catch (error) {
//     console.error("Error getting monthly revenue:", error);
//     throw error;
//   }
// };

// /**
//  * Export orders data for admin
//  * @returns {Promise} - Promise that resolves to formatted orders data for export
//  */
// export const exportOrdersData = async () => {
//   try {
//     const allOrders = await getAllOrders();

//     return allOrders.map((order) => {
//       const orderItems = JSON.parse(order.orderItems);

//       return {
//         "Order ID": order.$id.slice(-5).toUpperCase(),
//         "Customer Name": order.customerName,
//         Phone: order.customerPhone,
//         Address: `${order.customerAddress}, ${order.customerState}, ${order.customerCountry}`,
//         Items: orderItems
//           .map((item) => `${item.title} (Qty: ${item.quantity})`)
//           .join("; "),
//         "Total Amount": `$${order.grandTotal}`,
//         "Payment Method": order.paymentMethod,
//         Status: order.orderStatus,
//         "Order Date": new Date(order.$createdAt).toLocaleDateString(),
//         "Items Total": `$${order.itemsTotal}`,
//         "Delivery Charge": `$${order.deliveryCharge}`,
//         "Handling Charge": `$${order.handlingCharge}`,
//       };
//     });
//   } catch (error) {
//     console.error("Error exporting orders data:", error);
//     throw error;
//   }
// };

import { Client, Databases, ID, Query } from "appwrite";

// Initialize Appwrite client
const client = new Client();
client
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const databases = new Databases(client);

// Database and Collection IDs
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const ORDERS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_ORDERS_COLLECTION_ID;

/**
 * Save order to Appwrite database
 * @param {Object} orderData - Order data to be saved
 * @returns {Promise} - Promise that resolves to the created document
 */
export const saveOrderToAppwrite = async (orderData) => {
  try {
    const response = await databases.createDocument(
      DATABASE_ID,
      ORDERS_COLLECTION_ID,
      ID.unique(),
      {
        // ✅ Add this line
        userId: orderData.userId,

        // Customer Information
        customerName: orderData.customerInfo.fullName,
        customerEmail: orderData.customerInfo.email,
        customerPhone: orderData.customerInfo.phoneNumber,
        customerAddress: orderData.customerInfo.address,
        customerState: orderData.customerInfo.state,
        customerPostcode: orderData.customerInfo.postcode,
        customerCountry: orderData.customerInfo.country,

        // Order Items (stored as JSON string)
        orderItems: JSON.stringify(orderData.items),

        // Order Summary
        itemsTotal: orderData.orderSummary.itemsTotal,
        deliveryCharge: orderData.orderSummary.deliveryCharge,
        handlingCharge: orderData.orderSummary.handlingCharge,
        grandTotal: orderData.orderSummary.grandTotal,

        // Payment and Status (always completed)
        paymentMethod: orderData.paymentMethod,
        paymentStatus: orderData.paymentStatus,
        orderStatus: orderData.orderStatus,
        orderDate: orderData.orderDate,

        // Additional fields for admin analytics
        totalItems: orderData.items.length,
        orderValue: orderData.orderSummary.grandTotal,
      }
    );

    console.log("Order saved successfully:", response);
    return response;
  } catch (error) {
    console.error("Error saving order to Appwrite:", error);
    throw error;
  }
};

/**
 * Get orders for a specific user
 * @param {string} userId - User ID to filter orders
 * @returns {Promise} - Promise that resolves to user's orders
 */
export const getUserOrders = async (userId) => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      ORDERS_COLLECTION_ID,
      [
        Query.equal("userId", userId),
        Query.orderDesc("$createdAt"), // Order by creation date, newest first
      ]
    );
    return response.documents;
  } catch (error) {
    console.error("Error fetching user orders:", error);
    throw error;
  }
};

/**
 * Get all orders for admin panel
 * @returns {Promise} - Promise that resolves to list of orders
 */
export const getAllOrders = async () => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      ORDERS_COLLECTION_ID,
      [Query.orderDesc("$createdAt")] // Order by creation date, newest first
    );
    return response.documents;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

/**
 * Get orders by status for admin analytics
 * @param {string} status - Order status to filter by
 * @returns {Promise} - Promise that resolves to filtered orders
 */
export const getOrdersByStatus = async (status) => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      ORDERS_COLLECTION_ID,
      [Query.equal("orderStatus", status), Query.orderDesc("$createdAt")]
    );
    return response.documents;
  } catch (error) {
    console.error("Error fetching orders by status:", error);
    throw error;
  }
};

/**
 * Calculate total revenue from all orders
 * @returns {Promise} - Promise that resolves to total revenue
 */
export const getTotalRevenue = async () => {
  try {
    const allOrders = await getAllOrders();
    const totalRevenue = allOrders.reduce((total, order) => {
      return total + order.grandTotal;
    }, 0);
    return totalRevenue;
  } catch (error) {
    console.error("Error calculating total revenue:", error);
    throw error;
  }
};

/**
 * Get total orders count for dashboard
 * @returns {Promise} - Promise that resolves to total orders count
 */
export const getTotalOrdersCount = async () => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      ORDERS_COLLECTION_ID,
      [Query.limit(1)] // We only need the count, not the actual documents
    );
    return response.total;
  } catch (error) {
    console.error("Error getting orders count:", error);
    throw error;
  }
};

/**
 * Get total customers count (unique customers)
 * @returns {Promise} - Promise that resolves to unique customers count
 */
export const getTotalCustomersCount = async () => {
  try {
    const allOrders = await getAllOrders();
    const uniqueCustomers = new Set();

    allOrders.forEach((order) => {
      // Use phone number as unique identifier since it's required
      uniqueCustomers.add(order.customerPhone);
    });

    return uniqueCustomers.size;
  } catch (error) {
    console.error("Error getting customers count:", error);
    throw error;
  }
};

/**
 * Get recent orders for dashboard (last 10)
 * @returns {Promise} - Promise that resolves to recent orders
 */
export const getRecentOrders = async () => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      ORDERS_COLLECTION_ID,
      [Query.orderDesc("$createdAt"), Query.limit(10)]
    );
    return response.documents;
  } catch (error) {
    console.error("Error fetching recent orders:", error);
    throw error;
  }
};

/**
 * Get customer analytics data
 * @returns {Promise} - Promise that resolves to customer analytics
 */
export const getCustomerAnalytics = async () => {
  try {
    const allOrders = await getAllOrders();
    const customerData = {};

    // Group orders by customer phone (unique identifier)
    allOrders.forEach((order) => {
      const phone = order.customerPhone;
      if (!customerData[phone]) {
        customerData[phone] = {
          customerName: order.customerName,
          customerPhone: order.customerPhone,
          customerAddress: order.customerAddress,
          customerState: order.customerState,
          customerCountry: order.customerCountry,
          totalOrders: 0,
          totalSpent: 0,
          joinedDate: order.$createdAt,
          status: "active", // You can implement logic to determine active/inactive
        };
      }
      customerData[phone].totalOrders += 1;
      customerData[phone].totalSpent += order.grandTotal;

      // Keep the earliest join date
      if (order.$createdAt < customerData[phone].joinedDate) {
        customerData[phone].joinedDate = order.$createdAt;
      }
    });

    return Object.values(customerData);
  } catch (error) {
    console.error("Error getting customer analytics:", error);
    throw error;
  }
};

/**
 * Get orders with detailed information for orders page
 * @returns {Promise} - Promise that resolves to orders with customer and product details
 */
export const getOrdersWithDetails = async () => {
  try {
    const allOrders = await getAllOrders();

    return allOrders.map((order) => {
      const orderItems = JSON.parse(order.orderItems);
      const firstProduct = orderItems[0]; // Get first product for display

      return {
        orderId: order.$id.slice(-5).toUpperCase(), // Last 5 chars as order ID
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        productName: firstProduct ? firstProduct.title : "Multiple Items",
        totalItems: orderItems.length,
        amount: order.grandTotal,
        status: order.orderStatus,
        paymentStatus: order.paymentStatus,
        orderDate: order.$createdAt,
        fullOrderData: order, // Include full order data for detailed view
      };
    });
  } catch (error) {
    console.error("Error getting orders with details:", error);
    throw error;
  }
};

/**
 * Update order status
 * @param {string} orderId - Order document ID
 * @param {string} newStatus - New status for the order
 * @returns {Promise} - Promise that resolves to updated document
 */
export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const response = await databases.updateDocument(
      DATABASE_ID,
      ORDERS_COLLECTION_ID,
      orderId,
      {
        orderStatus: newStatus,
      }
    );
    return response;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

/**
 * Get dashboard statistics
 * @returns {Promise} - Promise that resolves to dashboard stats
 */
export const getDashboardStats = async () => {
  try {
    const [totalRevenue, totalOrders, totalCustomers, recentOrders] =
      await Promise.all([
        getTotalRevenue(),
        getTotalOrdersCount(),
        getTotalCustomersCount(),
        getRecentOrders(),
      ]);

    return {
      totalRevenue,
      totalOrders,
      totalCustomers,
      recentOrders: recentOrders.map((order) => {
        const orderItems = JSON.parse(order.orderItems);
        const firstProduct = orderItems[0];

        return {
          orderId: order.$id.slice(-5).toUpperCase(),
          customerName: order.customerName,
          productName: firstProduct ? firstProduct.title : "Multiple Items",
          amount: order.grandTotal,
          status: order.orderStatus,
        };
      }),
    };
  } catch (error) {
    console.error("Error getting dashboard stats:", error);
    throw error;
  }
};

/**
 * Search orders by customer name or order ID
 * @param {string} searchTerm - Search term
 * @returns {Promise} - Promise that resolves to filtered orders
 */
export const searchOrders = async (searchTerm) => {
  try {
    const allOrders = await getAllOrders();

    return allOrders.filter((order) => {
      const orderId = order.$id.slice(-5).toUpperCase();
      const customerName = order.customerName.toLowerCase();
      const search = searchTerm.toLowerCase();

      return (
        orderId.includes(search.toUpperCase()) || customerName.includes(search)
      );
    });
  } catch (error) {
    console.error("Error searching orders:", error);
    throw error;
  }
};

/**
 * Get monthly revenue data for analytics charts
 * @returns {Promise} - Promise that resolves to monthly revenue data
 */
export const getMonthlyRevenue = async () => {
  try {
    const allOrders = await getAllOrders();
    const monthlyData = {};

    allOrders.forEach((order) => {
      const date = new Date(order.$createdAt);
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

      monthlyData[monthKey].revenue += order.grandTotal;
      monthlyData[monthKey].orders += 1;
    });

    return Object.values(monthlyData).sort((a, b) =>
      a.month.localeCompare(b.month)
    );
  } catch (error) {
    console.error("Error getting monthly revenue:", error);
    throw error;
  }
};

/**
 * Export orders data for admin
 * @returns {Promise} - Promise that resolves to formatted orders data for export
 */
export const exportOrdersData = async () => {
  try {
    const allOrders = await getAllOrders();

    return allOrders.map((order) => {
      const orderItems = JSON.parse(order.orderItems);

      return {
        "Order ID": order.$id.slice(-5).toUpperCase(),
        "Customer Name": order.customerName,
        Phone: order.customerPhone,
        Address: `${order.customerAddress}, ${order.customerState}, ${order.customerCountry}`,
        Items: orderItems
          .map((item) => `${item.title} (Qty: ${item.quantity})`)
          .join("; "),
        "Total Amount": `$${order.grandTotal}`,
        "Payment Method": order.paymentMethod,
        Status: order.orderStatus,
        "Order Date": new Date(order.$createdAt).toLocaleDateString(),
        "Items Total": `$${order.itemsTotal}`,
        "Delivery Charge": `$${order.deliveryCharge}`,
        "Handling Charge": `$${order.handlingCharge}`,
      };
    });
  } catch (error) {
    console.error("Error exporting orders data:", error);
    throw error;
  }
};
