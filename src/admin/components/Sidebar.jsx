// import {
//   BarChart,
//   LayoutDashboard,
//   PackageSearch,
//   ShoppingCart,
//   Users,
// } from "lucide-react";
// import { NavLink } from "react-router-dom";

// const menuItems = [
//   { name: "Dashboard", path: "/admin", icon: <LayoutDashboard size={20} /> },
//   {
//     name: "Products",
//     path: "/admin/products",
//     icon: <PackageSearch size={20} />,
//   },
//   { name: "Orders", path: "/admin/orders", icon: <ShoppingCart size={20} /> },
//   { name: "Customers", path: "/admin/customers", icon: <Users size={20} /> },
//   { name: "Analytics", path: "/admin/analytics", icon: <BarChart size={20} /> },
// ];

// const Sidebar = ({ sidebarOpen, toggleSidebar }) => {
//   return (
//     <>
//       {/* Mobile Sidebar Overlay */}
//       <div
//         className={`fixed inset-0 bg-opacity-50 z-40 md:hidden transition-opacity duration-300 ${
//           sidebarOpen ? "block" : "hidden"
//         }`}
//         onClick={toggleSidebar}
//       />

//       {/* Sidebar itself */}
//       <aside
//         className={`fixed md:static z-50 top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 p-4 ${
//           sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
//         }`}
//       >
//         <div className="flex items-center gap-2 h-15 px-6 border-b-2 border-gray-200 ">
//           <img src="/bolt.png" alt="bolt" className="h-6 mr-2" />
//           <span className="font-bold text-xl">Zaptra Admin</span>
//         </div>

//         {/* <div className="border-b-2 border-gray-200 " /> */}

//         <nav className="mt-8 space-y-4 ">
//           {menuItems.map((item) => (
//             <NavLink
//               key={item.name}
//               to={item.path}
//               end={item.path === "/admin"}
//               className={({ isActive }) =>
//                 `flex items-center gap-3 px-6 py-3 rounded-md font-semi-bold text-md transition-colors duration-200
//                 ${
//                   isActive
//                     ? "bg-red-50 text-red-500 border-r-4 border-red-500 font-semibold"
//                     : "text-gray-700 hover:bg-gray-100"
//                 }`
//               }
//               onClick={toggleSidebar} // Close sidebar on link click
//             >
//               {item.icon}
//               {item.name}
//             </NavLink>
//           ))}
//         </nav>
//       </aside>
//     </>
//   );
// };

// export default Sidebar;

import {
  BarChart,
  LayoutDashboard,
  PackageSearch,
  ShoppingCart,
  Users,
  User,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { loadAdminData } from "../../features/auth/authSlice"; // ✅ Fixed: Use loadAdminData instead
import AdminProfileModal from "../../models/AdminProfileModal";

const menuItems = [
  { name: "Dashboard", path: "/admin", icon: <LayoutDashboard size={20} /> },
  {
    name: "Products",
    path: "/admin/products",
    icon: <PackageSearch size={20} />,
  },
  { name: "Orders", path: "/admin/orders", icon: <ShoppingCart size={20} /> },
  { name: "Customers", path: "/admin/customers", icon: <Users size={20} /> },
  { name: "Analytics", path: "/admin/analytics", icon: <BarChart size={20} /> },
];

const Sidebar = ({ sidebarOpen, toggleSidebar }) => {
  const [showProfileModal, setShowProfileModal] = useState(false);

  const dispatch = useDispatch();
  const { user, isAdmin, adminProfileImage, adminProfile } = useSelector(
    (state) => state.auth
  );

  // ✅ Load admin data (including profile image) when component mounts or user changes
  useEffect(() => {
    if (isAdmin && user?.$id && !adminProfile) {
      console.log("Sidebar: Loading admin data for:", user.$id);
      dispatch(loadAdminData(user.$id));
    }
  }, [isAdmin, user?.$id, adminProfile, dispatch]);

  const getInitials = (name) => {
    if (!name) return "A";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleProfileClick = () => {
    setShowProfileModal(true);
    toggleSidebar(); // Close sidebar after clicking
  };

  // ✅ Get display name from adminProfile or fallback to user.name
  const displayName = adminProfile?.name || user?.name || "Admin User";

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300 ${
          sidebarOpen ? "block" : "hidden"
        }`}
        onClick={toggleSidebar}
      />

      {/* Sidebar itself */}
      <aside
        className={`fixed md:static z-50 top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="flex items-center gap-2 h-15 px-6 py-4 border-b-2 border-gray-200">
          <img src="/bolt.png" alt="bolt" className="h-6 mr-2" />
          <span className="font-bold text-xl">Zaptra Admin</span>
        </div>

        {/* Admin Profile Section (Mobile Only) */}
        {isAdmin && user && (
          <div className="md:hidden px-4 py-4 border-b border-gray-200">
            <button
              onClick={handleProfileClick}
              className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {/* Profile Image */}
              <div className="w-12 h-12 rounded-full overflow-hidden bg-red-500 flex items-center justify-center text-white font-semibold relative flex-shrink-0">
                {adminProfileImage?.url ? (
                  <img
                    key={`sidebar-${adminProfileImage.fileId}-${
                      adminProfileImage.cacheKey || Date.now()
                    }`}
                    src={adminProfileImage.url}
                    alt="Admin Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error("Sidebar: Admin image failed to load");
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <span className="text-sm">{getInitials(displayName)}</span>
                )}
              </div>

              {/* User Info */}
              <div className="text-left flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {displayName}
                </p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>

              <User size={16} className="text-gray-400 flex-shrink-0" />
            </button>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="mt-8 space-y-4 px-4">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === "/admin"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 rounded-md font-semi-bold text-md transition-colors duration-200 
                ${
                  isActive
                    ? "bg-red-50 text-red-500 border-r-4 border-red-500 font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
              onClick={toggleSidebar} // Close sidebar on link click
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Admin Profile Modal */}
      <AdminProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </>
  );
};

export default Sidebar;
