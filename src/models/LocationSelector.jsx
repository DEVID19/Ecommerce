import React, { useState } from "react";
import { fetchUserLocation } from "../api/LocationApi";
import { CgClose } from "react-icons/cg";

const LocationSelector = ({ openDropdown, setOpenDropdown, setLocation }) => {
  const [loading, setloading] = useState(false);

  const handleLocation = async () => {
    setloading(true);

    try {
      const data = await fetchUserLocation();
      setLocation(data);
      setOpenDropdown(false);
    } catch (error) {
      console.log("Location error", error);
    } finally {
      setloading(false);
    }
  };

  return (
    <div className="w-[250px] h-max shadow-2xl z-50 bg-white fixed top-16 left-60 border-2 p-5 border-gray-100 rounded-md">
      <h1 className="font-semibold mb-4 text-xl flex justify-between">
        Change Location{" "}
        <span onClick={() => setOpenDropdown(!openDropdown)}>
          <CgClose />
        </span>
      </h1>
      <button
        onClick={handleLocation}
        disabled={loading}
        className="bg-red-500 text-white px-3 py-1 rounded-md cursor-pointer hover:bg-red-400"
      >
        {loading ? "Detecting..." : "Detect My Location"}
      </button>
    </div>
  );
};

export default LocationSelector;
