import { Ionicons } from '@expo/vector-icons'

import { FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native'

import HeaderGradient from '@/components/ui/HeaderGradient'

import SuppliersCard from '@/components/products/suppliers/SuppliersCard'

import { useStateProductsSuppliers } from '@/components/products/suppliers/lib/useStateProductsSuppliers'

import ProductSuppliersLoading from '@/components/products/suppliers/ProductSuppliersLoading'

export default function SupplierList() {
    const { suppliers, loading, refreshing, onRefresh, handleEdit, handleDelete, handleAdd } = useStateProductsSuppliers()

    const renderSupplier = ({ item }: { item: any }) => (
        <SuppliersCard item={item} onEdit={handleEdit} onDelete={handleDelete} />
    )

    if (loading) {
        return (
            <ProductSuppliersLoading />
        )
    }

    return (
        <View className="flex-1 bg-background">
            {/* Header */}
            <HeaderGradient
                title="Daftar Supplier"
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View className="w-10 h-10 rounded-full bg-white/30 items-center justify-center mr-3">
                            <Ionicons name="business-outline" size={20} color="white" />
                        </View>
                        <View>
                            <Text className="text-white font-bold">Daftar Supplier</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={handleAdd}
                        className="bg-white/20 px-4 py-2 rounded-lg flex-row items-center"
                        style={{ borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.3)' }}
                    >
                        <Ionicons name="add" size={16} color="white" />
                        <Text className="text-white font-semibold ml-1">Tambah</Text>
                    </TouchableOpacity>
                </View>
            </HeaderGradient>

            {/* Suppliers List */}
            <FlatList
                data={suppliers}
                renderItem={renderSupplier}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ padding: 8 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#FF9228']}
                        tintColor="#3B82F6"
                        title="Memuat ulang..."
                        titleColor="#6B7280"
                    />
                }
                ListEmptyComponent={
                    <View className="items-center justify-center min-h-[500px]">
                        <Ionicons name="business-outline" size={64} color="#9CA3AF" />
                        <Text className="text-gray-500 text-center mt-4 text-lg">
                            Belum ada supplier
                        </Text>
                        <Text className="text-gray-400 text-center mt-2">
                            Tambahkan supplier pertama untuk mengatur produk
                        </Text>
                        <TouchableOpacity
                            onPress={handleAdd}
                            className="bg-accent-primary px-6 py-3 rounded-lg mt-4"
                        >
                            <Text className="text-white font-semibold">
                                Tambah Supplier Pertama
                            </Text>
                        </TouchableOpacity>
                    </View>
                }
            />
        </View>
    )
}