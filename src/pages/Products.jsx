import React, { useEffect } from "react";
import Loading from "../assets/Loading4.webm";
import { useDispatch, useSelector } from "react-redux";
import FilterSection from "../components/FilterSection";
import { getProductData } from "../features/product/productSlice";
import ProductCard from "../components/ProductCard";

const Products = () => {
  const dispatch = useDispatch();
  const { products, status } = useSelector((state) => state.products);
  useEffect(() => {
    if (status === "idle") {
      dispatch(getProductData());
    }
  }, [dispatch, status]);

  if (status === "loading") return <p>Loading...</p>;
  if (status === "failed") return <p>Error in fetching the Productdata</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 mb-10">
      {products.length > 0 ? (
        <div className="flex gap-8 ">
          <FilterSection />
          <div className="grid grid-cols-4 gap-7 mt-10">
            {products?.map((product, index) => {
              return <ProductCard key={index} product={product} />;
            })}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-[400px]">
          <video muted autoPlay loop>
            <source src={Loading} type="video/webm" />
          </video>
        </div>
      )}
    </div>
  );
};

export default Products;
