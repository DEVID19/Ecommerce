import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  Phone,
  MapPin,
  CreditCard,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
} from "lucide-react";

// Import the real getUserOrders function from orderServices
import { getUserOrders } from "../api/orderServices";

const Orders = () => {
  const { user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchOrders = async () => {
      if (user?.$id) {
        try {
          setLoading(true);
          const userOrders = await getUserOrders(user.$id);
          setOrders(userOrders);
        } catch (error) {
          console.error("Error fetching orders:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOrders();
  }, [user]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "shipped":
        return <Package className="w-5 h-5 text-blue-500" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "cancelled":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case "card":
        return <CreditCard className="w-4 h-4" />;
      case "upi":
        return <Phone className="w-4 h-4" />;
      case "wallet":
        return <Package className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.$id.slice(-5).toUpperCase().includes(searchTerm.toUpperCase());
    const matchesStatus =
      statusFilter === "all" || order.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by order ID or customer name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No orders found
            </h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "You haven't placed any orders yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const orderItems = JSON.parse(order.orderItems);
              const isExpanded = expandedOrder === order.$id;

              return (
                <div
                  key={order.$id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200"
                >
                  {/* Order Header */}
                  <div
                    className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() =>
                      setExpandedOrder(isExpanded ? null : order.$id)
                    }
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Order #{order.$id.slice(-5).toUpperCase()}
                          </h3>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-sm text-gray-600 flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {formatDate(order.orderDate)}
                            </span>
                            <span className="text-sm text-gray-600">
                              {orderItems.length} item
                              {orderItems.length > 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-xl font-bold text-gray-900">
                            ${order.grandTotal}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                                order.orderStatus
                              )}`}
                            >
                              {getStatusIcon(order.orderStatus)}
                              <span className="ml-1 capitalize">
                                {order.orderStatus}
                              </span>
                            </span>
                          </div>
                        </div>

                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Order Details */}
                  {isExpanded && (
                    <div className="border-t border-gray-200">
                      <div className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          {/* Order Items */}
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">
                              Order Items
                            </h4>
                            <div className="space-y-4">
                              {orderItems.map((item, index) => (
                                <div
                                  key={index}
                                  className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                                >
                                  <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-16 h-16 rounded-lg object-cover"
                                  />
                                  <div className="flex-1">
                                    <h5 className="font-medium text-gray-900 line-clamp-2">
                                      {item.title}
                                    </h5>
                                    <div className="flex items-center justify-between mt-2">
                                      <span className="text-sm text-gray-600">
                                        Qty: {item.quantity}
                                      </span>
                                      <span className="font-semibold text-red-500">
                                        ${item.price * item.quantity}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Order Details */}
                          <div className="space-y-6">
                            {/* Delivery Information */}
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                                Delivery Information
                              </h4>
                              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                <div className="flex items-start space-x-3">
                                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                  <div>
                                    <p className="font-medium text-gray-900">
                                      {order.customerName}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {order.customerAddress}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {order.customerState},{" "}
                                      {order.customerCountry}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <Phone className="w-5 h-5 text-gray-400" />
                                  <span className="text-sm text-gray-600">
                                    {order.customerPhone}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Payment & Billing */}
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                                Payment & Billing
                              </h4>
                              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-600">
                                    Items Total
                                  </span>
                                  <span className="font-medium">
                                    ${order.itemsTotal}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-600">
                                    Delivery Charge
                                  </span>
                                  <span className="font-medium text-red-500">
                                    {order.deliveryCharge === 0
                                      ? "FREE"
                                      : `$${order.deliveryCharge}`}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-600">
                                    Handling Charge
                                  </span>
                                  <span className="font-medium">
                                    ${order.handlingCharge}
                                  </span>
                                </div>
                                <hr className="my-2" />
                                <div className="flex items-center justify-between">
                                  <span className="font-semibold text-gray-900">
                                    Grand Total
                                  </span>
                                  <span className="font-bold text-lg text-red-500">
                                    ${order.grandTotal}
                                  </span>
                                </div>

                                <div className="mt-4 pt-3 border-t border-gray-200">
                                  <div className="flex items-center space-x-3">
                                    {getPaymentMethodIcon(order.paymentMethod)}
                                    <span className="text-sm text-gray-600 capitalize">
                                      {order.paymentMethod === "card"
                                        ? "Credit/Debit Card"
                                        : order.paymentMethod === "upi"
                                        ? "UPI Payment"
                                        : "Digital Wallet"}
                                    </span>
                                    <span
                                      className={`ml-auto px-2 py-1 rounded-full text-xs font-medium ${
                                        order.paymentStatus === "completed"
                                          ? "bg-green-100 text-green-800"
                                          : "bg-yellow-100 text-yellow-800"
                                      }`}
                                    >
                                      {order.paymentStatus === "completed"
                                        ? "Paid"
                                        : "Pending"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
