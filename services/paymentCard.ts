import { LocalStorageService } from "@/services/localStorageService";

export class PaymentCardService {
  private static readonly STORAGE_KEY = process.env
    .EXPO_PUBLIC_PAYMENT_CARD as string;

  static async getAll(): Promise<PaymentCard[]> {
    return await LocalStorageService.get<PaymentCard>(this.STORAGE_KEY);
  }

  static async getById(id: number): Promise<PaymentCard | null> {
    return await LocalStorageService.getById<PaymentCard>(this.STORAGE_KEY, id);
  }

  static async create(
    cardData: Omit<PaymentCard, "id" | "created_at" | "updated_at">
  ): Promise<PaymentCard> {
    const newCard = {
      ...cardData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Omit<PaymentCard, "id">;
    return await LocalStorageService.add<PaymentCard>(
      this.STORAGE_KEY,
      newCard
    );
  }

  static async update(
    id: number,
    cardData: Partial<PaymentCard>
  ): Promise<PaymentCard | null> {
    return await LocalStorageService.update<PaymentCard>(
      this.STORAGE_KEY,
      id,
      cardData
    );
  }

  static async delete(id: number): Promise<boolean> {
    return await LocalStorageService.delete<PaymentCard>(this.STORAGE_KEY, id);
  }
}
