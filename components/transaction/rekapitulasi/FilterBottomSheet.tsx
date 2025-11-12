import { Text, TouchableOpacity, View } from 'react-native'

import BottomSheet from '@/helper/bottomsheets/BottomSheet'

import { Ionicons } from '@expo/vector-icons'

export default function FilterBottomSheet({ visible, onClose, showCharts, setShowCharts }: Props) {
    return (
        <BottomSheet
            visible={visible}
            title="Opsi tampilan"
            onClose={onClose}
            maxHeightPercent={0.45}
        >
            <View className="mb-4 px-4">
                <Text className="text-xs text-secondary-500">Pilih cara menampilkan ringkasan agar mudah dibaca.</Text>
            </View>

            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                    setShowCharts(true)
                    onClose()
                }}
                className={`flex-row items-center justify-between ml-3 mr-3 rounded-2xl px-4 py-3 mb-3 border ${showCharts ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}`}
            >
                <View className="flex-row items-center gap-3">
                    <View className="w-8 h-8 rounded-full items-center justify-center" style={{ backgroundColor: showCharts ? '#3b82f615' : '#e5e7eb' }}>
                        <Ionicons name="pie-chart" size={18} color={showCharts ? '#3b82f6' : '#6c757d'} />
                    </View>
                    <View>
                        <Text className="text-gray-900 font-medium">Tampilkan semua sebagai chart</Text>
                        <Text className="text-xs text-secondary-500">Visual paling cepat dipahami</Text>
                    </View>
                </View>
                <Ionicons name={showCharts ? 'checkmark-circle' : 'ellipse-outline'} size={20} color={showCharts ? '#2563eb' : '#6c757d'} />
            </TouchableOpacity>

            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                    setShowCharts(false)
                    onClose()
                }}
                className={`flex-row items-center justify-between mr-3 ml-3 rounded-2xl px-4 py-3 border ${!showCharts ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}`}
            >
                <View className="flex-row items-center gap-3">
                    <View className="w-8 h-8 rounded-full items-center justify-center" style={{ backgroundColor: !showCharts ? '#3b82f615' : '#e5e7eb' }}>
                        <Ionicons name="reader" size={18} color={!showCharts ? '#3b82f6' : '#6c757d'} />
                    </View>
                    <View>
                        <Text className="text-gray-900 font-medium">Tampilkan ringkasan teks</Text>
                        <Text className="text-xs text-secondary-500">Detail angka yang ringkas</Text>
                    </View>
                </View>
                <Ionicons name={!showCharts ? 'checkmark-circle' : 'ellipse-outline'} size={20} color={!showCharts ? '#2563eb' : '#6c757d'} />
            </TouchableOpacity>
        </BottomSheet>
    )
}


