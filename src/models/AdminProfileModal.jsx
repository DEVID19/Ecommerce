import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  X,
  Camera,
  Edit3,
  Calendar,
  Settings,
  LogOut,
  Save,
  User,
  Mail,
  Shield,
} from "lucide-react";
import {
  account,
  databases,
  storage,
  ID,
  Query,
} from "../appwrite/appwriteClient";
import {
  logout,
  updateUserProfile,
  setAdminProfile,
  updateAdminProfile,
  setAdminProfileImage,
  loadAdminData,
} from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const AdminProfileModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const { user, adminProfile, adminProfileImage, adminDataLoading } =
    useSelector((state) => state.auth);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Admin",
  });

  // UI states
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
  const ADMINS_COLLECTION_ID =
    import.meta.env.VITE_APPWRITE_ADMINS_COLLECTION_ID || "admins";
  const BUCKET_ID = import.meta.env.VITE_APPWRITE_MAIN_BUCKET_ID;

  // Debug logs
  useEffect(() => {
    console.log("Admin Modal - Profile image state:", adminProfileImage);
    console.log("Admin Modal - Admin profile state:", adminProfile);
    console.log("Admin Modal - Data loading:", adminDataLoading);
  }, [adminProfileImage, adminProfile, adminDataLoading]);

  // ✅ FIXED: Only use attributes that exist in your collection schema
  const createAdminProfile = async () => {
    if (!user?.$id) return null;

    try {
      console.log("🔄 Creating admin profile from modal...");
      const newAdminDoc = await databases.createDocument(
        DATABASE_ID,
        ADMINS_COLLECTION_ID,
        ID.unique(),
        {
          userId: user.$id,
          name: user.name || "Admin User",
          email: user.email,
          role: "Admin",
          joinedDate: new Date().toISOString(),
          // Only use attributes that exist in your schema
          // Removed lastLogin, lastUpdated as they don't exist
        }
      );

      console.log("✅ Admin profile created successfully:", newAdminDoc);
      dispatch(setAdminProfile(newAdminDoc));
      return newAdminDoc;
    } catch (createError) {
      console.error("❌ Failed to create admin profile:", createError);
      throw createError;
    }
  };

  // Load admin data on modal open
  useEffect(() => {
    if (isOpen && user) {
      // Set form data from user first
      setFormData({
        name: user.name || "",
        email: user.email || "",
        role: "Admin",
      });

      // Load admin data if not already loading and not available
      if (!adminProfile && !adminDataLoading) {
        console.log("🔄 Admin data not found, loading from database...");
        dispatch(loadAdminData(user.$id));
      } else if (adminProfile) {
        console.log("✅ Admin data already available:", adminProfile);
        // Update form with admin profile data
        setFormData({
          name: adminProfile.name || user.name || "",
          email: adminProfile.email || user.email || "",
          role: "Admin",
        });
      }
    }
  }, [isOpen, user, adminProfile, adminDataLoading, dispatch]);

  // ✅ Improved image upload with better error handling
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    setUploadingImage(true);
    setError("");

    try {
      // Ensure we have admin profile
      let currentAdminProfile = adminProfile;
      if (!currentAdminProfile) {
        console.log("⚠️ No admin profile found, creating one...");
        currentAdminProfile = await createAdminProfile();
      }

      // Delete old profile image if exists
      if (adminProfileImage?.fileId) {
        try {
          await storage.deleteFile(BUCKET_ID, adminProfileImage.fileId);
          console.log("✅ Old admin image deleted successfully");
        } catch (deleteError) {
          console.log("⚠️ Old admin image deletion failed:", deleteError);
        }
      }

      // Upload new image
      const fileId = ID.unique();
      console.log("🔄 Uploading new admin image with ID:", fileId);
      const uploadedFile = await storage.createFile(BUCKET_ID, fileId, file);
      console.log("✅ Admin image uploaded successfully:", uploadedFile);

      // Get image URL properly
      const imageUrlResult = storage.getFileView(BUCKET_ID, uploadedFile.$id);
      const finalImageUrl =
        typeof imageUrlResult === "string"
          ? imageUrlResult
          : imageUrlResult.href;

      console.log("✅ Generated admin image URL:", finalImageUrl);

      // Update Redux store IMMEDIATELY
      const imageData = {
        fileId: uploadedFile.$id,
        url: finalImageUrl,
        fileName: file.name,
        cacheKey: Date.now(),
        updatedAt: new Date().toISOString(),
      };

      console.log("🔄 Dispatching setAdminProfileImage with:", imageData);
      dispatch(setAdminProfileImage(imageData));

      // ✅ FIXED: Update database with correct attribute name
      if (currentAdminProfile?.$id) {
        try {
          await databases.updateDocument(
            DATABASE_ID,
            ADMINS_COLLECTION_ID,
            currentAdminProfile.$id,
            { profileImage: uploadedFile.$id }
          );
          console.log("✅ Admin database updated with new image ID");
        } catch (updateError) {
          console.log(
            "⚠️ Database update failed, but image uploaded:",
            updateError
          );
          // Don't throw error here as image is already uploaded and in Redux
        }
      }

      setSuccess("Admin profile image updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("❌ Admin image upload failed:", err);
      setError("Failed to upload image. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  // ✅ FIXED: Profile update with only existing attributes
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Name is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Ensure we have admin profile
      let currentAdminProfile = adminProfile;
      if (!currentAdminProfile) {
        console.log("⚠️ No admin profile found, creating one...");
        currentAdminProfile = await createAdminProfile();
      }

      // Update Appwrite account
      if (formData.name !== user.name) {
        await account.updateName(formData.name);
      }

      // ✅ FIXED: Update admin database with only existing attributes
      if (currentAdminProfile?.$id) {
        try {
          const updatedDoc = await databases.updateDocument(
            DATABASE_ID,
            ADMINS_COLLECTION_ID,
            currentAdminProfile.$id,
            {
              name: formData.name,
              email: formData.email,
              // Only use attributes that exist in your schema
              // Removed lastUpdated as it doesn't exist
            }
          );
          dispatch(updateAdminProfile(updatedDoc));
          console.log("✅ Admin profile updated in database");
        } catch (updateError) {
          console.log("⚠️ Database update failed:", updateError);
          // Continue with Redux update even if database update fails
        }
      }

      // Update Redux store
      dispatch(
        updateUserProfile({
          name: formData.name,
          email: formData.email,
        })
      );

      setSuccess("Admin profile updated successfully!");
      setIsEditing(false);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("❌ Admin profile update failed:", err);
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
      navigate("/admin-login");
    } catch (err) {
      console.error("Admin logout failed:", err);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl transform transition-all duration-300 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-500" />
              Admin Profile
            </h2>
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
          {/* Loading indicator */}
          {adminDataLoading && (
            <div className="flex items-center justify-center py-4">
              <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-2 text-gray-600">Loading admin data...</span>
            </div>
          )}

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
              <div className="w-24 h-24 rounded-full overflow-hidden bg-red-500 flex items-center justify-center shadow-lg border-4 border-white relative">
                {/* Profile Image with cache busting */}
                {adminProfileImage?.url && (
                  <img
                    key={`admin-modal-${adminProfileImage.fileId}-${
                      adminProfileImage.cacheKey || Date.now()
                    }`}
                    src={`${adminProfileImage.url}?v=${
                      adminProfileImage.cacheKey || Date.now()
                    }`}
                    alt="Admin Profile"
                    className="w-full h-full object-cover absolute inset-0 z-10"
                    onLoad={() => {
                      console.log(
                        "✅ Admin Modal: Profile image loaded successfully"
                      );
                    }}
                    onError={(e) => {
                      console.error(
                        "❌ Admin Modal: Profile image failed to load:",
                        e.target.src
                      );
                      e.target.style.display = "none";
                    }}
                  />
                )}

                {/* Initials */}
                <div
                  className={`w-full h-full flex items-center justify-center text-white text-2xl font-bold absolute inset-0 ${
                    adminProfileImage?.url ? "z-0" : "z-10"
                  }`}
                  style={{
                    display: adminProfileImage?.url ? "none" : "flex",
                  }}
                >
                  {user?.name?.charAt(0).toUpperCase() || "A"}
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

          {/* Admin Information Form */}
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
                disabled={true}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                placeholder="Email address"
              />
              <p className="text-xs text-gray-500 mt-1">
                Email cannot be changed
              </p>
            </div>

            {/* Role Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Shield className="w-4 h-4 inline mr-2" />
                Role
              </label>
              <div className="px-4 py-3 border border-gray-200 rounded-lg bg-red-50 text-red-600 font-semibold">
                {formData.role}
              </div>
            </div>

            {/* Joined Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Admin Since
              </label>
              <div className="px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600">
                {formatDate(adminProfile?.joinedDate || user?.$createdAt)}
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
                        name: adminProfile?.name || user?.name || "",
                        email: adminProfile?.email || user?.email || "",
                        role: "Admin",
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
            {/* Admin Settings Button */}
            {/* <button
              onClick={() => {
                navigate("/admin/settings");
                onClose();
              }}
              className="w-full py-3 px-4 bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 border border-blue-200"
            >
              <Settings className="w-4 h-4" />
              Admin Settings
            </button> */}

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

export default AdminProfileModal;
