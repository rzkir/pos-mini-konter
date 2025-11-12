import { useState, useEffect, useCallback } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import Toast from "react-native-toast-message";

import { Share } from "react-native";

const RN_BC = "react-native-bluetooth-classic" as const;

const STORAGE_KEY = process.env.EXPO_PUBLIC_PRINTER_CONNECTED as string;

interface PrinterDevice {
  name: string;
  address: string;
  connected?: boolean;
}

/**
 * Hook untuk manage state printer Bluetooth Classic
 * - Menyimpan connected printer address ke localStorage
 * - Auto-reconnect ketika app start jika ada printer yang pernah connect
 * - Reusable di berbagai component
 */
export const usePrinter = () => {
  const [devices, setDevices] = useState<PrinterDevice[]>([]);
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // Helper function to load Bluetooth Classic module
  const loadBluetoothModule = async () => {
    const Mod: any = await import(RN_BC);
    const RNB = Mod.default || Mod;
    if (!RNB) throw new Error("react-native-bluetooth-classic tidak tersedia");
    return RNB;
  };

  // Load saved connected printer address from localStorage
  const loadSavedPrinter = useCallback(async () => {
    try {
      const savedAddress = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedAddress) {
        setConnectedAddress(savedAddress);
        // Note: Auto-reconnect akan dilakukan saat pertama kali print
        // untuk menghindari masalah jika Bluetooth belum ready saat app load
        console.log("Loaded saved printer address:", savedAddress);
      }
    } catch (error) {
      console.error("Error loading saved printer:", error);
    }
  }, []);

  // Save connected printer address to localStorage
  const savePrinterAddress = async (address: string | null) => {
    try {
      if (address) {
        await AsyncStorage.setItem(STORAGE_KEY, address);
      } else {
        await AsyncStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      console.error("Error saving printer address:", error);
    }
  };

  // Load saved printer on mount
  useEffect(() => {
    loadSavedPrinter();
  }, [loadSavedPrinter]);

  // Enable Bluetooth and List Devices
  const enableAndListDevices = async () => {
    try {
      setLoading(true);
      const RNB = await loadBluetoothModule();
      const enabled = await RNB.isBluetoothEnabled?.();
      if (!enabled && RNB.requestBluetoothEnabled) {
        await RNB.requestBluetoothEnabled();
      }
      const bonded = (await RNB.getBondedDevices?.()) || [];
      const found = (await RNB.discoverDevices?.()) || [];
      const list = [...bonded, ...found];
      const normalized = list.map((d: any) => ({
        name: d.name || "Printer",
        address: d.address || d.id,
      }));
      setDevices(normalized);
      Toast.show({ type: "success", text1: "Perangkat dimuat" });
    } catch (e: any) {
      console.error(e);
      Toast.show({
        type: "error",
        text1: "Gagal memuat perangkat",
        text2: e.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // Connect to printer
  const connectToPrinter = async (address: string) => {
    try {
      setIsConnecting(true);
      const RNB = await loadBluetoothModule();

      // If already connected to this device, disconnect
      if (connectedAddress === address) {
        try {
          await RNB.disconnectFromDevice?.(address);
        } catch (e) {
          console.log("Disconnect error:", e);
        }
        setConnectedAddress(null);
        await savePrinterAddress(null);
        Toast.show({ type: "success", text1: "Terputus dari printer" });
        return;
      }

      // Disconnect from previous printer if any
      if (connectedAddress) {
        try {
          await RNB.disconnectFromDevice?.(connectedAddress);
        } catch (e) {
          console.log("Previous disconnect error:", e);
        }
      }

      // Connect to new printer
      await RNB.connectToDevice?.(address);
      setConnectedAddress(address);
      await savePrinterAddress(address);
      Toast.show({ type: "success", text1: "Terhubung ke printer" });
    } catch (e: any) {
      console.error(e);
      Toast.show({
        type: "error",
        text1: "Gagal menghubungkan printer",
        text2: e.message,
      });
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect from printer
  const disconnectPrinter = async () => {
    if (!connectedAddress) return;
    try {
      const RNB = await loadBluetoothModule();
      await RNB.disconnectFromDevice?.(connectedAddress);
      setConnectedAddress(null);
      await savePrinterAddress(null);
      Toast.show({ type: "success", text1: "Terputus dari printer" });
    } catch (e: any) {
      console.error(e);
      Toast.show({
        type: "error",
        text1: "Gagal memutuskan printer",
        text2: e.message,
      });
    }
  };

  // Print text to connected printer
  const printText = async (text: string) => {
    if (!connectedAddress) {
      Toast.show({ type: "info", text1: "Hubungkan printer dulu" });
      throw new Error("Printer belum terhubung");
    }
    try {
      const RNB = await loadBluetoothModule();

      // Check if Bluetooth is enabled
      const enabled = await RNB.isBluetoothEnabled?.();
      if (!enabled) {
        throw new Error(
          "Bluetooth tidak aktif. Aktifkan Bluetooth terlebih dahulu."
        );
      }

      // Try to ensure connection is still active, reconnect if needed
      try {
        const bonded = (await RNB.getBondedDevices?.()) || [];
        const deviceExists = bonded.some(
          (d: any) => (d.address || d.id) === connectedAddress
        );
        if (deviceExists) {
          // Try to connect (might already be connected, that's OK)
          try {
            await RNB.connectToDevice?.(connectedAddress);
          } catch (e: any) {
            // If already connected, this will fail but that's fine
            if (!e.message?.includes("already")) {
              console.log("Reconnect attempt:", e.message);
            }
          }
        } else {
          throw new Error(
            "Printer yang tersimpan tidak ditemukan. Silakan hubungkan ulang di Pengaturan Printer."
          );
        }
      } catch (connectError: any) {
        // If device not found, clear saved address
        if (connectError.message?.includes("tidak ditemukan")) {
          setConnectedAddress(null);
          await savePrinterAddress(null);
        }
        throw connectError;
      }

      // Print to device
      // Pastikan text adalah string yang valid
      if (!text || typeof text !== "string") {
        throw new Error("Data print tidak valid");
      }

      // Pastikan encoding benar - hapus karakter yang tidak valid
      // ESC/POS commands harus tetap utuh, tapi pastikan tidak ada karakter yang merusak
      let sanitizedText = text
        .split("")
        .map((char) => {
          const code = char.charCodeAt(0);
          // Izinkan karakter ASCII (0-127) dan karakter kontrol ESC/POS (0x1B, 0x1D, dll)
          // Izinkan juga karakter extended ASCII (128-255) untuk bitmap data
          if (code >= 0 && code <= 255) {
            return char;
          }
          // Ganti karakter yang tidak valid dengan spasi
          return " ";
        })
        .join("");

      if (RNB.writeToDevice) {
        await RNB.writeToDevice(connectedAddress, sanitizedText);
      } else if (RNB.write) {
        await RNB.write(sanitizedText);
      } else {
        throw new Error("Metode write tidak tersedia");
      }
      return true;
    } catch (e: any) {
      console.error("Print error:", e);
      Toast.show({ type: "error", text1: "Gagal mencetak", text2: e.message });
      throw e;
    }
  };

  // Share text via native share sheet
  const shareText = async (text: string) => {
    try {
      if (!text || text.trim().length === 0) {
        Toast.show({ type: "info", text1: "Tidak ada konten untuk dibagikan" });
        return false;
      }
      await Share.share({ message: text });
      return true;
    } catch (e: any) {
      console.error("Share error:", e);
      Toast.show({
        type: "error",
        text1: "Gagal membagikan",
        text2: e.message,
      });
      return false;
    }
  };

  // CTA-friendly handlers for buttons
  const onPressPrint = async (text: string) => {
    try {
      await printText(text);
    } catch {
      // error toast already handled in printText
    }
  };

  const onPressShare = async (text: string) => {
    await shareText(text);
  };

  // Get connected printer device info
  const getConnectedDevice = (): PrinterDevice | null => {
    if (!connectedAddress) return null;
    return devices.find((d) => d.address === connectedAddress) || null;
  };

  return {
    devices,
    connectedAddress,
    loading,
    isConnecting,
    enableAndListDevices,
    connectToPrinter,
    disconnectPrinter,
    printText,
    shareText,
    onPressPrint,
    onPressShare,
    getConnectedDevice,
    loadSavedPrinter,
  };
};
