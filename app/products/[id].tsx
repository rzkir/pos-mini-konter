import { Image, Text, TouchableOpacity, View, Switch } from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { Ionicons } from '@expo/vector-icons';

import { BarcodeScanner } from '@/components/products/BarcodeScanner';

import Input from '@/components/ui/input';

import { BarcodeVisual } from '@/components/ui/BarcodeVisual';

import HeaderGradient from '@/components/ui/HeaderGradient';

import BottomSheet from '@/helper/bottomsheets/BottomSheet';

import { useStateCreateProducts } from '@/components/products/create/lib/useStateCreateProducts';

export default function EditProduct() {
    const {
        router,
        isEdit,
        showScanner,
        setShowScanner,
        barcodeAction,
        setBarcodeAction,
        formData,
        setFormData,
        nameRef,
        priceRef,
        modalRef,
        stockRef,
        barcodeRef,
        descriptionRef,
        minStockRef,
        discountRef,
        isDecimalUnit,
        handleInputChange,
        handlePriceChange,
        handleModalChange,
        handleBarcodeScan,
        handleBarcodeGenerate,
        handleStockChange,
        handleMinStockChange,
        handleCategorySelect,
        handleSizeSelect,
        handleSupplierSelect,
        handleUnitSelect,
        handlePickImage,
        incrementStock,
        decrementStock,
        incrementDiscount,
        decrementDiscount,
        handleDiscountChange,
        handleSave,
        categoryOptions,
        sizeOptions,
        supplierOptions,
        unitOptions,
        showBarcodeActionSheet,
        setShowBarcodeActionSheet,
        showUnitSheet,
        setShowUnitSheet,
        showCategorySheet,
        setShowCategorySheet,
        showSizeSheet,
        setShowSizeSheet,
        showSupplierSheet,
        setShowSupplierSheet,
    } = useStateCreateProducts();

    return (
        <View className="flex-1 bg-background">
            {/* Header */}
            <HeaderGradient
                title={isEdit ? 'Edit Produk' : 'Tambah Produk'}
                colors={['#FF9228', '#FF9228']}
            >
                <View className='flex-row items-center justify-between w-full'>
                    <TouchableOpacity onPress={() => router.back()} className="px-3 py-2">
                        <Text className="text-white text-base font-semibold">Batal</Text>
                    </TouchableOpacity>
                    <Text className="text-xl font-semibold text-white">
                        {isEdit ? 'Edit Produk' : 'Tambah Produk'}
                    </Text>
                    <TouchableOpacity onPress={handleSave} className="bg-white px-4 py-2 rounded-full">
                        <Text className="text-orange-600 text-base font-semibold">Simpan</Text>
                    </TouchableOpacity>
                </View>
            </HeaderGradient>

            <KeyboardAwareScrollView
                className="flex-1"
                keyboardShouldPersistTaps="always"
                enableOnAndroid={true}
                enableAutomaticScroll={true}
                extraScrollHeight={50}
                extraHeight={100}
                showsVerticalScrollIndicator={false}
                resetScrollToCoords={{ x: 0, y: 0 }}
                scrollEnabled={true}
            >
                <View className="flex-col gap-6">
                    {/* Image Picker */}
                    <View className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                        <Text className="text-gray-900 font-semibold mb-3 text-center">Gambar Produk</Text>
                        <View className="items-center">
                            {formData.image_url ? (
                                <Image
                                    source={{ uri: formData.image_url }}
                                    style={{ width: 160, height: 160, borderRadius: 16, marginBottom: 12 }}
                                />
                            ) : (
                                <View className="mb-3 items-center justify-center rounded-2xl bg-gray-100" style={{ width: 160, height: 160 }}>
                                    <Text className="text-gray-400">Tidak ada gambar</Text>
                                </View>
                            )}
                            <TouchableOpacity onPress={handlePickImage} className="bg-blue-600 px-4 py-2 rounded-lg">
                                <Text className="text-white font-medium">Pilih Gambar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Barcode */}
                    <View className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                        <Text className="text-gray-900 font-semibold mb-3">Barcode</Text>
                        <View className="flex-row items-center">
                            <View style={{ flex: 1, marginRight: 8 }}>
                                <Input
                                    ref={barcodeRef}
                                    defaultValue={formData.barcode}
                                    onChangeText={(text: string) => handleInputChange('barcode', text)}
                                    placeholder="Masukkan barcode atau scan"
                                    keyboardType="default"
                                    returnKeyType="next"
                                    onSubmitEditing={() => nameRef.current?.focus()}
                                    containerStyle={{ marginBottom: 0 }}
                                />
                            </View>
                            <View style={{ width: 180 }}>
                                <TouchableOpacity
                                    onPress={() => setShowBarcodeActionSheet(true)}
                                    className="border border-gray-300 rounded-lg p-3 bg-white flex-row items-center justify-between"
                                >
                                    <Text className={`text-base ${barcodeAction ? 'text-gray-900' : 'text-gray-500'}`}>
                                        {barcodeAction === 'scan' ? 'Scan' : barcodeAction === 'generate' ? 'Generate Otomatis' : 'Pilih tindakan'}
                                    </Text>
                                    <Ionicons name="chevron-down" size={16} color="#6B7280" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        {formData.barcode ? (
                            <View className="mt-3 items-center rounded-xl border border-gray-100 bg-gray-50 py-3">
                                <BarcodeVisual barcode={formData.barcode} width={280} height={60} />
                            </View>
                        ) : null}
                    </View>

                    {/* Informasi Dasar */}
                    <View className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                        <Text className="text-gray-900 font-semibold mb-3">Informasi Dasar</Text>
                        <Input
                            ref={nameRef}
                            label="Nama Produk *"
                            defaultValue={formData.name}
                            onChangeText={(text: string) => handleInputChange('name', text)}
                            placeholder="Masukkan nama produk"
                            returnKeyType="next"
                            onSubmitEditing={() => priceRef.current?.focus()}
                        />

                        <View className="flex-row gap-2 mt-2">
                            <View className="flex-1">
                                <Input
                                    ref={priceRef}
                                    label="Harga Jual *"
                                    value={formData.price}
                                    onChangeText={handlePriceChange}
                                    placeholder="0"
                                    keyboardType="numeric"
                                    returnKeyType="next"
                                    onSubmitEditing={() => modalRef.current?.focus()}
                                />
                            </View>
                            <View className="flex-1">
                                <Input
                                    ref={modalRef}
                                    label="Harga Modal"
                                    value={formData.modal}
                                    onChangeText={handleModalChange}
                                    placeholder="0"
                                    keyboardType="numeric"
                                    returnKeyType="next"
                                    onSubmitEditing={() => stockRef.current?.focus()}
                                />
                            </View>
                        </View>

                        <View className="mt-2">
                            <Input
                                ref={stockRef}
                                label="Stok *"
                                value={formData.stock}
                                onChangeText={handleStockChange}
                                placeholder={isDecimalUnit(formData.unit) ? 'contoh: 1.5' : 'contoh: 10'}
                                keyboardType={isDecimalUnit(formData.unit) ? 'decimal-pad' : 'numeric'}
                                returnKeyType="next"
                                onSubmitEditing={() => descriptionRef.current?.focus()}
                                rightIcon={(
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <TouchableOpacity onPress={() => decrementStock('stock')} style={{ paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 6, marginRight: 6 }}>
                                            <Text style={{ fontSize: 16, color: '#374151' }}>-</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => incrementStock('stock')} style={{ paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 6, marginRight: 8 }}>
                                            <Text style={{ fontSize: 16, color: '#374151' }}>+</Text>
                                        </TouchableOpacity>
                                        <Text style={{ fontSize: 14, color: '#6B7280' }}>{formData.unit || 'pcs'}</Text>
                                    </View>
                                )}
                            />
                            <Text className="text-gray-500 mt-1">Masukkan stok dalam {isDecimalUnit(formData.unit) ? 'angka desimal' : 'bilangan bulat'} sesuai satuan.</Text>
                        </View>
                    </View>

                    {/* Klasifikasi */}
                    <View className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                        <Text className="text-gray-900 font-semibold mb-3">Klasifikasi</Text>
                        <View className='mb-3'>
                            <View className="flex-row items-center justify-between">
                                <Text className="text-gray-700 font-medium">Best Seller</Text>
                                <Switch
                                    value={formData.best_seller}
                                    onValueChange={(val) => setFormData(prev => ({ ...prev, best_seller: val }))}
                                />
                            </View>
                        </View>

                        <View className="mb-3">
                            <Text className="text-gray-700 font-medium mb-2">Unit</Text>
                            <TouchableOpacity
                                onPress={() => setShowUnitSheet(true)}
                                className="border border-gray-300 rounded-lg p-3 bg-white flex-row items-center justify-between"
                            >
                                <Text className={`text-base ${formData.unit ? 'text-gray-900' : 'text-gray-500'}`}>
                                    {unitOptions.find(opt => opt.value === formData.unit)?.label || 'Pilih satuan'}
                                </Text>
                                <Ionicons name="chevron-down" size={16} color="#6B7280" />
                            </TouchableOpacity>
                        </View>

                        <View className="mb-3">
                            <Text className="text-gray-700 font-medium mb-2">Kategori</Text>
                            <TouchableOpacity
                                onPress={() => setShowCategorySheet(true)}
                                className="border border-gray-300 rounded-lg p-3 bg-white flex-row items-center justify-between"
                            >
                                <Text className={`text-base ${formData.category_id ? 'text-gray-900' : 'text-gray-500'}`}>
                                    {categoryOptions.find((opt: { label: string; value: number }) => opt.value.toString() === formData.category_id)?.label || 'Pilih kategori'}
                                </Text>
                                <Ionicons name="chevron-down" size={16} color="#6B7280" />
                            </TouchableOpacity>
                        </View>

                        <View className="mb-3">
                            <Text className="text-gray-700 font-medium mb-2">Ukuran</Text>
                            <TouchableOpacity
                                onPress={() => setShowSizeSheet(true)}
                                className="border border-gray-300 rounded-lg p-3 bg-white flex-row items-center justify-between"
                            >
                                <Text className={`text-base ${formData.size_id ? 'text-gray-900' : 'text-gray-500'}`}>
                                    {sizeOptions.find((opt: { label: string; value: number }) => opt.value.toString() === formData.size_id)?.label || 'Pilih ukuran'}
                                </Text>
                                <Ionicons name="chevron-down" size={16} color="#6B7280" />
                            </TouchableOpacity>
                        </View>

                        <View>
                            <Text className="text-gray-700 font-medium mb-2">Supplier</Text>
                            <TouchableOpacity
                                onPress={() => setShowSupplierSheet(true)}
                                className="border border-gray-300 rounded-lg p-3 bg-white flex-row items-center justify-between"
                            >
                                <Text className={`text-base ${formData.supplier_id ? 'text-gray-900' : 'text-gray-500'}`}>
                                    {supplierOptions.find((opt: { label: string; value: number }) => opt.value.toString() === formData.supplier_id)?.label || 'Pilih supplier'}
                                </Text>
                                <Ionicons name="chevron-down" size={16} color="#6B7280" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Informasi Tambahan */}
                    <View className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                        <Text className="text-gray-900 font-semibold mb-3">Informasi Tambahan</Text>
                        <Input
                            ref={descriptionRef}
                            label="Deskripsi"
                            value={formData.description}
                            onChangeText={(text) => handleInputChange('description', text)}
                            placeholder="Masukkan deskripsi produk"
                            returnKeyType="next"
                            onSubmitEditing={() => minStockRef.current?.focus()}
                        />

                        <View className="flex-col space-x-2 mt-2">
                            <View className="flex-1 mb-5">
                                <Input
                                    ref={minStockRef}
                                    label="Stok Minimum"
                                    value={formData.min_stock}
                                    onChangeText={handleMinStockChange}
                                    placeholder={isDecimalUnit(formData.unit) ? 'contoh: 0.5' : 'contoh: 2'}
                                    keyboardType={isDecimalUnit(formData.unit) ? 'decimal-pad' : 'numeric'}
                                    returnKeyType="next"
                                    onSubmitEditing={() => discountRef.current?.focus()}
                                    rightIcon={(
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <TouchableOpacity onPress={() => decrementStock('min_stock')} style={{ paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 6, marginRight: 6 }}>
                                                <Text style={{ fontSize: 16, color: '#374151' }}>-</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => incrementStock('min_stock')} style={{ paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 6, marginRight: 8 }}>
                                                <Text style={{ fontSize: 16, color: '#374151' }}>+</Text>
                                            </TouchableOpacity>
                                            <Text style={{ fontSize: 14, color: '#6B7280' }}>{formData.unit || 'pcs'}</Text>
                                        </View>
                                    )}
                                />
                                <Text className="text-gray-500">Stok minimum akan memberi peringatan saat stok turun di bawah nilai ini.</Text>
                            </View>

                            <View className="flex-1">
                                <Input
                                    ref={discountRef}
                                    label="Diskon (%)"
                                    value={formData.discount}
                                    onChangeText={handleDiscountChange}
                                    placeholder="0"
                                    keyboardType="decimal-pad"
                                    returnKeyType="next"
                                    onSubmitEditing={() => { }}
                                    rightIcon={
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <TouchableOpacity
                                                onPress={decrementDiscount}
                                                style={{ paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 6, marginRight: 6 }}
                                            >
                                                <Text style={{ fontSize: 16, color: '#374151' }}>-</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={incrementDiscount}
                                                style={{ paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 6, marginRight: 8 }}
                                            >
                                                <Text style={{ fontSize: 16, color: '#374151' }}>+</Text>
                                            </TouchableOpacity>
                                            <Text style={{ fontSize: 14, color: '#6B7280' }}>%</Text>
                                        </View>
                                    }
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </KeyboardAwareScrollView>

            {/* Barcode Scanner Modal */}
            <BarcodeScanner
                visible={showScanner}
                onClose={() => setShowScanner(false)}
                onScan={handleBarcodeScan}
            />

            {/* Barcode Action Bottom Sheet */}
            <BottomSheet
                visible={showBarcodeActionSheet}
                title="Pilih Tindakan Barcode"
                onClose={() => setShowBarcodeActionSheet(false)}
            >
                <TouchableOpacity
                    onPress={() => {
                        setBarcodeAction('scan');
                        setShowBarcodeActionSheet(false);
                        setShowScanner(true);
                    }}
                    className={`flex-row items-center justify-between p-4 border-b border-gray-200 ${barcodeAction === 'scan' ? 'bg-blue-50' : 'bg-white'}`}
                >
                    <Text className={`text-base ${barcodeAction === 'scan' ? 'text-blue-600 font-semibold' : 'text-gray-900'}`}>
                        Scan
                    </Text>
                    {barcodeAction === 'scan' && <Ionicons name="checkmark" size={20} color="#2563eb" />}
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        setBarcodeAction('generate');
                        setShowBarcodeActionSheet(false);
                        handleBarcodeGenerate();
                    }}
                    className={`flex-row items-center justify-between p-4 ${barcodeAction === 'generate' ? 'bg-blue-50' : 'bg-white'}`}
                >
                    <Text className={`text-base ${barcodeAction === 'generate' ? 'text-blue-600 font-semibold' : 'text-gray-900'}`}>
                        Generate Otomatis
                    </Text>
                    {barcodeAction === 'generate' && <Ionicons name="checkmark" size={20} color="#2563eb" />}
                </TouchableOpacity>
            </BottomSheet>

            {/* Unit Bottom Sheet */}
            <BottomSheet
                visible={showUnitSheet}
                title="Pilih Satuan"
                onClose={() => setShowUnitSheet(false)}
            >
                <TouchableOpacity
                    onPress={() => {
                        handleUnitSelect('');
                        setShowUnitSheet(false);
                    }}
                    className={`flex-row items-center justify-between p-4 border-b border-gray-200 ${!formData.unit ? 'bg-blue-50' : 'bg-white'}`}
                >
                    <Text className={`text-base ${!formData.unit ? 'text-blue-600 font-semibold' : 'text-gray-900'}`}>
                        Pilih satuan
                    </Text>
                    {!formData.unit && <Ionicons name="checkmark" size={20} color="#2563eb" />}
                </TouchableOpacity>
                {unitOptions.map((option) => (
                    <TouchableOpacity
                        key={option.value}
                        onPress={() => {
                            handleUnitSelect(option.value);
                            setShowUnitSheet(false);
                        }}
                        className={`flex-row items-center justify-between p-4 border-b border-gray-200 ${formData.unit === option.value ? 'bg-blue-50' : 'bg-white'}`}
                    >
                        <Text className={`text-base ${formData.unit === option.value ? 'text-blue-600 font-semibold' : 'text-gray-900'}`}>
                            {option.label}
                        </Text>
                        {formData.unit === option.value && <Ionicons name="checkmark" size={20} color="#2563eb" />}
                    </TouchableOpacity>
                ))}
            </BottomSheet>

            {/* Category Bottom Sheet */}
            <BottomSheet
                visible={showCategorySheet}
                title="Pilih Kategori"
                onClose={() => setShowCategorySheet(false)}
            >
                <TouchableOpacity
                    onPress={() => {
                        handleCategorySelect('');
                        setShowCategorySheet(false);
                    }}
                    className={`flex-row items-center justify-between p-4 border-b border-gray-200 ${!formData.category_id ? 'bg-blue-50' : 'bg-white'}`}
                >
                    <Text className={`text-base ${!formData.category_id ? 'text-blue-600 font-semibold' : 'text-gray-900'}`}>
                        Pilih kategori
                    </Text>
                    {!formData.category_id && <Ionicons name="checkmark" size={20} color="#2563eb" />}
                </TouchableOpacity>
                {categoryOptions.map((option: { label: string; value: number }) => (
                    <TouchableOpacity
                        key={option.value}
                        onPress={() => {
                            handleCategorySelect(option.value.toString());
                            setShowCategorySheet(false);
                        }}
                        className={`flex-row items-center justify-between p-4 border-b border-gray-200 ${formData.category_id === option.value.toString() ? 'bg-blue-50' : 'bg-white'}`}
                    >
                        <Text className={`text-base ${formData.category_id === option.value.toString() ? 'text-blue-600 font-semibold' : 'text-gray-900'}`}>
                            {option.label}
                        </Text>
                        {formData.category_id === option.value.toString() && <Ionicons name="checkmark" size={20} color="#2563eb" />}
                    </TouchableOpacity>
                ))}
            </BottomSheet>

            {/* Size Bottom Sheet */}
            <BottomSheet
                visible={showSizeSheet}
                title="Pilih Ukuran"
                onClose={() => setShowSizeSheet(false)}
            >
                <TouchableOpacity
                    onPress={() => {
                        handleSizeSelect('');
                        setShowSizeSheet(false);
                    }}
                    className={`flex-row items-center justify-between p-4 border-b border-gray-200 ${!formData.size_id ? 'bg-blue-50' : 'bg-white'}`}
                >
                    <Text className={`text-base ${!formData.size_id ? 'text-blue-600 font-semibold' : 'text-gray-900'}`}>
                        Pilih ukuran
                    </Text>
                    {!formData.size_id && <Ionicons name="checkmark" size={20} color="#2563eb" />}
                </TouchableOpacity>
                {sizeOptions.map((option: { label: string; value: number }) => (
                    <TouchableOpacity
                        key={option.value}
                        onPress={() => {
                            handleSizeSelect(option.value.toString());
                            setShowSizeSheet(false);
                        }}
                        className={`flex-row items-center justify-between p-4 border-b border-gray-200 ${formData.size_id === option.value.toString() ? 'bg-blue-50' : 'bg-white'}`}
                    >
                        <Text className={`text-base ${formData.size_id === option.value.toString() ? 'text-blue-600 font-semibold' : 'text-gray-900'}`}>
                            {option.label}
                        </Text>
                        {formData.size_id === option.value.toString() && <Ionicons name="checkmark" size={20} color="#2563eb" />}
                    </TouchableOpacity>
                ))}
            </BottomSheet>

            {/* Supplier Bottom Sheet */}
            <BottomSheet
                visible={showSupplierSheet}
                title="Pilih Supplier"
                onClose={() => setShowSupplierSheet(false)}
            >
                <TouchableOpacity
                    onPress={() => {
                        handleSupplierSelect('');
                        setShowSupplierSheet(false);
                    }}
                    className={`flex-row items-center justify-between p-4 border-b border-gray-200 ${!formData.supplier_id ? 'bg-blue-50' : 'bg-white'}`}
                >
                    <Text className={`text-base ${!formData.supplier_id ? 'text-blue-600 font-semibold' : 'text-gray-900'}`}>
                        Pilih supplier
                    </Text>
                    {!formData.supplier_id && <Ionicons name="checkmark" size={20} color="#2563eb" />}
                </TouchableOpacity>
                {supplierOptions.map((option: { label: string; value: number }) => (
                    <TouchableOpacity
                        key={option.value}
                        onPress={() => {
                            handleSupplierSelect(option.value.toString());
                            setShowSupplierSheet(false);
                        }}
                        className={`flex-row items-center justify-between p-4 border-b border-gray-200 ${formData.supplier_id === option.value.toString() ? 'bg-blue-50' : 'bg-white'}`}
                    >
                        <Text className={`text-base ${formData.supplier_id === option.value.toString() ? 'text-blue-600 font-semibold' : 'text-gray-900'}`}>
                            {option.label}
                        </Text>
                        {formData.supplier_id === option.value.toString() && <Ionicons name="checkmark" size={20} color="#2563eb" />}
                    </TouchableOpacity>
                ))}
            </BottomSheet>
        </View>
    );
}