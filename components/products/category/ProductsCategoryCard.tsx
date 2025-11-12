import { Ionicons } from '@expo/vector-icons'

import { Text, TouchableOpacity, View } from 'react-native'

export default function ProductsCategoryCard({ item, formatDate, onEdit, onDelete }: ProductsCategoryCardProps) {
    return (
        <View className="bg-white rounded-xl border border-gray-200 p-4 mx-2 mb-3 shadow-sm flex-1">
            <View className="flex-row justify-between items-start mb-3">
                <Text className="text-gray-900 font-semibold flex-1 mr-2" numberOfLines={2}>
                    {item.name}
                </Text>
                <View className={`${item.is_active ? 'bg-emerald-100 border-emerald-200' : 'bg-rose-100 border-rose-200'} px-2 py-0.5 rounded-full border`}>
                    <Text className={`text-[10px] font-semibold text-center ${item.is_active ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {item.is_active ? 'Aktif' : 'Tidak'}
                    </Text>
                </View>
            </View>
            <Text className="text-gray-500 text-xs mb-3">{formatDate(item.created_at)}</Text>
            <View className="flex-row justify-end">
                <TouchableOpacity
                    onPress={() => onEdit(item)}
                    className="bg-blue-500/90 px-3 py-2 rounded-md mr-2"
                    accessibilityLabel="Edit kategori"
                >
                    <Ionicons name="create-outline" size={16} color="#ffffff" />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => onDelete(item)}
                    className="bg-red-500/90 px-3 py-2 rounded-md"
                    accessibilityLabel="Hapus kategori"
                >
                    <Ionicons name="trash-outline" size={16} color="#ffffff" />
                </TouchableOpacity>
            </View>
        </View>
    )
}