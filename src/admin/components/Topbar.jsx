// import {
//   SignedIn,
//   SignedOut,
//   SignInButton,
//   UserButton,
// } from "@clerk/clerk-react";
// import { CalendarDays, Menu } from "lucide-react";
// import React, { useEffect, useState } from "react";

// const Topbar = ({ toggleSidebar }) => {
//   const [currentDate, setCurrentDate] = useState("");

//   useEffect(() => {
//     const date = new Date();
//     const formatedDate = date.toLocaleDateString("en-US", {
//       weekday: "long",
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//     setCurrentDate(formatedDate);
//   }, []);

//   return (
//     <header className="flex items-center  justify-between px-4 py-3 border-b-2 border-gray-200 shadow-lg sticky top-0 z-40 bg-white">
//       <div className="flex items-center gap-3">
//         <button
//           className="md:hidden text-gray-600 hover:text-black focus:outline-none"
//           onClick={toggleSidebar}
//         >
//           <Menu size={24} />
//           <h2 className="text-lg font-semibold hidden md:block text-gray-800">
//             Dashboard
//           </h2>
//         </button>
//         <div className="text-gray-600 text-sm font-medium hidden md:block ">
//           <CalendarDays size={18} className="inline mr-1 text-gray-500" />
//           {currentDate}
//         </div>

//         <div className="flex items-center gap-3  ">
//           <SignedOut>
//             <SignInButton className="bg-red-500 text-white px-3 py-1  rounded-md cursor-pointer" />
//           </SignedOut>
//           <SignedIn>
//             <UserButton />
//           </SignedIn>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Topbar;

import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { CalendarDays, Menu } from "lucide-react";
import { useEffect, useState } from "react";

const Topbar = ({ toggleSidebar }) => {
  const [currentDate, setCurrentDate] = useState("");
  const { user } = useUser();

  useEffect(() => {
    const date = new Date();
    const formatted = date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setCurrentDate(formatted);
  }, []);

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 shadow-md sticky top-0 z-40 bg-white">
      {/* Hamburger + Title */}
      <div className="flex items-center gap-3">
        <button
          className="md:hidden text-gray-600 hover:text-black"
          onClick={toggleSidebar}
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Centered Date */}
      <div className="absolute left-1/2 transform -translate-x-1/2 text-sm text-gray-600 font-medium flex items-center gap-1">
        <CalendarDays size={18} className="text-blue-500" />
        {currentDate}
      </div>

      {/* Right - Avatar + name */}
      <div className="flex items-center gap-3">
        <SignedOut>
          <SignInButton className="bg-red-500 text-white px-3 py-1 rounded-md cursor-pointer" />
        </SignedOut>

        <SignedIn>
          <UserButton />
          <div className="hidden md:block ">
            <p className="text-md font-medium text-gray-700">
              {user?.fullName}
            </p>
            <p className="text-sm text-gray-700">
              {user?.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        </SignedIn>
      </div>
    </header>
  );
};

export default Topbar;
