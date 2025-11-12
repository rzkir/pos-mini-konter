import { FlatList, Text, TouchableOpacity, View, RefreshControl } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import FilterBottomSheet from '@/components/products/products/FilterBottomSheet';

import HeaderGradient from '@/components/ui/HeaderGradient';

import AllProductsCard from '@/components/products/all-products/AllProductsCard';

import { useStateAllProducts } from '@/components/products/all-products/lib/useStateAllProducts';

export default function AllProducts() {
    const {
        router,
        loading,
        categories,
        sizes,
        formatIDR,
        refreshing,
        showFilterSheet,
        selectedCategoryId,
        selectedSizeId,
        filteredList,
        onRefresh,
        handleOpenFilter,
        handleCloseFilter,
        handleApplyFilter,
        handleResetFilter,
    } = useStateAllProducts();

    const renderItem = ({ item }: { item: any }) => (
        <AllProductsCard item={item} formatIDR={formatIDR} />
    );

    return (
        <View className="flex-1 bg-background">
            <HeaderGradient
                icon="AP"
                title="All Products"
                subtitle="Semua produk tersedia"
                colors={['#FF9228', '#FF9228']}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 rounded-full bg-white/30 items-center justify-center mr-3">
                            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
                        </TouchableOpacity>

                        <View className='flex-col gap-1'>
                            <Text className="text-white font-bold">All Products</Text>
                            <Text className="text-white/80 text-xs">Semua produk tersedia</Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={handleOpenFilter}
                        className="w-10 h-10 rounded-full bg-white/30 items-center justify-center"
                    >
                        <Ionicons name="filter-outline" size={20} color="#FFFFFF" />
                        {(selectedCategoryId !== null || selectedSizeId !== null) && (
                            <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 items-center justify-center border-2 border-white">
                                <Text className="text-white text-[10px] font-bold">
                                    {(selectedCategoryId !== null ? 1 : 0) + (selectedSizeId !== null ? 1 : 0)}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </HeaderGradient>

            {loading ? (
                <View className="flex-1 items-center justify-center px-2 pt-4">
                    <Ionicons name="cube-outline" size={32} color="#3B82F6" />
                    <Text className="mt-2 text-gray-600">Memuat produk...</Text>
                </View>
            ) : filteredList.length === 0 ? (
                <View className="flex-1 items-center justify-center px-2 pt-4">
                    <Ionicons name="pricetags-outline" size={40} color="#3B82F6" />

                    <Text className="mt-4 text-gray-600 text-lg">Tidak ada produk</Text>

                    <View className="items-center justify-center">
                        <TouchableOpacity
                            onPress={() => router.push('/products/new')}
                            className="mt-4 bg-blue-600 py-3 px-6 rounded-xl items-center justify-center"
                        >
                            <Text className="text-white font-semibold text-lg">Tambah Produk</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <>
                    <FlatList
                        data={filteredList}
                        keyExtractor={(item: any) => item.id.toString()}
                        renderItem={renderItem}
                        contentContainerStyle={{ paddingHorizontal: 8, paddingTop: 16 }}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={['#3B82F6']}
                                tintColor="#3B82F6"
                                title="Memuat ulang..."
                                titleColor="#6B7280"
                            />
                        }
                    />

                    {/* Filter Bottom Sheet */}
                    <FilterBottomSheet
                        visible={showFilterSheet}
                        categories={categories}
                        sizes={sizes}
                        selectedCategoryId={selectedCategoryId}
                        selectedSizeId={selectedSizeId}
                        onClose={handleCloseFilter}
                        onApply={handleApplyFilter}
                        onReset={handleResetFilter}
                    />
                </>
            )}
        </View>
    );
}