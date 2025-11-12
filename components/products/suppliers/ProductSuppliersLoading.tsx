import { View, ActivityIndicator, Text } from 'react-native';

export default function ProductSuppliersLoading() {
    return (
        <View className="flex-1 bg-background items-center justify-center px-4">
            <ActivityIndicator size="large" color="#FF9228" />
            <Text className="mt-3 text-text-primary font-semibold">Memuat supplier...</Text>
        </View>
    );
}