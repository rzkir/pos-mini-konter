import { LinearGradient } from 'expo-linear-gradient';

import { View, Text, Image } from 'react-native';

export default function HeaderGradient({
    colors = ['#FF9228', '#FF9228'],
    start = { x: 0, y: 0 },
    end = { x: 1, y: 1 },
    style,
    icon,
    logoUrl,
    title,
    subtitle,
    children,
}: HeaderGradientProps) {
    return (
        <LinearGradient
            colors={colors}
            start={start}
            end={end}
            style={[
                {
                    paddingHorizontal: 16,
                    paddingTop: 28,
                    paddingBottom: 24,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                },
                style,
            ]}
        >
            {children || (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {logoUrl ? (
                        <View className="w-10 h-10 rounded-full bg-white/30 items-center justify-center mr-3 overflow-hidden">
                            <Image
                                source={{ uri: logoUrl }}
                                className="w-full h-full"
                                resizeMode="cover"
                            />
                        </View>
                    ) : icon && (
                        <View className="w-10 h-10 rounded-full bg-white/30 items-center justify-center mr-3">
                            <Text className="text-white font-bold">{icon}</Text>
                        </View>
                    )}
                    <View>
                        <Text className="text-white font-bold">{title}</Text>
                        {subtitle && (
                            <Text className="text-white/80 text-xs">{subtitle}</Text>
                        )}
                    </View>
                </View>
            )}
        </LinearGradient>
    );
}