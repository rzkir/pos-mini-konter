import AsyncStorage from "@react-native-async-storage/async-storage";

export class LocalStorageService {
  // Generic methods for any entity
  static async get<T>(key: string): Promise<T[]> {
    try {
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`Error getting data from ${key}:`, error);
      return [];
    }
  }

  static async set<T>(key: string, data: T[]): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error setting data to ${key}:`, error);
      throw error;
    }
  }

  static async add<T extends { id?: number }>(
    key: string,
    item: Omit<T, "id">
  ): Promise<T> {
    try {
      const existingData = await this.get<T>(key);
      const newItem = { ...item, id: this.generateId(existingData) } as T;
      const updatedData = [...existingData, newItem];
      await this.set(key, updatedData);
      return newItem;
    } catch (error) {
      console.error(`Error adding item to ${key}:`, error);
      throw error;
    }
  }

  static async update<T>(
    key: string,
    id: number,
    updatedItem: Partial<T>
  ): Promise<T | null> {
    try {
      const existingData = await this.get<T>(key);
      const index = existingData.findIndex((item: any) => item.id === id);

      if (index === -1) {
        return null;
      }

      const updatedData = [...existingData];
      updatedData[index] = {
        ...updatedData[index],
        ...updatedItem,
        updated_at: new Date().toISOString(),
      };
      await this.set(key, updatedData);
      return updatedData[index];
    } catch (error) {
      console.error(`Error updating item in ${key}:`, error);
      throw error;
    }
  }

  static async delete<T>(key: string, id: number): Promise<boolean> {
    try {
      const existingData = await this.get<T>(key);
      const filteredData = existingData.filter((item: any) => item.id !== id);
      await this.set(key, filteredData);
      return true;
    } catch (error) {
      console.error(`Error deleting item from ${key}:`, error);
      throw error;
    }
  }

  static async getById<T>(key: string, id: number): Promise<T | null> {
    try {
      const existingData = await this.get<T>(key);
      return existingData.find((item: any) => item.id === id) || null;
    } catch (error) {
      console.error(`Error getting item by id from ${key}:`, error);
      return null;
    }
  }

  private static generateId<T>(existingData: T[]): number {
    if (existingData.length === 0) return 1;
    const maxId = Math.max(...existingData.map((item: any) => item.id || 0));
    return maxId + 1;
  }

  // Clear all data
  static async clearAll(): Promise<void> {
    try {
      const keys = [
        process.env.EXPO_PUBLIC_PRODUCTS as string,
        process.env.EXPO_PUBLIC_PRODUCTS_CATEGORIES as string,
        process.env.EXPO_PUBLIC_PRODUCTS_PRODUCTS_SIZES as string,
        process.env.EXPO_PUBLIC_PRODUCTS_SUPPLIERS as string,
      ];
      await AsyncStorage.multiRemove(keys);
    } catch (error) {
      console.error("Error clearing all data:", error);
      throw error;
    }
  }
}
