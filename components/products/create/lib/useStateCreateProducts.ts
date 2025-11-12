import { useRef, useState, useEffect, useMemo } from "react";

import { TextInput, Alert } from "react-native";

import Toast from "react-native-toast-message";

import * as ImagePicker from "expo-image-picker";

import { useRouter, useLocalSearchParams } from "expo-router";

import { useProducts } from "@/hooks/useProducts";

import { useCategories } from "@/hooks/useCategories";

import { useSizes } from "@/hooks/useSizes";

import { useSuppliers } from "@/hooks/useSuppliers";

export function useStateCreateProducts(props?: UseStateCreateProductsProps) {
  const localParams = useLocalSearchParams();
  const router = useRouter();

  // Gunakan id dari props atau dari useLocalSearchParams
  const id = props?.id || localParams.id;
  const isEdit = Array.isArray(id) ? id[0] !== "new" : id !== "new";
  const productId = Array.isArray(id) ? id[0] : id;

  // State untuk mengontrol visibility bottom sheet
  const [showBarcodeActionSheet, setShowBarcodeActionSheet] = useState(false);
  const [showUnitSheet, setShowUnitSheet] = useState(false);
  const [showCategorySheet, setShowCategorySheet] = useState(false);
  const [showSizeSheet, setShowSizeSheet] = useState(false);
  const [showSupplierSheet, setShowSupplierSheet] = useState(false);

  // Hooks untuk data
  const {
    products,
    createProduct: createProductFromHook,
    updateProduct: updateProductFromHook,
  } = useProducts();
  const { categories: categoriesFromHook } = useCategories();
  const { sizes: sizesFromHook } = useSizes();
  const { suppliers: suppliersFromHook } = useSuppliers();

  // Gunakan dari props jika diberikan, atau dari hooks
  const createProduct = props?.createProduct || createProductFromHook;
  const updateProduct = props?.updateProduct || updateProductFromHook;

  // Wrap dalam useMemo untuk menghindari re-render yang tidak perlu
  const categories = useMemo(
    () => props?.categories || categoriesFromHook || [],
    [props?.categories, categoriesFromHook]
  );
  const sizes = useMemo(
    () => props?.sizes || sizesFromHook || [],
    [props?.sizes, sizesFromHook]
  );
  const suppliers = useMemo(
    () => props?.suppliers || suppliersFromHook || [],
    [props?.suppliers, suppliersFromHook]
  );

  // Find product if editing
  const product = useMemo(() => {
    if (props?.product) return props.product;
    if (isEdit && products.length > 0 && productId) {
      return products.find((p: any) => p.id === parseInt(productId as string));
    }
    return undefined;
  }, [isEdit, productId, products, props?.product]);
  const [showScanner, setShowScanner] = useState(false);
  const [barcodeAction, setBarcodeAction] = useState<string>("generate");
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    price: "",
    modal: "",
    stock: "",
    unit: "",
    barcode: "",
    category_id: "",
    size_id: "",
    supplier_id: "",
    description: "",
    min_stock: "",
    discount: "",
    image_url: "",
    best_seller: false,
  });

  const nameRef = useRef<TextInput>(null);
  const priceRef = useRef<TextInput>(null);
  const modalRef = useRef<TextInput>(null);
  const stockRef = useRef<TextInput>(null);
  const barcodeRef = useRef<TextInput>(null);
  const descriptionRef = useRef<TextInput>(null);
  const minStockRef = useRef<TextInput>(null);
  const discountRef = useRef<TextInput>(null);

  const formatIdrNumber = (raw: string) => {
    if (!raw) return "";
    const digitsOnly = raw.replace(/[^0-9]/g, "");
    if (!digitsOnly) return "";
    return new Intl.NumberFormat("id-ID").format(Number(digitsOnly));
  };

  const unformatIdrNumber = (formatted: string) => {
    if (!formatted) return "";
    return formatted.replace(/\./g, "");
  };

  useEffect(() => {
    if (isEdit && product) {
      const priceValue = formatIdrNumber(product.price?.toString() || "");
      const modalValue = formatIdrNumber(product.modal?.toString() || "");

      setFormData({
        name: product.name || "",
        price: priceValue,
        modal: modalValue,
        stock: formatIdrNumber(product.stock?.toString() || ""),
        unit: product.unit || "",
        barcode: product.barcode ? String(product.barcode).trim() : "",
        category_id: product.category_id?.toString() || "",
        size_id: product.size_id?.toString() || "",
        supplier_id: product.supplier_id?.toString() || "",
        description: product.description || "",
        min_stock: product.min_stock?.toString() || "",
        discount: product.discount?.toString() || "",
        image_url: product.image_url || "",
        best_seller: Boolean(product.best_seller),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, product?.id]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === "barcode" ? value : value,
    }));
  };

  const handlePriceChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      price: formatIdrNumber(value),
    }));
  };

  const handleModalChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      modal: formatIdrNumber(value),
    }));
  };

  const handleBarcodeScan = (barcode: string) => {
    setFormData((prev) => ({
      ...prev,
      barcode: barcode ? String(barcode).trim() : "",
    }));
    setShowScanner(false);
  };

  const isDecimalUnit = (unit: string) =>
    ["kg", "liter", "meter"].includes(unit);

  const sanitizeDecimalInput = (value: string, maxDecimals: number = 3) => {
    let sanitized = value.replace(/[^0-9.,]/g, "").replace(",", ".");
    const parts = sanitized.split(".");
    if (parts.length > 2) {
      sanitized = parts[0] + "." + parts.slice(1).join("");
    }
    const [intPart, decPart] = sanitized.split(".");
    if (decPart !== undefined) {
      return intPart + "." + decPart.slice(0, maxDecimals);
    }
    return intPart;
  };

  const handleStockChange = (value: string) => {
    if (isDecimalUnit(formData.unit)) {
      const cleaned = sanitizeDecimalInput(value);
      const newStockNumber = parseFloat(cleaned || "0");
      const currentMinStockNumber = parseFloat(
        (formData.min_stock || "0").replace(",", ".")
      );

      if (
        !Number.isNaN(currentMinStockNumber) &&
        currentMinStockNumber > newStockNumber
      ) {
        Toast.show({
          type: "error",
          text1: "Stok minimum tidak boleh melebihi stok aktual",
        });
        setFormData((prev) => ({
          ...prev,
          stock: cleaned,
          min_stock: String(newStockNumber),
        }));
        return;
      }

      setFormData((prev) => ({
        ...prev,
        stock: cleaned,
      }));
      return;
    }

    const formattedStock = formatIdrNumber(value);
    const newStockNumber = parseInt(
      unformatIdrNumber(formattedStock) || "0",
      10
    );
    const currentMinStockNumber = parseInt(formData.min_stock || "0", 10);

    if (
      !Number.isNaN(currentMinStockNumber) &&
      currentMinStockNumber > newStockNumber
    ) {
      Toast.show({
        type: "error",
        text1: "Stok minimum tidak boleh melebihi stok aktual",
      });
      setFormData((prev) => ({
        ...prev,
        stock: formattedStock,
        min_stock: String(newStockNumber),
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      stock: formattedStock,
    }));
  };

  const handleMinStockChange = (value: string) => {
    if (isDecimalUnit(formData.unit)) {
      const cleaned = sanitizeDecimalInput(value);
      const inputMin = parseFloat(cleaned || "0");
      const stockNumber = parseFloat(
        (formData.stock
          ? isDecimalUnit(formData.unit)
            ? formData.stock
            : unformatIdrNumber(formData.stock)
          : "0"
        )
          .toString()
          .replace(",", ".")
      );

      if (inputMin > stockNumber) {
        Toast.show({
          type: "error",
          text1: "Stok minimum tidak boleh melebihi stok aktual",
        });
        setFormData((prev) => ({
          ...prev,
          min_stock: String(stockNumber),
        }));
        return;
      }

      setFormData((prev) => ({
        ...prev,
        min_stock: cleaned,
      }));
      return;
    }

    const digitsOnly = value.replace(/[^0-9]/g, "");
    const inputMin = parseInt(digitsOnly || "0", 10);
    const stockNumber = parseInt(unformatIdrNumber(formData.stock) || "0", 10);

    if (inputMin > stockNumber) {
      Toast.show({
        type: "error",
        text1: "Stok minimum tidak boleh melebihi stok aktual",
      });
      setFormData((prev) => ({
        ...prev,
        min_stock: String(stockNumber),
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      min_stock: digitsOnly,
    }));
  };

  const computeEANChecksum = (digits: string) => {
    const nums = digits.split("").map((d) => parseInt(d, 10));
    const len = nums.length;
    let sum = 0;

    if (len === 12) {
      for (let i = 0; i < 12; i++) {
        const value = nums[11 - i];
        sum += i % 2 === 0 ? value * 3 : value;
      }
    } else if (len === 7) {
      for (let i = 0; i < 7; i++) {
        const value = nums[6 - i];
        sum += i % 2 === 0 ? value * 3 : value;
      }
    } else if (len === 11) {
      for (let i = 0; i < 11; i++) {
        const value = nums[10 - i];
        sum += i % 2 === 0 ? value * 3 : value;
      }
    }

    const mod = sum % 10;
    return (10 - mod) % 10;
  };

  const normalizeBarcode = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return "";

    const numeric = trimmed.replace(/\s+/g, "");
    if (!/^\d+$/.test(numeric)) {
      return trimmed;
    }

    if (numeric.length === 13) {
      const body = numeric.slice(0, 12);
      const checksum = computeEANChecksum(body);
      return body + checksum.toString();
    }

    if (numeric.length === 12) {
      const body = numeric.slice(0, 11);
      const checksum = computeEANChecksum(body);
      return body + checksum.toString();
    }

    if (numeric.length === 8) {
      const body = numeric.slice(0, 7);
      const checksum = computeEANChecksum(body);
      return body + checksum.toString();
    }

    if (numeric.length === 11) {
      const checksum = computeEANChecksum(numeric);
      return numeric + checksum.toString();
    }

    if (numeric.length === 7) {
      const checksum = computeEANChecksum(numeric);
      return numeric + checksum.toString();
    }

    return trimmed;
  };

  const generateEAN13 = () => {
    let base = "";
    for (let i = 0; i < 12; i++) {
      base += Math.floor(Math.random() * 10).toString();
    }

    const digits = base.split("").map((d) => parseInt(d, 10));
    let sum = 0;
    for (let i = 0; i < digits.length; i++) {
      const positionFromRight = digits.length - i;
      const weight = positionFromRight % 2 === 0 ? 3 : 1;
      sum += digits[i] * weight;
    }
    const checksum = (10 - (sum % 10)) % 10;
    return base + checksum.toString();
  };

  const handleBarcodeGenerate = () => {
    const code = generateEAN13();
    setFormData((prev) => ({ ...prev, barcode: code }));
  };

  useEffect(() => {
    if (barcodeAction === "generate" && !isEdit && !formData.barcode) {
      const code = generateEAN13();
      setFormData((prev) => ({ ...prev, barcode: code }));
    }
  }, [barcodeAction, isEdit, formData.barcode]);

  const pickFromGallery = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Toast.show({
          type: "error",
          text1: "Izin galeri diperlukan untuk memilih gambar",
        });
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setFormData((prev) => ({ ...prev, image_url: uri }));
      }
    } catch {
      Toast.show({ type: "error", text1: "Gagal memilih gambar" });
    }
  };

  const captureWithCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Toast.show({
          type: "error",
          text1: "Izin kamera diperlukan untuk mengambil foto",
        });
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setFormData((prev) => ({ ...prev, image_url: uri }));
      }
    } catch {
      Toast.show({ type: "error", text1: "Gagal mengambil foto" });
    }
  };

  const handlePickImage = () => {
    Alert.alert(
      "Pilih Sumber Gambar",
      "Silakan pilih dari galeri atau gunakan kamera",
      [
        { text: "Batal", style: "cancel" },
        { text: "Galeri", onPress: pickFromGallery },
        { text: "Kamera", onPress: captureWithCamera },
      ]
    );
  };

  const handleCategorySelect = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category_id: value,
    }));
  };

  const handleSizeSelect = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      size_id: value,
    }));
  };

  const handleSupplierSelect = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      supplier_id: value,
    }));
  };

  const handleUnitSelect = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      unit: value,
    }));
  };

  const stepForUnit = (unit: string) => (isDecimalUnit(unit) ? 0.1 : 1);

  const parseStockNumber = (raw: string, unit: string) => {
    return isDecimalUnit(unit)
      ? parseFloat((raw || "0").toString().replace(",", "."))
      : parseInt(unformatIdrNumber(raw) || "0", 10);
  };

  const formatStockString = (num: number, unit: string) => {
    if (isDecimalUnit(unit)) {
      const fixed = Number(num.toFixed(3));
      return String(fixed);
    }
    return formatIdrNumber(String(Math.floor(num)));
  };

  const incrementStock = (target: "stock" | "min_stock") => {
    const unit = formData.unit || "pcs";
    const step = stepForUnit(unit);
    const current = target === "stock" ? formData.stock : formData.min_stock;
    const currentNum = parseStockNumber(current, unit);
    const nextNum = currentNum + step;
    const nextStr = formatStockString(nextNum, unit);
    if (target === "stock") {
      handleStockChange(nextStr);
    } else {
      handleMinStockChange(nextStr);
    }
  };

  const decrementStock = (target: "stock" | "min_stock") => {
    const unit = formData.unit || "pcs";
    const step = stepForUnit(unit);
    const current = target === "stock" ? formData.stock : formData.min_stock;
    const currentNum = parseStockNumber(current, unit);
    const nextNum = Math.max(0, currentNum - step);
    const nextStr = formatStockString(nextNum, unit);
    if (target === "stock") {
      handleStockChange(nextStr);
    } else {
      handleMinStockChange(nextStr);
    }
  };

  const incrementDiscount = () => {
    const current = parseFloat(formData.discount) || 0;
    const next = Math.min(100, current + 1);
    setFormData((prev) => ({
      ...prev,
      discount: next.toString(),
    }));
  };

  const decrementDiscount = () => {
    const current = parseFloat(formData.discount) || 0;
    const next = Math.max(0, current - 1);
    setFormData((prev) => ({
      ...prev,
      discount: next.toString(),
    }));
  };

  const handleDiscountChange = (text: string) => {
    // Allow only numbers and one decimal point
    const cleaned = text.replace(/[^0-9.]/g, "");
    // Prevent multiple decimal points
    const parts = cleaned.split(".");
    const sanitized =
      parts.length > 2 ? parts[0] + "." + parts.slice(1).join("") : cleaned;
    // Limit to 100
    const numValue = parseFloat(sanitized) || 0;
    if (numValue > 100) {
      setFormData((prev) => ({ ...prev, discount: "100" }));
    } else {
      setFormData((prev) => ({ ...prev, discount: sanitized }));
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Toast.show({ type: "error", text1: "Nama produk harus diisi" });
      return false;
    }
    if (!formData.price || parseFloat(unformatIdrNumber(formData.price)) <= 0) {
      Toast.show({
        type: "error",
        text1: "Harga harus diisi dan lebih dari 0",
      });
      return false;
    }
    const stockNumber = isDecimalUnit(formData.unit)
      ? parseFloat((formData.stock || "0").toString().replace(",", "."))
      : parseInt(unformatIdrNumber(formData.stock) || "0", 10);
    if (!formData.stock || Number.isNaN(stockNumber) || stockNumber < 0) {
      Toast.show({
        type: "error",
        text1: "Stok harus diisi dan tidak boleh negatif",
      });
      return false;
    }
    const minStockNumber = isDecimalUnit(formData.unit)
      ? parseFloat((formData.min_stock || "0").toString().replace(",", "."))
      : parseInt(formData.min_stock || "0", 10);
    if (minStockNumber < 0) {
      Toast.show({ type: "error", text1: "Stok minimum tidak boleh negatif" });
      return false;
    }
    if (minStockNumber > stockNumber) {
      Toast.show({
        type: "error",
        text1: "Stok minimum tidak boleh melebihi stok aktual",
      });
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    if (!createProduct || !updateProduct) {
      Toast.show({
        type: "error",
        text1: "Create/Update function tidak tersedia",
      });
      return;
    }

    try {
      const hasBarcodeInput = Boolean(
        formData.barcode && String(formData.barcode).trim().length > 0
      );

      const resolvedBarcode = hasBarcodeInput
        ? normalizeBarcode(String(formData.barcode))
        : generateEAN13();

      if (
        hasBarcodeInput &&
        resolvedBarcode &&
        resolvedBarcode !== String(formData.barcode).trim()
      ) {
        setFormData((prev) => ({
          ...prev,
          barcode: resolvedBarcode,
        }));
      }

      const productData = {
        uid: `PROD${Date.now()}`,
        name: formData.name,
        price: parseFloat(unformatIdrNumber(formData.price)),
        modal: parseFloat(unformatIdrNumber(formData.modal)) || 0,
        stock: isDecimalUnit(formData.unit)
          ? parseFloat((formData.stock || "0").toString().replace(",", "."))
          : parseInt(unformatIdrNumber(formData.stock)),
        sold: 0,
        unit: formData.unit || "pcs",
        image_url: formData.image_url || "",
        barcode: resolvedBarcode,
        is_active: true,
        category_id:
          formData.category_id && formData.category_id !== ""
            ? parseInt(formData.category_id)
            : undefined,
        size_id:
          formData.size_id && formData.size_id !== ""
            ? parseInt(formData.size_id)
            : undefined,
        supplier_id:
          formData.supplier_id && formData.supplier_id !== ""
            ? parseInt(formData.supplier_id)
            : undefined,
        description: formData.description,
        min_stock: isDecimalUnit(formData.unit)
          ? parseFloat(
              (formData.min_stock || "0").toString().replace(",", ".")
            ) || 0
          : parseInt(formData.min_stock) || 0,
        discount: parseFloat(formData.discount) || 0,
        best_seller: formData.best_seller,
        expiration_date: "",
        created_by: "admins",
      };

      if (isEdit && productId) {
        await updateProduct(parseInt(productId as string), productData);
        Toast.show({ type: "success", text1: "Produk berhasil diperbarui" });
      } else {
        await createProduct(productData);
        Toast.show({ type: "success", text1: "Produk berhasil ditambahkan" });
      }

      router.back();
    } catch (error) {
      Toast.show({ type: "error", text1: "Gagal menyimpan produk" });
      console.error("Error saving product:", error);
    }
  };

  // Format options for Select component
  const categoryOptions = useMemo(
    () =>
      categories?.map((cat: any) => ({
        label: cat.name,
        value: cat.id,
      })) || [],
    [categories]
  );

  const sizeOptions = useMemo(
    () =>
      sizes?.map((size: any) => ({
        label: size.name,
        value: size.id,
      })) || [],
    [sizes]
  );

  const supplierOptions = useMemo(
    () =>
      suppliers?.map((supplier: any) => ({
        label: supplier.name,
        value: supplier.id,
      })) || [],
    [suppliers]
  );

  const unitOptions = useMemo(
    () => [
      { label: "Pcs (Satuan)", value: "pcs" },
      { label: "Kg (Kilogram)", value: "kg" },
      { label: "Liter", value: "liter" },
      { label: "Meter", value: "meter" },
      { label: "Box (Kotak)", value: "box" },
      { label: "Pack (Paket)", value: "pack" },
      { label: "Botol", value: "botol" },
      { label: "Gram", value: "gram" },
      { label: "Dus", value: "dus" },
      { label: "Roll", value: "roll" },
    ],
    []
  );

  return {
    router,
    isEdit,

    // State
    showScanner,
    setShowScanner,
    barcodeAction,
    setBarcodeAction,
    formData,
    setFormData,

    // Refs
    nameRef,
    priceRef,
    modalRef,
    stockRef,
    barcodeRef,
    descriptionRef,
    minStockRef,
    discountRef,

    // Utility functions
    formatIdrNumber,
    unformatIdrNumber,
    isDecimalUnit,
    sanitizeDecimalInput,

    // Handlers
    handleInputChange,
    handlePriceChange,
    handleModalChange,
    handleBarcodeScan,
    handleBarcodeGenerate,
    handleStockChange,
    handleMinStockChange,
    handleCategorySelect,
    handleSizeSelect,
    handleSupplierSelect,
    handleUnitSelect,
    handlePickImage,
    pickFromGallery,
    captureWithCamera,

    // Stock operations
    incrementStock,
    decrementStock,
    incrementDiscount,
    decrementDiscount,

    // Discount handler
    handleDiscountChange,

    // Validation & Save
    validateForm,
    handleSave,

    // Utility
    parseStockNumber,
    formatStockString,
    stepForUnit,

    // Options for Select components
    categoryOptions,
    sizeOptions,
    supplierOptions,
    unitOptions,

    // Bottom Sheet states
    showBarcodeActionSheet,
    setShowBarcodeActionSheet,
    showUnitSheet,
    setShowUnitSheet,
    showCategorySheet,
    setShowCategorySheet,
    showSizeSheet,
    setShowSizeSheet,
    showSupplierSheet,
    setShowSupplierSheet,
  };
}
