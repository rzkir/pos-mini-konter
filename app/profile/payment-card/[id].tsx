import { View, Text, TouchableOpacity, ScrollView, Switch, Image } from 'react-native';

import { useLocalSearchParams, router } from 'expo-router';

import { Ionicons } from '@expo/vector-icons';

import HeaderGradient from '@/components/ui/HeaderGradient';

import Input from '@/components/ui/input';

import { useStateCreatePaymentCard } from '@/components/profile/payment-card/create/useStateCreatePayementCard';

export default function PaymentCardForm() {
    const params = useLocalSearchParams();
    const idParam = params.id as string | undefined;

    const {
        isNew,
        method,
        setMethod,
        bank,
        setBank,
        accountNumber,
        setAccountNumber,
        holderName,
        setHolderName,
        isActive,
        setIsActive,
        loading,
        image,
        needsBank,
        Methods,
        Banks,
        save,
        handlePickImage,
    } = useStateCreatePaymentCard(idParam);

    return (
        <View className="flex-1 bg-background">
            <HeaderGradient
                title={`${isNew ? 'Tambah' : 'Edit'} Metode`}
                colors={['#FF9228', '#FF9228']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View className="flex-row justify-between items-center flex-1">
                    <View className="flex-1">
                        <Text className="text-2xl font-bold text-white mb-1">{isNew ? 'Tambah' : 'Edit'} Metode</Text>
                        <Text className="text-white/80 text-md">Atur bank, e-wallet, atau QRIS</Text>
                    </View>
                    <TouchableOpacity className="w-10 h-10 bg-white/20 rounded-full items-center justify-center" onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={20} color="white" />
                    </TouchableOpacity>
                </View>
            </HeaderGradient>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="px-4 mt-4 mb-4 flex-col gap-4">
                    {/* Method */}
                    <View className="bg-card rounded-2xl p-4 border border-border">
                        <Text className="text-gray-800 font-semibold mb-2">Metode</Text>
                        <View className="flex-row flex-wrap">
                            {Methods.map(m => (
                                <TouchableOpacity key={m} onPress={() => setMethod(m)} className={`px-3 py-2 mr-2 mb-2 rounded-xl ${method === m ? 'bg-orange-600' : 'bg-gray-100'}`}>
                                    <Text className={`text-sm ${method === m ? 'text-white' : 'text-gray-800'}`}>{m.toUpperCase()}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Bank (conditional) */}
                    {needsBank ? (
                        <View className="bg-card rounded-2xl p-4 border border-border">
                            <Text className="text-gray-800 font-semibold mb-2">Bank</Text>
                            <View className="flex-row flex-wrap">
                                {Banks.map(b => (
                                    <TouchableOpacity key={b} onPress={() => setBank(b)} className={`px-3 py-2 mr-2 mb-2 rounded-xl ${bank === b ? 'bg-orange-600' : 'bg-gray-100'}`}>
                                        <Text className={`text-sm ${bank === b ? 'text-white' : 'text-gray-800'}`}>{b.toUpperCase()}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    ) : null}

                    {/* Account number */}
                    {method !== 'qris' && (
                        <View className="bg-card rounded-2xl p-4 border border-border">
                            <Input
                                label="Nomor Akun/VA/QR"
                                value={accountNumber}
                                onChangeText={setAccountNumber}
                                keyboardType="numeric"
                            />
                        </View>
                    )}

                    {/* Holder name */}
                    <View className="bg-card rounded-2xl p-4 border border-border">
                        <Input
                            label="Nama Pemilik/Outlet"
                            value={holderName}
                            onChangeText={setHolderName}
                            keyboardType="default"
                        />
                    </View>

                    {/* Active */}
                    <View className="bg-card rounded-2xl p-4 flex-row items-center justify-between border border-border">
                        <Text className="text-gray-800 font-semibold">Aktif</Text>
                        <Switch value={isActive} onValueChange={setIsActive} />
                    </View>

                    {method === 'qris' && (
                        <View className="bg-card rounded-2xl p-4 border border-border">
                            <Text className="text-gray-900 font-semibold mb-3">Gambar QRIS</Text>
                            <View style={{ alignItems: 'center' }}>
                                {image?.url ? (
                                    <Image source={{ uri: image.url }} style={{ width: 160, height: 160, borderRadius: 12, marginBottom: 12 }} />
                                ) : (
                                    <View style={{ width: 160, height: 160, borderRadius: 12, marginBottom: 12, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ color: '#9CA3AF' }}>Belum ada QR</Text>
                                    </View>
                                )}
                                <TouchableOpacity onPress={handlePickImage} style={{ backgroundColor: '#2563EB', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 }}>
                                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Pilih Gambar QRIS</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    <TouchableOpacity onPress={save} disabled={loading} className="bg-orange-600 rounded-2xl p-4 items-center">
                        <Text className="text-white font-bold">{loading ? 'Menyimpan...' : 'Simpan'}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}