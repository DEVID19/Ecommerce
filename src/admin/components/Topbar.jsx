// import {
//   SignedIn,
//   SignedOut,
//   SignInButton,
//   UserButton,
// } from "@clerk/clerk-react";
// import { CalendarDays, Menu } from "lucide-react";
// import React, { useEffect, useState } from "react";

// const Topbar = ({ toggleSidebar }) => {
//   const [currentDate, setCurrentDate] = useState("");

//   useEffect(() => {
//     const date = new Date();
//     const formatedDate = date.toLocaleDateString("en-US", {
//       weekday: "long",
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//     setCurrentDate(formatedDate);
//   }, []);

//   return (
//     <header className="flex items-center  justify-between px-4 py-3 border-b-2 border-gray-200 shadow-lg sticky top-0 z-40 bg-white">
//       <div className="flex items-center gap-3">
//         <button
//           className="md:hidden text-gray-600 hover:text-black focus:outline-none"
//           onClick={toggleSidebar}
//         >
//           <Menu size={24} />
//           <h2 className="text-lg font-semibold hidden md:block text-gray-800">
//             Dashboard
//           </h2>
//         </button>
//         <div className="text-gray-600 text-sm font-medium hidden md:block ">
//           <CalendarDays size={18} className="inline mr-1 text-gray-500" />
//           {currentDate}
//         </div>

//         <div className="flex items-center gap-3  ">
//           <SignedOut>
//             <SignInButton className="bg-red-500 text-white px-3 py-1  rounded-md cursor-pointer" />
//           </SignedOut>
//           <SignedIn>
//             <UserButton />
//           </SignedIn>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Topbar;

// import {
//   SignedIn,
//   SignedOut,
//   SignInButton,
//   UserButton,
// } from "@clerk/clerk-react";
// import { CalendarDays, Menu } from "lucide-react";
// import { useEffect, useState } from "react";

// const Topbar = ({ toggleSidebar }) => {
//   const [currentDate, setCurrentDate] = useState("");
//   // const { user } = useUser();

//   useEffect(() => {
//     const date = new Date();
//     const formatted = date.toLocaleDateString("en-US", {
//       weekday: "long",
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//     setCurrentDate(formatted);
//   }, []);

//   return (
//     <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 shadow-md sticky top-0 z-40 bg-white">
//       {/* Hamburger + Title */}
//       <div className="flex items-center gap-3">
//         <button
//           className="md:hidden text-gray-600 hover:text-black"
//           onClick={toggleSidebar}
//         >
//           <Menu size={24} />
//         </button>
//       </div>

//       {/* Centered Date */}
//       <div className="absolute left-1/2 transform -translate-x-1/2 text-sm text-gray-600 font-medium flex items-center gap-1">
//         <CalendarDays size={18} className="text-blue-500" />
//         {currentDate}
//       </div>

//       {/* Right - Avatar + name */}
//       <div className="flex items-center gap-3">
//         <h1>Heloo User </h1>
//         {/* <SignedOut>
//           <SignInButton className="bg-red-500 text-white px-3 py-1 rounded-md cursor-pointer" />
//         </SignedOut>

//         <SignedIn>
//           <UserButton />
//           <div className="hidden md:block ">
//             <p className="text-md font-medium text-gray-700">
//               {user?.fullName}
//             </p>
//             <p className="text-sm text-gray-700">
//               {user?.primaryEmailAddress?.emailAddress}
//             </p>
//           </div>
//         </SignedIn> */}
//       </div>
//     </header>
//   );
// };

// export default Topbar;

import { CalendarDays, Menu, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadAdminProfileImage } from "../../features/auth/authSlice";
import AdminProfileModal from "../../models/AdminProfileModal";

const Topbar = ({ toggleSidebar }) => {
  const [currentDate, setCurrentDate] = useState("");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const dispatch = useDispatch();
  const { user, isAdmin, adminProfileImage } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    const date = new Date();
    const formatted = date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setCurrentDate(formatted);
  }, []);

  // Load admin profile image when component mounts
  useEffect(() => {
    if (isAdmin && user?.$id && !adminProfileImage) {
      dispatch(loadAdminProfileImage(user.$id));
    }
  }, [isAdmin, user?.$id, adminProfileImage, dispatch]);

  const handleProfileClick = () => {
    setShowProfileModal(true);
    setShowDropdown(false);
  };

  const getInitials = (name) => {
    if (!name) return "A";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 shadow-md sticky top-0 z-40 bg-white">
        {/* Hamburger + Title */}
        <div className="flex items-center gap-3">
          <button
            className="md:hidden text-gray-600 hover:text-black"
            onClick={toggleSidebar}
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Centered Date */}
        <div className="absolute left-1/2 transform -translate-x-1/2 text-sm text-gray-600 font-medium flex items-center gap-1">
          <CalendarDays size={18} className="text-blue-500" />
          {currentDate}
        </div>

        {/* Right - Admin Profile (Desktop Only) */}
        <div className="hidden md:flex items-center gap-3">
          {isAdmin && user ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {/* Profile Image */}
                <div className="w-10 h-10 rounded-full overflow-hidden bg-red-500 flex items-center justify-center text-white font-semibold relative">
                  {adminProfileImage?.url ? (
                    <img
                      key={`topbar-${adminProfileImage.fileId}-${
                        adminProfileImage.cacheKey || Date.now()
                      }`}
                      src={adminProfileImage.url}
                      alt="Admin Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error("Topbar: Admin image failed to load");
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    <span className="text-sm">{getInitials(user.name)}</span>
                  )}
                </div>

                {/* User Info */}
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-700">
                    {user.name || "Admin User"}
                  </p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>

                <ChevronDown size={16} className="text-gray-400" />
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <button
                    onClick={handleProfileClick}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => {
                      // Add settings functionality here
                      setShowDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Settings
                  </button>
                </div>
              )}
            </div>
          ) : (
            <h1 className="text-gray-600">Hello User</h1>
          )}
        </div>

        {/* Mobile - Just show text */}
        {/* <div className="md:hidden">
          <h1 className="text-gray-600 text-sm">Hello Admin</h1>
        </div> */}
      </header>

      {/* Close dropdown when clicking outside */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowDropdown(false)}
        />
      )}

      {/* Admin Profile Modal */}
      <AdminProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </>
  );
};

export default Topbar;
