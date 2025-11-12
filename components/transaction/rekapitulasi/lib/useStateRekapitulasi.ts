import { useEffect, useMemo, useState } from "react";

import { Dimensions } from "react-native";

import { TransactionService } from "@/services/transactionService";

export default function useStateRekapitulasi() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCharts, setShowCharts] = useState(true);
  const [optionSheetVisible, setOptionSheetVisible] = useState(false);

  const loadTransactions = async () => {
    try {
      const allTransactions = await TransactionService.getAll();
      setTransactions(allTransactions);
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

  const onRefresh = () => {
    setRefreshing(true);
    loadTransactions();
  };

  const {
    totalTransactions,
    completedTransactions,
    cancelledTransactions,
    draftTransactions,
    returnTransactions,
    totalRevenue,
    totalSubtotal,
    totalDiscount,
    totalTax,
    cashTransactions,
    cardTransactions,
    transferTransactions,
    cashRevenue,
    cardRevenue,
    transferRevenue,
    statusChartData,
    paymentChartData,
    dailyRevenueData,
    financialBarData,
    paymentCountPie,
    chartWidth,
    paymentBarWidth,
    paymentBarSpacing,
    paymentChartContentWidth,
  } = useMemo(() => {
    const totalTransactionsLocal = transactions.length;
    const completedTransactionsLocal = transactions.filter(
      (t) => t.status === "completed"
    ).length;
    const cancelledTransactionsLocal = transactions.filter(
      (t) => t.status === "cancelled"
    ).length;
    const draftTransactionsLocal = transactions.filter(
      (t) => t.status === "pending"
    ).length;
    const returnTransactionsLocal = transactions.filter(
      (t) => t.status === "return"
    ).length;

    const totals = transactions.filter((t) => t.status === "completed");
    const totalRevenueLocal = totals.reduce((sum, t) => sum + t.total, 0);
    const totalSubtotalLocal = totals.reduce((sum, t) => sum + t.subtotal, 0);
    const totalDiscountLocal = totals.reduce((sum, t) => sum + t.discount, 0);

    const cashTransactionsLocal = transactions.filter(
      (t) => t.payment_method === "cash" && t.status === "completed"
    ).length;
    const cardTransactionsLocal = transactions.filter(
      (t) => t.payment_method === "card" && t.status === "completed"
    ).length;
    const transferTransactionsLocal = transactions.filter(
      (t) => t.payment_method === "transfer" && t.status === "completed"
    ).length;

    const cashRevenueLocal = totals
      .filter((t) => t.payment_method === "cash")
      .reduce((sum, t) => sum + t.total, 0);
    const cardRevenueLocal = totals
      .filter((t) => t.payment_method === "card")
      .reduce((sum, t) => sum + t.total, 0);
    const transferRevenueLocal = totals
      .filter((t) => t.payment_method === "transfer")
      .reduce((sum, t) => sum + t.total, 0);

    const chartWidthLocal = Dimensions.get("window").width - 32;

    const statusChartDataLocal = [
      { label: "Selesai", value: completedTransactionsLocal, color: "#10b981" },
      {
        label: "Dibatalkan",
        value: cancelledTransactionsLocal,
        color: "#ef4444",
      },
      { label: "Pending", value: draftTransactionsLocal, color: "#f59e0b" },
      { label: "Return", value: returnTransactionsLocal, color: "#3b82f6" },
    ].filter((d) => d.value > 0);

    const paymentChartDataLocal = [
      { label: "Tunai", value: cashRevenueLocal },
      { label: "Kartu", value: cardRevenueLocal },
      { label: "Transfer", value: transferRevenueLocal },
    ].filter((d) => d.value > 0);

    const paymentBarWidthLocal = 30;
    const paymentBarSpacingLocal = 18;
    const paymentChartContentWidthLocal = Math.max(
      chartWidthLocal - 16,
      paymentChartDataLocal.length *
        (paymentBarWidthLocal + paymentBarSpacingLocal) +
        24
    );

    const dailyRevenueMap: Record<string, number> = {};
    totals.forEach((t) => {
      const date = new Date(t.created_at);
      const key = date.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      dailyRevenueMap[key] = (dailyRevenueMap[key] || 0) + t.total;
    });
    const sortedDailyKeys = Object.keys(dailyRevenueMap).sort((a, b) => {
      const da = new Date(a.split("/").reverse().join("-")).getTime();
      const db = new Date(b.split("/").reverse().join("-")).getTime();
      return da - db;
    });
    const dailyRevenueDataLocal = sortedDailyKeys.map((k) => ({
      value: dailyRevenueMap[k],
      label: k.slice(0, 5),
    }));

    const financialBarDataLocal = [
      { value: totalSubtotalLocal, label: "Subtotal", frontColor: "#6b7280" },
      { value: totalDiscountLocal, label: "Diskon", frontColor: "#ef4444" },
      { value: totalRevenueLocal, label: "Total", frontColor: "#10b981" },
    ].filter((d) => d.value > 0);

    const paymentCountPieLocal = [
      { label: "Tunai", value: cashTransactionsLocal, color: "#10b981" },
      { label: "Kartu", value: cardTransactionsLocal, color: "#3b82f6" },
      { label: "Transfer", value: transferTransactionsLocal, color: "#8b5cf6" },
    ].filter((d) => d.value > 0);

    return {
      totalTransactions: totalTransactionsLocal,
      completedTransactions: completedTransactionsLocal,
      cancelledTransactions: cancelledTransactionsLocal,
      draftTransactions: draftTransactionsLocal,
      returnTransactions: returnTransactionsLocal,
      totalRevenue: totalRevenueLocal,
      totalSubtotal: totalSubtotalLocal,
      totalDiscount: totalDiscountLocal,
      // totalTax removed
      cashTransactions: cashTransactionsLocal,
      cardTransactions: cardTransactionsLocal,
      transferTransactions: transferTransactionsLocal,
      cashRevenue: cashRevenueLocal,
      cardRevenue: cardRevenueLocal,
      transferRevenue: transferRevenueLocal,
      statusChartData: statusChartDataLocal,
      paymentChartData: paymentChartDataLocal,
      dailyRevenueData: dailyRevenueDataLocal,
      financialBarData: financialBarDataLocal,
      paymentCountPie: paymentCountPieLocal,
      chartWidth: chartWidthLocal,
      paymentBarWidth: paymentBarWidthLocal,
      paymentBarSpacing: paymentBarSpacingLocal,
      paymentChartContentWidth: paymentChartContentWidthLocal,
    };
  }, [transactions]);

  return {
    // state
    loading,
    refreshing,
    showCharts,
    optionSheetVisible,
    // setters
    setShowCharts,
    setOptionSheetVisible,
    // actions
    onRefresh,
    // computed
    totalTransactions,
    completedTransactions,
    cancelledTransactions,
    draftTransactions,
    returnTransactions,
    totalRevenue,
    totalSubtotal,
    totalDiscount,
    // totalTax removed
    cashTransactions,
    cardTransactions,
    transferTransactions,
    cashRevenue,
    cardRevenue,
    transferRevenue,
    statusChartData,
    paymentChartData,
    dailyRevenueData,
    financialBarData,
    paymentCountPie,
    chartWidth,
    paymentBarWidth,
    paymentBarSpacing,
    paymentChartContentWidth,
  };
}
