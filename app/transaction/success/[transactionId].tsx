import { useStateSuccessTransaction } from '@/components/transaction/success/lib/useStateSuccessTransaction';

import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { LinearGradient } from 'expo-linear-gradient';

import BottomSheet from '@/helper/bottomsheets/BottomSheet';

export default function TransactionSuccess() {
    const {
        transaction,
        items,
        loading,
        printing,
        downloading,
        shareSheetVisible,
        formatIDR,
        handleBackToHome,
        handlePrint,
        handleSharePDF,
        openShareSheet,
        closeShareSheet,
        handleShareText,
    } = useStateSuccessTransaction();

    if (loading) {
        return (
            <View className="flex-1 bg-background items-center justify-center">
                <Text className="text-gray-500">Memuat data...</Text>
            </View>
        );
    }

    if (!transaction) {
        return (
            <View className="flex-1 bg-background items-center justify-center p-4">
                <Ionicons name="alert-circle-outline" size={48} color="#9CA3AF" />
                <Text className="text-lg font-semibold text-gray-900 mt-4">Transaksi tidak ditemukan</Text>
                <TouchableOpacity
                    onPress={handleBackToHome}
                    className="mt-4 px-6 py-3 bg-orange-500 rounded-xl"
                >
                    <Text className="text-white font-semibold">Kembali ke Beranda</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-background">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <LinearGradient
                    colors={["#f59e0b", "#f97316"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ paddingHorizontal: 16, paddingTop: 48, paddingBottom: 40 }}
                >
                    <View className="items-center">
                        <View className="w-24 h-24 rounded-full bg-white items-center justify-center mb-4">
                            <Ionicons name="checkmark-circle" size={56} color="#f97316" />
                        </View>
                        <Text className="text-white font-extrabold text-2xl mb-1">Pembayaran Berhasil!</Text>
                        <Text className="text-white/90 text-sm">Transaksi telah selesai. Terima kasih!</Text>
                    </View>
                </LinearGradient>

                {/* Transaction Info */}
                <View className="mx-4 mt-6">
                    <View className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-4">
                        <Text className="text-sm text-gray-500 mb-1">Nomor Transaksi</Text>
                        <Text className="text-lg font-bold text-gray-900">{transaction.transaction_number}</Text>

                        {transaction.customer_name && (
                            <>
                                <View className="h-px bg-gray-100 my-3" />
                                <Text className="text-sm text-gray-500 mb-1">Nama Pelanggan</Text>
                                <Text className="text-base font-semibold text-gray-900">{transaction.customer_name}</Text>
                            </>
                        )}
                    </View>

                    {/* Items Summary */}
                    {items.length > 0 && (
                        <View className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-4">
                            <Text className="text-base font-bold text-gray-900 mb-3">Detail Pembelian</Text>
                            {items.map((item, index) => (
                                <View key={item.id} className={index !== items.length - 1 ? "mb-3 pb-3 border-b border-gray-100" : ""}>
                                    <View className="flex-row items-center justify-between">
                                        <View className="flex-1">
                                            <Text className="text-sm font-semibold text-gray-900">
                                                {item.product?.name || 'Produk'}
                                            </Text>
                                            <Text className="text-xs text-gray-600">
                                                {item.quantity} x {formatIDR(item.price)}
                                            </Text>
                                        </View>
                                        <Text className="text-sm font-bold text-gray-900">
                                            {formatIDR(item.subtotal)}
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Payment Summary */}
                    <View className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-4">
                        <Text className="text-base font-bold text-gray-900 mb-3">Ringkasan Pembayaran</Text>
                        <View className="flex-row justify-between mb-2">
                            <Text className="text-gray-600">Subtotal</Text>
                            <Text className="text-gray-900 font-semibold">{formatIDR(transaction.subtotal)}</Text>
                        </View>
                        {(() => {
                            // Calculate total discount from all items (percentage per item)
                            const totalItemsDiscount = items.reduce((sum, item) => {
                                const basePrice = item.price || 0;
                                const qty = item.quantity || 0;
                                // Get discount from product if available, otherwise use item discount
                                const productDiscount = item.product?.discount ?? item.discount ?? 0;
                                const discountPercent = Number(productDiscount) || 0;
                                const discountAmountPerUnit = (basePrice * discountPercent) / 100;
                                return sum + discountAmountPerUnit * qty;
                            }, 0);

                            // Total discount = discount from items + transaction level discount
                            const totalDiscount = totalItemsDiscount + (transaction.discount || 0);

                            return totalDiscount > 0 ? (
                                <View className="flex-row justify-between mb-2">
                                    <Text className="text-gray-600">Diskon</Text>
                                    <Text className="text-gray-900 font-semibold">{formatIDR(totalDiscount)}</Text>
                                </View>
                            ) : null;
                        })()}
                        {/* Pajak dihapus */}
                        <View className="h-px bg-gray-100 my-3" />
                        <View className="flex-row justify-between mb-2">
                            <Text className="text-lg font-bold text-gray-900">Total</Text>
                            <Text className="text-lg font-extrabold text-orange-600">{formatIDR(transaction.total)}</Text>
                        </View>
                        <View className="h-px bg-gray-100 my-2" />
                        <View className="flex-row justify-between mb-1">
                            <Text className="text-sm text-gray-600">Metode Pembayaran</Text>
                            <Text className="text-sm text-gray-900 font-semibold">
                                {transaction.payment_method === 'cash' ? 'Tunai' :
                                    transaction.payment_method === 'card' ? 'Kartu' : 'Transfer'}
                            </Text>
                        </View>
                        <View className="flex-row justify-between mb-1">
                            <Text className="text-sm text-gray-600">Status Transaksi</Text>
                            {(() => {
                                const status = transaction.status;
                                const classes = status === 'completed'
                                    ? { bg: 'bg-green-100', text: 'text-green-700', label: 'Selesai' }
                                    : status === 'cancelled'
                                        ? { bg: 'bg-red-100', text: 'text-red-700', label: 'Dibatalkan' }
                                        : status === 'return'
                                            ? { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Retur' }
                                            : { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Menunggu' };
                                return (
                                    <View className={`px-2 py-1 rounded ${classes.bg}`}>
                                        <Text className={`text-xs font-semibold ${classes.text}`}>{classes.label}</Text>
                                    </View>
                                );
                            })()}
                        </View>
                        <View className="flex-row justify-between">
                            <Text className="text-sm text-gray-600">Status Pembayaran</Text>
                            {(() => {
                                const ps = transaction.payment_status;
                                const classes = ps === 'paid'
                                    ? { bg: 'bg-green-100', text: 'text-green-700', label: 'Lunas' }
                                    : ps === 'cancelled'
                                        ? { bg: 'bg-red-100', text: 'text-red-700', label: 'Dibatalkan' }
                                        : ps === 'return'
                                            ? { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Retur' }
                                            : { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Menunggu' };
                                return (
                                    <View className={`px-2 py-1 rounded ${classes.bg}`}>
                                        <Text className={`text-xs font-semibold ${classes.text}`}>{classes.label}</Text>
                                    </View>
                                );
                            })()}
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Action Buttons */}
            <View className="px-4 pb-4 pt-2 bg-white border-t border-gray-200">
                <View className="flex-row gap-3 mb-3">
                    <TouchableOpacity
                        onPress={handlePrint}
                        disabled={printing}
                        className="flex-1 bg-white border border-gray-300 rounded-xl py-3 items-center flex-row justify-center"
                    >
                        {printing ? (
                            <Text className="text-gray-700 font-semibold text-base">Mencetak...</Text>
                        ) : (
                            <>
                                <Ionicons name="print" size={20} color="#f97316" style={{ marginRight: 8 }} />
                                <Text className="text-orange-600 font-semibold text-base">Print</Text>
                            </>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={openShareSheet}
                        disabled={downloading}
                        className="flex-1 bg-white border border-gray-300 rounded-xl py-3 items-center flex-row justify-center"
                    >
                        {downloading ? (
                            <Text className="text-gray-700 font-semibold text-base">Membagikan...</Text>
                        ) : (
                            <>
                                <Ionicons name="share-social" size={20} color="#f97316" style={{ marginRight: 8 }} />
                                <Text className="text-orange-600 font-semibold text-base">Share</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    onPress={handleBackToHome}
                    className="bg-orange-500 rounded-2xl py-4 items-center"
                >
                    <Text className="text-white font-semibold text-base">Kembali ke Beranda</Text>
                </TouchableOpacity>
            </View>
            <BottomSheet
                visible={shareSheetVisible}
                title="Bagikan"
                onClose={closeShareSheet}
                footer={(
                    <TouchableOpacity onPress={closeShareSheet} className="bg-secondary-700 rounded-xl py-3 items-center">
                        <Text className="text-white font-semibold">Tutup</Text>
                    </TouchableOpacity>
                )}
            >
                <View className="gap-3">
                    <TouchableOpacity
                        onPress={async () => {
                            closeShareSheet();
                            setTimeout(() => {
                                handleSharePDF();
                            }, 150);
                        }}
                        className="flex-row items-center justify-between bg-secondary-700 rounded-xl px-4 py-3"
                    >
                        <View className="flex-row items-center">
                            <Ionicons name="document-outline" size={20} color="#fff" style={{ marginRight: 10 }} />
                            <Text className="text-white font-medium">Bagikan sebagai PDF</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={async () => {
                            closeShareSheet();
                            setTimeout(() => {
                                handleShareText();
                            }, 150);
                        }}
                        className="flex-row items-center justify-between bg-secondary-700 rounded-xl px-4 py-3"
                    >
                        <View className="flex-row items-center">
                            <Ionicons name="chatbox-ellipses-outline" size={20} color="#fff" style={{ marginRight: 10 }} />
                            <Text className="text-white font-medium">Bagikan sebagai Teks</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                    </TouchableOpacity>
                </View>
            </BottomSheet>
        </View>
    );
}

