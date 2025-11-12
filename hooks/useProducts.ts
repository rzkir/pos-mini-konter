import { useContext } from "react";

import { ProductContext } from "@/context/ProductContext";

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider");
  }

  return {
    // State
    products: context.products,
    productsWithRelations: context.productsWithRelations,
    categories: context.categories,
    sizes: context.sizes,
    suppliers: context.suppliers,
    loading: context.loading,
    error: context.error,

    // Product methods
    createProduct: context.createProduct,
    updateProduct: context.updateProduct,
    deleteProduct: context.deleteProduct,
    getProductById: context.getProductById,
    searchProducts: context.searchProducts,
    getProductsByCategory: context.getProductsByCategory,
    getLowStockProducts: context.getLowStockProducts,
    updateProductStock: context.updateProductStock,
    updateProductSold: context.updateProductSold,

    // Utility
    refreshData: context.refreshData,
    clearError: context.clearError,
  };
};

export const useCategories = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useCategories must be used within a ProductProvider");
  }

  return {
    categories: context.categories,
    loading: context.loading,
    error: context.error,
    createCategory: context.createCategory,
    updateCategory: context.updateCategory,
    deleteCategory: context.deleteCategory,
    searchCategories: context.searchCategories,
    refreshData: context.refreshData,
    clearError: context.clearError,
  };
};

export const useSizes = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useSizes must be used within a ProductProvider");
  }

  return {
    sizes: context.sizes,
    loading: context.loading,
    error: context.error,
    createSize: context.createSize,
    updateSize: context.updateSize,
    deleteSize: context.deleteSize,
    searchSizes: context.searchSizes,
    refreshData: context.refreshData,
    clearError: context.clearError,
  };
};

export const useSuppliers = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useSuppliers must be used within a ProductProvider");
  }

  return {
    suppliers: context.suppliers,
    loading: context.loading,
    error: context.error,
    createSupplier: context.createSupplier,
    updateSupplier: context.updateSupplier,
    deleteSupplier: context.deleteSupplier,
    searchSuppliers: context.searchSuppliers,
    refreshData: context.refreshData,
    clearError: context.clearError,
  };
};
