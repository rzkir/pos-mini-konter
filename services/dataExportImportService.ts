import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";

export class DataExportImportService {
  // Exclude system keys that shouldn't be exported/imported
  private static readonly EXCLUDED_KEYS = ["isLoggedIn"];

  private static isLocalUri(uri: string): boolean {
    return (
      typeof uri === "string" &&
      (uri.startsWith("file://") || uri.startsWith("content://"))
    );
  }

  private static guessMimeFromUri(uri: string): string {
    const lower = uri.toLowerCase();
    if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
    if (lower.endsWith(".png")) return "image/png";
    if (lower.endsWith(".webp")) return "image/webp";
    if (lower.endsWith(".gif")) return "image/gif";
    return "image/*";
  }

  private static extFromMime(mime: string): string {
    if (mime.includes("jpeg")) return "jpg";
    if (mime.includes("png")) return "png";
    if (mime.includes("webp")) return "webp";
    if (mime.includes("gif")) return "gif";
    return "bin";
  }

  private static async embedImagesInObject(input: any): Promise<any> {
    if (Array.isArray(input)) {
      const mapped = await Promise.all(
        input.map((v) => this.embedImagesInObject(v))
      );
      return mapped;
    }
    if (input && typeof input === "object") {
      const cloned: any = {};
      const entries = Object.entries(input);
      for (const [k, v] of entries) {
        if (
          k === "image_url" &&
          typeof v === "string" &&
          this.isLocalUri(v as string)
        ) {
          try {
            // Ensure file exists before reading
            const info = await FileSystem.getInfoAsync(v as string).catch(
              () => ({ exists: false } as any)
            );
            if (info && (info as any).exists) {
              const base64 = await FileSystem.readAsStringAsync(v as string, {
                encoding: "base64" as any,
              });
              const mime = this.guessMimeFromUri(v as string);
              cloned[k] = `data:${mime};base64,${base64}`;
              cloned._original_image_uri = v;
              continue;
            }
          } catch {
            // Fallback: keep original uri if read fails
          }
        }
        cloned[k] = await this.embedImagesInObject(v);
      }
      return cloned;
    }
    return input;
  }

  private static async restoreImagesInObject(input: any): Promise<any> {
    if (Array.isArray(input)) {
      const mapped = await Promise.all(
        input.map((v) => this.restoreImagesInObject(v))
      );
      return mapped;
    }
    if (input && typeof input === "object") {
      const cloned: any = {};
      const entries = Object.entries(input);
      for (const [k, v] of entries) {
        if (
          k === "image_url" &&
          typeof v === "string" &&
          v.startsWith("data:image")
        ) {
          try {
            const [meta, b64] = (v as string).split(",", 2);
            const mime = meta.substring(5, meta.indexOf(";")) || "image/jpeg";
            const ext = this.extFromMime(mime);
            const baseDir =
              (FileSystem as any).documentDirectory ||
              (FileSystem as any).cacheDirectory ||
              "";
            const imagesDir = `${baseDir}kasir-mini-images/`;
            try {
              const dirInfo = await FileSystem.getInfoAsync(imagesDir);
              if (!dirInfo.exists) {
                await FileSystem.makeDirectoryAsync(imagesDir, {
                  intermediates: true,
                });
              }
            } catch {}
            const unique = `img_${Date.now()}_${Math.random()
              .toString(36)
              .slice(2)}.${ext}`;
            const target = `${imagesDir}${unique}`;
            await FileSystem.writeAsStringAsync(target, b64 || "", {
              encoding: "base64" as any,
            });
            cloned[k] = target;
            continue;
          } catch {
            // If write fails, keep the data URI as is (last resort)
          }
        }
        if (k === "_original_image_uri") {
          // Drop helper key on restore
          continue;
        }
        cloned[k] = await this.restoreImagesInObject(v);
      }
      return cloned;
    }
    return input;
  }

  /**
   * Export all data from AsyncStorage to JSON
   */
  static async exportAllData(): Promise<string> {
    try {
      // Get all keys from AsyncStorage
      const allKeys = await AsyncStorage.getAllKeys();

      // Filter out excluded keys
      const dataKeys = allKeys.filter(
        (key) => !this.EXCLUDED_KEYS.includes(key)
      );

      // Get all values
      const data = await AsyncStorage.multiGet(dataKeys);

      // Convert to object
      const exportData: Record<string, any> = {
        exportDate: new Date().toISOString(),
        version: "1.0.0",
        data: {},
      };

      // Parse each value and add to export object
      data.forEach(([key, value]) => {
        if (value !== null) {
          try {
            // Try to parse as JSON, if fails use as string
            exportData.data[key] = JSON.parse(value);
          } catch {
            exportData.data[key] = value;
          }
        }
      });

      // Embed local images as base64 data URIs so export is self-contained
      exportData.data = await this.embedImagesInObject(exportData.data);

      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error("Error exporting data:", error);
      throw new Error("Gagal mengekspor data");
    }
  }

  /**
   * Import data from JSON string to AsyncStorage
   */
  static async importData(jsonString: string): Promise<void> {
    try {
      // Parse JSON
      const importData = JSON.parse(jsonString);

      // Validate structure
      if (!importData.data || typeof importData.data !== "object") {
        throw new Error("Format data tidak valid");
      }

      // Restore any embedded images back to files and update URLs
      importData.data = await this.restoreImagesInObject(importData.data);

      // Prepare data for AsyncStorage
      const entries: [string, string][] = [];

      Object.entries(importData.data).forEach(([key, value]) => {
        // Skip excluded keys
        if (this.EXCLUDED_KEYS.includes(key)) {
          return;
        }

        // Convert value to string
        if (typeof value === "string") {
          entries.push([key, value]);
        } else {
          entries.push([key, JSON.stringify(value)]);
        }
      });

      // Import all data at once
      if (entries.length > 0) {
        await AsyncStorage.multiSet(entries);
      }
    } catch (error) {
      console.error("Error importing data:", error);
      if (error instanceof SyntaxError) {
        throw new Error("Format JSON tidak valid");
      }
      throw new Error(
        "Gagal mengimpor data: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    }
  }

  /**
   * Get count of data items in storage
   */
  static async getDataCount(): Promise<number> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const dataKeys = allKeys.filter(
        (key) => !this.EXCLUDED_KEYS.includes(key)
      );
      return dataKeys.length;
    } catch (error) {
      console.error("Error getting data count:", error);
      return 0;
    }
  }
}
