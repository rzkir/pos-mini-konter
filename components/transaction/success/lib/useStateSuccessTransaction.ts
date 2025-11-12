import { useLocalSearchParams, useRouter } from "expo-router";

import { useCallback, useEffect, useState } from "react";

import { Platform, Share as RNShare, BackHandler } from "react-native";

import { TransactionService } from "@/services/transactionService";

import { useAppSettingsContext } from "@/context/AppSettingsContext";

import { useProducts } from "@/hooks/useProducts";

import { usePrinter } from "@/hooks/usePrinter";

import Toast from "react-native-toast-message";

import * as Print from "expo-print";

import * as FileSystem from "expo-file-system";

import * as Sharing from "expo-sharing";

import {
  generateReceiptHTML,
  generateReceiptText,
} from "@/app/profile/printer/template/index";

import AsyncStorage from "@react-native-async-storage/async-storage";

export function useStateSuccessTransaction() {
  const { transactionId } = useLocalSearchParams();
  const router = useRouter();
  const id = parseInt(transactionId as string, 10);

  const { formatIDR } = useAppSettingsContext();
  const { products } = useProducts();
  const { connectedAddress, printText } = usePrinter();

  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [printing, setPrinting] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [shareSheetVisible, setShareSheetVisible] = useState(false);

  const loadTransaction = useCallback(async () => {
    try {
      setLoading(true);
      const trans = await TransactionService.getById(id);
      if (trans) {
        setTransaction(trans);
        const transactionItems =
          await TransactionService.getItemsByTransactionId(id);

        const itemsWithProducts = transactionItems.map((item) => {
          const product = products.find((p: any) => p.id === item.product_id);
          return {
            ...item,
            product,
          };
        });
        setItems(itemsWithProducts);
      }
    } catch (error) {
      console.error("Error loading transaction:", error);
    } finally {
      setLoading(false);
    }
  }, [id, products]);

  useEffect(() => {
    loadTransaction();
  }, [loadTransaction]);

  const handleBackToHome = useCallback(() => {
    router.replace("/(tabs)");
  }, [router]);

  // Handle Android/iOS hardware back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        handleBackToHome();
        return true; // Prevent default behavior
      }
    );

    return () => backHandler.remove();
  }, [handleBackToHome]);

  const handlePrint = async () => {
    if (!transaction) return;

    if (!connectedAddress) {
      Toast.show({
        type: "error",
        text1: "Printer Belum Terhubung",
        text2: "Hubungkan printer di Pengaturan Printer.",
      });
      router.push("/profile/printer");
      return;
    }

    try {
      setPrinting(true);
      const receiptText = await generateReceiptText({
        transaction,
        items,
      });
      await printText(receiptText);
      Toast.show({
        type: "success",
        text1: "Berhasil",
        text2: "Struk berhasil dikirim ke printer",
        visibilityTime: 3000,
      });
    } catch (error: any) {
      console.error("Print error:", error);
      Toast.show({
        type: "error",
        text1: "Gagal Print",
        text2: error?.message || "Gagal mencetak struk",
        visibilityTime: 3000,
      });
    } finally {
      setPrinting(false);
    }
  };

  const handleSharePDF = async () => {
    if (!transaction) return;

    try {
      setDownloading(true);

      let transactionForReceipt = transaction;
      try {
        const consumerInfoRaw = await AsyncStorage.getItem(
          process.env.EXPO_PUBLIC_CONSUMER_INFO as string
        );
        if (consumerInfoRaw) {
          const consumerInfo = JSON.parse(consumerInfoRaw);
          if (
            consumerInfo?.transaction_id === transaction.id &&
            consumerInfo?.customer_name
          ) {
            transactionForReceipt = {
              ...transaction,
              customer_name: consumerInfo.customer_name,
            } as Transaction;
          }
        }
      } catch {}

      const htmlContent = await generateReceiptHTML({
        transaction: transactionForReceipt,
        items,
      });

      if (Platform.OS === "web") {
        await Print.printAsync({ html: htmlContent });
        Toast.show({
          type: "success",
          text1: "Berhasil",
          text2: "Gunakan dialog print untuk simpan sebagai PDF",
          visibilityTime: 3000,
        });
        return;
      }

      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false,
      });

      const fileName = `Receipt_${
        transaction.transaction_number
      }_${Date.now()}.pdf`;
      const baseDir =
        (FileSystem as any).documentDirectory ||
        (FileSystem as any).cacheDirectory;
      let fileUri = uri;
      if (baseDir) {
        try {
          const target = `${baseDir}${fileName}`;
          await FileSystem.moveAsync({ from: uri, to: target });
          fileUri = target;
        } catch {}
      }

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: "application/pdf",
          dialogTitle: "Simpan atau Bagikan PDF",
        });
        Toast.show({
          type: "success",
          text1: "Berhasil",
          text2: "PDF berhasil dibuat dan dibagikan",
          visibilityTime: 3000,
        });
      } else {
        Toast.show({
          type: "success",
          text1: "Berhasil",
          text2: `PDF disimpan di: ${fileUri}`,
          visibilityTime: 3000,
        });
      }
    } catch (error: any) {
      console.error("PDF generation error:", error);
      Toast.show({
        type: "error",
        text1: "Gagal Membagikan PDF",
        text2: error?.message || "Gagal membuat/membagikan PDF.",
        visibilityTime: 4000,
      });
    } finally {
      setDownloading(false);
    }
  };

  const openShareSheet = () => setShareSheetVisible(true);
  const closeShareSheet = () => setShareSheetVisible(false);

  const handleShareText = async () => {
    if (!transaction) return;
    try {
      let transactionForReceipt = transaction;
      try {
        const consumerInfoRaw = await AsyncStorage.getItem(
          process.env.EXPO_PUBLIC_CONSUMER_INFO as string
        );
        if (consumerInfoRaw) {
          const consumerInfo = JSON.parse(consumerInfoRaw);
          if (
            consumerInfo?.transaction_id === transaction.id &&
            consumerInfo?.customer_name
          ) {
            transactionForReceipt = {
              ...transaction,
              customer_name: consumerInfo.customer_name,
            } as Transaction;
          }
        }
      } catch {}

      const receiptText = await generateReceiptText({
        transaction: transactionForReceipt,
        items,
      });
      await RNShare.share({ message: receiptText, title: "Struk Transaksi" });
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Gagal Membagikan",
        text2: error?.message || "Tidak dapat membagikan teks",
      });
    }
  };

  return {
    // data
    transaction,
    items,
    loading,
    printing,
    downloading,
    shareSheetVisible,
    formatIDR,
    // actions
    loadTransaction,
    handleBackToHome,
    handlePrint,
    handleSharePDF,
    openShareSheet,
    closeShareSheet,
    handleShareText,
  } as const;
}

export default useStateSuccessTransaction;
