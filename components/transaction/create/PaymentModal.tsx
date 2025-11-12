import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import BottomSheet from '@/helper/bottomsheets/BottomSheet';

export default function PaymentModal({
    visible,
    onClose,
    transaction,
    paymentMethod,
    selectedPaymentCardId,
    paymentCards,
    amountPaid,
    validationError,
    formatIDR,
    formatIdrNumber,
    getAmountPaidValue,
    getSuggestedAmounts,
    isAmountInsufficient,
    getPaymentMethodLabel,
    onPaymentMethodChange,
    onPaymentCardSelect,
    onAmountPaidChange,
    onSavePaymentInfo,
}: PaymentModalProps) {
    const selectedCard = paymentCards.find((c) => c.id === selectedPaymentCardId);

    return (
        <BottomSheet
            visible={visible}
            onClose={onClose}
            title="Pembayaran"
            footer={
                <TouchableOpacity
                    onPress={onSavePaymentInfo}
                    className="bg-orange-500 rounded-xl py-4 items-center ml-3 mr-3"
                >
                    <Text className="text-white font-semibold text-base">Konfirmasi Pembayaran</Text>
                </TouchableOpacity>
            }
        >
            <View className="pb-4 px-3">
                {/* Summary in Modal */}
                <View className="bg-background border border-border rounded-2xl p-4 mb-4">
                    <Text className="text-sm font-bold text-secondary-500 mb-3">Total Pembayaran</Text>
                    <Text className="text-lg font-bold text-accent-primary">{formatIDR(transaction?.total || 0)}</Text>
                </View>

                {/* Payment Method */}
                <View className="mb-4 flex-col gap-2">
                    <Text className="text-sm text-secondary-500 mb-2 font-semibold">Metode Pembayaran</Text>

                    {/* Cash Option */}
                    <TouchableOpacity
                        onPress={() => {
                            onPaymentMethodChange('cash');
                            onPaymentCardSelect(null);
                        }}
                        className={`mb-2 p-3 rounded-xl border-2 ${paymentMethod === 'cash' && !selectedPaymentCardId
                            ? 'bg-accent-primary border-accent-primary'
                            : 'bg-gray-50 border-gray-200'
                            }`}
                    >
                        <View className="flex-row items-center">
                            <Ionicons
                                name="cash"
                                size={20}
                                color={paymentMethod === 'cash' && !selectedPaymentCardId ? 'white' : 'text-secondary-500'}
                            />
                            <Text
                                className={`ml-2 text-sm font-semibold ${paymentMethod === 'cash' && !selectedPaymentCardId ? 'text-white' : 'text-gray-700'
                                    }`}
                            >
                                Tunai
                            </Text>
                        </View>
                    </TouchableOpacity>

                    {/* Payment Cards */}
                    {paymentCards.length > 0 && (
                        <View className="mt-2">
                            <Text className="text-xs text-secondary-500 mb-2">Metode Pembayaran Digital</Text>
                            {paymentCards.map((card) => (
                                <TouchableOpacity
                                    key={card.id}
                                    onPress={() => onPaymentCardSelect(card.id)}
                                    className={`mb-2 p-3 rounded-xl border-2 ${selectedPaymentCardId === card.id
                                        ? 'bg-accent-primary border-accent-primary'
                                        : 'bg-gray-50 border-gray-200'
                                        }`}
                                >
                                    <View className="flex-row items-center justify-between">
                                        <View className="flex-row items-center flex-1">
                                            {card.image?.url ? (
                                                <Image
                                                    source={{ uri: card.image.url }}
                                                    className="w-8 h-8 rounded mr-2"
                                                    resizeMode="contain"
                                                />
                                            ) : (
                                                <View className="w-8 h-8 rounded bg-gray-200 items-center justify-center mr-2">
                                                    <Ionicons
                                                        name="card-outline"
                                                        size={16}
                                                        color={selectedPaymentCardId === card.id ? 'white' : '#6B7280'}
                                                    />
                                                </View>
                                            )}
                                            <View className="flex-1">
                                                <Text
                                                    className={`text-sm font-semibold ${selectedPaymentCardId === card.id ? 'text-white' : 'text-gray-700'
                                                        }`}
                                                >
                                                    {getPaymentMethodLabel(card.method)}
                                                </Text>
                                                {card.bank && (
                                                    <Text
                                                        className={`text-xs ${selectedPaymentCardId === card.id ? 'text-white/80' : 'text-gray-500'
                                                            }`}
                                                    >
                                                        {card.bank.toUpperCase()}
                                                    </Text>
                                                )}
                                                {card.account_number && (
                                                    <Text
                                                        className={`text-xs ${selectedPaymentCardId === card.id ? 'text-white/80' : 'text-gray-500'
                                                            }`}
                                                    >
                                                        {card.account_number}
                                                    </Text>
                                                )}
                                            </View>
                                        </View>
                                        {selectedPaymentCardId === card.id && (
                                            <Ionicons name="checkmark-circle" size={20} color="white" />
                                        )}
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {paymentCards.length === 0 && (
                        <View className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-2">
                            <Text className="text-xs text-yellow-800">
                                Belum ada metode pembayaran digital yang aktif. Hanya bisa menggunakan Tunai.
                            </Text>
                        </View>
                    )}
                </View>

                {/* QRIS Instructions and QR Code */}
                {selectedCard && selectedCard.method === 'qris' && (
                    <View className="mb-4">
                        <View className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                            <Text className="text-sm font-bold text-gray-900 mb-3">Bayar dengan QRIS</Text>

                            {selectedCard.image?.url ? (
                                <View className="items-center mb-3">
                                    <Image
                                        source={{ uri: selectedCard.image.url }}
                                        className="w-56 h-56 rounded"
                                        resizeMode="contain"
                                    />
                                </View>
                            ) : (
                                <View className="items-center justify-center h-56 bg-gray-100 rounded mb-3">
                                    <Ionicons name="qr-code-outline" size={48} color="#6B7280" />
                                </View>
                            )}

                            <View className="mt-1">
                                <Text className="text-xs text-gray-700 font-semibold mb-2">Langkah-langkah:</Text>
                                <View className="flex-col gap-2">
                                    <View className="flex-row">
                                        <Text className="text-xs text-gray-500 mr-2">1.</Text>
                                        <Text className="text-xs text-gray-700 flex-1">Buka aplikasi e-wallet yang mendukung QRIS (GoPay, OVO, DANA, ShopeePay, dll).</Text>
                                    </View>
                                    <View className="flex-row">
                                        <Text className="text-xs text-gray-500 mr-2">2.</Text>
                                        <Text className="text-xs text-gray-700 flex-1">Pilih menu Scan, lalu arahkan kamera ke kode QR di atas.</Text>
                                    </View>
                                    <View className="flex-row">
                                        <Text className="text-xs text-gray-500 mr-2">3.</Text>
                                        <Text className="text-xs text-gray-700 flex-1">Pastikan nominal sesuai: {formatIDR(transaction?.total || 0)}.</Text>
                                    </View>
                                    <View className="flex-row">
                                        <Text className="text-xs text-gray-500 mr-2">4.</Text>
                                        <Text className="text-xs text-gray-700 flex-1">Konfirmasi pembayaran di aplikasi Anda hingga berhasil.</Text>
                                    </View>
                                    <View className="flex-row">
                                        <Text className="text-xs text-gray-500 mr-2">5.</Text>
                                        <Text className="text-xs text-gray-700 flex-1">Tekan tombol &quot;Konfirmasi Pembayaran&quot; di bawah untuk menyelesaikan transaksi.</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                )}

                {/* E-Wallet (GoPay/OVO/DANA/ShopeePay/LinkAja) Instructions */}
                {selectedCard && (
                    selectedCard.method === 'gopay' ||
                    selectedCard.method === 'ovo' ||
                    selectedCard.method === 'dana' ||
                    selectedCard.method === 'shopeepay' ||
                    selectedCard.method === 'linkaja'
                ) && (
                        <View className="mb-4">
                            <View className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                                <Text className="text-sm font-bold text-gray-900 mb-3">Bayar dengan {getPaymentMethodLabel(selectedCard.method)}</Text>

                                {selectedCard.image?.url && (
                                    <View className="items-center mb-3">
                                        <Image
                                            source={{ uri: selectedCard.image.url }}
                                            className="w-32 h-12"
                                            resizeMode="contain"
                                        />
                                    </View>
                                )}

                                {(selectedCard.account_number || selectedCard.holder_name) && (
                                    <View className="bg-white border border-gray-200 rounded-xl p-3 mb-3">
                                        {selectedCard.account_number && (
                                            <Text className="text-xs text-gray-700">Nomor/ID Tujuan: <Text className="font-semibold">{selectedCard.account_number}</Text></Text>
                                        )}
                                        {selectedCard.holder_name && (
                                            <Text className="text-xs text-gray-700 mt-1">Nama Penerima: <Text className="font-semibold">{selectedCard.holder_name}</Text></Text>
                                        )}
                                    </View>
                                )}

                                <View className="mt-1">
                                    <Text className="text-xs text-gray-700 font-semibold mb-2">Langkah-langkah:</Text>
                                    <View className="flex-col gap-2">
                                        <View className="flex-row">
                                            <Text className="text-xs text-gray-500 mr-2">1.</Text>
                                            <Text className="text-xs text-gray-700 flex-1">Buka aplikasi {getPaymentMethodLabel(selectedCard.method)}.</Text>
                                        </View>
                                        <View className="flex-row">
                                            <Text className="text-xs text-gray-500 mr-2">2.</Text>
                                            <Text className="text-xs text-gray-700 flex-1">Pilih menu Kirim/Transfer ke {selectedCard.account_number ? 'nomor tujuan di bawah' : 'merchant'}.</Text>
                                        </View>
                                        {selectedCard.account_number && (
                                            <View className="flex-row">
                                                <Text className="text-xs text-gray-500 mr-2">3.</Text>
                                                <Text className="text-xs text-gray-700 flex-1">Masukkan nomor tujuan dan nominal {formatIDR(transaction?.total || 0)}.</Text>
                                            </View>
                                        )}
                                        {!selectedCard.account_number && (
                                            <View className="flex-row">
                                                <Text className="text-xs text-gray-500 mr-2">3.</Text>
                                                <Text className="text-xs text-gray-700 flex-1">Masukkan nominal {formatIDR(transaction?.total || 0)}.</Text>
                                            </View>
                                        )}
                                        <View className="flex-row">
                                            <Text className="text-xs text-gray-500 mr-2">4.</Text>
                                            <Text className="text-xs text-gray-700 flex-1">Konfirmasi pembayaran di aplikasi hingga berhasil.</Text>
                                        </View>
                                        <View className="flex-row">
                                            <Text className="text-xs text-gray-500 mr-2">5.</Text>
                                            <Text className="text-xs text-gray-700 flex-1">Tekan tombol &quot;Konfirmasi Pembayaran&quot; di bawah untuk menyelesaikan transaksi.</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    )}

                {/* Bank Transfer Instructions */}
                {selectedCard && selectedCard.method === 'bank_transfer' && (
                    <View className="mb-4">
                        <View className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                            <Text className="text-sm font-bold text-gray-900 mb-3">Transfer Bank {selectedCard.bank ? selectedCard.bank.toUpperCase() : ''}</Text>

                            <View className="bg-white border border-gray-200 rounded-xl p-3 mb-3">
                                {selectedCard.bank && (
                                    <Text className="text-xs text-gray-700">Bank: <Text className="font-semibold">{selectedCard.bank.toUpperCase()}</Text></Text>
                                )}
                                {selectedCard.account_number && (
                                    <Text className="text-xs text-gray-700 mt-1">No. Rekening: <Text className="font-semibold">{selectedCard.account_number}</Text></Text>
                                )}
                                {selectedCard.holder_name && (
                                    <Text className="text-xs text-gray-700 mt-1">Nama Pemilik: <Text className="font-semibold">{selectedCard.holder_name}</Text></Text>
                                )}
                            </View>

                            <View className="mt-1">
                                <Text className="text-xs text-gray-700 font-semibold mb-2">Langkah-langkah:</Text>
                                <View className="flex-col gap-2">
                                    <View className="flex-row">
                                        <Text className="text-xs text-gray-500 mr-2">1.</Text>
                                        <Text className="text-xs text-gray-700 flex-1">Buka mobile/Internet banking {selectedCard.bank ? selectedCard.bank.toUpperCase() : 'Anda'}.</Text>
                                    </View>
                                    <View className="flex-row">
                                        <Text className="text-xs text-gray-500 mr-2">2.</Text>
                                        <Text className="text-xs text-gray-700 flex-1">Pilih Transfer ke rekening dan masukkan data rekening di atas.</Text>
                                    </View>
                                    <View className="flex-row">
                                        <Text className="text-xs text-gray-500 mr-2">3.</Text>
                                        <Text className="text-xs text-gray-700 flex-1">Masukkan nominal {formatIDR(transaction?.total || 0)} dan konfirmasi.</Text>
                                    </View>
                                    <View className="flex-row">
                                        <Text className="text-xs text-gray-500 mr-2">4.</Text>
                                        <Text className="text-xs text-gray-700 flex-1">Simpan bukti transfer bila diperlukan, lalu kembali ke kasir.</Text>
                                    </View>
                                    <View className="flex-row">
                                        <Text className="text-xs text-gray-500 mr-2">5.</Text>
                                        <Text className="text-xs text-gray-700 flex-1">Tekan tombol &quot;Konfirmasi Pembayaran&quot; di bawah untuk menyelesaikan transaksi.</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                )}

                {/* Debit / Credit Card Instructions */}
                {selectedCard && (selectedCard.method === 'debit_card' || selectedCard.method === 'credit_card') && (
                    <View className="mb-4">
                        <View className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                            <Text className="text-sm font-bold text-gray-900 mb-3">Bayar dengan {getPaymentMethodLabel(selectedCard.method)}</Text>

                            {selectedCard.bank && (
                                <View className="bg-white border border-gray-200 rounded-xl p-3 mb-3">
                                    <Text className="text-xs text-gray-700">Bank EDC: <Text className="font-semibold">{selectedCard.bank.toUpperCase()}</Text></Text>
                                </View>
                            )}

                            <View className="mt-1">
                                <Text className="text-xs text-gray-700 font-semibold mb-2">Langkah-langkah:</Text>
                                <View className="flex-col gap-2">
                                    <View className="flex-row">
                                        <Text className="text-xs text-gray-500 mr-2">1.</Text>
                                        <Text className="text-xs text-gray-700 flex-1">Gesek/Insert/Tap kartu pada mesin EDC.</Text>
                                    </View>
                                    <View className="flex-row">
                                        <Text className="text-xs text-gray-500 mr-2">2.</Text>
                                        <Text className="text-xs text-gray-700 flex-1">Masukkan nominal {formatIDR(transaction?.total || 0)}.</Text>
                                    </View>
                                    <View className="flex-row">
                                        <Text className="text-xs text-gray-500 mr-2">3.</Text>
                                        <Text className="text-xs text-gray-700 flex-1">Ikuti instruksi pada EDC (PIN/Tanda tangan) hingga berhasil.</Text>
                                    </View>
                                    <View className="flex-row">
                                        <Text className="text-xs text-gray-500 mr-2">4.</Text>
                                        <Text className="text-xs text-gray-700 flex-1">Tekan tombol &quot;Konfirmasi Pembayaran&quot; di bawah untuk menyelesaikan transaksi.</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                )}

                {/* Amount Paid (for cash payments) */}
                {paymentMethod === 'cash' && selectedPaymentCardId === null && (
                    <View className="flex-col gap-2 mb-4">
                        <Text className="text-sm text-secondary-500 mb-1 font-semibold">Jumlah Dibayar</Text>

                        <TextInput
                            className={`bg-gray-50 rounded-xl px-4 py-3 text-gray-900 border ${isAmountInsufficient() ? 'border-red-500 bg-red-50' : 'border-gray-200'
                                }`}
                            placeholder="Masukkan jumlah yang dibayar"
                            value={amountPaid}
                            onChangeText={onAmountPaidChange}
                            keyboardType="numeric"
                        />

                        {/* Quick Price Selection Buttons */}
                        <View className="mt-2">
                            <Text className="text-xs text-secondary-500 mb-2">Pilihan Cepat</Text>
                            <View className="flex-row flex-wrap gap-2">
                                {getSuggestedAmounts().map((amount) => {
                                    const isExactTotal = amount === transaction?.total;
                                    return (
                                        <TouchableOpacity
                                            key={amount}
                                            onPress={() => onAmountPaidChange(formatIdrNumber(amount.toString()))}
                                            className={`px-4 py-2 rounded-lg border ${isExactTotal ? 'bg-blue-100 border-blue-300' : 'bg-gray-100 border-gray-300'
                                                }`}
                                        >
                                            <Text
                                                className={`text-xs font-semibold ${isExactTotal ? 'text-blue-700' : 'text-gray-700'}`}
                                            >
                                                {isExactTotal ? 'Total' : formatIDR(amount)}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>

                        {validationError && (
                            <View className="mt-2 bg-red-50 border border-red-200 rounded-xl p-3">
                                <View className="flex-row items-center mb-1">
                                    <Ionicons name="alert-circle" size={16} color="#DC2626" />
                                    <Text className="ml-2 text-sm font-semibold text-red-700">
                                        {validationError}
                                    </Text>
                                </View>
                            </View>
                        )}

                        {isAmountInsufficient() && (
                            <View className="mt-2 bg-red-50 border border-red-200 rounded-xl p-3">
                                <View className="flex-row items-center mb-1">
                                    <Ionicons name="alert-circle" size={16} color="#DC2626" />
                                    <Text className="ml-2 text-sm font-semibold text-red-700">
                                        Jumlah Pembayaran Kurang
                                    </Text>
                                </View>
                                <Text className="text-xs text-red-600 mt-1">
                                    Jumlah yang dibayar ({formatIDR(getAmountPaidValue())}) kurang dari total pembayaran (
                                    {formatIDR(transaction?.total || 0)}).
                                </Text>
                                <Text className="text-xs font-semibold text-red-700 mt-1">
                                    Kekurangan: {formatIDR((transaction?.total || 0) - getAmountPaidValue())}
                                </Text>
                            </View>
                        )}
                    </View>
                )}
            </View>
        </BottomSheet>
    );
}