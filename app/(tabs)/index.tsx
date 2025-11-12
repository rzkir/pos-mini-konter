import { router } from 'expo-router'

import { useState, useCallback } from 'react'

import { useStateProducts } from '@/components/products/beranda/lib/useStateProducts'

import { ProductsCard } from '@/components/products/beranda/ProductsCard'

import { FlatList, Image, RefreshControl, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'

import { Ionicons } from '@expo/vector-icons'

import HeaderGradient from '@/components/ui/HeaderGradient';

import SectionTitle from '@/components/ui/SectionTitle';

export default function Beranda() {
  const {
    search,
    setSearch,
    activeCategoryId,
    setActiveCategoryId,
    productIdToQty,
    addQty,
    subQty,
    categories,
    topSellerProducts,
    filtered,
    selectedCount,
    selectedTotal,
    handleCartPress,
    handleNavigateAllProducts,
    products,
    formatIDR,
    companyProfile,
    refreshData,
  } = useStateProducts()

  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    try {
      await refreshData()
    } finally {
      setRefreshing(false)
    }
  }, [refreshData])

  const renderTopSellerCard = ({ item }: { item: any }) => {
    const qty = productIdToQty[item.id] || 0
    return (
      <ProductsCard
        item={item}
        qty={qty}
        addQty={addQty}
        subQty={subQty}
        formatIDR={formatIDR}
      />
    )
  }

  const getCategoryIcon = (label: string) => {
    if (!label) return 'grid-outline' as const
    const l = label.toLowerCase()
    if (l.includes('minum') || l.includes('kopi') || l.includes('teh') || l.includes('jus')) return 'cafe-outline' as const
    if (l.includes('snack') || l.includes('cemil') || l.includes('kue') || l.includes('roti')) return 'pizza-outline' as const
    if (l.includes('buah') || l.includes('sayur')) return 'leaf-outline' as const
    if (l.includes('bumbu') || l.includes('pedas')) return 'flame-outline' as const
    if (l.includes('makan') || l.includes('nasi') || l.includes('ayam') || l.includes('daging')) return 'fast-food-outline' as const
    return 'grid-outline' as const
  }

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
        {/* Header (Linear Gradient) */}
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
              onPress={handleNavigateAllProducts}
              className="w-10 h-10 rounded-full bg-white/30 items-center justify-center"
            >
              <Ionicons name="cart" size={22} color="white" />
            </TouchableOpacity>
          </View>
        </HeaderGradient>

        <View className="flex-1">
          {/* Search + Add (overlap card) */}
          <View className="px-4 mt-[-15px] relative">
            <View className="bg-white rounded-2xl flex-row items-center px-4 py-3 shadow">
              <Ionicons name="search" size={18} className="text-gray-500" />
              <TextInput
                className="ml-2 flex-1 text-gray-800"
                placeholder="Cari produk..."
                value={search}
                onChangeText={setSearch}
              />
              {/* Spacer to avoid text under the floating + */}
              <View style={{ width: 40 }} />
            </View>

            <TouchableOpacity
              onPress={() => router.push('/products/new')}
              className="w-10 h-10 rounded-full bg-orange-500 items-center justify-center shadow"
              style={{ position: 'absolute', right: 24, top: '50%', marginTop: -20 }}
            >
              <Ionicons name="add" size={20} color={"white"} />
            </TouchableOpacity>
          </View>

          {/* Category chips */}
          {products.length > 0 && (
            <View className="px-4 mt-4">
              <FlatList
                data={[{ id: 'all', name: 'Semua Menu' }, ...categories] as any[]}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(it: any) => `${it.id}`}
                renderItem={({ item }: any) => (
                  <TouchableOpacity
                    onPress={() => setActiveCategoryId(item.id === 'all' ? 'all' : item.id)}
                    className={`mr-8 items-center`}
                  >
                    <View className={`w-12 h-12 rounded-full ${activeCategoryId === item.id || (item.id === 'all' && activeCategoryId === 'all') ? 'bg-orange-500' : 'bg-white'} items-center justify-center`}>
                      <Ionicons
                        name={item.id === 'all' ? 'grid-outline' : getCategoryIcon(item.name)}
                        size={20}
                        color={(activeCategoryId === item.id || (item.id === 'all' && activeCategoryId === 'all')) ? '#ffffff' : '#111827'}
                      />
                    </View>
                    <Text className="text-xs mt-1 text-gray-700" numberOfLines={1}>
                      {item.id === 'all' ? 'Semua Menu' : item.name}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}

          {/* Top Seller Section */}
          {topSellerProducts.length > 0 && (
            <View className="mt-6">
              <View className="px-4 mb-3 flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className="bg-yellow-100 p-2 rounded-xl mr-2">
                    <Ionicons name="star" size={20} color="#D97706" />
                  </View>
                  <View>
                    <Text className="text-lg font-bold text-gray-800">
                      Top Seller
                    </Text>
                    <Text className="text-xs text-gray-500">
                      Produk terlaris
                    </Text>
                  </View>
                </View>
              </View>

              <FlatList
                className="px-2"
                data={topSellerProducts}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item: any) => item.id.toString()}
                renderItem={renderTopSellerCard}
              />
            </View>
          )}

          {/* Section title */}
          {filtered.length > 0 && (
            <View className="px-4 mt-4 mb-2 flex-row items-center justify-between">
              <SectionTitle title="Menu Spesial Hari Ini" />
            </View>
          )}

          {/* Grid */}
          {filtered.length > 0 ? (
            <View className="px-2 flex-row flex-wrap">
              {filtered.map((item: any) => (
                <View key={item.id.toString()} className="px-1 mb-4 w-1/2">
                  <View className="bg-white rounded-2xl flex-col gap-1.5 p-3 border border-border">
                    <View className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 items-center justify-center">
                      {item.image_url ? (
                        <Image source={{ uri: item.image_url }} className="w-full h-full" resizeMode="cover" />
                      ) : (
                        <Ionicons name="image-outline" size={28} className="text-gray-400" />
                      )}
                    </View>

                    <View className="mt-1 flex-row items-center">
                      <View className="w-1.5 h-1.5 rounded-full bg-accent-primary mr-1" />
                      <Text className="text-[11px] text-accent-primary font-semibold">{item.stock ?? 0} Stok</Text>
                    </View>

                    <Text numberOfLines={1} className="text-lg font-semibold text-text-secondary">{item.name}</Text>

                    <View className="flex-row items-center justify-between">
                      <Text className="text-base font-bold text-text-primary">{formatIDR(item.price || 0)}</Text>
                      {productIdToQty[item.id] === 0 || !productIdToQty[item.id] ? (
                        <TouchableOpacity onPress={() => addQty(item.id)} className="w-10 h-10 rounded-full bg-emerald-500 items-center justify-center">
                          <Ionicons name="add" size={18} color={"white"} />
                        </TouchableOpacity>
                      ) : (
                        <View className="flex-row items-center">
                          <TouchableOpacity onPress={() => subQty(item.id)} className="w-10 h-10 rounded-full bg-emerald-500 items-center justify-center">
                            <Ionicons name="remove" size={18} color={"white"} />
                          </TouchableOpacity>

                          <Text className="mx-2 text-sm font-semibold text-gray-900">{productIdToQty[item.id]}</Text>

                          <TouchableOpacity onPress={() => addQty(item.id)} className="w-10 h-10 rounded-full bg-emerald-500 items-center justify-center">
                            <Ionicons name="add" size={18} color={"white"} />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              ))}
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

              <TouchableOpacity
                onPress={() => router.push('/products/new')}
                className="bg-orange-500 px-6 py-3 rounded-xl flex-row items-center"
              >
                <Ionicons name="add" size={18} color="white" />
                <Text className="text-white font-semibold ml-2">Tambah Produk</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
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
    </View>
  )
}