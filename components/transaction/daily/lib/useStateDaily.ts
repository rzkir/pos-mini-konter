import { useCallback, useEffect, useMemo, useState } from "react";

import { TransactionService } from "@/services/transactionService";

export function useStateDaily() {
  const [activeDayTab, setActiveDayTab] = useState<number>(() =>
    new Date().getDay()
  );
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [pendingDayTab, setPendingDayTab] = useState<number | null>(null);
  const [allDailyTransactions, setAllDailyTransactions] = useState<
    DailyTransaction[]
  >([]);
  const [dailyTransactions, setDailyTransactions] = useState<
    DailyTransaction[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const dayName = useCallback(
    (day: number): string =>
      ({
        1: "Senin",
        2: "Selasa",
        3: "Rabu",
        4: "Kamis",
        5: "Jumat",
        6: "Sabtu",
        0: "Minggu",
      }[day] ?? ""),
    []
  );

  const getStatusColor = useCallback((status: string): string => {
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
  }, []);

  const formatDateLabel = useCallback((dateString: string): string => {
    const [day, month, year] = dateString.split("/");
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const dayNameLocal = date.toLocaleDateString("id-ID", { weekday: "long" });
    const fullDate = date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return `${dayNameLocal}, ${fullDate}`;
  }, []);

  const openSheet = (currentDay?: number) => {
    setPendingDayTab(
      typeof currentDay === "number" ? currentDay : activeDayTab
    );
    setIsSheetOpen(true);
  };

  const closeSheet = () => {
    setIsSheetOpen(false);
  };

  const applySelection = () => {
    if (pendingDayTab !== null) {
      setActiveDayTab(pendingDayTab);
    }
    setIsSheetOpen(false);
  };

  const loadTransactions = useCallback(async () => {
    try {
      const allTransactions = await TransactionService.getAll();

      const grouped: { [key: string]: Transaction[] } = {};

      allTransactions.forEach((transaction) => {
        const date = new Date(transaction.created_at);
        const dateKey = date.toLocaleDateString("id-ID", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });

        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        grouped[dateKey].push(transaction);
      });

      const daily: DailyTransaction[] = Object.keys(grouped)
        .map((dateKey) => {
          const transactions = grouped[dateKey]
            .filter((t) => t.status === "completed")
            .sort(
              (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
            );

          const totalRevenue = transactions.reduce(
            (sum, t) => sum + t.total,
            0
          );

          return {
            date: dateKey,
            transactions,
            totalRevenue,
            totalCount: transactions.length,
          };
        })
        .filter((day) => day.transactions.length > 0)
        .sort((a, b) => {
          return (
            new Date(b.date.split("/").reverse().join("-")).getTime() -
            new Date(a.date.split("/").reverse().join("-")).getTime()
          );
        });

      setAllDailyTransactions(daily);
    } catch (error) {
      console.error("Error loading transactions:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadTransactions();
  };

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  useEffect(() => {
    if (allDailyTransactions.length === 0) return;
    const filtered = allDailyTransactions.filter((d) => {
      const [dd, mm, yyyy] = d.date.split("/");
      const dt = new Date(parseInt(yyyy), parseInt(mm) - 1, parseInt(dd));
      return dt.getDay() === activeDayTab;
    });
    setDailyTransactions(filtered);
  }, [activeDayTab, allDailyTransactions]);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchText), 300);
    return () => clearTimeout(handler);
  }, [searchText]);

  const displayedDailyTransactions = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    if (!q) return dailyTransactions;
    return dailyTransactions
      .map((d) => {
        const filtered = d.transactions.filter((t) =>
          (t.customer_name || "").toLowerCase().includes(q)
        );
        const totalRevenue = filtered.reduce((sum, t) => sum + t.total, 0);
        return {
          ...d,
          transactions: filtered,
          totalRevenue,
          totalCount: filtered.length,
        };
      })
      .filter((d) => d.transactions.length > 0);
  }, [dailyTransactions, debouncedSearch]);

  return {
    // data
    dailyTransactions,
    displayedDailyTransactions,
    loading,
    refreshing,
    onRefresh,
    // filter states
    activeDayTab,
    isSheetOpen,
    pendingDayTab,
    setPendingDayTab,
    // search states
    searchText,
    setSearchText,
    dayName,
    getStatusColor,
    formatDateLabel,
    openSheet,
    closeSheet,
    applySelection,
  };
}
