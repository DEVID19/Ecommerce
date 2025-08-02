import { Client, Databases, ID, Permission, Query, Role } from "appwrite";
import { toast } from "react-toastify";

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT) // Replace with your Appwrite endpoint
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID); // Replace with your project ID

const databases = new Databases(client);
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_CART_COLLECTION_ID;

// Create a new cart item
export const addToCart = async ({ userId, product }) => {
  try {
    const permissions = [
      `read("user:${userId}")`,
      `update("user:${userId}")`,
      `delete("user:${userId}")`,
      `write("user:${userId}")`,
    ];

    // 🔍 First: Check if this product already exists in the user's cart
    const existingItems = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [
        Query.equal("userId", [userId]),
        Query.equal("productId", [String(product.id)]),
      ]
    );

    if (existingItems.documents.length > 0) {
      const existingItem = existingItems.documents[0];

      // ✅ If exists: update quantity instead
      const updated = await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        existingItem.$id,
        {
          quantity: existingItem.quantity + 1,
        }
      );
      toast.warning("Product is already in cart");
      return updated;
    }

    const newItem = await databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID,
      ID.unique(),
      {
        userId,
        productId: String(product.id), // 🔥 Ensure it's a string
        title: product.title,
        image: product.image,
        price: product.price,
        quantity: 1,
        // total: product.price,
        // createdAt: new Date().toISOString(),
      },
      permissions,
      toast.success("Product is added to cart")
    );

    return newItem;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
};

export const removeFromCart = async (documentId) => {
  try {
    await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, documentId);
    toast.error("Item removed from cart");
  } catch (error) {
    console.error("Error removing from cart:", error);
    throw error;
  }
};

// eslint-disable-next-line no-unused-vars
export const updateQuantity = async (documentId, newQuantity, unitPrice) => {
  try {
    if (newQuantity < 1) {
      // 👇 Automatically remove the item
      await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, documentId);
      return { $id: documentId, deleted: true }; // send flag back
    }

    const updated = await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_ID,
      documentId,
      {
        quantity: newQuantity,
        // total: newQuantity * unitPrice,
      }
    );
    return updated;
  } catch (error) {
    console.error("Error updating quantity:", error);
    throw error;
  }
};

export const getUserCartItems = async (userId) => {
  try {
    const res = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      // Filter only current user's cart items
      //   `equal("userId", ["${userId}"])`,
      Query.equal("userId", [userId]), // ✅ Correct usage
    ]);
    return res.documents;
  } catch (error) {
    console.error("Error fetching cart items:", error);
    throw error;
  }
};

export const clearUserCart = async (userId) => {
  try {
    // First, get all cart items for the user
    const userCartItems = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [Query.equal("userId", [userId])]
    );

    // Delete each cart item
    const deletePromises = userCartItems.documents.map((item) =>
      databases.deleteDocument(DATABASE_ID, COLLECTION_ID, item.$id)
    );

    await Promise.all(deletePromises);

    console.log(
      `Cleared ${userCartItems.documents.length} items from user's cart`
    );
    return true;
  } catch (error) {
    console.error("Error clearing user cart:", error);
    throw error;
  }
};
