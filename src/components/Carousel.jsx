import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProductData } from "../features/product/productSlice";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import Slider from "react-slick";
import Category from "./Category ";

const Carousel = () => {
  const dispatch = useDispatch();
  const { products, status } = useSelector((state) => state.products);

  useEffect(() => {
    if (status === "idle") {
      dispatch(getProductData());
    }
  }, [dispatch, status]);

  if (status === "loading") return <p>Loading...</p>;
  if (status === "failed") return <p>Error in fetching the Productdata</p>;

  // const laptops = products.filter(
  //   (item) => item.category.toLowerCase() === "laptops"
  // );

  // const smartphones = products.filter(
  //   (item) => item.category.toLowerCase() === "mobile-accessories"
  // );
  // const watches = products.filter(
  //   (item) => item.category.toLowerCase() === "mens-watches"
  // );
  // // Slice separately to balance both categories
  // const mixedCarouselData = [
  //   ...laptops.slice(0, 4),
  //   ...smartphones.slice(0, 3),
  //   ...watches.slice(0, 6),
  // ];
  // console.log(mixedCarouselData);
  // console.log(products.map((item) => item.category));

  const SamplePrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        onClick={onClick}
        className={`arrow ${className}`}
        style={{ zIndex: 3 }}
      >
        <AiOutlineArrowLeft
          className="arrows"
          style={{
            ...style,
            display: "block",
            borderRadius: "50px",
            background: "#f53347",
            color: "white",
            position: "absolute",
            padding: "2px",
            left: "50px",
          }}
        />
      </div>
    );
  };
  const SampleNextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div onClick={onClick} className={`arrow ${className}`}>
        <AiOutlineArrowRight
          className="arrows"
          style={{
            ...style,
            display: "block",
            borderRadius: "50px",
            background: "#f53347",
            color: "white",
            position: "absolute",
            padding: "2px",
            right: "50px",
          }}
        />
      </div>
    );
  };

  var settings = {
    dots: false,
    autoplay: true,
    autoplaySpeed: 2000,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: false,
    nextArrow: <SampleNextArrow to="next" />,
    prevArrow: <SamplePrevArrow to="prev" />,
  };

  return (
    <div>
      <Slider {...settings} className="overflow-hidden">
        {products?.slice(0, 7)?.map((item, index) => {
          return (
            <div
              key={index}
              className="bg-gradient-to-r from-[#0f0c29] via-[#302b63] to-[#24243e] -z-10"
            >
              <div className="flex flex-col md:flex-row gap-10 justify-center h-[600px] my-20 md:my-0 items-center px-4">
                <div className="md:space-y-6 space-y-3">
                  <h3 className="text-red-500 font-semibold font-sans text-sm">
                    Bringing You the Best of Every World.
                  </h3>
                  <h1 className="md:text-4xl text-xl font-bold uppercase line-clamp-2 md:line-clamp-3 md:w-[500px] text-white">
                    {item.title}
                  </h1>
                  <p className="md:w-[500px] line-clamp-3 text-gray-400 pr-7">
                    {item.description}
                  </p>
                  <button className="bg-gradient-to-r from-red-500 to-purple-500 text-white px-3 py-2 rounded-md cursor-pointer mt-2">
                    Shop Now
                  </button>
                </div>
                {/* <div>
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="rounded-full w-[550px] hover:scale-105 transition-all shadow-2xl shadow-red-400 aspect-square object-cover "
                />
              </div> */}
                <div className="sm:w-[550px] sm:h-[550px] w-[270px] h-[270px]  rounded-full hover:scale-105 transition-all bg-white p-4 flex items-center justify-center shadow-2xl shadow-red-400 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="object-contain w-full h-full"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </Slider>
      <Category />
    </div>
  );
};

export default Carousel;
