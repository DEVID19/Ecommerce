import { Client, Storage, Query, ID, Databases } from "appwrite";
import { toast } from "react-toastify";

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const databases = new Databases(client);
const storage = new Storage(client);

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const PRODUCTS_COLLECTION_ID = import.meta.env
  .VITE_APPWRITE_PRODUCTS_COLLECTION_ID;
const MAIN_BUCKET_ID = import.meta.env.VITE_APPWRITE_MAIN_BUCKET_ID;

// Upload image to bucket
export const uploadImage = async (file) => {
  try {
    const response = await storage.createFile(
      MAIN_BUCKET_ID,
      ID.unique(),
      file
    );
    const imageUrl = storage.getFileView(MAIN_BUCKET_ID, response.$id);
    return {
      fileId: response.$id,
      imageUrl: imageUrl,
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    toast.error("Failed to upload image");
    throw error;
  }
};

// Delete image from bucket
export const deleteImage = async (fileId) => {
  try {
    await storage.deleteFile(MAIN_BUCKET_ID, fileId);
  } catch (error) {
    console.error("Error deleting image:", error);
    // Don't throw error as this is cleanup operation
  }
};

// Get all products with pagination and sorting
export const getAllProducts = async (limit = 10, offset = 0) => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      PRODUCTS_COLLECTION_ID,
      [Query.orderDesc("$createdAt"), Query.limit(limit), Query.offset(offset)]
    );

    const products = response.documents.map((product) => ({
      id: product.$id,
      title: product.title || "",
      image: product.image || "",
      price: parseFloat(product.price || 0),
      description: product.description || "",
      brand: product.brand || "",
      model: product.model || "",
      color: product.color || "",
      category: product.category || "",
      discount: parseFloat(product.discount || 0),
      popular: product.popular || false,
      stock: parseInt(product.stock || 0),
      status: product.status || "active",
      onSale: product.onSale || false,
      createdAt: product.$createdAt,
      updatedAt: product.$updatedAt,
    }));

    return {
      products,
      total: response.total,
      hasMore: response.total > offset + limit,
    };
  } catch (error) {
    console.error("Error fetching all products:", error);
    toast.error("Failed to fetch products");
    throw error;
  }
};

// Get product by ID
export const getProductById = async (productId) => {
  try {
    const product = await databases.getDocument(
      DATABASE_ID,
      PRODUCTS_COLLECTION_ID,
      productId
    );

    return {
      id: product.$id,
      title: product.title || "",
      image: product.image || "",
      price: parseFloat(product.price || 0),
      description: product.description || "",
      brand: product.brand || "",
      model: product.model || "",
      color: product.color || "",
      category: product.category || "",
      discount: parseFloat(product.discount || 0),
      popular: product.popular || false,
      stock: parseInt(product.stock || 0),
      status: product.status || "active",
      onSale: product.onSale || false,
      createdAt: product.$createdAt,
      updatedAt: product.$updatedAt,
    };
  } catch (error) {
    console.error("Error fetching product:", error);
    toast.error("Failed to fetch product details");
    throw error;
  }
};

// Create new product
export const createProduct = async (productData, imageFile) => {
  try {
    let imageUrl = "";
    let fileId = "";

    // Upload image if provided
    if (imageFile) {
      const uploadResult = await uploadImage(imageFile);
      imageUrl = uploadResult?.imageUrl;
      fileId = uploadResult?.fileId;
    } else if (productData.imageUrl) {
      imageUrl = productData.imageUrl;
    }
    if (!imageUrl) {
      throw new Error("image is required but not provided.");
    }

    const newProduct = await databases.createDocument(
      DATABASE_ID,
      PRODUCTS_COLLECTION_ID,
      ID.unique(),
      {
        id: Date.now(),
        title: productData.title,
        image: imageUrl,
        price: parseFloat(productData.price),
        description: productData.description,
        brand: productData.brand,
        model: productData.model,
        color: productData.color,
        category: productData.category,
        discount: parseFloat(productData.discount || 0),
        popular: productData.popular || false,
        stock: parseInt(productData.stock),
        status: productData.status || "active",
        onSale: productData.onSale || false,
      }
    );

    toast.success("Product created successfully");
    return {
      ...newProduct,
      fileId, // Store for potential cleanup
    };
  } catch (error) {
    console.error("Error creating product:", error);
    toast.error("Failed to create product");
    throw error;
  }
};

// Update product
export const updateProduct = async (productId, productData, imageFile) => {
  try {
    let imageUrl = productData.image;
    let fileId = "";

    // Upload new image if provided
    if (imageFile) {
      const uploadResult = await uploadImage(imageFile);
      imageUrl = uploadResult.imageUrl;
      fileId = uploadResult.fileId;
    } else if (
      productData.imageUrl &&
      productData.imageUrl !== productData.image
    ) {
      imageUrl = productData.imageUrl;
    }

    const updatedProduct = await databases.updateDocument(
      DATABASE_ID,
      PRODUCTS_COLLECTION_ID,
      productId,
      {
        title: productData.title,
        image: imageUrl,
        price: parseFloat(productData.price),
        description: productData.description,
        brand: productData.brand,
        model: productData.model,
        color: productData.color,
        category: productData.category,
        discount: parseFloat(productData.discount || 0),
        popular: productData.popular || false,
        stock: parseInt(productData.stock),
        status: productData.status || "active",
        onSale: productData.onSale || false,
      }
    );

    toast.success("Product updated successfully");
    return updatedProduct;
  } catch (error) {
    console.error("Error updating product:", error);
    toast.error("Failed to update product");
    throw error;
  }
};

// Delete product
export const deleteProduct = async (productId) => {
  try {
    // Get product details first to get image info for cleanup
    const product = await getProductById(productId);

    // Delete the product document
    await databases.deleteDocument(
      DATABASE_ID,
      PRODUCTS_COLLECTION_ID,
      productId
    );

    // Try to delete associated image from storage if it exists
    // Note: This assumes the image URL contains the file ID, which might need adjustment
    // based on your URL structure

    toast.success("Product deleted successfully");
    return productId;
  } catch (error) {
    console.error("Error deleting product:", error);
    toast.error("Failed to delete product");
    throw error;
  }
};

// Search products by multiple criteria
export const searchProducts = async (searchTerm, limit = 100) => {
  try {
    const allProducts = await getAllProducts(limit, 0);

    const filteredProducts = allProducts.products.filter((product) => {
      const title = product.title.toLowerCase();
      const brand = product.brand.toLowerCase();
      const category = product.category.toLowerCase();
      const model = product.model.toLowerCase();
      const description = product.description.toLowerCase();
      const search = searchTerm.toLowerCase();

      return (
        title.includes(search) ||
        brand.includes(search) ||
        category.includes(search) ||
        model.includes(search) ||
        description.includes(search)
      );
    });

    return {
      products: filteredProducts,
      total: filteredProducts.length,
    };
  } catch (error) {
    console.error("Error searching products:", error);
    toast.error("Failed to search products");
    throw error;
  }
};

// Filter products by category
export const filterProductsByCategory = async (category, limit = 100) => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      PRODUCTS_COLLECTION_ID,
      [
        Query.equal("category", category),
        Query.orderDesc("$createdAt"),
        Query.limit(limit),
      ]
    );

    // 🔥 Log all categories from the fetched products
    const allCategories = response.documents.map((p) => p.category);
    console.log("Unique categories:", [...new Set(allCategories)]);

    const products = response.documents.map((product) => ({
      id: product.$id,
      title: product.title || "",
      image: product.image || "",
      price: parseFloat(product.price || 0),
      description: product.description || "",
      brand: product.brand || "",
      model: product.model || "",
      color: product.color || "",
      category: product.category || "",
      discount: parseFloat(product.discount || 0),
      popular: product.popular || false,
      stock: parseInt(product.stock || 0),
      status: product.status || "active",
      onSale: product.onSale || false,
      createdAt: product.$createdAt,
      updatedAt: product.$updatedAt,
    }));
    console.log(category);
    return {
      products,
      total: response.total,
    };
  } catch (error) {
    console.error("Error filtering products by category:", error);
    toast.error("Failed to filter products");
    throw error;
  }
};

// Filter products by status
export const filterProductsByStatus = async (status, limit = 100) => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      PRODUCTS_COLLECTION_ID,
      [
        Query.equal("status", status),
        Query.orderDesc("$createdAt"),
        Query.limit(limit),
      ]
    );

    const products = response.documents.map((product) => ({
      id: product.$id,
      title: product.title || "",
      image: product.image || "",
      price: parseFloat(product.price || 0),
      description: product.description || "",
      brand: product.brand || "",
      model: product.model || "",
      color: product.color || "",
      category: product.category || "",
      discount: parseFloat(product.discount || 0),
      popular: product.popular || false,
      stock: parseInt(product.stock || 0),
      status: product.status || "active",
      onSale: product.onSale || false,
      createdAt: product.$createdAt,
      updatedAt: product.$updatedAt,
    }));

    return {
      products,
      total: response.total,
    };
  } catch (error) {
    console.error("Error filtering products by status:", error);
    toast.error("Failed to filter products");
    throw error;
  }
};

// Get products statistics
export const getProductsStats = async () => {
  try {
    const allProducts = await getAllProducts(1000, 0);
    const products = allProducts.products;

    const stats = {
      totalProducts: products.length,
      activeProducts: products.filter((product) => product.status === "active")
        .length,
      lowStockProducts: products.filter(
        (product) => product.stock <= 10 && product.stock > 0
      ).length,
      outOfStockProducts: products.filter((product) => product.stock === 0)
        .length,
      popularProducts: products.filter((product) => product.popular).length,
      onSaleProducts: products.filter((product) => product.onSale).length,
      totalValue: products.reduce(
        (sum, product) => sum + product.price * product.stock,
        0
      ),
      averagePrice:
        products.length > 0
          ? products.reduce((sum, product) => sum + product.price, 0) /
            products.length
          : 0,
    };

    return stats;
  } catch (error) {
    console.error("Error getting products stats:", error);
    toast.error("Failed to fetch products statistics");
    throw error;
  }
};

// Export products data
export const exportProductsData = async () => {
  try {
    const allProducts = await getAllProducts(1000, 0);
    return allProducts.products;
  } catch (error) {
    console.error("Error exporting products data:", error);
    toast.error("Failed to export products data");
    throw error;
  }
};
