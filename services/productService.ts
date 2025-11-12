import { LocalStorageService } from "@/services/localStorageService";

import { ProductCategoryService } from "@/services/productCategoryService";

import { ProductSizeService } from "@/services/productSizeService";

import { SupplierService } from "@/services/supplierService";

export class ProductService {
  private static readonly STORAGE_KEY = process.env
    .EXPO_PUBLIC_PRODUCTS as string;

  // Get all products
  static async getAll(): Promise<Product[]> {
    return await LocalStorageService.get<Product>(this.STORAGE_KEY);
  }

  // Get product by ID
  static async getById(id: number): Promise<Product | null> {
    return await LocalStorageService.getById<Product>(this.STORAGE_KEY, id);
  }

  // Get products with relations
  static async getAllWithRelations(): Promise<Product[]> {
    const products = await this.getAll();
    const categories = await ProductCategoryService.getAll();
    const sizes = await ProductSizeService.getAll();
    const suppliers = await SupplierService.getAll();

    return products.map((product) => ({
      ...product,
      product_categories: categories.find(
        (cat) => cat.id === product.category_id
      ),
      product_sizes: sizes.find((size) => size.id === product.size_id),
      suppliers: suppliers.find(
        (supplier) => supplier.id === product.supplier_id
      ),
    }));
  }

  // Create new product
  static async create(
    productData: Omit<Product, "id" | "created_at" | "updated_at">
  ): Promise<Product> {
    const newProduct = {
      ...productData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Omit<Product, "id">;
    return await LocalStorageService.add<Product>(this.STORAGE_KEY, newProduct);
  }

  // Update product
  static async update(
    id: number,
    productData: Partial<Product>
  ): Promise<Product | null> {
    return await LocalStorageService.update<Product>(
      this.STORAGE_KEY,
      id,
      productData
    );
  }

  // Delete product
  static async delete(id: number): Promise<boolean> {
    return await LocalStorageService.delete<Product>(this.STORAGE_KEY, id);
  }

  // Search products by name
  static async searchByName(name: string): Promise<Product[]> {
    const products = await this.getAll();
    return products.filter((product) =>
      product.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  // Get products by category
  static async getByCategory(categoryId: number): Promise<Product[]> {
    const products = await this.getAll();
    return products.filter((product) => product.category_id === categoryId);
  }

  // Get products by supplier
  static async getBySupplier(supplierId: number): Promise<Product[]> {
    const products = await this.getAll();
    return products.filter((product) => product.supplier_id === supplierId);
  }

  // Get low stock products
  static async getLowStock(): Promise<Product[]> {
    const products = await this.getAll();
    return products.filter(
      (product) => product.min_stock && product.stock <= product.min_stock
    );
  }

  // Update stock
  static async updateStock(
    id: number,
    newStock: number
  ): Promise<Product | null> {
    return await this.update(id, { stock: newStock });
  }

  // Update sold quantity
  static async updateSold(
    id: number,
    soldQuantity: number
  ): Promise<Product | null> {
    const product = await this.getById(id);
    if (!product) return null;

    const newSold = product.sold + soldQuantity;
    const newStock = product.stock - soldQuantity;

    return await this.update(id, {
      sold: newSold,
      stock: Math.max(0, newStock),
    });
  }
}
