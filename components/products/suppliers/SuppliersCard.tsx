import { Ionicons } from '@expo/vector-icons'

import { Text, TouchableOpacity, View } from 'react-native'

type SuppliersCardProps = {
    item: any
    onEdit: (supplier: any) => void
    onDelete: (supplier: any) => void
}

export default function SuppliersCard({ item, onEdit, onDelete }: SuppliersCardProps) {
    return (
        <View className="bg-white dark:bg-neutral-900 p-4 mb-4 rounded-xl border border-gray-100 dark:border-neutral-800 shadow-sm">
            <View className="flex-row">
                <View className="w-10 h-10 rounded-full bg-blue-50 dark:bg-neutral-800 items-center justify-center mr-3 mt-1">
                    <Ionicons name="business-outline" size={18} color="#3B82F6" />
                </View>
                <View className="flex-1">
                    <View className="flex-row items-start justify-between">
                        <Text className="text-base font-semibold text-gray-900 dark:text-gray-100 pr-3" numberOfLines={2}>
                            {item.name}
                        </Text>
                        <View className={`${item.is_active ? 'bg-emerald-100' : 'bg-rose-100'} px-2 py-1 rounded-full`}>
                            <Text className={`${item.is_active ? 'text-emerald-700' : 'text-rose-700'} text-[10px] font-semibold`}>
                                {item.is_active ? 'Aktif' : 'Tidak Aktif'}
                            </Text>
                        </View>
                    </View>

                    <View className="mt-2 flex-col gap-2">
                        <View className="flex-row items-center">
                            <Ionicons name="person-outline" size={14} color="#6B7280" />
                            <Text className="text-sm text-gray-600 dark:text-gray-300 ml-2" numberOfLines={1}>
                                {item.contact_person || '-'}
                            </Text>
                        </View>
                        <View className="flex-row items-center">
                            <Ionicons name="call-outline" size={14} color="#6B7280" />
                            <Text className="text-sm text-gray-600 dark:text-gray-300 ml-2" numberOfLines={1}>
                                {item.phone || '-'}
                            </Text>
                        </View>
                        {item.email ? (
                            <View className="flex-row items-center">
                                <Ionicons name="mail-outline" size={14} color="#6B7280" />
                                <Text className="text-sm text-gray-600 dark:text-gray-300 ml-2" numberOfLines={1}>
                                    {item.email}
                                </Text>
                            </View>
                        ) : null}
                        {item.address ? (
                            <View className="flex-row items-start">
                                <Ionicons name="location-outline" size={14} color="#6B7280" style={{ marginTop: 2 }} />
                                <Text className="text-sm text-gray-600 dark:text-gray-300 ml-2" numberOfLines={2}>
                                    {item.address}
                                </Text>
                            </View>
                        ) : null}
                    </View>

                    <View className="flex-row items-center justify-between mt-3 pt-2 border-t border-gray-100 dark:border-neutral-800">
                        <Text className="text-xs text-gray-500 dark:text-gray-400">
                            Dibuat {new Date(item.created_at).toLocaleDateString()}
                        </Text>
                        <View className="flex-row">
                            <TouchableOpacity
                                onPress={() => onEdit(item)}
                                className="px-3 py-2 rounded-lg flex-row items-center mr-2 bg-blue-50 dark:bg-neutral-800"
                            >
                                <Ionicons name="create-outline" size={14} color="#2563EB" />
                                <Text className="text-xs text-blue-700 ml-1">Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => onDelete(item)}
                                className="px-3 py-2 rounded-lg flex-row items-center bg-rose-50 dark:bg-neutral-800"
                            >
                                <Ionicons name="trash-outline" size={14} color="#DC2626" />
                                <Text className="text-xs text-rose-700 ml-1">Hapus</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}