import { router } from "expo-router";

import { useState } from "react";

import { Alert } from "react-native";

import Toast from "react-native-toast-message";

import { DataExportImportService } from "@/services/dataExportImportService";

export function useStateImport() {
  const [showImportModal, setShowImportModal] = useState(false);
  const [importJsonText, setImportJsonText] = useState("");
  const [isImporting, setIsImporting] = useState(false);

  const handleImportData = async () => {
    try {
      setIsImporting(true);

      try {
        const DocumentPicker = await import("expo-document-picker" as any);
        const FileSystemLegacy = await import("expo-file-system/legacy" as any);

        const result =
          (await (DocumentPicker as any).getDocumentAsync?.({
            type: "application/json",
            copyToCacheDirectory: true,
            multiple: false,
          })) ||
          (DocumentPicker as any).default?.getDocumentAsync?.({
            type: "application/json",
            copyToCacheDirectory: true,
            multiple: false,
          });

        if (result?.canceled || !result?.assets?.[0]) {
          setIsImporting(false);
          return;
        }

        const fileUri = result.assets[0].uri;

        const fileContent =
          (await (FileSystemLegacy as any).readAsStringAsync?.(fileUri)) ||
          (FileSystemLegacy as any).default?.readAsStringAsync?.(fileUri);

        if (!fileContent) {
          throw new Error("File kosong atau tidak dapat dibaca");
        }

        Alert.alert(
          "Import Data",
          `File: ${result.assets[0].name}\n\nApakah Anda yakin ingin mengimpor data? Data lama akan digantikan.`,
          [
            {
              text: "Batal",
              style: "cancel",
              onPress: () => setIsImporting(false),
            },
            {
              text: "Import",
              style: "destructive",
              onPress: async () => {
                try {
                  await DataExportImportService.importData(fileContent);
                  Toast.show({
                    type: "success",
                    text1: "Berhasil",
                    text2: "Data berhasil diimpor",
                  });
                  setTimeout(() => {
                    router.back();
                  }, 1500);
                } catch (error) {
                  console.error("Import error:", error);
                  Toast.show({
                    type: "error",
                    text1: "Gagal",
                    text2:
                      error instanceof Error
                        ? error.message
                        : "Gagal mengimpor data",
                  });
                } finally {
                  setIsImporting(false);
                }
              },
            },
          ]
        );
      } catch (pickerError) {
        console.log(
          "DocumentPicker not available, using file system fallback:",
          pickerError
        );

        try {
          const FileSystemLegacy = await import(
            "expo-file-system/legacy" as any
          );
          const folderName = "kasir-mini";
          const documentDir =
            (FileSystemLegacy as any).documentDirectory ||
            (FileSystemLegacy as any).default?.documentDirectory;

          if (!documentDir) {
            throw new Error("documentDirectory tidak ditemukan");
          }

          const folderUri = `${documentDir}${folderName}/`;

          const files =
            (await (FileSystemLegacy as any).readDirectoryAsync?.(folderUri)) ||
            (FileSystemLegacy as any).default?.readDirectoryAsync?.(folderUri);

          if (!files || files.length === 0) {
            throw new Error("Tidak ada file JSON di folder kasir-mini");
          }

          const jsonFiles = files.filter((file: string) =>
            file.endsWith(".json")
          );

          if (jsonFiles.length === 0) {
            throw new Error("Tidak ada file JSON di folder kasir-mini");
          }

          if (jsonFiles.length === 1) {
            const fileUri = `${folderUri}${jsonFiles[0]}`;
            const fileContent =
              (await (FileSystemLegacy as any).readAsStringAsync?.(fileUri)) ||
              (FileSystemLegacy as any).default?.readAsStringAsync?.(fileUri);

            Alert.alert(
              "Import Data",
              `File: ${jsonFiles[0]}\n\nApakah Anda yakin ingin mengimpor data? Data lama akan digantikan.`,
              [
                {
                  text: "Batal",
                  style: "cancel",
                  onPress: () => setIsImporting(false),
                },
                {
                  text: "Import",
                  style: "destructive",
                  onPress: async () => {
                    try {
                      await DataExportImportService.importData(fileContent);
                      Toast.show({
                        type: "success",
                        text1: "Berhasil",
                        text2: "Data berhasil diimpor",
                      });
                      setTimeout(() => {
                        router.back();
                      }, 1500);
                    } catch (error) {
                      console.error("Import error:", error);
                      Toast.show({
                        type: "error",
                        text1: "Gagal",
                        text2:
                          error instanceof Error
                            ? error.message
                            : "Gagal mengimpor data",
                      });
                    } finally {
                      setIsImporting(false);
                    }
                  },
                },
              ]
            );
          } else {
            Alert.alert("Pilih File", "Pilih file JSON yang ingin diimpor:", [
              ...jsonFiles.map((file: string) => ({
                text: file,
                onPress: async () => {
                  try {
                    const fileUri = `${folderUri}${file}`;
                    const fileContent =
                      (await (FileSystemLegacy as any).readAsStringAsync?.(
                        fileUri
                      )) ||
                      (FileSystemLegacy as any).default?.readAsStringAsync?.(
                        fileUri
                      );

                    await DataExportImportService.importData(fileContent);
                    Toast.show({
                      type: "success",
                      text1: "Berhasil",
                      text2: "Data berhasil diimpor",
                    });
                    setTimeout(() => {
                      router.back();
                    }, 1500);
                  } catch (error) {
                    console.error("Import error:", error);
                    Toast.show({
                      type: "error",
                      text1: "Gagal",
                      text2:
                        error instanceof Error
                          ? error.message
                          : "Gagal mengimpor data",
                    });
                  } finally {
                    setIsImporting(false);
                  }
                },
              })),
              {
                text: "Batal",
                style: "cancel",
                onPress: () => setIsImporting(false),
              },
            ]);
          }
        } catch (fallbackError) {
          console.error("Fallback import error:", fallbackError);
          setShowImportModal(true);
          setIsImporting(false);
        }
      }
    } catch (error) {
      console.error("Import error:", error);
      Toast.show({
        type: "error",
        text1: "Gagal",
        text2: error instanceof Error ? error.message : "Gagal mengimpor data",
      });
      setIsImporting(false);
    }
  };

  const handleConfirmImport = async () => {
    if (!importJsonText.trim()) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "JSON tidak boleh kosong",
      });
      return;
    }

    Alert.alert(
      "Import Data",
      "Apakah Anda yakin ingin mengimpor data? Data lama akan digantikan.",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Import",
          style: "destructive",
          onPress: async () => {
            try {
              setIsImporting(true);
              await DataExportImportService.importData(importJsonText);
              setShowImportModal(false);
              setImportJsonText("");
              Toast.show({
                type: "success",
                text1: "Berhasil",
                text2: "Data berhasil diimpor",
              });
              setTimeout(() => {
                router.back();
              }, 1500);
            } catch (error) {
              console.error("Import error:", error);
              Toast.show({
                type: "error",
                text1: "Gagal",
                text2:
                  error instanceof Error
                    ? error.message
                    : "Gagal mengimpor data",
              });
            } finally {
              setIsImporting(false);
            }
          },
        },
      ]
    );
  };

  const handleCancelImport = () => {
    setShowImportModal(false);
    setImportJsonText("");
  };

  const handleImportTxtFile = async () => {
    try {
      setIsImporting(true);

      try {
        const DocumentPicker = await import("expo-document-picker" as any);
        const FileSystemLegacy = await import("expo-file-system/legacy" as any);

        const result =
          (await (DocumentPicker as any).getDocumentAsync?.({
            type: "text/plain",
            copyToCacheDirectory: true,
            multiple: false,
          })) ||
          (DocumentPicker as any).default?.getDocumentAsync?.({
            type: "text/plain",
            copyToCacheDirectory: true,
            multiple: false,
          });

        if (result?.canceled || !result?.assets?.[0]) {
          setIsImporting(false);
          return;
        }

        const fileUri = result.assets[0].uri;

        const fileContent =
          (await (FileSystemLegacy as any).readAsStringAsync?.(fileUri)) ||
          (FileSystemLegacy as any).default?.readAsStringAsync?.(fileUri);

        if (!fileContent) {
          throw new Error("File kosong atau tidak dapat dibaca");
        }

        Alert.alert(
          "Import Data",
          `File: ${result.assets[0].name}\n\nApakah Anda yakin ingin mengimpor data? Data lama akan digantikan.`,
          [
            {
              text: "Batal",
              style: "cancel",
              onPress: () => setIsImporting(false),
            },
            {
              text: "Import",
              style: "destructive",
              onPress: async () => {
                try {
                  await DataExportImportService.importData(fileContent);
                  Toast.show({
                    type: "success",
                    text1: "Berhasil",
                    text2: "Data berhasil diimpor",
                  });
                  setTimeout(() => {
                    router.back();
                  }, 1500);
                } catch (error) {
                  console.error("Import error:", error);
                  Toast.show({
                    type: "error",
                    text1: "Gagal",
                    text2:
                      error instanceof Error
                        ? error.message
                        : "Gagal mengimpor data",
                  });
                } finally {
                  setIsImporting(false);
                }
              },
            },
          ]
        );
      } catch (pickerError) {
        console.error("Txt file picker error:", pickerError);
        Toast.show({
          type: "error",
          text1: "Gagal",
          text2: "Gagal membuka file picker. Pastikan file berformat .txt",
        });
        setIsImporting(false);
      }
    } catch (error) {
      console.error("Import error:", error);
      Toast.show({
        type: "error",
        text1: "Gagal",
        text2: error instanceof Error ? error.message : "Gagal mengimpor data",
      });
      setIsImporting(false);
    }
  };

  return {
    showImportModal,
    setShowImportModal,
    importJsonText,
    setImportJsonText,
    isImporting,
    handleImportData,
    handleConfirmImport,
    handleCancelImport,
    handleImportTxtFile,
  };
}
