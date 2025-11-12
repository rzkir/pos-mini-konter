import { router } from 'expo-router'

import { ScrollView, Text, TouchableOpacity, View } from 'react-native'

import { Ionicons } from '@expo/vector-icons'

import HeaderGradient from '@/components/ui/HeaderGradient';

import { LinearGradient } from 'expo-linear-gradient';

export default function Backup() {
    const handleExportData = () => {
        router.push('/profile/export')
    }

    const handleImportData = () => {
        router.push('/profile/import')
    }

    return (
        <View className="flex-1 bg-background">
            <HeaderGradient
                colors={['#FF9228', '#FF9228']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                title={'Backup'}
                icon="B"
            >
                <View className="flex-row justify-between items-center w-full">
                    <View className="flex-1">
                        <Text className="text-xl font-bold text-white mb-1">Backup</Text>
                        <Text className="text-white/80 text-md">Backup data aplikasi</Text>
                    </View>

                    <TouchableOpacity
                        className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={20} color="white" />
                    </TouchableOpacity>
                </View>
            </HeaderGradient>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View className="px-4 mt-4">
                    <View className="flex-col gap-4">
                        {/* Export Data */}
                        <TouchableOpacity
                            onPress={handleExportData}
                            className="bg-card rounded-2xl overflow-hidden border border-border"
                        >
                            <View className="flex-row items-center p-6">
                                <LinearGradient
                                    colors={['#3b82f6', '#1d4ed8']}
                                    className="w-14 h-14 rounded-2xl items-center justify-center mr-4"
                                >
                                    <Ionicons name="download" size={28} color="white" />
                                </LinearGradient>
                                <View className="flex-1">
                                    <Text className="text-lg font-bold text-text-primary mb-1">Export Data</Text>
                                    <Text className="text-text-secondary">Ekspor semua data ke file JSON</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                            </View>
                        </TouchableOpacity>
                        {/* Import Data */}
                        <TouchableOpacity
                            onPress={handleImportData}
                            className="bg-card rounded-2xl overflow-hidden border border-border"
                        >
                            <View className="flex-row items-center p-6">
                                <LinearGradient
                                    colors={['#10b981', '#059669']}
                                    className="w-14 h-14 rounded-2xl items-center justify-center mr-4"
                                >
                                    <Ionicons name="cloud-upload" size={28} color="white" />
                                </LinearGradient>
                                <View className="flex-1">
                                    <Text className="text-lg font-bold text-text-primary mb-1">Import Data</Text>
                                    <Text className="text-text-secondary">Impor data dari file JSON</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}