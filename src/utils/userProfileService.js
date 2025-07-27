// services/userProfileService.js
import { databases, account, ID, Query } from "../appwrite/appwriteClient";

// You'll need to create this database and collection in your Appwrite console
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID; // Replace with your database ID
const USER_PROFILES_COLLECTION_ID = import.meta.env.VITE_USER_PROFILES_COLLECTION_ID; // Create this collection
/**
 * User Profile Collection Schema:
 * - userId (string, required) - Link to Appwrite auth user
 * - profileImageFileId (string, optional) - File ID from storage
 * - profileImageUrl (string, optional) - Cached URL for quick access
 * - updatedAt (datetime, required) - Last update timestamp
 * - createdAt (datetime, required) - Creation timestamp
 */

class UserProfileService {
  // Create or update user profile
  async createOrUpdateProfile(userId, profileData) {
    try {
      // First, try to get existing profile
      const existingProfile = await this.getUserProfile(userId);

      if (existingProfile) {
        // Update existing profile
        return await databases.updateDocument(
          DATABASE_ID,
          USER_PROFILES_COLLECTION_ID,
          existingProfile.$id,
          {
            ...profileData,
            updatedAt: new Date().toISOString(),
          }
        );
      } else {
        // Create new profile
        return await databases.createDocument(
          DATABASE_ID,
          USER_PROFILES_COLLECTION_ID,
          ID.unique(),
          {
            userId,
            ...profileData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        );
      }
    } catch (error) {
      console.error("Error creating/updating user profile:", error);
      throw error;
    }
  }

  // Get user profile by user ID
  async getUserProfile(userId) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        USER_PROFILES_COLLECTION_ID,
        [Query.equal("userId", userId), Query.limit(1)]
      );

      return response.documents.length > 0 ? response.documents[0] : null;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  }

  // Update profile image
  async updateProfileImage(userId, fileId, imageUrl) {
    try {
      return await this.createOrUpdateProfile(userId, {
        profileImageFileId: fileId,
        profileImageUrl: imageUrl,
      });
    } catch (error) {
      console.error("Error updating profile image:", error);
      throw error;
    }
  }

  // Get current user profile (uses current session)
  async getCurrentUserProfile() {
    try {
      const currentUser = await account.get();
      if (currentUser?.$id) {
        return await this.getUserProfile(currentUser.$id);
      }
      return null;
    } catch (error) {
      console.error("Error getting current user profile:", error);
      return null;
    }
  }

  // Delete user profile
  async deleteUserProfile(userId) {
    try {
      const profile = await this.getUserProfile(userId);
      if (profile) {
        await databases.deleteDocument(
          DATABASE_ID,
          USER_PROFILES_COLLECTION_ID,
          profile.$id
        );
      }
      return true;
    } catch (error) {
      console.error("Error deleting user profile:", error);
      throw error;
    }
  }
}

export const userProfileService = new UserProfileService();
export default UserProfileService;
