import { LocalStorageService } from "@/services/localStorageService";

export class ProductSizeService {
  private static readonly STORAGE_KEY = process.env
    .EXPO_PUBLIC_PRODUCTS_PRODUCTS_SIZES as string;

  // Get all sizes
  static async getAll(): Promise<ProductSize[]> {
    return await LocalStorageService.get<ProductSize>(this.STORAGE_KEY);
  }

  // Get size by ID
  static async getById(id: number): Promise<ProductSize | null> {
    return await LocalStorageService.getById<ProductSize>(this.STORAGE_KEY, id);
  }

  // Create new size
  static async create(
    sizeData: Omit<ProductSize, "id" | "created_at" | "updated_at">
  ): Promise<ProductSize> {
    const newSize = {
      ...sizeData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Omit<ProductSize, "id">;
    return await LocalStorageService.add<ProductSize>(
      this.STORAGE_KEY,
      newSize
    );
  }

  // Update size
  static async update(
    id: number,
    sizeData: Partial<ProductSize>
  ): Promise<ProductSize | null> {
    return await LocalStorageService.update<ProductSize>(
      this.STORAGE_KEY,
      id,
      sizeData
    );
  }

  // Delete size
  static async delete(id: number): Promise<boolean> {
    return await LocalStorageService.delete<ProductSize>(this.STORAGE_KEY, id);
  }

  // Search sizes by name
  static async searchByName(name: string): Promise<ProductSize[]> {
    const sizes = await this.getAll();
    return sizes.filter((size) =>
      size.name.toLowerCase().includes(name.toLowerCase())
    );
  }
}
