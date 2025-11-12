import { View, Text } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import SectionTitle from '@/components/ui/SectionTitle';

const StatCard = ({
    title,
    value,
    icon,
    color = '#3b82f6',
    subtitle,
}: {
    title: string;
    value: string | number;
    icon: string;
    color?: string;
    subtitle?: string;
}) => (
    <View className="bg-white rounded-2xl p-4 mb-3 mx-4 shadow-sm border border-gray-100">
        <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
                <View className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-2" />
                <Text className="text-[13px] font-semibold text-gray-900">{title}</Text>
            </View>
            <View className="w-8 h-8 rounded-full items-center justify-center" style={{ backgroundColor: `${color}15` }}>
                <Ionicons name={icon as any} size={18} color={color} />
            </View>
        </View>
        <Text className="text-3xl font-extrabold text-gray-900 tracking-tight">{value}</Text>
        {subtitle && <Text className="text-xs text-gray-500 mt-1">{subtitle}</Text>}
    </View>
);

export default function NonChart({
    totalTransactions,
    totalRevenue,
    formatIDR,
    completedTransactions,
    cancelledTransactions,
    draftTransactions,
    returnTransactions,
    totalSubtotal,
    totalDiscount,

    cashRevenue,
    cardRevenue,
    transferRevenue,
    cashTransactions,
    cardTransactions,
    transferTransactions,
}: NonChartProps) {
    return (
        <>
            {/* Overview Stats */}
            <StatCard title="Total Transaksi" value={totalTransactions} icon="receipt" color="#3b82f6" />

            <StatCard title="Total Pendapatan" value={formatIDR(totalRevenue)} icon="cash" color="#10b981" />

            {/* Transaction Status */}
            <View className="px-4 mb-2 mt-4">
                <SectionTitle title="Status Transaksi" />
            </View>

            <StatCard
                title="Selesai"
                value={completedTransactions}
                icon="checkmark-circle"
                color="#10b981"
                subtitle={`${totalTransactions > 0 ? ((completedTransactions / totalTransactions) * 100).toFixed(1) : 0}% dari total`}
            />

            <StatCard
                title="Dibatalkan"
                value={cancelledTransactions}
                icon="close-circle"
                color="#ef4444"
                subtitle={`${totalTransactions > 0 ? ((cancelledTransactions / totalTransactions) * 100).toFixed(1) : 0}% dari total`}
            />

            <StatCard
                title="Pending"
                value={draftTransactions}
                icon="time"
                color="#f59e0b"
                subtitle={`${totalTransactions > 0 ? ((draftTransactions / totalTransactions) * 100).toFixed(1) : 0}% dari total`}
            />

            <StatCard
                title="Return"
                value={returnTransactions}
                icon="refresh"
                color="#3b82f6"
                subtitle={`${totalTransactions > 0 ? ((returnTransactions / totalTransactions) * 100).toFixed(1) : 0}% dari total`}
            />

            {/* Financial Breakdown */}
            <View className="px-4 mb-2 mt-4">
                <SectionTitle title="Rincian Keuangan" />
            </View>

            <View className="bg-white rounded-2xl p-4 mb-3 mx-4 shadow-sm border border-gray-100">
                <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-sm text-gray-600">Subtotal</Text>
                    <Text className="text-base font-semibold text-gray-900">{formatIDR(totalSubtotal)}</Text>
                </View>
                <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-sm text-gray-600">Diskon</Text>
                    <Text className="text-base font-semibold text-red-600">-{formatIDR(totalDiscount)}</Text>
                </View>

                <View className="border-t border-gray-100 mt-3 pt-3 flex-row justify-between items-center">
                    <Text className="text-base font-bold text-gray-800">Total Pendapatan</Text>
                    <Text className="text-xl font-extrabold text-green-600">{formatIDR(totalRevenue)}</Text>
                </View>
            </View>

            {/* Payment Method Breakdown */}
            <View className="px-4 mb-2 mt-4">
                <SectionTitle title="Metode Pembayaran" />
            </View>

            <View className="bg-white rounded-2xl p-4 mb-3 mx-4 shadow-sm border border-gray-100">
                <View className="flex-row justify-between items-center mb-3">
                    <View className="flex-row items-center gap-2">
                        <View className="w-8 h-8 rounded-full items-center justify-center" style={{ backgroundColor: '#10b98115' }}>
                            <Ionicons name="cash" size={18} color="#10b981" />
                        </View>
                        <Text className="text-sm text-gray-700">Tunai</Text>
                    </View>
                    <View className="items-end">
                        <Text className="text-base font-semibold text-gray-900">{formatIDR(cashRevenue)}</Text>
                        <Text className="text-xs text-gray-500">{cashTransactions} transaksi</Text>
                    </View>
                </View>
                <View className="flex-row justify-between items-center mb-3">
                    <View className="flex-row items-center gap-2">
                        <View className="w-8 h-8 rounded-full items-center justify-center" style={{ backgroundColor: '#3b82f615' }}>
                            <Ionicons name="card" size={18} color="#3b82f6" />
                        </View>
                        <Text className="text-sm text-gray-700">Kartu</Text>
                    </View>
                    <View className="items-end">
                        <Text className="text-base font-semibold text-gray-900">{formatIDR(cardRevenue)}</Text>
                        <Text className="text-xs text-gray-500">{cardTransactions} transaksi</Text>
                    </View>
                </View>
                <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center gap-2">
                        <View className="w-8 h-8 rounded-full items-center justify-center" style={{ backgroundColor: '#8b5cf615' }}>
                            <Ionicons name="swap-horizontal" size={18} color="#8b5cf6" />
                        </View>
                        <Text className="text-sm text-gray-700">Transfer</Text>
                    </View>
                    <View className="items-end">
                        <Text className="text-base font-semibold text-gray-900">{formatIDR(transferRevenue)}</Text>
                        <Text className="text-xs text-gray-500">{transferTransactions} transaksi</Text>
                    </View>
                </View>
            </View>
        </>
    );
}