// src/appwrite/cartService.js
import { databases } from "./config"; // your Appwrite config
import { ID, Query } from "appwrite";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const CART_COLLECTION_ID = import.meta.env.VITE_APPWRITE_CART_COLLECTION_ID;
const PRODUCTS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_PRODUCTS_COLLECTION_ID;

// ✅ Add item to cart
export const addToCart = async (userId, product) => {
  try {
    const res = await databases.createDocument(
      DATABASE_ID,
      CART_COLLECTION_ID, // ✅ fixed here
      ID.unique(),
      {
        userId,
        productId: product.id,
        title: product.title,
        price: product.price,
        quantity: product.quantity,
        image: product.image,
        size: product.size || null, // optional chaining
      }
    );
    return res;
  } catch (err) {
    console.error("Add to cart error:", err);
    return null;
  }
};

// ✅ Get cart items by user ID
export const getCartItems = async (userId) => {
  try {
    const res = await databases.listDocuments(DATABASE_ID, CART_COLLECTION_ID, [
      Query.equal("userId", userId),
    ]);
    return res.documents;
  } catch (err) {
    console.error("Get cart items error:", err);
    return [];
  }
};

// ✅ Update cart item
export const updateCartItem = async (documentId, updatedFields) => {
  try {
    const res = await databases.updateDocument(
      DATABASE_ID,
      CART_COLLECTION_ID, // ✅ fixed here
      documentId,
      updatedFields
    );
    return res;
  } catch (err) {
    console.error("Update cart item error:", err);
    return null;
  }
};

// ✅ Delete cart item
export const deleteCartItem = async (documentId) => {
  try {
    await databases.deleteDocument(DATABASE_ID, CART_COLLECTION_ID, documentId);
    return true;
  } catch (err) {
    console.error("Delete cart item error:", err);
    return false;
  }
};
