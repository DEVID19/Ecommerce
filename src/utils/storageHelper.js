// utils/storageHelper.js
import { storage } from "../appwrite/appwriteClient";
import { ID } from "appwrite";

const BUCKET_ID = "6885c534001f3de65466"; // Your existing bucket ID

// File naming conventions
const FILE_PREFIXES = {
  PRODUCT: "product_",
  PROFILE: "profile_",
  CATEGORY: "category_",
};

// Generate organized file names
const generateFileName = (type, identifier, originalName) => {
  const timestamp = Date.now();
  const fileExtension = originalName.split(".").pop();
  const cleanName = originalName.replace(/[^a-zA-Z0-9.]/g, "_");

  switch (type) {
    case "product":
      return `${FILE_PREFIXES.PRODUCT}${identifier}_${timestamp}.${fileExtension}`;
    case "profile":
      return `${FILE_PREFIXES.PROFILE}${identifier}_${timestamp}.${fileExtension}`;
    case "category":
      return `${FILE_PREFIXES.CATEGORY}${identifier}_${timestamp}.${fileExtension}`;
    default:
      return `general_${timestamp}_${cleanName}`;
  }
};

// Upload product image
export const uploadProductImage = async (file, productId) => {
  try {
    const fileName = generateFileName("product", productId, file.name);
    const response = await storage.createFile(BUCKET_ID, ID.unique(), file);

    return {
      fileId: response.$id,
      fileName: fileName,
      url: getFilePreview(response.$id),
      type: "product",
    };
  } catch (error) {
    console.error("Product image upload error:", error);
    throw error;
  }
};

// Upload user profile image
export const uploadProfileImage = async (file, userId) => {
  try {
    const fileName = generateFileName("profile", userId, file.name);
    const response = await storage.createFile(BUCKET_ID, ID.unique(), file);

    return {
      fileId: response.$id,
      fileName: fileName,
      url: getFilePreview(response.$id),
      type: "profile",
    };
  } catch (error) {
    console.error("Profile image upload error:", error);
    throw error;
  }
};

// Get file preview URL
export const getFilePreview = (
  fileId,
  width = 400,
  height = 400,
  quality = 80
) => {
  try {
    return storage.getFilePreview(
      BUCKET_ID,
      fileId,
      width,
      height,
      "center",
      quality
    );
  } catch (error) {
    console.error("File preview error:", error);
    return null;
  }
};

// Get file download URL
export const getFileDownload = (fileId) => {
  try {
    return storage.getFileDownload(BUCKET_ID, fileId);
  } catch (error) {
    console.error("File download error:", error);
    return null;
  }
};

// Delete file
export const deleteFile = async (fileId) => {
  try {
    await storage.deleteFile(BUCKET_ID, fileId);
    return true;
  } catch (error) {
    console.error("File delete error:", error);
    throw error;
  }
};

// List files by type (using file name prefix)
export const listFilesByType = async (type, limit = 25) => {
  try {
    const files = await storage.listFiles(BUCKET_ID, [], limit);
    const prefix = FILE_PREFIXES[type.toUpperCase()];

    if (prefix) {
      return files.files.filter((file) => file.name?.startsWith(prefix));
    }

    return files.files;
  } catch (error) {
    console.error("List files error:", error);
    return [];
  }
};

// Search files by user ID (for profiles)
export const getUserProfileImages = async (userId) => {
  try {
    const files = await storage.listFiles(BUCKET_ID);
    return files.files.filter(
      (file) =>
        file.name?.startsWith(FILE_PREFIXES.PROFILE) &&
        file.name?.includes(userId)
    );
  } catch (error) {
    console.error("Get user profile images error:", error);
    return [];
  }
};

// Search files by product ID
export const getProductImages = async (productId) => {
  try {
    const files = await storage.listFiles(BUCKET_ID);
    return files.files.filter(
      (file) =>
        file.name?.startsWith(FILE_PREFIXES.PRODUCT) &&
        file.name?.includes(productId)
    );
  } catch (error) {
    console.error("Get product images error:", error);
    return [];
  }
};

export default {
  uploadProductImage,
  uploadProfileImage,
  getFilePreview,
  getFileDownload,
  deleteFile,
  listFilesByType,
  getUserProfileImages,
  getProductImages,
};
