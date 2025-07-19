import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import { IoCartOutline } from "react-icons/io5";
import { Link, NavLink } from "react-router-dom";
import LocationSelector from "../models/LocationSelector";
import { fetchUserLocation } from "../api/LocationApi";
import { HiMenuAlt1, HiMenuAlt3 } from "react-icons/hi";
import ResponsiveMenu from "./ResponsiveMenu";
import { useSelector } from "react-redux";

const Navbar = () => {
  const [location, setLocation] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openNav, setOpenNav] = useState(false);
  const {cartItems } = useSelector((state) => state.cart);
  useEffect(() => {
    const getLocation = async () => {
      try {
        const data = await fetchUserLocation();
        setLocation(data);
      } catch (error) {
        console.log("Loaction error", error);
      }
    };
    getLocation();
  }, []);

  return (
    <div className="bg-white py-3 shadow-2xl px-4 md:px-0">
      <div className="max-w-6xl  mx-auto flex justify-between items-center ">
        {/* logo section  */}
        <div className="flex items-center gap-7">
          <Link to={"/"}>
            <h1 className="font-bold text-3xl">
              {" "}
              <span className="text-red-500 font-serif">Z</span>aptro
            </h1>
          </Link>

          <div className="md:flex gap-1 cursor-pointer text-gray-700 items-center hidden">
            <MapPin className="text-red-500 " />
            <span className="font-semibold">
              {location ? (
                <div className="-space-y-2">
                  <p>{location.country}</p>
                  <p>{location.state}</p>
                </div>
              ) : (
                "Add Address"
              )}
            </span>
            <FaCaretDown onClick={() => setOpenDropdown(!openDropdown)} />
          </div>
          {openDropdown ? (
            <LocationSelector
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
              setLocation={setLocation}
            />
          ) : null}
        </div>
        {/* menu section */}
        <nav className="flex  gap-7  items-center">
          <ul className="md:flex gap-7 items-center text-xl  font-semibold hidden">
            <NavLink
              to={"/"}
              className={({ isActive }) =>
                `${
                  isActive
                    ? "border-b-3 transition-all border-red-500 "
                    : "text-black"
                } cursor-pointer`
              }
            >
              <li>Home</li>
            </NavLink>
            <NavLink
              to={"/products"}
              className={({ isActive }) =>
                `${
                  isActive
                    ? "border-b-3 transition-all border-red-500 "
                    : "text-black"
                } cursor-pointer`
              }
            >
              <li>Products</li>
            </NavLink>
            <NavLink
              to={"/about"}
              className={({ isActive }) =>
                `${
                  isActive
                    ? "border-b-3 transition-all border-red-500 "
                    : "text-black"
                } cursor-pointer`
              }
            >
              <li>About </li>
            </NavLink>
            <NavLink
              to={"/contact"}
              className={({ isActive }) =>
                `${
                  isActive
                    ? "border-b-3 transition-all border-red-500 "
                    : "text-black"
                } cursor-pointer`
              }
            >
              <li>Contact</li>
            </NavLink>
          </ul>
          <Link to={"/cart"} className="relative">
            <IoCartOutline className="h-7 w-7  " />
            <span className="bg-red-500 px-2 rounded-full absolute -top-3  -right-3 text-white ">
              {cartItems.length}
            </span>
          </Link>
          <div className="hidden md:block">
            <SignedOut>
              <SignInButton className="bg-red-500 text-white px-3 py-1  rounded-md cursor-pointer" />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
          {openNav ? (
            <HiMenuAlt3
              onClick={() => setOpenNav(false)}
              className="h-7 w-7 md:hidden"
            />
          ) : (
            <HiMenuAlt1
              onClick={() => setOpenNav(true)}
              className="h-7 w-7 md:hidden"
            />
          )}
        </nav>
      </div>
      <ResponsiveMenu openNav={openNav} setOpenNav={setOpenNav} />
    </div>
  );
};

export default Navbar;
