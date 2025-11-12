type PaymentMethodOption =
  | "gopay"
  | "ovo"
  | "dana"
  | "shopeepay"
  | "linkaja"
  | "qris"
  | "debit_card"
  | "credit_card"
  | "bank_transfer";

type BankName =
  | "bca"
  | "bri"
  | "mandiri"
  | "bni"
  | "cimb"
  | "permata"
  | "danamon"
  | "other";

interface PaymentCard {
  id: number;
  method: PaymentMethodOption;
  bank?: BankName;
  account_number?: string;
  holder_name?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  image?: PaymentCardImage;
}

interface PaymentCardImage {
  url: string;
  alt?: string;
}
