import { Client, Databases, Query } from "appwrite";
import { toast } from "react-toastify";

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const databases = new Databases(client);
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const ORDERS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_ORDERS_COLLECTION_ID;

// Debug function to check environment variables
const checkEnvVars = () => {
  const requiredVars = {
    VITE_APPWRITE_ENDPOINT: import.meta.env.VITE_APPWRITE_ENDPOINT,
    VITE_APPWRITE_PROJECT_ID: import.meta.env.VITE_APPWRITE_PROJECT_ID,
    VITE_APPWRITE_DATABASE_ID: import.meta.env.VITE_APPWRITE_DATABASE_ID,
    VITE_APPWRITE_ORDERS_COLLECTION_ID: import.meta.env
      .VITE_APPWRITE_ORDERS_COLLECTION_ID,
  };

  console.log("Environment variables check:");
  Object.entries(requiredVars).forEach(([key, value]) => {
    console.log(`${key}: ${value ? "✅ Set" : "❌ Missing"}`);
  });

  const missingVars = Object.entries(requiredVars)
    .filter(([key, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    console.error("Missing environment variables:", missingVars);
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}`
    );
  }
};

// Get all customers with aggregated data from orders
export const getAllCustomers = async () => {
  try {
    // Check environment variables first
    checkEnvVars();

    console.log("Fetching customers from:", {
      endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT,
      projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
      databaseId: DATABASE_ID,
      collectionId: ORDERS_COLLECTION_ID,
    });

    const response = await databases.listDocuments(
      DATABASE_ID,
      ORDERS_COLLECTION_ID,
      [Query.orderDesc("$createdAt"), Query.limit(1000)]
    );

    console.log("Raw response from Appwrite:", response);

    if (!response || !response.documents) {
      throw new Error("Invalid response from Appwrite");
    }

    if (response.documents.length === 0) {
      console.warn("No orders found in the database");
      return [];
    }

    const customerMap = new Map();

    response.documents.forEach((order) => {
      const userId = order.userId;

      if (!userId) {
        console.warn("Order missing userId:", order);
        return;
      }

      if (!customerMap.has(userId)) {
        customerMap.set(userId, {
          userId: userId,
          name: order.customerName || "Unknown Customer",
          email: order.customerEmail || "",
          phone: order.customerPhone || "",
          joinedDate: order.$createdAt,
          orders: [],
          totalOrders: 0,
          totalSpent: 0,
          addresses: [],
        });
      }

      const customer = customerMap.get(userId);

      // Parse order items safely
      let orderItems = [];
      try {
        orderItems = JSON.parse(order.orderItems || "[]");
      } catch (e) {
        console.warn("Failed to parse orderItems for order:", order.$id, e);
        orderItems = [];
      }

      // Add order to customer's orders
      customer.orders.push({
        id: order.$id,
        orderId: `#${order.$id.slice(-5).toUpperCase()}`,
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
        paymentMethod: order.paymentMethod || "",
        orderDate: order.orderDate || order.$createdAt,
        totalItems: order.totalItems || orderItems.length,
      });

      // Update aggregated data
      customer.totalOrders += 1;
      customer.totalSpent += parseFloat(order.grandTotal || 0);

      // Collect unique addresses
      const addressString = `${order.customerAddress || ""}, ${
        order.customerState || ""
      }, ${order.customerCountry || ""}`;
      if (!customer.addresses.find((addr) => addr.full === addressString)) {
        customer.addresses.push({
          address: order.customerAddress || "",
          state: order.customerState || "",
          postcode: order.customerPostcode || "",
          country: order.customerCountry || "",
          full: addressString,
          phone: order.customerPhone || "",
        });
      }

      // Keep the earliest join date
      if (order.$createdAt < customer.joinedDate) {
        customer.joinedDate = order.$createdAt;
      }
    });

    // Convert map to array and sort by total spent (descending)
    const customersArray = Array.from(customerMap.values()).sort(
      (a, b) => b.totalSpent - a.totalSpent
    );

    console.log("Processed customers:", customersArray);
    return customersArray;
  } catch (error) {
    console.error("Detailed error fetching customers:", error);

    // More specific error messages
    if (error.message.includes("Failed to fetch")) {
      toast.error(
        "Network error: Please check your internet connection and Appwrite configuration"
      );
    } else if (
      error.message.includes("Missing required environment variables")
    ) {
      toast.error("Configuration error: Missing environment variables");
    } else if (error.code === 401) {
      toast.error(
        "Authentication error: Please check your Appwrite project ID and permissions"
      );
    } else if (error.code === 404) {
      toast.error(
        "Database or collection not found: Please check your database and collection IDs"
      );
    } else {
      toast.error(`Failed to fetch customers: ${error.message}`);
    }

    throw error;
  }
};

// Get customer by userId with all orders
export const getCustomerByUserId = async (userId) => {
  try {
    checkEnvVars();

    if (!userId) {
      throw new Error("UserId is required");
    }

    console.log("Fetching customer details for userId:", userId);

    const response = await databases.listDocuments(
      DATABASE_ID,
      ORDERS_COLLECTION_ID,
      [Query.equal("userId", userId), Query.orderDesc("$createdAt")]
    );

    console.log("Customer details response:", response);

    if (response.documents.length === 0) {
      throw new Error("Customer not found");
    }

    const orders = response.documents;
    const firstOrder = orders[0];

    const customerOrders = orders.map((order) => {
      let orderItems = [];
      try {
        orderItems = JSON.parse(order.orderItems || "[]");
      } catch (e) {
        console.warn("Failed to parse orderItems for order:", order.$id, e);
        orderItems = [];
      }

      return {
        id: order.$id,
        orderId: `#${order.$id.slice(-5).toUpperCase()}`,
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
        itemsTotal: parseFloat(order.itemsTotal || 0),
        deliveryCharge: parseFloat(order.deliveryCharge || 0),
        handlingCharge: parseFloat(order.handlingCharge || 0),
        paymentMethod: order.paymentMethod || "",
        orderDate: order.orderDate || order.$createdAt,
        totalItems: order.totalItems || orderItems.length,
      };
    });

    // Get unique addresses
    const addresses = [];
    const addressSet = new Set();

    orders.forEach((order) => {
      const addressString = `${order.customerAddress || ""}, ${
        order.customerState || ""
      }, ${order.customerCountry || ""}`;
      if (!addressSet.has(addressString)) {
        addressSet.add(addressString);
        addresses.push({
          address: order.customerAddress || "",
          state: order.customerState || "",
          postcode: order.customerPostcode || "",
          country: order.customerCountry || "",
          full: addressString,
          phone: order.customerPhone || "",
        });
      }
    });

    const customerData = {
      userId: userId,
      name: firstOrder.customerName || "Unknown Customer",
      email: firstOrder.customerEmail || "",
      phone: firstOrder.customerPhone || "",
      joinedDate: orders[orders.length - 1].$createdAt, // Earliest order
      orders: customerOrders,
      totalOrders: orders.length,
      totalSpent: orders.reduce(
        (sum, order) => sum + parseFloat(order.grandTotal || 0),
        0
      ),
      addresses: addresses,
    };

    console.log("Processed customer data:", customerData);
    return customerData;
  } catch (error) {
    console.error("Error fetching customer by userId:", error);
    toast.error(`Failed to fetch customer details: ${error.message}`);
    throw error;
  }
};

// Search customers by name, email, or phone
export const searchCustomers = async (searchTerm) => {
  try {
    if (!searchTerm || searchTerm.trim() === "") {
      return await getAllCustomers();
    }

    const allCustomers = await getAllCustomers();

    return allCustomers.filter((customer) => {
      const search = searchTerm.toLowerCase();
      return (
        (customer.name || "").toLowerCase().includes(search) ||
        (customer.email || "").toLowerCase().includes(search) ||
        (customer.phone || "").toLowerCase().includes(search)
      );
    });
  } catch (error) {
    console.error("Error searching customers:", error);
    toast.error("Failed to search customers");
    throw error;
  }
};

// Get customer statistics
export const getCustomerStats = async () => {
  try {
    const customers = await getAllCustomers();

    const totalOrders = customers.reduce(
      (sum, customer) => sum + customer.totalOrders,
      0
    );

    const stats = {
      totalCustomers: customers.length,
      totalRevenue: customers.reduce(
        (sum, customer) => sum + customer.totalSpent,
        0
      ),
      averageOrderValue:
        totalOrders > 0
          ? customers.reduce((sum, customer) => sum + customer.totalSpent, 0) /
            totalOrders
          : 0,
      topCustomers: customers.slice(0, 5), // Top 5 customers by spending
    };

    return stats;
  } catch (error) {
    console.error("Error getting customer stats:", error);
    toast.error("Failed to fetch customer statistics");
    throw error;
  }
};

// Export customers data
export const exportCustomersData = async () => {
  try {
    const customers = await getAllCustomers();

    return customers.map((customer) => ({
      "Customer Name": customer.name,
      Email: customer.email,
      Phone: customer.phone,
      "Total Orders": customer.totalOrders,
      "Total Spent": `$${customer.totalSpent.toFixed(2)}`,
      Addresses: customer.addresses.length,
      "Join Date": new Date(customer.joinedDate).toLocaleDateString(),
      "Average Order Value":
        customer.totalOrders > 0
          ? `$${(customer.totalSpent / customer.totalOrders).toFixed(2)}`
          : "$0.00",
    }));
  } catch (error) {
    console.error("Error exporting customers data:", error);
    toast.error("Failed to export customers data");
    throw error;
  }
};
