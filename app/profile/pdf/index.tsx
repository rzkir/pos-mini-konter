import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform, ActivityIndicator, Linking } from 'react-native';
import { router } from 'expo-router';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

import HeaderGradient from '@/components/ui/HeaderGradient';
import { generateReceiptHTML, testReceiptOutput } from '@/app/profile/printer/template';

type TestScenario = 'token-listrik' | 'pulsa' | 'paket-data' | 'voucher-game' | 'mixed';

export default function PDFTestPrint() {
    const [loading, setLoading] = useState(false);
    const [htmlContent, setHtmlContent] = useState<string>('');
    const [pdfUri, setPdfUri] = useState<string>('');
    const [selectedScenario, setSelectedScenario] = useState<TestScenario>('token-listrik');

    // Generate mock transaction based on scenario
    const getMockData = (scenario: TestScenario) => {
        const baseTransaction: Transaction = {
            id: Math.floor(Math.random() * 10000),
            transaction_number: `TXN-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
            customer_name: undefined,
            customer_phone: '081234567890',
            subtotal: 0,
            discount: 0,
            tax: 0,
            total: 0,
            payment_method: 'cash',
            payment_card_id: undefined,
            payment_status: 'paid',
            status: 'completed',
            created_by: 'Kasir Konter',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        let items: (TransactionItem & { product?: any })[] = [];

        switch (scenario) {
            case 'token-listrik':
                items = [
                    {
                        id: 1,
                        transaction_id: baseTransaction.id,
                        product_id: 1,
                        quantity: 1,
                        price: 20000,
                        discount: 0,
                        subtotal: 20000,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                        product: {
                            id: 1,
                            name: 'Token Listrik 20.000',
                            price: 20000,
                        },
                    },
                ];
                baseTransaction.subtotal = 20000;
                baseTransaction.total = 20000;
                baseTransaction.customer_phone = '1234567890123'; // Nomor meter
                break;

            case 'pulsa':
                items = [
                    {
                        id: 1,
                        transaction_id: baseTransaction.id,
                        product_id: 2,
                        quantity: 1,
                        price: 50000,
                        discount: 0,
                        subtotal: 50000,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                        product: {
                            id: 2,
                            name: 'Pulsa 50.000',
                            price: 50000,
                        },
                    },
                ];
                baseTransaction.subtotal = 50000;
                baseTransaction.total = 50000;
                baseTransaction.customer_name = 'Pelanggan Pulsa';
                break;

            case 'paket-data':
                items = [
                    {
                        id: 1,
                        transaction_id: baseTransaction.id,
                        product_id: 3,
                        quantity: 1,
                        price: 30000,
                        discount: 0,
                        subtotal: 30000,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                        product: {
                            id: 3,
                            name: 'Paket Data 10GB',
                            price: 30000,
                        },
                    },
                ];
                baseTransaction.subtotal = 30000;
                baseTransaction.total = 30000;
                baseTransaction.customer_name = 'Pelanggan Data';
                break;

            case 'voucher-game':
                items = [
                    {
                        id: 1,
                        transaction_id: baseTransaction.id,
                        product_id: 4,
                        quantity: 2,
                        price: 25000,
                        discount: 0,
                        subtotal: 50000,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                        product: {
                            id: 4,
                            name: 'Voucher Game Mobile Legends 25.000',
                            price: 25000,
                        },
                    },
                ];
                baseTransaction.subtotal = 50000;
                baseTransaction.total = 50000;
                baseTransaction.customer_name = 'Gamer';
                break;

            case 'mixed':
                items = [
                    {
                        id: 1,
                        transaction_id: baseTransaction.id,
                        product_id: 1,
                        quantity: 1,
                        price: 20000,
                        discount: 0,
                        subtotal: 20000,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                        product: {
                            id: 1,
                            name: 'Token Listrik 20.000',
                            price: 20000,
                        },
                    },
                    {
                        id: 2,
                        transaction_id: baseTransaction.id,
                        product_id: 2,
                        quantity: 1,
                        price: 50000,
                        discount: 0,
                        subtotal: 50000,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                        product: {
                            id: 2,
                            name: 'Pulsa 50.000',
                            price: 50000,
                        },
                    },
                    {
                        id: 3,
                        transaction_id: baseTransaction.id,
                        product_id: 5,
                        quantity: 1,
                        price: 10000,
                        discount: 0,
                        subtotal: 10000,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                        product: {
                            id: 5,
                            name: 'Voucher Game Free Fire 10.000',
                            price: 10000,
                        },
                    },
                ];
                baseTransaction.subtotal = 80000;
                baseTransaction.discount = 5000;
                baseTransaction.total = 75000;
                baseTransaction.customer_name = 'Pelanggan Setia';
                break;
        }

        return { transaction: baseTransaction, items };
    };

    const handleGeneratePreview = async () => {
        try {
            setLoading(true);

            const { transaction, items } = getMockData(selectedScenario);

            const html = await generateReceiptHTML({
                transaction,
                items,
            });

            setHtmlContent(html);

            // Generate PDF untuk preview
            if (Platform.OS === 'web') {
                await Print.printAsync({ html });
                Toast.show({
                    type: 'success',
                    text1: 'Berhasil',
                    text2: 'Gunakan dialog print untuk melihat preview',
                    visibilityTime: 2000,
                });
            } else {
                const { uri } = await Print.printToFileAsync({
                    html,
                    base64: false,
                });
                setPdfUri(uri);
                Toast.show({
                    type: 'success',
                    text1: 'Berhasil',
                    text2: 'Preview PDF berhasil dibuat. Klik &quot;Buka Preview&quot; untuk melihat.',
                    visibilityTime: 3000,
                });
            }
        } catch (error: any) {
            console.error('Error generating preview:', error);
            Toast.show({
                type: 'error',
                text1: 'Gagal',
                text2: error?.message || 'Gagal membuat preview struk',
                visibilityTime: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleOpenPreview = async () => {
        if (!pdfUri) {
            Toast.show({
                type: 'info',
                text1: 'Info',
                text2: 'Silakan generate preview terlebih dahulu',
                visibilityTime: 2000,
            });
            return;
        }

        try {
            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(pdfUri, {
                    mimeType: 'application/pdf',
                    dialogTitle: 'Preview PDF Struk',
                });
            } else {
                await Linking.openURL(pdfUri);
            }
        } catch (error: any) {
            console.error('Error opening preview:', error);
            Toast.show({
                type: 'error',
                text1: 'Gagal',
                text2: 'Gagal membuka preview PDF',
                visibilityTime: 3000,
            });
        }
    };

    const handleSavePDF = async () => {
        if (!htmlContent) {
            Toast.show({
                type: 'info',
                text1: 'Info',
                text2: 'Silakan generate preview terlebih dahulu',
                visibilityTime: 2000,
            });
            return;
        }

        try {
            setLoading(true);

            if (Platform.OS === 'web') {
                await Print.printAsync({ html: htmlContent });
                Toast.show({
                    type: 'success',
                    text1: 'Berhasil',
                    text2: 'Gunakan dialog print untuk simpan sebagai PDF',
                    visibilityTime: 3000,
                });
                return;
            }

            const { uri } = await Print.printToFileAsync({
                html: htmlContent,
                base64: false,
            });

            const fileName = `Struk_Konter_${selectedScenario}_${Date.now()}.pdf`;
            const baseDir =
                (FileSystem as any).documentDirectory ||
                (FileSystem as any).cacheDirectory;
            let fileUri = uri;
            if (baseDir) {
                try {
                    const target = `${baseDir}${fileName}`;
                    await FileSystem.moveAsync({ from: uri, to: target });
                    fileUri = target;
                } catch { }
            }

            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(fileUri, {
                    mimeType: 'application/pdf',
                    dialogTitle: 'Simpan atau Bagikan PDF',
                });
                Toast.show({
                    type: 'success',
                    text1: 'Berhasil',
                    text2: 'PDF berhasil dibuat dan dibagikan',
                    visibilityTime: 3000,
                });
            } else {
                Toast.show({
                    type: 'success',
                    text1: 'Berhasil',
                    text2: `PDF disimpan di: ${fileUri}`,
                    visibilityTime: 3000,
                });
            }
        } catch (error: any) {
            console.error('PDF generation error:', error);
            Toast.show({
                type: 'error',
                text1: 'Gagal Membagikan PDF',
                text2: error?.message || 'Gagal membuat/membagikan PDF.',
                visibilityTime: 4000,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleTestReceiptOutput = async () => {
        try {
            setLoading(true);
            await testReceiptOutput();
            Toast.show({
                type: 'success',
                text1: 'Berhasil',
                text2: 'Lihat hasil di console',
                visibilityTime: 2000,
            });
        } catch (error: any) {
            console.error('Error testing receipt:', error);
            Toast.show({
                type: 'error',
                text1: 'Gagal',
                text2: error?.message || 'Gagal test receipt',
                visibilityTime: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    const scenarioLabels: Record<TestScenario, string> = {
        'token-listrik': 'Token Listrik',
        'pulsa': 'Pulsa',
        'paket-data': 'Paket Data',
        'voucher-game': 'Voucher Game',
        'mixed': 'Campuran (Mixed)',
    };

    const { transaction: mockTransaction } = getMockData(selectedScenario);

    return (
        <View className="flex-1 bg-background">
            <HeaderGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                title="Test Print PDF Konter"
                icon="P"
            >
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="absolute left-4 top-12 z-10"
                >
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
            </HeaderGradient>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="px-4 py-6">
                    {/* Info Section */}
                    <View className="bg-card rounded-2xl border border-border p-4 mb-4">
                        <View className="flex-row items-center mb-2">
                            <Ionicons name="information-circle" size={20} color="#3b82f6" />
                            <Text className="text-text-primary font-bold text-lg ml-2">
                                Test Print PDF Konter
                            </Text>
                        </View>
                        <Text className="text-text-secondary text-sm mt-2">
                            Halaman ini digunakan untuk menguji dan melihat preview struk produk konter (token listrik, pulsa, paket data, voucher game, dll) dalam format PDF.
                        </Text>
                    </View>

                    {/* Scenario Selection */}
                    <View className="bg-card rounded-2xl border border-border p-4 mb-4">
                        <Text className="text-text-primary font-bold mb-3">
                            Pilih Skenario Test:
                        </Text>
                        <View className="flex-row flex-wrap gap-2">
                            {(Object.keys(scenarioLabels) as TestScenario[]).map((scenario) => (
                                <TouchableOpacity
                                    key={scenario}
                                    onPress={() => {
                                        setSelectedScenario(scenario);
                                        setHtmlContent('');
                                        setPdfUri('');
                                    }}
                                    className={`px-4 py-2 rounded-lg border ${selectedScenario === scenario
                                        ? 'bg-blue-500 border-blue-500'
                                        : 'bg-gray-100 border-gray-300'
                                        }`}
                                >
                                    <Text
                                        className={`font-semibold text-sm ${selectedScenario === scenario ? 'text-white' : 'text-gray-700'
                                            }`}
                                    >
                                        {scenarioLabels[scenario]}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Action Buttons */}
                    <View className="flex-col gap-3 mb-4">
                        <TouchableOpacity
                            onPress={handleGeneratePreview}
                            disabled={loading}
                            className="bg-blue-500 rounded-xl p-4 flex-row items-center justify-center"
                        >
                            {loading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <>
                                    <Ionicons name="eye" size={20} color="white" />
                                    <Text className="text-white font-bold text-base ml-2">
                                        Generate Preview
                                    </Text>
                                </>
                            )}
                        </TouchableOpacity>

                        {pdfUri && (
                            <TouchableOpacity
                                onPress={handleOpenPreview}
                                disabled={loading}
                                className="bg-purple-500 rounded-xl p-4 flex-row items-center justify-center"
                            >
                                <Ionicons name="open" size={20} color="white" />
                                <Text className="text-white font-bold text-base ml-2">
                                    Buka Preview PDF
                                </Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            onPress={handleSavePDF}
                            disabled={loading || !htmlContent}
                            className={`rounded-xl p-4 flex-row items-center justify-center ${htmlContent ? 'bg-green-500' : 'bg-gray-400'
                                }`}
                        >
                            {loading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <>
                                    <Ionicons name="download" size={20} color="white" />
                                    <Text className="text-white font-bold text-base ml-2">
                                        Simpan sebagai PDF
                                    </Text>
                                </>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleTestReceiptOutput}
                            disabled={loading}
                            className="bg-orange-500 rounded-xl p-4 flex-row items-center justify-center"
                        >
                            {loading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <>
                                    <Ionicons name="code" size={20} color="white" />
                                    <Text className="text-white font-bold text-base ml-2">
                                        Test Receipt Output (Console)
                                    </Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Preview Info */}
                    {htmlContent && (
                        <View className="bg-card rounded-2xl border border-border p-4 mb-4">
                            <View className="flex-row items-center mb-2">
                                <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                                <Text className="text-text-primary font-bold ml-2">
                                    Preview Siap
                                </Text>
                            </View>
                            <Text className="text-text-secondary text-sm">
                                Preview struk telah berhasil dibuat. Klik &quot;Buka Preview PDF&quot; untuk melihat hasilnya, atau &quot;Simpan sebagai PDF&quot; untuk menyimpan file.
                            </Text>
                        </View>
                    )}

                    {/* Mock Data Info */}
                    <View className="bg-gray-50 rounded-xl p-4 mt-4">
                        <Text className="text-text-secondary text-xs">
                            <Text className="font-bold">Skenario:</Text> {scenarioLabels[selectedScenario]} {'\n'}
                            <Text className="font-bold">No. Transaksi:</Text> {mockTransaction.transaction_number} {'\n'}
                            <Text className="font-bold">Total:</Text> Rp {mockTransaction.total.toLocaleString('id-ID')}
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
