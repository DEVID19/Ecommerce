import { FaRegTrashAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import emptyCart from "../assets/empty-cart.png";
import { LuNotebookText } from "react-icons/lu";
import { MdDeliveryDining } from "react-icons/md";
import { GiShoppingBag } from "react-icons/gi";
import {
  calculateTotal,
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
} from "../features/cart/cartSlice";
import { fetchUserLocation } from "../api/LocationApi";
import { useEffect, useState } from "react";

const Cart = () => {
  const [location, setLocation] = useState(null);
  const dispatch = useDispatch();
  const { cartItems, totalPrice } = useSelector((state) => state.cart);
  const getLocation = async () => {
    try {
      const data = await fetchUserLocation();
      setLocation(data);
    } catch (error) {
      console.log("Location error", error);
    }
  };

  useEffect(() => {
    getLocation(); // ✅ Works fine now
  }, []);

  
  return (
    <div className="max-w-6xl mx-auto mb-5 px-4 md:px-0 mt-10">
      {cartItems.length > 0 ? (
        <div>
          <h1 className="font-bold text-2xl">My Cart ({cartItems.length})</h1>
          <div>
            <div className="mt-10">
              {cartItems.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="bg-gray-100 p-5 rounded-md flex items-center justify-between mt-3 w-full"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-20 h-20 rounded-md"
                      />
                      <div>
                        <h1 className="md:w-[300px] line-clamp-2">
                          {item.title}
                        </h1>
                        <p className="text-red-500 font-semibold text-lg">
                          ${item.price}
                        </p>
                      </div>
                    </div>
                    <div className="bg-red-500 text-white flex gap-4 p-2 ronded-md font-bold text-xl ">
                      <button
                        className="cursor-pointer"
                        onClick={() => {
                          dispatch(decreaseQuantity({ id: item.id })),
                            dispatch(calculateTotal({ id: item.id }));
                        }}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        className="cursor-pointer"
                        onClick={() => {
                          dispatch(increaseQuantity({ id: item.id })),
                            dispatch(calculateTotal({ id: item.id }));
                        }}
                      >
                        +
                      </button>
                    </div>
                    <span className="hover:bg-white/60 transition-all rounded-full p-3 hover:shadow-2xl">
                      <FaRegTrashAlt
                        className="text-red-500 text-2xl cursor-pointer"
                        onClick={() => {
                          dispatch(removeFromCart({ id: item.id })),
                            dispatch(calculateTotal({ id: item.id }));
                        }}
                      />
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-20">
              <div className="bg-gray-100 rounded-md p-7 mt-4 space-y-2 ">
                <h1 className="text-gray-800 font-bold text-xl">
                  Delivery Info
                </h1>
                <div className="flex flex-col space-y-1">
                  <label htmlFor="">Full Name</label>
                  <input
                    type="text "
                    placeholder="Enter your name"
                    className="p-2 rounded-md "
                    // value={user?.fullName}
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label htmlFor="">Address</label>
                  <input
                    type="text "
                    placeholder="Enter your name"
                    className="p-2 rounded-md "
                    value={location?.country}
                  />
                </div>
                <div className="flex w-full gap-5 ">
                  <div className="flex flex-col  sapce-y-1 w-full ">
                    <label htmlFor="">State</label>
                    <input
                      type="text"
                      placeholder="Enter your state"
                      className="p-2 rounded-md w-full"
                      value={location?.state}
                    />
                  </div>
                  <div className="flex flex-col space-y-1 w-full">
                    <label htmlFor="">PostCode</label>
                    <input
                      type="text"
                      placeholder="Enter your postcode"
                      className="p-2 rounded-md w-full"
                      value={location?.postcode}
                    />
                  </div>
                </div>
                <div className="flex w-full gap-5">
                  <div className="flex flex-col space-y-1 w-full">
                    <label htmlFor="">Country</label>
                    <input
                      type="text"
                      placeholder="Enter your country"
                      className="p-2 rounded-md w-full"
                      value={location?.country}
                    />
                  </div>
                  <div className="flex flex-col space-y-1 w-full">
                    <label htmlFor="">Phone No</label>
                    <input
                      type="text"
                      placeholder="Enter your Number"
                      className="p-2 rounded-md w-full"
                    />
                  </div>
                </div>
                <button className="bg-red-500 text-white px-3 py-1 rounded-md mt-3 cursor-pointer">
                  Submit
                </button>
                <div className="flex items-center justify-center w-full text-gray-700">
                  ---------OR-----------
                </div>
                <div className="flex justify-center">
                  <button
                    className="bg-red-500 text-white px-3 py-2 rounded-md"
                    onClick={getLocation}
                  >
                    Detect Location
                  </button>
                </div>
              </div>
              <div className="bg-white border border-gray-100 shadow-xl rounded-md p-7 mt-4 space-y-2 h-max">
                <h1 className="text-gray-800 font-bold text-xl">
                  Bill details
                </h1>
                <div className="flex justify-between items-center">
                  <h1 className="flex gap-1 items-center text-gray-700">
                    <span>
                      <LuNotebookText />
                    </span>
                    Items total
                  </h1>
                  <p>${totalPrice}</p>
                </div>
                <div className="flex justify-between items-center">
                  <h1 className="flex gap-1 items-center text-gray-700">
                    <span>
                      <MdDeliveryDining />
                    </span>
                    Delivery Charge
                  </h1>
                  <p className="text-red-500 font-semibold">
                    <span className="text-gray-600 line-through">$25</span> FREE
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <h1 className="flex gap-1 items-center text-gray-700">
                    <span>
                      <GiShoppingBag />
                    </span>
                    Handling Charge
                  </h1>
                  <p className="text-red-500 font-semibold">$5</p>
                </div>
                <hr className="text-gray-200 mt-2" />
                <div className="flex justify-between items-center">
                  <h1 className="font-semibold text-lg">Grand total</h1>
                  <p className="font-semibold text-lg">${totalPrice + 5}</p>
                </div>
                <div>
                  <h1 className="font-semibold text-gray-700 mb-3 mt-7">
                    Apply Promo Code
                  </h1>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Enter code"
                      className="p-2 rounded-md w-full"
                    />
                    <button className="bg-white text-black border border-gray-200 px-4 cursor-pointer py-1 rounded-md">
                      Apply
                    </button>
                  </div>
                </div>
                <button className="bg-red-500 text-white px-3 py-2 rounded-md w-full cursor-pointer mt-3">
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3 justify-center items-center h-[600px]">
          <h1 className="text-red-500/80 font-bold text-5xl text-muted">
            Oh no! Your cart is empty
          </h1>
          <img src={emptyCart} alt="" className="w-[400px]" />
          <button className="bg-red-500 text-white px-3 py-2 rounded-md cursor-pointer ">
            Continue Shopping
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;

// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   loadCartFromAppwrite,
//   increaseQuantity,
//   decreaseQuantity,
//   removeFromCart,
//   calculateTotal,
// } from "../features/cart/cartSlice";
// import { useUser } from "@clerk/clerk-react";
// import { Link } from "react-router-dom";

// const CartPage = () => {
//   const dispatch = useDispatch();
//   const { isSignedIn, user } = useUser();
//   const cartItems = useSelector((state) => state.cart.cartItems);
//   const totalQuantity = useSelector((state) => state.cart.totalQuantity);
//   const totalPrice = useSelector((state) => state.cart.totalPrice);
//   const isLoading = useSelector((state) => state.cart.isLoading);

//   useEffect(() => {
//     if (isSignedIn && user?.id) {
//       dispatch(loadCartFromAppwrite(user.id));
//     }
//   }, [dispatch, isSignedIn, user]);

//   useEffect(() => {
//     dispatch(calculateTotal());
//   }, [cartItems, dispatch]);

//   if (isLoading) {
//     return <p className="text-center text-lg">Loading your cart...</p>;
//   }

//   if (!cartItems.length) {
//     return (
//       <div className="text-center mt-10">
//         <p className="text-xl">Your cart is empty 😕</p>
//         <Link
//           to="/"
//           className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//         >
//           Continue Shopping
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto px-4 py-10">
//       <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
//       {cartItems.map((item) => (
//         <div
//           key={item.id}
//           className="flex items-center justify-between border-b py-4"
//         >
//           <div className="flex items-center gap-4">
//             <img
//               src={item.image}
//               alt={item.title}
//               className="w-20 h-20 object-contain"
//             />
//             <div>
//               <h2 className="font-semibold">{item.title}</h2>
//               <p>₹{item.price}</p>
//             </div>
//           </div>
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => dispatch(decreaseQuantity({ id: item.id }))}
//               className="px-3 py-1 bg-gray-300 rounded"
//             >
//               -
//             </button>
//             <span>{item.quantity}</span>
//             <button
//               onClick={() => dispatch(increaseQuantity({ id: item.id }))}
//               className="px-3 py-1 bg-gray-300 rounded"
//             >
//               +
//             </button>
//             <button
//               onClick={() => dispatch(removeFromCart({ id: item.id }))}
//               className="ml-4 px-4 py-2 bg-red-500 text-white rounded"
//             >
//               Remove
//             </button>
//           </div>
//         </div>
//       ))}
//       <div className="mt-10 text-right">
//         <p className="text-xl font-bold">Total Items: {totalQuantity}</p>
//         <p className="text-xl font-bold">
//           Total Price: ₹{totalPrice.toFixed(2)}
//         </p>
//       </div>
//     </div>
//   );
// };

// export default CartPage;
