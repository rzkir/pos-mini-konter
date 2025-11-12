import React, { useEffect, useRef, useState } from 'react';

import {
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import { usePermissions } from '@/context/PermissionContext';

import { router } from 'expo-router';

import { Ionicons } from '@expo/vector-icons';

import AsyncStorage from '@react-native-async-storage/async-storage';

const PermissionScreen = () => {
    const { requestPermissions, loading, allPermissionsGranted } = usePermissions();
    const hasRedirected = useRef(false);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const checkPermissionVisit = async () => {
            try {
                const hasVisitedPermissions = await AsyncStorage.getItem('has_visited_permissions');
                if (hasVisitedPermissions === 'true' && !hasRedirected.current) {
                    hasRedirected.current = true;
                    router.replace('/(tabs)');
                }
            } catch {
            }
        };

        checkPermissionVisit();
    }, []);

    // Check if permissions are already granted and redirect
    useEffect(() => {
        if (allPermissionsGranted && !hasRedirected.current) {
            hasRedirected.current = true;
            AsyncStorage.setItem('has_visited_permissions', 'true');
            router.replace('/(tabs)');
        }
    }, [allPermissionsGranted]);

    const handleGrantPermissions = async () => {
        if (isProcessing) return; // Prevent multiple clicks

        console.log('🔵 Starting permission request...');

        try {
            setIsProcessing(true);

            // Add timeout to prevent infinite loading
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Permission request timeout')), 10000)
            );

            console.log('🔵 Requesting permissions...');
            await Promise.race([requestPermissions(), timeoutPromise]);

            await AsyncStorage.setItem('has_visited_permissions', 'true');
            router.replace('/(tabs)');
        } catch {
            // Still navigate to welcome even if permission request fails
            await AsyncStorage.setItem('has_visited_permissions', 'true');
            router.replace('/(tabs)');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSkip = () => {
        AsyncStorage.setItem('has_visited_permissions', 'true');
        router.replace('/(tabs)');
    };

    return (
        <View className="flex-1 bg-background">
            <View className="flex-1 px-6 py-8">
                {/* Header */}
                <View className="items-center mb-12">
                    {/* <Image
                        source={require('@/assets/images/logo.png')}
                        className="w-20 h-20 mb-6"
                        resizeMode="contain"
                    /> */}
                    <Text className="text-2xl font-bold text-primary mb-3">Selamat Datang!</Text>
                    <Text className="text-base text-secondary text-center leading-6">
                        Untuk memberikan pengalaman terbaik, aplikasi memerlukan beberapa izin
                    </Text>
                </View>

                {/* Permission List */}
                <View className="mb-12">
                    <View className="flex-row items-center py-4 px-4 bg-card rounded-xl mb-3">
                        <View className="w-12 h-12 rounded-full bg-white items-center justify-center mr-4 shadow">
                            <Ionicons name="camera" size={24} color="#3B82F6" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-base font-semibold text-primary mb-1">Kamera</Text>
                            <Text className="text-sm text-secondary leading-5">
                                Untuk mengambil foto properti dan dokumen
                            </Text>
                        </View>
                    </View>

                    <View className="flex-row items-center py-4 px-4 bg-card rounded-xl mb-3">
                        <View className="w-12 h-12 rounded-full bg-white items-center justify-center mr-4 shadow">
                            <Ionicons name="bluetooth" size={24} color="#8B5CF6" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-base font-semibold text-primary mb-1">Bluetooth</Text>
                            <Text className="text-sm text-secondary leading-5">
                                Untuk koneksi dengan perangkat eksternal
                            </Text>
                        </View>
                    </View>

                    <View className="flex-row items-center py-4 px-4 bg-card rounded-xl mb-3">
                        <View className="w-12 h-12 rounded-full bg-white items-center justify-center mr-4 shadow">
                            <Ionicons name="folder" size={24} color="#10B981" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-base font-semibold text-primary mb-1">Penyimpanan</Text>
                            <Text className="text-sm text-secondary leading-5">
                                Untuk memilih dan menyimpan foto ke galeri
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Action Buttons */}
                <View className="mb-6">
                    <TouchableOpacity
                        className="py-4 px-6 rounded-xl items-center mb-3 bg-blue-500 shadow-lg"
                        onPress={handleGrantPermissions}
                        disabled={loading || isProcessing}
                    >
                        <Text className="text-white text-base font-semibold">
                            {loading || isProcessing ? 'Meminta Izin...' : 'Izinkan Semua'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="py-4 px-6 rounded-xl items-center mb-3 border border-border-primary"
                        onPress={handleSkip}
                        disabled={loading || isProcessing}
                    >
                        <Text className="text-tertiary text-base font-medium">Lewati</Text>
                    </TouchableOpacity>

                    {/* Emergency fallback button */}
                    {(loading || isProcessing) && (
                        <TouchableOpacity
                            className="py-3 px-6 rounded-xl items-center mb-3 bg-red-500"
                            onPress={() => {
                                console.log('🚨 Emergency skip triggered');
                                AsyncStorage.setItem('has_visited_permissions', 'true');
                                router.replace('/(tabs)');
                            }}
                        >
                            <Text className="text-white text-sm font-medium">Langsung Masuk (Skip)</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Privacy Note */}
                <Text className="text-xs text-tertiary text-center leading-5">
                    Anda dapat mengubah izin ini kapan saja di pengaturan aplikasi
                </Text>
            </View>
        </View>
    );
};

export default PermissionScreen;