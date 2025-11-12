import { useRef } from 'react'

import { Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native'

import { Ionicons } from '@expo/vector-icons'

import { SafeAreaView } from 'react-native-safe-area-context'

export default function BottomSheet({
    visible,
    title,
    onClose,
    children,
    footer,
    maxHeightPercent = 0.8,
    showCloseButton = true,
    enableSwipeToClose = true,
}: BottomSheetProps) {
    const dragStartYRef = useRef<number | null>(null)
    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <SafeAreaView edges={['bottom']} className="flex-1 justify-end bg-secondary-900/60">
                {/* Backdrop */}
                <Pressable className="flex-1" onPress={onClose} />

                <View className="bg-background pt-4 overflow-hidden pb-4" style={{ maxHeight: `${Math.round(maxHeightPercent * 100)}%`, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                    <View className="items-center mb-3">
                        <View className="w-12 h-1.5 rounded-full" style={{ backgroundColor: 'text-secondary-500' }} />
                    </View>

                    {title && showCloseButton && (
                        <View className="flex-row items-center justify-between px-6 mb-4">
                            <View className="w-6" />
                            <Text className="text-center text-lg font-semibold flex-1">{title || ''}</Text>

                            <TouchableOpacity onPress={onClose} className="w-6 h-6 items-center justify-center" activeOpacity={0.8}>
                                <Ionicons name="close" size={20} color="text-secondary-500" />
                            </TouchableOpacity>
                        </View>
                    )}

                    <ScrollView
                        className="px-5"
                        showsVerticalScrollIndicator={false}
                        scrollEventThrottle={16}
                        bounces
                        alwaysBounceVertical
                        onScrollBeginDrag={(e) => {
                            dragStartYRef.current = e.nativeEvent.contentOffset.y
                        }}
                        onScroll={(e) => {
                            if (!enableSwipeToClose) return
                            const y = e.nativeEvent.contentOffset.y
                            if ((dragStartYRef.current ?? 0) <= 0 && y <= -60) {
                                onClose()
                            }
                        }}
                    >
                        {children}
                        <View className="h-4" />
                    </ScrollView>

                    {footer && (
                        <View className="px-5 pb-8">
                            {footer}
                        </View>
                    )}
                </View>
            </SafeAreaView>
        </Modal>
    )
}