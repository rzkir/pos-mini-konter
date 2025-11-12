import { useSuppliers } from "@/hooks/useSuppliers";

import { SupplierService } from "@/services/supplierService";

import { useRouter } from "expo-router";

import { useState } from "react";

import { Alert } from "react-native";

import Toast from "react-native-toast-message";

export function useStateProductsSuppliers() {
  const router = useRouter();
  const { suppliers, loading, refreshSuppliers } = useSuppliers();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshSuppliers();
    } catch (error) {
      console.error("Error refreshing suppliers:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleEdit = (supplier: any) => {
    router.push(`/products/supplier/${supplier.id}`);
  };

  const handleDelete = (supplier: any) => {
    Alert.alert(
      "Konfirmasi Hapus",
      `Apakah Anda yakin ingin menghapus supplier "${supplier.name}"?`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            try {
              await SupplierService.delete(supplier.id);
              await refreshSuppliers();
              Toast.show({
                type: "success",
                text1: "Supplier berhasil dihapus",
              });
            } catch (error) {
              console.error("Error deleting supplier:", error);
              Toast.show({ type: "error", text1: "Gagal menghapus supplier" });
            }
          },
        },
      ]
    );
  };

  const handleAdd = () => {
    router.push("/products/supplier/new");
  };

  return {
    suppliers,
    loading,
    refreshing,
    onRefresh,
    handleEdit,
    handleDelete,
    handleAdd,
  };
}
