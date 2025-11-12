import { ActivityIndicator, Text, View } from 'react-native';

export default function ProductLoading() {
    return (
        <View className="flex-1 bg-background items-center justify-center px-4">
            <ActivityIndicator size="large" color="#1E90FF" />
            <Text className="mt-3 text-text-primary font-semibold">Memuat produk...</Text>
        </View>
    );
}