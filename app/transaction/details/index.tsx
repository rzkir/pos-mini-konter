import { useEffect, useMemo, useState } from 'react';

import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';

import { useLocalSearchParams, useRouter } from 'expo-router';

import { Ionicons } from '@expo/vector-icons';

import { TransactionService } from '@/services/transactionService';

import { useAppSettingsContext } from '@/context/AppSettingsContext';

import { useProducts } from '@/hooks/useProducts';

import { usePrinter } from '@/hooks/usePrinter';

export default function TransactionDetails() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const transactionId = useMemo(() => parseInt(id as string, 10), [id]);

    const { formatIDR, formatDateTime } = useAppSettingsContext();
    const { products } = useProducts();
    const { onPressPrint, onPressShare } = usePrinter();

    const [transaction, setTransaction] = useState<Transaction | null>(null);
    const [items, setItems] = useState<(TransactionItem & { product?: any })[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const trx = await TransactionService.getById(transactionId);
                setTransaction(trx);
                const trxItems = await TransactionService.getItemsByTransactionId(transactionId);
                const withProducts = trxItems.map((it) => ({
                    ...it,
                    product: products.find((p: any) => p.id === it.product_id),
                }));
                setItems(withProducts);
            } catch (e) {
                console.error('Failed to load transaction details:', e);
            } finally {
                setLoading(false);
            }
        };
        if (!Number.isNaN(transactionId)) load();
    }, [transactionId, products]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <View className="flex-1 bg-gray-50 justify-center items-center">
                <Text className="text-gray-500">Memuat detail transaksi...</Text>
            </View>
        );
    }

    if (!transaction) {
        return (
            <View className="flex-1 bg-gray-50 justify-center items-center px-6">
                <Ionicons name="alert-circle-outline" size={48} color="#9ca3af" />
                <Text className="text-gray-500 mt-3 text-center">Transaksi tidak ditemukan</Text>
                <TouchableOpacity onPress={() => router.back()} className="mt-4 px-4 py-2 bg-blue-600 rounded">
                    <Text className="text-white font-medium">Kembali</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-50">
            <View className="px-4 pt-4 pb-3 bg-white border-b border-gray-200">
                <View className="flex-row items-center justify-between">
                    <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
                        <Ionicons name="chevron-back" size={22} color="#111827" />
                    </TouchableOpacity>
                    <Text className="text-base font-semibold text-gray-900">Detail Transaksi</Text>
                    <View style={{ width: 22 }} />
                </View>
                <View className="mt-3 flex-row items-center justify-between">
                    <View className="flex-1 pr-2">
                        <Text className="text-sm font-semibold text-gray-800">{transaction.transaction_number}</Text>
                        {!!transaction.customer_name && (
                            <Text className="text-xs text-gray-600 mt-0.5">{transaction.customer_name}</Text>
                        )}
                        <Text className="text-xs text-gray-500 mt-0.5">{formatDateTime(transaction.created_at)}</Text>
                    </View>
                    <View className={`px-2 py-1 rounded ${getStatusColor(transaction.status)}`}>
                        <Text className="text-xs font-medium capitalize">{transaction.status}</Text>
                    </View>
                </View>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
                <View className="mx-4 mt-4 bg-white rounded-lg border border-gray-200">
                    <View className="px-4 py-3 border-b border-gray-100">
                        <Text className="text-sm font-semibold text-gray-800">Item</Text>
                    </View>
                    <View className="py-1">
                        {items.length === 0 ? (
                            <View className="px-4 py-4">
                                <Text className="text-gray-500 text-sm">Tidak ada item</Text>
                            </View>
                        ) : (
                            items.map((it) => (
                                <View key={it.id} className="px-4 py-3 border-t border-gray-50 flex-row items-center justify-between">
                                    <View className="flex-1 pr-2">
                                        <Text className="text-sm font-medium text-gray-900">{it.product?.name || `Produk #${it.product_id}`}</Text>
                                        <Text className="text-xs text-gray-500 mt-0.5">{it.quantity} x {formatIDR(it.price)}</Text>
                                    </View>
                                    <Text className="text-sm font-semibold text-gray-900">{formatIDR(it.subtotal)}</Text>
                                </View>
                            ))
                        )}
                    </View>
                </View>

                <View className="mx-4 mt-4 bg-white rounded-lg border border-gray-200">
                    <View className="px-4 py-3 border-b border-gray-100">
                        <Text className="text-sm font-semibold text-gray-800">Ringkasan Pembayaran</Text>
                    </View>
                    <View className="px-4 py-3 gap-2">
                        <View className="flex-row justify-between">
                            <Text className="text-sm text-gray-600">Subtotal</Text>
                            <Text className="text-sm text-gray-900">{formatIDR(transaction.subtotal)}</Text>
                        </View>
                        <View className="flex-row justify-between">
                            <Text className="text-sm text-gray-600">Diskon</Text>
                            <Text className="text-sm text-gray-900">{formatIDR(transaction.discount || 0)}</Text>
                        </View>
                        {/* Pajak dihapus */}
                        <View className="h-px bg-gray-100 my-1" />
                        <View className="flex-row justify-between items-center">
                            <Text className="text-base font-semibold text-gray-900">Total</Text>
                            <Text className="text-base font-bold text-gray-900">{formatIDR(transaction.total)}</Text>
                        </View>
                        <View className="flex-row justify-between mt-2 items-center">
                            <View className="flex-row items-center gap-2">
                                <Ionicons name={
                                    transaction.payment_method === 'cash' ? 'cash' :
                                        transaction.payment_method === 'card' ? 'card' : 'swap-horizontal'
                                } size={16} color="#6b7280" />
                                <Text className="text-xs text-gray-600 capitalize">{transaction.payment_method}</Text>
                            </View>
                            <Text className="text-xs capitalize px-2 py-1 rounded bg-gray-100 text-gray-700">{transaction.payment_status}</Text>
                        </View>
                    </View>
                </View>

                {/* CTA Print & Share hanya saat status sukses */}
                {transaction.payment_status === 'paid' && transaction.status === 'completed' && (
                    <View className="mx-4 mt-4 bg-white rounded-lg border border-gray-200 p-4">
                        <Text className="text-sm font-semibold text-gray-800 mb-3">Cetak & Bagikan</Text>
                        <View className="flex-row gap-3">
                            <TouchableOpacity
                                onPress={async () => {
                                    const textLines: string[] = [];
                                    textLines.push(`No: ${transaction.transaction_number}`);
                                    textLines.push(`Tanggal: ${formatDateTime(transaction.created_at)}`);
                                    if (transaction.customer_name) textLines.push(`Pelanggan: ${transaction.customer_name}`);
                                    textLines.push('------------------------------');
                                    items.forEach((it) => {
                                        const name = it.product?.name || `Produk #${it.product_id}`;
                                        textLines.push(`${name}`);
                                        textLines.push(`${it.quantity} x ${formatIDR(it.price)} = ${formatIDR(it.subtotal)}`);
                                    });
                                    textLines.push('------------------------------');
                                    textLines.push(`Subtotal: ${formatIDR(transaction.subtotal)}`);
                                    textLines.push(`Diskon: ${formatIDR(transaction.discount || 0)}`);
                                    textLines.push(`Total: ${formatIDR(transaction.total)}`);
                                    textLines.push(`Metode: ${transaction.payment_method}`);
                                    textLines.push(`Status: Lunas`);
                                    textLines.push('Terima kasih!');
                                    await onPressPrint(textLines.join('\n'));
                                }}
                                className="flex-1 bg-white border border-gray-300 rounded-xl py-3 items-center flex-row justify-center"
                            >
                                <Ionicons name="print" size={18} color="#111827" style={{ marginRight: 8 }} />
                                <Text className="text-gray-800 font-semibold text-sm">Print</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={async () => {
                                    const shareLines: string[] = [];
                                    shareLines.push(`Transaksi ${transaction.transaction_number}`);
                                    shareLines.push(`${formatDateTime(transaction.created_at)}`);
                                    if (transaction.customer_name) shareLines.push(`Pelanggan: ${transaction.customer_name}`);
                                    items.forEach((it) => {
                                        const name = it.product?.name || `Produk #${it.product_id}`;
                                        shareLines.push(`${name} — ${it.quantity} x ${formatIDR(it.price)} = ${formatIDR(it.subtotal)}`);
                                    });
                                    shareLines.push(`Total: ${formatIDR(transaction.total)}`);
                                    shareLines.push(`Metode: ${transaction.payment_method} • Lunas`);
                                    await onPressShare(shareLines.join('\n'));
                                }}
                                className="flex-1 bg-white border border-gray-300 rounded-xl py-3 items-center flex-row justify-center"
                            >
                                <Ionicons name="share-social" size={18} color="#111827" style={{ marginRight: 8 }} />
                                <Text className="text-gray-800 font-semibold text-sm">Share</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {transaction.payment_status === 'pending' && (
                    <View className="mx-4 mt-4 bg-white rounded-lg border border-gray-200 p-4">
                        <Text className="text-sm font-semibold text-gray-800 mb-3">Tindakan</Text>
                        <View className="flex-row gap-3">
                            <TouchableOpacity
                                onPress={() => {
                                    router.push({ pathname: '/transaction/[id]', params: { id: transactionId.toString() } });
                                }}
                                className="flex-1 bg-blue-600 rounded-xl py-3 items-center"
                            >
                                <Text className="text-white font-semibold text-sm">Lanjutkan Pembayaran</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {transaction.payment_status === 'cancelled' && (
                    <View className="mx-4 mt-4 bg-white rounded-lg border border-gray-200 p-4">
                        <Text className="text-sm font-semibold text-gray-800 mb-3">Tindakan</Text>
                        <View className="flex-row gap-3">
                            <TouchableOpacity
                                onPress={() => {
                                    Alert.alert('Konfirmasi', 'Hapus transaksi yang dibatalkan ini?', [
                                        { text: 'Batal', style: 'cancel' },
                                        {
                                            text: 'Hapus', style: 'destructive', onPress: async () => {
                                                try {
                                                    const items = await TransactionService.getItemsByTransactionId(transactionId);
                                                    for (const it of items) {
                                                        await TransactionService.deleteItem(it.id);
                                                    }
                                                    await TransactionService.delete(transactionId);
                                                    router.back();
                                                } catch (e) {
                                                    console.error('Failed to delete cancelled transaction:', e);
                                                }
                                            }
                                        }
                                    ]);
                                }}
                                className="flex-1 bg-white border border-red-300 rounded-xl py-3 items-center"
                            >
                                <Text className="text-red-600 font-semibold text-sm">Hapus</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {transaction.payment_status === 'return' && (
                    <View className="mx-4 mt-4 bg-white rounded-lg border border-gray-200 p-4">
                        <Text className="text-sm font-semibold text-gray-800 mb-3">Tindakan</Text>
                        <View className="flex-row gap-3">
                            <TouchableOpacity
                                onPress={() => {
                                    Alert.alert('Konfirmasi', 'Hapus transaksi retur ini?', [
                                        { text: 'Batal', style: 'cancel' },
                                        {
                                            text: 'Hapus', style: 'destructive', onPress: async () => {
                                                try {
                                                    const items = await TransactionService.getItemsByTransactionId(transactionId);
                                                    for (const it of items) {
                                                        await TransactionService.deleteItem(it.id);
                                                    }
                                                    await TransactionService.delete(transactionId);
                                                    router.back();
                                                } catch (e) {
                                                    console.error('Failed to delete returned transaction:', e);
                                                }
                                            }
                                        }
                                    ]);
                                }}
                                className="flex-1 bg-white border border-red-300 rounded-xl py-3 items-center"
                            >
                                <Text className="text-red-600 font-semibold text-sm">Hapus</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {transaction.status === 'completed' && (
                    <View className="mx-4 mt-4 bg-white rounded-lg border border-gray-200 p-4">
                        <Text className="text-sm font-semibold text-gray-800 mb-3">Tindakan</Text>
                        <View className="flex-row gap-3">
                            <TouchableOpacity
                                onPress={async () => {
                                    try {
                                        const updated = await TransactionService.update(transactionId, { payment_status: 'return', status: 'return' });
                                        if (updated) setTransaction(updated);
                                    } catch (e) {
                                        console.error('Failed to mark return:', e);
                                    }
                                }}
                                className="flex-1 bg-orange-500 rounded-xl py-3 items-center"
                            >
                                <Text className="text-white font-semibold text-sm">Return</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}