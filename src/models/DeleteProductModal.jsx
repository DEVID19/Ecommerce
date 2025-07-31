import { AlertTriangle, X, Package } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import {
  deleteProduct,
  selectLoading,
} from "../features/adminfeatures/adminProducts/AdminProductSlice";

const DeleteProductModal = ({ isOpen, onClose, product }) => {
  const dispatch = useDispatch();
  const { delete: isLoading } = useSelector(selectLoading);

  const handleDelete = async () => {
    try {
      await dispatch(deleteProduct(product.id)).unwrap();
      onClose();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  if (!isOpen || !product) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              Delete Product
            </h2>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this product? This action cannot
              be undone.
            </p>

            {/* Product Summary */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-300 rounded-lg flex items-center justify-center">
                      <Package className="w-8 h-8 text-gray-500" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {product.title}
                  </h3>
                  <div className="mt-1 space-y-1">
                    <p className="text-xs text-gray-500">
                      Category:{" "}
                      <span className="font-medium">{product.category}</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      Brand:{" "}
                      <span className="font-medium">{product.brand}</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      Price:{" "}
                      <span className="font-medium">
                        {formatPrice(product.price)}
                      </span>
                    </p>
                    <p className="text-xs text-gray-500">
                      Stock:{" "}
                      <span className="font-medium">{product.stock} units</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Warning Message */}
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-red-700">
                  <p className="font-medium">Warning:</p>
                  <ul className="mt-1 space-y-1 list-disc list-inside">
                    <li>
                      This will permanently delete the product from your
                      inventory
                    </li>
                    <li>Any associated images will also be removed</li>
                    <li>This action cannot be reversed</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
            >
              {isLoading && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              <span>{isLoading ? "Deleting..." : "Confirm Delete"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteProductModal;
