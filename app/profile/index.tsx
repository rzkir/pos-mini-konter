import { Ionicons } from '@expo/vector-icons'

import { router } from 'expo-router'

import { useState } from 'react'

import { Alert, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native'

import Toast from 'react-native-toast-message'

export default function Settings() {
    const [notificationsEnabled, setNotificationsEnabled] = useState(true)
    const [autoSyncEnabled, setAutoSyncEnabled] = useState(true)
    const [soundEnabled, setSoundEnabled] = useState(true)

    const handleBack = () => {
        router.back()
    }

    const handleClearCache = () => {
        Alert.alert(
            'Hapus Cache',
            'Apakah Anda yakin ingin menghapus cache aplikasi?',
            [
                { text: 'Batal', style: 'cancel' },
                {
                    text: 'Hapus',
                    style: 'destructive',
                    onPress: () => {
                        Toast.show({ type: 'success', text1: 'Cache berhasil dihapus' })
                    }
                }
            ]
        )
    }

    const handleResetSettings = () => {
        Alert.alert(
            'Reset Pengaturan',
            'Apakah Anda yakin ingin mengembalikan semua pengaturan ke default?',
            [
                { text: 'Batal', style: 'cancel' },
                {
                    text: 'Reset',
                    style: 'destructive',
                    onPress: () => {
                        setNotificationsEnabled(true)
                        setAutoSyncEnabled(true)
                        setSoundEnabled(true)
                        Toast.show({ type: 'success', text1: 'Pengaturan berhasil direset' })
                    }
                }
            ]
        )
    }

    const handleAboutApp = () => {
        Alert.alert(
            'Tentang Aplikasi',
            'POS Mobile v1.0.0\n\nAplikasi Point of Sale untuk bisnis Anda.\n\n© 2024 POS Mobile',
            [{ text: 'OK' }]
        )
    }

    const handlePrivacyPolicy = () => {
        Toast.show({ type: 'info', text1: 'Kebijakan Privasi akan segera tersedia' })
    }

    const handleTermsOfService = () => {
        Toast.show({ type: 'info', text1: 'Syarat Layanan akan segera tersedia' })
    }

    return (
        <View className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="bg-white px-4 py-3 border-b border-gray-200">
                <View className="flex-row items-center justify-between">
                    <TouchableOpacity onPress={handleBack} className="p-2">
                        <Ionicons name="arrow-back" size={24} color="#374151" />
                    </TouchableOpacity>
                    <Text className="text-lg font-semibold text-gray-900">Pengaturan</Text>
                    <View className="w-10" />
                </View>
            </View>

            <ScrollView className="flex-1">
                <View className="px-4 mt-4 mb-2">
                    <TouchableOpacity
                        className="flex-row items-center bg-blue-600 rounded-2xl p-4 shadow-lg"
                        onPress={() => router.push('/profile/printer')}
                    >
                        <Ionicons name="print" size={24} color="white" style={{ marginRight: 16 }} />
                        <Text className="text-white text-lg font-bold flex-1">Pengaturan Printer</Text>
                        <Ionicons name="chevron-forward" size={20} color="white" />
                    </TouchableOpacity>
                </View>
                {/* General Settings */}
                <View className="bg-white mt-4 mx-4 rounded-lg shadow-sm">
                    <Text className="text-lg font-semibold text-gray-900 px-4 py-3 border-b border-gray-100">
                        Pengaturan Umum
                    </Text>

                    <View className="px-4 py-3">
                        <View className="flex-row items-center justify-between py-3">
                            <View className="flex-1">
                                <Text className="text-base font-medium text-gray-900">Notifikasi</Text>
                                <Text className="text-sm text-gray-500">Terima notifikasi dari aplikasi</Text>
                            </View>
                            <Switch
                                value={notificationsEnabled}
                                onValueChange={setNotificationsEnabled}
                                trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
                                thumbColor={notificationsEnabled ? '#FFFFFF' : '#F3F4F6'}
                            />
                        </View>

                        <View className="flex-row items-center justify-between py-3 border-t border-gray-100">
                            <View className="flex-1">
                                <Text className="text-base font-medium text-gray-900">Sinkronisasi Otomatis</Text>
                                <Text className="text-sm text-gray-500">Sinkronisasi data secara otomatis</Text>
                            </View>
                            <Switch
                                value={autoSyncEnabled}
                                onValueChange={setAutoSyncEnabled}
                                trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
                                thumbColor={autoSyncEnabled ? '#FFFFFF' : '#F3F4F6'}
                            />
                        </View>
                    </View>
                </View>

                {/* Sound & Vibration Settings */}
                <View className="bg-white mt-4 mx-4 rounded-lg shadow-sm">
                    <Text className="text-lg font-semibold text-gray-900 px-4 py-3 border-b border-gray-100">
                        Suara & Getaran
                    </Text>

                    <View className="px-4 py-3">
                        <View className="flex-row items-center justify-between py-3">
                            <View className="flex-1">
                                <Text className="text-base font-medium text-gray-900">Suara</Text>
                                <Text className="text-sm text-gray-500">Aktifkan suara notifikasi</Text>
                            </View>
                            <Switch
                                value={soundEnabled}
                                onValueChange={setSoundEnabled}
                                trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
                                thumbColor={soundEnabled ? '#FFFFFF' : '#F3F4F6'}
                            />
                        </View>
                    </View>
                </View>

                {/* Other Data Management */}
                <View className="bg-white mt-4 mx-4 rounded-lg shadow-sm">
                    <Text className="text-lg font-semibold text-gray-900 px-4 py-3 border-b border-gray-100">
                        Manajemen Data
                    </Text>

                    <View className="px-4">
                        <TouchableOpacity
                            onPress={handleClearCache}
                            className="flex-row items-center justify-between py-4"
                        >
                            <View className="flex-row items-center">
                                <Ionicons name="trash-outline" size={20} color="#EF4444" />
                                <Text className="text-base font-medium text-gray-900 ml-3">Hapus Cache</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* App Information */}
                <View className="bg-white mt-4 mx-4 rounded-lg shadow-sm">
                    <Text className="text-lg font-semibold text-gray-900 px-4 py-3 border-b border-gray-100">
                        Informasi Aplikasi
                    </Text>

                    <View className="px-4">
                        <TouchableOpacity
                            onPress={handleAboutApp}
                            className="flex-row items-center justify-between py-4 border-b border-gray-100"
                        >
                            <View className="flex-row items-center">
                                <Ionicons name="information-circle-outline" size={20} color="#6B7280" />
                                <Text className="text-base font-medium text-gray-900 ml-3">Tentang Aplikasi</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handlePrivacyPolicy}
                            className="flex-row items-center justify-between py-4 border-b border-gray-100"
                        >
                            <View className="flex-row items-center">
                                <Ionicons name="shield-checkmark-outline" size={20} color="#6B7280" />
                                <Text className="text-base font-medium text-gray-900 ml-3">Kebijakan Privasi</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleTermsOfService}
                            className="flex-row items-center justify-between py-4"
                        >
                            <View className="flex-row items-center">
                                <Ionicons name="document-text-outline" size={20} color="#6B7280" />
                                <Text className="text-base font-medium text-gray-900 ml-3">Syarat Layanan</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Reset Settings */}
                <View className="bg-white mt-4 mx-4 rounded-lg shadow-sm">
                    <TouchableOpacity
                        onPress={handleResetSettings}
                        className="flex-row items-center justify-center py-4"
                    >
                        <Ionicons name="refresh-outline" size={20} color="#EF4444" />
                        <Text className="text-base font-medium text-red-600 ml-2">Reset Pengaturan</Text>
                    </TouchableOpacity>
                </View>

                {/* Version Info */}
                <View className="px-4 py-6">
                    <Text className="text-center text-sm text-gray-500">
                        POS Mobile v1.0.0
                    </Text>
                    <Text className="text-center text-xs text-gray-400 mt-1">
                        © 2024 POS Mobile. All rights reserved.
                    </Text>
                </View>
            </ScrollView>
        </View>
    )
}