import { useEffect, useMemo, useState } from 'react';

import { View, Text, FlatList, RefreshControl, TextInput, TouchableOpacity } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import HeaderGradient from '@/components/ui/HeaderGradient';

import { useAppSettingsContext } from '@/context/AppSettingsContext';

import { TransactionService } from '@/services/transactionService';

export default function Costumers() {
    const { formatIDR, formatDate } = useAppSettingsContext();

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState('');
    const [customers, setCustomers] = useState<CustomerSummary[]>([]);

    const load = async () => {
        try {
            const tx = await TransactionService.getAll();
            const map = new Map<string, CustomerSummary>();

            for (const t of tx) {
                const key = (t.customer_name || '').trim() || 'Tanpa Nama';
                const existing = map.get(key);
                if (existing) {
                    existing.totalSpent += Number(t.total || 0);
                    existing.transactionsCount += 1;
                    if (new Date(t.created_at) > new Date(existing.lastTransactionAt)) {
                        existing.lastTransactionAt = t.created_at;
                    }
                } else {
                    map.set(key, {
                        name: key,
                        phone: t.customer_phone,
                        totalSpent: Number(t.total || 0),
                        transactionsCount: 1,
                        lastTransactionAt: t.created_at,
                    });
                }
            }

            const list = Array.from(map.values()).sort(
                (a, b) => b.totalSpent - a.totalSpent
            );
            setCustomers(list);
        } catch (e) {
            console.error('Failed to load customers:', e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return customers;
        return customers.filter(c =>
            c.name.toLowerCase().includes(q) || (c.phone || '').toLowerCase().includes(q)
        );
    }, [customers, search]);

    const onRefresh = () => {
        setRefreshing(true);
        load();
    };

    const renderItem = ({ item }: { item: CustomerSummary }) => (
        <View className="bg-white rounded-2xl border border-border p-4 mb-2 mx-2">
            <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                    <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center mr-3">
                        <Ionicons name="person" size={20} color="#3b82f6" />
                    </View>
                    <View>
                        <Text className="text-base font-bold text-gray-800">{item.name}</Text>
                        {!!item.phone && (
                            <Text className="text-xs text-gray-500">{item.phone}</Text>
                        )}
                    </View>
                </View>
                <View className="items-end">
                    <Text className="text-sm text-gray-500">Total Belanja</Text>
                    <Text className="text-base font-semibold text-gray-800">{formatIDR(item.totalSpent)}</Text>
                </View>
            </View>
            <View className="flex-row justify-between mt-3">
                <Text className="text-xs text-gray-500">Transaksi: {item.transactionsCount}</Text>
                <Text className="text-xs text-gray-500">Terakhir: {formatDate(item.lastTransactionAt)}</Text>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View className="flex-1 bg-background justify-center items-center">
                <Text className="text-gray-500">Memuat pelanggan...</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-background">
            <HeaderGradient title="Pelanggan" subtitle={`${customers.length} pelanggan`}>
                <View className="w-full">
                    <View className="flex-row items-center bg-white/10 rounded-xl px-3 py-2">
                        <Ionicons name="search" size={16} color="#ffffff" />
                        <TextInput
                            value={search}
                            onChangeText={setSearch}
                            placeholder="Cari nama atau nomor telepon"
                            placeholderTextColor="#e5e7eb"
                            className="ml-2 text-white flex-1"
                        />
                        {!!search && (
                            <TouchableOpacity onPress={() => setSearch('')}>
                                <Ionicons name="close" size={16} color="#ffffff" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </HeaderGradient>

            {filtered.length === 0 ? (
                <View className="flex-1 justify-center items-center px-4">
                    <Ionicons name="people-outline" size={64} color="#d1d5db" />
                    <Text className="text-gray-500 text-center mt-4 text-base">
                        Tidak ada pelanggan yang cocok
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={filtered}
                    renderItem={renderItem}
                    keyExtractor={(item) => `${item.name}-${item.phone || ''}`}
                    contentContainerStyle={{ paddingVertical: 16 }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#1E90FF"]} />
                    }
                />
            )}
        </View>
    );
}