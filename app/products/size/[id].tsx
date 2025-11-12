import Input from '@/components/ui/input'

import { useCallback, useEffect, useState } from 'react'

import { Switch, Text, TouchableOpacity, View } from 'react-native'

import Toast from 'react-native-toast-message'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { useLocalSearchParams, useRouter } from 'expo-router'

import { ProductSizeService } from '@/services/productSizeService'

import HeaderGradient from '@/components/ui/HeaderGradient'

export default function SizeForm() {
    const { id } = useLocalSearchParams()
    const router = useRouter()
    const isEdit = id !== 'new'
    // Removed: const { user } = useAuth()

    const [formData, setFormData] = useState({
        uid: '',
        name: '',
        is_active: true
    })
    const [loading, setLoading] = useState(false)

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const loadSizeData = useCallback(async () => {
        try {
            setLoading(true)
            const size = await ProductSizeService.getById(Number(id))
            if (size) {
                setFormData({
                    uid: size.uid,
                    name: size.name,
                    is_active: size.is_active
                })
            }
        } catch (error) {
            console.error('Error loading size:', error)
            Toast.show({ type: 'error', text1: 'Error', text2: 'Gagal memuat data ukuran' })
        } finally {
            setLoading(false)
        }
    }, [id])

    // Load data for edit
    useEffect(() => {
        if (isEdit && id) {
            loadSizeData()
        }
    }, [isEdit, id, loadSizeData])

    const handleSave = async () => {
        if (!formData.name.trim()) {
            Toast.show({ type: 'error', text1: 'Nama ukuran harus diisi' })
            return
        }

        try {
            setLoading(true)

            if (isEdit) {
                await ProductSizeService.update(Number(id), {
                    uid: formData.uid || '', // Removed: user?.id ||
                    name: formData.name.trim(),
                    is_active: formData.is_active
                })
                Toast.show({ type: 'success', text1: 'Ukuran berhasil diperbarui' })
                router.back()
            } else {
                await ProductSizeService.create({
                    uid: `SIZE${Date.now()}`,
                    name: formData.name.trim(),
                    is_active: formData.is_active
                })
                Toast.show({ type: 'success', text1: 'Ukuran berhasil disimpan' })
                setFormData({
                    uid: '',
                    name: '',
                    is_active: true
                })
            }
        } catch (error) {
            console.error('Error saving size:', error)
            Toast.show({ type: 'error', text1: isEdit ? 'Gagal memperbarui ukuran' : 'Gagal menyimpan ukuran' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <View className="flex-1 bg-background">
            {/* Header with actions */}
            <HeaderGradient
                title={isEdit ? 'Edit Ukuran' : 'Tambah Ukuran'}
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
                <View className="bg-white rounded-xl border border-gray-200 p-4">
                    <Text className="text-base font-semibold text-gray-800 mb-3">Informasi Ukuran</Text>

                    {/* Name */}
                    <Input
                        label="Nama Ukuran *"
                        value={formData.name}
                        onChangeText={(text) => handleInputChange('name', text)}
                        placeholder="Masukkan nama ukuran (contoh: S, M, L, XL)"
                        returnKeyType="next"
                    />

                    {/* Active toggle */}
                    <View className="flex-row items-center justify-between mt-2">
                        <View>
                            <Text className="text-gray-800 font-medium">Status</Text>
                            <Text className="text-gray-500 text-xs mt-0.5">Tentukan apakah ukuran aktif</Text>
                        </View>
                        <View className="flex-row items-center">
                            <Text className="text-gray-600 mr-2 text-sm">{formData.is_active ? 'Aktif' : 'Tidak'}</Text>
                            <Switch
                                value={formData.is_active}
                                onValueChange={(val) => setFormData(prev => ({ ...prev, is_active: val }))}
                                thumbColor={formData.is_active ? '#ffffff' : '#ffffff'}
                                trackColor={{ false: '#D1D5DB', true: '#34D399' }}
                                disabled={loading}
                            />
                        </View>
                    </View>
                </View>

                {/* Footer primary action for reachability */}
                <View className="mt-6">
                    <TouchableOpacity
                        onPress={handleSave}
                        disabled={loading}
                        className={`py-3 px-4 rounded-lg ${loading ? 'bg-blue-300' : 'bg-blue-600'}`}
                    >
                        <Text className="text-white text-center font-semibold text-lg">
                            {loading ? 'Menyimpan...' : (isEdit ? 'Perbarui Ukuran' : 'Simpan Ukuran')}
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAwareScrollView>
        </View>
    )
}