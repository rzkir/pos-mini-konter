import { View, Text, TouchableOpacity, ScrollView } from 'react-native'

import { LinearGradient } from 'expo-linear-gradient'

import { Ionicons } from '@expo/vector-icons'

import Toast from 'react-native-toast-message'

import { router } from 'expo-router'

import { usePrinter } from '@/hooks/usePrinter'

import { generateReceiptText } from './template'

import HeaderGradient from '@/components/ui/HeaderGradient'

export default function Printer() {
    const {
        devices: classicDevices,
        connectedAddress: classicConnected,
        loading,
        enableAndListDevices: enableClassicAndList,
        connectToPrinter: connectClassic,
        printText
    } = usePrinter()

    const testPrintClassic = async () => {
        if (!classicConnected) {
            Toast.show({ type: 'info', text1: 'Hubungkan printer Classic dulu' })
            return
        }
        try {
            // Generate test receipt menggunakan template
            const testTransaction: Transaction = {
                id: 1,
                transaction_number: 'TEST-001',
                customer_name: 'Pelanggan Test',
                subtotal: 30000,
                discount: 0,
                tax: 0,
                total: 30000,
                payment_method: 'cash',
                payment_status: 'paid',
                status: 'completed',
                created_by: 'system',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            }

            const testItems = [
                {
                    id: 1,
                    transaction_id: 1,
                    product_id: 1,
                    quantity: 1,
                    price: 10000,
                    discount: 0,
                    subtotal: 10000,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    product: { name: 'Produk A', id: 1 }
                },
                {
                    id: 2,
                    transaction_id: 1,
                    product_id: 2,
                    quantity: 2,
                    price: 10000,
                    discount: 0,
                    subtotal: 20000,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    product: { name: 'Produk B', id: 2 }
                }
            ]

            const data = await generateReceiptText({
                transaction: testTransaction,
                items: testItems
            })

            await printText(data)
            Toast.show({ type: 'success', text1: 'Tes cetak Classic terkirim' })
        } catch (e: any) {
            console.error(e)
            Toast.show({ type: 'error', text1: 'Gagal cetak (Classic)', text2: e.message || 'Terjadi kesalahan' })
        }
    }
    return (
        <View className="flex-1 bg-gray-50">
            {/* Header */}
            <HeaderGradient
                colors={['#FF9228', '#FF9228']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                title="Printer ESC/POS"
            >
                <View className="flex-row justify-between items-center w-full">
                    <View className="flex-1">
                        <Text className="text-3xl font-bold text-white mb-2">
                            Printer ESC/POS
                        </Text>
                        <Text className="text-blue-100 text-base">
                            Pengaturan dan tes printer Bluetooth Classic
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
                {/* Printer Classic Section */}
                <View className="px-4 mb-6 mt-4 flex-col gap-4">
                    {/* Classic Header */}
                    <View className="bg-card border border-border rounded-2xl overflow-hidden">
                        <View className="flex-row items-center justify-between p-6">
                            <View className="flex-col flex-1 gap-2">
                                <View className='flex-row items-center'>
                                    <LinearGradient
                                        colors={['#2563eb', '#1e40af']}
                                        className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
                                    >
                                        <Ionicons name="print" size={24} color="white" />
                                    </LinearGradient>

                                    <Text className="text-lg font-bold text-gray-900">Printer Classic</Text>
                                </View>

                                <Text className="text-gray-600">Muat daftar perangkat paired dan tes cetak</Text>
                            </View>

                            <TouchableOpacity
                                onPress={enableClassicAndList}
                                disabled={loading}
                                className={`px-4 py-2 rounded-xl ${loading ? 'bg-blue-400' : 'bg-blue-600'}`}
                            >
                                <Text className="text-white font-semibold">
                                    {loading ? 'Memuat...' : 'Muat Perangkat'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* Classic Devices List */}
                    <View className="bg-card border border-border rounded-2xl overflow-hidden">
                        <View className="p-4">
                            {classicDevices.length === 0 ? (
                                <Text className="text-gray-500 px-2 py-2">Belum ada daftar. Tap Muat Perangkat.</Text>
                            ) : (
                                classicDevices.map((d: any) => (
                                    <View key={d.address} className="flex-row items-center justify-between px-2 py-3 border-b border-gray-100">
                                        <View className="flex-1">
                                            <Text className="text-gray-900 font-semibold">{d.name || 'Printer'}</Text>
                                            <Text className="text-gray-500 text-xs">{d.address}</Text>
                                        </View>
                                        <TouchableOpacity
                                            onPress={() => connectClassic(d.address)}
                                            className={`px-3 py-2 rounded-xl ${classicConnected === d.address ? 'bg-red-600' : 'bg-emerald-600'}`}
                                        >
                                            <Text className="text-white text-sm font-semibold">{classicConnected === d.address ? 'Putuskan' : 'Hubungkan'}</Text>
                                        </TouchableOpacity>
                                    </View>
                                ))
                            )}
                        </View>
                    </View>

                    {/* Test Print Button */}
                    <TouchableOpacity
                        onPress={testPrintClassic}
                        className="rounded-2xl overflow-hidden"
                    >
                        <LinearGradient
                            colors={['#10b981', '#059669', '#047857']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            className="p-5"
                        >
                            <View className="flex-row items-center justify-center">
                                <View className="w-10 h-10 bg-white/20 rounded-2xl items-center justify-center mr-4">
                                    <Ionicons name="checkmark-circle" size={22} color="white" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-white text-base font-bold mb-0.5">Tes Cetak (Classic)</Text>
                                    <Text className="text-green-100 text-xs">Kirim teks sederhana ke printer</Text>
                                </View>
                                <Ionicons name="arrow-forward" size={18} color="white" />
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                {/* Template Custom Section */}
                <View className="px-4 mb-6">
                    <Text className="text-2xl font-bold text-gray-900 mb-4">Template Struk</Text>
                    <TouchableOpacity
                        onPress={() => router.push('/profile/printer/template/custom')}
                        className="rounded-2xl overflow-hidden"
                        style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 16, elevation: 8 }}
                    >
                        <LinearGradient
                            colors={['#8b5cf6', '#7c3aed', '#6d28d9']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            className="p-5"
                        >
                            <View className="flex-row items-center justify-center">
                                <View className="w-10 h-10 bg-white/20 rounded-2xl items-center justify-center mr-4">
                                    <Ionicons name="document-text" size={22} color="white" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-white text-base font-bold mb-0.5">Custom Template Struk</Text>
                                    <Text className="text-purple-100 text-xs">Ubah nama toko, alamat, dan footer struk</Text>
                                </View>
                                <Ionicons name="arrow-forward" size={18} color="white" />
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    )
}