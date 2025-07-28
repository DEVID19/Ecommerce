import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { clearCart } from "../features/cart/cartSlice";
import { account } from "../appwrite/appwriteClient";

const UserLogout = () => {
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleLogout = async () => {
    setLoading(true);
    try {
      // simulate optional delay or perform any logout logic here
      await account.deleteSession("current");
      dispatch(logout());
      dispatch(clearCart());
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleLogout}
        disabled={loading}
        className="bg-red-500 text-white px-3 py-1 rounded-md cursor-pointer hover:bg-red-400"
      >
        {loading ? "Logging out..." : "Logout"}
      </button>
    </div>
  );
};

export default UserLogout;
