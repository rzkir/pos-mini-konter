import { View, Text } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

export default function SectionTitle({
    title,
    subtitle,
    icon,
    className,
}: {
    title: string;
    subtitle?: string;
    icon?: keyof typeof Ionicons.glyphMap;
    className?: string;
}) {
    return (
        <View className={`mb-3 ${className ?? ''}`}>
            <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                    <View className="w-1 h-5 rounded-full bg-accent-primary mr-3" />
                    <View>
                        <Text className="text-base font-extrabold text-gray-900">{title}</Text>
                        {subtitle ? (
                            <Text className="text-xs text-gray-500 mt-0.5">{subtitle}</Text>
                        ) : null}
                    </View>
                </View>
                {icon ? (
                    <View className="w-8 h-8 rounded-full items-center justify-center bg-gray-100">
                        <Ionicons name={icon as any} size={16} color="#6b7280" />
                    </View>
                ) : null}
            </View>
            <View className="mt-2 h-[1px] bg-gray-100" />
        </View>
    );
}