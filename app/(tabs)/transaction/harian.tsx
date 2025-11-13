import { View, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { useAppSettingsContext } from '@/context/AppSettingsContext';

import FillterBottomSheets from '@/components/transaction/daily/FillterBottomSheets';

import DailyTrasactionCard from '@/components/transaction/daily/DailyTrasactionCard';

import { useStateDaily } from '@/components/transaction/daily/lib/useStateDaily';

import HeaderGradient from '@/components/ui/HeaderGradient';

import Input from '@/components/ui/input';

import DailyTransactionLoading from '@/components/transaction/daily/TransactionLoading';

export default function Harian() {
    const { formatIDR } = useAppSettingsContext();

    const {
        displayedDailyTransactions,
        loading,
        refreshing,
        onRefresh,
        activeDayTab,
        isSheetOpen,
        pendingDayTab,
        setPendingDayTab,
        searchText,
        setSearchText,
        dayName,
        getStatusColor,
        formatDateLabel,
        openSheet,
        closeSheet,
        applySelection,
    } = useStateDaily();

    const renderDaySection = ({ item }: { item: DailyTransaction }) => (
        <DailyTrasactionCard
            item={{ ...item, date: formatDateLabel(item.date) }}
            formatIDR={formatIDR}
            getStatusColor={getStatusColor}
        />
    );

    if (loading) {
        return (
            <DailyTransactionLoading />
        );
    }

    return (
        <View className="flex-1 bg-gray-50">
            <FlatList
                data={displayedDailyTransactions}
                renderItem={renderDaySection}
                keyExtractor={(item) => item.date}
                contentContainerStyle={{ paddingVertical: 16 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#1E90FF']}
                    />
                }
                ListHeaderComponent={
                    <View>
                        <HeaderGradient title="Transaksi Harian" subtitle="Transaksi yang dikelompokkan per hari">
                            <View className="w-full">
                                <View className="flex-row items-center justify-between">
                                    <View>
                                        <Text className="text-lg font-bold text-white">Transaksi Harian</Text>

                                        <Text className="text-sm text-white/80 mt-1">Transaksi yang dikelompokkan per hari</Text>
                                    </View>

                                    <TouchableOpacity
                                        onPress={() => openSheet(activeDayTab)}
                                        className="flex-row items-center px-3 py-2 rounded-full"
                                        style={{ backgroundColor: '#eef2ff' }}
                                    >
                                        <Ionicons name="calendar" size={16} color="#4f46e5" />
                                        <Text className="ml-2 text-xs font-medium" style={{ color: '#4f46e5' }}>{dayName(activeDayTab)}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </HeaderGradient>
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
                    </View>
                }
                ListEmptyComponent={
                    <View className="px-4 mt-8 items-center">
                        <Ionicons name="calendar-outline" size={64} color="#d1d5db" />
                        <Text className="text-gray-500 text-center mt-4 text-base">
                            Tidak ada transaksi untuk {dayName(activeDayTab)}
                        </Text>
                    </View>
                }
            />
            <FillterBottomSheets
                visible={isSheetOpen}
                onClose={closeSheet}
                dayName={dayName}
                activeDayTab={activeDayTab}
                pendingDayTab={pendingDayTab}
                setPendingDayTab={setPendingDayTab}
                onApply={applySelection}
            />
        </View>
    );
}