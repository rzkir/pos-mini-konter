import { useState, useCallback, useMemo } from 'react'

import { router } from 'expo-router'

import { useStateProducts } from '@/components/products/beranda/lib/useStateProducts'

import { Image, RefreshControl, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'

import { Ionicons } from '@expo/vector-icons'

import HeaderGradient from '@/components/ui/HeaderGradient';

import FilterBottomSheet from '@/components/products/products/FilterBottomSheet'

import { useCategories } from '@/hooks/useCategories'

import { useSizes } from '@/hooks/useSizes'

export default function Checkout() {
    const {
        search,
        setSearch,
        productIdToQty,
        addQty,
        subQty,
        products,
        formatIDR,
        companyProfile,
        refreshData,
        selectedCount,
        selectedTotal,
        handleCartPress,
    } = useStateProducts()

    const { categories } = useCategories()
    const { sizes } = useSizes()

    const [refreshing, setRefreshing] = useState(false)
    const [showFilterSheet, setShowFilterSheet] = useState(false)
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
    const [selectedSizeId, setSelectedSizeId] = useState<number | null>(null)

    const onRefresh = useCallback(async () => {
        setRefreshing(true)
        try {
            await refreshData()
        } finally {
            setRefreshing(false)
        }
    }, [refreshData])

    // Filter products based on search, category, and size
    const filteredProducts = useMemo(() => {
        let filtered = [...products]

        // Filter by search
        if (search) {
            const query = search.toLowerCase()
            filtered = filtered.filter((product: any) =>
                product.name.toLowerCase().includes(query) ||
                product.barcode?.toLowerCase().includes(query)
            )
        }

        // Filter by category
        if (selectedCategoryId !== null) {
            filtered = filtered.filter(
                (product: any) => product?.category_id === selectedCategoryId
            )
        }

        // Filter by size
        if (selectedSizeId !== null) {
            filtered = filtered.filter(
                (product: any) => product?.size_id === selectedSizeId
            )
        }

        return filtered
    }, [products, search, selectedCategoryId, selectedSizeId])

    const hasActiveFilter = selectedCategoryId !== null || selectedSizeId !== null

    const handleApplyFilter = useCallback((categoryId: number | null, sizeId: number | null) => {
        setSelectedCategoryId(categoryId)
        setSelectedSizeId(sizeId)
    }, [])

    const handleResetFilter = useCallback(() => {
        setSelectedCategoryId(null)
        setSelectedSizeId(null)
    }, [])

    return (
        <View className="flex-1 bg-background">
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#FF9228']} />
                }
                contentContainerStyle={{ paddingBottom: selectedCount > 0 ? 100 : 0 }}
            >
                {/* Header */}
                <HeaderGradient
                    icon={!companyProfile?.logo_url ? "SP" : undefined}
                    logoUrl={companyProfile?.logo_url}
                    title={companyProfile?.name || "Kasir Mini"}
                    subtitle={companyProfile?.address || "Jalan Leuwiliang, Kota Bogor"}
                >
                    <View className='flex-row items-center flex-1 justify-between mb-4' >
                        <View className='flex-row items-center' >
                            {companyProfile?.logo_url ? (
                                <View className="w-10 h-10 rounded-full bg-white/30 items-center justify-center mr-3 overflow-hidden">
                                    <Image
                                        source={{ uri: companyProfile.logo_url }}
                                        className="w-full h-full"
                                        resizeMode="cover"
                                    />
                                </View>
                            ) : (
                                <View className="w-10 h-10 rounded-full bg-white/30 items-center justify-center mr-3">
                                    <Text className="text-white font-bold">SP</Text>
                                </View>
                            )}
                            <View>
                                <Text className="text-white font-bold">{companyProfile?.name || "Kasir Mini"}</Text>
                                {companyProfile?.address && (
                                    <Text className="text-white/80 text-xs max-w-[250px] line-clamp-1">{companyProfile.address}</Text>
                                )}
                            </View>
                        </View>
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="w-10 h-10 rounded-full bg-white/30 items-center justify-center"
                        >
                            <Ionicons name="arrow-back" size={22} color="white" />
                        </TouchableOpacity>
                    </View>
                </HeaderGradient>

                {/* Search Bar */}
                <View className="px-4 mt-[-15px] relative">
                    <View className="bg-white rounded-2xl flex-row items-center px-4 py-3 shadow">
                        <Ionicons name="search" size={18} className="text-gray-500" />
                        <TextInput
                            className="ml-2 flex-1 text-gray-800"
                            placeholder="Cari produk..."
                            value={search}
                            onChangeText={setSearch}
                        />
                        <TouchableOpacity
                            onPress={() => setShowFilterSheet(true)}
                            className="ml-2 w-10 h-10 rounded-full items-center justify-center relative"
                            style={{ backgroundColor: hasActiveFilter ? '#FF9228' : 'transparent' }}
                        >
                            <Ionicons
                                name="options-outline"
                                size={20}
                                color={hasActiveFilter ? 'white' : '#6B7280'}
                            />
                            {hasActiveFilter && (
                                <View className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 border border-white" />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Products Grid */}
                {filteredProducts.length > 0 ? (
                    <View className="px-2 mt-4 flex-row flex-wrap">
                        {filteredProducts.map((item: any) => {
                            const qty = productIdToQty[item.id] || 0
                            return (
                                <View key={item.id.toString()} className="px-1 mb-4 w-1/2">
                                    <View className="bg-white rounded-2xl flex-col gap-1.5 p-3 border border-border shadow-sm">
                                        {/* Product Image */}
                                        <View className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 items-center justify-center">
                                            {item.image_url ? (
                                                <Image
                                                    source={{ uri: item.image_url }}
                                                    className="w-full h-full"
                                                    resizeMode="cover"
                                                />
                                            ) : (
                                                <Ionicons name="image-outline" size={28} className="text-gray-400" />
                                            )}
                                        </View>

                                        {/* Stock Remaining */}
                                        <View className="mt-1 flex-row items-center">
                                            <View className="w-1.5 h-1.5 rounded-full bg-accent-primary mr-1" />
                                            <Text className="text-[11px] text-accent-primary font-semibold">
                                                • {item.stock ?? 0} Remaining
                                            </Text>
                                        </View>

                                        {/* Product Name */}
                                        <Text numberOfLines={1} className="text-base font-bold text-text-secondary">
                                            {item.name}
                                        </Text>

                                        {/* Price and Add to Cart */}
                                        <View className="flex-row items-center justify-between">
                                            <Text className="text-base font-bold text-accent-primary">
                                                {formatIDR(item.price || 0)}
                                            </Text>
                                            {qty === 0 ? (
                                                <TouchableOpacity
                                                    onPress={() => addQty(item.id)}
                                                    className="w-10 h-10 rounded-full bg-accent-primary items-center justify-center shadow"
                                                >
                                                    <Ionicons name="add" size={18} color="white" />
                                                </TouchableOpacity>
                                            ) : (
                                                <View className="flex-row items-center">
                                                    <TouchableOpacity
                                                        onPress={() => subQty(item.id)}
                                                        className="w-10 h-10 rounded-full bg-accent-primary items-center justify-center shadow"
                                                    >
                                                        <Ionicons name="remove" size={18} color="white" />
                                                    </TouchableOpacity>

                                                    <View className="mx-2 bg-white border border-gray-200 rounded-lg px-2 py-1 min-w-[30px] items-center">
                                                        <Text className="text-sm font-semibold text-gray-900">{qty}</Text>
                                                    </View>

                                                    <TouchableOpacity
                                                        onPress={() => addQty(item.id)}
                                                        className="w-10 h-10 rounded-full bg-accent-primary items-center justify-center shadow"
                                                    >
                                                        <Ionicons name="add" size={18} color="white" />
                                                    </TouchableOpacity>
                                                </View>
                                            )}
                                        </View>
                                    </View>
                                </View>
                            )
                        })}
                    </View>
                ) : products.length === 0 ? (
                    <View className="px-4 items-center justify-center min-h-[500px]">
                        <View className="bg-gray-100 w-24 h-24 rounded-full items-center justify-center mb-4">
                            <Ionicons name="fast-food-outline" size={48} color="#9CA3AF" />
                        </View>

                        <Text className="text-lg font-semibold text-gray-700 mb-2">Tidak ada produk</Text>
                        <Text className="text-sm text-gray-500 text-center mb-4">
                            {search ? 'Tidak ada produk yang sesuai dengan pencarian Anda' : 'Belum ada produk tersedia'}
                        </Text>
                    </View>
                ) : (
                    <View className="px-4 items-center justify-center min-h-[500px]">
                        <View className="bg-gray-100 w-24 h-24 rounded-full items-center justify-center mb-4">
                            <Ionicons name="search-outline" size={48} color="#9CA3AF" />
                        </View>
                        <Text className="text-lg font-semibold text-gray-700 mb-2">Produk tidak ditemukan</Text>
                        <Text className="text-sm text-gray-500 text-center">
                            Coba cari dengan kata kunci lain
                        </Text>
                    </View>
                )}
            </ScrollView>

            {/* Bottom bar - Fixed position */}
            {selectedCount > 0 && (
                <View className="absolute left-0 right-0 bottom-0 px-4 pb-4" style={{ backgroundColor: 'transparent' }}>
                    <View className="bg-black rounded-2xl p-4 flex-row items-center justify-between opacity-95">
                        <View className="flex-1 mr-3" style={{ minWidth: 0 }}>
                            <Text className="text-white text-sm">{selectedCount} item dipilih</Text>
                            <Text
                                className="text-gray-300 text-xs"
                                numberOfLines={1}
                                ellipsizeMode="tail"
                                style={{ flexShrink: 1 }}
                            >
                                {(() => {
                                    const selectedProducts = Object.keys(productIdToQty)
                                        .map(pid => {
                                            const p = products.find((pp: any) => pp.id === Number(pid))
                                            return p?.name
                                        })
                                        .filter(Boolean)

                                    const maxDisplay = 2
                                    if (selectedProducts.length <= maxDisplay) {
                                        return selectedProducts.join(', ')
                                    }
                                    return selectedProducts.slice(0, maxDisplay).join(', ') + ` +${selectedProducts.length - maxDisplay} lainnya`
                                })()}
                            </Text>
                        </View>
                        <View className="flex-row items-center" style={{ flexShrink: 0 }}>
                            <Text className="text-white font-bold mr-3">{formatIDR(selectedTotal)}</Text>
                            <TouchableOpacity
                                onPress={handleCartPress}
                                className="w-10 h-10 rounded-full bg-orange-500 items-center justify-center"
                            >
                                <Ionicons name="cart" size={18} className="text-white" />
                            </TouchableOpacity>
                        </View>
                    </View>
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
                onApply={handleApplyFilter}
                onReset={handleResetFilter}
            />
        </View>
    )
}

