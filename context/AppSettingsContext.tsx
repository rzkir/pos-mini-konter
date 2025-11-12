import { createContext, ReactNode, useContext } from 'react';

import { useAppSettings } from '@/hooks/useAppSettings';

import { formatIDR as formatIDRHelper } from '@/helper/lib/FormatIdr';

import { formatDate as formatDateHelper, formatDateTime as formatDateTimeHelper } from '@/helper/lib/FormatDate';

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined);

export const AppSettingsProvider = ({ children }: { children: ReactNode }) => {
    const { settings, loading, updateDateFormat, updateDecimalPlaces, resetSettings } = useAppSettings();

    const formatIDR = (amount: number): string => {
        return formatIDRHelper(amount, settings.decimalPlaces);
    };

    const formatDate = (dateInput: string | number | Date): string => {
        return formatDateHelper(dateInput, settings.dateFormat);
    };

    const formatDateTime = (dateInput: string | number | Date, options?: Intl.DateTimeFormatOptions): string => {
        return formatDateTimeHelper(dateInput, settings.dateFormat, options);
    };

    return (
        <AppSettingsContext.Provider
            value={{
                settings,
                loading,
                updateDateFormat,
                updateDecimalPlaces,
                resetSettings,
                formatIDR,
                formatDate,
                formatDateTime,
            }}
        >
            {children}
        </AppSettingsContext.Provider>
    );
};

export const useAppSettingsContext = () => {
    const context = useContext(AppSettingsContext);
    if (!context) {
        throw new Error('useAppSettingsContext must be used within AppSettingsProvider');
    }
    return context;
};

/**
 * Hook singkat untuk format saja - alias untuk kemudahan
 * Gunakan ini di komponen React
 * 
 * @example
 * const { formatIDR, formatDate, formatDateTime } = useFormat();
 */
export const useFormat = () => {
    const { formatIDR, formatDate, formatDateTime } = useAppSettingsContext();
    return { formatIDR, formatDate, formatDateTime };
};