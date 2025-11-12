import { useCallback, useEffect, useState } from "react";

import { useLocalSearchParams, useRouter } from "expo-router";

import Toast from "react-native-toast-message";

import { SupplierService } from "@/services/supplierService";

export function useStateProductsSuppliersCreate() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const isEdit = id !== "new";

  const [formData, setFormData] = useState<SupplierFormData>({
    name: "",
    contact_person: "",
    phone: "",
    email: "",
    address: "",
    is_active: true,
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (
    field: keyof SupplierFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value as any,
    }));
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[0-9+\-\s()]+$/;
    return phoneRegex.test(phone) && phone.length >= 10;
  };

  const loadSupplierData = useCallback(async () => {
    try {
      setLoading(true);
      const supplier = await SupplierService.getById(Number(id));
      if (supplier) {
        setFormData({
          name: supplier.name,
          contact_person: supplier.contact_person,
          phone: supplier.phone,
          email: supplier.email || "",
          address: supplier.address,
          is_active: supplier.is_active,
        });
      }
    } catch (error) {
      console.error("Error loading supplier:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Gagal memuat data supplier",
      });
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (isEdit && id) {
      loadSupplierData();
    }
  }, [isEdit, id, loadSupplierData]);

  const handleSave = async () => {
    if (!formData.name.trim()) {
      Toast.show({ type: "error", text1: "Nama supplier harus diisi" });
      return;
    }

    if (!formData.contact_person.trim()) {
      Toast.show({ type: "error", text1: "Nama kontak harus diisi" });
      return;
    }

    if (!formData.phone.trim()) {
      Toast.show({ type: "error", text1: "Nomor telepon harus diisi" });
      return;
    }

    if (!validatePhone(formData.phone)) {
      Toast.show({ type: "error", text1: "Format nomor telepon tidak valid" });
      return;
    }

    if (formData.email && !validateEmail(formData.email)) {
      Toast.show({ type: "error", text1: "Format email tidak valid" });
      return;
    }

    if (!formData.address.trim()) {
      Toast.show({ type: "error", text1: "Alamat harus diisi" });
      return;
    }

    try {
      setLoading(true);

      if (isEdit) {
        await SupplierService.update(Number(id), {
          name: formData.name.trim(),
          contact_person: formData.contact_person.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim() || "",
          address: formData.address.trim(),
          is_active: formData.is_active,
        });
        Toast.show({ type: "success", text1: "Supplier berhasil diperbarui" });
        router.back();
      } else {
        await SupplierService.create({
          name: formData.name.trim(),
          contact_person: formData.contact_person.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim() || "",
          address: formData.address.trim(),
          is_active: formData.is_active,
        });
        Toast.show({ type: "success", text1: "Supplier berhasil disimpan" });
        setFormData({
          name: "",
          contact_person: "",
          phone: "",
          email: "",
          address: "",
          is_active: true,
        });
      }
    } catch (error) {
      console.error("Error saving supplier:", error);
      Toast.show({
        type: "error",
        text1: isEdit
          ? "Gagal memperbarui supplier"
          : "Gagal menyimpan supplier",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    id,
    isEdit,
    formData,
    setFormData,
    loading,
    handleInputChange,
    handleSave,
  };
}
