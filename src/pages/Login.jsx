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

import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { account, databases, ID, Query } from "../appwrite/appwriteClient";
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
  const dispatch = useDispatch();

  // 🔥 CRITICAL: Prevent duplicate processing
  const processedRef = useRef(false);
  const isProcessingRef = useRef(false);

  const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
  const USERS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID;

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);

      // 🔥 STEP 1: Check if already processed or currently processing
      if (processedRef.current || isProcessingRef.current) {
        console.log(
          "⚠️ OAuth callback already processed/processing, skipping..."
        );
        return;
      }

      if (urlParams.get("oauth_success") === "true") {
        // 🔥 STEP 2: Mark as processing immediately
        isProcessingRef.current = true;
        processedRef.current = true;

        console.log("🚀 OAuth success detected in login...");
        setLoading(true);

        try {
          // Wait longer for session to be established
          await new Promise((resolve) => setTimeout(resolve, 2000));

          const user = await account.get();
          console.log("📊 Google login user:", user);

          if (!user) {
            throw new Error("No user session found after OAuth");
          }

          dispatch(setUser(user));

          // 🔥 STEP 3: Atomic document creation with multiple safeguards
          let documentProcessed = false;
          let retryCount = 0;
          const maxRetries = 2;

          while (!documentProcessed && retryCount <= maxRetries) {
            try {
              console.log(
                `🔍 Checking for existing user document (attempt ${
                  retryCount + 1
                })...`
              );

              // Check if document exists
              const existing = await databases.listDocuments(
                DATABASE_ID,
                USERS_COLLECTION_ID,
                [Query.equal("userId", user.$id)]
              );

              console.log("📋 Existing user documents:", existing.total);

              if (existing.total === 0) {
                console.log("📝 Creating user document for Google login...");

                // 🔥 Create document with unique timestamp to prevent race conditions
                const userDoc = await databases.createDocument(
                  DATABASE_ID,
                  USERS_COLLECTION_ID,
                  `${user.$id}_${Date.now()}`, // 🔥 Unique ID based on user ID + timestamp
                  {
                    userId: user.$id,
                    name: user.name || "Google User",
                    email: user.email || "",
                    joinedDate: user.$createdAt,
                  }
                );

                console.log("✅ User document created for login:", userDoc.$id);
                documentProcessed = true;
              } else {
                console.log(
                  "✅ User document already exists, skipping creation"
                );
                documentProcessed = true;
              }
            } catch (docError) {
              retryCount++;
              console.log(
                `❌ Document operation failed (attempt ${retryCount}):`,
                docError.message
              );

              if (retryCount <= maxRetries) {
                console.log("⏳ Retrying in 1 second...");
                await new Promise((resolve) => setTimeout(resolve, 1000));
              } else {
                // Don't throw error for document creation failure, user is still authenticated
                console.log(
                  "⚠️ Document creation failed after retries, but user is authenticated"
                );
                documentProcessed = true; // Stop trying
              }
            }
          }

          // Clean URL and navigate
          window.history.replaceState({}, document.title, "/");
          console.log("🎯 Navigating to home page...");
          navigate("/");
        } catch (err) {
          console.error("❌ OAuth callback processing failed:", err);
          setError(`Authentication failed: ${err.message}`);

          // 🔥 Reset flags on error to allow retry
          processedRef.current = false;
          isProcessingRef.current = false;
        } finally {
          setLoading(false);
          isProcessingRef.current = false;
        }
      } else if (urlParams.get("oauth_error") === "true") {
        console.log("❌ OAuth error detected");
        setError("Google authentication failed");
        window.history.replaceState({}, document.title, "/login");

        // Reset flags on error
        processedRef.current = false;
        isProcessingRef.current = false;
      }
    };

    handleOAuthCallback();
  }, [dispatch, navigate, DATABASE_ID, USERS_COLLECTION_ID]);

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      // 1. Create session
      await account.createEmailPasswordSession(email, password);

      // 2. Get logged-in user details
      const user = await account.get();
      console.log("📧 Email login user:", user);

      // 3. Dispatch to Redux
      dispatch(setUser(user));

      // 4. Navigate to home
      navigate("/");
    } catch (err) {
      console.error("❌ Email login error:", err);
      if (err.code === 401) {
        setError(
          "User not found or invalid credentials. Please sign up first."
        );
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      console.log("🚀 Starting Google OAuth login...");

      // 🔥 Reset processing flags before new OAuth attempt
      processedRef.current = false;
      isProcessingRef.current = false;

      await account.createOAuth2Session(
        "google",
        `${window.location.origin}/login?oauth_success=true`,
        `${window.location.origin}/login?oauth_error=true`
      );
      console.log("Google OAuth initiated");
    } catch (err) {
      console.error("❌ Google login failed:", err);
      setError("Google sign-in failed");
    }
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
                disabled={loading}
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
