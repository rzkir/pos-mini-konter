import { View, Text, Image } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

export default function AllProductsCard({ item, formatIDR }: AllProductsCardProps) {
    return (
        <View className="bg-white p-4 rounded-2xl mb-2 flex-row items-center justify-between">
            <View className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 items-center justify-center mr-3">
                {item.image_url ? (
                    <Image source={{ uri: item.image_url }} className="w-full h-full" resizeMode="cover" />
                ) : (
                    <Ionicons name="image-outline" size={20} color="#9CA3AF" />
                )}
            </View>
            <View className="flex-1 pr-2">
                <Text numberOfLines={1} className="text-base font-semibold text-gray-900">{item.name}</Text>
                <Text numberOfLines={1} className="text-xs text-gray-500">{item.barcode}</Text>
                <View className="mt-1 flex-row items-center gap-3">
                    <View className="flex-row items-center">
                        <Ionicons name="albums-outline" size={14} color="#6B7280" />
                        <Text className="ml-1 text-gray-600 text-xs">Stok: {item.stock}</Text>
                    </View>
                    <View className="flex-row items-center">
                        <Ionicons name="checkmark-circle-outline" size={14} color="#10B981" />
                        <Text className="ml-1 text-gray-600 text-xs">Terjual: {item.sold || 0}</Text>
                    </View>
                </View>
            </View>
            <Text className="text-sm font-bold text-gray-900">{formatIDR(item.price || 0)}</Text>
        </View>
    );
}