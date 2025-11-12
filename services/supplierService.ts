import { LocalStorageService } from "@/services/localStorageService";

export class SupplierService {
  private static readonly STORAGE_KEY = process.env
    .EXPO_PUBLIC_PRODUCTS_SUPPLIERS as string;

  // Get all suppliers
  static async getAll(): Promise<Supplier[]> {
    return await LocalStorageService.get<Supplier>(this.STORAGE_KEY);
  }

  // Get supplier by ID
  static async getById(id: number): Promise<Supplier | null> {
    return await LocalStorageService.getById<Supplier>(this.STORAGE_KEY, id);
  }

  // Create new supplier
  static async create(
    supplierData: Omit<Supplier, "id" | "created_at" | "updated_at">
  ): Promise<Supplier> {
    const newSupplier = {
      ...supplierData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Omit<Supplier, "id">;
    return await LocalStorageService.add<Supplier>(
      this.STORAGE_KEY,
      newSupplier
    );
  }

  // Update supplier
  static async update(
    id: number,
    supplierData: Partial<Supplier>
  ): Promise<Supplier | null> {
    return await LocalStorageService.update<Supplier>(
      this.STORAGE_KEY,
      id,
      supplierData
    );
  }

  // Delete supplier
  static async delete(id: number): Promise<boolean> {
    return await LocalStorageService.delete<Supplier>(this.STORAGE_KEY, id);
  }

  // Search suppliers by name
  static async searchByName(name: string): Promise<Supplier[]> {
    const suppliers = await this.getAll();
    return suppliers.filter((supplier) =>
      supplier.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  // Search suppliers by email
  static async searchByEmail(email: string): Promise<Supplier[]> {
    const suppliers = await this.getAll();
    return suppliers.filter((supplier) =>
      supplier.email?.toLowerCase().includes(email.toLowerCase())
    );
  }

  // Get active suppliers (if you add is_active field later)
  static async getActive(): Promise<Supplier[]> {
    const suppliers = await this.getAll();
    return suppliers; // All suppliers are active by default
  }
}
