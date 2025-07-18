import React from "react";
import toast from "react-hot-toast";
import { IoCartOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, calculateTotal } from "../features/cart/cartSlice";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);

  const handleAddToCart = () => {
    const IsAlreadyinCart = cartItems.find((item) => item.id === product.id);
    if (IsAlreadyinCart) {
      toast.error("Product is already in the Cart!");
    } else {
      toast.success("Product is added in Cart!");
      dispatch(addToCart({ ...product, quantity: 1 }));
      dispatch(calculateTotal());
    }
  };

  const navigate = useNavigate();
  return (
    <div className="border relative border-gray-100 rounded-2xl cursor-pointer hover:scale-105 hover:shadow-2xl transition-all p-2 h-max">
      <img
        src={product.image}
        alt=""
        className="bg-gray-100 aspect-square"
        onClick={() => navigate(`/products/${product.id}`)}
      />
      <h1 className="line-clamp-2 p-1 font-semibold">{product.title}</h1>
      <p className="my-1 text-lg text-gray-800 font-bold">$ {product.price}</p>
      <button
        className="bg-red-500 px-3 py-2 text-lg rounded-md text-white w-full cursor-pointer flex gap-2 items-center justify-center font-semibold"
        onClick={handleAddToCart}
      >
        <IoCartOutline className="w-6 h-6" />
        Add to cart{" "}
      </button>
    </div>
  );
};

export default ProductCard;
