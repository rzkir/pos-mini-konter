import { View, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native';

import { useRouter } from 'expo-router';

import { Ionicons } from '@expo/vector-icons';

import { useStateAllTransaction } from '@/components/transaction/all-transaction/lib/useStateAllTransaction';

import FilterBottomSheet from '@/components/transaction/list/FilterBottomSheet';

import HeaderGradient from '@/components/ui/HeaderGradient';

import Input from '@/components/ui/input';

import { useAppSettingsContext } from '@/context/AppSettingsContext';

import AllTransactionCard from '@/components/transaction/all-transaction/AllTransactionCard';

import AllTransactionLoading from '@/components/transaction/all-transaction/TransactionLoading';

export default function Transaction() {
    const router = useRouter();
    const { formatIDR, formatDateTime } = useAppSettingsContext();
    const {
        loading,
        refreshing,
        filterVisible,
        layout,
        filters,
        setFilterVisible,
        setLayout,
        setFilters,
        filteredTransactions,
        visibleTransactions,
        onRefresh,
        loadMore,
        getStatusColor,
        getPaymentMethodIcon,
        getPaymentStatusStyles,
        hasMore,
        searchText,
        setSearchText,
    } = useStateAllTransaction();

    const renderTransaction = ({ item }: { item: Transaction }) => (
        <AllTransactionCard
            item={item}
            layout={layout}
            onPress={() => router.push(`/transaction/details?id=${item.id}`)}
            formatIDR={formatIDR}
            formatDateTime={formatDateTime}
            getStatusColor={getStatusColor}
            getPaymentMethodIcon={getPaymentMethodIcon}
            getPaymentStatusStyles={getPaymentStatusStyles}
        />
    );

    if (loading) {
        return (
            <AllTransactionLoading />
        );
    }

    const subtitleText = `${filteredTransactions.length} transaksi ditemukan`;

    return (
        <View className="flex-1 bg-background">
            <HeaderGradient
                title="Semua Transaksi"
                subtitle={subtitleText}
            >
                <View className="flex-row items-center justify-between w-full">
                    <View>
                        <Text className="text-white font-bold text-xl">Semua Transaksi</Text>
                        <Text className="text-white/80 text-sm">{subtitleText}</Text>
                    </View>
                    <View className="flex-row items-center">
                        <TouchableOpacity
                            onPress={() => setLayout(prev => (prev === 'list' ? 'grid' : 'list'))}
                            className="px-3 py-2 rounded-lg border mr-2"
                            style={{ borderColor: 'rgba(255,255,255,0.35)', backgroundColor: 'rgba(255,255,255,0.15)' }}
                            activeOpacity={0.8}
                        >
                            <View className="flex-row items-center">
                                <Ionicons name={layout === 'list' ? 'grid' : 'list'} size={16} color="#ffffff" />
                                <Text className="ml-2 text-white text-sm font-medium">{layout === 'list' ? 'Grid' : 'List'}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setFilterVisible(true)} className="px-3 py-2 rounded-lg border" style={{ borderColor: 'rgba(255,255,255,0.35)', backgroundColor: 'rgba(255,255,255,0.15)' }} activeOpacity={0.8}>
                            <View className="flex-row items-center">
                                <Ionicons name="filter" size={16} color="#ffffff" />
                                <Text className="ml-2 text-white text-sm font-medium">Filter</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </HeaderGradient>

            {filteredTransactions.length === 0 ? (
                <View className="flex-1 justify-center items-center px-4">
                    <Ionicons name="receipt-outline" size={64} color="#d1d5db" />
                    <Text className="text-gray-500 text-center mt-4 text-base">
                        Tidak ada transaksi yang cocok
                    </Text>
                    <Text className="text-gray-400 text-center mt-2 text-sm">
                        Ubah filter untuk melihat transaksi lainnya
                    </Text>
                </View>
            ) : (
                (() => {
                    const columns = layout === 'grid' ? 2 : 1;
                    const isGrid = columns > 1;
                    return (
                        <FlatList
                            key={`cols-${columns}`}
                            data={visibleTransactions}
                            renderItem={renderTransaction}
                            keyExtractor={(item) => item.id.toString()}
                            contentContainerStyle={{ paddingVertical: 16, paddingHorizontal: isGrid ? 2 : 0 }}
                            numColumns={columns}
                            columnWrapperStyle={isGrid ? { gap: 2, paddingHorizontal: 2 } : undefined}
                            onEndReached={loadMore}
                            onEndReachedThreshold={0.4}
                            ListFooterComponent={hasMore ? (
                                <View className="py-4">
                                    <Text className="text-center text-gray-400">Memuat lebih banyak…</Text>
                                </View>
                            ) : null}
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={onRefresh}
                                    colors={['#1E90FF']}
                                />
                            }
                        />
                    );
                })()
            )}

            <View className="w-full mt-3 px-2">
                <Input
                    placeholder="Cari nama pelanggan..."
                    value={searchText}
                    onChangeText={setSearchText}
                    leftIcon={<Ionicons name="search" size={16} color="#6B7280" />}
                    rightIcon={searchText ? (
                        <TouchableOpacity onPress={() => setSearchText('')}>
                            <Ionicons name="close-circle" size={16} color="#9CA3AF" />
                        </TouchableOpacity>
                    ) : undefined}
                    containerStyle={{ marginBottom: 0 }}
                    inputStyle={{ fontSize: 14 }}
                />
            </View>

            <FilterBottomSheet
                visible={filterVisible}
                onClose={() => setFilterVisible(false)}
                value={{ ...filters, layout }}
                onApply={(next) => {
                    setFilters({
                        datePreset: next.datePreset,
                        paymentMethod: next.paymentMethod,
                        paymentStatus: next.paymentStatus,
                        status: next.status,
                        customerName: next.customerName,
                        layout: next.layout,
                    })
                    setLayout(next.layout)
                }}
                onReset={() => setFilters(prev => ({ ...prev, datePreset: 'all', paymentMethod: 'all', paymentStatus: 'all', status: 'all', customerName: '' }))}
            />
        </View>
    );
}