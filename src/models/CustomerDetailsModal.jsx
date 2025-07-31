import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X, Package, Calendar, CreditCard, MapPin, Phone } from "lucide-react";
import {
  selectIsCustomerModalOpen,
  closeCustomerModal,
  selectCustomersLoading,
  fetchCustomerByUserId,
  selectSelectedCustomer,
} from "../features/adminfeatures/adminCustomer/AdminCustomerSlice";

const CustomerDetailsModal = ({ userId }) => {
  const dispatch = useDispatch();
  const customer = useSelector(selectSelectedCustomer);
  const isOpen = useSelector(selectIsCustomerModalOpen);
  const customerDetailsLoading = useSelector(selectCustomersLoading);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        dispatch(closeCustomerModal());
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, dispatch]);

  // Fetch customer details when userId changes and modal is open
  useEffect(() => {
    if (isOpen && userId && (!customer || customer.userId !== userId)) {
      dispatch(fetchCustomerByUserId(userId));
    }
  }, [isOpen, userId, customer, dispatch]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      dispatch(closeCustomerModal());
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
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
    switch (status?.toLowerCase()) {
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

  // Show loading state
  if (customerDetailsLoading || !customer) {
    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleBackdropClick}
      >
        <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              Customer Details
            </h2>
            <button
              onClick={() => dispatch(closeCustomerModal())}
              className="text-gray-400 hover:text-gray-600 p-2"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="p-6 flex items-center justify-center h-64">
            <div className="text-gray-500">Loading customer details...</div>
          </div>
        </div>
      </div>
    );
  }

  // Safe accessors with fallbacks
  const customerName = customer.name || "Unknown Customer";
  const customerEmail = customer.email || "No email";
  const customerPhone = customer.phone || "No phone";
  const totalOrders = customer.totalOrders || customer.orders?.length || 0;
  const totalSpent = customer.totalSpent || 0;
  const joinedDate = customer.joinedDate || customer.joinDate || new Date();
  const addresses = customer.addresses || [];
  const orders = customer.orders || [];

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                {customerName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {customerName}
              </h2>
              <p className="text-gray-600">{customerEmail}</p>
            </div>
          </div>
          <button
            onClick={() => dispatch(closeCustomerModal())}
            className="text-gray-400 hover:text-gray-600 p-2"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Customer Info Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Package className="w-5 h-5 text-gray-600" />
                <span className="font-semibold text-gray-900">
                  Total Orders
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <CreditCard className="w-5 h-5 text-gray-600" />
                <span className="font-semibold text-gray-900">Total Spent</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                $
                {typeof totalSpent === "number"
                  ? totalSpent.toFixed(2)
                  : "0.00"}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="w-5 h-5 text-gray-600" />
                <span className="font-semibold text-gray-900">
                  Customer Since
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {new Date(joinedDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-600" />
                <span className="text-gray-900">{customerPhone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-600" />
                <span className="text-gray-900">
                  {addresses.length} Address
                  {addresses.length !== 1 ? "es" : ""}
                </span>
              </div>
            </div>
          </div>

          {/* Addresses */}
          {addresses.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Shipping Addresses
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((address, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <p className="font-medium text-gray-900">
                      Address {index + 1}
                    </p>
                    <p className="text-gray-600 text-sm mt-1">
                      {address.full || address.address || "No address provided"}
                    </p>
                    <p className="text-gray-600 text-sm">
                      Phone: {address.phone || "No phone"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Orders Table */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Order History
            </h3>
            {orders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                        Order ID
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                        Items
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                        Payment
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                        Address
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr
                        key={order.id || order.orderId}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {order.orderId || order.id || "N/A"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {order.totalItems || order.items?.length || 0} items
                          {order.items && order.items.length > 0 && (
                            <div className="text-xs text-gray-500 mt-1">
                              {order.items.slice(0, 2).map((item, idx) => (
                                <div key={idx}>
                                  {item.title || item.name || "Item"}
                                </div>
                              ))}
                              {order.items.length > 2 && (
                                <div>+{order.items.length - 2} more</div>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          ${(order.totalAmount || 0).toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status || "Unknown"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(
                              order.paymentStatus
                            )}`}
                          >
                            {order.paymentStatus || "Unknown"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          <div className="max-w-xs truncate">
                            {order.shippingAddress
                              ? `${order.shippingAddress.address || ""}, ${
                                  order.shippingAddress.state || ""
                                }`
                              : "No address"}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No orders found for this customer
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailsModal;
