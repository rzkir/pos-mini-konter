import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { Ionicons } from '@expo/vector-icons';

import { router } from 'expo-router';

import { useAuth } from '@/context/AuthContext';

import Input from '@/components/ui/input';

import HeaderGradient from '@/components/ui/HeaderGradient';

export default function SignInPage() {
    const {
        signinEmail,
        setSigninEmail,
        signinPassword,
        setSigninPassword,
        showSigninPassword,
        setShowSigninPassword,
        signinLoading,
        signin,
    } = useAuth();

    const handleSignIn = async () => {
        try {
            await signin();
            // Only redirect if signin was successful (no error thrown)
            router.replace('/(tabs)');
        } catch {
            // Error is already handled in signin function
            // Don't redirect on error
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
                {/* Header with Gradient Background */}
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
                            <Text className="text-white text-sm mr-2">Don&apos;t have an account?</Text>
                            <TouchableOpacity
                                onPress={() => router.push('/auth/signup')}
                                className="bg-white/20 px-4 py-2 rounded-full"
                            >
                                <Text className="text-white font-semibold">Sign Up</Text>
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
                <View className="flex-1 bg-white px-6 pt-8">
                    {/* Title */}
                    <Text className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</Text>
                    <Text className="text-gray-500 text-base mb-8">Enter your details below</Text>

                    {/* Email Input */}
                    <Input
                        label="Email Address"
                        value={signinEmail}
                        onChangeText={setSigninEmail}
                        placeholder="Enter your email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete="email"
                        returnKeyType="next"
                    />

                    {/* Password Input */}
                    <Input
                        label="Password"
                        value={signinPassword}
                        onChangeText={setSigninPassword}
                        placeholder="Enter your password"
                        secureTextEntry={!showSigninPassword}
                        autoCapitalize="none"
                        autoComplete="password"
                        returnKeyType="done"
                        onSubmitEditing={handleSignIn}
                        rightIcon={
                            <TouchableOpacity
                                onPress={() => setShowSigninPassword(!showSigninPassword)}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <Ionicons
                                    name={showSigninPassword ? 'eye-off-outline' : 'eye-outline'}
                                    size={20}
                                    color="#6B7280"
                                />
                            </TouchableOpacity>
                        }
                    />

                    {/* Sign In Button */}
                    <TouchableOpacity
                        onPress={handleSignIn}
                        disabled={signinLoading}
                        className="mt-6 rounded-xl overflow-hidden"
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={['#7C3AED', '#8B5CF6']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            className="py-4 items-center"
                        >
                            <Text className="text-white text-lg font-semibold">
                                {signinLoading ? 'Signing in...' : 'Sign in'}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Forgot Password Link */}
                    <TouchableOpacity className="mt-4 self-center">
                        <Text className="text-purple-600 text-sm font-medium">Forgot your password?</Text>
                    </TouchableOpacity>

                    {/* Divider */}
                    <View className="flex-row items-center my-8">
                        <View className="flex-1 h-px bg-gray-200" />
                        <Text className="mx-4 text-gray-500 text-sm">Or sign in with</Text>
                        <View className="flex-1 h-px bg-gray-200" />
                    </View>

                    {/* Social Login Buttons (Optional) */}
                    <View className="flex-row justify-center gap-4 mb-8">
                        <TouchableOpacity className="w-12 h-12 rounded-full border border-gray-300 items-center justify-center">
                            <Ionicons name="logo-google" size={24} color="#4285F4" />
                        </TouchableOpacity>
                        <TouchableOpacity className="w-12 h-12 rounded-full border border-gray-300 items-center justify-center">
                            <Ionicons name="logo-facebook" size={24} color="#1877F2" />
                        </TouchableOpacity>
                        <TouchableOpacity className="w-12 h-12 rounded-full border border-gray-300 items-center justify-center">
                            <Ionicons name="logo-apple" size={24} color="#000000" />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
