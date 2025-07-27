// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { account } from "../appwrite/appwriteClient";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       await account.createSession(email, password);
//       navigate("/");
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loginWithGoogle = async () => {
//     account.createOAuth2Session(
//       "google",
//       "http://localhost:5173", // success URL
//       "http://localhost:5173/login" // failure URL
//     );
//     console.log("success fully login ");
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
//         <h2 className="text-xl font-semibold text-center mb-4">Login</h2>
//         <input
//           type="email"
//           placeholder="Email"
//           className="input mb-2"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           className="input mb-2"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />
//         {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
//         <button
//           className="btn w-full mb-2"
//           onClick={handleLogin}
//           disabled={loading}
//         >
//           {loading ? "Logging in..." : "Login"}
//         </button>
//         <button
//           className="btn w-full bg-blue-500 text-white"
//           onClick={loginWithGoogle}
//         >
//           Continue with Google
//         </button>
//         <div className="mt-4 text-sm text-center">
//           <p>
//             Don't have an account?{" "}
//             <a href="/signup" className="text-blue-500">
//               Sign Up
//             </a>
//           </p>
//           <p>
//             <a href="/admin-login" className="text-red-500">
//               Login as Admin
//             </a>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { account } from "../appwrite/appwriteClient";
import { User } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { setUser } from "../features/auth/authSlice";
import { useDispatch } from "react-redux";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch()
  // const handleLogin = async () => {
  //   setLoading(true);
  //   setError("");
  //   try {
  //     await account.createSession(email, password);
  //     navigate("/");
  //   } catch (err) {
  //     if (err.code === 401) {
  //       setError(
  //         "User not found or invalid credentials. Please sign up first."
  //       );
  //     } else {
  //       setError(err.message);
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      // 1. Create session
      await account.createEmailPasswordSession(email, password);

      // 2. Get logged-in user details
      const user = await account.get();

      // 3. Dispatch to Redux
      dispatch(setUser(user));

      // 4. Navigate to home
      navigate("/");
    } catch (err) {
      if (err.code === 401) {
        setError("User not found or invalid credentials. Please sign up first.");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    account.createOAuth2Session(
      "google",
      "http://localhost:5173", // success URL
      "http://localhost:5173/login" // failure URL
    );
    console.log("success fully login ");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center min-h-screen bg-black/50 backdrop-blur-sm ">
      {/* Modal container */}
      <div className="relative z-10 w-full max-w-md mx-4 animate-in slide-in-from-bottom-4 duration-300 ">
        {/* White card with subtle shadow */}
        <div className="relative bg-white rounded-2xl shadow-2xl p-6 transform transition-all duration-300 hover:scale-[1.02] border border-gray-100">
          {/* Content */}
          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-1 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                <User className="text-2xl text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-1">
                Welcome Back
              </h2>
              <p className="text-gray-600 text-sm">Sign in to your account</p>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <div className="group">
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 group-hover:bg-gray-100"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="group">
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 group-hover:bg-gray-100"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-600 text-sm text-center">{error}</p>
                </div>
              )}

              {/* Primary login button */}
              <button
                className="w-full py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>

              {/* Divider */}
              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-gray-500">
                    or continue with
                  </span>
                </div>
              </div>

              {/* Google login button */}
              <button
                className="w-full py-3 px-4 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 shadow-md"
                onClick={loginWithGoogle}
              >
                <div className="flex items-center justify-center space-x-3">
                  <FcGoogle className="w-5 h-5 mr-2" />
                  <span>Continue with Google</span>
                </div>
              </button>
            </div>

            {/* Footer links */}
            <div className="mt-8 space-y-3 text-center text-sm">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <a
                  href="/signup"
                  className="text-red-500 hover:text-red-600 font-medium transition-colors duration-200 hover:underline"
                >
                  Sign up
                </a>
              </p>
              <p>
                <a
                  href="/admin-login"
                  className="text-gray-500 hover:text-gray-600 font-medium transition-colors duration-200 hover:underline"
                >
                  Admin Access
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
