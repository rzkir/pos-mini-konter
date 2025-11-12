
import { useStateProductsCategory } from '@/components/products/category/lib/useStateProductsCategory'

import { Ionicons } from '@expo/vector-icons'

import { FlatList, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native'

import { useAppSettingsContext } from '@/context/AppSettingsContext'

import HeaderGradient from '@/components/ui/HeaderGradient'

import ProductCategoryLoading from '@/components/products/category/ProductCategoryLoading'

import ProductsCategoryCard from '@/components/products/category/ProductsCategoryCard'

export default function CategoryList() {
    const { categories, loading, refreshing, onRefresh, handleEdit, handleDelete, handleAdd } = useStateProductsCategory()
    const { formatDate } = useAppSettingsContext()

    if (loading) {
        return (
            <ProductCategoryLoading />
        )
    }

    return (
        <View className="flex-1 bg-background">
            {/* Header */}
            <HeaderGradient
                title="Daftar Kategori"
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View className="w-10 h-10 rounded-full bg-white/30 items-center justify-center mr-3">
                            <Ionicons name="grid-outline" size={20} color="white" />
                        </View>
                        <View>
                            <Text className="text-white font-bold">Daftar Kategori</Text>
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

            {/* Grid */}
            {categories.length > 0 ? (
                <FlatList
                    className="px-1 mt-4"
                    data={categories}
                    keyExtractor={(item) => String(item.id)}
                    numColumns={2}
                    columnWrapperStyle={{ paddingHorizontal: 2 }}
                    renderItem={({ item }) => (
                        <ProductsCategoryCard
                            item={item}
                            formatDate={formatDate}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    )}
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
                    ListFooterComponent={<View className="h-2" />}
                />
            ) : (
                <ScrollView
                    className="flex-1"
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
                >
                    <View className="items-center justify-center min-h-[500px] mx-4">
                        <Ionicons name="grid-outline" size={64} color="#9CA3AF" />
                        <Text className="text-gray-500 text-center mt-4 text-lg">
                            Belum ada kategori
                        </Text>
                        <Text className="text-gray-400 text-center mt-2">
                            Tambahkan kategori pertama untuk mengatur produk
                        </Text>
                        <TouchableOpacity
                            onPress={handleAdd}
                            className="bg-accent-primary px-6 py-3 rounded-lg mt-4"
                        >
                            <Text className="text-white font-semibold">
                                Tambah Kategori Pertama
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            )}
        </View>
    )
}