import { TouchableOpacity, View, Text } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

export default function AllTransactionCard({ item, layout, onPress, formatIDR, formatDateTime, getStatusColor, getPaymentMethodIcon, getPaymentStatusStyles }: AllTransactionCardProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${layout === 'grid' ? 'mb-3' : 'mb-3 mx-4'}`}
            style={layout === 'grid' ? { flex: 1, marginHorizontal: 6 } : undefined}
            activeOpacity={0.85}
        >
            <View className="flex-row justify-between items-start mb-2">
                <View className="flex-1">
                    <Text className="text-sm font-semibold text-gray-800 mb-1">
                        {item.transaction_number}
                    </Text>
                    {item.customer_name && (
                        <Text className="text-xs text-gray-600 mb-1">
                            {item.customer_name}
                        </Text>
                    )}
                    <Text className="text-xs text-gray-500">
                        {formatDateTime(item.created_at)}
                    </Text>
                </View>
                <View className={`px-2 py-1 rounded ${getStatusColor(item.status)}`}>
                    <Text className="text-xs font-medium capitalize">
                        {item.status}
                    </Text>
                </View>
            </View>

            <View className="flex-row justify-between items-center mt-2 pt-2 border-t border-gray-100">
                <View className="flex-row items-center gap-2">
                    <Ionicons
                        name={getPaymentMethodIcon(item.payment_method) as any}
                        size={16}
                        color="#6b7280"
                    />
                    <Text className="text-xs text-gray-600 capitalize">
                        {item.payment_method}
                    </Text>
                    {(() => {
                        const s = getPaymentStatusStyles(item.payment_status as any);
                        return (
                            <View className={`px-2 py-0.5 rounded ${s.bg}`}>
                                <Text className={`text-[10px] font-semibold ${s.text}`}>{s.label}</Text>
                            </View>
                        );
                    })()}
                </View>
                <Text className="text-base font-bold text-gray-900">
                    {formatIDR(item.total)}
                </Text>
            </View>
        </TouchableOpacity>
    );
}


