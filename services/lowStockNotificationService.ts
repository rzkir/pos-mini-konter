import Constants from "expo-constants";

import AsyncStorage from "@react-native-async-storage/async-storage";

const NOTIFICATION_SETTINGS_KEY = process.env
  .EXPO_PUBLIC_PUSH_NOTIFICATIONS as string;

const NOTIFIED_PRODUCTS_KEY = process.env
  .EXPO_PUBLIC_LOW_NOTIFICATIONS_PRODUCTS as string;

/**
 * Service untuk mengirim notifikasi low stock alert
 * Bisa dipanggil dari context atau service lainnya tanpa dependency ke hook
 */
export class LowStockNotificationService {
  private static notifications: typeof import("expo-notifications") | null =
    null;

  private static async getNotificationsModule() {
    if (this.notifications) return this.notifications;
    if (Constants.appOwnership === "expo") return null;
    try {
      const mod = await import("expo-notifications");
      this.notifications = mod;
      return mod;
    } catch {
      return null;
    }
  }
  // Get notification settings
  private static async getSettings(): Promise<NotificationSettings | null> {
    try {
      const stored = await AsyncStorage.getItem(NOTIFICATION_SETTINGS_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  // Get sound value for notification
  private static getSoundValue(
    settings: NotificationSettings
  ): string | undefined {
    if (!settings.soundEnabled) {
      return undefined;
    }

    // Default sound
    if (!settings.selectedSound || settings.selectedSound === "none") {
      return settings.soundEnabled ? "default" : undefined;
    }

    return "default"; // Can be extended for custom sounds
  }

  // Check if product was already notified
  private static async isProductNotified(productId: number): Promise<boolean> {
    try {
      const stored = await AsyncStorage.getItem(NOTIFIED_PRODUCTS_KEY);
      if (!stored) return false;
      const notifiedIds: number[] = JSON.parse(stored);
      return notifiedIds.includes(productId);
    } catch {
      return false;
    }
  }

  // Mark product as notified
  private static async markProductAsNotified(productId: number): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(NOTIFIED_PRODUCTS_KEY);
      const notifiedIds: number[] = stored ? JSON.parse(stored) : [];
      if (!notifiedIds.includes(productId)) {
        notifiedIds.push(productId);
        await AsyncStorage.setItem(
          NOTIFIED_PRODUCTS_KEY,
          JSON.stringify(notifiedIds)
        );
      }
    } catch {
      // Silently fail
    }
  }

  // Remove product from notified list (when stock is back above min_stock)
  private static async removeProductFromNotified(
    productId: number
  ): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(NOTIFIED_PRODUCTS_KEY);
      if (!stored) return;
      const notifiedIds: number[] = JSON.parse(stored);
      const filtered = notifiedIds.filter((id) => id !== productId);
      await AsyncStorage.setItem(
        NOTIFIED_PRODUCTS_KEY,
        JSON.stringify(filtered)
      );
    } catch {
      // Silently fail
    }
  }

  // Reset notified status (useful when min_stock changes)
  static async resetNotifiedStatus(productId: number): Promise<void> {
    await this.removeProductFromNotified(productId);
  }

  /**
   * Check and send low stock alert for a single product
   */
  static async checkAndNotifyProduct(product: {
    id: number;
    name: string;
    stock: number;
    min_stock: number;
    unit?: string;
  }): Promise<void> {
    try {
      const settings = await this.getSettings();

      // Skip if notifications are disabled
      if (!settings || !settings.pushEnabled || !settings.lowStockAlerts) {
        return;
      }

      // Validate min_stock exists and is valid
      if (!product.min_stock || product.min_stock <= 0) {
        return;
      }

      // Check if stock is low (stock <= min_stock)
      const isLowStock = product.stock <= product.min_stock;

      if (!isLowStock) {
        // Stock is not low anymore, remove from notified list if it was there
        await this.removeProductFromNotified(product.id);
        return;
      }

      // Stock is low, check if already notified
      const alreadyNotified = await this.isProductNotified(product.id);

      if (alreadyNotified) {
        return;
      }

      // Stock is low and not yet notified, send notification
      const sound = this.getSoundValue(settings);
      const Notifications = await this.getNotificationsModule();
      if (!Notifications) return;
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "⚠️ Stok Rendah",
          body: `${product.name} tersisa ${product.stock} ${
            product.unit || "unit"
          } (Min: ${product.min_stock})`,
          sound: sound,
          data: {
            type: "low_stock",
            productId: product.id,
            productName: product.name,
            currentStock: product.stock,
            minStock: product.min_stock,
          },
        },
        trigger: null,
        identifier: `low_stock_${product.id}_${Date.now()}`,
      });

      // Mark as notified
      await this.markProductAsNotified(product.id);
    } catch {
      // Silently fail to avoid disrupting product operations
    }
  }

  /**
   * Check all products and send notifications for low stock products
   */
  static async checkAndNotifyAllProducts(
    products: {
      id: number;
      name: string;
      stock: number;
      min_stock: number;
      unit?: string;
    }[]
  ): Promise<void> {
    try {
      const settings = await this.getSettings();

      // Skip if notifications are disabled
      if (!settings || !settings.pushEnabled || !settings.lowStockAlerts) {
        return;
      }

      // Find low stock products
      const lowStockProducts = products.filter(
        (product) => product.min_stock && product.stock <= product.min_stock
      );

      // Send notifications for each low stock product
      for (const product of lowStockProducts) {
        await this.checkAndNotifyProduct(product);
      }

      // Remove products from notified list if they're no longer low stock
      const lowStockProductIds = new Set(lowStockProducts.map((p) => p.id));
      const stored = await AsyncStorage.getItem(NOTIFIED_PRODUCTS_KEY);
      if (stored) {
        const notifiedIds: number[] = JSON.parse(stored);
        for (const productId of notifiedIds) {
          if (!lowStockProductIds.has(productId)) {
            await this.removeProductFromNotified(productId);
          }
        }
      }
    } catch {
      // Silently fail
    }
  }
}
