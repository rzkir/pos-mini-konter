import { useRouter } from "expo-router";

import { useEffect, useMemo, useState } from "react";

import { useProducts as useCoreProducts } from "@/hooks/useProducts";

import { useCategories } from "@/hooks/useCategories";

import { useSizes } from "@/hooks/useSizes";

import { useSuppliers } from "@/hooks/useSuppliers";

import { Alert } from "react-native";

import Toast from "react-native-toast-message";

import { useAppSettingsContext } from "@/context/AppSettingsContext";

export function useProducts() {
  const router = useRouter();

  const { formatIDR, formatDateTime } = useAppSettingsContext();
  const { products, loading, deleteProduct, refreshData } = useCoreProducts();

  const { categories, refreshCategories } = useCategories();
  const { sizes, refreshSizes } = useSizes();
  const { suppliers, refreshSuppliers } = useSuppliers();

  const [searchTerm, setSearchTerm] = useState("");
  const [showDetailsView, setShowDetailsView] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [selectedSizeId, setSelectedSizeId] = useState<number | null>(null);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  useEffect(() => {
    refreshCategories();
    refreshSizes();
    refreshSuppliers();
  }, [refreshCategories, refreshSizes, refreshSuppliers]);

  const filteredProducts = useMemo(() => {
    const getTime = (p: any) => {
      const updated = p?.updated_at ? new Date(p.updated_at).getTime() : 0;
      const created = p?.created_at ? new Date(p.created_at).getTime() : 0;
      return Math.max(updated, created);
    };

    let baseList = products;

    // Filter by search term
    if (searchTerm) {
      baseList = baseList.filter(
        (product: any) =>
          product?.name?.toLowerCase?.().includes(searchTerm.toLowerCase()) ||
          product?.barcode?.toLowerCase?.().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategoryId !== null) {
      baseList = baseList.filter(
        (product: any) => product?.category_id === selectedCategoryId
      );
    }

    // Filter by size
    if (selectedSizeId !== null) {
      baseList = baseList.filter(
        (product: any) => product?.size_id === selectedSizeId
      );
    }

    return [...baseList]
      .sort((a: any, b: any) => getTime(b) - getTime(a))
      .slice(0, 10);
  }, [products, searchTerm, selectedCategoryId, selectedSizeId]);

  const bestSellerProducts = useMemo(() => {
    const getTime = (p: any) => {
      const updated = p?.updated_at ? new Date(p.updated_at).getTime() : 0;
      const created = p?.created_at ? new Date(p.created_at).getTime() : 0;
      return Math.max(updated, created);
    };

    let baseList = products;

    // Filter by search term
    if (searchTerm) {
      baseList = baseList.filter(
        (product: any) =>
          product?.name?.toLowerCase?.().includes(searchTerm.toLowerCase()) ||
          product?.barcode?.toLowerCase?.().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategoryId !== null) {
      baseList = baseList.filter(
        (product: any) => product?.category_id === selectedCategoryId
      );
    }

    // Filter by size
    if (selectedSizeId !== null) {
      baseList = baseList.filter(
        (product: any) => product?.size_id === selectedSizeId
      );
    }

    // Filter best seller products
    return [...baseList]
      .filter((product: any) => product?.best_seller === true)
      .sort((a: any, b: any) => getTime(b) - getTime(a));
  }, [products, searchTerm, selectedCategoryId, selectedSizeId]);

  const regularProducts = useMemo(() => {
    const getTime = (p: any) => {
      const updated = p?.updated_at ? new Date(p.updated_at).getTime() : 0;
      const created = p?.created_at ? new Date(p.created_at).getTime() : 0;
      return Math.max(updated, created);
    };

    let baseList = products;

    // Filter by search term
    if (searchTerm) {
      baseList = baseList.filter(
        (product: any) =>
          product?.name?.toLowerCase?.().includes(searchTerm.toLowerCase()) ||
          product?.barcode?.toLowerCase?.().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategoryId !== null) {
      baseList = baseList.filter(
        (product: any) => product?.category_id === selectedCategoryId
      );
    }

    // Filter by size
    if (selectedSizeId !== null) {
      baseList = baseList.filter(
        (product: any) => product?.size_id === selectedSizeId
      );
    }

    // Filter regular (non-best seller) products
    return [...baseList]
      .filter((product: any) => product?.best_seller !== true)
      .sort((a: any, b: any) => getTime(b) - getTime(a))
      .slice(0, 10);
  }, [products, searchTerm, selectedCategoryId, selectedSizeId]);

  // handlers
  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setShowDetailsView(true);
  };

  const closeDetailsView = () => {
    setShowDetailsView(false);
    setSelectedProduct(null);
  };

  const handleEdit = (product: any) => {
    router.push(`/products/${product.id}`);
  };

  const handleAdd = () => {
    router.push("/products/new");
  };

  const handleNavigateToCategory = () => {
    router.push("/products/category");
  };

  const handleNavigateToSize = () => {
    router.push("/products/size");
  };

  const handleNavigateToSupplier = () => {
    router.push("/products/supplier");
  };

  const handleNavigateAllProducts = () => {
    router.push("/products/all-products");
  };

  const handleDelete = (product: any) => {
    Alert.alert(
      "Konfirmasi Hapus",
      `Apakah Anda yakin ingin menghapus produk "${product.name}"?`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteProduct(product.id);
              Toast.show({ type: "success", text1: "Produk berhasil dihapus" });
            } catch {
              Toast.show({ type: "error", text1: "Gagal menghapus produk" });
            }
          },
        },
      ]
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refreshData(),
        refreshCategories(),
        refreshSizes(),
        refreshSuppliers(),
      ]);
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
    // data
    products,
    categories,
    sizes,
    suppliers,
    loading,
    formatIDR,
    formatDateTime,

    // actions
    deleteProduct,
    refreshData,
    onRefresh,
    refreshCategories,
    refreshSizes,
    refreshSuppliers,
    handleEdit,
    handleAdd,
    handleNavigateToCategory,
    handleNavigateToSize,
    handleNavigateToSupplier,
    handleDelete,
    handleNavigateAllProducts,

    // view state
    searchTerm,
    setSearchTerm,
    filteredProducts,
    bestSellerProducts,
    regularProducts,
    showDetailsView,
    selectedProduct,
    refreshing,
    handleViewDetails,
    closeDetailsView,

    // filter state
    showFilterSheet,
    selectedCategoryId,
    selectedSizeId,
    handleOpenFilter,
    handleCloseFilter,
    handleApplyFilter,
    handleResetFilter,
  };
}
