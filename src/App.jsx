import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
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
import Signup from "./pages/SignUp";
import AdminLogin from "./pages/AdminLogin";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { account } from "./appwrite/appwriteClient";
import { setUser } from "./features/auth/authSlice";
import { getUserCartItems } from "./features/cart/cartService";
import { calculateTotal, setCartItems } from "./features/cart/cartSlice";

const AppRoutes = () => {
  const location = useLocation();

  const dispatch = useDispatch();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const user = await account.get();
        console.log(user);
        // ✅ Only dispatch real users to Redux
        if (!user.labels?.includes("anonymous")) {
          dispatch(setUser(user));

          // ✅ Fetch and set cart items
          const items = await getUserCartItems(user.$id);
          dispatch(setCartItems(items));
          dispatch(calculateTotal());
        } else {
          console.log("Anonymous session - skipping Redux user update.");
        }
      } catch (err) {
        console.log("No active session");
      }
    };

    checkSession();
  }, [dispatch]);

  // Check if the path starts with "/admin"
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {/* Show Navbar/Footer only on non-admin routes */}
      {!isAdminRoute && <Navbar />}

      <Routes>
        {/* Frontend Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<SingleProduct />} />
        <Route path="/category/:category" element={<CategoryProduct />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="analytics" element={<AdminAnalytics />} />
        </Route>
      </Routes>

      {!isAdminRoute && <Footer />}
    </>
  );
};

const App = () => {
  return (
    // <>
    //   <BrowserRouter>
    //     <Navbar />
    //     <Routes>
    //       <Route path="/" element={<Home />} />
    //       <Route path="/products" element={<Products />} />
    //       <Route path="/products/:id" element={<SingleProduct />}></Route>
    //       <Route
    //         path="/category/:category"
    //         element={<CategoryProduct />}
    //       ></Route>
    //       <Route path="/about" element={<About />} />
    //       <Route path="/contact" element={<Contact />} />
    //       <Route path="/cart" element={<Cart />} />

    //       {/* Admin Routes - wrapped in admin layout */}
    //       <Route path="/admin" element={<AdminLayout />}>
    //         <Route index element={<AdminDashboard />} />
    //         <Route path="products" element={<AdminProducts />} />
    //         <Route path="orders" element={<AdminOrders />} />
    //         <Route path="customers" element={<AdminCustomers />} />
    //         <Route path="analytics" element={<AdminAnalytics />} />
    //       </Route>
    //     </Routes>
    //     <Footer />
    //   </BrowserRouter>
    // </>

    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
