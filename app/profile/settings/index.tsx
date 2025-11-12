import { View, Text, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native'

import { router } from 'expo-router'

import { Ionicons } from '@expo/vector-icons'

import Toast from 'react-native-toast-message'

import HeaderGradient from '@/components/ui/HeaderGradient'

import { usePushNotifications } from '@/hooks/usePushNotifications'

import { useAppSettings } from '@/hooks/useAppSettings'

export default function Settings() {
    const {
        settings,
        notificationPermission,
        loading: notificationsLoading,
        updatePushEnabled,
        updateSoundEnabled,
        updateLowStockAlerts,
        updateSelectedSound,
        registerForPushNotifications,
    } = usePushNotifications()

    const {
        settings: appSettings,
        loading: appSettingsLoading,
        updateDateFormat,
        updateDecimalPlaces,
    } = useAppSettings()

    const handlePushNotificationsChange = async (enabled: boolean) => {
        try {
            // Jika mengaktifkan dan izin belum diberikan, minta izin terlebih dahulu
            if (enabled && !notificationPermission) {
                const result = await registerForPushNotifications()

                if (!result) {
                    Toast.show({
                        type: 'error',
                        text1: 'Izin Ditolak',
                        text2: 'Notifikasi memerlukan izin untuk berfungsi. Silakan aktifkan di pengaturan perangkat.'
                    })
                    return
                }
            }

            await updatePushEnabled(enabled)
            Toast.show({
                type: enabled ? 'success' : 'info',
                text1: enabled ? 'Push Notifications Diaktifkan' : 'Push Notifications Dinonaktifkan',
                text2: enabled
                    ? 'Anda akan menerima notifikasi dari aplikasi'
                    : 'Notifikasi telah dinonaktifkan'
            })
        } catch (error) {
            console.error('Error updating push notifications:', error)
            Toast.show({
                type: 'error',
                text1: 'Gagal',
                text2: 'Gagal mengubah pengaturan push notifications'
            })
        }
    }

    const handleLowStockAlertsChange = async (enabled: boolean) => {
        try {
            await updateLowStockAlerts(enabled)
            Toast.show({
                type: 'success',
                text1: enabled ? 'Alert Stok Rendah Diaktifkan' : 'Alert Stok Rendah Dinonaktifkan'
            })
        } catch {
            Toast.show({
                type: 'error',
                text1: 'Gagal',
                text2: 'Gagal mengubah pengaturan alert stok rendah'
            })
        }
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
                    onPress: async () => {
                        try {
                            await updatePushEnabled(true)
                            await updateSoundEnabled(true)
                            await updateLowStockAlerts(true)
                            await updateSelectedSound('default')
                            await updateDateFormat('DD/MM/YYYY')
                            await updateDecimalPlaces(2)

                            Toast.show({
                                type: 'success',
                                text1: 'Pengaturan Direset',
                                text2: 'Semua pengaturan telah dikembalikan ke default'
                            })
                        } catch {
                            Toast.show({
                                type: 'error',
                                text1: 'Gagal',
                                text2: 'Gagal mereset pengaturan'
                            })
                        }
                    }
                }
            ]
        )
    }

    const handleDateFormatChange = () => {
        Alert.alert(
            'Format Tanggal',
            'Pilih format tanggal:',
            [
                {
                    text: 'DD/MM/YYYY',
                    onPress: async () => {
                        await updateDateFormat('DD/MM/YYYY')
                        Toast.show({
                            type: 'success',
                            text1: 'Format Tanggal Diubah',
                            text2: 'Format tanggal telah diubah menjadi DD/MM/YYYY'
                        })
                    }
                },
                {
                    text: 'MM/DD/YYYY',
                    onPress: async () => {
                        await updateDateFormat('MM/DD/YYYY')
                        Toast.show({
                            type: 'success',
                            text1: 'Format Tanggal Diubah',
                            text2: 'Format tanggal telah diubah menjadi MM/DD/YYYY'
                        })
                    }
                },
                {
                    text: 'YYYY-MM-DD',
                    onPress: async () => {
                        await updateDateFormat('YYYY-MM-DD')
                        Toast.show({
                            type: 'success',
                            text1: 'Format Tanggal Diubah',
                            text2: 'Format tanggal telah diubah menjadi YYYY-MM-DD'
                        })
                    }
                },
                { text: 'Batal', style: 'cancel' }
            ]
        )
    }

    const handleDecimalPlacesChange = async (increment: boolean) => {
        const newValue = increment
            ? Math.min(4, appSettings.decimalPlaces + 1)
            : Math.max(0, appSettings.decimalPlaces - 1)

        await updateDecimalPlaces(newValue)
        Toast.show({
            type: 'success',
            text1: 'Desimal Harga Diubah',
            text2: `Desimal harga diubah menjadi ${newValue} angka di belakang koma`
        })
    }

    return (
        <View className="flex-1 bg-gray-50">
            {/* Header */}
            <HeaderGradient
                colors={['#FF9228', '#FF9228']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                title="Pengaturan Aplikasi"
                icon="P"
            >
                <View className="flex-row justify-between items-center">
                    <View className="flex-1">
                        <Text className="text-2xl font-bold text-white mb-2">
                            Pengaturan Aplikasi
                        </Text>
                        <Text className="text-white/80 text-base">
                            Konfigurasi notifikasi dan preferensi
                        </Text>
                    </View>
                    <TouchableOpacity
                        className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={20} color="white" />
                    </TouchableOpacity>
                </View>
            </HeaderGradient>

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
            >
                <View className="px-4 mt-4 mb-4">
                    <Text className="text-lg font-semibold text-gray-900 mb-4">Pengaturan Notifikasi</Text>
                    <View className="flex-col gap-4">
                        {/* Push Notifications */}
                        <View className="bg-white rounded-2xl border border-border">
                            <View className="flex-row items-center justify-between p-4">
                                <View className="flex-row items-center flex-1">
                                    <View className="w-12 h-12 rounded-2xl items-center justify-center mr-4">
                                        <Ionicons name="notifications" size={24} color="#FF9228" />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-lg font-bold text-gray-900 mb-1">Push Notifications</Text>
                                        <Text className="text-gray-600">
                                            {notificationPermission
                                                ? 'Terima notifikasi push dari aplikasi'
                                                : 'Izin notifikasi belum diberikan'}
                                        </Text>
                                    </View>
                                </View>
                                <Switch
                                    value={settings.pushEnabled && notificationPermission}
                                    onValueChange={handlePushNotificationsChange}
                                    trackColor={{ false: '#e5e7eb', true: '#3b82f6' }}
                                    thumbColor={settings.pushEnabled && notificationPermission ? '#ffffff' : '#f3f4f6'}
                                    disabled={notificationsLoading}
                                />
                            </View>
                        </View>

                        {/* Sound Settings */}
                        <View className="bg-white rounded-2xl border border-border">
                            <View className="flex-row items-center justify-between p-4">
                                <View className="flex-row items-center flex-1">
                                    <View className="w-12 h-12 rounded-2xl items-center justify-center mr-4">
                                        <Ionicons name="volume-high" size={24} color="#FF9228" />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-lg font-bold text-gray-900 mb-1">Suara Notifikasi</Text>
                                        <Text className="text-gray-600">Aktifkan suara untuk notifikasi</Text>
                                    </View>
                                </View>
                                <Switch
                                    value={settings.soundEnabled}
                                    onValueChange={updateSoundEnabled}
                                    trackColor={{ false: '#e5e7eb', true: '#f59e0b' }}
                                    thumbColor={settings.soundEnabled ? '#ffffff' : '#f3f4f6'}
                                    disabled={notificationsLoading}
                                />
                            </View>
                        </View>

                        {/* Low Stock Alerts */}
                        <View className="bg-white rounded-2xl border border-border">
                            <View className="flex-row items-center justify-between p-4">
                                <View className="flex-row items-center flex-1">
                                    <View className="w-12 h-12 rounded-2xl items-center justify-center mr-4">
                                        <Ionicons name="warning" size={24} color="#FF9228" />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-lg font-bold text-gray-900 mb-1">Alert Stok Rendah</Text>
                                        <Text className="text-gray-600">Notifikasi ketika stok produk rendah</Text>
                                    </View>
                                </View>
                                <Switch
                                    value={settings.lowStockAlerts}
                                    onValueChange={handleLowStockAlertsChange}
                                    trackColor={{ false: '#e5e7eb', true: '#f97316' }}
                                    thumbColor={settings.lowStockAlerts ? '#ffffff' : '#f3f4f6'}
                                    disabled={notificationsLoading}
                                />
                            </View>
                        </View>
                    </View>
                </View>

                {/* App Preferences */}
                <View className="px-4 mb-4">
                    <Text className="text-lg font-semibold text-gray-900 mb-4">Preferensi Aplikasi</Text>

                    <View className="flex-col gap-4">
                        {/* Date Format */}
                        <TouchableOpacity
                            onPress={handleDateFormatChange}
                            className="bg-white rounded-2xl border border-border"
                        >
                            <View className="flex-row items-center p-4">
                                <View className="w-12 h-12 rounded-2xl items-center justify-center mr-4">
                                    <Ionicons name="calendar" size={24} color="#FF9228" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-lg font-bold text-gray-900 mb-1">Format Tanggal</Text>
                                    <Text className="text-gray-600">{appSettings.dateFormat}</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                            </View>
                        </TouchableOpacity>

                        {/* Decimal Places */}
                        <View className="bg-white rounded-2xl border border-border">
                            <View className="flex-row items-center justify-between p-4">
                                <View className="flex-row items-center flex-1">
                                    <View className="w-12 h-12 rounded-2xl items-center justify-center mr-4">
                                        <Ionicons name="calculator" size={24} color="#FF9228" />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-lg font-bold text-gray-900 mb-1">Desimal Harga</Text>
                                        <Text className="text-gray-600">{appSettings.decimalPlaces} angka di belakang koma</Text>
                                    </View>
                                </View>
                                <View className="flex-row items-center">
                                    <TouchableOpacity
                                        onPress={() => handleDecimalPlacesChange(false)}
                                        disabled={appSettingsLoading || appSettings.decimalPlaces === 0}
                                        className={`w-8 h-8 rounded-full items-center justify-center mr-2 ${appSettingsLoading || appSettings.decimalPlaces === 0
                                            ? 'bg-gray-100'
                                            : 'bg-gray-200'
                                            }`}
                                    >
                                        <Ionicons
                                            name="remove"
                                            size={16}
                                            color={appSettingsLoading || appSettings.decimalPlaces === 0 ? "#9ca3af" : "#6b7280"}
                                        />
                                    </TouchableOpacity>
                                    <Text className="text-lg font-bold text-gray-900 mx-3">{appSettings.decimalPlaces}</Text>
                                    <TouchableOpacity
                                        onPress={() => handleDecimalPlacesChange(true)}
                                        disabled={appSettingsLoading || appSettings.decimalPlaces === 4}
                                        className={`w-8 h-8 rounded-full items-center justify-center ml-2 ${appSettingsLoading || appSettings.decimalPlaces === 4
                                            ? 'bg-gray-100'
                                            : 'bg-gray-200'
                                            }`}
                                    >
                                        <Ionicons
                                            name="add"
                                            size={16}
                                            color={appSettingsLoading || appSettings.decimalPlaces === 4 ? "#9ca3af" : "#6b7280"}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Action Buttons */}
                <View className="px-4">
                    <View className="flex-col gap-4">
                        {/* Reset Settings */}
                        <TouchableOpacity
                            onPress={handleResetSettings}
                            className="bg-red-600 rounded-2xl border border-border">
                            <View className="flex-row items-center justify-center p-4">
                                <View className="flex-row items-center justify-center">
                                    <View className="w-12 h-12 bg-white rounded-2xl items-center justify-center mr-4">
                                        <Ionicons name="refresh" size={24} color="black" />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-white text-lg font-bold mb-1">Reset Pengaturan</Text>
                                        <Text className="text-red-100 text-sm">Kembalikan semua pengaturan ke default</Text>
                                    </View>
                                    <Ionicons name="arrow-forward" size={20} color="white" />
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}