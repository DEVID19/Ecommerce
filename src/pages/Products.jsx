import React, { useEffect, useState } from "react";
import Loading from "../assets/Loading4.webm";
import { useDispatch, useSelector } from "react-redux";
import FilterSection from "../components/FilterSection";
import {
  filterProductData,
  getProductData,
} from "../features/product/productSlice";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import MobileFilter from "../components/MobileFilter";

const Products = () => {
  const dispatch = useDispatch();
  const { products, status, filteredProducts } = useSelector(
    (state) => state.products
  );
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [brand, setBrand] = useState("ALL");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [page, setPage] = useState(1);
  const [openFilter, setOpenFilter] = useState(false)

  useEffect(() => {
    if (status === "idle") {
      dispatch(getProductData());
    }
  }, [dispatch, status]);

  useEffect(() => {
    dispatch(
      filterProductData({
        search,
        category,
        brand,
        priceRange,
      })
    );
  }, [search, category, brand, priceRange, dispatch]);

  // if (status === "loading") return <p>Loading...</p>;
  if (status === "failed") return <p>Error in fetching the Productdata</p>;

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPage(1); 
  };
  const handleBrandChange = (e) => {
    setBrand(e.target.value);
    setPage(1); 
  };

  const pageHandler = (selectedPage) => {
    setPage(selectedPage);
    window.scrollTo(0, 0);
  };
  const dynamicPage = Math.ceil(filteredProducts?.length / 8);

  return (
    <div className="max-w-6xl mx-auto px-4 mb-10">
       <MobileFilter openFilter={openFilter} setOpenFilter={setOpenFilter} search={search} setSearch={setSearch} brand={brand} setBrand={setBrand} priceRange={priceRange} setPriceRange={setPriceRange} category={category} setCategory={setCategory} handleCategoryChange={handleCategoryChange} handleBrandChange={handleBrandChange}/>
      {products.length > 0 ? (
        <div className="flex gap-8 ">
          <FilterSection
            search={search}
            setSearch={setSearch}
            brand={brand}
            setBrand={setBrand}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            category={category}
            setCategory={setCategory}
            handleCategoryChange={handleCategoryChange}
            handleBrandChange={handleBrandChange}
          />
          {filteredProducts.length > 0 ? (
            <div className="flex flex-col justify-center items-center">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-7 mt-10">
                {filteredProducts
                  ?.slice(page * 8 - 8, page * 8)
                  ?.map((product, index) => {
                    return <ProductCard key={index} product={product} />;
                  })}
              </div>
              <Pagination
                page={page}
                pageHandler={pageHandler}
                dynamicPage={dynamicPage}
              />
            </div>
          ) : (
            <div className="flex justify-center items-center md:h-[600px] md:w-[900px] mt-10">
              <h1 className="text-2xl font-semibold">No Products Found</h1>
            </div>
          )}
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
