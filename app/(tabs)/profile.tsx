import { router } from 'expo-router'

import { useState, useCallback } from 'react'

import { ScrollView, Text, TouchableOpacity, View, Image, RefreshControl } from 'react-native'

import { Ionicons } from '@expo/vector-icons'

import { useCompanyProfile } from "@/hooks/useCompanyProfile";

import HeaderGradient from '@/components/ui/HeaderGradient';

import { LinearGradient } from 'expo-linear-gradient';

export default function Profil() {
    const { companyProfile, loadProfile } = useCompanyProfile();
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            await loadProfile();
        } finally {
            setRefreshing(false);
        }
    }, [loadProfile]);

    const handleEditProfile = () => {
        router.push('/profile/edit-profile')
    }

    const handleAppSettings = () => {
        router.push('/profile/settings')
    }

    const handleAbout = () => {
        router.push('/profile/about')
    }

    const handlePrinterSettings = () => {
        router.push('/profile/printer')
    }

    const handlePaymentCardSettings = () => {
        router.push('/profile/payment-card')
    }

    const handleBackup = () => {
        router.push('/profile/backup')
    }

    const handlePDFTest = () => {
        router.push('/profile/pdf')
    }

    return (
        <View className="flex-1 bg-background">
            <HeaderGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                title={companyProfile?.name || 'Profil'}
                icon="P"
            >
                <View className="flex-row items-center w-full">
                    <View className="flex-row items-center flex-1">
                        {companyProfile?.logo_url ? (
                            <Image
                                source={{ uri: companyProfile.logo_url }}
                                className="w-10 h-10 rounded-full mr-3"
                            />
                        ) : (
                            <View className="w-10 h-10 rounded-full bg-white/30 items-center justify-center mr-3">
                                <Text className="text-white font-bold">
                                    {companyProfile?.name?.[0]?.toUpperCase() || 'P'}
                                </Text>
                            </View>
                        )}

                        <View>
                            <Text className="text-white font-bold text-lg">
                                {companyProfile?.name || 'Profil'}
                            </Text>
                            <Text className="text-white/80 text-xs">
                                {companyProfile?.phone || 'Kelola informasi dan pengaturan akun'}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={handlePDFTest}
                        className="bg-white/20 rounded-xl px-4 py-2 flex-row items-center"
                    >
                        <Ionicons name="document-text" size={16} color="white" />
                        <Text className="text-white font-semibold text-sm ml-2">
                            Test Print PDF
                        </Text>
                    </TouchableOpacity>
                </View>
            </HeaderGradient>

            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {/* Management Sections */}
                <View className="px-4 mt-4">
                    <View className="flex-col gap-4">
                        {/* Edit Profile */}
                        <TouchableOpacity
                            onPress={handleEditProfile}
                            className="bg-card rounded-2xl overflow-hidden border border-border"
                        >
                            <View className="flex-row items-center p-6">
                                <LinearGradient
                                    colors={['#3b82f6', '#1d4ed8']}
                                    className="w-14 h-14 rounded-2xl items-center justify-center mr-4"
                                >
                                    <Ionicons name="create" size={28} color="white" />
                                </LinearGradient>
                                <View className="flex-1">
                                    <Text className="text-lg font-bold text-text-primary mb-1">Edit Profile Perusahaan</Text>
                                    <Text className="text-text-secondary">Ubah informasi perusahaan</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                            </View>
                        </TouchableOpacity>
                        {/* App Settings */}
                        <TouchableOpacity
                            onPress={handleAppSettings}
                            className="bg-card rounded-2xl overflow-hidden border border-border"
                        >
                            <View className="flex-row items-center p-6">
                                <LinearGradient
                                    colors={['#10b981', '#059669']}
                                    className="w-14 h-14 rounded-2xl items-center justify-center mr-4"
                                >
                                    <Ionicons name="settings" size={28} color="white" />
                                </LinearGradient>
                                <View className="flex-1">
                                    <Text className="text-lg font-bold text-text-primary mb-1">Pengaturan Aplikasi</Text>
                                    <Text className="text-text-secondary">Konfigurasi notifikasi dan preferensi</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                            </View>
                        </TouchableOpacity>
                        {/* Printer Settings */}
                        <TouchableOpacity
                            onPress={handlePrinterSettings}
                            className="bg-card rounded-2xl overflow-hidden border border-border"
                        >
                            <View className="flex-row items-center p-6">
                                <LinearGradient
                                    colors={['#8b5cf6', '#7c3aed']}
                                    className="w-14 h-14 rounded-2xl items-center justify-center mr-4"
                                >
                                    <Ionicons name="print" size={28} color="white" />
                                </LinearGradient>

                                <View className="flex-1">
                                    <Text className="text-lg font-bold text-text-primary mb-1">Pengaturan Printer</Text>
                                    <Text className="text-text-secondary">Konfigurasi printer untuk mencetak struk</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                            </View>
                        </TouchableOpacity>
                        {/* Payment Card Settings */}
                        <TouchableOpacity
                            onPress={handlePaymentCardSettings}
                            className="bg-card rounded-2xl overflow-hidden border border-border"
                        >
                            <View className="flex-row items-center p-6">
                                <LinearGradient
                                    colors={['#8b5cf6', '#7c3aed']}
                                    className="w-14 h-14 rounded-2xl items-center justify-center mr-4"
                                >
                                    <Ionicons name="card" size={28} color="white" />
                                </LinearGradient>

                                <View className="flex-1">
                                    <Text className="text-lg font-bold text-text-primary mb-1">Pengaturan Kartu Pembayaran</Text>
                                    <Text className="text-text-secondary">Konfigurasi kartu pembayaran untuk pembayaran</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                            </View>
                        </TouchableOpacity>
                        {/* Backup (Import & Export) */}
                        <TouchableOpacity
                            onPress={handleBackup}
                            className="bg-card rounded-2xl overflow-hidden border border-border"
                        >
                            <View className="flex-row items-center p-6">
                                <LinearGradient
                                    colors={['#f59e0b', '#d97706']}
                                    className="w-14 h-14 rounded-2xl items-center justify-center mr-4"
                                >
                                    <Ionicons name="cloud" size={28} color="white" />
                                </LinearGradient>
                                <View className="flex-1">
                                    <Text className="text-lg font-bold text-text-primary mb-1">Backup</Text>
                                    <Text className="text-text-secondary">Import atau Export data</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                            </View>
                        </TouchableOpacity>
                        {/* About */}
                        <TouchableOpacity
                            onPress={handleAbout}
                            className="bg-card rounded-2xl overflow-hidden border border-border"
                        >
                            <View className="flex-row items-center p-6">
                                <LinearGradient
                                    colors={['#8b5cf6', '#7c3aed']}
                                    className="w-14 h-14 rounded-2xl items-center justify-center mr-4"
                                >
                                    <Ionicons name="information-circle" size={28} color="white" />
                                </LinearGradient>
                                <View className="flex-1">
                                    <Text className="text-lg font-bold text-text-primary mb-1">Tentang Aplikasi</Text>
                                    <Text className="text-text-secondary">Informasi versi dan dukungan</Text>
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