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
  payment_card_id?: number;
  payment_status: "pending" | "paid" | "cancelled" | "return";
  status: "pending" | "completed" | "cancelled" | "return";
  created_by?: string;
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

interface CardTransactionProps {
  item: any;
  formatIDR: (amount: number) => string;
  onUpdateQty: (itemId: number, newQty: number) => void;
}

interface PaymentModalProps {
  visible: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  paymentMethod: "cash" | "card" | "transfer";
  selectedPaymentCardId: number | null;
  paymentCards: PaymentCard[];
  amountPaid: string;
  validationError?: string | null;
  formatIDR: (amount: number) => string;
  formatIdrNumber: (raw: string) => string;
  getAmountPaidValue: () => number;
  getSuggestedAmounts: () => number[];
  isAmountInsufficient: () => boolean;
  getPaymentMethodLabel: (method: PaymentMethodOption) => string;
  onPaymentMethodChange: (method: "cash" | "card" | "transfer") => void;
  onPaymentCardSelect: (cardId: number | null) => void;
  onAmountPaidChange: (text: string) => void;
  onSavePaymentInfo: () => void;
}

interface ProductsBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  products: any[];
  filteredProducts: any[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedProducts: Record<number, number>;
  setSelectedProducts: (products: Record<number, number>) => void;
  formatIDR: (amount: number) => string;
  addProductQty: (productId: number) => void;
  subProductQty: (productId: number) => void;
  handleAddProducts: () => void;
  categories: any[];
  sizes: any[];
  selectedCategoryId: number | null;
  selectedSizeId: number | null;
  handleApplyFilters: (
    categoryId: number | null,
    sizeId: number | null
  ) => void;
  handleResetFilters: () => void;
}

type StatusChartItem = { label: string; value: number; color: string };
type PaymentChartItem = { label: string; value: number };
type FinancialBarItem = { value: number; label: string; frontColor: string };

type ChartProps = {
  chartWidth: number;
  statusChartData: StatusChartItem[];
  totalTransactions: number;
  dailyRevenueData: { value: number; label: string }[];
  formatIDR: (value: number) => string;
  paymentChartData: PaymentChartItem[];
  paymentBarWidth: number;
  paymentBarSpacing: number;
  paymentChartContentWidth: number;
  paymentCountPie: { label: string; value: number; color: string }[];
  financialBarData: FinancialBarItem[];
};

type NonChartProps = {
  totalTransactions: number;
  totalRevenue: number;
  formatIDR: (value: number) => string;
  completedTransactions: number;
  cancelledTransactions: number;
  draftTransactions: number;
  returnTransactions: number;
  totalSubtotal: number;
  totalDiscount: number;
  cashRevenue: number;
  cardRevenue: number;
  transferRevenue: number;
  cashTransactions: number;
  cardTransactions: number;
  transferTransactions: number;
};

type DatePreset = "all" | "today" | "7d" | "30d";

type Filters = {
  datePreset: DatePreset;
  paymentMethod: Transaction["payment_method"] | "all";
  paymentStatus: Transaction["payment_status"] | "all";
  status: Transaction["status"] | "all";
  customerName: string;
  layout: "list" | "grid";
};

type AllTransactionCardProps = {
  item: Transaction;
  layout: "list" | "grid";
  onPress: () => void;
  formatIDR: (amount: number) => string;
  formatDateTime: (iso: string) => string;
  getStatusColor: (status: string) => string;
  getPaymentMethodIcon: (method: string) => string;
  getPaymentStatusStyles: (status?: string) => {
    bg: string;
    text: string;
    label: string;
  };
};

interface UseStateCreateTransactionProps {
  transactionId: number;
  products: any[];
  formatIDR: (amount: number) => string;
  router: any;
}

interface DailyTransaction {
  date: string;
  transactions: Transaction[];
  totalRevenue: number;
  totalCount: number;
}

type CustomerSummary = {
  name: string;
  phone?: string;
  totalSpent: number;
  transactionsCount: number;
  lastTransactionAt: string;
};
