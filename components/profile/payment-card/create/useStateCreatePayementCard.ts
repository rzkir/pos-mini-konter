import { useState, useEffect, useMemo } from "react";
import { Alert } from "react-native";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { PaymentCardService } from "@/services/paymentCard";

const Methods: PaymentMethodOption[] = [
  "qris",
  "gopay",
  "ovo",
  "dana",
  "shopeepay",
  "linkaja",
  "debit_card",
  "credit_card",
  "bank_transfer",
];
const Banks: BankName[] = [
  "bca",
  "bri",
  "mandiri",
  "bni",
  "cimb",
  "permata",
  "danamon",
  "other",
];

export function useStateCreatePaymentCard(idParam: string | undefined) {
  const isNew = idParam === "new" || !idParam;

  const [method, setMethod] = useState<PaymentMethodOption>("qris");
  const [bank, setBank] = useState<BankName | undefined>(undefined);
  const [accountNumber, setAccountNumber] = useState<string>("");
  const [holderName, setHolderName] = useState<string>("");
  const [isActive, setIsActive] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [image, setImage] = useState<PaymentCardImage | undefined>(undefined);

  const needsBank = useMemo(
    () =>
      method === "debit_card" ||
      method === "credit_card" ||
      method === "bank_transfer",
    [method]
  );

  useEffect(() => {
    if (!isNew && idParam) {
      (async () => {
        setLoading(true);
        try {
          const existing = await PaymentCardService.getById(Number(idParam));
          if (existing) {
            setMethod(existing.method);
            setBank(existing.bank);
            setAccountNumber(existing.account_number ?? "");
            setHolderName(existing.holder_name ?? "");
            setIsActive(existing.is_active);
            setImage(existing.image);
          }
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [isNew, idParam]);

  const save = async () => {
    try {
      if (needsBank && !bank) {
        Alert.alert("Validasi", "Pilih bank untuk metode ini");
        return;
      }
      setLoading(true);
      const now = new Date().toISOString();
      if (isNew) {
        await PaymentCardService.create({
          method,
          bank,
          account_number: accountNumber || undefined,
          holder_name: holderName || undefined,
          is_active: isActive,
          image: image,
        });
      } else if (idParam) {
        await PaymentCardService.update(Number(idParam), {
          method,
          bank,
          account_number: accountNumber || undefined,
          holder_name: holderName || undefined,
          is_active: isActive,
          updated_at: now,
          image: image,
        });
      }
      router.back();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handlePickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Izin galeri diperlukan",
          "Silakan izinkan akses galeri untuk memilih gambar QRIS"
        );
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
        setImage({ url: uri });
      }
    } catch {
      Alert.alert("Gagal memilih gambar");
    }
  };

  return {
    isNew,
    method,
    setMethod,
    bank,
    setBank,
    accountNumber,
    setAccountNumber,
    holderName,
    setHolderName,
    isActive,
    setIsActive,
    loading,
    image,
    needsBank,
    Methods,
    Banks,
    save,
    handlePickImage,
  };
}
