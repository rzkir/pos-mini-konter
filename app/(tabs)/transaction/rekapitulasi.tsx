import { View, Text, ScrollView, RefreshControl, TouchableOpacity, ActivityIndicator } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import Chart from '@/components/transaction/rekapitulasi/Chart';

import NonChart from '@/components/transaction/rekapitulasi/NonChart';

import HeaderGradient from '@/components/ui/HeaderGradient';

import FilterBottomSheet from '@/components/transaction/rekapitulasi/FilterBottomSheet';

import useStateRekapitulasi from '@/components/transaction/rekapitulasi/lib/useStateRekapitulasi';

import { useAppSettingsContext } from "@/context/AppSettingsContext";

export default function Rekapitulasi() {
    const { formatIDR } = useAppSettingsContext();
    const {
        loading,
        refreshing,
        showCharts,
        optionSheetVisible,
        setShowCharts,
        setOptionSheetVisible,
        onRefresh,
        totalTransactions,
        completedTransactions,
        cancelledTransactions,
        draftTransactions,
        returnTransactions,
        totalRevenue,
        totalSubtotal,
        totalDiscount,

        cashTransactions,
        cardTransactions,
        transferTransactions,
        cashRevenue,
        cardRevenue,
        transferRevenue,
        statusChartData,
        paymentChartData,
        dailyRevenueData,
        financialBarData,
        paymentCountPie,
        chartWidth,
        paymentBarWidth,
        paymentBarSpacing,
        paymentChartContentWidth,
    } = useStateRekapitulasi();

    // UI helpers

    if (loading) {
        return (
            <View className="flex-1 bg-gray-50 justify-center items-center">
                <ActivityIndicator size="small" color="#2563eb" />
                <Text className="text-gray-500 mt-2">Memuat rekapitulasi...</Text>
            </View>
        );
    }

    return (
        <ScrollView
            className="flex-1 bg-background"
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={['#1E90FF']}
                />
            }
        >
            <HeaderGradient
                title="Rekapitulasi Transaksi"
                subtitle="Ringkasan keseluruhan transaksi"
            >
                <View className="flex-row items-center justify-between w-full">
                    <View>
                        <Text className="text-white font-bold text-xl">Rekapitulasi Transaksi</Text>
                        <Text className="text-white/80 text-xs">Ringkasan keseluruhan transaksi</Text>
                    </View>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => setOptionSheetVisible(true)}
                        className="bg-white/90 rounded-lg w-9 h-9 items-center justify-center"
                    >
                        <Ionicons name="settings-outline" size={18} color="#111827" />
                    </TouchableOpacity>
                </View>
            </HeaderGradient>

            <View className='flex-col mt-4'>
                {!showCharts && (
                    <NonChart
                        totalTransactions={totalTransactions}
                        totalRevenue={totalRevenue}
                        formatIDR={formatIDR}
                        completedTransactions={completedTransactions}
                        cancelledTransactions={cancelledTransactions}
                        draftTransactions={draftTransactions}
                        returnTransactions={returnTransactions}
                        totalSubtotal={totalSubtotal}
                        totalDiscount={totalDiscount}

                        cashRevenue={cashRevenue}
                        cardRevenue={cardRevenue}
                        transferRevenue={transferRevenue}
                        cashTransactions={cashTransactions}
                        cardTransactions={cardTransactions}
                        transferTransactions={transferTransactions}
                    />
                )}

                {/* Charts */}
                {showCharts && (
                    <Chart
                        chartWidth={chartWidth}
                        statusChartData={statusChartData}
                        totalTransactions={totalTransactions}
                        dailyRevenueData={dailyRevenueData}
                        formatIDR={formatIDR}
                        paymentChartData={paymentChartData}
                        paymentBarWidth={paymentBarWidth}
                        paymentBarSpacing={paymentBarSpacing}
                        paymentChartContentWidth={paymentChartContentWidth}
                        paymentCountPie={paymentCountPie}
                        financialBarData={financialBarData}
                    />
                )}
            </View>

            <FilterBottomSheet
                visible={optionSheetVisible}
                onClose={() => setOptionSheetVisible(false)}
                showCharts={showCharts}
                setShowCharts={setShowCharts}
            />
            <View className="h-6" />
        </ScrollView>
    );
}