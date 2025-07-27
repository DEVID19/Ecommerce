// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { account } from '../appwrite/appwriteClient';

// export default function AdminLogin() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleLogin = async () => {
//     setLoading(true);
//     setError('');
//     try {
//       await account.createSession(email, password);
//       navigate('/admin-dashboard');
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
//         <h2 className="text-xl font-semibold text-center mb-4">Admin Login</h2>
//         <input type="email" placeholder="Email" className="input mb-2" value={email} onChange={(e) => setEmail(e.target.value)} />
//         <input type="password" placeholder="Password" className="input mb-2" value={password} onChange={(e) => setPassword(e.target.value)} />
//         {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
//         <button className="btn w-full" onClick={handleLogin} disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { account } from "../appwrite/appwriteClient";
import { setAdmin } from "../features/auth/authSlice";
import { useDispatch } from "react-redux";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // const handleLogin = async () => {
  //   setLoading(true);
  //   setError('');
  //   try {
  //     await account.createSession(email, password);
  //     navigate('/admin-dashboard');
  //   } catch (err) {
  //     setError(err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const dispatch = useDispatch();

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      await account.deleteSessions(); // Optional: force logout previous session
      await account.createEmailPasswordSession(email, password); // OR createSession
      const user = await account.get(); // fetch logged-in user info

      dispatch(setAdmin(user)); // ✅ This updates Redux with admin info

      // Check if admin was valid (optional, for extra security)
      if (
        ![
          "admin@zaptra.com",
          "admin2@example.com",
          "admin3@example.com",
        ].includes(user.email)
      ) {
        setError("Access denied. Not an authorized admin.");
        await account.deleteSession("current");
        return;
      }

      navigate("/admin"); // or /admin-dashboard if that's your route
    } catch (err) {
      setError(err.message || "Failed to log in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center min-h-screen bg-black/50 backdrop-blur-sm">
      {/* Modal container */}
      <div className="relative z-10 w-full max-w-md mx-4 animate-in slide-in-from-bottom-4 duration-300">
        {/* White card with red admin accent */}
        <div className="relative bg-white rounded-2xl shadow-2xl p-8 transform transition-all duration-300 hover:scale-[1.02] border border-red-200">
          {/* Admin badge */}
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <div className="bg-red-500 text-white px-4 py-1 rounded-full text-xs font-semibold shadow-lg">
              ADMIN ACCESS
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10 pt-4">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Admin Portal
              </h2>
              <p className="text-gray-600 text-sm">
                Secure administrative access
              </p>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <div className="group">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Admin email"
                    className="w-full px-4 py-3 pl-12 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 group-hover:bg-gray-100"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <svg
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </div>
              </div>

              <div className="group">
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Admin password"
                    className="w-full px-4 py-3 pl-12 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 group-hover:bg-gray-100"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <svg
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-600 text-sm text-center">{error}</p>
                </div>
              )}

              {/* Admin login button */}
              <button
                className="w-full py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Authenticating...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Access Admin Panel</span>
                  </div>
                )}
              </button>
            </div>

            {/* Security notice */}
            <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
              <div className="flex items-center space-x-2">
                <svg
                  className="w-4 h-4 text-yellow-600 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-yellow-700 text-xs">
                  This is a secure admin portal. All actions are logged.
                </p>
              </div>
            </div>

            {/* Footer links */}
            <div className="mt-8 text-center text-sm">
              <p className="text-gray-600">
                <a
                  href="/login"
                  className="text-red-500 hover:text-red-600 font-medium transition-colors duration-200 hover:underline"
                >
                  ← Back to User Login
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
