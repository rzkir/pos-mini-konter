import { useState, useEffect } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

const APP_SETTINGS_STORAGE_KEY = process.env.EXPO_PUBLIC_APP_SETTINGS as string;

export interface AppSettings {
  dateFormat: "DD/MM/YYYY" | "MM/DD/YYYY" | "YYYY-MM-DD";
  decimalPlaces: number;
}

const DEFAULT_SETTINGS: AppSettings = {
  dateFormat: "DD/MM/YYYY",
  decimalPlaces: 2,
};

export const useAppSettings = () => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem(APP_SETTINGS_STORAGE_KEY);
      if (stored) {
        const parsedSettings = JSON.parse(stored);
        setSettings({
          dateFormat: parsedSettings.dateFormat || DEFAULT_SETTINGS.dateFormat,
          decimalPlaces:
            parsedSettings.decimalPlaces ?? DEFAULT_SETTINGS.decimalPlaces,
        });
      }
    } catch (error) {
      console.error("Error loading app settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings: AppSettings) => {
    try {
      await AsyncStorage.setItem(
        APP_SETTINGS_STORAGE_KEY,
        JSON.stringify(newSettings)
      );
      setSettings(newSettings);
    } catch (error) {
      console.error("Error saving app settings:", error);
      throw error;
    }
  };

  const updateDateFormat = async (format: AppSettings["dateFormat"]) => {
    const newSettings = { ...settings, dateFormat: format };
    await saveSettings(newSettings);
  };

  const updateDecimalPlaces = async (places: number) => {
    const newSettings = {
      ...settings,
      decimalPlaces: Math.max(0, Math.min(4, places)),
    };
    await saveSettings(newSettings);
  };

  const resetSettings = async () => {
    await saveSettings(DEFAULT_SETTINGS);
  };

  return {
    settings,
    loading,
    updateDateFormat,
    updateDecimalPlaces,
    resetSettings,
  };
};
