// import { useState } from "react";
// import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";

// const AdminProducts = () => {
//   const [searchTerm, setSearchTerm] = useState("");

//   const products = [
//     {
//       id: 1,
//       name: "Sony WH-1000XM5 Bluetooth Wireless Noise Canceling Headphones",
//       category: "Audio",
//       price: "$362",
//       stock: 45,
//       status: "active",
//       image:
//         "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=100",
//     },
//     {
//       id: 2,
//       name: "Microsoft Xbox X/S Wireless Controller",
//       category: "Gaming",
//       price: "$57",
//       stock: 23,
//       status: "active",
//       image:
//         "https://images.pexels.com/photos/275033/pexels-photo-275033.jpeg?auto=compress&cs=tinysrgb&w=100",
//     },
//     {
//       id: 3,
//       name: "Logitech G733 Lightspeed Wireless Gaming Headset",
//       category: "Gaming",
//       price: "$384",
//       stock: 12,
//       status: "low_stock",
//       image:
//         "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=100",
//     },
//     {
//       id: 4,
//       name: "Samsung Galaxy S21 FE 5G",
//       category: "Mobile",
//       price: "$773",
//       stock: 0,
//       status: "out_of_stock",
//       image:
//         "https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=100",
//     },
//   ];

//   const filteredProducts = products.filter(
//     (product) =>
//       product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       product.category.toLowerCase().includes(searchTerm.toLowerCase())
//   );
//   return (
//     <div className="p-4 lg:p-6 space-y-6">
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
//         <h1 className="text-2xl font-bold text-gray-900">Products</h1>
//         <button className="mt-4 sm:mt-0 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2">
//           <Plus className="w-4 h-4" />
//           <span>Add Product</span>
//         </button>
//       </div>

//       {/* Search and Filters */}
//       <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
//         <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
//           <div className="relative flex-1">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//             <input
//               type="text"
//               placeholder="Search products..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
//             />
//           </div>
//           <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
//             <option>All Categories</option>
//             <option>Audio</option>
//             <option>Gaming</option>
//             <option>Mobile</option>
//             <option>TV</option>
//             <option>Laptop</option>
//           </select>
//           <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
//             <option>All Status</option>
//             <option>Active</option>
//             <option>Low Stock</option>
//             <option>Out of Stock</option>
//           </select>
//         </div>
//       </div>

//       {/* Products Table */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Product
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Category
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Price
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Stock
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filteredProducts.map((product) => (
//                 <tr key={product.id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center">
//                       <img
//                         className="h-10 w-10 rounded-lg object-cover"
//                         src={product.image}
//                         alt={product.name}
//                       />
//                       <div className="ml-4">
//                         <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
//                           {product.name}
//                         </div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                     {product.category}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                     {product.price}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                     {product.stock}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span
//                       className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                         product.status === "active"
//                           ? "bg-green-100 text-green-800"
//                           : product.status === "low_stock"
//                           ? "bg-yellow-100 text-yellow-800"
//                           : "bg-red-100 text-red-800"
//                       }`}
//                     >
//                       {product.status.replace("_", " ")}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                     <div className="flex items-center space-x-2">
//                       <button className="text-blue-600 hover:text-blue-900 p-1">
//                         <Eye className="w-4 h-4" />
//                       </button>
//                       <button className="text-gray-600 hover:text-gray-900 p-1">
//                         <Edit className="w-4 h-4" />
//                       </button>
//                       <button className="text-red-600 hover:text-red-900 p-1">
//                         <Trash2 className="w-4 h-4" />
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

// export default AdminProducts;


import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  selectProducts,
  fetchProducts,
  searchProducts,
  filterProductsByCategory,
  filterProductsByStatus,
  setCurrentPage,
  setFilters,
  clearFilters,
  selectPagination,
  selectFilters,
  selectLoading,
  selectError,
  selectSearchResults,
  selectFilteredProducts,
} from "../../features/adminfeatures/adminProducts/AdminProductSlice";
import AddProductModal from "../../models/AddProductModal";
import ViewProductModal from "../../models/ViewProductModal";
import EditProductModal from "../../models/EditProductModal";
import DeleteProductModal from "../../models/DeleteProductModal";

const AdminProducts = () => {
  const dispatch = useDispatch();

  // Redux state
  const products = useSelector(selectProducts);
  const pagination = useSelector(selectPagination);
  const filters = useSelector(selectFilters);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const searchResults = useSelector(selectSearchResults);
  const filteredProducts = useSelector(selectFilteredProducts);

  // Local state for modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Local state for filters
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const categories = [
    "Audio",
    "Gaming",
    "Mobile",
    "TV",
    "Laptop",
    "Accessories",
    "Smart Home",
    "Wearables",
  ];

  // Load products on component mount and when pagination changes
  useEffect(() => {
    const offset = (pagination.currentPage - 1) * pagination.itemsPerPage;
    dispatch(fetchProducts({ limit: pagination.itemsPerPage, offset }));
  }, [dispatch, pagination.currentPage, pagination.itemsPerPage]);

  // Handle search
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchTerm.trim()) {
        dispatch(searchProducts(searchTerm));
      }
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, dispatch]);

  // Handle category filter
  useEffect(() => {
    if (categoryFilter !== "all") {
      dispatch(filterProductsByCategory(categoryFilter));
    }
  }, [categoryFilter, dispatch]);

  // Handle status filter
  useEffect(() => {
    if (statusFilter !== "all") {
      dispatch(filterProductsByStatus(statusFilter));
    }
  }, [statusFilter, dispatch]);

  // Get current products to display based on active filters
  const getCurrentProducts = () => {
    if (searchTerm.trim()) {
      return searchResults;
    }
    if (categoryFilter !== "all" || statusFilter !== "all") {
      return filteredProducts;
    }
    return products;
  };

  const currentProducts = getCurrentProducts();

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (!value.trim()) {
      // Reset to regular products when search is cleared
      const offset = (pagination.currentPage - 1) * pagination.itemsPerPage;
      dispatch(fetchProducts({ limit: pagination.itemsPerPage, offset }));
    }
  };

  // Handle category filter change
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setCategoryFilter(value);
    setSearchTerm(""); // Clear search when filtering

    if (value === "all") {
      // Reset to regular products
      const offset = (pagination.currentPage - 1) * pagination.itemsPerPage;
      dispatch(fetchProducts({ limit: pagination.itemsPerPage, offset }));
    }
  };

  // Handle status filter change
  const handleStatusChange = (e) => {
    const value = e.target.value;
    setStatusFilter(value);
    setSearchTerm(""); // Clear search when filtering

    if (value === "all") {
      // Reset to regular products
      const offset = (pagination.currentPage - 1) * pagination.itemsPerPage;
      dispatch(fetchProducts({ limit: pagination.itemsPerPage, offset }));
    }
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setStatusFilter("all");
    dispatch(clearFilters());
    const offset = (pagination.currentPage - 1) * pagination.itemsPerPage;
    dispatch(fetchProducts({ limit: pagination.itemsPerPage, offset }));
  };

  // Pagination handlers
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      dispatch(setCurrentPage(newPage));
    }
  };

  // Modal handlers
  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setShowViewModal(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleDeleteProduct = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  // Get status styling
  const getStatusStyle = (status, stock) => {
    if (stock === 0) {
      return "bg-red-100 text-red-800";
    }
    if (stock <= 10) {
      return "bg-yellow-100 text-yellow-800";
    }
    if (status === "active") {
      return "bg-green-100 text-green-800";
    }
    return "bg-gray-100 text-gray-800";
  };

  // Get status text
  const getStatusText = (status, stock) => {
    if (stock === 0) return "Out of Stock";
    if (stock <= 10) return "Low Stock";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="mt-4 sm:mt-0 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={handleCategoryChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {/* <select
            value={statusFilter}
            onChange={handleStatusChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="draft">Draft</option>
          </select> */}

          {(searchTerm ||
            categoryFilter !== "all" ||
            statusFilter !== "all") && (
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading.fetch ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex justify-center">
                      <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="mt-2 text-gray-500">Loading products...</p>
                  </td>
                </tr>
              ) : currentProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    {searchTerm ||
                    categoryFilter !== "all" ||
                    statusFilter !== "all"
                      ? "No products found matching your criteria"
                      : "No products available"}
                  </td>
                </tr>
              ) : (
                currentProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          className="h-10 w-10 rounded-lg object-cover"
                          src={product.image || "/api/placeholder/40/40"}
                          alt={product.title}
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                            {product.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {product.brand}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatPrice(product.price)}
                      {product.discount > 0 && (
                        <div className="text-xs text-green-600">
                          -{product.discount}%
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {product.stock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusStyle(
                          product.status,
                          product.stock
                        )}`}
                      >
                        {getStatusText(product.status, product.stock)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewProduct(product)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="text-gray-600 hover:text-gray-900 p-1"
                          title="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {!loading.fetch &&
        currentProducts.length > 0 &&
        !searchTerm &&
        categoryFilter === "all" &&
        statusFilter === "all" && (
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>

              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">
                      {(pagination.currentPage - 1) * pagination.itemsPerPage +
                        1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(
                        pagination.currentPage * pagination.itemsPerPage,
                        pagination.totalItems
                      )}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">{pagination.totalItems}</span>{" "}
                    results
                  </p>
                </div>

                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() =>
                        handlePageChange(pagination.currentPage - 1)
                      }
                      disabled={pagination.currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>

                    {/* Page Numbers */}
                    {[...Array(Math.min(5, pagination.totalPages))].map(
                      (_, index) => {
                        let pageNumber;
                        if (pagination.totalPages <= 5) {
                          pageNumber = index + 1;
                        } else if (pagination.currentPage <= 3) {
                          pageNumber = index + 1;
                        } else if (
                          pagination.currentPage >=
                          pagination.totalPages - 2
                        ) {
                          pageNumber = pagination.totalPages - 4 + index;
                        } else {
                          pageNumber = pagination.currentPage - 2 + index;
                        }

                        return (
                          <button
                            key={pageNumber}
                            onClick={() => handlePageChange(pageNumber)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              pageNumber === pagination.currentPage
                                ? "z-10 bg-red-50 border-red-500 text-red-600"
                                : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      }
                    )}

                    <button
                      onClick={() =>
                        handlePageChange(pagination.currentPage + 1)
                      }
                      disabled={
                        pagination.currentPage === pagination.totalPages
                      }
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Modals */}
      <AddProductModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />

      <ViewProductModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        product={selectedProduct}
      />

      <EditProductModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        product={selectedProduct}
      />

      <DeleteProductModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        product={selectedProduct}
      />
    </div>
  );
};

export default AdminProducts;
