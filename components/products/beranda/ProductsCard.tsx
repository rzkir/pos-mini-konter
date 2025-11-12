import { View, Text, Image, TouchableOpacity } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

export function ProductsCard({
    item,
    qty,
    addQty,
    subQty,
    formatIDR,
}: TopSellerCardProps) {
    return (
        <View className="px-1 mr-3" style={{ width: 200 }}>
            <View className="bg-white rounded-2xl flex-col gap-1.5 p-3 border border-border">
                <View className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 items-center justify-center">
                    {item.image_url ? (
                        <Image
                            source={{ uri: item.image_url }}
                            className="w-full h-full"
                            resizeMode="cover"
                        />
                    ) : (
                        <Ionicons name="image-outline" size={28} className="text-gray-400" />
                    )}
                </View>

                <View className="mt-1 flex-row items-center">
                    <View className="w-1.5 h-1.5 rounded-full bg-accent-primary mr-1" />
                    <Text className="text-[11px] text-accent-primary font-semibold">
                        {item.stock ?? 0} Stok
                    </Text>
                </View>

                <Text numberOfLines={1} className="text-lg font-semibold text-text-secondary">
                    {item.name}
                </Text>

                <View className="flex-row items-center justify-between">
                    <Text className="text-base font-bold text-text-primary">
                        {formatIDR(item.price || 0)}
                    </Text>
                    {qty === 0 ? (
                        <TouchableOpacity
                            onPress={() => addQty(item.id)}
                            className="w-10 h-10 rounded-full bg-emerald-500 items-center justify-center"
                        >
                            <Ionicons name="add" size={18} color={'white'} />
                        </TouchableOpacity>
                    ) : (
                        <View className="flex-row items-center">
                            <TouchableOpacity
                                onPress={() => subQty(item.id)}
                                className="w-10 h-10 rounded-full bg-emerald-500 items-center justify-center"
                            >
                                <Ionicons name="remove" size={18} color={'white'} />
                            </TouchableOpacity>

                            <Text className="mx-2 text-sm font-semibold text-gray-900">{qty}</Text>

                            <TouchableOpacity
                                onPress={() => addQty(item.id)}
                                className="w-10 h-10 rounded-full bg-emerald-500 items-center justify-center"
                            >
                                <Ionicons name="add" size={18} color={'white'} />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
}