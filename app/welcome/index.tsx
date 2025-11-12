import AsyncStorage from '@react-native-async-storage/async-storage';

import { router } from 'expo-router';

import { useState, useEffect } from 'react';

import { Text, TouchableOpacity, View } from 'react-native';

const onboardingData = [
    {
        id: 1,
        title: 'Choose Products',
        description: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.',
        illustration: '🛍️',
    },

    {
        id: 2,
        title: 'Make Payment',
        description: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.',
        illustration: '💳',
    },

    {
        id: 3,
        title: 'Get Your Order',
        description: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.',
        illustration: '📦',
    },
];

export default function OnboardingScreen() {
    useEffect(() => {
        (async () => {
            const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
            if (isLoggedIn === 'true') {
                router.replace('/(tabs)');
            }
        })();
    }, []);

    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        if (currentIndex < onboardingData.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            handleGetStarted();
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleSkip = async () => {
        await AsyncStorage.setItem('onboarding_completed', 'true');
        router.replace('/(tabs)');
    };

    const handleGetStarted = async () => {
        await AsyncStorage.setItem('onboarding_completed', 'true');
        router.replace('/(tabs)');
    };

    const currentData = onboardingData[currentIndex];

    return (
        <View className="flex-1 bg-white py-4">
            {/* Status Bar */}
            <View className="flex-row justify-between items-center px-6">
                <Text className="text-black font-medium text-base">9:41</Text>
                <View className="flex-row items-center">
                    <Text className="text-black font-medium text-base mr-2">
                        {currentIndex + 1}/{onboardingData.length}
                    </Text>
                    <TouchableOpacity onPress={handleSkip}>
                        <Text className="text-black font-medium text-base">Skip</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Main Content */}
            <View className="flex-1 justify-center items-center px-6">
                {/* Illustration */}
                <View className="mb-16">
                    <Text className="text-9xl text-center">{currentData.illustration}</Text>
                </View>

                {/* Title */}
                <Text className="text-4xl font-bold text-black text-center mb-8">
                    {currentData.title}
                </Text>

                {/* Description */}
                <Text className="text-lg text-gray-400 text-center leading-7 max-w-sm font-normal">
                    {currentData.description}
                </Text>
            </View>

            {/* Bottom Navigation */}
            <View className="px-6">
                {/* Pagination Dots */}
                <View className="flex-row justify-center mb-10">
                    {onboardingData.map((_, index) => (
                        <View
                            key={index}
                            className={`${index === currentIndex ? 'w-4 h-4' : 'w-3 h-3'} rounded-full mx-2 ${index <= currentIndex ? 'bg-red-500' : 'bg-gray-300'}`}
                        />
                    ))}
                </View>

                {/* Navigation Buttons */}
                <View className="flex-row justify-between items-center">
                    <TouchableOpacity
                        onPress={handlePrev}
                        disabled={currentIndex === 0}
                        className={`px-6 py-3 rounded-lg ${currentIndex === 0 ? 'opacity-30' : 'bg-gray-100'}`}
                    >
                        <Text className={`text-lg font-medium ${currentIndex === 0 ? 'text-gray-400' : 'text-gray-600'}`}>
                            Prev
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleNext}
                        className={`px-10 py-4 rounded-lg ${currentIndex === onboardingData.length - 1 ? 'bg-green-500' : 'bg-red-500'}`}
                    >
                        <Text className="text-white font-medium text-xl">
                            {currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}