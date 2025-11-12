import { router } from 'expo-router'

import { useStateExport } from '@/components/profile/backup/useStateExport'

import { ScrollView, Text, TouchableOpacity, View, Platform } from 'react-native'

import { Ionicons } from '@expo/vector-icons'

import { LinearGradient } from 'expo-linear-gradient'

import HeaderGradient from '@/components/ui/HeaderGradient'

export default function ExportData() {
    const { isExporting, handleExportData } = useStateExport()

    return (
        <View className="flex-1 bg-background">
            <ScrollView showsVerticalScrollIndicator={false}>
                <HeaderGradient
                    colors={['#FF9228', '#FF9228']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    title="Export Data"
                    icon="📂"
                >
                    <View className="flex-row justify-between items-center">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="w-10 h-10 rounded-full bg-white/20 items-center justify-center mr-4"
                        >
                            <Ionicons name="arrow-back" size={24} color="white" />
                        </TouchableOpacity>

                        <View className="flex-1">
                            <Text className="text-xl font-bold text-white mb-2">
                                Export Data
                            </Text>
                            <Text className="text-white/80 text-base">
                                Ekspor semua data ke file JSON
                            </Text>
                        </View>
                    </View>
                </HeaderGradient>

                <View className="px-4 mt-10">
                    <View className="bg-card rounded-2xl overflow-hidden mb-6"
                    >
                        <View className="p-4">
                            <View className="items-center mb-6">
                                <LinearGradient
                                    colors={['#3b82f6', '#1d4ed8']}
                                    className="w-20 h-20 rounded-full items-center justify-center mb-4 overflow-hidden"
                                >
                                    <Ionicons name="download" size={40} color="white" />
                                </LinearGradient>

                                <Text className="text-2xl font-bold text-gray-900 mb-2 text-center">
                                    Export Data
                                </Text>

                                <Text className="text-gray-600 text-center text-base">
                                    Ekspor semua data aplikasi ke file JSON untuk backup atau transfer ke perangkat lain
                                </Text>
                            </View>

                            <View className="flex-col gap-4 mb-6">
                                <View className="flex-row items-start">
                                    <Ionicons name="checkmark-circle" size={24} color="#10b981" className="mr-3 mt-1" />
                                    <View className="flex-1">
                                        <Text className="text-base font-semibold text-gray-900 mb-1">Data Lengkap</Text>
                                        <Text className="text-gray-600 text-sm">Semua data termasuk produk, transaksi, dan pengaturan akan diekspor</Text>
                                    </View>
                                </View>

                                <View className="flex-row items-start">
                                    <Ionicons name="checkmark-circle" size={24} color="#10b981" className="mr-3 mt-1" />
                                    <View className="flex-1">
                                        <Text className="text-base font-semibold text-gray-900 mb-1">Format JSON</Text>
                                        <Text className="text-gray-600 text-sm">File akan disimpan dalam format JSON yang mudah dibaca dan dibuka</Text>
                                    </View>
                                </View>

                                <View className="flex-row items-start">
                                    <Ionicons name="checkmark-circle" size={24} color="#10b981" className="mr-3 mt-1" />
                                    <View className="flex-1">
                                        <Text className="text-base font-semibold text-gray-900 mb-1">Lokasi Penyimpanan</Text>
                                        <Text className="text-gray-600 text-sm">
                                            {Platform.OS === 'android'
                                                ? 'Gunakan menu Share dan pilih Google Drive'
                                                : 'Gunakan Share ke Files/Drive'}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <TouchableOpacity
                                onPress={handleExportData}
                                disabled={isExporting}
                                className={`rounded-2xl py-4 items-center ${isExporting ? 'bg-gray-300' : 'bg-blue-600'}`}
                                style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 }}
                            >
                                {isExporting ? (
                                    <Text className="text-white text-lg font-bold">Mengekspor Data...</Text>
                                ) : (
                                    <Text className="text-white text-lg font-bold">Bagikan / Simpan via Share</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

