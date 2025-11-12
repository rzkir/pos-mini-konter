import React from 'react';

import { View, Text, TouchableOpacity, TextInput, Image } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import BottomSheet from '@/helper/bottomsheets/BottomSheet';

import FilterBottomSheet from '@/components/products/products/FilterBottomSheet';

export default function ProductsBottomSheet({
    visible,
    onClose,
    products,
    filteredProducts,
    searchTerm,
    setSearchTerm,
    selectedProducts,
    setSelectedProducts,
    formatIDR,
    addProductQty,
    subProductQty,
    handleAddProducts,
    categories,
    sizes,
    selectedCategoryId,
    selectedSizeId,
    handleApplyFilters,
    handleResetFilters,
}: ProductsBottomSheetProps) {
    const [showFilterSheet, setShowFilterSheet] = React.useState(false);
    const hasActiveFilter = selectedCategoryId !== null || selectedSizeId !== null;

    const handleClose = () => {
        setSearchTerm('');
        setSelectedProducts({});
        onClose();
    };

    return (
        <BottomSheet
            visible={visible}
            title="Pilih Produk"
            onClose={handleClose}
            maxHeightPercent={0.9}
            footer={
                Object.keys(selectedProducts).length > 0 ? (
                    <View className="bg-black rounded-2xl p-4">
                        <View className="flex-row items-center justify-between mb-3">
                            <View className="flex-1">
                                <Text className="text-white text-sm">
                                    {Object.values(selectedProducts).reduce((a, b) => a + b, 0)} item dipilih
                                </Text>
                                <Text className="text-gray-300 text-xs mt-1" numberOfLines={1}>
                                    {(() => {
                                        const selectedProductNames = Object.keys(selectedProducts)
                                            .map(pid => {
                                                const p = products.find((pp: any) => pp.id === Number(pid));
                                                return p?.name;
                                            })
                                            .filter(Boolean);
                                        const maxDisplay = 2;
                                        if (selectedProductNames.length <= maxDisplay) {
                                            return selectedProductNames.join(', ');
                                        }
                                        return selectedProductNames.slice(0, maxDisplay).join(', ') +
                                            ` +${selectedProductNames.length - maxDisplay} lainnya`;
                                    })()}
                                </Text>
                            </View>
                            <Text className="text-white font-bold ml-3">
                                {formatIDR(
                                    Object.entries(selectedProducts).reduce((sum, [pid, qty]) => {
                                        const p = products.find((pp: any) => pp.id === Number(pid));
                                        return sum + ((p?.price || 0) * qty);
                                    }, 0)
                                )}
                            </Text>
                        </View>

                        <TouchableOpacity
                            onPress={handleAddProducts}
                            className="bg-orange-500 rounded-xl py-3 items-center"
                        >
                            <Text className="text-white font-semibold">Tambah ke Transaksi</Text>
                        </TouchableOpacity>
                    </View>
                ) : undefined
            }
        >
            {/* Search Bar and Filter */}
            <View className="mb-4 px-3">
                <View className="flex-row items-center gap-2 mb-3">
                    <View className="bg-white rounded-xl flex-1 flex-row items-center px-4 py-1 border border-gray-200">
                        <Ionicons name="search" size={18} color="#6B7280" />
                        <TextInput
                            className="ml-2 flex-1 text-gray-800"
                            placeholder="Cari produk..."
                            placeholderTextColor="#9CA3AF"
                            value={searchTerm}
                            onChangeText={setSearchTerm}
                        />
                        {searchTerm.length > 0 && (
                            <TouchableOpacity onPress={() => setSearchTerm('')}>
                                <Ionicons name="close-circle" size={20} color="#9CA3AF" />
                            </TouchableOpacity>
                        )}
                    </View>

                    <TouchableOpacity
                        onPress={() => setShowFilterSheet(true)}
                        className={`px-4 py-3.5 rounded-xl border ${hasActiveFilter
                            ? 'bg-orange-500 border-orange-400'
                            : 'bg-white border-gray-200'
                            }`}
                    >
                        <View className="flex-row items-center">
                            <Ionicons
                                name="filter"
                                size={18}
                                color={hasActiveFilter ? '#fff' : '#6B7280'}
                            />
                            {hasActiveFilter && (
                                <View className="ml-1 w-2 h-2 rounded-full bg-white" />
                            )}
                        </View>
                    </TouchableOpacity>
                </View>
                {/* Active Filters Display */}
                {hasActiveFilter && (
                    <View className="flex-row items-center gap-2 mb-2">
                        {selectedCategoryId !== null && (
                            <View className="flex-row items-center bg-orange-100 px-3 py-1.5 rounded-lg">
                                <Text className="text-xs font-medium text-orange-700 mr-1">
                                    {categories.find((c: any) => c.id === selectedCategoryId)?.name || 'Kategori'}
                                </Text>
                                <TouchableOpacity
                                    onPress={() => handleApplyFilters(null, selectedSizeId)}
                                >
                                    <Ionicons name="close-circle" size={14} color="#EA580C" />
                                </TouchableOpacity>
                            </View>
                        )}
                        {selectedSizeId !== null && (
                            <View className="flex-row items-center bg-orange-100 px-3 py-1.5 rounded-lg">
                                <Text className="text-xs font-medium text-orange-700 mr-1">
                                    {sizes.find((s: any) => s.id === selectedSizeId)?.name || 'Ukuran'}
                                </Text>
                                <TouchableOpacity
                                    onPress={() => handleApplyFilters(selectedCategoryId, null)}
                                >
                                    <Ionicons name="close-circle" size={14} color="#EA580C" />
                                </TouchableOpacity>
                            </View>
                        )}
                        <TouchableOpacity
                            onPress={handleResetFilters}
                            className="flex-row items-center px-3 py-1.5 rounded-lg bg-gray-100"
                        >
                            <Text className="text-xs font-medium text-gray-700 mr-1">
                                Reset
                            </Text>
                            <Ionicons name="close" size={14} color="#374151" />
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {/* Products List */}
            {filteredProducts.length > 0 ? (
                <View className="flex-row flex-wrap px-2">
                    {filteredProducts.map((item: any) => {
                        const qty = selectedProducts[item.id] || 0;
                        return (
                            <View key={item.id.toString()} className="w-1/2 px-1 mb-3">
                                <View className="bg-white rounded-2xl p-3 border border-gray-200">
                                    {/* Product Image */}
                                    <View className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 items-center justify-center mb-2">
                                        {item.image_url ? (
                                            <Image
                                                source={{ uri: item.image_url }}
                                                className="w-full h-full"
                                                resizeMode="cover"
                                            />
                                        ) : (
                                            <Ionicons name="image-outline" size={28} color="#9CA3AF" />
                                        )}
                                    </View>

                                    {/* Stock */}
                                    <View className="flex-row items-center mb-1">
                                        <View className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-1" />
                                        <Text className="text-[10px] text-gray-600 font-semibold">
                                            Stok: {item.stock ?? 0}
                                        </Text>
                                    </View>

                                    {/* Product Name */}
                                    <Text numberOfLines={2} className="text-sm font-bold text-gray-900 mb-1">
                                        {item.name}
                                    </Text>

                                    {/* Price */}
                                    <Text className="text-sm font-bold text-orange-500 mb-2">
                                        {formatIDR(item.price || 0)}
                                    </Text>

                                    {/* Quantity Controls */}
                                    {qty === 0 ? (
                                        <TouchableOpacity
                                            onPress={() => addProductQty(item.id)}
                                            className="w-full bg-orange-500 rounded-lg py-2 items-center justify-center"
                                        >
                                            <Ionicons name="add" size={18} color="white" />
                                        </TouchableOpacity>
                                    ) : (
                                        <View className="flex-row items-center justify-between">
                                            <TouchableOpacity
                                                onPress={() => subProductQty(item.id)}
                                                className="w-8 h-8 bg-gray-200 rounded-lg items-center justify-center"
                                            >
                                                <Ionicons name="remove" size={16} color="#374151" />
                                            </TouchableOpacity>
                                            <Text className="text-sm font-semibold text-gray-900 min-w-[30px] text-center">
                                                {qty}
                                            </Text>
                                            <TouchableOpacity
                                                onPress={() => addProductQty(item.id)}
                                                className="w-8 h-8 bg-orange-500 rounded-lg items-center justify-center"
                                            >
                                                <Ionicons name="add" size={16} color="white" />
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                            </View>
                        );
                    })}
                </View>
            ) : (
                <View className="items-center justify-center py-12">
                    <Ionicons name="search-outline" size={48} color="#9CA3AF" />
                    <Text className="text-gray-500 mt-3 text-center">
                        {searchTerm ? 'Produk tidak ditemukan' : 'Tidak ada produk'}
                    </Text>
                </View>
            )}

            {/* Filter Bottom Sheet */}
            <FilterBottomSheet
                visible={showFilterSheet}
                categories={categories}
                sizes={sizes}
                selectedCategoryId={selectedCategoryId}
                selectedSizeId={selectedSizeId}
                onClose={() => setShowFilterSheet(false)}
                onApply={handleApplyFilters}
                onReset={handleResetFilters}
            />
        </BottomSheet>
    );
}
