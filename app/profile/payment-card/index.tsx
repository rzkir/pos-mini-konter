import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';

import { router } from 'expo-router';

import { Ionicons } from '@expo/vector-icons';

import HeaderGradient from '@/components/ui/HeaderGradient';

import { useStatePaymentCard } from '@/components/profile/payment-card/useStatePaymentCard';

export default function PaymentCardList() {
    const { cards, loading, refreshing, onRefresh, handleAdd, handleEdit, handleDelete } = useStatePaymentCard();

    return (
        <View className="flex-1 bg-background">
            <HeaderGradient
                title="Metode Pembayaran"
                colors={['#FF9228', '#FF9228']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View className="flex-row justify-between items-center flex-1">
                    <View className="flex-1">
                        <Text className="text-2xl font-bold text-white mb-1">Metode Pembayaran</Text>
                        <Text className="text-white/80 text-md">Kelola bank, e-wallet, dan QRIS</Text>
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
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#FF9228']}
                        tintColor="#FF9228"
                    />
                }
            >
                <View className="px-4 mt-4">
                    {loading ? (
                        <Text className="text-gray-500">Memuat...</Text>
                    ) : cards.length === 0 ? (
                        <View className="bg-card rounded-2xl p-6 items-center border border-border">
                            <Text className="text-gray-600">Belum ada metode pembayaran</Text>
                        </View>
                    ) : (
                        <View className="flex-row flex-wrap gap-4">
                            {cards.map((card) => (
                                <View key={card.id} className="bg-card rounded-2xl p-4 border border-border" style={{ width: '48%' }}>
                                    <View className="flex-1">
                                        <Text className="text-lg font-semibold text-gray-900 mb-1">{card.method.toUpperCase()}</Text>
                                        {card.bank ? <Text className="text-gray-600">Bank: {card.bank.toUpperCase()}</Text> : null}
                                        {card.account_number ? <Text className="text-gray-600">No: {card.account_number}</Text> : null}
                                        {card.holder_name ? <Text className="text-gray-600">Nama: {card.holder_name}</Text> : null}
                                        <Text className="text-gray-500 text-xs mt-1">{card.is_active ? 'Aktif' : 'Nonaktif'}</Text>
                                    </View>

                                    <View className="flex-row items-center mt-2">
                                        <TouchableOpacity className="mr-3" onPress={() => handleEdit(card.id)}>
                                            <Ionicons name="create-outline" size={22} color="#1f2937" />
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={() => handleDelete(card.id)}>
                                            <Ionicons name="trash-outline" size={22} color="#ef4444" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            </ScrollView>

            <TouchableOpacity
                onPress={handleAdd}
                className="w-14 h-14 rounded-full items-center justify-center"
                style={{ position: 'absolute', bottom: 24, right: 24, backgroundColor: '#FF9228', elevation: 6 }}
            >
                <Ionicons name="add" size={28} color="#fff" />
            </TouchableOpacity>
        </View>
    );
}