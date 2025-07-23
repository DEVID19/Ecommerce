import {
  BarChart,
  LayoutDashboard,
  PackageSearch,
  ShoppingCart,
  Users,
} from "lucide-react";
import { NavLink } from "react-router-dom";

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
  return (
    <>
      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 bg-opacity-50 z-40 md:hidden transition-opacity duration-300 ${
          sidebarOpen ? "block" : "hidden"
        }`}
        onClick={toggleSidebar}
      />

      {/* Sidebar itself */}
      <aside
        className={`fixed md:static z-50 top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 p-4 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center gap-2 h-15 px-6 border-b-2 border-gray-200 ">
          <img src="/bolt.png" alt="bolt" className="h-6 mr-2" />
          <span className="font-bold text-xl">Zaptra Admin</span>
        </div>

        {/* <div className="border-b-2 border-gray-200 " /> */}

        <nav className="mt-8 space-y-4 ">
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
    </>
  );
};

export default Sidebar;
