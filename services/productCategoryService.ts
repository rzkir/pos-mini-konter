import { LocalStorageService } from "@/services/localStorageService";

export class ProductCategoryService {
  private static readonly STORAGE_KEY = process.env
    .EXPO_PUBLIC_PRODUCTS_CATEGORIES as string;

  // Get all categories
  static async getAll(): Promise<ProductCategory[]> {
    return await LocalStorageService.get<ProductCategory>(this.STORAGE_KEY);
  }

  // Get category by ID
  static async getById(id: number): Promise<ProductCategory | null> {
    return await LocalStorageService.getById<ProductCategory>(
      this.STORAGE_KEY,
      id
    );
  }

  // Create new category
  static async create(
    categoryData: Omit<ProductCategory, "id" | "created_at" | "updated_at">
  ): Promise<ProductCategory> {
    const newCategory = {
      ...categoryData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Omit<ProductCategory, "id">;
    return await LocalStorageService.add<ProductCategory>(
      this.STORAGE_KEY,
      newCategory
    );
  }

  // Update category
  static async update(
    id: number,
    categoryData: Partial<ProductCategory>
  ): Promise<ProductCategory | null> {
    return await LocalStorageService.update<ProductCategory>(
      this.STORAGE_KEY,
      id,
      categoryData
    );
  }

  // Delete category
  static async delete(id: number): Promise<boolean> {
    return await LocalStorageService.delete<ProductCategory>(
      this.STORAGE_KEY,
      id
    );
  }

  // Search categories by name
  static async searchByName(name: string): Promise<ProductCategory[]> {
    const categories = await this.getAll();
    return categories.filter((category) =>
      category.name.toLowerCase().includes(name.toLowerCase())
    );
  }
}
