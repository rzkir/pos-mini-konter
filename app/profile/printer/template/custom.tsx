import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { Ionicons } from '@expo/vector-icons';

import HeaderGradient from '@/components/ui/HeaderGradient';

import { router } from 'expo-router';

import { useStateTemplatePrinter } from '@/components/profile/printer/useStateTemplatePrinter';

export default function CustomTemplate() {
    const {
        settings,
        setSettings,
        loading,
        saving,
        saveSettings,
        resetToDefault,
    } = useStateTemplatePrinter();

    if (loading) {
        return (
            <View className="flex-1 bg-gray-50 items-center justify-center">
                <Text className="text-gray-500">Memuat pengaturan...</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-background">
            {/* Header */}
            <HeaderGradient
                title="Custom Template Struk"
                subtitle="Sesuaikan informasi toko dan pesan footer"
                colors={['#FF9228', '#FF9228']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View className="flex-row justify-between items-center flex-1">
                    <View className="flex-1">
                        <Text className="text-xl font-bold text-white mb-2">Custom Template Struk</Text>
                        <Text className="text-purple-100 text-base">Sesuaikan informasi toko dan pesan footer</Text>
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
                <View className="px-4 pt-6">
                    {/* Informasi Toko */}
                    <View className="bg-white rounded-2xl p-6 mb-6 overflow-hidden"
                        style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 4 }}>
                        <View className="flex-row items-center mb-4">
                            <LinearGradient
                                colors={['#FF9228', '#FF9228']}
                                className="w-10 h-10 rounded-xl items-center justify-center mr-3 overflow-hidden"
                            >
                                <Ionicons name="storefront" size={20} color="white" />
                            </LinearGradient>
                            <Text className="text-xl font-bold text-gray-900">Informasi Toko</Text>
                        </View>

                        <View className="mb-4">
                            <Text className="text-sm font-semibold text-gray-700 mb-2">Nama Toko *</Text>
                            <TextInput
                                className="bg-gray-50 rounded-xl px-4 py-3 text-gray-900 border border-gray-200"
                                placeholder="Masukkan nama toko"
                                placeholderTextColor="#9CA3AF"
                                value={settings.storeName}
                                onChangeText={(text) => setSettings({ ...settings, storeName: text })}
                            />
                        </View>

                        <View className="mb-4">
                            <Text className="text-sm font-semibold text-gray-700 mb-2">Alamat Toko</Text>
                            <TextInput
                                className="bg-gray-50 rounded-xl px-4 py-3 text-gray-900 border border-gray-200"
                                placeholder="Masukkan alamat toko"
                                placeholderTextColor="#9CA3AF"
                                value={settings.storeAddress}
                                onChangeText={(text) => setSettings({ ...settings, storeAddress: text })}
                                multiline
                                numberOfLines={2}
                            />
                        </View>

                        <View className="mb-4">
                            <Text className="text-sm font-semibold text-gray-700 mb-2">No. Telepon</Text>
                            <TextInput
                                className="bg-gray-50 rounded-xl px-4 py-3 text-gray-900 border border-gray-200"
                                placeholder="Masukkan nomor telepon"
                                placeholderTextColor="#9CA3AF"
                                value={settings.storePhone}
                                onChangeText={(text) => setSettings({ ...settings, storePhone: text })}
                                keyboardType="phone-pad"
                            />
                        </View>

                        <View className="mb-4">
                            <Text className="text-sm font-semibold text-gray-700 mb-2">Website</Text>
                            <TextInput
                                className="bg-gray-50 rounded-xl px-4 py-3 text-gray-900 border border-gray-200"
                                placeholder="Masukkan website (contoh: www.tokokasir.com)"
                                placeholderTextColor="#9CA3AF"
                                value={settings.storeWebsite}
                                onChangeText={(text) => setSettings({ ...settings, storeWebsite: text })}
                                keyboardType="url"
                                autoCapitalize="none"
                            />
                        </View>

                        {/* Logo Section - Dihapus untuk menghindari masalah encoding */}
                        {/* Logo tidak akan dicetak di struk printer, tapi tetap muncul di HTML/PDF version */}
                    </View>

                    {/* Footer Message */}
                    <View className="bg-white rounded-2xl p-6 mb-6 overflow-hidden"
                        style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 4 }}>
                        <View className="flex-row items-center justify-between mb-4">
                            <View className="flex-row items-center">
                                <LinearGradient
                                    colors={['#10b981', '#059669']}
                                    className="w-10 h-10 rounded-xl items-center justify-center mr-3"
                                >
                                    <Ionicons name="document-text" size={20} color="white" />
                                </LinearGradient>
                                <Text className="text-xl font-bold text-gray-900">Pesan Footer</Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => setSettings({ ...settings, showFooter: !settings.showFooter })}
                                className={`px-4 py-2 rounded-xl ${settings.showFooter ? 'bg-green-100' : 'bg-gray-200'}`}
                            >
                                <Text className={`text-sm font-semibold ${settings.showFooter ? 'text-green-700' : 'text-gray-600'}`}>
                                    {settings.showFooter ? 'Aktif' : 'Nonaktif'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <Text className="text-sm font-semibold text-gray-700 mb-2">Pesan Footer</Text>
                        <TextInput
                            className="bg-gray-50 rounded-xl px-4 py-3 text-gray-900 border border-gray-200"
                            placeholder="Masukkan pesan footer (gunakan \n untuk baris baru)"
                            placeholderTextColor="#9CA3AF"
                            value={settings.footerMessage}
                            onChangeText={(text) => setSettings({ ...settings, footerMessage: text })}
                            multiline
                            numberOfLines={4}
                            editable={settings.showFooter}
                        />
                        <Text className="text-xs text-gray-500 mt-2">
                            Gunakan \n untuk membuat baris baru
                        </Text>
                    </View>

                    {/* Preview Section */}
                    <View className="bg-white rounded-2xl p-6 mb-6 overflow-hidden"
                        style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 4 }}>
                        <View className="flex-row items-center mb-4">
                            <LinearGradient
                                colors={['#3b82f6', '#2563eb']}
                                className="w-10 h-10 rounded-xl items-center justify-center mr-3"
                            >
                                <Ionicons name="eye" size={20} color="white" />
                            </LinearGradient>
                            <Text className="text-xl font-bold text-gray-900">Preview</Text>
                        </View>

                        <View className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                            {/* Logo tidak ditampilkan di preview karena tidak akan dicetak di struk printer */}
                            <Text className="text-center font-bold text-gray-900 mb-2" style={{ fontSize: 18 }}>
                                {settings.storeName || 'Nama Toko'}
                            </Text>
                            {settings.storeAddress && (
                                <Text className="text-center text-gray-600 text-sm mb-1">{settings.storeAddress}</Text>
                            )}
                            {settings.storePhone && (
                                <Text className="text-center text-gray-600 text-sm mb-1">Telp: {settings.storePhone}</Text>
                            )}
                            {settings.storeWebsite && (
                                <Text className="text-center text-gray-600 text-sm mb-3">{settings.storeWebsite}</Text>
                            )}
                            <View className="h-px bg-gray-300 my-3" />
                            {settings.showFooter && settings.footerMessage && (
                                <>
                                    <View className="h-px bg-gray-300 my-3" />
                                    <Text className="text-center text-gray-600 text-xs" style={{ lineHeight: 18 }}>
                                        {settings.footerMessage.split('\\n').map((line, i) => (
                                            <Text key={i}>{line}{'\n'}</Text>
                                        ))}
                                    </Text>
                                </>
                            )}
                        </View>
                    </View>

                    {/* Reset Button */}
                    <TouchableOpacity
                        onPress={resetToDefault}
                        className="bg-gray-200 rounded-xl py-4 items-center mb-6"
                    >
                        <View className="flex-row items-center">
                            <Ionicons name="refresh" size={20} color="#6B7280" />
                            <Text className="text-gray-700 font-semibold ml-2">Reset ke Default</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Save Button */}
            <View className="px-6 pt-2 bg-white border-t border-gray-200">
                <TouchableOpacity
                    onPress={saveSettings}
                    disabled={saving || !settings.storeName.trim()}
                    className={`rounded-xl py-4 items-center ${saving || !settings.storeName.trim() ? 'bg-gray-300' : 'bg-purple-600'}`}
                    style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 }}
                >
                    {saving ? (
                        <Text className="text-white font-semibold text-base">Menyimpan...</Text>
                    ) : (
                        <View className="flex-row items-center">
                            <Ionicons name="checkmark-circle" size={20} color="white" />
                            <Text className="text-white font-semibold text-base ml-2">Simpan Pengaturan</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

