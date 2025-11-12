import { router } from 'expo-router'

import { ScrollView, Text, TouchableOpacity, View } from 'react-native'

import { Ionicons } from '@expo/vector-icons'

import { LinearGradient } from 'expo-linear-gradient'

import HeaderGradient from '@/components/ui/HeaderGradient';

import { useStateImport } from '@/components/profile/backup/useStateImport'

export default function ImportData() {
    const {
        isImporting,
        handleImportData,
        handleImportTxtFile,
    } = useStateImport()

    return (
        <View className="flex-1 bg-background">
            <ScrollView showsVerticalScrollIndicator={false}>
                <HeaderGradient
                    colors={['#FF9228', '#FF9228']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    title="Import Data"
                    icon="📂"
                >
                    <View className="flex-row justify-between items-center w-full">
                        <View className="flex-1">
                            <Text className="text-xl font-bold text-white mb-1">Import Data</Text>
                            <Text className="text-white/80 text-md">Impor data dari file JSON</Text>
                        </View>

                        <TouchableOpacity
                            className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
                            onPress={() => router.back()}
                        >
                            <Ionicons name="arrow-back" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                </HeaderGradient>

                <View className="px-4 mt-4">
                    <View className="bg-card rounded-2xl overflow-hidden mb-6">
                        <View className="p-8">
                            <View className="items-center mb-6">
                                <LinearGradient
                                    colors={['#10b981', '#059669']}
                                    className="w-20 h-20 rounded-full items-center justify-center mb-4 overflow-hidden"
                                >
                                    <Ionicons name="cloud-upload" size={40} color="white" />
                                </LinearGradient>
                                <Text className="text-2xl font-bold text-gray-900 mb-2 text-center">
                                    Import Data
                                </Text>
                                <Text className="text-gray-600 text-center text-base">
                                    Impor data aplikasi dari file JSON untuk restore backup atau transfer dari perangkat lain
                                </Text>
                            </View>

                            <View className="flex-col gap-2 mb-6">
                                <View className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4">
                                    <View className="flex-row items-start">
                                        <Ionicons name="warning" size={24} color="#ef4444" className="mr-3 mt-1" />
                                        <View className="flex-1">
                                            <Text className="text-base font-semibold text-red-900 mb-1">Peringatan!</Text>
                                            <Text className="text-red-700 text-sm">Data lama akan digantikan dengan data yang diimpor. Pastikan Anda telah melakukan backup sebelumnya.</Text>
                                        </View>
                                    </View>
                                </View>

                                <View className="flex-row items-start">
                                    <Ionicons name="information-circle" size={24} color="#3b82f6" className="mr-3 mt-1" />
                                    <View className="flex-1">
                                        <Text className="text-base font-semibold text-gray-900 mb-1">Pilih File</Text>
                                        <Text className="text-gray-600 text-sm">Pilih file JSON yang sebelumnya diekspor dari aplikasi</Text>
                                    </View>
                                </View>
                                <View className="flex-row items-start">
                                    <Ionicons name="information-circle" size={24} color="#3b82f6" className="mr-3 mt-1" />
                                    <View className="flex-1">
                                        <Text className="text-base font-semibold text-gray-900 mb-1">Format JSON</Text>
                                        <Text className="text-gray-600 text-sm">File harus dalam format JSON yang valid dari export aplikasi</Text>
                                    </View>
                                </View>
                                <View className="flex-row items-start">
                                    <Ionicons name="information-circle" size={24} color="#3b82f6" className="mr-3 mt-1" />
                                    <View className="flex-1">
                                        <Text className="text-base font-semibold text-gray-900 mb-1">Format File</Text>
                                        <Text className="text-gray-600 text-sm">File dapat berformat JSON atau TXT yang berisi data JSON</Text>
                                    </View>
                                </View>
                            </View>

                            <View className="flex-col gap-3">
                                <TouchableOpacity
                                    onPress={handleImportData}
                                    disabled={isImporting}
                                    className={`rounded-2xl py-4 items-center ${isImporting ? 'bg-gray-300' : 'bg-green-600'}`}
                                    style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 }}
                                >
                                    {isImporting ? (
                                        <Text className="text-white text-lg font-bold">Mengimpor Data...</Text>
                                    ) : (
                                        <Text className="text-white text-lg font-bold">Pilih File JSON untuk Import</Text>
                                    )}
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={handleImportTxtFile}
                                    disabled={isImporting}
                                    className={`rounded-2xl py-4 items-center ${isImporting ? 'bg-gray-300' : 'bg-blue-600'}`}
                                    style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 }}
                                >
                                    <Text className="text-white text-lg font-bold">Pilih File TXT untuk Import</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}