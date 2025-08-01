// import { Client, Databases, Query } from "appwrite";
// import { toast } from "react-toastify";

// const client = new Client()
//   .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
//   .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

// const databases = new Databases(client);
// const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
// const ORDERS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_ORDERS_COLLECTION_ID;
// const PRODUCTS_COLLECTION_ID = import.meta.env
//   .VITE_APPWRITE_PRODUCTS_COLLECTION_ID;
// const USERS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID;

// // Get products count by category
// export const getProductsByCategory = async () => {
//   try {
//     const response = await databases.listDocuments(
//       DATABASE_ID,
//       PRODUCTS_COLLECTION_ID,
//       [Query.limit(1000)]
//     );

//     const categoryCount = {};
//     let totalProducts = response.documents.length;

//     // Count products by category
//     response.documents.forEach((product) => {
//       const category = product.category || "Uncategorized";
//       categoryCount[category] = (categoryCount[category] || 0) + 1;
//     });

//     // Convert to array format for charts
//     const categoryData = Object.entries(categoryCount).map(([name, count]) => ({
//       name,
//       count,
//       percentage: ((count / totalProducts) * 100).toFixed(1),
//     }));

//     return {
//       categoryData,
//       totalProducts,
//     };
//   } catch (error) {
//     console.error("Error fetching products by category:", error);
//     toast.error("Failed to fetch products by category");
//     throw error;
//   }
// };

// // Get sales data by category
// export const getSalesByCategory = async () => {
//   try {
//     const response = await databases.listDocuments(
//       DATABASE_ID,
//       ORDERS_COLLECTION_ID,
//       [Query.limit(1000)]
//     );

//     const categorySales = {};
//     let totalRevenue = 0;

//     // Process each order
//     response.documents.forEach((order) => {
//       try {
//         const orderItems = JSON.parse(order.orderItems || "[]");
//         const orderTotal = parseFloat(order.grandTotal || 0);
//         totalRevenue += orderTotal;

//         // Group sales by category (assuming items have category field)
//         orderItems.forEach((item) => {
//           const category = item.category || "Uncategorized";
//           const itemTotal = (item.price || 0) * (item.quantity || 1);

//           if (!categorySales[category]) {
//             categorySales[category] = {
//               totalSales: 0,
//               orderCount: 0,
//             };
//           }

//           categorySales[category].totalSales += itemTotal;
//         });
//       } catch (e) {
//         console.warn("Error parsing order items:", e);
//       }
//     });

//     // Convert to array format for charts
//     const salesData = Object.entries(categorySales).map(([name, data]) => ({
//       name,
//       sales: data.totalSales,
//       percentage:
//         totalRevenue > 0 ? ((data.sales / totalRevenue) * 100).toFixed(1) : 0,
//     }));

//     return {
//       salesData: salesData.sort((a, b) => b.sales - a.sales),
//       totalRevenue,
//     };
//   } catch (error) {
//     console.error("Error fetching sales by category:", error);
//     toast.error("Failed to fetch sales by category");
//     throw error;
//   }
// };

// // Get overview statistics
// export const getOverviewStats = async () => {
//   try {
//     // Fetch all required data in parallel
//     const [ordersResponse, productsResponse, usersResponse] = await Promise.all(
//       [
//         databases.listDocuments(DATABASE_ID, ORDERS_COLLECTION_ID, [
//           Query.limit(1000),
//         ]),
//         databases.listDocuments(DATABASE_ID, PRODUCTS_COLLECTION_ID, [
//           Query.limit(1000),
//         ]),
//         databases.listDocuments(DATABASE_ID, USERS_COLLECTION_ID, [
//           Query.limit(1000),
//         ]),
//       ]
//     );

//     const orders = ordersResponse.documents;
//     const products = productsResponse.documents;
//     const users = usersResponse.documents;

//     // Calculate total revenue
//     const totalRevenue = orders.reduce((sum, order) => {
//       return sum + parseFloat(order.grandTotal || 0);
//     }, 0);

//     // Calculate completed orders
//     const completedOrders = orders.filter(
//       (order) =>
//         order.orderStatus === "completed" || order.orderStatus === "delivered"
//     ).length;

//     // Calculate pending orders
//     const pendingOrders = orders.filter(
//       (order) =>
//         order.orderStatus === "pending" || order.orderStatus === "processing"
//     ).length;

//     // Calculate low stock products
//     const lowStockProducts = products.filter(
//       (product) => (product.stock || 0) < 10
//     ).length;

//     return {
//       totalRevenue,
//       totalOrders: orders.length,
//       totalProducts: products.length,
//       totalCustomers: users.length,
//       completedOrders,
//       pendingOrders,
//       lowStockProducts,
//       averageOrderValue: orders.length > 0 ? totalRevenue / orders.length : 0,
//     };
//   } catch (error) {
//     console.error("Error fetching overview stats:", error);
//     toast.error("Failed to fetch overview statistics");
//     throw error;
//   }
// };

// // Get recent orders for analytics
// export const getRecentOrdersAnalytics = async (limit = 10) => {
//   try {
//     const response = await databases.listDocuments(
//       DATABASE_ID,
//       ORDERS_COLLECTION_ID,
//       [Query.orderDesc("$createdAt"), Query.limit(limit)]
//     );

//     return response.documents.map((order) => {
//       const orderItems = JSON.parse(order.orderItems || "[]");

//       return {
//         id: order.$id,
//         orderId: `#${order.$id.slice(-5).toUpperCase()}`,
//         customer: order.customerName || "Unknown Customer",
//         totalAmount: parseFloat(order.grandTotal || 0),
//         status: order.orderStatus || "pending",
//         createdAt: order.$createdAt,
//         itemsCount: orderItems.length,
//       };
//     });
//   } catch (error) {
//     console.error("Error fetching recent orders:", error);
//     toast.error("Failed to fetch recent orders");
//     throw error;
//   }
// };

// // Get monthly sales data (for trends)
// export const getMonthlySalesData = async () => {
//   try {
//     const response = await databases.listDocuments(
//       DATABASE_ID,
//       ORDERS_COLLECTION_ID,
//       [Query.orderDesc("$createdAt"), Query.limit(1000)]
//     );

//     const monthlySales = {};
//     const currentYear = new Date().getFullYear();

//     response.documents.forEach((order) => {
//       const orderDate = new Date(order.$createdAt);
//       const monthKey = `${orderDate.getFullYear()}-${String(
//         orderDate.getMonth() + 1
//       ).padStart(2, "0")}`;

//       if (orderDate.getFullYear() === currentYear) {
//         if (!monthlySales[monthKey]) {
//           monthlySales[monthKey] = {
//             month: orderDate.toLocaleDateString("en-US", { month: "short" }),
//             sales: 0,
//             orders: 0,
//           };
//         }

//         monthlySales[monthKey].sales += parseFloat(order.grandTotal || 0);
//         monthlySales[monthKey].orders += 1;
//       }
//     });

//     // Convert to array and sort by month
//     const salesData = Object.values(monthlySales).sort((a, b) => {
//       const monthOrder = [
//         "Jan",
//         "Feb",
//         "Mar",
//         "Apr",
//         "May",
//         "Jun",
//         "Jul",
//         "Aug",
//         "Sep",
//         "Oct",
//         "Nov",
//         "Dec",
//       ];
//       return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
//     });

//     return salesData;
//   } catch (error) {
//     console.error("Error fetching monthly sales data:", error);
//     toast.error("Failed to fetch monthly sales data");
//     throw error;
//   }
// };

// // Get top selling products
// export const getTopSellingProducts = async (limit = 5) => {
//   try {
//     const response = await databases.listDocuments(
//       DATABASE_ID,
//       ORDERS_COLLECTION_ID,
//       [Query.limit(1000)]
//     );

//     const productSales = {};

//     // Process each order to count product sales
//     response.documents.forEach((order) => {
//       try {
//         const orderItems = JSON.parse(order.orderItems || "[]");

//         orderItems.forEach((item) => {
//           const productId = item.id || item.productId;
//           if (productId) {
//             if (!productSales[productId]) {
//               productSales[productId] = {
//                 id: productId,
//                 title: item.title || "Unknown Product",
//                 totalSold: 0,
//                 totalRevenue: 0,
//               };
//             }

//             productSales[productId].totalSold += item.quantity || 1;
//             productSales[productId].totalRevenue +=
//               (item.price || 0) * (item.quantity || 1);
//           }
//         });
//       } catch (e) {
//         console.warn("Error parsing order items:", e);
//       }
//     });

//     // Convert to array and sort by total sold
//     const topProducts = Object.values(productSales)
//       .sort((a, b) => b.totalSold - a.totalSold)
//       .slice(0, limit);

//     return topProducts;
//   } catch (error) {
//     console.error("Error fetching top selling products:", error);
//     toast.error("Failed to fetch top selling products");
//     throw error;
//   }
// };

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
const USERS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID;

// Get products count by category
export const getProductsByCategory = async () => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      PRODUCTS_COLLECTION_ID,
      [Query.limit(1000)]
    );

    const categoryCount = {};
    let totalProducts = response.documents.length;

    // Count products by category
    response.documents.forEach((product) => {
      const category = product.category || "Uncategorized";
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });

    // Convert to array format for charts
    const data = Object.entries(categoryCount).map(([name, count]) => ({
      name,
      count,
      percentage: Number(((count / totalProducts) * 100).toFixed(1)),
    }));
    console.log("data of category for chart", data); ///
    return {
      data, // ✅ Fixed: Changed from 'categoryData' to 'data'
      totalProducts,
    };
  } catch (error) {
    console.error("Error fetching products by category:", error);
    toast.error("Failed to fetch products by category");
    throw error;
  }
};

// Get sales data by category
export const getSalesByCategory = async () => {
  try {
    // Fetch all products first and create a map for quick lookup
    const productsResponse = await databases.listDocuments(
      DATABASE_ID,
      PRODUCTS_COLLECTION_ID,
      [Query.limit(1000)]
    );

    const productMap = {};
    productsResponse.documents.forEach((product) => {
      productMap[product.$id] = product.category ;
    });

    // Now fetch all orders
    const response = await databases.listDocuments(
      DATABASE_ID,
      ORDERS_COLLECTION_ID,
      [Query.limit(1000)]
    );

    const categorySales = {};
    let totalRevenue = 0;

    response.documents.forEach((order) => {
      try {
        const orderItems = JSON.parse(order.orderItems || "[]");
        const orderTotal = parseFloat(order.grandTotal || 0);
        totalRevenue += orderTotal;

        orderItems.forEach((item) => {
          const quantity = Number(item.quantity || 1);
          const price = Number(item.price || 0);
          const itemTotal = quantity * price;

          const productId = item.id || item.productId;
          const category = productMap[productId] || "Uncategorized";

          if (!categorySales[category]) {
            categorySales[category] = {
              totalSales: 0,
              orderCount: 0,
            };
          }

          categorySales[category].totalSales += itemTotal;
        });
      } catch (e) {
        console.warn("Error parsing order items:", e);
      }
    });

    const data = Object.entries(categorySales).map(([name, salesData]) => ({
      name,
      sales: salesData.totalSales,
      percentage:
        totalRevenue > 0
          ? ((salesData.totalSales / totalRevenue) * 100).toFixed(1)
          : 0,
    }));

    console.log("data of sale for chart", data);

    return {
      data: data.sort((a, b) => b.sales - a.sales),
      totalRevenue,
    };
  } catch (error) {
    console.error("Error fetching sales by category:", error);
    toast.error("Failed to fetch sales by category");
    throw error;
  }
};

// Get overview statistics
export const getOverviewStats = async () => {
  try {
    // Fetch all required data in parallel
    const [ordersResponse, productsResponse, usersResponse] = await Promise.all(
      [
        databases.listDocuments(DATABASE_ID, ORDERS_COLLECTION_ID, [
          Query.limit(1000),
        ]),
        databases.listDocuments(DATABASE_ID, PRODUCTS_COLLECTION_ID, [
          Query.limit(1000),
        ]),
        databases.listDocuments(DATABASE_ID, USERS_COLLECTION_ID, [
          Query.limit(1000),
        ]),
      ]
    );

    const orders = ordersResponse.documents;
    const products = productsResponse.documents;
    const users = usersResponse.documents;

    // Calculate total revenue
    const totalRevenue = orders.reduce((sum, order) => {
      return sum + parseFloat(order.grandTotal || 0);
    }, 0);

    // Calculate completed orders
    const completedOrders = orders.filter(
      (order) =>
        order.orderStatus === "completed" || order.orderStatus === "delivered"
    ).length;

    // Calculate pending orders
    const pendingOrders = orders.filter(
      (order) =>
        order.orderStatus === "pending" || order.orderStatus === "processing"
    ).length;

    // Calculate low stock products
    const lowStockProducts = products.filter(
      (product) => (product.stock || 0) < 10
    ).length;

    return {
      totalRevenue,
      totalOrders: orders.length,
      totalProducts: products.length,
      totalCustomers: users.length,
      completedOrders,
      pendingOrders,
      lowStockProducts,
      averageOrderValue: orders.length > 0 ? totalRevenue / orders.length : 0,
    };
  } catch (error) {
    console.error("Error fetching overview stats:", error);
    toast.error("Failed to fetch overview statistics");
    throw error;
  }
};

// Get recent orders for analytics
export const getRecentOrdersAnalytics = async (limit = 10) => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      ORDERS_COLLECTION_ID,
      [Query.orderDesc("$createdAt"), Query.limit(limit)]
    );

    return response.documents.map((order) => {
      const orderItems = JSON.parse(order.orderItems || "[]");

      return {
        id: order.$id,
        orderId: `#${order.$id.slice(-5).toUpperCase()}`,
        customer: order.customerName || "Unknown Customer",
        totalAmount: parseFloat(order.grandTotal || 0),
        status: order.orderStatus || "pending",
        createdAt: order.$createdAt,
        itemsCount: orderItems.length,
      };
    });
  } catch (error) {
    console.error("Error fetching recent orders:", error);
    toast.error("Failed to fetch recent orders");
    throw error;
  }
};

// Get monthly sales data (for trends)
export const getMonthlySalesData = async () => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      ORDERS_COLLECTION_ID,
      [Query.orderDesc("$createdAt"), Query.limit(1000)]
    );

    const monthlySales = {};
    const currentYear = new Date().getFullYear();

    response.documents.forEach((order) => {
      const orderDate = new Date(order.$createdAt);
      const monthKey = `${orderDate.getFullYear()}-${String(
        orderDate.getMonth() + 1
      ).padStart(2, "0")}`;

      if (orderDate.getFullYear() === currentYear) {
        if (!monthlySales[monthKey]) {
          monthlySales[monthKey] = {
            month: orderDate.toLocaleDateString("en-US", { month: "short" }),
            sales: 0,
            orders: 0,
          };
        }

        monthlySales[monthKey].sales += parseFloat(order.grandTotal || 0);
        monthlySales[monthKey].orders += 1;
      }
    });

    // Convert to array and sort by month
    const salesData = Object.values(monthlySales).sort((a, b) => {
      const monthOrder = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
    });

    return salesData;
  } catch (error) {
    console.error("Error fetching monthly sales data:", error);
    toast.error("Failed to fetch monthly sales data");
    throw error;
  }
};

// Get top selling products
export const getTopSellingProducts = async (limit = 5) => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      ORDERS_COLLECTION_ID,
      [Query.limit(1000)]
    );

    const productSales = {};

    // Process each order to count product sales
    response.documents.forEach((order) => {
      try {
        const orderItems = JSON.parse(order.orderItems || "[]");

        orderItems.forEach((item) => {
          const productId = item.id || item.productId;
          if (productId) {
            if (!productSales[productId]) {
              productSales[productId] = {
                id: productId,
                title: item.title || "Unknown Product",
                totalSold: 0,
                totalRevenue: 0,
              };
            }

            productSales[productId].totalSold += item.quantity || 1;
            productSales[productId].totalRevenue +=
              (item.price || 0) * (item.quantity || 1);
          }
        });
      } catch (e) {
        console.warn("Error parsing order items:", e);
      }
    });

    // Convert to array and sort by total sold
    const topProducts = Object.values(productSales)
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, limit);

    return topProducts;
  } catch (error) {
    console.error("Error fetching top selling products:", error);
    toast.error("Failed to fetch top selling products");
    throw error;
  }
};
