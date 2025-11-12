import { useLocalSearchParams, useRouter } from 'expo-router';

import { View, Text, TouchableOpacity, FlatList, ScrollView } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { useProducts } from '@/hooks/useProducts';

import { useCategories } from '@/hooks/useCategories';

import { useSizes } from '@/hooks/useSizes';

import { useAppSettingsContext } from "@/context/AppSettingsContext";

import Input from '@/components/ui/input';

import { useStateCreateTransaction } from '@/components/transaction/create/lib/useStateCreateTransaction';

import CardTransaction from '@/components/transaction/create/CardTranscation';

import PaymentModal from '@/components/transaction/create/PaymentModal';

import ProductsBottomSheet from '@/components/transaction/create/ProductsBottomSheet';

import { BarcodeScanner } from '@/components/products/BarcodeScanner';

import TransactionLoading from '@/components/transaction/create/TransactionLoading';

export default function TransactionDetail() {
    const { formatIDR, formatDateTime } = useAppSettingsContext();

    const { id } = useLocalSearchParams();

    const router = useRouter();

    const transactionId = parseInt(id as string, 10);

    const { products } = useProducts();

    const { categories } = useCategories();

    const { sizes } = useSizes();

    const {
        transaction,
        productsWithDetails,
        loading,
        customerName,
        setCustomerName,
        paymentMethod,
        amountPaid,
        paymentCards,
        selectedPaymentCardId,
        showPaymentModal,
        setShowPaymentModal,
        paymentInfoFilled,
        showProductsSheet,
        setShowProductsSheet,
        searchTerm,
        setSearchTerm,
        selectedProducts,
        setSelectedProducts,
        showScanner,
        setShowScanner,
        formatIdrNumber,
        getAmountPaidValue,
        calculateChange,
        getSuggestedAmounts,
        isAmountInsufficient,
        getPaymentMethodLabel,
        filteredProducts,
        updateItemQty,
        saveCustomerInfo,
        handlePaymentCardSelect,
        handlePaymentMethodChange,
        processPayment,
        savePaymentInfo,
        paymentValidationError,
        handleAmountPaidChange,
        handleBayar,
        handleMarkCancelled,
        handleSettings,
        handleBack,
        addProductQty,
        subProductQty,
        handleBarcodeScan,
        handleAddProducts,
        selectedCategoryId,
        selectedSizeId,
        handleApplyFilters,
        handleResetFilters,
        setCustomerSearchQuery,
        isCustomerSelected,
        setIsCustomerSelected,
        customerSuggestions,
        selectCustomerName,
    } = useStateCreateTransaction({
        transactionId,
        products,
        formatIDR,
        router,
    });

    const renderItem = ({ item }: { item: any }) => (
        <CardTransaction
            item={item}
            formatIDR={formatIDR}
            onUpdateQty={updateItemQty}
        />
    );

    if (loading) {
        return (
            <TransactionLoading />
        );
    }

    if (!transaction) {
        return (
            <View className="flex-1 bg-white items-center justify-center p-4">
                <Ionicons name="alert-circle-outline" size={48} color="#9CA3AF" />
                <Text className="text-lg font-semibold text-gray-900 mt-4">Transaksi tidak ditemukan</Text>
                <TouchableOpacity
                    onPress={handleBack}
                    className="mt-4 px-6 py-3 bg-orange-500 rounded-xl"
                >
                    <Text className="text-white font-semibold">Kembali</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-background">
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 pt-1 pb-4 bg-white">
                <TouchableOpacity
                    onPress={handleBack}
                    className="w-10 h-10 items-center justify-center"
                >
                    <Ionicons name="arrow-back" size={20} color="#000" />
                </TouchableOpacity>
                <Text className="flex-1 text-lg font-bold text-black ml-2">Detail Transaksi</Text>

                <View className="flex-row items-center gap-1">
                    <TouchableOpacity className="w-10 h-10 items-center justify-center" onPress={handleSettings}>
                        <Ionicons name="search-outline" size={20} color="#000" />
                    </TouchableOpacity>
                    <Text className="text-sm font-semibold text-blue-600">{transaction.transaction_number}</Text>
                </View>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Customer Info */}
                {transaction.status === 'pending' && (
                    <View className="bg-white mx-4 mt-4 rounded-2xl p-4 border border-gray-200">
                        <View>
                            <Input
                                label='Nama Pelanggan'
                                placeholder="Masukkan nama pelanggan"
                                placeholderTextColor="#9CA3AF"
                                value={customerName}
                                onChangeText={(text: string) => {
                                    setCustomerName(text);
                                    setCustomerSearchQuery(text);
                                    setIsCustomerSelected(false);
                                }}
                            />

                            {customerName?.length > 0 && customerSuggestions?.length > 0 && !isCustomerSelected && (
                                <View className="border mb-4 border-gray-200 rounded-lg bg-white">
                                    <ScrollView style={{ maxHeight: 200 }} keyboardShouldPersistTaps='handled'>
                                        {customerSuggestions.map((name) => (
                                            <TouchableOpacity
                                                key={name}
                                                className="px-3 py-2"
                                                onPress={() => selectCustomerName(name)}
                                            >
                                                <Text className="text-gray-800">{name}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>
                            )}
                        </View>

                        <TouchableOpacity
                            onPress={saveCustomerInfo}
                            className="bg-accent-primary rounded-xl py-3 items-center"
                        >
                            <Text className="text-white font-semibold">Simpan Data Pelanggan</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Items List */}
                <View className="mx-4 mt-4">
                    {productsWithDetails.length === 0 ? (
                        <View className="bg-white rounded-2xl p-8 items-center border border-gray-200">
                            <Ionicons name="cart-outline" size={48} color="#9CA3AF" />
                            <Text className="text-gray-500 mt-3">Belum ada produk dalam transaksi</Text>
                            <TouchableOpacity
                                onPress={handleBack}
                                className="mt-4 px-6 py-2 bg-blue-600 rounded-xl"
                            >
                                <Text className="text-white font-semibold">Tambah Produk</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <FlatList
                            data={productsWithDetails}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={renderItem}
                            scrollEnabled={false}
                        />
                    )}
                </View>

                {/* Summary */}
                <View className="bg-white mx-4 mt-4 mb-4 rounded-2xl p-4 border border-gray-200">
                    {/* Calculate total discount from all items */}
                    {(() => {
                        // Calculate total base price (before discount)
                        const totalBasePrice = productsWithDetails.reduce((sum, item) => {
                            return sum + (item.price * item.quantity);
                        }, 0);

                        // Calculate total discount amount from all items
                        const totalItemsDiscount = productsWithDetails.reduce((sum, item) => {
                            const product = item.product;
                            const basePrice = item.price;
                            const discount = (product?.discount ?? item.discount ?? 0);
                            const discountValue = Number(discount) || 0;
                            const discountAmount = (basePrice * discountValue) / 100;
                            return sum + (discountAmount * item.quantity);
                        }, 0);

                        return (
                            <>
                                <View className="flex-row justify-between items-center mb-3">
                                    <Text className="text-sm text-gray-900">Subtotal</Text>
                                    <Text className="text-sm font-semibold text-gray-900">{formatIDR(transaction.subtotal || totalBasePrice)}</Text>
                                </View>

                                {totalItemsDiscount > 0 && (
                                    <View className="flex-row justify-between items-center mb-3">
                                        <Text className="text-sm text-gray-900">Diskon Produk</Text>
                                        <Text className="text-sm font-semibold text-gray-900">-{formatIDR(totalItemsDiscount)}</Text>
                                    </View>
                                )}

                                {transaction.discount > 0 && (
                                    <View className="flex-row justify-between items-center mb-3">
                                        <Text className="text-sm text-gray-900">Promosi</Text>
                                        <Text className="text-sm font-semibold text-gray-900">-{formatIDR(transaction.discount)}</Text>
                                    </View>
                                )}

                                <View className="flex-row justify-between items-center">
                                    <Text className="text-base font-bold text-gray-900">Total</Text>
                                    <Text className="text-base font-bold text-gray-900">{formatIDR(transaction.total)}</Text>
                                </View>

                                {/* Payment Info Section - Show after payment info is filled */}
                                {paymentInfoFilled && transaction.status === 'pending' && (
                                    <>
                                        <View className="h-px bg-gray-200 my-3" />
                                        <Text className="text-sm font-bold text-gray-900 mb-3">Informasi Pembayaran</Text>

                                        {/* Payment Method */}
                                        <View className="flex-row justify-between items-center mb-2">
                                            <Text className="text-xs text-gray-500">Metode Pembayaran</Text>

                                            <Text className="text-xs font-semibold text-gray-900">
                                                {selectedPaymentCardId ? (
                                                    (() => {
                                                        const selectedCard = paymentCards.find(card => card.id === selectedPaymentCardId);
                                                        return selectedCard ? getPaymentMethodLabel(selectedCard.method) : 'Tunai';
                                                    })()
                                                ) : paymentMethod === 'cash' ? 'Tunai' :
                                                    paymentMethod === 'card' ? 'Kartu' : 'Transfer'}
                                            </Text>
                                        </View>

                                        {/* Amount Paid (for cash) */}
                                        {paymentMethod === 'cash' && selectedPaymentCardId === null && amountPaid && (
                                            <>
                                                <View className="flex-row justify-between items-center mb-2">
                                                    <Text className="text-base text-gray-500">Jumlah Dibayar</Text>
                                                    <Text className="text-base font-semibold text-gray-900">{formatIDR(getAmountPaidValue())}</Text>
                                                </View>
                                                {/* Change (for cash) - Always show if amount paid exists */}
                                                <View className="flex-row justify-between items-center mb-2">
                                                    <Text className="text-base text-gray-500">Kembalian</Text>
                                                    <Text className={`text-base font-bold ${calculateChange() > 0 ? 'text-green-600' : calculateChange() === 0 ? 'text-gray-600' : 'text-red-600'}`}>
                                                        {formatIDR(Math.max(0, calculateChange()))}
                                                    </Text>
                                                </View>
                                            </>
                                        )}
                                    </>
                                )}
                            </>
                        );
                    })()}

                    {transaction.status !== 'pending' && (
                        <>
                            <View className="h-px bg-gray-200 my-3" />
                            <View className="flex-row justify-between items-center mb-2">
                                <Text className="text-xs text-gray-500">Metode</Text>
                                <Text className="text-xs font-semibold text-gray-900">
                                    {transaction.payment_method === 'cash' ? 'Tunai' :
                                        transaction.payment_method === 'card' ? 'Kartu' : 'Transfer'}
                                </Text>
                            </View>
                            <View className="flex-row justify-between items-center mb-2">
                                <Text className="text-xs text-gray-500">Status</Text>
                                <View className={`px-2 py-1 rounded ${transaction.payment_status === 'paid' ? 'bg-green-100' :
                                    transaction.payment_status === 'cancelled' ? 'bg-red-100' :
                                        transaction.payment_status === 'return' ? 'bg-blue-100' :
                                            'bg-yellow-100'
                                    }`}>
                                    <Text className={`text-xs font-semibold ${transaction.payment_status === 'paid' ? 'text-green-700' :
                                        transaction.payment_status === 'cancelled' ? 'text-red-700' :
                                            transaction.payment_status === 'return' ? 'text-blue-700' :
                                                'text-yellow-700'
                                        }`}>
                                        {transaction.payment_status === 'pending' ? 'Menunggu' :
                                            transaction.payment_status === 'paid' ? 'Lunas' :
                                                transaction.payment_status === 'cancelled' ? 'Dibatalkan' : 'Retur'}
                                    </Text>
                                </View>
                            </View>
                            <View className="flex-row justify-between items-center">
                                <Text className="text-xs text-gray-500">Tanggal</Text>
                                <Text className="text-xs font-semibold text-gray-900">
                                    {formatDateTime(transaction.created_at)}
                                </Text>
                            </View>
                        </>
                    )}
                </View>
            </ScrollView>

            {/* Action Buttons */}
            {transaction.status === 'pending' && (
                <>
                    {/* Tambah Produk & Scan Buttons */}
                    <View className="px-4 pb-2 bg-white gap-2">
                        <TouchableOpacity
                            onPress={() => {
                                setShowProductsSheet(true);
                                setSelectedProducts({});
                                setSearchTerm('');
                            }}
                            className="bg-green-600 rounded-xl py-3.5 items-center flex-row justify-center"
                        >
                            <Ionicons name="add-circle-outline" size={20} color="white" style={{ marginRight: 8 }} />
                            <Text className="text-sm font-semibold text-white">Tambah Produk</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setShowScanner(true)}
                            className="bg-orange-500 rounded-xl py-3.5 items-center flex-row justify-center"
                        >
                            <Ionicons name="barcode-outline" size={20} color="white" style={{ marginRight: 8 }} />
                            <Text className="text-sm font-semibold text-white">Scan Produk</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Payment Buttons */}
                    <View className="flex-row px-4 pb-4 pt-2 bg-white gap-3">
                        {!paymentInfoFilled ? (
                            <>
                                <TouchableOpacity
                                    onPress={handleMarkCancelled}
                                    className="flex-1 bg-white border border-red-300 rounded-xl py-3.5 items-center"
                                >
                                    <Text className="text-sm font-semibold text-red-600">Canceled</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={handleBayar}
                                    className="flex-[1.2] bg-blue-600 rounded-xl py-3.5 items-center"
                                >
                                    <Text className="text-sm font-semibold text-white">Bayar</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <TouchableOpacity
                                onPress={processPayment}
                                className="flex-1 bg-orange-500 rounded-xl py-3.5 items-center"
                            >
                                <Text className="text-sm font-semibold text-white">Konfirmasi Pembayaran</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </>
            )}

            {/* Payment Modal */}
            <PaymentModal
                visible={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                transaction={transaction}
                paymentMethod={paymentMethod}
                selectedPaymentCardId={selectedPaymentCardId}
                paymentCards={paymentCards}
                amountPaid={amountPaid}
                validationError={paymentValidationError}
                formatIDR={formatIDR}
                formatIdrNumber={formatIdrNumber}
                getAmountPaidValue={getAmountPaidValue}
                getSuggestedAmounts={getSuggestedAmounts}
                isAmountInsufficient={isAmountInsufficient}
                getPaymentMethodLabel={getPaymentMethodLabel}
                onPaymentMethodChange={handlePaymentMethodChange}
                onPaymentCardSelect={handlePaymentCardSelect}
                onAmountPaidChange={handleAmountPaidChange}
                onSavePaymentInfo={savePaymentInfo}
            />

            {/* Products Bottom Sheet */}
            <ProductsBottomSheet
                visible={showProductsSheet}
                onClose={() => setShowProductsSheet(false)}
                products={products}
                filteredProducts={filteredProducts}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedProducts={selectedProducts}
                setSelectedProducts={setSelectedProducts}
                formatIDR={formatIDR}
                addProductQty={addProductQty}
                subProductQty={subProductQty}
                handleAddProducts={handleAddProducts}
                categories={categories}
                sizes={sizes}
                selectedCategoryId={selectedCategoryId}
                selectedSizeId={selectedSizeId}
                handleApplyFilters={handleApplyFilters}
                handleResetFilters={handleResetFilters}
            />

            {/* Barcode Scanner */}
            <BarcodeScanner
                visible={showScanner}
                onClose={() => setShowScanner(false)}
                onScan={handleBarcodeScan}
            />
        </View>
    );
}