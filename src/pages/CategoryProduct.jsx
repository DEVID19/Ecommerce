import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getCategoryData } from "../features/category/categorySlice";
import { ChevronLeft } from "lucide-react";
import Loading from "../assets/Loading4.webm"
import ProductListView from "../components/ProductListView";


const CategoryProduct = () => {

  const dispatch = useDispatch();
  const {categories , status , error} = useSelector((state) => state.category);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // if (status === "idle") {
    //   dispatch(getCategoryData(params.category));
    // }
    dispatch(getCategoryData(params.category));
  },[dispatch, params.category]);

  // if (status === "loading") return <p>Loading...</p>;
  if (status === "failed") return <p>Error in fetching categories: {error}</p>;
  

  return (
    <div>
      {
        categories.length > 0 ? (
           <div className='max-w-6xl mx-auto mt-10 mb-10 px-4'>
             <button onClick={()=>navigate('/')} className='bg-gray-800 mb-5 text-white px-3 py-1 rounded-md cursor-pointer flex gap-1 items-center'><ChevronLeft/> Back</button>
             {
              categories.map((product, index) =>{
                return <ProductListView key={index} product={product}/>
              })
             }
          </div>
        ) : (
             <div className='flex items-center justify-center h-[400px]'>
             <video muted autoPlay loop>
              <source src={Loading} type='video/webm'/>
             </video>
          </div>
        )
      }

    </div>
  )
}

export default CategoryProduct