import { LocalStorageService } from "@/services/localStorageService";

import AsyncStorage from "@react-native-async-storage/async-storage";

export class TransactionService {
  private static readonly STORAGE_KEY = process.env
    .EXPO_PUBLIC_TRANSACTION as string;
  private static readonly ACTIVE_TRANSACTION_KEY = process.env
    .EXPO_PUBLIC_ACTIVE_TRANSACTION_ID as string;

  // Get all transactions
  static async getAll(): Promise<Transaction[]> {
    return await LocalStorageService.get<Transaction>(this.STORAGE_KEY);
  }

  // Get transaction by ID
  static async getById(id: number): Promise<Transaction | null> {
    return await LocalStorageService.getById<Transaction>(this.STORAGE_KEY, id);
  }

  // Create new transaction
  static async create(
    transactionData: Omit<Transaction, "id" | "created_at" | "updated_at">
  ): Promise<Transaction> {
    const newTransaction = {
      ...transactionData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Omit<Transaction, "id">;
    return await LocalStorageService.add<Transaction>(
      this.STORAGE_KEY,
      newTransaction
    );
  }

  // Update transaction
  static async update(
    id: number,
    transactionData: Partial<Transaction>
  ): Promise<Transaction | null> {
    return await LocalStorageService.update<Transaction>(
      this.STORAGE_KEY,
      id,
      transactionData
    );
  }

  // Delete transaction
  static async delete(id: number): Promise<boolean> {
    return await LocalStorageService.delete<Transaction>(this.STORAGE_KEY, id);
  }

  // Get or create draft transaction
  static async getOrCreateDraft(): Promise<Transaction> {
    const activeTransactionId = await this.getActiveTransactionId();

    if (activeTransactionId) {
      const existingTransaction = await this.getById(activeTransactionId);
      if (existingTransaction && existingTransaction.status === "pending") {
        return existingTransaction;
      }
    }

    // Create new draft transaction
    const now = new Date();
    const transactionNumber = `TRX-${now.getFullYear()}${String(
      now.getMonth() + 1
    ).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${String(
      now.getHours()
    ).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}${String(
      now.getSeconds()
    ).padStart(2, "0")}`;

    const newTransaction = await this.create({
      transaction_number: transactionNumber,
      customer_name: undefined,
      customer_phone: undefined,
      subtotal: 0,
      discount: 0,
      tax: 0,
      total: 0,
      payment_method: "cash",
      payment_status: "pending",
      status: "pending",
    });

    // Set as active transaction
    await this.setActiveTransactionId(newTransaction.id);

    return newTransaction;
  }

  // Get active transaction ID
  static async getActiveTransactionId(): Promise<number | null> {
    try {
      const value = await AsyncStorage.getItem(this.ACTIVE_TRANSACTION_KEY);
      return value ? parseInt(value, 10) : null;
    } catch (error) {
      console.error("Error getting active transaction ID:", error);
      return null;
    }
  }

  // Set active transaction ID
  static async setActiveTransactionId(id: number): Promise<void> {
    try {
      await AsyncStorage.setItem(this.ACTIVE_TRANSACTION_KEY, id.toString());
    } catch (error) {
      console.error("Error setting active transaction ID:", error);
      throw error;
    }
  }

  // Clear active transaction
  static async clearActiveTransaction(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.ACTIVE_TRANSACTION_KEY);
    } catch (error) {
      console.error("Error clearing active transaction:", error);
    }
  }

  // Transaction Items methods
  private static readonly ITEMS_STORAGE_KEY = process.env
    .EXPO_PUBLIC_TRANSACTION_ITEM as string;

  // Get all transaction items
  static async getItemsByTransactionId(
    transactionId: number
  ): Promise<TransactionItem[]> {
    try {
      const allItems = await LocalStorageService.get<TransactionItem>(
        this.ITEMS_STORAGE_KEY
      );
      return allItems.filter((item) => item.transaction_id === transactionId);
    } catch (error) {
      console.error("Error getting transaction items:", error);
      return [];
    }
  }

  // Add item to transaction
  static async addItem(
    itemData: Omit<TransactionItem, "id" | "created_at" | "updated_at">
  ): Promise<TransactionItem> {
    try {
      const newItem = {
        ...itemData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Omit<TransactionItem, "id">;

      const item = await LocalStorageService.add<TransactionItem>(
        this.ITEMS_STORAGE_KEY,
        newItem
      );

      // Update transaction totals
      await this.updateTransactionTotals(itemData.transaction_id);

      return item;
    } catch (error) {
      console.error("Error adding transaction item:", error);
      throw error;
    }
  }

  // Update transaction item
  static async updateItem(
    id: number,
    itemData: Partial<TransactionItem>
  ): Promise<TransactionItem | null> {
    try {
      const item = await LocalStorageService.update<TransactionItem>(
        this.ITEMS_STORAGE_KEY,
        id,
        itemData
      );

      if (item) {
        // Update transaction totals
        await this.updateTransactionTotals(item.transaction_id);
      }

      return item;
    } catch (error) {
      console.error("Error updating transaction item:", error);
      throw error;
    }
  }

  // Delete transaction item
  static async deleteItem(id: number): Promise<boolean> {
    try {
      // Get item first to get transaction_id
      const item = await LocalStorageService.getById<TransactionItem>(
        this.ITEMS_STORAGE_KEY,
        id
      );
      if (!item) return false;

      const result = await LocalStorageService.delete<TransactionItem>(
        this.ITEMS_STORAGE_KEY,
        id
      );

      if (result) {
        // Update transaction totals
        await this.updateTransactionTotals(item.transaction_id);
      }

      return result;
    } catch (error) {
      console.error("Error deleting transaction item:", error);
      return false;
    }
  }

  // Update transaction totals based on items
  static async updateTransactionTotals(transactionId: number): Promise<void> {
    try {
      const items = await this.getItemsByTransactionId(transactionId);
      // Subtotal should represent original price sum (before discount)
      const subtotal = items.reduce(
        (sum, item) => sum + (item.subtotal || 0),
        0
      );

      // Calculate total discount from items (percentage per item)
      const totalItemsDiscount = items.reduce((sum, item) => {
        const basePrice = item.price || 0;
        const qty = item.quantity || 0;
        const discountPercent = Number(item.discount || 0);
        const discountAmountPerUnit = (basePrice * discountPercent) / 100;
        return sum + discountAmountPerUnit * qty;
      }, 0);

      const transaction = await this.getById(transactionId);
      if (transaction) {
        const discount = transaction.discount || 0; // additional promo/discount
        // Tax disabled: total = subtotal - item discounts - extra discount
        const total = subtotal - totalItemsDiscount - discount;

        await this.update(transactionId, {
          subtotal,
          total,
          // Ensure tax stays zero for compatibility
          tax: 0,
        });
      }
    } catch (error) {
      console.error("Error updating transaction totals:", error);
    }
  }
}
