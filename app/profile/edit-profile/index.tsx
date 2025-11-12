import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native'

import { router } from 'expo-router'

import { Ionicons } from '@expo/vector-icons'

import { LinearGradient } from 'expo-linear-gradient'

import HeaderGradient from '@/components/ui/HeaderGradient';

import Input from '@/components/ui/input'

import { useStateInformation } from '@/components/profile/information/useStateInformation'

export default function EditCompanyInfo() {
    const {
        companyName,
        setCompanyName,
        companyAddress,
        setCompanyAddress,
        companyPhone,
        setCompanyPhone,
        companyEmail,
        setCompanyEmail,
        companyWebsite,
        setCompanyWebsite,
        logoUrl,
        loading,
        handleImagePicker,
        handleSaveInfo
    } = useStateInformation()

    return (
        <View className="flex-1 bg-background">
            {/* Header */}
            <HeaderGradient
                colors={['#FF9228', '#FF9228']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                title="Informasi Perusahaan"
                icon="P"
            >
                <View className="flex-row justify-between items-center w-full">
                    <View className="flex-1">
                        <Text className="text-2xl font-bold text-white mb-1">Edit Profile Perusahaan</Text>
                        <Text className="text-white/80 text-md">Ubah informasi perusahaan</Text>
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
                {/* Company Information */}
                <View className="px-4 mt-4">
                    <View
                        className="bg-card p-4 rounded-2xl overflow-hidden border border-border"
                    >
                        {/* Company Logo */}
                        <View className="items-center mb-6">
                            <TouchableOpacity
                                onPress={handleImagePicker}
                                className="relative"
                            >
                                {logoUrl ? (
                                    <Image
                                        source={{ uri: logoUrl }}
                                        className="w-24 h-24 rounded-full"
                                    />
                                ) : (
                                    <LinearGradient
                                        colors={['#3b82f6', '#8b5cf6', '#ec4899']}
                                        className="w-24 h-24 rounded-full items-center justify-center"
                                    >
                                        <Ionicons name="business" size={48} color="white" />
                                    </LinearGradient>
                                )}
                                <View className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-500 rounded-full border-2 border-white items-center justify-center">
                                    <Ionicons name="camera" size={16} color="white" />
                                </View>
                            </TouchableOpacity>
                            <Text className="text-sm text-gray-600 mt-2">Tap untuk mengubah logo</Text>
                        </View>

                        <View className="flex-col gap-4">
                            <View>
                                <Input
                                    label="Nama Perusahaan *"
                                    value={companyName}
                                    onChangeText={setCompanyName}
                                    placeholder="Masukkan nama perusahaan"
                                />
                            </View>

                            <View>
                                <Input
                                    label="Alamat Perusahaan"
                                    value={companyAddress}
                                    onChangeText={setCompanyAddress}
                                    placeholder="Masukkan alamat perusahaan"
                                    multiline
                                    numberOfLines={3}
                                />
                            </View>

                            <View className="flex-row gap-4">
                                <View className="flex-1">
                                    <Input
                                        label="Telepon"
                                        value={companyPhone}
                                        onChangeText={setCompanyPhone}
                                        placeholder="+62 21 1234 5678"
                                        keyboardType="phone-pad"
                                    />
                                </View>

                                <View className="flex-1">
                                    <Input
                                        label="Email"
                                        value={companyEmail}
                                        onChangeText={setCompanyEmail}
                                        placeholder="info@company.com"
                                        keyboardType="email-address"
                                    />
                                </View>
                            </View>

                            <View>
                                <Input
                                    label="Website"
                                    value={companyWebsite}
                                    onChangeText={setCompanyWebsite}
                                    placeholder="www.company.com"
                                    keyboardType="url"
                                />
                            </View>
                        </View>
                    </View>
                </View>

                {/* Action Buttons */}
                <View className="px-4 mt-4">
                    <View className="flex-col gap-2">
                        {/* Save Info */}
                        <TouchableOpacity
                            onPress={handleSaveInfo}
                            disabled={loading}
                            className="rounded-2xl overflow-hidden"
                            style={{
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 6 },
                                shadowOpacity: 0.2,
                                shadowRadius: 16,
                                elevation: 8
                            }}
                        >
                            <LinearGradient
                                colors={['#FF9228', '#FF9228']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                className="p-6"
                            >
                                <View className="flex-row items-center justify-center">
                                    <View className="w-12 h-12 bg-white/20 rounded-2xl items-center justify-center mr-4">
                                        <Ionicons name="save" size={24} color="white" />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-white text-lg font-bold mb-1">
                                            {loading ? 'Menyimpan...' : 'Simpan Informasi'}
                                        </Text>
                                        <Text className="text-green-100 text-sm">
                                            {loading ? 'Mohon tunggu...' : 'Simpan perubahan informasi perusahaan'}
                                        </Text>
                                    </View>
                                    <Ionicons name="arrow-forward" size={20} color="white" />
                                </View>
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Cancel */}
                        <TouchableOpacity
                            onPress={() => router.back()}
                            disabled={loading}
                            className="rounded-2xl overflow-hidden"
                            style={{
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 6 },
                                shadowOpacity: 0.2,
                                shadowRadius: 16,
                                elevation: 8
                            }}
                        >
                            <LinearGradient
                                colors={['#6b7280', '#4b5563', '#374151']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                className="p-6"
                            >
                                <View className="flex-row items-center justify-center">
                                    <View className="w-12 h-12 bg-white/20 rounded-2xl items-center justify-center mr-4">
                                        <Ionicons name="close" size={24} color="white" />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-white text-lg font-bold mb-1">Batal</Text>
                                        <Text className="text-gray-100 text-sm">Kembali tanpa menyimpan perubahan</Text>
                                    </View>
                                    <Ionicons name="arrow-forward" size={20} color="white" />
                                </View>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}