import { useState, useCallback, useEffect } from "react";

import { PaymentCardService } from "@/services/paymentCard";

import { router } from "expo-router";

import { Alert } from "react-native";

export function useStatePaymentCard() {
  const [cards, setCards] = useState<PaymentCard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const loadCards = useCallback(async () => {
    setLoading(true);
    try {
      const fetched = await PaymentCardService.getAll();
      setCards(fetched);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCards();
  }, [loadCards]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const fetched = await PaymentCardService.getAll();
      setCards(fetched);
    } catch (e) {
      console.error(e);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleAdd = () => {
    router.push("/profile/payment-card/new");
  };

  const handleEdit = (id: number) => {
    router.push(`/profile/payment-card/${id}`);
  };

  const handleDelete = (id: number) => {
    Alert.alert("Hapus", "Yakin hapus metode pembayaran ini?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: async () => {
          await PaymentCardService.delete(id);
          loadCards();
        },
      },
    ]);
  };

  return {
    cards,
    loading,
    refreshing,
    loadCards,
    onRefresh,
    handleAdd,
    handleEdit,
    handleDelete,
  };
}
