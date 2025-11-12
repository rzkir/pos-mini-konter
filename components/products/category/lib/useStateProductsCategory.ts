import { useCategories } from "@/hooks/useCategories";

import { ProductCategoryService } from "@/services/productCategoryService";

import { useRouter } from "expo-router";

import { useState } from "react";

import { Alert } from "react-native";

import Toast from "react-native-toast-message";

export function useStateProductsCategory() {
  const router = useRouter();
  const { categories, loading, refreshCategories } = useCategories();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshCategories();
    } catch (error) {
      console.error("Error refreshing categories:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleEdit = (category: any) => {
    router.push(`/products/category/${category.id}`);
  };

  const handleDelete = (category: any) => {
    Alert.alert(
      "Konfirmasi Hapus",
      `Apakah Anda yakin ingin menghapus kategori "${category.name}"?`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            try {
              await ProductCategoryService.delete(category.id);
              await refreshCategories();
              Toast.show({
                type: "success",
                text1: "Kategori berhasil dihapus",
              });
            } catch (error) {
              console.error("Error deleting category:", error);
              Toast.show({ type: "error", text1: "Gagal menghapus kategori" });
            }
          },
        },
      ]
    );
  };

  const handleAdd = () => {
    router.push("/products/category/new");
  };

  return {
    categories,
    loading,
    refreshing,
    onRefresh,
    handleEdit,
    handleDelete,
    handleAdd,
  };
}
