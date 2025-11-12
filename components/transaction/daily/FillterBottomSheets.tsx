import { View, Text, TouchableOpacity } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import BottomSheet from '@/helper/bottomsheets/BottomSheet';

type Props = {
    visible: boolean;
    onClose: () => void;
    dayName: (day: number) => string;
    activeDayTab: number;
    pendingDayTab: number | null;
    setPendingDayTab: (day: number) => void;
    onApply: () => void;
};

export default function FillterBottomSheets({
    visible,
    onClose,
    dayName,
    activeDayTab,
    pendingDayTab,
    setPendingDayTab,
    onApply,
}: Props) {
    return (
        <BottomSheet
            visible={visible}
            title="Pilih Hari"
            onClose={onClose}
            footer={
                <TouchableOpacity
                    onPress={onApply}
                    className="w-full py-3 rounded-lg items-center"
                    style={{ backgroundColor: '#4f46e5' }}
                    activeOpacity={0.9}
                >
                    <Text className="text-white font-semibold">Terapkan</Text>
                </TouchableOpacity>
            }
        >
            <View className="mt-1 mb-2">
                {[
                    [
                        { key: 'mon', day: 1 },
                        { key: 'tue', day: 2 },
                        { key: 'wed', day: 3 },
                        { key: 'thu', day: 4 },
                    ],
                    [
                        { key: 'fri', day: 5 },
                        { key: 'sat', day: 6 },
                        { key: 'sun', day: 0 },
                    ],
                ].map((row, idx) => (
                    <View key={idx} className="flex-row mb-2">
                        {row.map((d) => {
                            const current = (pendingDayTab ?? activeDayTab);
                            const active = current === d.day;
                            return (
                                <TouchableOpacity
                                    key={d.key}
                                    onPress={() => setPendingDayTab(d.day)}
                                    className={`flex-1 mr-2 px-4 py-3 rounded-lg ${active ? 'bg-accent-primary border-accent-primary' : 'bg-gray-50 border-gray-200'}`}
                                    activeOpacity={0.85}
                                >
                                    <View className="flex-row items-center justify-between">
                                        <Text className={`text-sm ${active ? 'text-white' : 'text-secondary-500'}`}>{dayName(d.day)}</Text>
                                        {active && <Ionicons name="checkmark" size={18} color={active ? '#fff' : '#6c757d'} />}
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                        <View className="flex-1" />
                    </View>
                ))}
            </View>
        </BottomSheet>
    );
}


