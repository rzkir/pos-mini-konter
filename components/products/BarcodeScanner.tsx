import { CameraView, useCameraPermissions } from 'expo-camera';

import React, { useEffect, useState } from 'react';

import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface BarcodeScannerProps {
    visible: boolean;
    onClose: () => void;
    onScan: (barcode: string) => void;
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
    visible,
    onClose,
    onScan,
}) => {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        if (visible && !permission?.granted) {
            requestPermission();
        }
    }, [visible, permission?.granted, requestPermission]);

    const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
        setScanned(true);
        onScan(data);
        onClose();
    };

    const resetScanner = () => {
        setScanned(false);
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="fullScreen"
            onRequestClose={onClose}
        >
            {!permission ? (
                <View style={styles.container}>
                    <Text style={styles.text}>Meminta izin kamera...</Text>
                </View>
            ) : !permission.granted ? (
                <View style={styles.container}>
                    <Text style={styles.text}>Akses kamera ditolak</Text>
                    <Text style={styles.subText}>
                        Untuk menggunakan fitur scan barcode, silakan aktifkan izin kamera di pengaturan aplikasi
                    </Text>
                    <TouchableOpacity style={styles.button} onPress={onClose}>
                        <Text style={styles.buttonText}>Tutup</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.container}>
                    <CameraView
                        style={StyleSheet.absoluteFillObject}
                        facing="back"
                        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                        barcodeScannerSettings={{
                            barcodeTypes: ["qr", "pdf417", "upc_e", "upc_a", "ean13", "ean8", "code128", "code39"],
                        }}
                    />

                    <View style={styles.overlay}>
                        <View style={styles.scanArea}>
                            <View style={[styles.corner, styles.topLeft]} />
                            <View style={[styles.corner, styles.topRight]} />
                            <View style={[styles.corner, styles.bottomLeft]} />
                            <View style={[styles.corner, styles.bottomRight]} />
                        </View>

                        <Text style={styles.instructionText}>
                            Arahkan barcode ke dalam frame untuk scan
                        </Text>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button} onPress={resetScanner}>
                                <Text style={styles.buttonText}>Scan Ulang</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.button, styles.closeButton]} onPress={onClose}>
                                <Text style={styles.buttonText}>Tutup</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanArea: {
        width: 250,
        height: 250,
        position: 'relative',
        marginBottom: 50,
    },
    corner: {
        position: 'absolute',
        width: 30,
        height: 30,
        borderColor: '#00ff00',
        borderWidth: 3,
        borderTopWidth: 0,
        borderRightWidth: 0,
    },
    topLeft: {
        top: 0,
        left: 0,
        borderTopWidth: 3,
        borderLeftWidth: 3,
        borderRightWidth: 0,
        borderBottomWidth: 0,
    },
    topRight: {
        top: 0,
        right: 0,
        borderTopWidth: 3,
        borderRightWidth: 3,
        borderBottomWidth: 0,
        borderLeftWidth: 0,
    },
    bottomLeft: {
        bottom: 0,
        left: 0,
        borderBottomWidth: 3,
        borderLeftWidth: 3,
        borderTopWidth: 0,
        borderRightWidth: 0,
    },
    bottomRight: {
        bottom: 0,
        right: 0,
        borderBottomWidth: 3,
        borderRightWidth: 3,
        borderTopWidth: 0,
        borderLeftWidth: 0,
    },
    instructionText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 30,
        paddingHorizontal: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 15,
    },
    button: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
    },
    closeButton: {
        backgroundColor: '#FF3B30',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    text: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
    },
    subText: {
        color: 'white',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 10,
        paddingHorizontal: 20,
        opacity: 0.8,
    },
});