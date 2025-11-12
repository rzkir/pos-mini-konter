/**
 * Global format helpers yang otomatis menggunakan pengaturan aplikasi
 * Import sekali saja, gunakan di mana saja
 *
 * Catatan: Untuk komponen React, gunakan useFormat() hook untuk mendapatkan fungsi yang reactive
 * Untuk utility functions atau class, gunakan fungsi sync version
 */

import {
  formatDate as formatDateHelper,
  formatDateTime as formatDateTimeHelper,
} from "./FormatDate";
import { formatIDR as formatIDRHelper } from "./FormatIdr";

const DEFAULT_SETTINGS = {
  dateFormat: "DD/MM/YYYY" as const,
  decimalPlaces: 2,
};

/**
 * Format IDR sync - menggunakan default settings
 * Gunakan ini jika tidak ada akses ke React Context
 */
export const formatIDR = (amount: number, decimalPlaces?: number): string => {
  return formatIDRHelper(
    amount,
    decimalPlaces ?? DEFAULT_SETTINGS.decimalPlaces
  );
};

/**
 * Format date sync - menggunakan default format
 * Gunakan ini jika tidak ada akses ke React Context
 */
export const formatDate = (
  dateInput: string | number | Date,
  format?: "DD/MM/YYYY" | "MM/DD/YYYY" | "YYYY-MM-DD"
): string => {
  return formatDateHelper(dateInput, format ?? DEFAULT_SETTINGS.dateFormat);
};

/**
 * Format date with time sync - menggunakan default format
 * Gunakan ini jika tidak ada akses ke React Context
 */
export const formatDateTime = (
  dateInput: string | number | Date,
  format?: "DD/MM/YYYY" | "MM/DD/YYYY" | "YYYY-MM-DD",
  options?: Intl.DateTimeFormatOptions
): string => {
  return formatDateTimeHelper(
    dateInput,
    format ?? DEFAULT_SETTINGS.dateFormat,
    options
  );
};

/**
 * Re-export untuk kemudahan
 */
export { formatDateHelper, formatDateTimeHelper, formatIDRHelper };
