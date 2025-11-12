import { View, Text, ScrollView, TouchableOpacity, Linking, Alert, Share, Platform, Image } from 'react-native'

import { router } from 'expo-router'

import { Ionicons } from '@expo/vector-icons'

import { LinearGradient } from 'expo-linear-gradient'

import Toast from 'react-native-toast-message'

import HeaderGradient from '@/components/ui/HeaderGradient'

import logo from '@/assets/images/icon.png'

export default function About() {
    const handleContactSupport = () => {
        Alert.alert(
            'Hubungi Support',
            'Pilih cara untuk menghubungi tim support:',
            [
                {
                    text: 'Email',
                    onPress: () => {
                        const subject = encodeURIComponent(`Bantuan Kasir Mini`)
                        Linking.openURL(`mailto:spacedigitalia@gmail.com?subject=${subject}`)
                    }
                },
                {
                    text: 'WhatsApp',
                    onPress: () => {
                        const text = encodeURIComponent(`Halo, saya butuh bantuan untuk aplikasi Kasir Mini`)
                        Linking.openURL(`https://wa.me/6281398632939?text=${text}`)
                    }
                },
                {
                    text: 'Telepon',
                    onPress: () => {
                        Linking.openURL('tel:+6281398632939')
                    }
                },
                { text: 'Batal', style: 'cancel' }
            ]
        )
    }

    const handleRateApp = () => {
        Alert.alert(
            'Beri Rating',
            `Apakah Anda puas dengan aplikasi Kasir Mini?`,
            [
                { text: 'Tidak', style: 'cancel' },
                {
                    text: 'Ya, Kunjungi Website',
                    onPress: () => {
                        Linking.openURL('https://kasirmini.biz.id')
                    }
                }
            ]
        )
    }

    const handleShareApp = async () => {
        try {
            const shareMessage = `📱 Kasir Mini v1.0.0

🎯 Sistem Point of Sale Modern untuk Bisnis Anda

✨ Fitur Utama:
• Manajemen Transaksi yang Mudah
• Manajemen Produk & Inventori
• Laporan & Analytics Lengkap
• Scan Barcode untuk Input Cepat
• Pencetakan Struk Otomatis

💬 Butuh bantuan?
WhatsApp: https://wa.me/6281398632939
Email: spacedigitalia@gmail.com

🌐 Kunjungi website kami:
https://kasirmini.biz.id

Dikembangkan dengan ❤️ untuk kemudahan bisnis Anda

#POSMobile #PointOfSale #BusinessApp`

            const result = await Share.share({
                message: shareMessage,
                title: `Bagikan Kasir Mini`,
                ...(Platform.OS === 'android' && {
                    dialogTitle: `Bagikan Kasir Mini`,
                }),
            })

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    Toast.show({
                        type: 'success',
                        text1: 'Berhasil Dibagikan',
                        text2: 'Terima kasih telah membagikan aplikasi!',
                        visibilityTime: 2000
                    })
                } else {
                    Toast.show({
                        type: 'success',
                        text1: 'Berhasil Dibagikan',
                        text2: 'Aplikasi berhasil dibagikan',
                        visibilityTime: 2000
                    })
                }
            }
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Gagal Membagikan',
                text2: error.message || 'Terjadi kesalahan saat membagikan aplikasi',
                visibilityTime: 3000
            })
        }
    }

    const handlePrivacyPolicy = () => {
        router.push('/profile/about/kebijakan-privasi')
    }

    const handleTermsOfService = () => {
        router.push('/profile/about/syarat-dan-ketentuan')
    }

    return (
        <View className="flex-1 bg-background">
            {/* Header */}
            <HeaderGradient
                colors={['#FF9228', '#FF9228']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                title="Tentang Aplikasi"
                icon="ℹ️"
            >
                <View className="flex-row justify-between items-center">
                    <View className="flex-1">
                        <Text className="text-xl font-bold text-white mb-2">
                            Tentang Aplikasi
                        </Text>
                        <Text className="text-blue-100 text-base">
                            Informasi aplikasi dan dukungan
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
                {/* App Information Card */}
                <View className="px-4 mt-4 mb-4">
                    <View
                        className="bg-card rounded-2xl overflow-hidden border border-border"
                    >
                        <LinearGradient
                            colors={['#f8fafc', '#ffffff']}
                            className="p-8"
                        >
                            {/* App Logo and Name */}
                            <View className="items-center mb-8">
                                <View
                                    className="w-32 h-32 rounded-full items-center justify-center mb-4"
                                >
                                    <Image source={logo} className="w-full h-full" resizeMode="cover" />
                                </View>
                                <Text className="text-2xl font-bold text-gray-900 mb-2">
                                    Kasir Mini
                                </Text>
                                <Text className="text-base text-gray-600 text-center">
                                    Sistem Kasir Modern untuk Bisnis Anda
                                </Text>
                            </View>

                            {/* App Description */}
                            <View className="mb-8">
                                <Text className="text-base text-gray-700 leading-6 text-center">
                                    Kasir Mini adalah aplikasi kasir yang dirancang khusus untuk memudahkan
                                    pengelolaan transaksi, inventori, dan laporan bisnis Anda. Dengan antarmuka yang
                                    intuitif dan fitur yang lengkap, aplikasi ini membantu meningkatkan efisiensi
                                    operasional bisnis Anda.
                                </Text>
                            </View>

                            {/* Version Information */}
                            <View className="flex-col gap-4">
                                <View className="flex-row items-center justify-between p-4 bg-card rounded-2xl border border-border">
                                    <View className="flex-row items-center">
                                        <View className="w-10 h-10 bg-blue-100 rounded-2xl items-center justify-center mr-3">
                                            <Ionicons name="information-circle" size={20} color="#3b82f6" />
                                        </View>
                                        <Text className="text-gray-600 font-medium">Versi Aplikasi</Text>
                                    </View>
                                    <Text className="text-gray-900 font-bold">1.0.0</Text>
                                </View>

                                <View className="flex-row items-center justify-between p-4 bg-card rounded-2xl border border-border">
                                    <View className="flex-row items-center">
                                        <View className="w-10 h-10 bg-green-100 rounded-2xl items-center justify-center mr-3">
                                            <Ionicons name="build" size={20} color="#10b981" />
                                        </View>
                                        <Text className="text-gray-600 font-medium">Build Number</Text>
                                    </View>
                                    <Text className="text-gray-900 font-bold">1</Text>
                                </View>

                                <View className="flex-row items-center justify-between p-4 bg-card rounded-2xl border border-border">
                                    <View className="flex-row items-center">
                                        <View className="w-10 h-10 bg-purple-100 rounded-2xl items-center justify-center mr-3">
                                            <Ionicons name="calendar" size={20} color="#8b5cf6" />
                                        </View>
                                        <Text className="text-gray-600 font-medium">Tanggal Rilis</Text>
                                    </View>
                                    <Text className="text-gray-900 font-bold">2025</Text>
                                </View>
                            </View>
                        </LinearGradient>
                    </View>
                </View>

                {/* Features Section */}
                <View className="px-4 mt-4 mb-4">
                    <Text className="text-xl font-semibold text-gray-900 mb-4">Fitur Utama</Text>

                    <View className="flex-col gap-4">
                        <View className="bg-card rounded-2xl overflow-hidden border border-border"
                        >
                            <View className="flex-row items-center p-6">
                                <LinearGradient
                                    colors={['#3b82f6', '#1d4ed8']}
                                    className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
                                >
                                    <Ionicons name="receipt" size={24} color="white" />
                                </LinearGradient>
                                <View className="flex-1">
                                    <Text className="text-lg font-bold text-gray-900 mb-1">Manajemen Transaksi</Text>
                                    <Text className="text-gray-600">Kelola penjualan dan pembayaran dengan mudah</Text>
                                </View>
                            </View>
                        </View>

                        <View className="bg-card rounded-2xl overflow-hidden border border-border"
                        >
                            <View className="flex-row items-center p-6">
                                <LinearGradient
                                    colors={['#10b981', '#059669']}
                                    className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
                                >
                                    <Ionicons name="cube" size={24} color="white" />
                                </LinearGradient>
                                <View className="flex-1">
                                    <Text className="text-lg font-bold text-gray-900 mb-1">Manajemen Produk</Text>
                                    <Text className="text-gray-600">Kelola inventori dan kategori produk</Text>
                                </View>
                            </View>
                        </View>

                        <View className="bg-card rounded-2xl overflow-hidden border border-border"
                        >
                            <View className="flex-row items-center p-6">
                                <LinearGradient
                                    colors={['#f59e0b', '#d97706']}
                                    className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
                                >
                                    <Ionicons name="analytics" size={24} color="white" />
                                </LinearGradient>
                                <View className="flex-1">
                                    <Text className="text-lg font-bold text-gray-900 mb-1">Laporan & Analytics</Text>
                                    <Text className="text-gray-600">Pantau performa bisnis dengan laporan detail</Text>
                                </View>
                            </View>
                        </View>

                        <View className="bg-card rounded-2xl overflow-hidden border border-border"
                        >
                            <View className="flex-row items-center p-6">
                                <LinearGradient
                                    colors={['#8b5cf6', '#7c3aed']}
                                    className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
                                >
                                    <Ionicons name="qr-code" size={24} color="white" />
                                </LinearGradient>
                                <View className="flex-1">
                                    <Text className="text-lg font-bold text-gray-900 mb-1">Scan Barcode</Text>
                                    <Text className="text-gray-600">Scan barcode untuk input produk cepat</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Support Section */}
                <View className="px-4 mt-4 mb-4">
                    <Text className="text-2xl font-bold text-gray-900 mb-6">Dukungan & Bantuan</Text>

                    <View className="flex-col gap-4">
                        <TouchableOpacity
                            onPress={handleContactSupport}
                            className="bg-card rounded-2xl overflow-hidden border border-border"
                        >
                            <View className="flex-row items-center p-6">
                                <LinearGradient
                                    colors={['#ef4444', '#dc2626']}
                                    className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
                                >
                                    <Ionicons name="headset" size={24} color="white" />
                                </LinearGradient>
                                <View className="flex-1">
                                    <Text className="text-lg font-bold text-gray-900 mb-1">Hubungi Support</Text>
                                    <Text className="text-gray-600">Butuh bantuan? Hubungi tim support kami</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleRateApp}
                            className="bg-card rounded-2xl overflow-hidden border border-border"
                        >
                            <View className="flex-row items-center p-6">
                                <LinearGradient
                                    colors={['#f59e0b', '#d97706']}
                                    className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
                                >
                                    <Ionicons name="star" size={24} color="white" />
                                </LinearGradient>
                                <View className="flex-1">
                                    <Text className="text-lg font-bold text-gray-900 mb-1">Beri Rating</Text>
                                    <Text className="text-gray-600">Berikan rating dan ulasan untuk aplikasi</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleShareApp}
                            className="bg-card rounded-2xl overflow-hidden border border-border"
                        >
                            <View className="flex-row items-center p-6">
                                <LinearGradient
                                    colors={['#10b981', '#059669']}
                                    className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
                                >
                                    <Ionicons name="share" size={24} color="white" />
                                </LinearGradient>
                                <View className="flex-1">
                                    <Text className="text-lg font-bold text-gray-900 mb-1">Bagikan Aplikasi</Text>
                                    <Text className="text-gray-600">Bagikan Kasir Mini ke teman-teman</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Legal Section */}
                <View className="px-4 mt-4 mb-4">
                    <Text className="text-2xl font-bold text-gray-900 mb-6">Informasi Legal</Text>

                    <View className="flex-col gap-4">
                        <TouchableOpacity
                            onPress={handlePrivacyPolicy}
                            className="bg-card rounded-2xl overflow-hidden border border-border"
                        >
                            <View className="flex-row items-center p-6">
                                <LinearGradient
                                    colors={['#6b7280', '#4b5563']}
                                    className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
                                >
                                    <Ionicons name="shield-checkmark" size={24} color="white" />
                                </LinearGradient>
                                <View className="flex-1">
                                    <Text className="text-lg font-bold text-gray-900 mb-1">Kebijakan Privasi</Text>
                                    <Text className="text-gray-600">Informasi perlindungan data pengguna</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleTermsOfService}
                            className="bg-card rounded-2xl overflow-hidden border border-border"
                        >
                            <View className="flex-row items-center p-6">
                                <LinearGradient
                                    colors={['#374151', '#1f2937']}
                                    className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
                                >
                                    <Ionicons name="document-text" size={24} color="white" />
                                </LinearGradient>
                                <View className="flex-1">
                                    <Text className="text-lg font-bold text-gray-900 mb-1">Syarat dan Ketentuan</Text>
                                    <Text className="text-gray-600">Ketentuan penggunaan aplikasi</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Developer Information */}
                <View className="px-4 mt-4 mb-4">
                    <Text className="text-2xl font-bold text-gray-900 mb-6">Informasi Developer</Text>

                    <View
                        className="bg-card rounded-2xl overflow-hidden border border-border"
                    >
                        <LinearGradient
                            colors={['#f8fafc', '#ffffff']}
                            className="p-6"
                        >
                            <View className="items-center">
                                <LinearGradient
                                    colors={['#3b82f6', '#8b5cf6']}
                                    className="w-16 h-16 rounded-2xl items-center justify-center mb-4"
                                >
                                    <Ionicons name="code-slash" size={32} color="white" />
                                </LinearGradient>
                                <Text className="text-xl font-bold text-gray-900 mb-2">
                                    Tim Development
                                </Text>
                                <Text className="text-gray-600 text-center mb-4">
                                    Dikembangkan dengan ❤️ untuk kemudahan bisnis Anda
                                </Text>

                                <View className="flex-row gap-4">
                                    <TouchableOpacity
                                        onPress={() => Linking.openURL('https://github.com/rzkir')}
                                        className="w-12 h-12 bg-gray-100 rounded-full items-center justify-center"
                                    >
                                        <Ionicons name="logo-github" size={24} color="#374151" />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => Linking.openURL('https://www.linkedin.com/in/rizki-ramadhan12')}
                                        className="w-12 h-12 bg-gray-100 rounded-full items-center justify-center"
                                    >
                                        <Ionicons name="logo-linkedin" size={24} color="#374151" />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => Linking.openURL('mailto:spacedigitalia@gmail.com?subject=Halo, saya butuh bantuan untuk aplikasi POS Mobile')}
                                        className="w-12 h-12 bg-gray-100 rounded-full items-center justify-center"
                                    >
                                        <Ionicons name="mail" size={24} color="#374151" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </LinearGradient>
                    </View>
                </View>

                {/* Copyright */}
                <View className="px-4 mt-4 mb-4">
                    <Text className="text-gray-500 text-center">
                        © 2025 Kasir Mini. All rights reserved.
                    </Text>
                </View>
            </ScrollView>
        </View>
    )
}