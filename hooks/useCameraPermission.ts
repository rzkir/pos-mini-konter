import { useCameraPermissions } from "expo-camera";

import { Linking, Platform } from "react-native";

import Toast from "react-native-toast-message";

export const useCameraPermission = () => {
  const [permission, requestPermission] = useCameraPermissions();

  const requestPermissionWithAlert = async () => {
    if (permission?.granted) {
      return true;
    }

    const result = await requestPermission();

    if (!result.granted) {
      // Show toast to guide user to settings
      Toast.show({
        type: "error",
        text1: "Izin Kamera Diperlukan",
        text2:
          "Aplikasi memerlukan akses kamera untuk scan barcode. Silakan aktifkan izin kamera di pengaturan.",
      });
      // Automatically open settings
      if (Platform.OS === "ios") {
        Linking.openURL("app-settings:");
      } else {
        Linking.openSettings();
      }
      return false;
    }

    return true;
  };

  return {
    hasPermission: permission?.granted ?? null,
    isRequesting: permission === null,
    requestPermission: requestPermissionWithAlert,
    checkPermission: () => permission?.granted ?? false,
  };
};
