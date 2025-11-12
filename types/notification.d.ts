Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

interface NotificationSettings {
  pushEnabled: boolean;
  soundEnabled: boolean;
  lowStockAlerts: boolean;
  selectedSound?: string;
  transactionNotifications?: boolean;
}

interface NotificationSettings {
  pushEnabled: boolean;
  soundEnabled: boolean;
  lowStockAlerts: boolean;
  selectedSound: string;
}

interface AppSettingsContextType {
  settings: AppSettings;
  loading: boolean;
  updateDateFormat: (format: AppSettings["dateFormat"]) => Promise<void>;
  updateDecimalPlaces: (places: number) => Promise<void>;
  resetSettings: () => Promise<void>;
  formatIDR: (amount: number) => string;
  formatDate: (dateInput: string | number | Date) => string;
  formatDateTime: (
    dateInput: string | number | Date,
    options?: Intl.DateTimeFormatOptions
  ) => string;
}
