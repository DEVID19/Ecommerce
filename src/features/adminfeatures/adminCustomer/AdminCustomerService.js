import { Client, Databases, Query } from "appwrite";
import { toast } from "react-toastify";

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const databases = new Databases(client);
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const ORDERS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_ORDERS_COLLECTION_ID;
const USERS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID;

// Debug function to check environment variables
const checkEnvVars = () => {
  const requiredVars = {
    VITE_APPWRITE_ENDPOINT: import.meta.env.VITE_APPWRITE_ENDPOINT,
    VITE_APPWRITE_PROJECT_ID: import.meta.env.VITE_APPWRITE_PROJECT_ID,
    VITE_APPWRITE_DATABASE_ID: import.meta.env.VITE_APPWRITE_DATABASE_ID,
    VITE_APPWRITE_ORDERS_COLLECTION_ID: import.meta.env
      .VITE_APPWRITE_ORDERS_COLLECTION_ID,
    VITE_APPWRITE_USERS_COLLECTION_ID: import.meta.env
      .VITE_APPWRITE_USERS_COLLECTION_ID,
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

// Get all customers from users collection with their order data
export const getAllCustomers = async () => {
  try {
    checkEnvVars();

    // Get all users from users collection
    const usersResponse = await databases.listDocuments(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      [Query.orderDesc("$createdAt"), Query.limit(1000)]
    );

    console.log("Users from collection:", usersResponse);

    const customersWithOrders = [];

    for (const user of usersResponse.documents) {
      try {
        // Get orders for this user
        const ordersResponse = await databases.listDocuments(
          DATABASE_ID,
          ORDERS_COLLECTION_ID,
          [Query.equal("userId", user.userId), Query.orderDesc("$createdAt")]
        );

        console.log(`Orders for user ${user.userId}:`, ordersResponse);

        const orders = ordersResponse.documents.map((order) => {
          let orderItems = [];
          try {
            orderItems = JSON.parse(order.orderItems || "[]");
          } catch (e) {
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
            paymentMethod: order.paymentMethod || "",
            orderDate: order.orderDate || order.$createdAt,
            totalItems: order.totalItems || orderItems.length,
            itemsTotal: parseFloat(order.itemsTotal || 0),
            deliveryCharge: parseFloat(order.deliveryCharge || 0),
            handlingCharge: parseFloat(order.handlingCharge || 0),
          };
        });

        // Get unique addresses from orders
        const addresses = [];
        const addressSet = new Set();

        ordersResponse.documents.forEach((order) => {
          const addressString = `${order.customerAddress || ""}, ${
            order.customerState || ""
          }, ${order.customerCountry || ""}`;
          if (!addressSet.has(addressString) && order.customerAddress) {
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

        // Get phone number from first order if available
        const phoneFromOrder =
          ordersResponse.documents.length > 0
            ? ordersResponse.documents[0].customerPhone || ""
            : "";

        const customerData = {
          userId: user.userId,
          name: user.name || "Unknown Customer",
          email: user.email || "",
          phone: phoneFromOrder, // Get phone from orders since it's not in user collection
          joinedDate: user.joinedDate || user.$createdAt,
          orders: orders,
          totalOrders: orders.length,
          totalSpent: orders.reduce((sum, order) => sum + order.totalAmount, 0),
          addresses: addresses,
        };

        customersWithOrders.push(customerData);
      } catch (error) {
        console.warn(`Error processing user ${user.userId}:`, error);
        // Still add user even if no orders found
        customersWithOrders.push({
          userId: user.userId,
          name: user.name || "Unknown Customer",
          email: user.email || "",
          phone: "",
          joinedDate: user.joinedDate || user.$createdAt,
          orders: [],
          totalOrders: 0,
          totalSpent: 0,
          addresses: [],
        });
      }
    }

    return customersWithOrders.sort((a, b) => b.totalSpent - a.totalSpent);
  } catch (error) {
    console.error("Error fetching customers:", error);
    toast.error("Failed to fetch customers");
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

    // First, get user from users collection
    const userResponse = await databases.listDocuments(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      [Query.equal("userId", userId)]
    );

    console.log("User response:", userResponse);

    if (userResponse.documents.length === 0) {
      throw new Error("Customer not found in users collection");
    }

    const user = userResponse.documents[0];

    // Then get all orders for this user
    const ordersResponse = await databases.listDocuments(
      DATABASE_ID,
      ORDERS_COLLECTION_ID,
      [Query.equal("userId", userId), Query.orderDesc("$createdAt")]
    );

    console.log("Orders response:", ordersResponse);

    const orders = ordersResponse.documents.map((order) => {
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

    // Get unique addresses from orders
    const addresses = [];
    const addressSet = new Set();

    ordersResponse.documents.forEach((order) => {
      const addressString = `${order.customerAddress || ""}, ${
        order.customerState || ""
      }, ${order.customerCountry || ""}`;
      if (!addressSet.has(addressString) && order.customerAddress) {
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

    // Get phone number from first order if available
    const phoneFromOrder =
      ordersResponse.documents.length > 0
        ? ordersResponse.documents[0].customerPhone || ""
        : "";

    const customerData = {
      userId: userId,
      name: user.name || "Unknown Customer",
      email: user.email || "",
      phone: phoneFromOrder,
      joinedDate: user.joinedDate || user.$createdAt,
      orders: orders,
      totalOrders: orders.length,
      totalSpent: orders.reduce((sum, order) => sum + order.totalAmount, 0),
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
