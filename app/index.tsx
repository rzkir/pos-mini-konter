import { router, usePathname } from 'expo-router';

import { useEffect, useRef } from 'react';

import { usePermissions } from '@/context/PermissionContext';

import { useAuth } from '@/context/AuthContext';

export default function Index() {
    const pathname = usePathname();
    const hasRedirected = useRef(false);
    const { allPermissionsGranted } = usePermissions();
    const { isAuthenticated, loading } = useAuth();

    useEffect(() => {
        let rafId: number | null = null;
        const checkUserAndRedirect = async () => {
            if (hasRedirected.current) return;
            if (pathname !== '/') return;

            // Tunggu sampai auth loading selesai
            if (loading) return;

            // Redirect ke halaman perizinan jika izin belum diberikan
            if (!allPermissionsGranted) {
                hasRedirected.current = true;
                router.replace('/permissions');
                return;
            }

            // Jika sudah login, redirect ke tabs
            if (isAuthenticated) {
                hasRedirected.current = true;
                router.replace('/(tabs)');
            } else {
                // Jika belum login, redirect ke welcome
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
    }, [pathname, allPermissionsGranted, isAuthenticated, loading]);

    useEffect(() => {
        hasRedirected.current = false;
    }, [pathname]);

    return null;
}