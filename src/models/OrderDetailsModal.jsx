import React from "react";
import { X, Package, User, Phone, Mail, MapPin } from "lucide-react";

const OrderDetailsModal = ({
  isOpen,
  onClose,
  order,
  onStatusUpdate,
  onPaymentStatusUpdate,
}) => {
  if (!isOpen || !order) return null;

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

  const handleStatusToggle = () => {
    const statusFlow = {
      pending: "processing",
      processing: "shipped",
      shipped: "completed",
      completed: "pending",
    };
    const newStatus = statusFlow[order.status] || "pending";
    onStatusUpdate(order.id, newStatus);
  };

  const handlePaymentToggle = () => {
    const paymentFlow = {
      pending: "paid",
      paid: "failed",
      failed: "pending",
    };
    const newPaymentStatus = paymentFlow[order.paymentStatus] || "pending";
    onPaymentStatusUpdate(order.id, newPaymentStatus);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Order Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Package className="w-5 h-5 text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Order Information
                </h3>
              </div>
              <div className="space-y-2">
                <p>
                  <span className="font-medium text-gray-600">Order ID:</span>{" "}
                  {order.orderId}
                </p>
                <p>
                  <span className="font-medium text-gray-600">Order Date:</span>{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-medium text-gray-600">
                    Payment Method:
                  </span>{" "}
                  {order.paymentMethod || "N/A"}
                </p>
                <p>
                  <span className="font-medium text-gray-600">
                    Total Items:
                  </span>{" "}
                  {order.totalItems || order.items?.length || 0}
                </p>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-600">Status:</span>
                  <button
                    onClick={handleStatusToggle}
                    className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full cursor-pointer hover:opacity-80 transition-opacity ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-600">
                    Payment Status:
                  </span>
                  <button
                    onClick={handlePaymentToggle}
                    className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full cursor-pointer hover:opacity-80 transition-opacity ${getPaymentStatusColor(
                      order.paymentStatus
                    )}`}
                  >
                    {order.paymentStatus}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Customer Information
                </h3>
              </div>
              <div className="space-y-2">
                <p>
                  <span className="font-medium text-gray-600">Name:</span>{" "}
                  {order.customer}
                </p>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span>{order.customerEmail}</span>
                </div>
                {order.customerPhone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{order.customerPhone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Shipping Address
                </h3>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                {order.shippingAddress.address && (
                  <p>{order.shippingAddress.address}</p>
                )}
                <p>
                  {order.shippingAddress.state &&
                    `${order.shippingAddress.state}, `}
                  {order.shippingAddress.postcode}
                </p>
                {order.shippingAddress.country && (
                  <p>{order.shippingAddress.country}</p>
                )}
              </div>
            </div>
          )}

          {/* Order Items */}
          {order.items && order.items.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Order Items
              </h3>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {item.title || item.name || "Product"}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity || 1}
                      </p>
                      {item.size && (
                        <p className="text-sm text-gray-600">
                          Size: {item.size}
                        </p>
                      )}
                      {item.color && (
                        <p className="text-sm text-gray-600">
                          Color: {item.color}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        ${item.price || item.salePrice || 0}
                      </p>
                      <p className="text-sm text-gray-600">
                        Total: $
                        {(
                          (item.price || item.salePrice || 0) *
                          (item.quantity || 1)
                        ).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Order Summary */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Items Total:</span>
              <span className="font-medium">${order.itemsTotal || 0}</span>
            </div>
            {order.deliveryCharge > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Charge:</span>
                <span className="font-medium">${order.deliveryCharge}</span>
              </div>
            )}
            {order.handlingCharge > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Handling Charge:</span>
                <span className="font-medium">${order.handlingCharge}</span>
              </div>
            )}
            <div className="border-t border-gray-200 pt-2">
              <div className="flex justify-between">
                <span className="text-lg font-semibold text-gray-900">
                  Grand Total:
                </span>
                <span className="text-lg font-bold text-red-600">
                  ${order.totalAmount}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end space-x-4 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
          <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
            Print Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
