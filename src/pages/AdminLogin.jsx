import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { account } from '../appwrite/appwriteClient';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await account.createSession(email, password);
      navigate('/admin-dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-xl font-semibold text-center mb-4">Admin Login</h2>
        <input type="email" placeholder="Email" className="input mb-2" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" className="input mb-2" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button className="btn w-full" onClick={handleLogin} disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
      </div>
    </div>
  );
}