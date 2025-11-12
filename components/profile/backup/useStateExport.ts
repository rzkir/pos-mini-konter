import { useState } from "react";

import { Alert } from "react-native";

import Toast from "react-native-toast-message";

import { DataExportImportService } from "@/services/dataExportImportService";

export function useStateExport() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportData = async () => {
    try {
      setIsExporting(true);
      const jsonData = await DataExportImportService.exportAllData();

      const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, "-")
        .slice(0, 19);
      const fileName = `pos_data_export_${timestamp}.json`;
      let fileUri: string | null = null;

      try {
        const SharingModule = await import("expo-sharing" as any);
        const Sharing = (SharingModule as any).default || SharingModule;
        const isAvailable = await ((Sharing as any).isAvailableAsync?.() ||
          (Sharing as any).isAvailableAsync());

        if (isAvailable) {
          try {
            const FileSystem = await import("expo-file-system" as any);
            const FS = (FileSystem as any).default || FileSystem;
            const cacheDir =
              (FS as any).cacheDirectory || (FS as any).documentDirectory;
            if (cacheDir) {
              fileUri = `${cacheDir}${fileName}`;
              const writeMethod =
                (FS as any).writeAsStringAsync ||
                (FS as any).default?.writeAsStringAsync;
              if (writeMethod) {
                await writeMethod(fileUri, jsonData);
                const shareMethod =
                  (Sharing as any).shareAsync ||
                  (Sharing as any).default?.shareAsync;
                if (shareMethod) {
                  await shareMethod(fileUri, {
                    mimeType: "application/json",
                    dialogTitle: "Export Data POS",
                    UTI: "public.json",
                  });
                  Toast.show({
                    type: "success",
                    text1: "Export Berhasil",
                    text2: "File JSON telah dibagikan",
                    visibilityTime: 4000,
                  });
                  return;
                }
              }
            }
          } catch (fileError) {
            console.log("File save error, trying direct share:", fileError);
          }

          try {
            const { Share } = await import("react-native");
            await Share.share({
              message: jsonData,
              title: "Export Data POS",
            });
            Toast.show({
              type: "success",
              text1: "Export Berhasil",
              text2: "Data JSON telah dibagikan",
              visibilityTime: 4000,
            });
            return;
          } catch (shareError) {
            console.log("Share error:", shareError);
          }
        }

        const FileSystem = await import("expo-file-system" as any);
        const FS = (FileSystem as any).default || FileSystem;
        let baseDir =
          (FS as any).cacheDirectory || (FS as any).documentDirectory;
        if (!baseDir) {
          throw new Error("FileSystem directory tidak tersedia");
        }
        const folderName = "kasir-mini";
        const folderUri = `${baseDir}${folderName}/`;

        try {
          const getInfoMethod =
            (FS as any).getInfoAsync || (FS as any).default?.getInfoAsync;
          if (getInfoMethod) {
            const folderInfo = await getInfoMethod(folderUri);
            if (!folderInfo?.exists) {
              const mkdirMethod =
                (FS as any).makeDirectoryAsync ||
                (FS as any).default?.makeDirectoryAsync;
              if (mkdirMethod) {
                await mkdirMethod(folderUri, { intermediates: true });
              }
            }
          }
        } catch (mkdirError) {
          console.log("Error creating folder:", mkdirError);
        }

        fileUri = `${folderUri}${fileName}`;
        const writeMethod =
          (FS as any).writeAsStringAsync ||
          (FS as any).default?.writeAsStringAsync;
        if (!writeMethod) {
          throw new Error("writeAsStringAsync tidak tersedia");
        }
        await writeMethod(fileUri, jsonData);

        Toast.show({
          type: "success",
          text1: "Export Berhasil",
          text2: "File tersimpan",
          visibilityTime: 4000,
        });
      } catch {
        Alert.alert(
          "Export Data",
          "Gagal menyimpan file. Data JSON tersedia di console log.\n\nAnda bisa copy manual dari console.",
          [{ text: "OK" }]
        );
        Toast.show({
          type: "info",
          text1: "Periksa Console",
          text2: "Data JSON tersedia di console log",
        });
      }
    } catch {
      Toast.show({
        type: "error",
        text1: "Gagal",
        text2: "Gagal mengekspor data",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return { isExporting, handleExportData };
}
