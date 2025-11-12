import { useEffect, useState } from 'react'

import { Text, TouchableOpacity, View } from 'react-native'

import { Ionicons } from '@expo/vector-icons'

import BottomSheet from '@/helper/bottomsheets/BottomSheet'

export default function FilterBottomSheet({
    visible,
    categories,
    sizes,
    selectedCategoryId,
    selectedSizeId,
    onClose,
    onApply,
    onReset,
}: FilterBottomSheetProps) {
    const activeCategories = categories.filter(cat => cat.is_active)
    const activeSizes = sizes.filter(size => size.is_active)

    const [tempCategoryId, setTempCategoryId] = useState<number | null>(selectedCategoryId)
    const [tempSizeId, setTempSizeId] = useState<number | null>(selectedSizeId)

    useEffect(() => {
        if (visible) {
            setTempCategoryId(selectedCategoryId)
            setTempSizeId(selectedSizeId)
        }
    }, [visible, selectedCategoryId, selectedSizeId])

    const handleApply = () => {
        onApply(tempCategoryId, tempSizeId)
        onClose()
    }

    const handleReset = () => {
        setTempCategoryId(null)
        setTempSizeId(null)
        onReset()
        onClose()
    }

    return (
        <BottomSheet
            visible={visible}
            title="Filter Produk"
            onClose={onClose}
            maxHeightPercent={0.7}
        >
            {/* Category Section */}
            <View className="mb-6 px-4">
                <View className="flex-row items-center justify-between mb-3">
                    <Text className="text-base font-semibold text-secondary-500">
                        Kategori
                    </Text>
                    {tempCategoryId !== null && (
                        <TouchableOpacity
                            onPress={() => setTempCategoryId(null)}
                            className="px-2 py-1 rounded-lg"
                            style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)' }}
                        >
                            <Text className="text-xs text-red-400 font-medium">Reset</Text>
                        </TouchableOpacity>
                    )}
                </View>
                <View className="flex-row flex-wrap gap-2">
                    <TouchableOpacity
                        onPress={() => setTempCategoryId(null)}
                        className={`px-4 py-3 rounded-xl border ${tempCategoryId === null
                            ? 'bg-blue-500 border-blue-400'
                            : 'bg-white/10 border-white/20'
                            }`}
                        activeOpacity={0.8}
                    >
                        <Text
                            className={`text-sm font-medium ${tempCategoryId === null ? 'text-white' : 'text-secondary-500'
                                }`}
                        >
                            Semua
                        </Text>
                    </TouchableOpacity>
                    {activeCategories.map((category) => (
                        <TouchableOpacity
                            key={category.id}
                            onPress={() => setTempCategoryId(category.id)}
                            className={`px-4 py-3 rounded-xl border ${tempCategoryId === category.id
                                ? 'bg-blue-500 border-blue-400'
                                : 'bg-white/10 border-white/20'
                                }`}
                            activeOpacity={0.8}
                        >
                            <Text
                                className={`text-sm font-medium ${tempCategoryId === category.id ? 'text-white' : 'text-secondary-500'
                                    }`}
                            >
                                {category.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Size Section */}
            <View className="mb-6 px-4">
                <View className="flex-row items-center justify-between mb-3">
                    <Text className="text-base font-semibold text-secondary-500">
                        Ukuran
                    </Text>
                    {tempSizeId !== null && (
                        <TouchableOpacity
                            onPress={() => setTempSizeId(null)}
                            className="px-2 py-1 rounded-lg"
                            style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)' }}
                        >
                            <Text className="text-xs text-red-400 font-medium">Reset</Text>
                        </TouchableOpacity>
                    )}
                </View>
                <View className="flex-row flex-wrap gap-2">
                    <TouchableOpacity
                        onPress={() => setTempSizeId(null)}
                        className={`px-4 py-3 rounded-xl border ${tempSizeId === null
                            ? 'bg-blue-500 border-blue-400'
                            : 'bg-white/10 border-white/20'
                            }`}
                        activeOpacity={0.8}
                    >
                        <Text
                            className={`text-sm font-medium ${tempSizeId === null ? 'text-white' : 'text-secondary-500'
                                }`}
                        >
                            Semua
                        </Text>
                    </TouchableOpacity>
                    {activeSizes.map((size) => (
                        <TouchableOpacity
                            key={size.id}
                            onPress={() => setTempSizeId(size.id)}
                            className={`px-4 py-3 rounded-xl border ${tempSizeId === size.id
                                ? 'bg-blue-500 border-blue-400'
                                : 'bg-white/10 border-white/20'
                                }`}
                            activeOpacity={0.8}
                        >
                            <Text
                                className={`text-sm font-medium ${tempSizeId === size.id ? 'text-white' : 'text-secondary-500'
                                    }`}
                            >
                                {size.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Footer Actions */}
            <View className="flex-row gap-3 px-4 pt-4 border-t" style={{ borderTopColor: 'rgba(255, 255, 255, 0.1)' }}>
                <TouchableOpacity
                    onPress={handleReset}
                    className="flex-1 px-4 py-3 rounded-xl bg-red-600"
                    activeOpacity={0.8}
                >
                    <View className="flex-row items-center justify-center">
                        <Ionicons name="refresh-outline" size={18} color="white" />
                        <Text className="text-white font-semibold ml-2 text-center">Reset Filter</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleApply}
                    className="flex-1 px-4 py-3 rounded-xl bg-accent-primary"
                    activeOpacity={0.8}
                >
                    <View className="flex-row items-center justify-center">
                        <Ionicons name="checkmark" size={18} color="white" />
                        <Text className="text-white font-semibold ml-2 text-center">Terapkan</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </BottomSheet>
    )
}