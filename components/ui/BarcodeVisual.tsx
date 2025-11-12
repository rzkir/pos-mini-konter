import React from 'react';

import { Text, View } from 'react-native';

interface BarcodeVisualProps {
    barcode: string;
    width?: number;
    height?: number;
    showText?: boolean;
}

export const BarcodeVisual: React.FC<BarcodeVisualProps> = ({
    barcode,
    width = 300,
    height = 80,
    showText = true,
}) => {
    const generateBarcodePattern = (code: string): number[] => {
        const pattern: number[] = [];

        pattern.push(1, 0, 1);

        for (let i = 0; i < code.length; i++) {
            const char = code[i];
            const charCode = char.charCodeAt(0);

            for (let j = 0; j < 5; j++) {
                pattern.push((charCode >> j) & 1);
            }
        }

        pattern.push(1, 0, 1);

        return pattern;
    };

    const barcodePattern = generateBarcodePattern(barcode);

    return (
        <View className="items-center">
            <View
                className="bg-white border-2 border-gray-400 rounded-xl p-6 shadow-lg"
                style={{
                    width,
                    height: height + 50,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3
                }}
            >
                <View
                    className="flex-row items-center justify-center"
                    style={{ height }}
                >
                    {barcodePattern.map((bit, index) => (
                        <View
                            key={index}
                            style={{
                                width: 2.5,
                                height: bit === 1 ? height - 15 : height - 35,
                                backgroundColor: bit === 1 ? '#000000' : 'transparent',
                                marginRight: 0.3,
                            }}
                        />
                    ))}
                </View>
            </View>
            {showText && (
                <View className="mt-3 px-4 py-2 bg-gray-100 rounded-lg">
                    <Text className="text-sm text-gray-700 font-mono tracking-widest text-center">
                        {barcode}
                    </Text>
                </View>
            )}
        </View>
    );
};