// import { useState } from 'react';
// import { ID } from 'appwrite';
// import { useNavigate } from 'react-router-dom';
// import { account } from '../appwrite/appwriteClient';

// export default function Signup() {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleSignup = async () => {
//     setLoading(true);
//     setError('');
//     try {
//       await account.create(ID.unique(), email, password, name);
//       await account.createSession(email, password);
//       navigate('/');
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const signupWithGoogle = async () => {
//     account.createOAuth2Session(
//       "google",
//       "http://localhost:5173", // success URL
//       "http://localhost:5173/signup" // failure URL
//     );
//     console.log("success fully signup ");
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
//         <h2 className="text-xl font-semibold text-center mb-4">Sign Up</h2>
//         <input type="text" placeholder="Name" className="input mb-2" value={name} onChange={(e) => setName(e.target.value)} />
//         <input type="email" placeholder="Email" className="input mb-2" value={email} onChange={(e) => setEmail(e.target.value)} />
//         <input type="password" placeholder="Password" className="input mb-2" value={password} onChange={(e) => setPassword(e.target.value)} />
//         {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
//         <button className="btn w-full mb-2" onClick={handleSignup} disabled={loading}>{loading ? 'Signing up...' : 'Sign Up'}</button>
//         <button className="btn w-full bg-blue-500 text-white" onClick={signupWithGoogle}>Continue with Google</button>
//         <div className="mt-4 text-sm text-center">
//           <p>Already have an account? <a href="/login" className="text-blue-500">Login</a></p>
//           <p><a href="/admin-login" className="text-red-500">Sign up as Admin</a></p>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect, useRef } from "react";
import { ID, Query } from "appwrite";
import { useNavigate } from "react-router-dom";
import { account, databases } from "../appwrite/appwriteClient";
import { UserPlus } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { setUser } from "../features/auth/authSlice";
import { useDispatch } from "react-redux";

export default function Signup() {
  const [name, setName] = useState("");
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

  // Handle OAuth callback - DUPLICATE PREVENTION VERSION
  useEffect(() => {
    const handleOAuthCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);

      // 🔥 STEP 1: Check if already processed or currently processing
      if (processedRef.current || isProcessingRef.current) {
        console.log("⚠️ OAuth callback already processed/processing, skipping...");
        return;
      }

      if (urlParams.get("oauth_success") === "true") {
        // 🔥 STEP 2: Mark as processing immediately
        isProcessingRef.current = true;
        processedRef.current = true;
        
        console.log("🚀 OAuth success detected, processing user...");
        setLoading(true);

        try {
          // Wait for session to be fully established
          await new Promise((resolve) => setTimeout(resolve, 1500));

          const user = await account.get();
          console.log("📊 Google OAuth user:", user);

          if (!user) {
            throw new Error("No user session found after OAuth");
          }

          dispatch(setUser(user));

          // 🔥 STEP 3: Atomic document creation with multiple safeguards
          let documentCreated = false;
          let retryCount = 0;
          const maxRetries = 2;

          while (!documentCreated && retryCount <= maxRetries) {
            try {
              console.log(`🔍 Checking for existing user document (attempt ${retryCount + 1})...`);
              
              // Check if document exists
              const existing = await databases.listDocuments(
                DATABASE_ID,
                USERS_COLLECTION_ID,
                [Query.equal("userId", user.$id)]
              );

              console.log("📋 Existing documents:", existing.total);

              if (existing.total === 0) {
                console.log("📝 Creating new user document...");
                
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
                
                console.log("✅ User document created successfully:", userDoc.$id);
                documentCreated = true;
              } else {
                console.log("✅ User document already exists, skipping creation");
                documentCreated = true;
              }
            } catch (docError) {
              retryCount++;
              console.log(`❌ Document operation failed (attempt ${retryCount}):`, docError.message);
              
              if (retryCount <= maxRetries) {
                console.log("⏳ Retrying in 1 second...");
                await new Promise(resolve => setTimeout(resolve, 1000));
              } else {
                // Don't throw error for document creation failure, user is still authenticated
                console.log("⚠️ Document creation failed after retries, but user is authenticated");
                documentCreated = true; // Stop trying
              }
            }
          }

          // Clean URL and navigate
          window.history.replaceState({}, document.title, "/signup");
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
        setError("Google authentication was cancelled or failed");
        window.history.replaceState({}, document.title, "/signup");
        
        // Reset flags on error
        processedRef.current = false;
        isProcessingRef.current = false;
      }
    };

    handleOAuthCallback();
  }, [dispatch, navigate, DATABASE_ID, USERS_COLLECTION_ID]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const userId = name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9._-]/g, "")
        .slice(0, 36);

      await account.create(userId || ID.unique(), email, password, name);
      await account.createEmailPasswordSession(email, password);

      const user = await account.get();
      console.log("📧 Email signup user:", user);
      dispatch(setUser(user));

      await databases.createDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        ID.unique(),
        {
          userId: user.$id,
          name: user.name || "Unknown",
          email: user.email || "user@gmail.com",
          joinedDate: user.$createdAt,
        }
      );

      console.log("✅ Email signup user document created");
      navigate("/");
    } catch (err) {
      console.error("❌ Email signup error:", err);
      setError(err?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const signupWithGoogle = async () => {
    try {
      console.log("🚀 Starting Google OAuth...");
      
      // 🔥 Reset processing flags before new OAuth attempt
      processedRef.current = false;
      isProcessingRef.current = false;
      
      await account.createOAuth2Session(
        "google",
        `${window.location.origin}/signup?oauth_success=true`,
        `${window.location.origin}/signup?oauth_error=true`
      );
    } catch (err) {
      console.error("❌ Google OAuth initiation failed:", err);
      setError("Google sign-in failed");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center min-h-screen bg-black/50 backdrop-blur-sm">
      {/* Modal container */}
      <div className="relative z-10 w-full max-w-md mx-4 animate-in slide-in-from-bottom-4 duration-300">
        {/* White card with subtle shadow */}
        <div className="relative bg-white rounded-2xl shadow-2xl p-4 transform transition-all duration-300 hover:scale-[1.02] border border-gray-100">
          {/* Content */}
          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-2 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                <UserPlus className=" text-white w-7 h-7" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-1">
                Create Account
              </h2>
              <p className="text-gray-600 text-sm">
                Join us today and get started
              </p>
            </div>

            {/* Form */}
            <div className="space-y-2">
              <div className="group">
                <input
                  type="text"
                  placeholder="Full name"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 group-hover:bg-gray-100"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="group">
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 group-hover:bg-gray-100"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="group">
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 group-hover:bg-gray-100"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-600 text-sm text-center">{error}</p>
                </div>
              )}

              {/* Primary signup button */}
              <button
                className="w-full py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
                onClick={handleSignup}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Creating account...</span>
                  </div>
                ) : (
                  "Create Account"
                )}
              </button>

              {/* Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-gray-500">
                    or continue with
                  </span>
                </div>
              </div>

              {/* Google signup button */}
              <button
                className="w-full py-2 px-4 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 shadow-md"
                onClick={signupWithGoogle}
                disabled={loading}
              >
                <div className="flex items-center justify-center space-x-3">
                  <FcGoogle className="w-5 h-5 mr-2" />
                  <span>Continue with Google</span>
                </div>
              </button>
            </div>

            {/* Footer links */}
            <div className="mt-8 space-y-2 text-center text-sm">
              <p className="text-gray-600">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-red-500 hover:text-red-600 font-medium transition-colors duration-200 hover:underline"
                >
                  Sign in
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