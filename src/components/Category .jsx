import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCategoryData } from "../features/category/categorySlice";

const Category = () => {
  const dispatch = useDispatch();
  const { categories, status } = useSelector((state) => state.category);

  useEffect(() => {
    if (status === "idle") {
      dispatch(getCategoryData());
    }
  }, [dispatch, status]);

  if (status === "loading") return <p>Loading...</p>;
  if (status === "failed") return <p>Error in fetching the Category data</p>;

  return (
    <div className="bg-[rgb(16,24,41)]">
      <div className='max-w-7xl mx-auto flex flex-wrap gap-4 items-center justify-center md:justify-around py-7 px-4'>
        {categories.slice(0, 8).map((item, index) => (
          <button
            key={index}
            className="uppercase bg-gradient-to-r from-red-500 to-purple-500 text-white px-3 py-1 rounded-md cursor-pointer"
          >     
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Category;
