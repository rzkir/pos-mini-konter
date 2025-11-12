import { useCallback, useEffect, useState } from "react";

import { useLocalSearchParams, useRouter } from "expo-router";

import Toast from "react-native-toast-message";

import { ProductCategoryService } from "@/services/productCategoryService";

type FormData = {
  uid: string;
  name: string;
  is_active: boolean;
};

export function useStateCreateProducts() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const isEdit = id !== "new";

  const [formData, setFormData] = useState<FormData>({
    uid: "",
    name: "",
    is_active: true,
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value as any,
    }));
  };

  const loadCategoryData = useCallback(async () => {
    try {
      setLoading(true);
      const category = await ProductCategoryService.getById(Number(id));
      if (category) {
        setFormData({
          uid: category.uid,
          name: category.name,
          is_active: category.is_active,
        });
      }
    } catch (error) {
      console.error("Error loading category:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Gagal memuat data kategori",
      });
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (isEdit && id) {
      loadCategoryData();
    }
  }, [isEdit, id, loadCategoryData]);

  const handleSave = async () => {
    if (!formData.name.trim()) {
      Toast.show({ type: "error", text1: "Nama kategori harus diisi" });
      return;
    }

    try {
      setLoading(true);

      if (isEdit) {
        await ProductCategoryService.update(Number(id), {
          uid: formData.uid || "",
          name: formData.name.trim(),
          is_active: formData.is_active,
        });
        Toast.show({ type: "success", text1: "Kategori berhasil diperbarui" });
        router.back();
      } else {
        await ProductCategoryService.create({
          uid: `CAT${Date.now()}`,
          name: formData.name.trim(),
          is_active: formData.is_active,
        });
        Toast.show({ type: "success", text1: "Kategori berhasil disimpan" });
        setFormData({ uid: "", name: "", is_active: true });
      }
    } catch (error) {
      console.error("Error saving category:", error);
      Toast.show({
        type: "error",
        text1: isEdit
          ? "Gagal memperbarui kategori"
          : "Gagal menyimpan kategori",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return {
    id,
    isEdit,
    formData,
    loading,
    handleInputChange,
    handleSave,
    handleCancel,
  };
}
