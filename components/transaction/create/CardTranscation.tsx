import { View, Text, TouchableOpacity, Image } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

export default function CardTransaction({ item, formatIDR, onUpdateQty }: CardTransactionProps) {
    const product = item.product;
    const basePrice = item.price;
    const discount = (product?.discount ?? item.discount ?? 0);
    const discountValue = Number(discount) || 0;
    const discountAmount = (basePrice * discountValue) / 100;
    const discountedPrice = basePrice - discountAmount;
    const hasDiscount = discountValue > 0;

    return (
        <View className="bg-white rounded-2xl p-4 mb-3 border border-gray-200">
            <View className="flex-row items-center">
                {/* Circular Image */}
                <View className="mr-3">
                    {product?.image_url ? (
                        <Image
                            source={{ uri: product.image_url }}
                            className="w-16 h-16 rounded-full"
                            resizeMode="cover"
                        />
                    ) : (
                        <View className="w-16 h-16 rounded-full bg-gray-100 items-center justify-center">
                            <Ionicons name="image-outline" size={24} color="#9CA3AF" />
                        </View>
                    )}
                </View>

                {/* Item Info */}
                <View className="flex-1">
                    <Text className="text-base font-semibold text-gray-900 mb-1" numberOfLines={1}>
                        {product?.name || 'Produk tidak ditemukan'}
                    </Text>
                    {hasDiscount ? (
                        <View className="mb-1">
                            <View className="flex-row items-center gap-2">
                                <Text className="text-xs line-through text-gray-400">{formatIDR(basePrice)}</Text>
                                <Text className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded">
                                    -{discountValue}%
                                </Text>
                            </View>
                            <Text className="text-sm font-bold text-blue-600">{formatIDR(discountedPrice)}</Text>
                        </View>
                    ) : (
                        <Text className="text-sm font-bold text-blue-600 mb-1">{formatIDR(basePrice)}</Text>
                    )}
                </View>

                {/* Quantity Selector */}
                <View className="flex-row items-center gap-3">
                    <TouchableOpacity
                        onPress={() => onUpdateQty(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-lg border border-gray-300 bg-gray-50 items-center justify-center"
                    >
                        <View className="w-3 h-0.5 bg-gray-700 rounded" />
                    </TouchableOpacity>
                    <Text className="text-base font-semibold text-gray-900 min-w-[24px] text-center">{item.quantity}</Text>
                    <TouchableOpacity
                        onPress={() => onUpdateQty(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-lg border border-gray-300 bg-gray-50 items-center justify-center"
                    >
                        <Ionicons name="add" size={16} color="#374151" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

