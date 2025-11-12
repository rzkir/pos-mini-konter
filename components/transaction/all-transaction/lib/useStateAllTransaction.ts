import { useEffect, useMemo, useState } from "react";

import { TransactionService } from "@/services/transactionService";

export function useStateAllTransaction() {
  const PAGE_SIZE = 20;
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [layout, setLayout] = useState<"list" | "grid">("list");
  const [filters, setFilters] = useState<Filters>({
    datePreset: "all",
    paymentMethod: "all",
    paymentStatus: "all",
    status: "all",
    customerName: "",
    layout: "list",
  });
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);

  const loadTransactions = async () => {
    try {
      const allTransactions = await TransactionService.getAll();
      const sorted = allTransactions.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setTransactions(sorted);
    } catch (error) {
      console.error("Error loading transactions:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setFilters((prev) => ({ ...prev, customerName: searchText }));
    }, 300);
    return () => clearTimeout(handler);
  }, [searchText, setFilters]);

  const onRefresh = () => {
    setRefreshing(true);
    loadTransactions();
  };

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    let startDate: Date | null = null;
    if (filters.datePreset === "today") {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      startDate = d;
    } else if (filters.datePreset === "7d") {
      const d = new Date(now);
      d.setDate(d.getDate() - 7);
      startDate = d;
    } else if (filters.datePreset === "30d") {
      const d = new Date(now);
      d.setDate(d.getDate() - 30);
      startDate = d;
    }

    return transactions.filter((t) => {
      if (startDate) {
        const created = new Date(t.created_at);
        if (created < startDate) return false;
      }
      if (
        filters.paymentMethod !== "all" &&
        t.payment_method !== filters.paymentMethod
      )
        return false;
      if (
        filters.paymentStatus !== "all" &&
        t.payment_status !== filters.paymentStatus
      )
        return false;
      if (filters.status !== "all" && t.status !== filters.status) return false;
      if (filters.customerName.trim()) {
        const q = filters.customerName.trim().toLowerCase();
        const name = (t.customer_name || "").toLowerCase();
        if (!name.includes(q)) return false;
      }
      return true;
    });
  }, [filters, transactions]);

  const visibleTransactions = useMemo(
    () => filteredTransactions.slice(0, page * PAGE_SIZE),
    [filteredTransactions, page]
  );

  const hasMore = visibleTransactions.length < filteredTransactions.length;

  const loadMore = () => {
    if (hasMore) setPage((p) => p + 1);
  };

  useEffect(() => {
    // Reset pagination when filters change
    setPage(1);
  }, [filters]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "return":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "cash":
        return "cash";
      case "card":
        return "card";
      case "transfer":
        return "swap-horizontal";
      default:
        return "wallet";
    }
  };

  const getPaymentStatusStyles = (status?: string) => {
    if (status === "paid")
      return { bg: "bg-green-100", text: "text-green-700", label: "Lunas" };
    if (status === "cancelled")
      return { bg: "bg-red-100", text: "text-red-700", label: "Dibatalkan" };
    if (status === "return")
      return { bg: "bg-blue-100", text: "text-blue-700", label: "Return" };
    return { bg: "bg-yellow-100", text: "text-yellow-700", label: "Menunggu" };
  };

  return {
    // state
    transactions,
    loading,
    refreshing,
    filterVisible,
    layout,
    filters,
    page,
    // setters
    setFilterVisible,
    setLayout,
    setFilters,
    setPage,
    searchText,
    setSearchText,
    // data
    filteredTransactions,
    visibleTransactions,
    // actions
    onRefresh,
    loadTransactions,
    loadMore,
    // helpers
    getStatusColor,
    getPaymentMethodIcon,
    getPaymentStatusStyles,
    hasMore,
  };
}

export type UseStateAllTransactionReturn = ReturnType<
  typeof useStateAllTransaction
>;
