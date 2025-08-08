import { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import UserProfileModal from "../models/UserProfileModal";

const ResponsiveMenu = ({ openNav, setOpenNav }) => {
  const [showUserModal, setShowUserModal] = useState(false);
  const { user, isAnonymous, profileImage, profileImageLoading } = useSelector(
    (state) => state.auth
  );

  // Debug logs
  useEffect(() => {
    console.log("ResponsiveMenu - Profile image state:", profileImage);
  }, [profileImage]);

  const closeMenu = () => setOpenNav(false);

  const handleProfileClick = () => {
    if (user && !isAnonymous) {
      setShowUserModal(true);
      closeMenu();
    }
  };

  return (
    <>
      <div
        className={`${
          openNav ? "left-0" : "-left-[100%]"
        } fixed bottom-0 top-0 z-20 flex h-screen w-[75%] flex-col justify-between bg-white px-8 pb-6 pt-16 text-black md:hidden rounded-r-xl shadow-md transition-all`}
      >
        <div>
          {/* User Profile Section */}
          <div
            className={`flex items-center justify-start gap-3 ${
              user && !isAnonymous
                ? "cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors"
                : ""
            }`}
            onClick={handleProfileClick}
          >
            {user && !isAnonymous ? (
              <>
                {/* Profile Image or Initials - FIXED */}
                <div className="relative w-12 h-12">
                  {/* Loading State */}
                  {profileImageLoading && (
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center border-2 border-gray-200 absolute inset-0 z-20">
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-gray-600 rounded-full animate-spin" />
                    </div>
                  )}

                  {/* Profile Image - FIXED: Removed cache busting from URL */}
                  {profileImage?.url && !profileImageLoading && (
                    <img
                      key={`responsive-${profileImage.fileId}-${
                        profileImage.cacheKey || Date.now()
                      }`}
                      src={profileImage.url}
                      alt="Profile"
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 absolute inset-0 z-10"
                      onLoad={() => {
                        console.log(
                          "ResponsiveMenu: Profile image loaded successfully"
                        );
                      }}
                      onError={(e) => {
                        console.error(
                          "ResponsiveMenu: Profile image failed to load:",
                          e.target.src
                        );
                        e.target.style.display = "none";
                      }}
                    />
                  )}

                  {/* Initials Background - Show when no image or loading */}
                  <div
                    className={`w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-semibold text-lg border-2 border-gray-200 absolute inset-0 ${
                      profileImage?.url && !profileImageLoading ? "z-0" : "z-10"
                    }`}
                    style={{
                      display:
                        profileImage?.url && !profileImageLoading
                          ? "none"
                          : "flex",
                    }}
                  >
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                </div>

                {/* User Info */}
                <div>
                  <h1 className="font-semibold text-gray-800">
                    Hello {user?.name || "User"}
                  </h1>
                  <h1 className="text-sm text-slate-500">Premium User</h1>
                  <p className="text-xs text-red-500 mt-1">
                    Tap to edit profile
                  </p>
                </div>
              </>
            ) : (
              <>
                {/* Default User Icon for unauthenticated users */}
                <FaUserCircle size={50} className="text-gray-400" />
                <div>
                  <h1 className="font-semibold text-gray-600">Hello Guest</h1>
                  <h1 className="text-sm text-slate-500">
                    Sign in to continue
                  </h1>
                </div>
              </>
            )}
          </div>

          {/* Navigation Menu */}
          <nav className="mt-12">
            <ul className="flex flex-col gap-7 text-2xl font-semibold">
              <Link
                to={"/"}
                onClick={() => setOpenNav(false)}
                className="cursor-pointer hover:text-red-500 transition-colors"
              >
                <li>Home</li>
              </Link>
              <Link
                to={"/products"}
                onClick={() => setOpenNav(false)}
                className="cursor-pointer hover:text-red-500 transition-colors"
              >
                <li>Products</li>
              </Link>
              <Link
                to={"/about"}
                onClick={() => setOpenNav(false)}
                className="cursor-pointer hover:text-red-500 transition-colors"
              >
                <li>About</li>
              </Link>
              <Link
                to={"/contact"}
                onClick={() => setOpenNav(false)}
                className="cursor-pointer hover:text-red-500 transition-colors"
              >
                <li>Contact</li>
              </Link>

              {/* Cart Link */}
              <Link
                to={"/cart"}
                onClick={() => setOpenNav(false)}
                className="cursor-pointer hover:text-red-500 transition-colors"
              >
                <li>Cart</li>
              </Link>

              {/* Conditional Links based on auth status */}
              {user && !isAnonymous ? (
                <Link
                  to={"/orders"}
                  onClick={() => setOpenNav(false)}
                  className="cursor-pointer hover:text-red-500 transition-colors"
                >
                  <li>My Orders</li>
                </Link>
              ) : (
                <Link
                  to={"/login"}
                  onClick={() => setOpenNav(false)}
                  className="cursor-pointer hover:text-red-500 transition-colors"
                >
                  <li>Sign In</li>
                </Link>
              )}
            </ul>
          </nav>
        </div>

        {/* Bottom Action Button */}
        <div className="mt-8">
          {!user || isAnonymous ? (
            <Link
              to="/login"
              onClick={closeMenu}
              className="block w-full py-3 px-4 bg-red-500 text-white text-center font-medium rounded-lg hover:bg-red-600 transition-colors"
            >
              Sign In
            </Link>
          ) : (
            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowUserModal(true);
                  closeMenu();
                }}
                className="block w-full py-2 px-4 bg-blue-50 text-blue-600 text-center font-medium rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
      />
    </>
  );
};

export default ResponsiveMenu;
