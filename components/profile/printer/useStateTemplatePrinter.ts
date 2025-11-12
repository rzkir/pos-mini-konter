import { useState, useEffect } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { Alert } from "react-native";

import Toast from "react-native-toast-message";

import { router } from "expo-router";

import {
  DEFAULT_TEMPLATE,
  // convertImageToBitmap removed - logo tidak akan dicetak di struk printer
} from "@/app/profile/printer/template/index";

const STORAGE_KEY = process.env.EXPO_PUBLIC_PRINTER_CUSTUM as string;

export function useStateTemplatePrinter() {
  const [settings, setSettings] = useState<TemplateSettings>(DEFAULT_TEMPLATE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSettings(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading template settings:", error);
      Toast.show({
        type: "error",
        text1: "Gagal Memuat",
        text2: "Gagal memuat pengaturan template",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      Toast.show({
        type: "success",
        text1: "Berhasil",
        text2: "Pengaturan template berhasil disimpan",
      });
      router.back();
    } catch (error) {
      console.error("Error saving template settings:", error);
      Toast.show({
        type: "error",
        text1: "Gagal Menyimpan",
        text2: "Gagal menyimpan pengaturan template",
      });
    } finally {
      setSaving(false);
    }
  };

  // Logo functions removed - logo tidak akan dicetak di struk printer
  // Logo tetap bisa digunakan untuk HTML/PDF version jika diperlukan
  const handlePickLogo = async () => {
    // Logo functionality disabled
    Toast.show({
      type: "info",
      text1: "Info",
      text2: "Logo tidak akan dicetak di struk printer",
    });
  };

  const handleRemoveLogo = () => {
    // Logo functionality disabled
    Toast.show({
      type: "info",
      text1: "Info",
      text2: "Logo tidak akan dicetak di struk printer",
    });
  };

  const resetToDefault = () => {
    Alert.alert(
      "Reset ke Default",
      "Apakah Anda yakin ingin mengembalikan semua pengaturan ke default?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            setSettings(DEFAULT_TEMPLATE);
            Toast.show({
              type: "success",
              text1: "Berhasil",
              text2: "Pengaturan telah direset ke default",
            });
          },
        },
      ]
    );
  };

  return {
    settings,
    setSettings,
    loading,
    saving,
    loadSettings,
    saveSettings,
    handlePickLogo,
    handleRemoveLogo,
    resetToDefault,
  };
}
