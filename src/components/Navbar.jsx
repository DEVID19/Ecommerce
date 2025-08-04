// import { MapPin } from "lucide-react";
// import { useEffect, useState } from "react";
// import { FaCaretDown } from "react-icons/fa";
// import { IoCartOutline } from "react-icons/io5";
// import { Link, NavLink } from "react-router-dom";
// import LocationSelector from "../models/LocationSelector";
// import { fetchUserLocation } from "../api/LocationApi";
// import { HiMenuAlt1, HiMenuAlt3 } from "react-icons/hi";
// import ResponsiveMenu from "./ResponsiveMenu";
// import { useSelector } from "react-redux";
// import UserLogout from "../models/UserLogout";

// const Navbar = () => {
//   const [location, setLocation] = useState(null);
//   const [openDropdown, setOpenDropdown] = useState(null);
//   const [openNav, setOpenNav] = useState(false);
//   const { cartItems } = useSelector((state) => state.cart);
//     const { user , isAnonymous } = useSelector(
//      (state) => state.auth
//   );

//   useEffect(() => {
//     const getLocation = async () => {
//       try {
//         const data = await fetchUserLocation();
//         setLocation(data);
//       } catch (error) {
//         console.log("Loaction error", error);
//       }
//     };
//     getLocation();
//   }, []);

//   return (
//     <div className="bg-white py-3 shadow-2xl px-4 md:px-0">
//       <div className="max-w-6xl  mx-auto flex justify-between items-center ">
//         {/* logo section  */}
//         <div className="flex items-center gap-7">
//           <Link to={"/"}>
//             <h1 className="font-bold text-3xl">
//               {" "}
//               <span className="text-red-500 font-serif">Z</span>aptra
//             </h1>
//           </Link>

//           <div className="md:flex gap-1 cursor-pointer text-gray-700 items-center hidden">
//             <MapPin className="text-red-500 " />
//             <span className="font-semibold">
//               {location ? (
//                 <div className="-space-y-2">
//                   <p>{location.country}</p>
//                   <p>{location.state}</p>
//                 </div>
//               ) : (
//                 "Add Address"
//               )}
//             </span>
//             <FaCaretDown onClick={() => setOpenDropdown(!openDropdown)} />
//           </div>
//           {openDropdown ? (
//             <LocationSelector
//               openDropdown={openDropdown}
//               setOpenDropdown={setOpenDropdown}
//               setLocation={setLocation}
//             />
//           ) : null}
//         </div>
//         {/* menu section */}
//         <nav className="flex  gap-7  items-center">
//           <ul className="md:flex gap-7 items-center text-xl  font-semibold hidden">
//             <NavLink
//               to={"/"}
//               className={({ isActive }) =>
//                 `${
//                   isActive
//                     ? "border-b-3 transition-all border-red-500 "
//                     : "text-black"
//                 } cursor-pointer`
//               }
//             >
//               <li>Home</li>
//             </NavLink>
//             <NavLink
//               to={"/products"}
//               className={({ isActive }) =>
//                 `${
//                   isActive
//                     ? "border-b-3 transition-all border-red-500 "
//                     : "text-black"
//                 } cursor-pointer`
//               }
//             >
//               <li>Products</li>
//             </NavLink>
//             <NavLink
//               to={"/about"}
//               className={({ isActive }) =>
//                 `${
//                   isActive
//                     ? "border-b-3 transition-all border-red-500 "
//                     : "text-black"
//                 } cursor-pointer`
//               }
//             >
//               <li>About </li>
//             </NavLink>
//             <NavLink
//               to={"/contact"}
//               className={({ isActive }) =>
//                 `${
//                   isActive
//                     ? "border-b-3 transition-all border-red-500 "
//                     : "text-black"
//                 } cursor-pointer`
//               }
//             >
//               <li>Contact</li>
//             </NavLink>
//           </ul>
//           <Link to={"/cart"} className="relative">
//             <IoCartOutline className="h-7 w-7  " />
//             <span className="bg-red-500 px-2 rounded-full absolute -top-3  -right-3 text-white ">
//               {cartItems.length}
//             </span>
//           </Link>
//            <div className="hidden md:block">
//             {!user || isAnonymous ? (
//               // Show Sign In button when user is not authenticated
//               <Link
//                 to="/login"
//                 className="bg-red-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-red-600 transition-colors duration-200 font-medium"
//               >
//                 Sign In
//               </Link>
//             ) : (
//               // Show User Profile when authenticated
//               <div
//                 className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200"
//               >
//                 <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-semibold text-lg overflow-hidden border-2 border-gray-200">
//                   <span
//                     className={`w-full h-full flex items-center justify-center `}
//                   >
//                     {user?.name?.charAt(0).toUpperCase() || "U"}
//                   </span>
//                 </div>
//                 <div className="flex flex-col">
//                   <span className="font-semibold text-gray-800 text-sm">
//                     {user?.name || "User"}
//                   </span>
//                   <span className="text-gray-500 text-xs">
//                     {user?.email || "user@example.com"}
//                   </span>
//                   </div>
//                    <div >
//               <UserLogout/>
//             </div>
//               </div>
//             )}

//           </div>
//           {openNav ? (
//             <HiMenuAlt3
//               onClick={() => setOpenNav(false)}
//               className="h-7 w-7 md:hidden"
//             />
//           ) : (
//             <HiMenuAlt1
//               onClick={() => setOpenNav(true)}
//               className="h-7 w-7 md:hidden"
//             />
//           )}
//         </nav>
//       </div>
//       <ResponsiveMenu openNav={openNav} setOpenNav={setOpenNav} />
//     </div>
//   );
// };

// export default Navbar;

import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import { IoCartOutline } from "react-icons/io5";
import { Link, NavLink } from "react-router-dom";
import LocationSelector from "../models/LocationSelector";
import { fetchUserLocation } from "../api/locationApi";
import { HiMenuAlt1, HiMenuAlt3 } from "react-icons/hi";
import ResponsiveMenu from "./ResponsiveMenu";
import { useSelector, useDispatch } from "react-redux";
import UserProfileModal from "../models/UserProfileModal";
import { loadUserProfileImage } from "../features/auth/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const [location, setLocation] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openNav, setOpenNav] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);

  const { cartItems } = useSelector((state) => state.cart);
  const { user, isAnonymous, profileImage, profileImageLoading } = useSelector(
    (state) => state.auth
  );

  // Debug logs
  useEffect(() => {
    console.log("Navbar - Profile image state:", profileImage);
    console.log("Navbar - User state:", user);
  }, [profileImage, user]);

  // Load profile image when user is authenticated - FIXED to prevent unnecessary loading
  useEffect(() => {
    if (
      user &&
      !isAnonymous &&
      user.$id &&
      !profileImage &&
      !profileImageLoading
    ) {
      console.log("Loading profile image for user:", user.$id);
      dispatch(loadUserProfileImage(user.$id));
    }
  }, [user?.$id, isAnonymous, dispatch]); // Removed profileImage and profileImageLoading from dependencies

  useEffect(() => {
    const getLocation = async () => {
      try {
        const data = await fetchUserLocation();
        setLocation(data);
      } catch (error) {
        console.log("Location error", error);
      }
    };
    getLocation();
  }, []);

  return (
    <>
      <div className="bg-white py-3 shadow-2xl px-4 md:px-0">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          {/* logo section */}
          <div className="flex items-center gap-7">
            <Link to={"/"}>
              <h1 className="font-bold text-3xl">
                <span className="text-red-500 font-serif">Z</span>aptra
              </h1>
            </Link>

            <div className="md:flex gap-1 cursor-pointer text-gray-700 items-center hidden">
              <MapPin className="text-red-500" />
              <span className="font-semibold">
                {location ? (
                  <div className="-space-y-2">
                    <p>{location.country}</p>
                    <p>{location.state}</p>
                  </div>
                ) : (
                  "Add Address"
                )}
              </span>
              <FaCaretDown onClick={() => setOpenDropdown(!openDropdown)} />
            </div>
            {openDropdown ? (
              <LocationSelector
                openDropdown={openDropdown}
                setOpenDropdown={setOpenDropdown}
                setLocation={setLocation}
              />
            ) : null}
          </div>

          {/* menu section */}
          <nav className="flex gap-7 items-center">
            <ul className="md:flex gap-7 items-center text-xl font-semibold hidden">
              <NavLink
                to={"/"}
                className={({ isActive }) =>
                  `${
                    isActive
                      ? "border-b-3 transition-all border-red-500"
                      : "text-black"
                  } cursor-pointer`
                }
              >
                <li>Home</li>
              </NavLink>
              <NavLink
                to={"/products"}
                className={({ isActive }) =>
                  `${
                    isActive
                      ? "border-b-3 transition-all border-red-500"
                      : "text-black"
                  } cursor-pointer`
                }
              >
                <li>Products</li>
              </NavLink>
              <NavLink
                to={"/about"}
                className={({ isActive }) =>
                  `${
                    isActive
                      ? "border-b-3 transition-all border-red-500"
                      : "text-black"
                  } cursor-pointer`
                }
              >
                <li>About</li>
              </NavLink>
              <NavLink
                to={"/contact"}
                className={({ isActive }) =>
                  `${
                    isActive
                      ? "border-b-3 transition-all border-red-500"
                      : "text-black"
                  } cursor-pointer`
                }
              >
                <li>Contact</li>
              </NavLink>
            </ul>

            <Link to={"/cart"} className="relative">
              <IoCartOutline className="h-7 w-7" />
              <span className="bg-red-500 px-2 rounded-full absolute -top-3 -right-3 text-white">
                {cartItems.length}
              </span>
            </Link>

            <div className="hidden md:block">
              {!user || isAnonymous ? (
                // Show Sign In button when user is not authenticated
                <Link
                  to="/login"
                  className="bg-red-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-red-600 transition-colors duration-200 font-medium"
                >
                  Sign In
                </Link>
              ) : (
                // Show User Profile when authenticated - ENHANCED STYLING
                <div
                  onClick={() => setShowUserModal(true)}
                  className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-xl transition-all duration-300 hover:shadow-sm group"
                >
                  {/* Enhanced Profile Avatar - Made Bigger */}
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-xl overflow-hidden shadow-lg ring-2 ring-white ring-offset-2 ring-offset-gray-50 transition-all duration-300 group-hover:ring-red-400 group-hover:shadow-xl relative">
                      {/* Profile Image with enhanced styling */}
                      {profileImage?.url && (
                        <img
                          key={`navbar-${profileImage.fileId}-${
                            profileImage.cacheKey || Date.now()
                          }`}
                          src={profileImage.url}
                          alt="Profile"
                          className="w-full h-full object-cover object-center absolute inset-0 z-10 transition-all duration-300 group-hover:scale-105"
                          onLoad={() => {
                            console.log(
                              "Navbar: Profile image loaded successfully"
                            );
                          }}
                          onError={(e) => {
                            console.error(
                              "Navbar: Profile image failed to load:",
                              e.target.src
                            );
                            e.target.style.display = "none";
                          }}
                        />
                      )}

                      {/* Initials with enhanced styling */}
                      <span
                        className={`w-full h-full flex items-center justify-center absolute inset-0 bg-gradient-to-br from-red-500 to-red-600 text-white font-bold transition-all duration-300 ${
                          profileImage?.url
                            ? "z-0 opacity-0"
                            : "z-10 opacity-100"
                        }`}
                      >
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                      </span>

                      {/* Online indicator */}
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                    </div>

                    {/* Subtle glow effect on hover */}
                    <div className="absolute inset-0 rounded-full bg-red-500 opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300 -z-10"></div>
                  </div>

                  {/* User info with enhanced typography */}
                  <div className="flex flex-col min-w-0">
                    <span className="font-semibold text-gray-900 text-sm truncate group-hover:text-red-600 transition-colors duration-200">
                      {user?.name || "User"}
                    </span>
                    <span className="text-gray-500 text-xs truncate">
                      {user?.email || "user@example.com"}
                    </span>
                  </div>

                  {/* Subtle arrow indicator */}
                  <div className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>

            {openNav ? (
              <HiMenuAlt3
                onClick={() => setOpenNav(false)}
                className="h-7 w-7 md:hidden"
              />
            ) : (
              <HiMenuAlt1
                onClick={() => setOpenNav(true)}
                className="h-7 w-7 md:hidden"
              />
            )}
          </nav>
        </div>
        <ResponsiveMenu openNav={openNav} setOpenNav={setOpenNav} />
      </div>

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
      />
    </>
  );
};

export default Navbar;

// import { MapPin } from "lucide-react";
// import { useEffect, useState } from "react";
// import { FaCaretDown } from "react-icons/fa";
// import { IoCartOutline } from "react-icons/io5";
// import { Link, NavLink } from "react-router-dom";
// import LocationSelector from "../models/LocationSelector";
// import { fetchUserLocation } from "../api/LocationApi";
// import { HiMenuAlt1, HiMenuAlt3 } from "react-icons/hi";
// import ResponsiveMenu from "./ResponsiveMenu";
// import { useSelector, useDispatch } from "react-redux";
// import { account } from "../appwrite/appwriteClient";
// import { setUser, logout, setProfileImage } from "../features/auth/authSlice";
// import { getFilePreview } from "../utils/storageHelper";
// import { userProfileService } from "../utils/userProfileService";
// import UserProfileModal from "../models/UserProfileModal";

// const Navbar = () => {
//   const [location, setLocation] = useState(null);
//   const [openDropdown, setOpenDropdown] = useState(null);
//   const [openNav, setOpenNav] = useState(false);
//   const [showProfileModal, setShowProfileModal] = useState(false);

//   const { cartItems } = useSelector((state) => state.cart);
//   const { user, isAuthenticated, profileImage } = useSelector(
//     (state) => state.auth
//   );
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const getLocation = async () => {
//       try {
//         const data = await fetchUserLocation();
//         setLocation(data);
//       } catch (error) {
//         console.log("Location error", error);
//       }
//     };
//     getLocation();
//   }, []);

//   // Check if user is already logged in on component mount
//   useEffect(() => {
//     const checkAuthStatus = async () => {
//       try {
//         const currentUser = await account.get();
//         dispatch(setUser(currentUser));

//         // Load profile image from Appwrite database
//         if (currentUser?.$id) {
//           try {
//             const userProfile = await userProfileService.getUserProfile(currentUser.$id);

//             if (userProfile?.profileImageFileId) {
//               const imageUrl = getFilePreview(userProfile.profileImageFileId, 200, 200, 90);
//               dispatch(
//                 setProfileImage({
//                   fileId: userProfile.profileImageFileId,
//                   url: imageUrl,
//                   fileName: `profile_${currentUser.$id}`,
//                   updatedAt: userProfile.updatedAt,
//                 })
//               );
//             }
//           } catch (error) {
//             console.error("Error loading profile image from database:", error);
//           }
//         }
//       } catch (error) {
//         // User is not logged in
//         console.log("No active session");
//       }
//     };
//     checkAuthStatus();
//   }, [dispatch]);

//   const handleSignOut = async () => {
//     try {
//       await account.deleteSession("current");
//       dispatch(logout());
//     } catch (error) {
//       console.error("Logout error:", error);
//     }
//   };

//   // Function to get the current profile image URL with cache busting
//   const getProfileImageUrl = () => {
//     if (profileImage?.url) {
//       // Add timestamp to prevent caching issues
//       const separator = profileImage.url.includes('?') ? '&' : '?';
//       return `${profileImage.url}${separator}t=${profileImage.updatedAt || Date.now()}`;
//     }
//     return null;
//   };

//   return (
//     <div className="bg-white py-3 shadow-2xl px-4 md:px-0">
//       <div className="max-w-6xl mx-auto flex justify-between items-center">
//         {/* logo section */}
//         <div className="flex items-center gap-7">
//           <Link to={"/"}>
//             <h1 className="font-bold text-3xl">
//               <span className="text-red-500 font-serif">Z</span>aptra
//             </h1>
//           </Link>

//           <div className="md:flex gap-1 cursor-pointer text-gray-700 items-center hidden">
//             <MapPin className="text-red-500" />
//             <span className="font-semibold">
//               {location ? (
//                 <div className="-space-y-2">
//                   <p>{location.country}</p>
//                   <p>{location.state}</p>
//                 </div>
//               ) : (
//                 "Add Address"
//               )}
//             </span>
//             <FaCaretDown onClick={() => setOpenDropdown(!openDropdown)} />
//           </div>
//           {openDropdown ? (
//             <LocationSelector
//               openDropdown={openDropdown}
//               setOpenDropdown={setOpenDropdown}
//               setLocation={setLocation}
//             />
//           ) : null}
//         </div>

//         {/* menu section */}
//         <nav className="flex gap-7 items-center">
//           <ul className="md:flex gap-7 items-center text-xl font-semibold hidden">
//             <NavLink
//               to={"/"}
//               className={({ isActive }) =>
//                 `${
//                   isActive
//                     ? "border-b-3 transition-all border-red-500"
//                     : "text-black"
//                 } cursor-pointer`
//               }
//             >
//               <li>Home</li>
//             </NavLink>
//             <NavLink
//               to={"/products"}
//               className={({ isActive }) =>
//                 `${
//                   isActive
//                     ? "border-b-3 transition-all border-red-500"
//                     : "text-black"
//                 } cursor-pointer`
//               }
//             >
//               <li>Products</li>
//             </NavLink>
//             <NavLink
//               to={"/about"}
//               className={({ isActive }) =>
//                 `${
//                   isActive
//                     ? "border-b-3 transition-all border-red-500"
//                     : "text-black"
//                 } cursor-pointer`
//               }
//             >
//               <li>About</li>
//             </NavLink>
//             <NavLink
//               to={"/contact"}
//               className={({ isActive }) =>
//                 `${
//                   isActive
//                     ? "border-b-3 transition-all border-red-500"
//                     : "text-black"
//                 } cursor-pointer`
//               }
//             >
//               <li>Contact</li>
//             </NavLink>
//           </ul>

//           <Link to={"/cart"} className="relative">
//             <IoCartOutline className="h-7 w-7" />
//             <span className="bg-red-500 px-2 rounded-full absolute -top-3 -right-3 text-white">
//               {cartItems.length}
//             </span>
//           </Link>

//           <div className="hidden md:block">
//             {!isAuthenticated ? (
//               // Show Sign In button when user is not authenticated
//               <Link
//                 to="/login"
//                 className="bg-red-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-red-600 transition-colors duration-200 font-medium"
//               >
//                 Sign In
//               </Link>
//             ) : (
//               // Show User Profile when authenticated
//               <div
//                 onClick={() => setShowProfileModal(true)}
//                 className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200"
//               >
//                 <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-semibold text-lg overflow-hidden border-2 border-gray-200">
//                   {getProfileImageUrl() ? (
//                     <img
//                       key={`profile-${profileImage?.fileId}-${profileImage?.updatedAt || Date.now()}`}
//                       src={getProfileImageUrl()}
//                       alt={`${user?.name || "User"}'s profile`}
//                       className="w-full h-full object-cover"
//                       onError={(e) => {
//                         console.error("Profile image failed to load:", e.target.src);
//                         e.target.style.display = "none";
//                         if (e.target.nextSibling) {
//                           e.target.nextSibling.style.display = "flex";
//                         }
//                       }}
//                       onLoad={(e) => {
//                         console.log("Profile image loaded successfully");
//                         if (e.target.nextSibling) {
//                           e.target.nextSibling.style.display = "none";
//                         }
//                       }}
//                     />
//                   ) : null}
//                   <span
//                     className={`w-full h-full flex items-center justify-center ${
//                       getProfileImageUrl() ? "hidden" : ""
//                     }`}
//                   >
//                     {user?.name?.charAt(0).toUpperCase() || "U"}
//                   </span>
//                 </div>
//                 <div className="flex flex-col">
//                   <span className="font-semibold text-gray-800 text-sm">
//                     {user?.name || "User"}
//                   </span>
//                   <span className="text-gray-500 text-xs">
//                     {user?.email || "user@example.com"}
//                   </span>
//                 </div>
//               </div>
//             )}
//           </div>

//           {openNav ? (
//             <HiMenuAlt3
//               onClick={() => setOpenNav(false)}
//               className="h-7 w-7 md:hidden"
//             />
//           ) : (
//             <HiMenuAlt1
//               onClick={() => setOpenNav(true)}
//               className="h-7 w-7 md:hidden"
//             />
//           )}
//         </nav>
//       </div>

//       <ResponsiveMenu openNav={openNav} setOpenNav={setOpenNav} />

//       {/* User Profile Modal */}
//       {showProfileModal && user && (
//         <UserProfileModal
//           isOpen={showProfileModal}
//           onClose={() => setShowProfileModal(false)}
//           user={user}
//           onSignOut={handleSignOut}
//         />
//       )}
//     </div>
//   );
// };

// export default Navbar;
