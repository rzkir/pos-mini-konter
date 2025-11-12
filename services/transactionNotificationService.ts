import Constants from "expo-constants";

import AsyncStorage from "@react-native-async-storage/async-storage";

const NOTIFICATION_SETTINGS_KEY = process.env
  .EXPO_PUBLIC_PUSH_NOTIFICATIONS as string;

/**
 * Service untuk mengirim notifikasi transaksi sukses
 */
export class TransactionNotificationService {
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

  // Get payment method display name
  private static getPaymentMethodName(method: string): string {
    const methodNames: { [key: string]: string } = {
      cash: "Tunai",
      card: "Kartu",
      transfer: "Transfer",
      debit_card: "Kartu Debit",
      credit_card: "Kartu Kredit",
      bank_transfer: "Transfer Bank",
      gopay: "GoPay",
      ovo: "OVO",
      dana: "DANA",
      shopeepay: "ShopeePay",
    };
    return methodNames[method] || method;
  }

  /**
   * Send transaction success notification
   */
  static async sendTransactionSuccessNotification(transaction: {
    id: number;
    transaction_number: string;
    total: number;
    payment_method: string;
    customer_name?: string;
  }): Promise<void> {
    try {
      const settings = await this.getSettings();

      // Skip if notifications are disabled
      if (!settings || !settings.pushEnabled) {
        return;
      }

      // Check if transaction notifications are explicitly disabled
      // Default to enabled if not specified (undefined = enabled)
      if (settings.transactionNotifications === false) {
        return;
      }

      // Format total amount
      const formatIDR = (amount: number): string => {
        return new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        }).format(amount);
      };

      const paymentMethodName = this.getPaymentMethodName(
        transaction.payment_method
      );
      const formattedTotal = formatIDR(transaction.total);
      const customerInfo = transaction.customer_name
        ? ` - ${transaction.customer_name}`
        : "";

      // Send notification
      const sound = this.getSoundValue(settings);
      const Notifications = await this.getNotificationsModule();
      if (!Notifications) return;
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "✅ Transaksi Berhasil",
          body: `Transaksi ${transaction.transaction_number}${customerInfo}\nTotal: ${formattedTotal}\nMetode: ${paymentMethodName}`,
          sound: sound,
          data: {
            type: "transaction_success",
            transactionId: transaction.id,
            transactionNumber: transaction.transaction_number,
            total: transaction.total,
            paymentMethod: transaction.payment_method,
          },
        },
        trigger: null,
        identifier: `transaction_success_${transaction.id}_${Date.now()}`,
      });
    } catch {
      // Silently fail to avoid disrupting transaction operations
    }
  }
}
