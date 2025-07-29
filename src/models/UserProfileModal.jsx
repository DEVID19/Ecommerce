// import { useState, useRef, useEffect } from "react";
// import { X, User, Mail, Lock, Camera, LogOut, Save } from "lucide-react";
// import { account } from "../appwrite/appwriteClient";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   setUser,
//   updateUserProfile,
//   setProfileImage,
//   logout,
// } from "../features/auth/authSlice";
// import {
//   uploadProfileImage,
//   getFilePreview,
//   deleteFile,
// } from "../utils/storageHelper";

// const UserProfileModal = ({ isOpen, onClose, user, onSignOut }) => {
//   const [formData, setFormData] = useState({
//     name: user?.name || "",
//     email: user?.email || "",
//     password: "",
//   });
//   const [profileImage, setProfileImageFile] = useState(null);
//   const [profileImagePreview, setProfileImagePreview] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const fileInputRef = useRef(null);
//   const dispatch = useDispatch();

//   // Get current profile image from Redux state
//   const { profileImage: currentProfileImage } = useSelector(
//     (state) => state.auth
//   );

//   // Load current profile image when modal opens
//   useEffect(() => {
//     if (isOpen && user?.$id) {
//       const savedImageId = localStorage.getItem(`profile_image_${user.$id}`);
//       if (savedImageId && !currentProfileImage) {
//         try {
//           const imageUrl = getFilePreview(savedImageId, 200, 200, 90);
//           dispatch(
//             setProfileImage({
//               fileId: savedImageId,
//               url: imageUrl,
//               fileName: `profile_${user.$id}`,
//             })
//           );
//         } catch (error) {
//           console.error("Error loading current profile image:", error);
//         }
//       }
//     }
//   }, [isOpen, user?.$id, currentProfileImage, dispatch]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleImageSelect = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       // Validate file size (5MB limit)
//       if (file.size > 5 * 1024 * 1024) {
//         setError("Image size should be less than 5MB");
//         return;
//       }

//       // Validate file type
//       const allowedTypes = [
//         "image/jpeg",
//         "image/jpg",
//         "image/png",
//         "image/gif",
//         "image/webp",
//       ];
//       if (!allowedTypes.includes(file.type)) {
//         setError("Please select a valid image file (JPEG, PNG, GIF, or WebP)");
//         return;
//       }

//       setError(""); // Clear any previous errors
//       setProfileImageFile(file);

//       // Create preview
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setProfileImagePreview(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleUpdateProfile = async () => {
//     setLoading(true);
//     setError("");
//     setSuccess("");

//     try {
//       let imageUploadResult = null;

//       // Upload profile image if selected
//       if (profileImage) {
//         try {
//           imageUploadResult = await uploadProfileImage(profileImage, user.$id);

//           // Delete old profile image if exists
//           const oldImageId = localStorage.getItem(`profile_image_${user.$id}`);
//           if (oldImageId && oldImageId !== imageUploadResult.fileId) {
//             try {
//               await deleteFile(oldImageId);
//             } catch (deleteError) {
//               console.warn("Could not delete old profile image:", deleteError);
//             }
//           }

//           // Store new image reference in localStorage
//           localStorage.setItem(
//             `profile_image_${user.$id}`,
//             imageUploadResult.fileId
//           );

//           // Update Redux store with new profile image immediately
//           dispatch(
//             setProfileImage({
//               fileId: imageUploadResult.fileId,
//               url: imageUploadResult.url,
//               fileName: imageUploadResult.fileName,
//               updatedAt: new Date().toISOString(),
//             })
//           );

//           // Clear the preview since we now have the uploaded image
//           setProfileImagePreview(null);
//           setProfileImageFile(null);
//         } catch (imageError) {
//           console.error("Image upload failed:", imageError);
//           throw new Error("Failed to upload profile image. Please try again.");
//         }
//       }

//       // Track what needs to be updated
//       const updates = [];

//       // Update name if changed
//       if (formData.name !== user.name && formData.name.trim()) {
//         try {
//           await account.updateName(formData.name.trim());
//           updates.push("name");
//         } catch (nameError) {
//           console.error("Name update failed:", nameError);
//           throw new Error("Failed to update name. Please try again.");
//         }
//       }

//       // Update email if changed
//       if (formData.email !== user.email && formData.email.trim()) {
//         try {
//           // For email update, we need the current password
//           if (!formData.password) {
//             throw new Error(
//               "Current password is required to update email address"
//             );
//           }

//           // Validate email format
//           const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//           if (!emailRegex.test(formData.email.trim())) {
//             throw new Error("Please enter a valid email address");
//           }

//           await account.updateEmail(formData.email.trim(), formData.password);
//           updates.push("email");
//         } catch (emailError) {
//           console.error("Email update failed:", emailError);

//           // Handle specific Appwrite error messages
//           if (emailError.message.includes("Invalid credentials")) {
//             throw new Error("Current password is incorrect. Please try again.");
//           } else if (emailError.message.includes("user_email_already_exists")) {
//             throw new Error(
//               "This email address is already in use by another account."
//             );
//           } else if (emailError.message.includes("user_invalid_email")) {
//             throw new Error("Please enter a valid email address.");
//           } else {
//             throw new Error(
//               "Failed to update email. Please check your password and try again."
//             );
//           }
//         }
//       }

//       // Update password if provided
//       if (formData.password && formData.password.length >= 8) {
//         try {
//           await account.updatePassword(formData.password);
//           updates.push("password");
//         } catch (passwordError) {
//           console.error("Password update failed:", passwordError);
//           throw new Error("Failed to update password. Please try again.");
//         }
//       }

//       // Get updated user data from Appwrite
//       const updatedUser = await account.get();

//       // Update Redux store with fresh user data
//       dispatch(setUser(updatedUser));

//       // Show success message
//       const updateMessages = [];
//       if (imageUploadResult) updateMessages.push("profile image");
//       if (updates.includes("name")) updateMessages.push("name");
//       if (updates.includes("email")) updateMessages.push("email");
//       if (updates.includes("password")) updateMessages.push("password");

//       const message =
//         updateMessages.length > 0
//           ? `Successfully updated: ${updateMessages.join(", ")}`
//           : "Profile updated successfully!";

//       setSuccess(message);

//       // Clear form password field for security
//       setFormData((prev) => ({ ...prev, password: "" }));

//       // Close modal after success
//       setTimeout(() => {
//         onClose();
//       }, 2000);
//     } catch (error) {
//       console.error("Profile update error:", error);
//       setError(error.message || "Failed to update profile. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       setLoading(true);
//       await onSignOut();
//       dispatch(logout());
//       onClose();
//     } catch (error) {
//       console.error("Logout error:", error);
//       setError("Failed to sign out. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Get current profile image URL with multiple fallback options
//   const getCurrentProfileImage = () => {
//     // First priority: Preview of new image being uploaded
//     if (profileImagePreview) {
//       return profileImagePreview;
//     }

//     // Second priority: Current profile image from Redux state
//     if (currentProfileImage?.url) {
//       return currentProfileImage.url;
//     }

//     // Third priority: Check localStorage directly
//     if (user?.$id) {
//       const savedImageId = localStorage.getItem(`profile_image_${user.$id}`);
//       if (savedImageId) {
//         try {
//           return getFilePreview(savedImageId, 200, 200, 90);
//         } catch (error) {
//           console.error("Error getting profile image preview:", error);
//           // Remove invalid image reference
//           localStorage.removeItem(`profile_image_${user.$id}`);
//         }
//       }
//     }

//     return null;
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center min-h-screen bg-black/50 backdrop-blur-sm">
//       <div className="relative z-10 w-full max-w-md mx-4 animate-in slide-in-from-bottom-4 duration-300">
//         <div className="relative bg-white rounded-2xl shadow-2xl p-6 transform transition-all duration-300 border border-gray-100 max-h-[90vh] overflow-y-auto">
//           {/* Header */}
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-2xl font-bold text-gray-800">
//               Profile Settings
//             </h2>
//             <button
//               onClick={onClose}
//               disabled={loading}
//               className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 disabled:opacity-50"
//             >
//               <X className="w-5 h-5 text-gray-500" />
//             </button>
//           </div>

//           {/* Profile Picture Section */}
//           <div className="flex flex-col items-center mb-6">
//             <div className="relative">
//               <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center text-white text-2xl font-bold overflow-hidden border-4 border-gray-200">
//                 {getCurrentProfileImage() ? (
//                   <img
//                     src={getCurrentProfileImage()}
//                     alt="Profile"
//                     className="w-full h-full object-cover"
//                     onError={(e) => {
//                       e.target.style.display = "none";
//                       if (e.target.nextSibling) {
//                         e.target.nextSibling.style.display = "flex";
//                       }
//                     }}
//                     onLoad={(e) => {
//                       if (e.target.nextSibling) {
//                         e.target.nextSibling.style.display = "none";
//                       }
//                     }}
//                   />
//                 ) : null}
//                 <span
//                   className={`w-full h-full flex items-center justify-center ${
//                     getCurrentProfileImage() ? "hidden" : ""
//                   }`}
//                 >
//                   {user?.name?.charAt(0).toUpperCase() || "U"}
//                 </span>
//               </div>
//               <button
//                 onClick={() => fileInputRef.current?.click()}
//                 disabled={loading}
//                 className="absolute bottom-0 right-0 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <Camera className="w-4 h-4" />
//               </button>
//             </div>
//             <input
//               ref={fileInputRef}
//               type="file"
//               accept="image/*"
//               onChange={handleImageSelect}
//               className="hidden"
//               disabled={loading}
//             />
//             <p className="text-sm text-gray-500 mt-2 text-center">
//               Click camera to change photo
//               <br />
//               <span className="text-xs">
//                 Maximum 5MB • JPEG, PNG, GIF, WebP
//               </span>
//             </p>
//           </div>

//           {/* Form Fields */}
//           <div className="space-y-4">
//             {/* Name Field */}
//             <div className="group">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Full Name
//               </label>
//               <div className="relative">
//                 <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   placeholder="Enter your full name"
//                   disabled={loading}
//                   className="w-full px-4 py-3 pl-10 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
//                 />
//               </div>
//             </div>

//             {/* Email Field */}
//             <div className="group">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Email Address
//               </label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   placeholder="Enter your email"
//                   disabled={loading}
//                   className="w-full px-4 py-3 pl-10 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
//                 />
//               </div>
//             </div>

//             {/* Password Field */}
//             <div className="group">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Password{" "}
//                 {formData.email !== user.email
//                   ? "(required for email change)"
//                   : "(optional)"}
//               </label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                 <input
//                   type="password"
//                   name="password"
//                   value={formData.password}
//                   onChange={handleInputChange}
//                   placeholder={
//                     formData.email !== user.email
//                       ? "Enter current password"
//                       : "Enter new password"
//                   }
//                   disabled={loading}
//                   className="w-full px-4 py-3 pl-10 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Error/Success Messages */}
//           {error && (
//             <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
//               <p className="text-red-600 text-sm text-center">{error}</p>
//             </div>
//           )}

//           {success && (
//             <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl">
//               <p className="text-green-600 text-sm text-center">{success}</p>
//             </div>
//           )}

//           {/* Action Buttons */}
//           <div className="mt-6 space-y-3">
//             {/* Update Profile Button */}
//             <button
//               onClick={handleUpdateProfile}
//               disabled={loading}
//               className="w-full py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
//             >
//               {loading ? (
//                 <div className="flex items-center justify-center space-x-2">
//                   <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//                   <span>Updating...</span>
//                 </div>
//               ) : (
//                 <div className="flex items-center justify-center space-x-2">
//                   <Save className="w-4 h-4" />
//                   <span>Update Profile</span>
//                 </div>
//               )}
//             </button>

//             {/* Logout Button */}
//             <button
//               onClick={handleLogout}
//               disabled={loading}
//               className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
//             >
//               <div className="flex items-center justify-center space-x-2">
//                 <LogOut className="w-4 h-4" />
//                 <span>Sign Out</span>
//               </div>
//             </button>
//           </div>

//           {/* Account Info */}
//           <div className="mt-6 pt-4 border-t border-gray-200">
//             <p className="text-xs text-gray-500 text-center">
//               Account ID: {user?.$id}
//             </p>
//             <p className="text-xs text-gray-500 text-center mt-1">
//               Member since: {new Date(user?.$createdAt).toLocaleDateString()}
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserProfileModal;
