import { useState, useEffect } from "react";

import { router } from "expo-router";

import Toast from "react-native-toast-message";

import * as ImagePicker from "expo-image-picker";

import { CompanyProfileService } from "@/services";

export function useStateInformation() {
  const [companyName, setCompanyName] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCompanyProfile();
  }, []);

  const loadCompanyProfile = async () => {
    try {
      const profile = await CompanyProfileService.get();
      if (profile) {
        setCompanyName(profile.name);
        setCompanyAddress(profile.address);
        setCompanyPhone(profile.phone);
        setCompanyEmail(profile.email);
        setCompanyWebsite(profile.website);
        setLogoUrl(profile.logo_url || null);
      }
    } catch (error) {
      console.error("Error loading company profile:", error);
    }
  };

  const handleImagePicker = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Toast.show({
        type: "error",
        text1: "Izin Diperlukan",
        text2: "Izin untuk mengakses galeri diperlukan!",
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setLogoUrl(result.assets[0].uri);
    }
  };

  const handleSaveInfo = async () => {
    setLoading(true);

    try {
      // Validate required fields
      if (!companyName.trim()) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Mohon lengkapi nama perusahaan",
        });
        return;
      }

      // Save company profile to local storage
      const profileData = {
        name: companyName.trim(),
        address: companyAddress.trim(),
        phone: companyPhone.trim(),
        email: companyEmail.trim(),
        website: companyWebsite.trim(),
        logo_url: logoUrl || undefined,
      };

      await CompanyProfileService.save(profileData);

      Toast.show({
        type: "success",
        text1: "Berhasil",
        text2: "Informasi perusahaan berhasil diperbarui",
      });

      router.back();
    } catch (error) {
      console.error("Error saving company profile:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Gagal memperbarui informasi perusahaan",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    companyName,
    setCompanyName,
    companyAddress,
    setCompanyAddress,
    companyPhone,
    setCompanyPhone,
    companyEmail,
    setCompanyEmail,
    companyWebsite,
    setCompanyWebsite,
    logoUrl,
    setLogoUrl,
    loading,
    handleImagePicker,
    handleSaveInfo,
  };
}
