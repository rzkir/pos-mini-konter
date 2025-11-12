import { useEffect, useState } from 'react'

import { Text, TouchableOpacity, View } from 'react-native'

import BottomSheet from '@/helper/bottomsheets/BottomSheet'

import { Ionicons } from '@expo/vector-icons'

type DatePreset = 'all' | 'today' | '7d' | '30d'

type Filters = {
    datePreset: DatePreset
    paymentMethod: Transaction['payment_method'] | 'all'
    paymentStatus: Transaction['payment_status'] | 'all'
    status: Transaction['status'] | 'all'
    customerName: string
    layout: 'list' | 'grid'
}

type Props = {
    visible: boolean
    onClose: () => void
    value: Filters
    onApply: (next: Filters) => void
    onReset: () => void
}

const methodOptions: (Transaction['payment_method'] | 'all')[] = ['all', 'cash', 'card', 'transfer']
const paymentStatusOptions: (Transaction['payment_status'] | 'all')[] = ['all', 'pending', 'paid', 'cancelled', 'return']
const statusOptions: (Transaction['status'] | 'all')[] = ['all', 'pending', 'completed', 'cancelled', 'return']

export default function FilterBottomSheet({ visible, onClose, value, onApply, onReset }: Props) {
    const [temp, setTemp] = useState<Filters>(value)

    useEffect(() => {
        if (visible) setTemp(value)
    }, [visible, value])

    const setField = <K extends keyof Filters>(key: K, val: Filters[K]) => setTemp(prev => ({ ...prev, [key]: val }))

    const handleApply = () => {
        onApply(temp)
        onClose()
    }

    const handleReset = () => {
        onReset()
        onClose()
    }

    const Pill = ({ selected, label, onPress }: { selected: boolean; label: string; onPress: () => void }) => (
        <TouchableOpacity
            onPress={onPress}
            className={`px-4 py-3 rounded-xl border ${selected ? 'bg-blue-500 border-blue-400' : 'bg-white/10 border-white/20'}`}
            activeOpacity={0.8}
        >
            <Text className={`text-sm font-medium ${selected ? 'text-white' : 'text-secondary-500'}`}>{label}</Text>
        </TouchableOpacity>
    )

    return (
        <BottomSheet
            visible={visible}
            title="Filter Transaksi"
            onClose={onClose}
            maxHeightPercent={0.82}
        >
            {/* Layout Section */}
            <View className="mb-6 px-4">
                <View className="flex-row items-center justify-between mb-3">
                    <Text className="text-base font-semibold text-secondary-500">Tampilan</Text>
                </View>
                <View className="flex-row flex-wrap gap-2">
                    <Pill selected={temp.layout === 'list'} label="List" onPress={() => setField('layout', 'list')} />
                    <Pill selected={temp.layout === 'grid'} label="Grid" onPress={() => setField('layout', 'grid')} />
                </View>
                {/* Grid will use 2 columns by default */}
            </View>

            {/* Date Preset */}
            <View className="mb-6 px-4">
                <View className="flex-row items-center justify-between mb-3">
                    <Text className="text-base font-semibold text-secondary-500">Tanggal</Text>
                    {temp.datePreset !== 'all' && (
                        <TouchableOpacity onPress={() => setField('datePreset', 'all')} className="px-2 py-1 rounded-lg" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)' }}>
                            <Text className="text-xs text-red-400 font-medium">Reset</Text>
                        </TouchableOpacity>
                    )}
                </View>
                <View className="flex-row flex-wrap gap-2">
                    {([
                        { key: 'all', label: 'Semua' },
                        { key: 'today', label: 'Hari ini' },
                        { key: '7d', label: '7 Hari' },
                        { key: '30d', label: '30 Hari' },
                    ] as { key: DatePreset; label: string }[]).map(opt => (
                        <Pill key={opt.key} selected={temp.datePreset === opt.key} label={opt.label} onPress={() => setField('datePreset', opt.key)} />
                    ))}
                </View>
            </View>

            {/* Payment Method */}
            <View className="mb-6 px-4">
                <View className="flex-row items-center justify-between mb-3">
                    <Text className="text-base font-semibold text-secondary-500">Metode Pembayaran</Text>
                    {temp.paymentMethod !== 'all' && (
                        <TouchableOpacity onPress={() => setField('paymentMethod', 'all')} className="px-2 py-1 rounded-lg" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)' }}>
                            <Text className="text-xs text-red-400 font-medium">Reset</Text>
                        </TouchableOpacity>
                    )}
                </View>
                <View className="flex-row flex-wrap gap-2">
                    {methodOptions.map(m => (
                        <Pill key={m} selected={temp.paymentMethod === m} label={m === 'all' ? 'Semua' : m.charAt(0).toUpperCase() + m.slice(1)} onPress={() => setField('paymentMethod', m)} />
                    ))}
                </View>
            </View>

            {/* Payment Status */}
            <View className="mb-6 px-4">
                <View className="flex-row items-center justify-between mb-3">
                    <Text className="text-base font-semibold text-secondary-500">Status Pembayaran</Text>
                    {temp.paymentStatus !== 'all' && (
                        <TouchableOpacity onPress={() => setField('paymentStatus', 'all')} className="px-2 py-1 rounded-lg" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)' }}>
                            <Text className="text-xs text-red-400 font-medium">Reset</Text>
                        </TouchableOpacity>
                    )}
                </View>
                <View className="flex-row flex-wrap gap-2">
                    {paymentStatusOptions.map(s => (
                        <Pill key={s} selected={temp.paymentStatus === s} label={s === 'all' ? 'Semua' : s.charAt(0).toUpperCase() + s.slice(1)} onPress={() => setField('paymentStatus', s)} />
                    ))}
                </View>
            </View>

            {/* Status */}
            <View className="mb-6 px-4">
                <View className="flex-row items-center justify-between mb-3">
                    <Text className="text-base font-semibold text-secondary-500">Status Transaksi</Text>
                    {temp.status !== 'all' && (
                        <TouchableOpacity onPress={() => setField('status', 'all')} className="px-2 py-1 rounded-lg" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)' }}>
                            <Text className="text-xs text-red-400 font-medium">Reset</Text>
                        </TouchableOpacity>
                    )}
                </View>
                <View className="flex-row flex-wrap gap-2">
                    {statusOptions.map(s => (
                        <Pill key={s} selected={temp.status === s} label={s === 'all' ? 'Semua' : s.charAt(0).toUpperCase() + s.slice(1)} onPress={() => setField('status', s)} />
                    ))}
                </View>
            </View>

            {/* Footer */}
            <View className="flex-row gap-3 px-4 pt-4 border-t" style={{ borderTopColor: 'rgba(255, 255, 255, 0.1)' }}>
                <TouchableOpacity
                    onPress={handleReset}
                    className="flex-1 px-4 py-3 rounded-xl border"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.2)' }}
                    activeOpacity={0.8}
                >
                    <View className="flex-row items-center justify-center">
                        <Ionicons name="refresh-outline" size={18} color="#fff" />
                        <Text className="text-white font-semibold ml-2 text-center">Reset Filter</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={handleApply}
                    className="flex-1 px-4 py-3 rounded-xl bg-blue-500"
                    activeOpacity={0.8}
                >
                    <View className="flex-row items-center justify-center">
                        <Ionicons name="checkmark" size={18} color="#fff" />
                        <Text className="text-white font-semibold ml-2 text-center">Terapkan</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </BottomSheet>
    )
}


