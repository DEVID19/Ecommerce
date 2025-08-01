import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  X,
  Camera,
  Edit3,
  Calendar,
  ShoppingBag,
  LogOut,
  Save,
  User,
  Mail,
} from "lucide-react";
import {
  account,
  databases,
  storage,
  ID,
  Query,
} from "../appwrite/appwriteClient";
import {
  clearProfileImage,
  logout,
  setProfileImage,
  updateUserProfile,
} from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const UserProfileModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const { user, profileImage } = useSelector((state) => state.auth);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  // UI states
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userDetails, setUserDetails] = useState(null);

  const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
  const USERS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID;
  const BUCKET_ID = import.meta.env.VITE_APPWRITE_MAIN_BUCKET_ID;

  // Load user data on mount
  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
      });
      fetchUserDetails();
    }
  }, [isOpen, user]);

  // Fetch user details from database
  const fetchUserDetails = async () => {
    if (!user?.$id) return;

    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        [Query.equal("userId", user.$id), Query.limit(1)]
      );

      if (response.documents.length > 0) {
        const userDoc = response.documents[0];
        setUserDetails(userDoc);

        // If profile image exists in database, load it
        if (userDoc.profileImage && !profileImage) {
          try {
            const imageUrl = storage.getFileView(
              BUCKET_ID,
              userDoc.profileImage
            );
            dispatch(
              setProfileImage({
                fileId: userDoc.profileImage,
                url: imageUrl.href,
                fileName: "profile-image",
              })
            );
          } catch (imgError) {
            console.log("Profile image not found:", imgError);
          }
        }
      }
    } catch (err) {
      console.error("Error fetching user details:", err);
    }
  };

  // Handle profile image upload
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      setError("Image size should be less than 5MB");
      return;
    }

    setUploadingImage(true);
    setError("");

    try {
      // Delete old profile image if exists
      if (profileImage?.fileId) {
        try {
          await storage.deleteFile(BUCKET_ID, profileImage.fileId);
        } catch (deleteError) {
          console.log("Old image deletion failed:", deleteError);
        }
      }

      // Upload new image
      const fileId = ID.unique();
      const uploadedFile = await storage.createFile(BUCKET_ID, fileId, file);

      // Get image URL
      const imageUrl = storage.getFileView(BUCKET_ID, uploadedFile.$id);

      // Update Redux store
      const imageData = {
        fileId: uploadedFile.$id,
        url: imageUrl.href,
        fileName: file.name,
      };

      dispatch(setProfileImage(imageData));

      // Update database
      if (userDetails?.$id) {
        await databases.updateDocument(
          DATABASE_ID,
          USERS_COLLECTION_ID,
          userDetails.$id,
          { profileImage: uploadedFile.$id }
        );
      }

      setSuccess("Profile image updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Image upload failed:", err);
      setError("Failed to upload image. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  // Handle form submission
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Name is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Update Appwrite account
      if (formData.name !== user.name) {
        await account.updateName(formData.name);
      }

      // Update database
      if (userDetails?.$id) {
        await databases.updateDocument(
          DATABASE_ID,
          USERS_COLLECTION_ID,
          userDetails.$id,
          {
            name: formData.name,
            email: formData.email, // Note: email update in Appwrite requires verification
          }
        );
      }

      // Update Redux store
      dispatch(
        updateUserProfile({
          name: formData.name,
          email: formData.email,
        })
      );

      setSuccess("Profile updated successfully!");
      setIsEditing(false);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Profile update failed:", err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await account.deleteSession("current");
      dispatch(logout());
      onClose();
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get profile image URL
  const getProfileImageUrl = () => {
    if (profileImage?.url) return profileImage.url;
    return null;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl transform transition-all duration-300 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">My Profile</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Error/Success Messages */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-600 text-sm">{success}</p>
            </div>
          )}

          {/* Profile Image Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-red-500 flex items-center justify-center shadow-lg border-4 border-white">
                {getProfileImageUrl() ? (
                  <img
                    src={getProfileImageUrl()}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <div
                  className={`w-full h-full flex items-center justify-center text-white text-2xl font-bold ${
                    getProfileImageUrl() ? "hidden" : "flex"
                  }`}
                >
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
              </div>

              {/* Camera Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors disabled:opacity-50"
              >
                {uploadingImage ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Camera className="w-4 h-4" />
                )}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* User Information Form */}
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all ${
                    !isEditing ? "bg-gray-50 text-gray-600" : "bg-white"
                  }`}
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                disabled={true} // Email typically shouldn't be editable
                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                placeholder="Email address"
              />
              <p className="text-xs text-gray-500 mt-1">
                Email cannot be changed
              </p>
            </div>

            {/* Joined Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Member Since
              </label>
              <div className="px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600">
                {formatDate(userDetails?.joinedDate || user?.$createdAt)}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: user?.name || "",
                        email: user?.email || "",
                      });
                      setError("");
                    }}
                    className="flex-1 py-3 px-4 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 px-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Save Changes
                  </button>
                </>
              )}
            </div>
          </form>

          {/* Additional Actions */}
          <div className="border-t border-gray-200 pt-6 space-y-3">
            {/* Orders Button */}
            <button
              onClick={() => {
                navigate("/orders");
                onClose();
              }}
              className="w-full py-3 px-4 bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 border border-blue-200"
            >
              <ShoppingBag className="w-4 h-4" />
              My Orders
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full py-3 px-4 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 border border-red-200"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
