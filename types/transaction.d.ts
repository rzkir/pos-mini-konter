interface Transaction {
  id: number;
  transaction_number: string;
  customer_name?: string;
  customer_phone?: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  payment_method: "cash" | "card" | "transfer";
  payment_status: "pending" | "paid" | "cancelled";
  status: "draft" | "completed" | "cancelled";
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface TransactionItem {
  id: number;
  transaction_id: number;
  product_id: number;
  quantity: number;
  price: number;
  discount: number;
  subtotal: number;
  created_at: string;
  updated_at: string;
}
