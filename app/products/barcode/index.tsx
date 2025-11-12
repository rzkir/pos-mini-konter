import { useMemo, useState } from 'react';

import { FlatList, RefreshControl, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { useRouter } from 'expo-router';

import { BarcodeVisual } from '@/components/ui/BarcodeVisual';

import HeaderGradient from '@/components/ui/HeaderGradient';

import { useProducts } from '@/hooks/useProducts';

import { usePrinter } from '@/hooks/usePrinter';

export default function ProductsBarcodes() {
    const router = useRouter();
    const { products, refreshData } = useProducts();
    const [search, setSearch] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const { printText } = usePrinter();
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

    const list = useMemo(() => {
        const term = search.trim().toLowerCase();
        let base = products as any[];
        if (term) {
            base = base.filter(p =>
                String(p?.name ?? '').toLowerCase().includes(term) ||
                String(p?.barcode ?? '').toLowerCase().includes(term)
            );
        }
        return base;
    }, [products, search]);

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await refreshData();
        } finally {
            setRefreshing(false);
        }
    };

    const isSelected = (id: number) => selectedIds.has(id);

    const toggleSelect = (id: number) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
    };

    const selectAllFiltered = () => {
        setSelectedIds(new Set(list.map((p: any) => p.id)));
    };

    const clearSelection = () => setSelectedIds(new Set());

    const buildTextBarcode = (name: string, code: string) => {
        const computeEANChecksum = (digits: string) => {
            // digits: tanpa checksum, length 12 (EAN-13) atau 7 (EAN-8) atau 11 (UPC-A)
            const nums = digits.split('').map(n => Number(n));
            const len = nums.length;
            let sum = 0;
            if (len === 12) {
                // EAN-13: posisi dari kanan tanpa checksum, ganjil/genap mengikuti standar
                for (let i = 0; i < 12; i++) {
                    const value = nums[11 - i];
                    sum += (i % 2 === 0) ? value * 3 : value;
                }
            } else if (len === 7) {
                // EAN-8
                for (let i = 0; i < 7; i++) {
                    const value = nums[6 - i];
                    sum += (i % 2 === 0) ? value * 3 : value;
                }
            } else if (len === 11) {
                // UPC-A (sama pola dengan EAN-13 pada 11 digit)
                for (let i = 0; i < 11; i++) {
                    const value = nums[10 - i];
                    sum += (i % 2 === 0) ? value * 3 : value;
                }
            }
            const mod = sum % 10;
            return (10 - mod) % 10;
        };

        const prepareBarcodeForPrinter = (raw: string) => {
            const barcodeCode = raw.trim();
            let barcodeType: number;
            let dataToSend = barcodeCode;
            let expectedHRI = barcodeCode;

            if (/^\d{13}$/.test(barcodeCode)) {
                barcodeType = 67; // EAN-13
                const body = barcodeCode.slice(0, 12);
                const check = computeEANChecksum(body);
                dataToSend = body; // kirim tanpa checksum
                expectedHRI = body + String(check);
            } else if (/^\d{8}$/.test(barcodeCode)) {
                barcodeType = 68; // EAN-8
                const body = barcodeCode.slice(0, 7);
                const check = computeEANChecksum(body);
                dataToSend = body;
                expectedHRI = body + String(check);
            } else if (/^\d{12}$/.test(barcodeCode)) {
                barcodeType = 65; // UPC-A
                const body = barcodeCode.slice(0, 11);
                const check = computeEANChecksum(body);
                dataToSend = body;
                expectedHRI = body + String(check);
            } else {
                barcodeType = 73; // CODE128
                dataToSend = barcodeCode;
                expectedHRI = barcodeCode;
            }

            return { barcodeType, dataToSend, expectedHRI };
        };

        // ESC/POS Commands untuk printer RPP02N
        const ESC = '\x1B';
        const GS = '\x1D';
        const INIT = `${ESC}@`; // Initialize printer
        const ALIGN_CENTER = `${ESC}\x61\x01`; // Center align
        const ALIGN_LEFT = `${ESC}\x61\x00`; // Left align
        const BOLD_ON = `${ESC}\x45\x01`; // Bold on
        const BOLD_OFF = `${ESC}\x45\x00`; // Bold off

        // Barcode height (1-255, default sekitar 50)
        const BARCODE_HEIGHT = '\x50'; // 80 dots

        // Barcode width (0-6, default 2)
        const BARCODE_WIDTH = '\x03'; // Medium width

        // HRI position: 0 = none, 1 = above, 2 = below, 3 = above & below
        const HRI_POSITION = '\x02'; // Below barcode

        const parts: string[] = [];

        // Initialize printer
        parts.push(INIT);

        // Product name (bold, centered)
        if (name) {
            parts.push(ALIGN_CENTER);
            parts.push(BOLD_ON);
            parts.push(`${name}\n`);
            parts.push(BOLD_OFF);
            parts.push('\n');
        }

        // Barcode printing
        if (code && code.trim()) {
            const { barcodeType, dataToSend, expectedHRI } = prepareBarcodeForPrinter(code);

            // Center align for barcode
            parts.push(ALIGN_CENTER);

            // Set barcode height and width
            parts.push(GS + 'h' + BARCODE_HEIGHT); // Height: GS h [height]
            parts.push(GS + 'w' + BARCODE_WIDTH); // Width: GS w [width]

            // Set HRI position properly (GS H n)
            parts.push(GS + 'H' + HRI_POSITION);

            // Print barcode command
            // GS k [type] [n] [data] [HRI]
            const dataLength = dataToSend.length;
            parts.push(
                GS + 'k' +
                String.fromCharCode(barcodeType) +
                String.fromCharCode(dataLength) +
                dataToSend
            );

            parts.push('\n\n');

            // Log: tampilkan apa yang akan terlihat sebagai HRI di kertas
            console.log('[PRINT BARCODE]', {
                name,
                input: String(code).trim(),
                sentType: barcodeType,
                sentData: dataToSend,
                expectedHRI,
            });
        }

        // Reset to left align and add spacing
        parts.push(ALIGN_LEFT);
        parts.push('\n\n');

        return parts.join('');
    };

    const printItem = async (item: any) => {
        // Hanya gunakan barcode dari data produk, jangan membuat barcode baru
        const productBarcode = item?.barcode ? String(item.barcode).trim() : '';
        if (!productBarcode) {
            // Skip jika produk tidak memiliki barcode
            return;
        }
        const payload = buildTextBarcode(String(item?.name ?? ''), productBarcode);
        await printText(payload);
    };

    const printSelected = async () => {
        if (selectedIds.size === 0) return;
        const selectedMap = new Set(selectedIds);
        const items = (products as any[]).filter(p => selectedMap.has(p.id));
        // Hanya gunakan barcode dari data produk, filter produk yang tidak memiliki barcode
        const itemsWithBarcode = items.filter(p => {
            const barcode = p?.barcode ? String(p.barcode).trim() : '';
            return barcode.length > 0;
        });
        if (itemsWithBarcode.length === 0) {
            // Tidak ada produk dengan barcode untuk dicetak
            return;
        }
        const payload = itemsWithBarcode
            .map(p => {
                const barcode = p?.barcode ? String(p.barcode).trim() : '';
                return buildTextBarcode(String(p?.name ?? ''), barcode);
            })
            .join('\n\n');
        await printText(payload);
    };

    const renderItem = ({ item }: { item: any }) => (
        <View className="bg-white rounded-2xl p-4 mb-3 border border-gray-100">
            <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center">
                    <TouchableOpacity onPress={() => toggleSelect(item.id)} className="mr-2">
                        <Ionicons name={isSelected(item.id) ? 'checkbox' : 'square-outline'} size={20} color={isSelected(item.id) ? '#10B981' : '#6B7280'} />
                    </TouchableOpacity>
                    <View className="bg-blue-100 p-2 rounded-xl mr-2">
                        <Ionicons name="cube-outline" size={18} color="#3B82F6" />
                    </View>
                    <Text className="text-base font-semibold text-gray-900">{item.name}</Text>
                </View>
                <View className="flex-row items-center gap-2">
                    <TouchableOpacity onPress={() => printItem(item)} className="px-3 py-1.5 bg-gray-800 rounded-lg">
                        <Text className="text-white text-xs font-semibold">Print</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push(`/products/${item.id}`)} className="px-3 py-1.5 bg-orange-500 rounded-lg">
                        <Text className="text-white text-xs font-semibold">Detail</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {item.barcode ? (
                <BarcodeVisual barcode={item.barcode} width={280} height={60} />
            ) : (
                <View className="px-3 py-2 bg-gray-100 rounded-lg">
                    <Text className="text-gray-500 text-sm">Tidak ada barcode</Text>
                </View>
            )}
        </View>
    );

    return (
        <View className="flex-1 bg-background">
            <HeaderGradient
                title="Barcode Produk"
                subtitle="Lihat semua barcode produk"
                icon="B"
                colors={['#FF9228', '#FF9228']}
            >
                <View className="flex-row items-center justify-between w-full">
                    <TouchableOpacity onPress={() => router.back()} className="bg-white/20 p-3 rounded-full">
                        <Ionicons name="arrow-back" size={20} color="#fff" />
                    </TouchableOpacity>
                    <Text className="text-white font-bold text-xl">Barcode Produk</Text>
                    <View className="w-10" />
                </View>
            </HeaderGradient>

            <FlatList
                className="flex-1 px-4"
                data={list}
                keyExtractor={(item: any) => item.id.toString()}
                ListHeaderComponent={(
                    <View className="pt-5 px-1">
                        <View className="relative mb-4">
                            <View className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                                <Ionicons name="search" size={20} color="#6B7280" />
                            </View>
                            <TextInput
                                className="bg-white/95 backdrop-blur-sm pl-12 pr-4 py-4 rounded-2xl border-0 text-gray-800 placeholder-gray-500"
                                placeholder="Cari berdasarkan nama atau barcode..."
                                value={search}
                                onChangeText={setSearch}
                                style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 }}
                            />
                        </View>
                        <View className="flex-row items-center justify-between mb-3">
                            <View className="flex-row items-center gap-2">
                                <TouchableOpacity onPress={selectAllFiltered} className="px-3 py-2 bg-gray-200 rounded-lg">
                                    <Text className="text-gray-800 text-xs font-semibold">Pilih Semua</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={clearSelection} className="px-3 py-2 bg-gray-100 rounded-lg">
                                    <Text className="text-gray-600 text-xs font-semibold">Bersihkan</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity
                                onPress={printSelected}
                                disabled={selectedIds.size === 0}
                                className={`px-4 py-2 rounded-xl ${selectedIds.size === 0 ? 'bg-gray-300' : 'bg-gray-800'}`}
                            >
                                <View className="flex-row items-center">
                                    <Ionicons name="print-outline" size={18} color="#fff" />
                                    <Text className="text-white font-semibold ml-2 text-xs">Cetak Terpilih ({selectedIds.size})</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 16 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#FF9228']} />}
                ListEmptyComponent={(
                    <View className="mt-6 items-center">
                        <Text className="text-gray-500">Tidak ada produk</Text>
                    </View>
                )}
            />
        </View>
    );
}