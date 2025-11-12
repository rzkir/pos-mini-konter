import React, { createContext, useContext, useEffect, useState } from 'react';

import { useCameraPermissions } from 'expo-camera';

import AsyncStorage from '@react-native-async-storage/async-storage';

export interface PermissionContextType {
    cameraPermission: boolean | null;
    storagePermission: boolean | null;
    allPermissionsGranted: boolean;
    requestPermissions: () => Promise<void>;
    checkPermissions: () => Promise<void>;
    loading: boolean;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export const usePermissions = () => {
    const context = useContext(PermissionContext);
    if (!context) {
        throw new Error('usePermissions must be used within a PermissionProvider');
    }
    return context;
};

export const PermissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cameraPermission, requestCameraPermission] = useCameraPermissions();
    // Media library permission is managed on-demand where needed (e.g., ImagePicker)
    const [loading, setLoading] = useState(true);

    const allPermissionsGranted = cameraPermission?.granted === true;


    const checkPermissions = async () => {
        try {
            setLoading(true);

            // Save permission status to storage
            await AsyncStorage.setItem('permissions_checked', 'true');
        } catch (error) {
            console.error('Error checking permissions:', error);
        } finally {
            setLoading(false);
        }
    };

    const requestPermissions = async () => {
        try {
            setLoading(true);

            // Only request camera permission
            if (cameraPermission?.granted !== true) {
                await requestCameraPermission();
            }

            // Media library permission will be requested lazily by the feature that needs it

            // Save permission status to storage
            await AsyncStorage.setItem('permissions_checked', 'true');
        } catch (error) {
            console.error('Error requesting permissions:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkPermissions();

    }, []);

    // Add effect to handle permission state changes
    useEffect(() => {
        if (cameraPermission?.granted === true) {
            // All required permissions granted
        }
    }, [cameraPermission?.granted]);

    const value: PermissionContextType = {
        cameraPermission: cameraPermission?.granted || null,
        storagePermission: null,
        allPermissionsGranted,
        requestPermissions,
        checkPermissions,
        loading,
    };

    return (
        <PermissionContext.Provider value={value}>
            {children}
        </PermissionContext.Provider>
    );
};