import { router, usePathname } from 'expo-router';

import { useEffect, useRef } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { usePermissions } from '@/context/PermissionContext';

export default function Index() {
    const pathname = usePathname();
    const hasRedirected = useRef(false);
    const { allPermissionsGranted } = usePermissions();

    useEffect(() => {
        let rafId: number | null = null;
        const checkUserAndRedirect = async () => {
            if (hasRedirected.current) return;
            if (pathname !== '/') return;

            // Redirect ke halaman perizinan jika izin belum diberikan
            if (!allPermissionsGranted) {
                hasRedirected.current = true;
                router.replace('/permissions');
                return;
            }

            const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');

            if (isLoggedIn === 'true') {
                hasRedirected.current = true;
                router.replace('/(tabs)');
            } else {
                hasRedirected.current = true;
                router.replace('/welcome');
            }
        };
        rafId = requestAnimationFrame(() => {
            checkUserAndRedirect();
        });
        return () => {
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, [pathname, allPermissionsGranted]);

    useEffect(() => {
        hasRedirected.current = false;
    }, [pathname]);

    return null;
}