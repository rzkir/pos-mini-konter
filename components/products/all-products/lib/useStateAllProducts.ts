import { useEffect, useMemo, useState } from "react";

import { useRouter } from "expo-router";

import { useProducts } from "@/hooks/useProducts";

import { useCategories } from "@/hooks/useCategories";

import { useSizes } from "@/hooks/useSizes";

import { useAppSettingsContext } from "@/context/AppSettingsContext";

export function useStateAllProducts() {
  const router = useRouter();
  const { products, refreshData, loading } = useProducts();
  const { categories } = useCategories();
  const { sizes } = useSizes();
  const { formatIDR } = useAppSettingsContext();
  const [refreshing, setRefreshing] = useState(false);
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [selectedSizeId, setSelectedSizeId] = useState<number | null>(null);

  const filteredList = useMemo(() => {
    let filtered = [...products];

    if (selectedCategoryId !== null) {
      filtered = filtered.filter(
        (product: any) => product?.category_id === selectedCategoryId
      );
    }

    if (selectedSizeId !== null) {
      filtered = filtered.filter(
        (product: any) => product?.size_id === selectedSizeId
      );
    }

    return filtered;
  }, [products, selectedCategoryId, selectedSizeId]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshData();
    } catch {
    } finally {
      setRefreshing(false);
    }
  };

  const handleOpenFilter = () => {
    setShowFilterSheet(true);
  };

  const handleCloseFilter = () => {
    setShowFilterSheet(false);
  };

  const handleApplyFilter = (
    categoryId: number | null,
    sizeId: number | null
  ) => {
    setSelectedCategoryId(categoryId);
    setSelectedSizeId(sizeId);
  };

  const handleResetFilter = () => {
    setSelectedCategoryId(null);
    setSelectedSizeId(null);
  };

  return {
    router,
    loading,
    categories,
    sizes,
    formatIDR,
    refreshing,
    showFilterSheet,
    selectedCategoryId,
    selectedSizeId,
    filteredList,
    onRefresh,
    handleOpenFilter,
    handleCloseFilter,
    handleApplyFilter,
    handleResetFilter,
  };
}
