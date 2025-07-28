// src/redux/slices/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAdmin: false,
  isAuthenticated: false,
  isAnonymous: false,
  profileImage: null, // Store profile image data
};

const ADMIN_EMAILS = [
  "admin@zaptra.com",
  "admin2@example.com",
  "admin3@example.com",
];

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const user = action.payload;
      const isAnon = user.labels?.includes("anonymous") || false;
      state.user = user;
      state.isAnonymous = isAnon;
      state.isAuthenticated = !isAnon; // ✅ Only mark as authenticated if not anonymous
      state.isAdmin = ADMIN_EMAILS.includes(user.email);
    },

    // For admin login only (used on AdminLogin.jsx)
    setAdmin: (state, action) => {
      const userData = action.payload;
      const isAllowed = ADMIN_EMAILS.includes(userData.email);

      if (isAllowed) {
        state.user = userData;
        state.isAuthenticated = true;
        state.isAdmin = true;
      } else {
        // fallback: deny access if email is not in list
        state.user = null;
        state.isAuthenticated = false;
        state.isAdmin = false;
        state.profileImage = null;
      }
    },

    // Update user profile data
    updateUserProfile: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },

    // Set profile image with complete data
    setProfileImage: (state, action) => {
      state.profileImage = {
        fileId: action.payload.fileId,
        url: action.payload.url,
        fileName: action.payload.fileName,
        updatedAt: new Date().toISOString(),
        ...action.payload,
      };
    },

    // Clear profile image
    clearProfileImage: (state) => {
      state.profileImage = null;
    },

    // Update profile image URL (for refresh scenarios)
    updateProfileImageUrl: (state, action) => {
      if (state.profileImage) {
        state.profileImage.url = action.payload.url;
        state.profileImage.updatedAt = new Date().toISOString();
      }
    },

    // Logout
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isAdmin = false;
      state.profileImage = null;
    },
  },
});

export const {
  setUser,
  setAdmin,
  updateUserProfile,
  setProfileImage,
  clearProfileImage,
  updateProfileImageUrl,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
