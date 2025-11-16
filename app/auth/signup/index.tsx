import React from 'react';

import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { Ionicons } from '@expo/vector-icons';

import { router } from 'expo-router';

import { useAuth } from '@/context/AuthContext';

import Input from '@/components/ui/input';

import HeaderGradient from '@/components/ui/HeaderGradient';

// Password strength checker
const getPasswordStrength = (password: string): { strength: 'Weak' | 'Medium' | 'Strong'; color: string; bars: number } => {
    if (password.length === 0) {
        return { strength: 'Weak', color: '#9CA3AF', bars: 0 };
    }

    let strength = 0;

    // Length check
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;

    // Character variety checks
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 1;

    if (strength <= 2) {
        return { strength: 'Weak', color: '#EF4444', bars: 1 };
    } else if (strength <= 4) {
        return { strength: 'Medium', color: '#F59E0B', bars: 2 };
    } else {
        return { strength: 'Strong', color: '#10B981', bars: 3 };
    }
};

export default function SignUpPage() {
    const {
        signupEmail,
        setSignupEmail,
        signupName,
        setSignupName,
        signupPassword,
        setSignupPassword,
        signupConfirmPassword,
        setSignupConfirmPassword,
        showPassword,
        setShowPassword,
        showConfirmPassword,
        setShowConfirmPassword,
        signupLoading,
        signup,
    } = useAuth();

    const passwordStrength = getPasswordStrength(signupPassword);

    const handleSignUp = async () => {
        try {
            await signup();
            router.replace('/');
        } catch {
            // Error is already handled in signup function
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1"
        >
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
            >
                <HeaderGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ paddingBottom: 128, borderBottomLeftRadius: 12, borderBottomRightRadius: 12, position: 'relative' }}
                    title=""
                >
                    {/* Navigation Bar */}
                    <View className="flex-row items-center justify-between w-full">
                        <TouchableOpacity onPress={() => router.back()}>
                            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                        </TouchableOpacity>

                        <View className="flex-row items-center">
                            <Text className="text-white text-sm mr-2">Sudah punya akun?</Text>
                            <TouchableOpacity
                                onPress={() => router.push('/auth/signin')}
                                className="bg-white/20 px-4 py-2 rounded-full"
                            >
                                <Text className="text-white font-semibold">Masuk</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View className="absolute bottom-16 left-0 right-0">
                        <View className="items-center justify-center">
                            <Text className="text-white text-4xl font-bold">Kasir Mini</Text>
                        </View>
                    </View>
                </HeaderGradient>

                {/* Form Section */}
                <View className="flex-1 bg-white px-4 pt-8">
                    {/* Title */}
                    <Text className="text-3xl font-bold text-gray-900 mb-2">Mulai gratis.</Text>
                    <Text className="text-gray-500 text-base mb-8">Gratis selamanya. Tidak perlu kartu kredit..</Text>

                    {/* Email Input */}
                    <Input
                        label="Email Address"
                        value={signupEmail}
                        onChangeText={setSignupEmail}
                        placeholder="Masukkan email Anda"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete="email"
                        returnKeyType="next"
                    />

                    {/* Name Input */}
                    <Input
                        label="Nama"
                        value={signupName}
                        onChangeText={setSignupName}
                        placeholder="Masukkan nama Anda"
                        autoCapitalize="words"
                        autoComplete="name"
                        returnKeyType="next"
                    />

                    {/* Password Input */}
                    <View>
                        <Input
                            label="Kata sandi"
                            value={signupPassword}
                            onChangeText={setSignupPassword}
                            placeholder="Masukkan kata sandi Anda"
                            secureTextEntry={!showPassword}
                            autoCapitalize="none"
                            autoComplete="password-new"
                            returnKeyType="done"
                            onSubmitEditing={handleSignUp}
                            rightIcon={
                                <TouchableOpacity
                                    onPress={() => setShowPassword(!showPassword)}
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                >
                                    <Ionicons
                                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                        size={20}
                                        color="#6B7280"
                                    />
                                </TouchableOpacity>
                            }
                        />

                        <View>
                            <Input
                                label="Konfirmasi Kata sandi"
                                value={signupConfirmPassword}
                                onChangeText={setSignupConfirmPassword}
                                placeholder="Konfirmasikan kata sandi Anda"
                                secureTextEntry={!showConfirmPassword}
                                autoCapitalize="none"
                                autoComplete="password-new"
                                returnKeyType="done"
                                onSubmitEditing={handleSignUp}
                                rightIcon={
                                    <TouchableOpacity
                                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                    >
                                        <Ionicons
                                            name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                                            size={20}
                                            color="#6B7280"
                                        />
                                    </TouchableOpacity>
                                }
                            />
                        </View>

                        {/* Password Strength Indicator */}
                        {signupPassword.length > 0 && (
                            <View className="flex-row items-center mt-2 w-full">
                                <View className="flex-row items-center mr-2">
                                    <View
                                        className="h-1 rounded-full mr-1 w-[30%]"
                                        style={{
                                            backgroundColor: passwordStrength.bars >= 1 ? passwordStrength.color : '#E5E7EB',
                                        }}
                                    />
                                    <View
                                        className="h-1 rounded-full mr-1 w-[30%]"
                                        style={{
                                            backgroundColor: passwordStrength.bars >= 2 ? passwordStrength.color : '#E5E7EB',
                                        }}
                                    />
                                    <View
                                        className="h-1 rounded-full w-[30%]"
                                        style={{
                                            backgroundColor: passwordStrength.bars >= 3 ? passwordStrength.color : '#E5E7EB',
                                        }}
                                    />
                                </View>
                                <Text style={{ color: passwordStrength.color, fontSize: 12, fontWeight: '500' }}>
                                    {passwordStrength.strength}
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Sign Up Button */}
                    <TouchableOpacity
                        onPress={handleSignUp}
                        disabled={signupLoading}
                        className="mt-2 rounded-xl overflow-hidden"
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={['#7C3AED', '#8B5CF6']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            className="py-4 items-center"
                        >
                            <Text className="text-white text-lg font-semibold">
                                {signupLoading ? 'Mendaftar...' : 'Daftar'}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
