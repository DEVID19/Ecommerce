import { useState } from 'react';
import { ID } from 'appwrite';
import { useNavigate } from 'react-router-dom';
import { account } from '../appwrite/appwriteClient';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    setLoading(true);
    setError('');
    try {
      await account.create(ID.unique(), email, password, name);
      await account.createSession(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const signupWithGoogle = async () => {
    account.createOAuth2Session(
      "google",
      "http://localhost:5173", // success URL
      "http://localhost:5173/signup" // failure URL
    );
    console.log("success fully signup ");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-xl font-semibold text-center mb-4">Sign Up</h2>
        <input type="text" placeholder="Name" className="input mb-2" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="email" placeholder="Email" className="input mb-2" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" className="input mb-2" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button className="btn w-full mb-2" onClick={handleSignup} disabled={loading}>{loading ? 'Signing up...' : 'Sign Up'}</button>
        <button className="btn w-full bg-blue-500 text-white" onClick={signupWithGoogle}>Continue with Google</button>
        <div className="mt-4 text-sm text-center">
          <p>Already have an account? <a href="/login" className="text-blue-500">Login</a></p>
          <p><a href="/admin-login" className="text-red-500">Sign up as Admin</a></p>
        </div>
      </div>
    </div>
  );
}