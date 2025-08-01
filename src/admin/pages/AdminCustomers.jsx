// import { useState } from "react";
// import { Search, Eye, Mail, Phone, MapPin } from "lucide-react";

// const AdminCustomers = () => {
//   const [searchTerm, setSearchTerm] = useState("");

//   const customers = [
//     {
//       id: 1,
//       name: "John Doe",
//       email: "john@example.com",
//       phone: "+1 (555) 123-4567",
//       location: "New York, USA",
//       orders: 12,
//       totalSpent: "$2,450",
//       joinDate: "2023-08-15",
//       status: "active",
//     },
//     {
//       id: 2,
//       name: "Jane Smith",
//       email: "jane@example.com",
//       phone: "+1 (555) 987-6543",
//       location: "California, USA",
//       orders: 8,
//       totalSpent: "$1,680",
//       joinDate: "2023-09-22",
//       status: "active",
//     },
//     {
//       id: 3,
//       name: "Mike Johnson",
//       email: "mike@example.com",
//       phone: "+1 (555) 456-7890",
//       location: "Texas, USA",
//       orders: 15,
//       totalSpent: "$3,200",
//       joinDate: "2023-07-10",
//       status: "active",
//     },
//     {
//       id: 4,
//       name: "Sarah Wilson",
//       email: "sarah@example.com",
//       phone: "+1 (555) 321-0987",
//       location: "Florida, USA",
//       orders: 3,
//       totalSpent: "$450",
//       joinDate: "2024-01-05",
//       status: "inactive",
//     },
//   ];

//   const filteredCustomers = customers.filter(
//     (customer) =>
//       customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       customer.location.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="p-4 lg:p-6 space-y-6">
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
//         <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
//         <div className="mt-4 sm:mt-0 flex space-x-2">
//           <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2">
//             <Mail className="w-4 h-4" />
//             <span>Send Newsletter</span>
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
//               placeholder="Search customers..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
//             />
//           </div>
//           <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
//             <option>All Status</option>
//             <option>Active</option>
//             <option>Inactive</option>
//           </select>
//           <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
//             <option>All Locations</option>
//             <option>New York</option>
//             <option>California</option>
//             <option>Texas</option>
//             <option>Florida</option>
//           </select>
//         </div>
//       </div>

//       {/* Customers Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filteredCustomers.map((customer) => (
//           <div
//             key={customer.id}
//             className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
//           >
//             <div className="flex items-center justify-between mb-4">
//               <div className="flex items-center space-x-3">
//                 <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
//                   <span className="text-white font-semibold text-lg">
//                     {customer.name
//                       .split(" ")
//                       .map((n) => n[0])
//                       .join("")}
//                   </span>
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-gray-900">
//                     {customer.name}
//                   </h3>
//                   <span
//                     className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                       customer.status === "active"
//                         ? "bg-green-100 text-green-800"
//                         : "bg-gray-100 text-gray-800"
//                     }`}
//                   >
//                     {customer.status}
//                   </span>
//                 </div>
//               </div>
//               <button className="text-blue-600 hover:text-blue-900 p-1">
//                 <Eye className="w-4 h-4" />
//               </button>
//             </div>

//             <div className="space-y-3">
//               <div className="flex items-center space-x-2 text-sm text-gray-600">
//                 <Mail className="w-4 h-4" />
//                 <span>{customer.email}</span>
//               </div>
//               <div className="flex items-center space-x-2 text-sm text-gray-600">
//                 <Phone className="w-4 h-4" />
//                 <span>{customer.phone}</span>
//               </div>
//               <div className="flex items-center space-x-2 text-sm text-gray-600">
//                 <MapPin className="w-4 h-4" />
//                 <span>{customer.location}</span>
//               </div>
//             </div>

//             <div className="mt-4 pt-4 border-t border-gray-200">
//               <div className="grid grid-cols-2 gap-4 text-center">
//                 <div>
//                   <p className="text-2xl font-bold text-gray-900">
//                     {customer.orders}
//                   </p>
//                   <p className="text-xs text-gray-500">Orders</p>
//                 </div>
//                 <div>
//                   <p className="text-2xl font-bold text-gray-900">
//                     {customer.totalSpent}
//                   </p>
//                   <p className="text-xs text-gray-500">Total Spent</p>
//                 </div>
//               </div>
//               <p className="text-xs text-gray-500 text-center mt-2">
//                 Joined {customer.joinDate}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AdminCustomers;

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, Eye, Mail, Phone, MapPin } from "lucide-react";
import {
  fetchAllCustomers,
  searchCustomersAsync,
  openCustomerModal,
  fetchCustomerByUserId,
  updateFilters,
  selectCustomersLoading,
  selectFilters,
  selectCustomersError,
  selectSelectedCustomer,
  selectCustomers,
} from "../../features/adminfeatures/adminCustomer/AdminCustomerSlice";
import CustomerDetailsModal from "../../models/CustomerDetailsModal";

const AdminCustomers = () => {
  const dispatch = useDispatch();
  const customers = useSelector(selectCustomers);
  const loading = useSelector(selectCustomersLoading);
  const filters = useSelector(selectFilters);
  const error = useSelector(selectCustomersError);
  const selectedCustomer = useSelector(selectSelectedCustomer);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    // Fetch all customers when component mounts
    dispatch(fetchAllCustomers());
  }, [dispatch]);

  useEffect(() => {
    // Update filters in Redux when searchTerm changes
    dispatch(updateFilters({ searchTerm }));
  }, [searchTerm, dispatch]);

  useEffect(() => {
    // Debounced search
    const delayedSearch = setTimeout(() => {
      if (searchTerm.trim()) {
        dispatch(searchCustomersAsync(searchTerm));
      } else {
        dispatch(fetchAllCustomers());
      }
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, dispatch]);

  const handleCustomerView = async (customer) => {
    // Set the selected userId and fetch detailed customer data
    const userId = customer.userId || customer.id;
    setSelectedUserId(userId);

    // Fetch detailed customer data and open modal
    await dispatch(fetchCustomerByUserId(userId));
    dispatch(openCustomerModal(customer));
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      (customer.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.phone || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && customers.length === 0) {
    return (
      <div className="p-4 lg:p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading customers...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 lg:p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">Error loading customers: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center">
        <h1 className="text-2xl font-bold text-gray-900 text-center">
          Customers
        </h1>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
         
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => (
          <div
            key={customer.userId} // Changed from customer.id to customer.userId
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {(customer.name || "U")
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {customer.name}
                  </h3>
                </div>
              </div>
              <button
                className="text-blue-600 hover:text-blue-900 p-1"
                onClick={() => handleCustomerView(customer)}
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                <span>{customer.email || "No email"}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{customer.phone || "No phone"}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>
                  {customer.addresses
                    ? `${customer.addresses.length} Address${
                        customer.addresses.length !== 1 ? "es" : ""
                      }`
                    : "No address"}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {customer.totalOrders || 0}
                  </p>
                  <p className="text-xs text-gray-500">Orders</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    ${(customer.totalSpent || 0).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">Total Spent</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">
                Joined{" "}
                {customer.joinedDate
                  ? new Date(customer.joinedDate).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Show message if no customers found */}
      {filteredCustomers.length === 0 && !loading && (
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-500">No customers found</div>
        </div>
      )}

      {/* Customer Details Modal */}
      <CustomerDetailsModal userId={selectedUserId} />
    </div>
  );
};

export default AdminCustomers;
