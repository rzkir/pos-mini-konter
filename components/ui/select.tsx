import { useState } from 'react'

import { Modal, Text, TouchableOpacity, View } from 'react-native'

export default function Select({
    options,
    value,
    onSelect,
    placeholder = "Pilih opsi...",
    disabled = false,
    className = ""
}: SelectProps) {
    const [isOpen, setIsOpen] = useState(false)

    const selectedOption = options.find(
        (option) => String(option.value) === String(value)
    )

    const handleSelect = (option: SelectOption) => {
        onSelect(option.value)
        setIsOpen(false)
    }

    return (
        <View className={`relative ${className}`}>
            <TouchableOpacity
                onPress={() => !disabled && setIsOpen(true)}
                disabled={disabled}
                className={`border border-gray-300 rounded-lg p-3 bg-white ${disabled ? 'bg-gray-100 opacity-50' : ''
                    }`}
            >
                <Text className={`text-base ${selectedOption ? 'text-gray-900' : 'text-gray-500'}`}>
                    {selectedOption ? selectedOption.label : placeholder}
                </Text>
            </TouchableOpacity>

            <Modal
                visible={isOpen}
                transparent
                animationType="fade"
                onRequestClose={() => setIsOpen(false)}
            >
                <TouchableOpacity
                    className="flex-1 bg-black/20 justify-center items-center"
                    onPress={() => setIsOpen(false)}
                    activeOpacity={1}
                >
                    <View className="bg-white rounded-lg mx-4 w-80 max-h-80 shadow-lg">
                        {options.map((item) => (
                            <TouchableOpacity
                                key={String(item.value)}
                                onPress={() => handleSelect(item)}
                                className={`p-4 border-b border-gray-200 ${String(item.value) === String(value) ? 'bg-blue-50' : ''
                                    }`}
                            >
                                <Text className={`text-base ${String(item.value) === String(value) ? 'text-blue-600 font-semibold' : 'text-gray-900'
                                    }`}>
                                    {item.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    )
}