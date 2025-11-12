import { useState, useCallback, useMemo, useEffect } from "react";

import { useFocusEffect } from "@react-navigation/native";

import { router } from "expo-router";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { TransactionService } from "@/services/transactionService";

import { useProducts } from "@/hooks/useProducts";

import { useAppSettingsContext } from "@/context/AppSettingsContext";

import { useCompanyProfile } from "@/hooks/useCompanyProfile";

export function useStateProducts() {
  const { formatIDR } = useAppSettingsContext();
  const { companyProfile } = useCompanyProfile();
  const { products, productsWithRelations, refreshData } = useProducts();

  useEffect(() => {
    AsyncStorage.setItem("isLoggedIn", "true");
  }, []);
  const [search, setSearch] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState<number | "all">(
    "all"
  );
  const [productIdToQty, setProductIdToQty] = useState<Record<number, number>>(
    {}
  );

  useFocusEffect(
    useCallback(() => {
      setProductIdToQty({});
    }, [])
  );

  const addQty = useCallback((id: number) => {
    setProductIdToQty((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  }, []);

  const subQty = useCallback((id: number) => {
    setProductIdToQty((prev) => {
      const current = prev[id] ?? 0;
      if (current <= 1) {
        const { [id]: _removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: current - 1 };
    });
  }, []);

  const categories = useMemo(() => {
    const unique = new Map<number, ProductCategory>();
    productsWithRelations.forEach((p) => {
      const cat = p.product_categories;
      if (cat && typeof cat.id === "number" && !unique.has(cat.id))
        unique.set(cat.id, cat);
    });
    return Array.from(unique.values());
  }, [productsWithRelations]);

  const topSellerProducts = useMemo(() => {
    let list = products.filter((p: any) => p.best_seller === true);
    if (activeCategoryId !== "all") {
      list = list.filter((p: any) => p.category_id === activeCategoryId);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p: any) =>
          p.name.toLowerCase().includes(q) ||
          p.barcode.toLowerCase().includes(q)
      );
    }
    return list;
  }, [products, search, activeCategoryId]);

  const filtered = useMemo(() => {
    let list = products.filter((p: any) => p.best_seller !== true);
    if (activeCategoryId !== "all") {
      list = list.filter((p: any) => p.category_id === activeCategoryId);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p: any) =>
          p.name.toLowerCase().includes(q) ||
          p.barcode.toLowerCase().includes(q)
      );
    }
    return list;
  }, [products, search, activeCategoryId]);

  const selectedCount = useMemo(() => {
    return Object.values(productIdToQty).reduce((a, b) => a + b, 0);
  }, [productIdToQty]);

  const selectedTotal = useMemo(() => {
    return products.reduce(
      (sum: number, p: any) =>
        sum +
        (productIdToQty[p.id] ? productIdToQty[p.id] * (p.price || 0) : 0),
      0
    );
  }, [products, productIdToQty]);

  const handleCartPress = useCallback(async () => {
    try {
      await AsyncStorage.setItem(
        process.env.EXPO_PUBLIC_SELECTED_PRODUCTS as string,
        JSON.stringify(productIdToQty)
      );

      // Cek apakah ada transaction ID yang sedang aktif (untuk menambahkan produk)
      const currentTransactionId = await AsyncStorage.getItem(
        "current_transaction_id"
      );

      setProductIdToQty({});

      if (currentTransactionId) {
        // Menambahkan produk ke transaksi yang sudah ada
        router.push({
          pathname: "/transaction/[id]",
          params: { id: currentTransactionId },
        });
      } else {
        // Membuat transaksi baru
        const transaction = await TransactionService.getOrCreateDraft();

        router.push({
          pathname: "/transaction/[id]",
          params: { id: transaction.id.toString() },
        });
      }
    } catch (error) {
      console.error("Error creating transaction:", error);
    }
  }, [productIdToQty]);

  const handleNavigateAllProducts = () => {
    router.push("/checkout");
  };

  return {
    search,
    setSearch,
    activeCategoryId,
    setActiveCategoryId,
    productIdToQty,
    setProductIdToQty,
    addQty,
    subQty,
    categories,
    topSellerProducts,
    filtered,
    selectedCount,
    selectedTotal,
    handleCartPress,
    handleNavigateAllProducts,
    products,
    productsWithRelations,
    formatIDR,
    companyProfile,
    refreshData,
  };
}
