import { Client, Databases, Query } from "appwrite";
import { toast } from "react-toastify";

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const databases = new Databases(client);
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const ORDERS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_ORDERS_COLLECTION_ID;

// Get all orders with pagination and sorting
export const getAllOrders = async (limit = 100, offset = 0) => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      ORDERS_COLLECTION_ID,
      [Query.orderDesc("$createdAt"), Query.limit(limit), Query.offset(offset)]
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
        // Additional order details
        itemsTotal: parseFloat(order.itemsTotal || 0),
        deliveryCharge: parseFloat(order.deliveryCharge || 0),
        handlingCharge: parseFloat(order.handlingCharge || 0),
        paymentMethod: order.paymentMethod || "",
        orderDate: order.orderDate || order.$createdAt,
        totalItems: order.totalItems || orderItems.length,
      };
    });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    toast.error("Failed to fetch orders");
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
      itemsTotal: parseFloat(order.itemsTotal || 0),
      deliveryCharge: parseFloat(order.deliveryCharge || 0),
      handlingCharge: parseFloat(order.handlingCharge || 0),
      paymentMethod: order.paymentMethod || "",
      orderDate: order.orderDate || order.$createdAt,
      totalItems: order.totalItems || orderItems.length,
    };
  } catch (error) {
    console.error("Error fetching order:", error);
    toast.error("Failed to fetch order details");
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

// Search orders by multiple criteria
export const searchOrders = async (searchTerm) => {
  try {
    const allOrders = await getAllOrders(500); // Get more orders for search

    return allOrders.filter((order) => {
      const orderId = order.orderId.toLowerCase();
      const customerName = order.customer.toLowerCase();
      const customerEmail = order.customerEmail.toLowerCase();
      const customerPhone = order.customerPhone.toLowerCase();
      const search = searchTerm.toLowerCase();

      // Search in order items
      const itemsMatch = order.items.some((item) =>
        item.title.toLowerCase().includes(search)
      );

      return (
        orderId.includes(search) ||
        customerName.includes(search) ||
        customerEmail.includes(search) ||
        customerPhone.includes(search) ||
        itemsMatch
      );
    });
  } catch (error) {
    console.error("Error searching orders:", error);
    toast.error("Failed to search orders");
    throw error;
  }
};

// Filter orders by status
export const filterOrdersByStatus = async (status) => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      ORDERS_COLLECTION_ID,
      [
        Query.equal("orderStatus", status),
        Query.orderDesc("$createdAt"),
        Query.limit(100),
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
    console.error("Error filtering orders by status:", error);
    toast.error("Failed to filter orders");
    throw error;
  }
};

// Filter orders by payment status
export const filterOrdersByPaymentStatus = async (paymentStatus) => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      ORDERS_COLLECTION_ID,
      [
        Query.equal("paymentStatus", paymentStatus),
        Query.orderDesc("$createdAt"),
        Query.limit(100),
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
    console.error("Error filtering orders by payment status:", error);
    toast.error("Failed to filter orders");
    throw error;
  }
};

// Get orders statistics
export const getOrdersStats = async () => {
  try {
    const allOrders = await getAllOrders(1000);

    const stats = {
      totalOrders: allOrders.length,
      pendingOrders: allOrders.filter((order) => order.status === "pending")
        .length,
      processingOrders: allOrders.filter(
        (order) => order.status === "processing"
      ).length,
      shippedOrders: allOrders.filter((order) => order.status === "shipped")
        .length,
      completedOrders: allOrders.filter((order) => order.status === "completed")
        .length,
      totalRevenue: allOrders.reduce(
        (sum, order) => sum + order.totalAmount,
        0
      ),
      paidOrders: allOrders.filter((order) => order.paymentStatus === "paid")
        .length,
      pendingPayments: allOrders.filter(
        (order) => order.paymentStatus === "pending"
      ).length,
      failedPayments: allOrders.filter(
        (order) => order.paymentStatus === "failed"
      ).length,
    };

    return stats;
  } catch (error) {
    console.error("Error getting orders stats:", error);
    toast.error("Failed to fetch orders statistics");
    throw error;
  }
};

// Export orders data (for CSV/Excel export)
export const exportOrdersData = async () => {
  try {
    const allOrders = await getAllOrders(1000);

    return allOrders.map((order) => ({
      "Order ID": order.orderId,
      "Customer Name": order.customer,
      "Customer Email": order.customerEmail,
      "Customer Phone": order.customerPhone,
      "Total Amount": order.totalAmount,
      "Order Status": order.status,
      "Payment Status": order.paymentStatus,
      "Payment Method": order.paymentMethod,
      "Order Date": new Date(order.createdAt).toLocaleDateString(),
      "Items Count": order.items.length,
      "Shipping Address": `${order.shippingAddress.address}, ${order.shippingAddress.state}, ${order.shippingAddress.country}`,
    }));
  } catch (error) {
    console.error("Error exporting orders data:", error);
    toast.error("Failed to export orders data");
    throw error;
  }
};
