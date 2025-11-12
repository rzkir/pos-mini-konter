import Input from '@/components/ui/input'

import { Text, TouchableOpacity, View } from 'react-native'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import HeaderGradient from '@/components/ui/HeaderGradient'

import { useStateCreateProducts } from '@/components/products/category/lib/useStateCreateProducts'

export default function CategoryForm() {
    const { isEdit, formData, loading, handleInputChange, handleSave, handleCancel } = useStateCreateProducts()

    return (
        <View className="flex-1 bg-background">
            <HeaderGradient
                title={isEdit ? 'Edit Kategori' : 'Tambah Kategori'}
            >
                <View className='flex-row items-center justify-between w-full'>
                    <TouchableOpacity onPress={handleCancel} className="px-3 py-2">
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
                <View className="mb-4">
                    <Text className="text-gray-700 font-medium mb-2">Nama Kategori *</Text>
                    <Input
                        value={formData.name}
                        onChangeText={(text) => handleInputChange('name', text)}
                        placeholder="Masukkan nama kategori"
                        returnKeyType="next"
                    />
                </View>

                <View className="mb-6">
                    <TouchableOpacity
                        onPress={handleSave}
                        disabled={loading}
                        className={`py-3 px-4 rounded-lg ${loading ? 'bg-gray-400' : 'bg-blue-600'}`}
                    >
                        <Text className="text-white text-center font-semibold text-lg">
                            {loading ? 'Menyimpan...' : (isEdit ? 'Perbarui Kategori' : 'Simpan Kategori')}
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAwareScrollView>
        </View>
    )
}