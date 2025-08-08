import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { databases, Query, storage } from "../../appwrite/appwriteClient";

const initialState = {
  user: null,
  isAdmin: false,
  isAuthenticated: false,
  isAnonymous: false,
  userRole: null, // 'user' | 'admin' | null
  profileImage: null,
  profileImageLoading: false,
  profileImageError: null,
  // Admin specific states
  adminProfile: null,
  adminProfileImage: null,
  adminProfileImageLoading: false,
  adminProfileImageError: null,
  // Loading states
  adminDataLoading: false,
  adminDataError: null,
  roleCheckLoading: false,
};

const ADMIN_EMAILS = [
  "admin1@gmail.com",
  "admin2@gmail.com",
  "admin3@gmail.com",
];

// Check user role from database
export const checkUserRole = createAsyncThunk(
  "auth/checkUserRole",
  async (user, { rejectWithValue }) => {
    try {
      const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
      const ADMINS_COLLECTION_ID =
        import.meta.env.VITE_APPWRITE_ADMINS_COLLECTION_ID || "admins";
      const USERS_COLLECTION_ID = import.meta.env
        .VITE_APPWRITE_USERS_COLLECTION_ID;

      // First check if user is admin by email
      if (ADMIN_EMAILS.includes(user.email)) {
        // Check admin collection
        const adminCheck = await databases.listDocuments(
          DATABASE_ID,
          ADMINS_COLLECTION_ID,
          [Query.equal("userId", user.$id), Query.limit(1)]
        );

        if (adminCheck.documents.length > 0) {
          return { role: "admin", profile: adminCheck.documents[0] };
        }
      }

      // Check user collection
      const userCheck = await databases.listDocuments(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        [Query.equal("userId", user.$id), Query.limit(1)]
      );

      if (userCheck.documents.length > 0) {
        return { role: "user", profile: userCheck.documents[0] };
      }

      return { role: null, profile: null };
    } catch (error) {
      console.error("Role check failed:", error);
      return rejectWithValue(error.message);
    }
  }
);

// ✅ IMPROVED: Load complete admin data with better error handling
export const loadAdminData = createAsyncThunk(
  "auth/loadAdminData",
  async (userId, { rejectWithValue }) => {
    try {
      const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
      const ADMINS_COLLECTION_ID =
        import.meta.env.VITE_APPWRITE_ADMINS_COLLECTION_ID || "admins";
      const BUCKET_ID = import.meta.env.VITE_APPWRITE_MAIN_BUCKET_ID;

      console.log("🔄 Loading complete admin data for user:", userId);

      // Fetch admin profile from database
      const response = await databases.listDocuments(
        DATABASE_ID,
        ADMINS_COLLECTION_ID,
        [Query.equal("userId", userId), Query.limit(1)]
      );

      let adminProfile = null;
      let adminProfileImage = null;

      if (response.documents.length > 0) {
        adminProfile = response.documents[0];
        console.log("✅ Admin profile found:", adminProfile);

        // Load profile image if exists
        if (adminProfile.profileImage) {
          try {
            const imageUrlResult = storage.getFileView(
              BUCKET_ID,
              adminProfile.profileImage
            );
            const finalImageUrl =
              typeof imageUrlResult === "string"
                ? imageUrlResult
                : imageUrlResult.href;

            if (finalImageUrl) {
              adminProfileImage = {
                fileId: adminProfile.profileImage,
                url: finalImageUrl,
                fileName: "admin-profile-image",
                cacheKey: Date.now(),
                updatedAt: new Date().toISOString(),
              };
              console.log("✅ Admin profile image loaded:", adminProfileImage);
            }
          } catch (imgError) {
            console.log("⚠️ Admin profile image not found:", imgError);
          }
        }
      } else {
        console.log("⚠️ No admin profile found in database for user:", userId);
      }

      return { adminProfile, adminProfileImage };
    } catch (error) {
      console.error("❌ Failed to load admin data:", error);
      return rejectWithValue(error.message);
    }
  }
);

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
          }
        }
      }

      return null;
    } catch (error) {
      console.error("Failed to load profile image:", error);
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

      state.user = user;
      state.isAnonymous = isAnon;
      state.isAuthenticated = !isAnon;
      state.isAdmin = false; // Regular user is never admin
      state.userRole = isAnon ? null : "user";

      // Clear admin data when setting regular user
      state.adminProfile = null;
      state.adminProfileImage = null;
      state.adminDataLoading = false;
      state.adminDataError = null;

      console.log("✅ Regular user set in Redux:", user.email);
    },

    setAdmin: (state, action) => {
      const userData = action.payload;
      const isAllowed = ADMIN_EMAILS.includes(userData.email);

      if (isAllowed) {
        state.user = userData;
        state.isAuthenticated = true;
        state.isAdmin = true;
        state.isAnonymous = false;
        state.userRole = "admin";

        // Clear regular user data when setting admin
        state.profileImage = null;
        state.profileImageLoading = false;
        state.profileImageError = null;

        console.log("✅ Admin user set in Redux:", userData.email);
      } else {
        console.log("❌ Unauthorized admin attempt:", userData.email);
        // If not allowed, logout
        Object.assign(state, initialState);
      }
    },

    updateUserProfile: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        console.log("✅ User profile updated in Redux");
      }
    },

    // ✅ IMPROVED: Admin profile actions with better logging
    setAdminProfile: (state, action) => {
      state.adminProfile = action.payload;
      state.adminDataError = null;
      console.log("✅ Admin profile set in Redux:", action.payload?.$id);
    },

    updateAdminProfile: (state, action) => {
      if (state.adminProfile) {
        state.adminProfile = { ...state.adminProfile, ...action.payload };
        console.log(
          "✅ Admin profile updated in Redux:",
          state.adminProfile.$id
        );
      }
    },

    setAdminProfileImage: (state, action) => {
      console.log(
        "✅ Setting admin profile image in Redux:",
        action.payload.fileId
      );
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
    },

    clearAdminProfileImage: (state) => {
      console.log("🗑️ Clearing admin profile image from Redux");
      state.adminProfileImage = null;
      state.adminProfileImageError = null;
      state.adminProfileImageLoading = false;
    },

    refreshAdminProfileImage: (state) => {
      if (state.adminProfileImage) {
        state.adminProfileImage.cacheKey = Date.now();
        state.adminProfileImage.updatedAt = new Date().toISOString();
        console.log("🔄 Admin profile image refreshed in Redux");
      }
    },

    // Regular user profile actions
    setProfileImage: (state, action) => {
      console.log("✅ Setting profile image in Redux:", action.payload.fileId);
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
    },

    clearProfileImage: (state) => {
      console.log("🗑️ Clearing profile image from Redux");
      state.profileImage = null;
      state.profileImageError = null;
      state.profileImageLoading = false;
    },

    refreshProfileImage: (state) => {
      if (state.profileImage) {
        state.profileImage.cacheKey = Date.now();
        state.profileImage.updatedAt = new Date().toISOString();
        console.log("🔄 Profile image refreshed in Redux");
      }
    },

    // ✅ IMPROVED: Better logout handling
    logout: (state) => {
      console.log("🚪 Logging out user...");
      // Reset to initial state
      Object.assign(state, initialState);
    },

    // ✅ NEW: Clear admin data specifically
    clearAdminData: (state) => {
      console.log("🗑️ Clearing admin data from Redux");
      state.adminProfile = null;
      state.adminProfileImage = null;
      state.adminDataLoading = false;
      state.adminDataError = null;
      state.adminProfileImageLoading = false;
      state.adminProfileImageError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Check user role
      .addCase(checkUserRole.pending, (state) => {
        state.roleCheckLoading = true;
      })
      .addCase(checkUserRole.fulfilled, (state, action) => {
        state.roleCheckLoading = false;
        if (action.payload) {
          state.userRole = action.payload.role;
          if (action.payload.role === "admin") {
            state.isAdmin = true;
            if (action.payload.profile) {
              state.adminProfile = action.payload.profile;
            }
          }
        }
      })
      .addCase(checkUserRole.rejected, (state, action) => {
        state.roleCheckLoading = false;
        console.error("❌ Role check failed:", action.payload);
      })
      // ✅ IMPROVED: Load admin data reducers with better error handling
      .addCase(loadAdminData.pending, (state) => {
        if (!state.adminDataLoading) {
          state.adminDataLoading = true;
          state.adminDataError = null;
          console.log("🔄 Loading admin data...");
        }
      })
      .addCase(loadAdminData.fulfilled, (state, action) => {
        state.adminDataLoading = false;
        if (action.payload) {
          if (action.payload.adminProfile) {
            state.adminProfile = action.payload.adminProfile;
            console.log("✅ Admin profile loaded successfully");
          }
          if (action.payload.adminProfileImage) {
            state.adminProfileImage = action.payload.adminProfileImage;
            console.log("✅ Admin profile image loaded successfully");
          }
        }
        state.adminDataError = null;
      })
      .addCase(loadAdminData.rejected, (state, action) => {
        state.adminDataLoading = false;
        state.adminDataError = action.payload || "Failed to load admin data";
        console.error("❌ Admin data loading failed:", action.payload);
      })
      // User profile image reducers
      .addCase(loadUserProfileImage.pending, (state) => {
        if (!state.profileImage?.url && !state.profileImageLoading) {
          state.profileImageLoading = true;
          state.profileImageError = null;
        }
      })
      .addCase(loadUserProfileImage.fulfilled, (state, action) => {
        state.profileImageLoading = false;
        if (action.payload && action.payload.url) {
          state.profileImage = action.payload;
          console.log("✅ User profile image loaded successfully");
        }
        state.profileImageError = null;
      })
      .addCase(loadUserProfileImage.rejected, (state, action) => {
        state.profileImageLoading = false;
        state.profileImageError =
          action.payload || "Failed to load profile image";
        console.error("❌ User profile image loading failed:", action.payload);
      });
  },
});

export const {
  setUser,
  setAdmin,
  updateUserProfile,
  setProfileImage,
  clearProfileImage,
  refreshProfileImage,
  // Admin actions
  setAdminProfile,
  updateAdminProfile,
  setAdminProfileImage,
  clearAdminProfileImage,
  refreshAdminProfileImage,
  clearAdminData,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
