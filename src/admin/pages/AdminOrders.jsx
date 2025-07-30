// import React, { useState } from "react";
// import { Search, Eye, Package, Truck } from "lucide-react";

// const AdminOrders = () => {
//   const [searchTerm, setSearchTerm] = useState("");

//   const orders = [
//     {
//       id: "#12345",
//       customer: "John Doe",
//       email: "john@example.com",
//       product: "Sony WH-1000XM5",
//       amount: "$362",
//       status: "completed",
//       date: "2024-01-15",
//       paymentStatus: "paid",
//     },
//     {
//       id: "#12346",
//       customer: "Jane Smith",
//       email: "jane@example.com",
//       product: "Xbox Controller",
//       amount: "$57",
//       status: "pending",
//       date: "2024-01-14",
//       paymentStatus: "paid",
//     },
//     {
//       id: "#12347",
//       customer: "Mike Johnson",
//       email: "mike@example.com",
//       product: "Logitech G733",
//       amount: "$384",
//       status: "shipped",
//       date: "2024-01-13",
//       paymentStatus: "paid",
//     },
//     {
//       id: "#12348",
//       customer: "Sarah Wilson",
//       email: "sarah@example.com",
//       product: "boAt Rockerz 370",
//       amount: "$773",
//       status: "processing",
//       date: "2024-01-12",
//       paymentStatus: "pending",
//     },
//   ];

//   const filteredOrders = orders.filter(
//     (order) =>
//       order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       order.product.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const getStatusColor = () => {
//     switch (status) {
//       case "completed":
//         return "bg-green-100 text-green-800";
//       case "shipped":
//         return "bg-blue-100 text-blue-800";
//       case "processing":
//         return "bg-yellow-100 text-yellow-800";
//       case "pending":
//         return "bg-gray-100 text-gray-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   const getPaymentStatusColor = () => {
//     switch (status) {
//       case "paid":
//         return "bg-green-100 text-green-800";
//       case "pending":
//         return "bg-yellow-100 text-yellow-800";
//       case "failed":
//         return "bg-red-100 text-red-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   return (
//     <div className="p-4 lg:p-6 space-y-6">
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
//         <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
//         <div className="mt-4 sm:mt-0 flex space-x-2">
//           <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2">
//             <Package className="w-4 h-4" />
//             <span>Export Orders</span>
//           </button>
//         </div>
//       </div>

//       {/* Search and Filters */}
//       <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
//         <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
//           <div className="relative flex-1">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//             <input
//               type="text"
//               placeholder="Search orders..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
//             />
//           </div>
//           <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
//             <option>All Status</option>
//             <option>Pending</option>
//             <option>Processing</option>
//             <option>Shipped</option>
//             <option>Completed</option>
//           </select>
//           <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
//             <option>All Payments</option>
//             <option>Paid</option>
//             <option>Pending</option>
//             <option>Failed</option>
//           </select>
//         </div>
//       </div>

//       {/* Orders Table */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Order ID
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Customer
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Product
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Amount
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Payment
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Date
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filteredOrders.map((order) => (
//                 <tr key={order.id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                     {order.id}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div>
//                       <div className="text-sm font-medium text-gray-900">
//                         {order.customer}
//                       </div>
//                       <div className="text-sm text-gray-500">{order.email}</div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                     {order.product}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                     {order.amount}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span
//                       className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
//                         order.status
//                       )}`}
//                     >
//                       {order.status}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span
//                       className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(
//                         order.paymentStatus
//                       )}`}
//                     >
//                       {order.paymentStatus}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                     {order.date}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                     <div className="flex items-center space-x-2">
//                       <button className="text-blue-600 hover:text-blue-900 p-1">
//                         <Eye className="w-4 h-4" />
//                       </button>
//                       <button className="text-green-600 hover:text-green-900 p-1">
//                         <Truck className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminOrders;

import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, Eye, Package, Truck, ShoppingCart, AlertCircle } from "lucide-react";

import {
  selectFilters,
  fetchAllOrders,
  updateOrderStatusAsync,
  updatePaymentStatusAsync,
  searchOrdersAsync,
  filterOrdersByStatusAsync,
  filterOrdersByPaymentStatusAsync,
  exportOrdersAsync,
  selectOrders,
  selectOrdersLoading,
  selectOrdersError,
  updateFilters,
} from "../../features/adminfeatures/adminOrders/AdminOrderSlice";
import OrderDetailsModal from "../../models/OrderDetailsModal";

const AdminOrders = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const ordersLoading = useSelector(selectOrdersLoading);
  const ordersError = useSelector(selectOrdersError);
  const filters = useSelector(selectFilters);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [allOrdersCache, setAllOrdersCache] = useState([]);

  // Debounced search function
  const debounceSearch = useCallback((searchValue) => {
    const timeoutId = setTimeout(() => {
      handleSearchExecution(searchValue);
    }, 800); // 500ms delay

    return () => clearTimeout(timeoutId);
  }, []);

  // Load orders on component mount
  useEffect(() => {
    dispatch(fetchAllOrders()).then((result) => {
      if (result.payload) {
        setAllOrdersCache(result.payload);
      }
    });
  }, [dispatch]);

  // Handle search input with debouncing
  const handleSearch = (term) => {
    setSearchTerm(term);
    setIsSearching(true);
    
    if (term.trim()) {
      const cleanup = debounceSearch(term.trim());
      return cleanup;
    } else {
      // If search is empty, show all orders immediately
      dispatch(fetchAllOrders());
      setIsSearching(false);
    }
  };

  // Execute search
  const handleSearchExecution = async (term) => {
    try {
      await dispatch(searchOrdersAsync(term));
    } finally {
      setIsSearching(false);
    }
  };

  // Handle status filter
  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setSearchTerm(""); // Clear search when filtering
    
    if (status === "all") {
      dispatch(fetchAllOrders());
    } else {
      dispatch(filterOrdersByStatusAsync(status));
    }
  };

  // Handle payment filter
  const handlePaymentFilter = (paymentStatus) => {
    setPaymentFilter(paymentStatus);
    setSearchTerm(""); // Clear search when filtering
    
    if (paymentStatus === "all") {
      dispatch(fetchAllOrders());
    } else {
      dispatch(filterOrdersByPaymentStatusAsync(paymentStatus));
    }
  };

  // Handle status toggle
  const handleStatusToggle = (orderId, currentStatus) => {
    const statusFlow = {
      pending: "processing",
      processing: "shipped",
      shipped: "completed",
      completed: "pending",
    };
    const newStatus = statusFlow[currentStatus] || "pending";
    dispatch(updateOrderStatusAsync({ orderId, newStatus }));
  };

  // Handle payment status toggle
  const handlePaymentToggle = (orderId, currentPaymentStatus) => {
    const paymentFlow = {
      pending: "paid",
      paid: "failed",
      failed: "pending",
    };
    const newPaymentStatus = paymentFlow[currentPaymentStatus] || "pending";
    dispatch(updatePaymentStatusAsync({ orderId, newPaymentStatus }));
  };

  // Handle export
  const handleExport = () => {
    dispatch(exportOrdersAsync());
  };

  // Handle view order details
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  // Handle status update from modal
  const handleStatusUpdateFromModal = (orderId, newStatus) => {
    dispatch(updateOrderStatusAsync({ orderId, newStatus }));
  };

  // Handle payment status update from modal
  const handlePaymentStatusUpdateFromModal = (orderId, newPaymentStatus) => {
    dispatch(updatePaymentStatusAsync({ orderId, newPaymentStatus }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Empty state component for no orders
  const EmptyOrdersState = () => (
    <div className="text-center py-12">
      <ShoppingCart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
      <p className="text-gray-500 mb-6">
        When customers place orders, they will appear here.
      </p>
      <button
        onClick={() => dispatch(fetchAllOrders())}
        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
      >
        Refresh Orders
      </button>
    </div>
  );

  // Empty state component for no search results
  const NoSearchResultsState = () => (
    <div className="text-center py-12">
      <AlertCircle className="mx-auto h-16 w-16 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
      <p className="text-gray-500 mb-6">
        No orders match your search criteria for "{searchTerm || statusFilter || paymentFilter}".
      </p>
      <button
        onClick={() => {
          setSearchTerm("");
          setStatusFilter("all")
          setPaymentFilter("all")
          dispatch(fetchAllOrders());
        }}
        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
      >
        Clear Search
      </button>
    </div>
  );

  // Loading state
  if (ordersLoading && !isSearching) {
    return (
      <div className="p-4 lg:p-6 space-y-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (ordersError) {
    return (
      <div className="p-4 lg:p-6 space-y-6">
        <div className="text-center py-12">
          <AlertCircle className="mx-auto h-16 w-16 text-red-400 mb-4" />
          <h3 className="text-lg font-medium text-red-900 mb-2">Error loading orders</h3>
          <p className="text-red-600 mb-6">{ordersError}</p>
          <button
            onClick={() => dispatch(fetchAllOrders())}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <div className="mt-4 sm:mt-0 flex space-x-2">
          <button
            onClick={handleExport}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
          >
            <Package className="w-4 h-4" />
            <span>Export Orders</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
              </div>
            )}
          </div>
          <select
            value={statusFilter}
            onChange={(e) => handleStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="completed">Completed</option>
          </select>
          <select
            value={paymentFilter}
            onChange={(e) => handlePaymentFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="all">All Payments</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Orders Table or Empty States */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {orders && orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.orderId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.customer}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.customerEmail}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {order.items && order.items.length > 0
                        ? `${order.items[0].title}${
                            order.items.length > 1
                              ? ` +${order.items.length - 1} more`
                              : ""
                          }`
                        : "No items"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${order.totalAmount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleStatusToggle(order.id, order.status)}
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full cursor-pointer hover:opacity-80 transition-opacity ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() =>
                          handlePaymentToggle(order.id, order.paymentStatus)
                        }
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full cursor-pointer hover:opacity-80 transition-opacity ${getPaymentStatusColor(
                          order.paymentStatus
                        )}`}
                      >
                        {order.paymentStatus}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewOrder(order)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          // Show appropriate empty state
          searchTerm || statusFilter || paymentFilter ? <NoSearchResultsState /> : <EmptyOrdersState />
        )}
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        order={selectedOrder}
        onStatusUpdate={handleStatusUpdateFromModal}
        onPaymentStatusUpdate={handlePaymentStatusUpdateFromModal}
      />
    </div>
  );
};

export default AdminOrders;