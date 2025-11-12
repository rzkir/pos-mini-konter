import { useState, useCallback, useEffect, useMemo } from "react";

import { TransactionService } from "@/services/transactionService";

import { ProductService } from "@/services/productService";

import { PaymentCardService } from "@/services/paymentCard";

import { TransactionNotificationService } from "@/services/transactionNotificationService";

import AsyncStorage from "@react-native-async-storage/async-storage";

import Toast from "react-native-toast-message";

import { Alert, BackHandler } from "react-native";

export function useStateCreateTransaction({
  transactionId,
  products,
  formatIDR,
  router,
}: UseStateCreateTransactionProps) {
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [items, setItems] = useState<TransactionItem[]>([]);
  const [productsWithDetails, setProductsWithDetails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [customerName, setCustomerName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<
    "cash" | "card" | "transfer"
  >("cash");
  const [amountPaid, setAmountPaid] = useState("");
  const [paymentCards, setPaymentCards] = useState<PaymentCard[]>([]);
  const [selectedPaymentCardId, setSelectedPaymentCardId] = useState<
    number | null
  >(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentInfoFilled, setPaymentInfoFilled] = useState(false);
  const [showProductsSheet, setShowProductsSheet] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<
    Record<number, number>
  >({});
  const [showScanner, setShowScanner] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [selectedSizeId, setSelectedSizeId] = useState<number | null>(null);
  const [paymentValidationError, setPaymentValidationError] = useState<
    string | null
  >(null);
  // Customer search state
  const [customerSearchQuery, setCustomerSearchQuery] = useState("");
  const [allCustomerNames, setAllCustomerNames] = useState<string[]>([]);
  const [isCustomerSelected, setIsCustomerSelected] = useState(false);

  // Helper functions for amount formatting
  const formatIdrNumber = useCallback((raw: string) => {
    if (!raw) return "";
    const digitsOnly = raw.replace(/[^0-9]/g, "");
    if (!digitsOnly) return "";
    return new Intl.NumberFormat("id-ID").format(Number(digitsOnly));
  }, []);

  const unformatIdrNumber = (formatted: string) => {
    if (!formatted) return "";
    return formatted.replace(/\./g, "");
  };

  const getAmountPaidValue = useCallback(() => {
    if (!amountPaid || !transaction) return 0;
    return parseFloat(unformatIdrNumber(amountPaid)) || 0;
  }, [amountPaid, transaction]);

  const calculateChange = () => {
    if (!amountPaid || !transaction) return 0;
    const paid = parseFloat(unformatIdrNumber(amountPaid)) || 0;
    const change = paid - transaction.total;
    return change > 0 ? change : 0;
  };

  const getSuggestedAmounts = (): number[] => {
    if (!transaction) return [];
    const total = transaction.total;
    const suggestions: number[] = [total]; // Always include exact total

    // Round up to nearest intervals based on total amount
    if (total < 10000) {
      // For small amounts, round to nearest 5k
      const rounded5k = Math.ceil(total / 5000) * 5000;
      if (rounded5k !== total) suggestions.push(rounded5k);

      // Also suggest 10k if it's close
      if (total > 7000) suggestions.push(10000);
    } else if (total < 50000) {
      // For medium amounts, round to nearest 5k or 10k
      const rounded5k = Math.ceil(total / 5000) * 5000;
      const rounded10k = Math.ceil(total / 10000) * 10000;
      if (rounded5k !== total) suggestions.push(rounded5k);
      if (rounded10k !== total && rounded10k !== rounded5k)
        suggestions.push(rounded10k);
    } else if (total < 100000) {
      // For larger amounts, round to nearest 10k or 25k
      const rounded10k = Math.ceil(total / 10000) * 10000;
      const rounded25k = Math.ceil(total / 25000) * 25000;
      if (rounded10k !== total) suggestions.push(rounded10k);
      if (rounded25k !== total && rounded25k !== rounded10k)
        suggestions.push(rounded25k);
    } else if (total < 500000) {
      // For very large amounts, round to nearest 25k, 50k, or 100k
      const rounded25k = Math.ceil(total / 25000) * 25000;
      const rounded50k = Math.ceil(total / 50000) * 50000;
      const rounded100k = Math.ceil(total / 100000) * 100000;
      if (rounded25k !== total) suggestions.push(rounded25k);
      if (rounded50k !== total && rounded50k !== rounded25k)
        suggestions.push(rounded50k);
      if (rounded100k !== total && rounded100k !== rounded50k)
        suggestions.push(rounded100k);
    } else {
      // For huge amounts, round to nearest 100k or 250k
      const rounded100k = Math.ceil(total / 100000) * 100000;
      const rounded250k = Math.ceil(total / 250000) * 250000;
      if (rounded100k !== total) suggestions.push(rounded100k);
      if (rounded250k !== total && rounded250k !== rounded100k)
        suggestions.push(rounded250k);
    }

    // Remove duplicates and sort, limit to 4 suggestions
    const unique = Array.from(new Set(suggestions)).sort((a, b) => a - b);
    return unique.slice(0, 4);
  };

  const isAmountInsufficient = () => {
    if (paymentMethod !== "cash" || selectedPaymentCardId !== null)
      return false;
    if (!amountPaid) return false;
    const paid = getAmountPaidValue();
    return paid > 0 && paid < (transaction?.total || 0);
  };

  const getPaymentMethodLabel = (method: PaymentMethodOption): string => {
    const labels: Record<PaymentMethodOption, string> = {
      gopay: "GoPay",
      ovo: "OVO",
      dana: "DANA",
      shopeepay: "ShopeePay",
      linkaja: "LinkAja",
      qris: "QRIS",
      debit_card: "Kartu Debit",
      credit_card: "Kartu Kredit",
      bank_transfer: "Transfer Bank",
    };
    return labels[method] || method;
  };

  const loadTransaction = useCallback(
    async (options?: { showLoading?: boolean }) => {
      const shouldShowLoading = options?.showLoading === true;
      try {
        if (shouldShowLoading) setLoading(true);
        const trans = await TransactionService.getById(transactionId);
        if (trans) {
          setTransaction(trans);
          setCustomerName(trans.customer_name || "");
          setIsCustomerSelected(Boolean(trans.customer_name));
          setPaymentMethod(trans.payment_method);
          setAmountPaid("");
          // Set selected payment card jika ada payment_card_id
          if (trans.payment_card_id) {
            setSelectedPaymentCardId(trans.payment_card_id);
          } else {
            setSelectedPaymentCardId(null);
          }

          const transactionItems =
            await TransactionService.getItemsByTransactionId(transactionId);
          setItems(transactionItems);

          // Load product details for each item
          const itemsWithProducts = transactionItems.map((item) => {
            const product = products.find((p: any) => p.id === item.product_id);
            // Ensure discount is properly set - use product discount if available, otherwise use item discount
            const itemWithProduct = {
              ...item,
              product,
              // Ensure discount field is properly set from product or item
              discount: Number(product?.discount ?? item.discount ?? 0) || 0,
            };
            return itemWithProduct;
          });
          setProductsWithDetails(itemsWithProducts);
        }
      } catch (error) {
        console.error("Error loading transaction:", error);
        Toast.show({
          type: "error",
          text1: "Kesalahan",
          text2: "Gagal memuat data transaksi",
          visibilityTime: 3000,
        });
      } finally {
        if (shouldShowLoading) setLoading(false);
      }
    },
    [transactionId, products]
  );

  const cleanupLocalStorage = useCallback(async () => {
    try {
      await AsyncStorage.removeItem("selected_products");
    } catch (error) {
      console.error("Error cleaning up localStorage:", error);
    }
  }, []);

  const loadPaymentCards = useCallback(async () => {
    try {
      const cards = await PaymentCardService.getAll();
      const activeCards = cards.filter((card) => card.is_active);
      setPaymentCards(activeCards);
    } catch (error) {
      console.error("Error loading payment cards:", error);
    }
  }, []);

  const addProductsToTransaction = useCallback(
    async (productIdToQty: Record<number, number>) => {
      try {
        for (const [productIdStr, qty] of Object.entries(productIdToQty)) {
          const productId = parseInt(productIdStr, 10);
          const product = products.find((p: any) => p.id === productId);

          if (product && qty > 0) {
            // Check if item already exists
            const currentItems =
              await TransactionService.getItemsByTransactionId(transactionId);
            const existingItem = currentItems.find(
              (item) => item.product_id === productId
            );

            // Calculate discount from product
            const basePrice = product.price ?? 0;
            const productDiscount = Number(product.discount ?? 0) || 0;

            if (existingItem) {
              // Update quantity
              const newQty = existingItem.quantity + (qty as number);
              // Store subtotal as original (before discount)
              const subtotal = newQty * basePrice;
              await TransactionService.updateItem(existingItem.id, {
                quantity: newQty,
                discount: productDiscount,
                subtotal,
              });
            } else {
              // Add new item
              // Store subtotal as original (before discount)
              const subtotal = (qty as number) * basePrice;
              await TransactionService.addItem({
                transaction_id: transactionId,
                product_id: productId,
                quantity: qty as number,
                price: basePrice,
                discount: productDiscount,
                subtotal,
              });
            }
          }
        }
        loadTransaction({ showLoading: false });
        // Reset payment info when transaction items change
        setPaymentInfoFilled(false);
      } catch (error) {
        console.error("Error adding products:", error);
        Toast.show({
          type: "error",
          text1: "Kesalahan",
          text2: "Gagal menambahkan produk",
          visibilityTime: 3000,
        });
      }
    },
    [transactionId, products, loadTransaction]
  );

  // Filter products based on search, category, and size
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Filter by search
    if (searchTerm) {
      const query = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (product: any) =>
          product.name?.toLowerCase().includes(query) ||
          product.barcode?.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategoryId !== null) {
      filtered = filtered.filter(
        (product: any) => product?.category_id === selectedCategoryId
      );
    }

    // Filter by size
    if (selectedSizeId !== null) {
      filtered = filtered.filter(
        (product: any) => product?.size_id === selectedSizeId
      );
    }

    return filtered;
  }, [products, searchTerm, selectedCategoryId, selectedSizeId]);

  // Add product quantity
  const addProductQty = useCallback((productId: number) => {
    setSelectedProducts((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  }, []);

  // Subtract product quantity
  const subProductQty = useCallback((productId: number) => {
    setSelectedProducts((prev) => {
      const current = prev[productId] || 0;
      if (current <= 1) {
        const { [productId]: _removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [productId]: current - 1 };
    });
  }, []);

  // Handle barcode scan
  const handleBarcodeScan = useCallback(
    async (barcode: string) => {
      // Find product by barcode
      const product = products.find((p: any) => p.barcode === barcode);

      if (product) {
        try {
          // Create a single product selection with quantity 1
          const productToAdd = { [product.id]: 1 };

          // Directly add product to transaction
          await addProductsToTransaction(productToAdd);

          Toast.show({
            type: "success",
            text1: "Berhasil",
            text2: `${product.name} ditambahkan ke transaksi`,
            visibilityTime: 2000,
          });
        } catch (error) {
          console.error("Error adding product:", error);
          Toast.show({
            type: "error",
            text1: "Kesalahan",
            text2: "Gagal menambahkan produk ke transaksi",
            visibilityTime: 3000,
          });
        }
      } else {
        Toast.show({
          type: "error",
          text1: "Produk Tidak Ditemukan",
          text2: `Barcode ${barcode} tidak ditemukan`,
          visibilityTime: 3000,
        });
      }
    },
    [products, addProductsToTransaction]
  );

  // Add selected products to transaction
  const handleAddProducts = useCallback(async () => {
    const selectedCount = Object.keys(selectedProducts).length;
    if (selectedCount === 0) {
      Toast.show({
        type: "info",
        text1: "Pilih Produk",
        text2: "Silakan pilih produk terlebih dahulu",
        visibilityTime: 2000,
      });
      return;
    }

    try {
      await addProductsToTransaction(selectedProducts);
      setSelectedProducts({});
      setShowProductsSheet(false);
      setSearchTerm("");
      setSelectedCategoryId(null);
      setSelectedSizeId(null);
      Toast.show({
        type: "success",
        text1: "Berhasil",
        text2: "Produk berhasil ditambahkan",
        visibilityTime: 2000,
      });
    } catch (error) {
      console.error("Error adding products:", error);
      Toast.show({
        type: "error",
        text1: "Kesalahan",
        text2: "Gagal menambahkan produk",
        visibilityTime: 3000,
      });
    }
  }, [selectedProducts, addProductsToTransaction]);

  const handleResetFilters = useCallback(() => {
    setSelectedCategoryId(null);
    setSelectedSizeId(null);
  }, []);

  const handleApplyFilters = useCallback(
    (categoryId: number | null, sizeId: number | null) => {
      setSelectedCategoryId(categoryId);
      setSelectedSizeId(sizeId);
    },
    []
  );

  const deleteItem = useCallback(
    async (itemId: number) => {
      try {
        await TransactionService.deleteItem(itemId);
        loadTransaction({ showLoading: false });
        // Reset payment info when transaction items change
        setPaymentInfoFilled(false);
      } catch (error) {
        console.error("Error deleting item:", error);
        Toast.show({
          type: "error",
          text1: "Kesalahan",
          text2: "Gagal menghapus item",
          visibilityTime: 3000,
        });
      }
    },
    [loadTransaction]
  );

  const updateItemQty = useCallback(
    async (itemId: number, newQty: number) => {
      if (newQty <= 0) {
        await deleteItem(itemId);
        return;
      }

      try {
        const item = items.find((i) => i.id === itemId);
        if (item) {
          const product = products.find((p: any) => p.id === item.product_id);
          const basePrice = item.price;
          // Use discount from product if available, otherwise use item discount
          const productDiscount =
            Number(product?.discount ?? item.discount ?? 0) || 0;
          // Subtotal should reflect original price (before discount)
          const newSubtotal = newQty * basePrice;

          await TransactionService.updateItem(itemId, {
            quantity: newQty,
            discount: productDiscount,
            subtotal: newSubtotal,
          });
          loadTransaction({ showLoading: false });
          // Reset payment info when transaction items change
          setPaymentInfoFilled(false);
        }
      } catch (error) {
        console.error("Error updating item:", error);
        Toast.show({
          type: "error",
          text1: "Kesalahan",
          text2: "Gagal memperbarui item",
          visibilityTime: 3000,
        });
      }
    },
    [items, products, loadTransaction, deleteItem]
  );

  const saveCustomerInfo = useCallback(async () => {
    if (!transaction) return;

    const normalizedName = (customerName || "").trim();

    // Skip update if nothing changed
    if ((transaction.customer_name || "") === normalizedName) {
      return;
    }

    try {
      await TransactionService.update(transactionId, {
        customer_name: normalizedName || undefined,
      });
      // Persist to local storage only for this transaction (no new master customer data created)
      try {
        await AsyncStorage.setItem(
          "consumer_info",
          JSON.stringify({
            transaction_id: transactionId,
            customer_name: normalizedName || undefined,
          })
        );
      } catch (storageError) {
        console.error(
          "Error saving consumer_info to AsyncStorage:",
          storageError
        );
      }
      loadTransaction({ showLoading: false });
      Toast.show({
        type: "success",
        text1: "Sukses",
        text2: "Data pelanggan berhasil disimpan",
        visibilityTime: 3000,
      });
    } catch (error) {
      console.error("Error saving customer info:", error);
      Toast.show({
        type: "error",
        text1: "Kesalahan",
        text2: "Gagal menyimpan data pelanggan",
        visibilityTime: 3000,
      });
    }
  }, [transaction, transactionId, customerName, loadTransaction]);

  const handlePaymentCardSelect = useCallback(
    (cardId: number | null) => {
      setSelectedPaymentCardId(cardId);
      setPaymentValidationError(null);
      if (cardId) {
        const selectedCard = paymentCards.find((card) => card.id === cardId);
        if (selectedCard) {
          if (
            selectedCard.method === "debit_card" ||
            selectedCard.method === "credit_card"
          ) {
            setPaymentMethod("card");
          } else if (selectedCard.method === "bank_transfer") {
            setPaymentMethod("transfer");
          } else {
            setPaymentMethod("transfer");
          }
        }
      }
    },
    [paymentCards]
  );

  const handlePaymentMethodChange = useCallback(
    (method: "cash" | "card" | "transfer") => {
      setPaymentMethod(method);
      setPaymentValidationError(null);
    },
    []
  );

  const processPayment = useCallback(async () => {
    if (!transaction) return;

    try {
      // Map payment card method to transaction payment method
      let mappedMethod: "cash" | "card" | "transfer" = "cash";
      if (selectedPaymentCardId) {
        const selectedCard = paymentCards.find(
          (card) => card.id === selectedPaymentCardId
        );
        if (selectedCard) {
          // Map PaymentMethodOption to transaction payment_method
          if (
            selectedCard.method === "debit_card" ||
            selectedCard.method === "credit_card"
          ) {
            mappedMethod = "card";
          } else if (selectedCard.method === "bank_transfer") {
            mappedMethod = "transfer";
          } else {
            // For e-wallet methods (gopay, ovo, dana, etc.), use 'transfer'
            mappedMethod = "transfer";
          }
        }
      } else {
        mappedMethod = paymentMethod;
      }

      const updatedTransaction = await TransactionService.update(
        transactionId,
        {
          payment_method: mappedMethod,
          payment_card_id: selectedPaymentCardId || undefined,
          payment_status: "paid",
          status: "completed",
        }
      );

      if (!updatedTransaction) {
        throw new Error("Failed to update transaction");
      }

      const transactionItems = await TransactionService.getItemsByTransactionId(
        transactionId
      );
      for (const item of transactionItems) {
        try {
          await ProductService.updateSold(item.product_id, item.quantity);
        } catch (error) {
          console.error(`Error updating product ${item.product_id}:`, error);
        }
      }

      // Send transaction success notification
      await TransactionNotificationService.sendTransactionSuccessNotification({
        id: updatedTransaction.id,
        transaction_number: updatedTransaction.transaction_number,
        total: updatedTransaction.total,
        payment_method: updatedTransaction.payment_method,
        customer_name: updatedTransaction.customer_name,
      });

      await TransactionService.clearActiveTransaction();

      // Navigate to success page
      router.push({
        pathname: "/transaction/success/[transactionId]",
        params: { transactionId: transactionId.toString() },
      });
    } catch (error) {
      console.error("Error processing payment:", error);
      Toast.show({
        type: "error",
        text1: "Kesalahan",
        text2: "Gagal memproses pembayaran",
        visibilityTime: 3000,
      });
    }
  }, [
    transaction,
    transactionId,
    selectedPaymentCardId,
    paymentCards,
    paymentMethod,
    router,
  ]);

  const savePaymentInfo = useCallback(() => {
    if (!transaction) return;

    // Validate amount paid for cash payments
    if (paymentMethod === "cash" && selectedPaymentCardId === null) {
      const paid = getAmountPaidValue();
      // Block when amount is empty or zero (show inline in BottomSheet)
      if (!amountPaid || paid <= 0) {
        setPaymentValidationError("Input jumlah bayar belum diisi");
        return;
      }
      if (paid > 0 && paid < transaction.total) {
        const shortage = transaction.total - paid;
        setPaymentValidationError(
          `Jumlah yang dibayar ${formatIDR(paid)} kurang dari total ${formatIDR(
            transaction.total
          )}. Kekurangan: ${formatIDR(shortage)}`
        );
        return;
      }
    }

    // Close the BottomSheet modal and mark payment info as filled
    setPaymentValidationError(null);
    setShowPaymentModal(false);
    setPaymentInfoFilled(true);
  }, [
    transaction,
    paymentMethod,
    selectedPaymentCardId,
    amountPaid,
    getAmountPaidValue,
    formatIDR,
  ]);

  const handleAmountPaidChange = useCallback(
    (text: string) => {
      const formatted = formatIdrNumber(text);
      setAmountPaid(formatted);
      if (paymentValidationError) {
        // Clear error when user starts typing a non-empty value
        const digits = formatted.replace(/\./g, "");
        if (digits && parseFloat(digits) > 0) {
          setPaymentValidationError(null);
        }
      }
    },
    [formatIdrNumber, paymentValidationError]
  );

  const handleBayar = useCallback(() => {
    // Reset payment info filled state when opening modal again
    setPaymentInfoFilled(false);
    setShowPaymentModal(true);
  }, []);

  const handleMarkCancelled = useCallback(async () => {
    if (!transaction) return;
    try {
      const updated = await TransactionService.update(transactionId, {
        status: "cancelled",
        payment_status: "cancelled",
      });
      if (!updated) throw new Error("Failed to cancel transaction");
      await TransactionService.clearActiveTransaction();
      Toast.show({
        type: "success",
        text1: "Transaksi Dibatalkan",
        text2: "Status transaksi telah diubah menjadi dibatalkan",
        visibilityTime: 2000,
      });
      router.back();
    } catch (error) {
      console.error("Error cancelling transaction:", error);
      Toast.show({
        type: "error",
        text1: "Kesalahan",
        text2: "Gagal membatalkan transaksi",
        visibilityTime: 3000,
      });
    }
  }, [transaction, transactionId, router]);

  const handleBatal = useCallback(async () => {
    Alert.alert(
      "Konfirmasi",
      "Apakah Anda yakin ingin membatalkan transaksi ini? Transaksi akan dihapus.",
      [
        {
          text: "Tidak",
          style: "cancel",
        },
        {
          text: "Ya, Hapus",
          style: "destructive",
          onPress: async () => {
            try {
              await TransactionService.delete(transactionId);
              await TransactionService.clearActiveTransaction();
              router.back();
            } catch (error) {
              console.error("Error deleting transaction:", error);
              Toast.show({
                type: "error",
                text1: "Kesalahan",
                text2: "Gagal menghapus transaksi",
                visibilityTime: 3000,
              });
            }
          },
        },
      ]
    );
  }, [transactionId, router]);

  const handleSettings = useCallback(() => {
    // Settings menu - could include cancel transaction option
    Alert.alert("Pengaturan", "Pilih aksi", [
      {
        text: "Batal Transaksi",
        style: "destructive",
        onPress: handleBatal,
      },
      {
        text: "Tutup",
        style: "cancel",
      },
    ]);
  }, [handleBatal]);

  const handleBack = useCallback(async () => {
    try {
      if (transaction) {
        await TransactionService.update(transactionId, {
          payment_status: "pending",
        });
      }
    } catch (error) {
      // non-fatal: still navigate back
      console.error("Error setting payment_status to pending on back:", error);
    } finally {
      try {
        await TransactionService.clearActiveTransaction();
      } catch {}
      await cleanupLocalStorage();
      router.back();
    }
  }, [transaction, transactionId, cleanupLocalStorage, router]);

  // Load transaction and payment cards on mount
  useEffect(() => {
    loadTransaction({ showLoading: true });
    loadPaymentCards();

    // Cleanup function: clear localStorage when component unmounts
    return () => {
      cleanupLocalStorage();
    };
  }, [loadTransaction, loadPaymentCards, cleanupLocalStorage]);

  // Load distinct customer names from past transactions for suggestions
  useEffect(() => {
    const loadCustomerNames = async () => {
      try {
        const allTransactions = await TransactionService.getAll();
        const names = allTransactions
          .map((t) => t.customer_name)
          .filter((n): n is string => Boolean(n && typeof n === "string"));
        const unique = Array.from(new Set(names)).sort((a, b) =>
          a.localeCompare(b, "id")
        );
        setAllCustomerNames(unique);
      } catch {
        // non-fatal
      }
    };
    loadCustomerNames();
  }, []);

  // Keep query in sync with manual typing in name input
  useEffect(() => {
    setCustomerSearchQuery(customerName || "");
  }, [customerName]);

  const customerSuggestions = useMemo(() => {
    const q = (customerSearchQuery || "").trim().toLowerCase();
    if (!q) return allCustomerNames.slice(0, 5);
    return allCustomerNames
      .filter((name) => name.toLowerCase().includes(q))
      .slice(0, 8);
  }, [allCustomerNames, customerSearchQuery]);

  const selectCustomerName = useCallback(
    async (name: string) => {
      setCustomerName(name);
      setCustomerSearchQuery(name);
      setIsCustomerSelected(true);
      // Immediately save the selected existing name to the current transaction without creating new customer data
      try {
        await TransactionService.update(transactionId, {
          customer_name: (name || "").trim() || undefined,
        });
        loadTransaction({ showLoading: false });
      } catch {
        // non-fatal: keep name in input, user can press save
      }
    },
    [transactionId, loadTransaction]
  );

  // Handle Android hardware back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        handleBack();
        return true; // Prevent default behavior
      }
    );

    return () => backHandler.remove();
  }, [handleBack]);

  // Load selected products from beranda/checkout if available
  useEffect(() => {
    const loadSelectedProducts = async () => {
      try {
        const selectedData = await AsyncStorage.getItem("selected_products");
        const currentTransactionId = await AsyncStorage.getItem(
          "current_transaction_id"
        );

        if (selectedData) {
          const isAddingToExisting =
            currentTransactionId &&
            parseInt(currentTransactionId, 10) === transactionId;

          if (!isAddingToExisting) {
            // Jika ini transaksi baru, hapus semua item yang ada sebelumnya
            const existingItems =
              await TransactionService.getItemsByTransactionId(transactionId);
            for (const item of existingItems) {
              await TransactionService.deleteItem(item.id);
            }
          }

          const selected = JSON.parse(selectedData);
          await addProductsToTransaction(selected);
          await AsyncStorage.removeItem("selected_products");
          await AsyncStorage.removeItem("current_transaction_id");
        }
      } catch (error) {
        console.error("Error loading selected products:", error);
      }
    };

    if (transaction && transaction.status === "pending") {
      loadSelectedProducts();
    }
  }, [transaction, addProductsToTransaction, transactionId]);

  return {
    // State
    transaction,
    setTransaction,
    items,
    setItems,
    productsWithDetails,
    setProductsWithDetails,
    loading,
    setLoading,
    customerName,
    setCustomerName,
    paymentMethod,
    setPaymentMethod,
    amountPaid,
    setAmountPaid,
    paymentCards,
    setPaymentCards,
    selectedPaymentCardId,
    setSelectedPaymentCardId,
    showPaymentModal,
    setShowPaymentModal,
    paymentInfoFilled,
    setPaymentInfoFilled,
    showProductsSheet,
    setShowProductsSheet,
    searchTerm,
    setSearchTerm,
    selectedProducts,
    setSelectedProducts,
    showScanner,
    setShowScanner,
    selectedCategoryId,
    setSelectedCategoryId,
    selectedSizeId,
    setSelectedSizeId,
    // Customer search
    customerSearchQuery,
    setCustomerSearchQuery,
    isCustomerSelected,
    setIsCustomerSelected,
    customerSuggestions,
    selectCustomerName,
    // Helper functions
    formatIdrNumber,
    getAmountPaidValue,
    calculateChange,
    getSuggestedAmounts,
    isAmountInsufficient,
    getPaymentMethodLabel,
    filteredProducts,
    // Business logic functions
    loadTransaction,
    cleanupLocalStorage,
    loadPaymentCards,
    addProductsToTransaction,
    updateItemQty,
    deleteItem,
    saveCustomerInfo,
    handlePaymentCardSelect,
    handlePaymentMethodChange,
    processPayment,
    savePaymentInfo,
    paymentValidationError,
    handleAmountPaidChange,
    handleBayar,
    handleMarkCancelled,
    handleBatal,
    handleSettings,
    handleBack,
    addProductQty,
    subProductQty,
    handleBarcodeScan,
    handleAddProducts,
    handleResetFilters,
    handleApplyFilters,
  };
}
