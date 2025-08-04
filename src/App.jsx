// import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
// import Home from "./pages/Home";
// import Products from "./pages/Products";
// import About from "./pages/About";
// import Contact from "./pages/Contact";
// import Cart from "./pages/Cart";
// import Orders from "./pages/Orders";
// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";
// import SingleProduct from "./pages/SingleProduct";
// import CategoryProduct from "./pages/CategoryProduct";
// import AdminLayout from "./admin/Layout/AdminLayout";
// import AdminProducts from "./admin/pages/AdminProducts";
// import AdminOrders from "./admin/pages/AdminOrders";
// import AdminCustomers from "./admin/pages/AdminCustomers";
// import AdminAnalytics from "./admin/pages/AdminAnalytics";
// import AdminDashboard from "./admin/pages/AdminDashboard";
// import Login from "./pages/Login";
// import Signup from "./pages/SignUp";
// import AdminLogin from "./pages/AdminLogin";
// import { useDispatch } from "react-redux";
// import { useEffect } from "react";
// import { account } from "./appwrite/appwriteClient";
// import { loadUserProfileImage, setUser } from "./features/auth/authSlice";
// import { getUserCartItems } from "./features/cart/cartService";
// import { calculateTotal, setCartItems } from "./features/cart/cartSlice";

// const AppRoutes = () => {
//   const location = useLocation();

//   const dispatch = useDispatch();

//   useEffect(() => {
//     const checkSession = async () => {
//       try {
//         const user = await account.get();
//         console.log(user);

//         // ✅ Only dispatch real users to Redux
//         if (!user.labels?.includes("anonymous")) {
//           dispatch(setUser(user));

//           // ✅ Load profile image immediately after setting user
//           dispatch(loadUserProfileImage(user.$id));

//           // ✅ Fetch and set cart items
//           const items = await getUserCartItems(user.$id);
//           dispatch(setCartItems(items));
//           dispatch(calculateTotal());
//         } else {
//           console.log("Anonymous session - skipping Redux user update.");
//         }
//       } catch (err) {
//         console.log("No active session");
//       }
//     };

//     checkSession();
//   }, [dispatch]);

//   // Check if the path starts with "/admin"
//   const isAdminRoute = location.pathname.startsWith("/admin");

//   return (
//     <>
//       {/* Show Navbar/Footer only on non-admin routes */}
//       {!isAdminRoute && <Navbar />}

//       <Routes>
//         {/* Frontend Routes */}
//         <Route path="/" element={<Home />} />
//         <Route path="/products" element={<Products />} />
//         <Route path="/products/:id" element={<SingleProduct />} />
//         <Route path="/category/:category" element={<CategoryProduct />} />
//         <Route path="/about" element={<About />} />
//         <Route path="/contact" element={<Contact />} />
//         <Route path="/cart" element={<Cart />} />
//         <Route path="/orders" element={<Orders />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/admin-login" element={<AdminLogin />} />

//         {/* Admin Routes */}
//         <Route path="/admin" element={<AdminLayout />}>
//           <Route index element={<AdminDashboard />} />
//           <Route path="products" element={<AdminProducts />} />
//           <Route path="orders" element={<AdminOrders />} />
//           <Route path="customers" element={<AdminCustomers />} />
//           <Route path="analytics" element={<AdminAnalytics />} />
//         </Route>
//       </Routes>

//       {!isAdminRoute && <Footer />}
//     </>
//   );
// };

// const App = () => {
//   return (
//     // <>
//     //   <BrowserRouter>
//     //     <Navbar />
//     //     <Routes>
//     //       <Route path="/" element={<Home />} />
//     //       <Route path="/products" element={<Products />} />
//     //       <Route path="/products/:id" element={<SingleProduct />}></Route>
//     //       <Route
//     //         path="/category/:category"
//     //         element={<CategoryProduct />}
//     //       ></Route>
//     //       <Route path="/about" element={<About />} />
//     //       <Route path="/contact" element={<Contact />} />
//     //       <Route path="/cart" element={<Cart />} />

//     //       {/* Admin Routes - wrapped in admin layout */}
//     //       <Route path="/admin" element={<AdminLayout />}>
//     //         <Route index element={<AdminDashboard />} />
//     //         <Route path="products" element={<AdminProducts />} />
//     //         <Route path="orders" element={<AdminOrders />} />
//     //         <Route path="customers" element={<AdminCustomers />} />
//     //         <Route path="analytics" element={<AdminAnalytics />} />
//     //       </Route>
//     //     </Routes>
//     //     <Footer />
//     //   </BrowserRouter>
//     // </>

//     <BrowserRouter>
//       <AppRoutes />
//     </BrowserRouter>
//   );
// };

// export default App;

import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SingleProduct from "./pages/SingleProduct";
import CategoryProduct from "./pages/CategoryProduct";
import AdminLayout from "./admin/Layout/AdminLayout";
import AdminProducts from "./admin/pages/AdminProducts";
import AdminOrders from "./admin/pages/AdminOrders";
import AdminCustomers from "./admin/pages/AdminCustomers";
import AdminAnalytics from "./admin/pages/AdminAnalytics";
import AdminDashboard from "./admin/pages/AdminDashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminLogin from "./pages/AdminLogin";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { account, databases, Query, ID } from "./appwrite/appwriteClient";
import {
  loadUserProfileImage,
  setUser,
  setAdmin,
  loadAdminData,
  logout,
} from "./features/auth/authSlice";
import { getUserCartItems } from "./features/cart/cartService";
import { calculateTotal, setCartItems } from "./features/cart/cartSlice";
import {
  PublicRoute,
  AdminProtectedRoute,
  UserProtectedRoute,
} from "./components/ProtectedRoute";

// Admin email configuration
const ADMIN_EMAILS = [
  "admin1@gmail.com",
  "admin2@gmail.com",
  "admin3@gmail.com",
];

const AppRoutes = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAdmin } = useSelector((state) => state.auth);

  const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
  const ADMINS_COLLECTION_ID =
    import.meta.env.VITE_APPWRITE_ADMINS_COLLECTION_ID || "admins";

  // ✅ Improved admin profile creation function
  const createAdminProfile = async (user) => {
    try {
      console.log("🔄 Creating admin profile for:", user.email);

      const adminDoc = await databases.createDocument(
        DATABASE_ID,
        ADMINS_COLLECTION_ID,
        ID.unique(),
        {
          userId: user.$id,
          name: user.name || "Admin User",
          email: user.email,
          role: "Admin",
          joinedDate: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        }
      );

      console.log("✅ Admin profile created successfully:", adminDoc);
      return adminDoc;
    } catch (error) {
      console.error("❌ Failed to create admin profile:", error);
      throw error;
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const user = await account.get();
        console.log("Current user session:", user);

        // Skip anonymous users
        if (user.labels?.includes("anonymous")) {
          console.log("Anonymous session - skipping Redux user update.");
          return;
        }

        // Check if user is an admin by email
        const isAdminByEmail = ADMIN_EMAILS.includes(user.email);

        if (isAdminByEmail) {
          console.log("✅ Admin email detected:", user.email);

          try {
            // First, check if admin record exists
            const adminCheck = await databases.listDocuments(
              DATABASE_ID,
              ADMINS_COLLECTION_ID,
              [Query.equal("userId", user.$id), Query.limit(1)]
            );

            let adminProfile = null;

            if (adminCheck.documents.length > 0) {
              console.log("✅ Admin profile found in database");
              adminProfile = adminCheck.documents[0];
            } else {
              console.log("❌ Admin profile not found, creating new one...");
              // Create admin profile if it doesn't exist
              adminProfile = await createAdminProfile(user);
            }

            // Update last login time
            if (adminProfile) {
              try {
                await databases.updateDocument(
                  DATABASE_ID,
                  ADMINS_COLLECTION_ID,
                  adminProfile.$id,
                  { lastLogin: new Date().toISOString() }
                );
                console.log("✅ Admin last login updated");
              } catch (updateError) {
                console.log("⚠️ Failed to update last login:", updateError);
              }
            }

            // Set admin in Redux
            dispatch(setAdmin(user));

            // Load complete admin data (profile + image)
            console.log("🔄 Loading complete admin data...");
            dispatch(loadAdminData(user.$id));
          } catch (adminError) {
            console.error("❌ Admin setup failed:", adminError);

            // If admin collection operations fail, still set as admin if email matches
            // but create the profile record
            try {
              await createAdminProfile(user);
              dispatch(setAdmin(user));
              dispatch(loadAdminData(user.$id));
            } catch (fallbackError) {
              console.error(
                "❌ Fallback admin creation failed:",
                fallbackError
              );
              // As last resort, just set admin without profile
              dispatch(setAdmin(user));
            }
          }
        } else {
          console.log("Regular user detected");
          dispatch(setUser(user));

          // Load profile image for regular users
          dispatch(loadUserProfileImage(user.$id));

          // Fetch cart items for regular users
          try {
            const items = await getUserCartItems(user.$id);
            dispatch(setCartItems(items));
            dispatch(calculateTotal());
          } catch (cartError) {
            console.log("Cart loading failed:", cartError);
          }
        }
      } catch (err) {
        console.log("No active session found:", err);
        // Clear any existing state
        dispatch(logout());
      }
    };

    checkSession();
  }, [dispatch, DATABASE_ID, ADMINS_COLLECTION_ID]);

  // Check if the path starts with "/admin"
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {/* Show Navbar/Footer only on non-admin routes */}
      {!isAdminRoute && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<SingleProduct />} />
        <Route path="/category/:category" element={<CategoryProduct />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Authentication Routes - Public (redirect if already logged in) */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />
        <Route
          path="/admin-login"
          element={
            <PublicRoute adminOnly={true}>
              <AdminLogin />
            </PublicRoute>
          }
        />

        {/* User Protected Routes */}
        <Route
          path="/cart"
          element={
            <UserProtectedRoute>
              <Cart />
            </UserProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <UserProtectedRoute>
              <Orders />
            </UserProtectedRoute>
          }
        />

        {/* Admin Protected Routes */}
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          <Route
            index
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="products"
            element={
              <AdminProtectedRoute>
                <AdminProducts />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="orders"
            element={
              <AdminProtectedRoute>
                <AdminOrders />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="customers"
            element={
              <AdminProtectedRoute>
                <AdminCustomers />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="analytics"
            element={
              <AdminProtectedRoute>
                <AdminAnalytics />
              </AdminProtectedRoute>
            }
          />
        </Route>
      </Routes>

      {!isAdminRoute && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
