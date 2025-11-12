import Input from '@/components/ui/input'

import { Switch, Text, TouchableOpacity, View } from 'react-native'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { useStateProductsSuppliersCreate } from '@/components/products/suppliers/lib/useStateProductsSuppliersCreate'

import HeaderGradient from '@/components/ui/HeaderGradient'

import { router } from 'expo-router'

export default function SupplierForm() {
    const { formData, loading, handleInputChange, handleSave, isEdit } = useStateProductsSuppliersCreate()

    return (
        <View className="flex-1 bg-background">
            {/* Action Bar */}
            <HeaderGradient
                title={isEdit ? 'Edit Supplier' : 'Tambah Supplier'}
            >
                <View className='flex-row items-center justify-between w-full'>
                    <TouchableOpacity onPress={() => router.back()} className="px-3 py-2">
                        <Text className="text-white text-base font-semibold">Batal</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleSave} disabled={loading} className="bg-white px-4 py-2 rounded-full">
                        <Text className="text-orange-600 text-base font-semibold">Simpan</Text>
                    </TouchableOpacity>
                </View>
            </HeaderGradient>

            <KeyboardAwareScrollView
                className="flex-1"
                contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
                keyboardShouldPersistTaps="always"
                enableOnAndroid={true}
                enableAutomaticScroll={true}
                extraScrollHeight={50}
                extraHeight={100}
                showsVerticalScrollIndicator={false}
                resetScrollToCoords={{ x: 0, y: 0 }}
                scrollEnabled={true}
            >
                {/* Card */}
                <View className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                    <Input
                        label="Nama Supplier *"
                        value={formData.name}
                        onChangeText={(text) => handleInputChange('name', text)}
                        placeholder="Masukkan nama supplier"
                        returnKeyType="next"
                    />

                    <Input
                        label="Nama Kontak *"
                        value={formData.contact_person}
                        onChangeText={(text) => handleInputChange('contact_person', text)}
                        placeholder="Masukkan nama kontak"
                        returnKeyType="next"
                    />

                    <Input
                        label="Nomor Telepon *"
                        value={formData.phone}
                        onChangeText={(text) => handleInputChange('phone', text)}
                        placeholder="Masukkan nomor telepon"
                        keyboardType="phone-pad"
                        returnKeyType="next"
                    />

                    <Input
                        label="Email (opsional)"
                        value={formData.email}
                        onChangeText={(text) => handleInputChange('email', text)}
                        placeholder="Masukkan email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        returnKeyType="next"
                    />

                    <Input
                        label="Alamat *"
                        value={formData.address}
                        onChangeText={(text) => handleInputChange('address', text)}
                        placeholder="Masukkan alamat supplier"
                        multiline
                        numberOfLines={4}
                        returnKeyType="done"
                    />

                    {/* Status Toggle */}
                    <View className="mt-2 flex-row items-center justify-between">
                        <View>
                            <Text className="text-gray-700 font-medium">Status</Text>
                            <Text className="text-gray-500 text-xs mt-0.5">Tandai supplier sebagai aktif/tidak aktif</Text>
                        </View>
                        <View className="flex-row items-center">
                            <Text className={`mr-2 text-sm ${formData.is_active ? 'text-green-700' : 'text-red-700'}`}>
                                {formData.is_active ? 'Aktif' : 'Tidak Aktif'}
                            </Text>
                            <Switch
                                value={formData.is_active}
                                onValueChange={(val) => handleInputChange('is_active', val)}
                                thumbColor={formData.is_active ? '#10B981' : '#F3F4F6'}
                                trackColor={{ false: '#D1D5DB', true: '#A7F3D0' }}
                            />
                        </View>
                    </View>
                </View>

                {/* Bottom primary action */}
                <View className="mt-6">
                    <TouchableOpacity
                        onPress={handleSave}
                        disabled={loading}
                        className={`py-3 px-4 rounded-lg ${loading ? 'bg-gray-400' : 'bg-blue-600'}`}
                    >
                        <Text className="text-white text-center font-semibold text-lg">
                            {loading ? 'Menyimpan...' : (isEdit ? 'Perbarui Supplier' : 'Simpan Supplier')}
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAwareScrollView>
        </View>
    )
}