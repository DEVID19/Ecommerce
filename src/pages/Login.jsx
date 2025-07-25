import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { account } from "../appwrite/appwriteClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      await account.createSession(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-xl font-semibold text-center mb-4">Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="input mb-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="input mb-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button
          className="btn w-full mb-2"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <button
          className="btn w-full bg-blue-500 text-white"
          onClick={loginWithGoogle}
        >
          Continue with Google
        </button>
        <div className="mt-4 text-sm text-center">
          <p>
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-500">
              Sign Up
            </a>
          </p>
          <p>
            <a href="/admin-login" className="text-red-500">
              Login as Admin
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
