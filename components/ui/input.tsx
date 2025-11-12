import { forwardRef } from 'react'

import { StyleProp, Text, TextInput, TextInputProps, TextStyle, View, ViewStyle } from 'react-native'

interface InputProps extends TextInputProps {
    label?: string
    error?: string
    containerStyle?: StyleProp<ViewStyle>
    labelStyle?: StyleProp<TextStyle>
    inputStyle?: StyleProp<TextStyle>
    errorStyle?: StyleProp<TextStyle>
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
}

const Input = forwardRef<TextInput, InputProps>(({
    label,
    error,
    containerStyle,
    labelStyle,
    inputStyle,
    errorStyle,
    leftIcon,
    rightIcon,
    ...props
}, ref) => {
    return (
        <View style={[{ marginBottom: 16 }, containerStyle]}>
            {label && (
                <Text style={[
                    {
                        fontSize: 14,
                        fontWeight: '500',
                        marginBottom: 8,
                        color: '#374151'
                    },
                    labelStyle
                ]}>
                    {label}
                </Text>
            )}

            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: error ? '#EF4444' : '#D1D5DB',
                borderRadius: 8,
                backgroundColor: '#FFFFFF',
                paddingHorizontal: 12,
                paddingVertical: 12,
            }}>
                {leftIcon && (
                    <View style={{ marginRight: 8 }}>
                        {leftIcon}
                    </View>
                )}

                <TextInput
                    ref={ref}
                    style={[
                        {
                            flex: 1,
                            fontSize: 16,
                            color: '#111827',
                            paddingVertical: 0,
                        },
                        inputStyle
                    ]}
                    placeholderTextColor="#9CA3AF"
                    blurOnSubmit={false}
                    {...props}
                />

                {rightIcon && (
                    <View style={{ marginLeft: 8 }}>
                        {rightIcon}
                    </View>
                )}
            </View>

            {error && (
                <Text style={[
                    {
                        fontSize: 12,
                        color: '#EF4444',
                        marginTop: 4
                    },
                    errorStyle
                ]}>
                    {error}
                </Text>
            )}
        </View>
    )
})

Input.displayName = 'Input'

export default Input