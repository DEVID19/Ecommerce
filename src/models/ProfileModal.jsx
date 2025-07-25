import { useState } from 'react';
import { account } from '../appwrite/appwriteClient';
// import { account, avatars } from '../appwrite/config';

export default function ProfileModal({ user, onClose }) {
  const [name, setName] = useState(user?.name || '');
  const [password, setPassword] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      if (name !== user.name) {
        await account.updateName(name);
      }
      if (password) {
        await account.updatePassword(password);
      }
      if (file) {
        // handle image upload to Appwrite storage
      }
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black bg-opacity-30 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <button className="absolute top-2 right-3 text-xl" onClick={onClose}>×</button>
        <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input mb-2" placeholder="Name" />
        <input type="email" value={user.email} disabled className="input mb-2 bg-gray-100" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input mb-2" placeholder="New Password" />
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="input mb-2" />
        <button onClick={handleUpdate} className="btn w-full">{loading ? 'Saving...' : 'Save Changes'}</button>
      </div>
    </div>
  );
}