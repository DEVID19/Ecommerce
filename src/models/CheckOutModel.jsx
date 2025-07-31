import React, { useState } from "react";
import { X, CreditCard, Wallet, Smartphone } from "lucide-react";
import { LuNotebookText } from "react-icons/lu";
import { MdDeliveryDining } from "react-icons/md";
import { GiShoppingBag } from "react-icons/gi";
import { saveOrderToAppwrite } from "../api/orderServices";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../features/cart/cartSlice";
import { toast } from "react-toastify";

const CheckoutModal = ({
  isOpen,
  onClose,
  cartItems,
  totalPrice,
  location,
}) => {
  const { user } = useSelector((state) => state.auth);

  const [deliveryInfo, setDeliveryInfo] = useState({
    fullName: "",
    email: "",
    address: location?.country || "",
    state: location?.state || "",
    postcode: location?.postcode || "",
    country: location?.country || "",
    phoneNumber: "",
  });

  const [selectedPayment, setSelectedPayment] = useState("card");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeliveryInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleConfirmOrder = async () => {
    if (
      !deliveryInfo.fullName ||
      !deliveryInfo.email ||
      !deliveryInfo.address ||
      !deliveryInfo.phoneNumber
    ) {
      toast.error("🚫 Please fill out all required fields before proceeding.", {
        position: "top-center",
        className:
          "text-[15px] font-semibold px-4 py-3 rounded-lg shadow-md bg-white text-black h-25   ",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare order data for Appwrite
      const orderData = {
        userId: user?.$id, // ✅ Add this line
        customerInfo: deliveryInfo,
        items: cartItems.map((item) => ({
          id: item.$id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        orderSummary: {
          itemsTotal: totalPrice,
          deliveryCharge: 0,
          handlingCharge: 5,
          grandTotal: totalPrice + 5,
        },
        paymentMethod: selectedPayment,
        orderStatus: "pending",
        paymentStatus: "pending",
        orderDate: new Date().toISOString(),
      };

      console.log("Order Data to be sent to Appwrite:", orderData);
      dispatch(clearCart());
      // Save order to Appwrite
      await saveOrderToAppwrite(orderData);

      toast.success(
        "Your order has been placed! Thanks for shopping with us. 🎉",
        {
          position: "top-center",
          className:
            "text-[15px] font-semibold px-4 py-3 rounded-lg shadow-md bg-white text-black h-25",
        }
      );
      onClose();
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-6xl mx-4 max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">Checkout</h1>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Delivery Info & Payment */}
            <div className="space-y-4">
              {/* Delivery Information */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Delivery Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={deliveryInfo.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={deliveryInfo.email}
                      onChange={handleInputChange}
                      placeholder="Enter your Email"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={deliveryInfo.address}
                      onChange={handleInputChange}
                      placeholder="Enter your address"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={deliveryInfo.state}
                        onChange={handleInputChange}
                        placeholder="Enter state"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Postcode
                      </label>
                      <input
                        type="text"
                        name="postcode"
                        value={deliveryInfo.postcode}
                        onChange={handleInputChange}
                        placeholder="Enter postcode"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={deliveryInfo.country}
                        onChange={handleInputChange}
                        placeholder="Enter country"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={deliveryInfo.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="Enter phone number"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Options */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Payment Method
                </h2>
                <div className="space-y-3">
                  <div
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedPayment === "card"
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    onClick={() => setSelectedPayment("card")}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={selectedPayment === "card"}
                        onChange={() => setSelectedPayment("card")}
                        className="text-red-500 focus:ring-red-500"
                      />
                      <CreditCard className="w-5 h-5 text-gray-600" />
                      <span className="font-medium">Credit/Debit Card</span>
                    </div>
                  </div>

                  <div
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedPayment === "wallet"
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    onClick={() => setSelectedPayment("wallet")}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={selectedPayment === "wallet"}
                        onChange={() => setSelectedPayment("wallet")}
                        className="text-red-500 focus:ring-red-500"
                      />
                      <Wallet className="w-5 h-5 text-gray-600" />
                      <span className="font-medium">Digital Wallet</span>
                    </div>
                  </div>

                  <div
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedPayment === "upi"
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    onClick={() => setSelectedPayment("upi")}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={selectedPayment === "upi"}
                        onChange={() => setSelectedPayment("upi")}
                        className="text-red-500 focus:ring-red-500"
                      />
                      <Smartphone className="w-5 h-5 text-gray-600" />
                      <span className="font-medium">UPI Payment</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Order Summary
                </h2>

                {/* Items */}
                <div className="space-y-3 mb-6">
                  {cartItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 text-sm"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 line-clamp-1">
                          {item.title}
                        </p>
                        <p className="text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-red-500">
                        ${item.price * item.quantity}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Bill Details */}
                <div className="space-y-3 border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 text-gray-700">
                      <LuNotebookText className="w-4 h-4" />
                      Items total
                    </span>
                    <span className="font-semibold">${totalPrice}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 text-gray-700">
                      <MdDeliveryDining className="w-4 h-4" />
                      Delivery Charge
                    </span>
                    <span className="text-red-500 font-semibold">
                      <span className="text-gray-400 line-through text-sm">
                        $25
                      </span>{" "}
                      FREE
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 text-gray-700">
                      <GiShoppingBag className="w-4 h-4" />
                      Handling Charge
                    </span>
                    <span className="font-semibold text-red-500">$5</span>
                  </div>

                  <hr className="my-4" />

                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Grand Total</span>
                    <span className="text-red-500">${totalPrice + 5}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="border-t border-gray-200 p-6 ">
          <div className="flex justify-end space-x-4 ">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmOrder}
              disabled={isSubmitting}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Processing..." : "Confirm Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
