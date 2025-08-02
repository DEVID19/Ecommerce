// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { databases, Query, storage } from "../../appwrite/appwriteClient";

// const initialState = {
//   user: null,
//   isAdmin: false,
//   isAuthenticated: false,
//   isAnonymous: false,
//   profileImage: null,
//   profileImageLoading: false,
//   profileImageError: null,
// };

// const ADMIN_EMAILS = [
//   "admin@zaptra.com",
//   "admin2@example.com",
//   "admin3@example.com",
// ];

// // Async thunk to load profile image - FIXED to prevent unnecessary loading
// export const loadUserProfileImage = createAsyncThunk(
//   "auth/loadUserProfileImage",
//   async (userId, { rejectWithValue, getState }) => {
//     try {
//       // Check if we already have a profile image - FIXED
//       const currentState = getState();
//       if (currentState.auth.profileImage?.url) {
//         console.log("Profile image already loaded, skipping...");
//         return currentState.auth.profileImage;
//       }

//       const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
//       const USERS_COLLECTION_ID = import.meta.env
//         .VITE_APPWRITE_USERS_COLLECTION_ID;
//       const BUCKET_ID = import.meta.env.VITE_APPWRITE_MAIN_BUCKET_ID;

//       console.log("Loading profile image for user:", userId);

//       // Fetch user document from database
//       const response = await databases.listDocuments(
//         DATABASE_ID,
//         USERS_COLLECTION_ID,
//         [Query.equal("userId", userId), Query.limit(1)]
//       );

//       if (response.documents.length > 0) {
//         const userDoc = response.documents[0];

//         if (userDoc.profileImage) {
//           // Get image URL - FIXED
//           const imageUrlResult = storage.getFileView(
//             BUCKET_ID,
//             userDoc.profileImage
//           );
//           const finalImageUrl =
//             typeof imageUrlResult === "string"
//               ? imageUrlResult
//               : imageUrlResult.href;

//           if (finalImageUrl) {
//             const profileImageData = {
//               fileId: userDoc.profileImage,
//               url: finalImageUrl,
//               fileName: "profile-image",
//               cacheKey: Date.now(),
//               updatedAt: new Date().toISOString(),
//             };

//             console.log("Profile image found:", profileImageData);
//             return profileImageData;
//           } else {
//             console.log("Failed to generate image URL");
//             return rejectWithValue("Failed to generate image URL");
//           }
//         } else {
//           console.log("No profile image found for user");
//         }
//       } else {
//         console.log("User document not found");
//       }

//       return null;
//     } catch (error) {
//       console.error("Failed to load profile image:", error);
//       return rejectWithValue(error.message);
//     }
//   }
// );

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     setUser: (state, action) => {
//       const user = action.payload;
//       const isAnon = user.labels?.includes("anonymous") || false;
//       state.user = user;
//       state.isAnonymous = isAnon;
//       state.isAuthenticated = !isAnon;
//       state.isAdmin = ADMIN_EMAILS.includes(user.email);
//     },

//     setAdmin: (state, action) => {
//       const userData = action.payload;
//       const isAllowed = ADMIN_EMAILS.includes(userData.email);

//       if (isAllowed) {
//         state.user = userData;
//         state.isAuthenticated = true;
//         state.isAdmin = true;
//       } else {
//         state.user = null;
//         state.isAuthenticated = false;
//         state.isAdmin = false;
//         state.profileImage = null;
//       }
//     },

//     updateUserProfile: (state, action) => {
//       if (state.user) {
//         state.user = { ...state.user, ...action.payload };
//       }
//     },

//     setProfileImage: (state, action) => {
//       console.log("Setting profile image in Redux:", action.payload);
//       state.profileImage = {
//         fileId: action.payload.fileId,
//         url: action.payload.url,
//         fileName: action.payload.fileName,
//         updatedAt: new Date().toISOString(),
//         cacheKey: action.payload.cacheKey || Date.now(),
//         ...action.payload,
//       };
//       state.profileImageError = null; // Clear any previous errors
//       // Clear loading state when image is set
//       state.profileImageLoading = false;
//       console.log("Profile image set in Redux:", state.profileImage);
//     },

//     clearProfileImage: (state) => {
//       console.log("Clearing profile image from Redux");
//       state.profileImage = null;
//       state.profileImageError = null;
//       state.profileImageLoading = false;
//     },

//     updateProfileImageUrl: (state, action) => {
//       if (state.profileImage) {
//         state.profileImage.url = action.payload.url;
//         state.profileImage.updatedAt = new Date().toISOString();
//         state.profileImage.cacheKey = Date.now();
//         console.log("Updated profile image URL:", state.profileImage);
//       }
//     },

//     refreshProfileImage: (state) => {
//       if (state.profileImage) {
//         state.profileImage.cacheKey = Date.now();
//         state.profileImage.updatedAt = new Date().toISOString();
//         console.log(
//           "Profile image refreshed with new cache key:",
//           state.profileImage.cacheKey
//         );
//       }
//     },

//     logout: (state) => {
//       state.user = null;
//       state.isAuthenticated = false;
//       state.isAdmin = false;
//       state.profileImage = null;
//       state.profileImageLoading = false;
//       state.profileImageError = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(loadUserProfileImage.pending, (state) => {
//         // Only set loading if we don't already have an image
//         if (!state.profileImage?.url) {
//           state.profileImageLoading = true;
//           state.profileImageError = null;
//           console.log("Profile image loading started...");
//         }
//       })
//       .addCase(loadUserProfileImage.fulfilled, (state, action) => {
//         state.profileImageLoading = false;
//         if (action.payload && action.payload.url) {
//           state.profileImage = action.payload;
//           console.log("Profile image loaded successfully:", action.payload);
//         } else {
//           console.log("No profile image found for user");
//         }
//         state.profileImageError = null;
//       })
//       .addCase(loadUserProfileImage.rejected, (state, action) => {
//         state.profileImageLoading = false;
//         state.profileImageError =
//           action.payload || "Failed to load profile image";
//         console.error("Profile image loading failed:", action.payload);
//       });
//   },
// });

// export const {
//   setUser,
//   setAdmin,
//   updateUserProfile,
//   setProfileImage,
//   clearProfileImage,
//   updateProfileImageUrl,
//   refreshProfileImage,
//   logout,
// } = authSlice.actions;

// export default authSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { databases, Query, storage } from "../../appwrite/appwriteClient";

const initialState = {
  user: null,
  isAdmin: false,
  isAuthenticated: false,
  isAnonymous: false,
  profileImage: null,
  profileImageLoading: false,
  profileImageError: null,
  // Admin specific states
  adminProfile: null,
  adminProfileImage: null,
  adminProfileImageLoading: false,
  adminProfileImageError: null,
};

const ADMIN_EMAILS = [
  "admin@zaptra.com",
  "admin2@example.com",
  "admin3@example.com",
];

// Load user profile image
export const loadUserProfileImage = createAsyncThunk(
  "auth/loadUserProfileImage",
  async (userId, { rejectWithValue, getState }) => {
    try {
      const currentState = getState();
      if (currentState.auth.profileImage?.url) {
        console.log("Profile image already loaded, skipping...");
        return currentState.auth.profileImage;
      }

      const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
      const USERS_COLLECTION_ID = import.meta.env
        .VITE_APPWRITE_USERS_COLLECTION_ID;
      const BUCKET_ID = import.meta.env.VITE_APPWRITE_MAIN_BUCKET_ID;

      console.log("Loading profile image for user:", userId);

      const response = await databases.listDocuments(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        [Query.equal("userId", userId), Query.limit(1)]
      );

      if (response.documents.length > 0) {
        const userDoc = response.documents[0];

        if (userDoc.profileImage) {
          const imageUrlResult = storage.getFileView(
            BUCKET_ID,
            userDoc.profileImage
          );
          const finalImageUrl =
            typeof imageUrlResult === "string"
              ? imageUrlResult
              : imageUrlResult.href;

          if (finalImageUrl) {
            const profileImageData = {
              fileId: userDoc.profileImage,
              url: finalImageUrl,
              fileName: "profile-image",
              cacheKey: Date.now(),
              updatedAt: new Date().toISOString(),
            };

            console.log("Profile image found:", profileImageData);
            return profileImageData;
          } else {
            console.log("Failed to generate image URL");
            return rejectWithValue("Failed to generate image URL");
          }
        } else {
          console.log("No profile image found for user");
        }
      } else {
        console.log("User document not found");
      }

      return null;
    } catch (error) {
      console.error("Failed to load profile image:", error);
      return rejectWithValue(error.message);
    }
  }
);

// NEW: Load admin profile image
export const loadAdminProfileImage = createAsyncThunk(
  "auth/loadAdminProfileImage",
  async (userId, { rejectWithValue, getState }) => {
    try {
      const currentState = getState();
      if (currentState.auth.adminProfileImage?.url) {
        console.log("Admin profile image already loaded, skipping...");
        return currentState.auth.adminProfileImage;
      }

      const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
      const ADMINS_COLLECTION_ID =
        import.meta.env.VITE_APPWRITE_ADMINS_COLLECTION_ID || "admins";
      const BUCKET_ID = import.meta.env.VITE_APPWRITE_MAIN_BUCKET_ID;

      console.log("Loading admin profile image for user:", userId);

      const response = await databases.listDocuments(
        DATABASE_ID,
        ADMINS_COLLECTION_ID,
        [Query.equal("userId", userId), Query.limit(1)]
      );

      if (response.documents.length > 0) {
        const adminDoc = response.documents[0];

        if (adminDoc.profileImage) {
          const imageUrlResult = storage.getFileView(
            BUCKET_ID,
            adminDoc.profileImage
          );
          const finalImageUrl =
            typeof imageUrlResult === "string"
              ? imageUrlResult
              : imageUrlResult.href;

          if (finalImageUrl) {
            const profileImageData = {
              fileId: adminDoc.profileImage,
              url: finalImageUrl,
              fileName: "admin-profile-image",
              cacheKey: Date.now(),
              updatedAt: new Date().toISOString(),
            };

            console.log("Admin profile image found:", profileImageData);
            return profileImageData;
          }
        }
      }

      return null;
    } catch (error) {
      console.error("Failed to load admin profile image:", error);
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const user = action.payload;
      const isAnon = user.labels?.includes("anonymous") || false;
      const isAdminUser = ADMIN_EMAILS.includes(user.email);

      state.user = user;
      state.isAnonymous = isAnon;
      state.isAuthenticated = !isAnon;
      state.isAdmin = isAdminUser && !isAnon;

      // Clear admin data if not admin
      if (!isAdminUser) {
        state.adminProfile = null;
        state.adminProfileImage = null;
      }
    },

    setAdmin: (state, action) => {
      const userData = action.payload;
      const isAllowed = ADMIN_EMAILS.includes(userData.email);

      if (isAllowed) {
        state.user = userData;
        state.isAuthenticated = true;
        state.isAdmin = true;
        state.isAnonymous = false;
      } else {
        state.user = null;
        state.isAuthenticated = false;
        state.isAdmin = false;
        state.profileImage = null;
        state.adminProfile = null;
        state.adminProfileImage = null;
      }
    },

    updateUserProfile: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },

    // NEW: Admin profile actions
    setAdminProfile: (state, action) => {
      state.adminProfile = action.payload;
    },

    updateAdminProfile: (state, action) => {
      if (state.adminProfile) {
        state.adminProfile = { ...state.adminProfile, ...action.payload };
      }
    },

    setAdminProfileImage: (state, action) => {
      console.log("Setting admin profile image in Redux:", action.payload);
      state.adminProfileImage = {
        fileId: action.payload.fileId,
        url: action.payload.url,
        fileName: action.payload.fileName,
        updatedAt: new Date().toISOString(),
        cacheKey: action.payload.cacheKey || Date.now(),
        ...action.payload,
      };
      state.adminProfileImageError = null;
      state.adminProfileImageLoading = false;
      console.log("Admin profile image set in Redux:", state.adminProfileImage);
    },

    clearAdminProfileImage: (state) => {
      console.log("Clearing admin profile image from Redux");
      state.adminProfileImage = null;
      state.adminProfileImageError = null;
      state.adminProfileImageLoading = false;
    },

    updateAdminProfileImageUrl: (state, action) => {
      if (state.adminProfileImage) {
        state.adminProfileImage.url = action.payload.url;
        state.adminProfileImage.updatedAt = new Date().toISOString();
        state.adminProfileImage.cacheKey = Date.now();
        console.log(
          "Updated admin profile image URL:",
          state.adminProfileImage
        );
      }
    },

    refreshAdminProfileImage: (state) => {
      if (state.adminProfileImage) {
        state.adminProfileImage.cacheKey = Date.now();
        state.adminProfileImage.updatedAt = new Date().toISOString();
        console.log(
          "Admin profile image refreshed with new cache key:",
          state.adminProfileImage.cacheKey
        );
      }
    },

    // Existing actions
    setProfileImage: (state, action) => {
      console.log("Setting profile image in Redux:", action.payload);
      state.profileImage = {
        fileId: action.payload.fileId,
        url: action.payload.url,
        fileName: action.payload.fileName,
        updatedAt: new Date().toISOString(),
        cacheKey: action.payload.cacheKey || Date.now(),
        ...action.payload,
      };
      state.profileImageError = null;
      state.profileImageLoading = false;
      console.log("Profile image set in Redux:", state.profileImage);
    },

    clearProfileImage: (state) => {
      console.log("Clearing profile image from Redux");
      state.profileImage = null;
      state.profileImageError = null;
      state.profileImageLoading = false;
    },

    updateProfileImageUrl: (state, action) => {
      if (state.profileImage) {
        state.profileImage.url = action.payload.url;
        state.profileImage.updatedAt = new Date().toISOString();
        state.profileImage.cacheKey = Date.now();
        console.log("Updated profile image URL:", state.profileImage);
      }
    },

    refreshProfileImage: (state) => {
      if (state.profileImage) {
        state.profileImage.cacheKey = Date.now();
        state.profileImage.updatedAt = new Date().toISOString();
        console.log(
          "Profile image refreshed with new cache key:",
          state.profileImage.cacheKey
        );
      }
    },

    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isAdmin = false;
      state.isAnonymous = false;
      state.profileImage = null;
      state.profileImageLoading = false;
      state.profileImageError = null;
      // Clear admin data
      state.adminProfile = null;
      state.adminProfileImage = null;
      state.adminProfileImageLoading = false;
      state.adminProfileImageError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // User profile image reducers
      .addCase(loadUserProfileImage.pending, (state) => {
        if (!state.profileImage?.url) {
          state.profileImageLoading = true;
          state.profileImageError = null;
          console.log("Profile image loading started...");
        }
      })
      .addCase(loadUserProfileImage.fulfilled, (state, action) => {
        state.profileImageLoading = false;
        if (action.payload && action.payload.url) {
          state.profileImage = action.payload;
          console.log("Profile image loaded successfully:", action.payload);
        } else {
          console.log("No profile image found for user");
        }
        state.profileImageError = null;
      })
      .addCase(loadUserProfileImage.rejected, (state, action) => {
        state.profileImageLoading = false;
        state.profileImageError =
          action.payload || "Failed to load profile image";
        console.error("Profile image loading failed:", action.payload);
      })
      // Admin profile image reducers
      .addCase(loadAdminProfileImage.pending, (state) => {
        if (!state.adminProfileImage?.url) {
          state.adminProfileImageLoading = true;
          state.adminProfileImageError = null;
          console.log("Admin profile image loading started...");
        }
      })
      .addCase(loadAdminProfileImage.fulfilled, (state, action) => {
        state.adminProfileImageLoading = false;
        if (action.payload && action.payload.url) {
          state.adminProfileImage = action.payload;
          console.log(
            "Admin profile image loaded successfully:",
            action.payload
          );
        } else {
          console.log("No admin profile image found");
        }
        state.adminProfileImageError = null;
      })
      .addCase(loadAdminProfileImage.rejected, (state, action) => {
        state.adminProfileImageLoading = false;
        state.adminProfileImageError =
          action.payload || "Failed to load admin profile image";
        console.error("Admin profile image loading failed:", action.payload);
      });
  },
});

export const {
  setUser,
  setAdmin,
  updateUserProfile,
  setProfileImage,
  clearProfileImage,
  updateProfileImageUrl,
  refreshProfileImage,
  // New admin actions
  setAdminProfile,
  updateAdminProfile,
  setAdminProfileImage,
  clearAdminProfileImage,
  updateAdminProfileImageUrl,
  refreshAdminProfileImage,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
