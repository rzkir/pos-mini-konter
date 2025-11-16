import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '@/context/AuthContext'
import * as ImagePicker from 'expo-image-picker'
import Toast from 'react-native-toast-message'

export default function ProfilePage() {
    const { user, loading } = useAuth()
    const [profileImage, setProfileImage] = useState<string | null>(null)

    const formatDate = (date: Date | string | undefined) => {
        if (!date) return '-'
        const d = typeof date === 'string' ? new Date(date) : date
        return d.toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
    }

    const handleImagePicker = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()

        if (permissionResult.granted === false) {
            Toast.show({
                type: 'error',
                text1: 'Izin Diperlukan',
                text2: 'Izin untuk mengakses galeri diperlukan!',
            })
            return
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        })

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri)
        }
    }

    if (loading) {
        return (
            <View className="flex-1 bg-white items-center justify-center">
                <ActivityIndicator size="large" color="#1E90FF" />
                <Text className="text-gray-500 mt-4">Memuat profil...</Text>
            </View>
        )
    }

    if (!user) {
        return (
            <View className="flex-1 bg-white items-center justify-center px-4">
                <Ionicons name="person-circle-outline" size={80} color="#9CA3AF" />
                <Text className="text-gray-900 text-lg font-bold mt-4">
                    Tidak ada pengguna yang login
                </Text>
                <Text className="text-gray-500 text-center mt-2">
                    Silakan login terlebih dahulu untuk melihat profil
                </Text>
                <TouchableOpacity
                    onPress={() => router.push('/auth/signin')}
                    className="mt-6 bg-blue-600 px-6 py-3 rounded-xl"
                >
                    <Text className="text-white font-semibold">Login</Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View className="flex-1 bg-white">
            {/* Header */}
            <View className="pt-12 pb-4 px-4 border-b border-gray-200">
                <View className="flex-row items-center">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="mr-4"
                    >
                        <Ionicons name="arrow-back" size={24} color="#1F2937" />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-gray-900 flex-1 text-center -ml-8">
                        Edit Profile
                    </Text>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                {/* Profile Picture */}
                <View className="items-center mt-8 mb-6">
                    <TouchableOpacity
                        onPress={handleImagePicker}
                        className="relative"
                    >
                        {profileImage ? (
                            <Image
                                source={{ uri: profileImage }}
                                className="w-32 h-32 rounded-full"
                            />
                        ) : (
                            <View className="w-32 h-32 rounded-full bg-green-600 items-center justify-center">
                                <Text className="text-white text-5xl font-bold">
                                    {user.username?.[0]?.toUpperCase() || 'U'}
                                </Text>
                            </View>
                        )}
                        <View className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 rounded-full border-4 border-white items-center justify-center">
                            <Ionicons name="camera" size={18} color="white" />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* First Section */}
                <View className="px-4 mb-4">
                    <View className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                        <TouchableOpacity className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100">
                            <Text className="text-gray-600 text-base">Name</Text>
                            <View className="flex-row items-center flex-1 justify-end">
                                <Text className="text-gray-900 text-base font-medium mr-2">
                                    {user.username}
                                </Text>
                                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-row items-center justify-between px-4 py-4">
                            <Text className="text-gray-600 text-base">Perusahaan</Text>
                            <View className="flex-row items-center flex-1 justify-end">
                                <Text className="text-gray-900 text-base font-medium mr-2">
                                    Explore Benefits
                                </Text>
                                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Private Information Section */}
                <View className="px-4 mb-6">
                    <Text className="text-gray-900 text-lg font-bold mb-3 px-1">
                        Private Information
                    </Text>
                    <View className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                        <TouchableOpacity className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100">
                            <Text className="text-gray-600 text-base">Email</Text>
                            <View className="flex-row items-center flex-1 justify-end">
                                <Text className="text-gray-900 text-base font-medium mr-2 text-right flex-1">
                                    {user.email}
                                </Text>
                                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100">
                            <Text className="text-gray-600 text-base">Birthdate</Text>
                            <View className="flex-row items-center flex-1 justify-end">
                                <Text className="text-gray-900 text-base font-medium mr-2">
                                    {formatDate(user.created_at)}
                                </Text>
                                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100">
                            <Text className="text-gray-600 text-base">Gender</Text>
                            <View className="flex-row items-center flex-1 justify-end">
                                <Text className="text-gray-900 text-base font-medium mr-2">
                                    -
                                </Text>
                                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100">
                            <Text className="text-gray-600 text-base">Weight</Text>
                            <View className="flex-row items-center flex-1 justify-end">
                                <Text className="text-gray-900 text-base font-medium mr-2">
                                    -
                                </Text>
                                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-row items-center justify-between px-4 py-4">
                            <Text className="text-gray-600 text-base">Height</Text>
                            <View className="flex-row items-center flex-1 justify-end">
                                <Text className="text-gray-900 text-base font-medium mr-2">
                                    -
                                </Text>
                                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}