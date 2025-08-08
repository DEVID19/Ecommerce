import { IoCartOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart } from "../features/cart/cartSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.user?.$id);

  const handleAddToCart = () => {
    if (!userId) {
      toast.error("🔒 Login required to add items!", {
        position: "top-center",
        className:
          "text-[15px] font-semibold px-4 py-3 rounded-lg shadow-md bg-white text-black whitespace-nowrap",
      });

      return;
    }

    dispatch(
      addItemToCart({
        userId: userId,
        product: {
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          quantity: 1,
        },
      })
    );
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
