interface PrintTemplateProps {
  transaction: Transaction;
  items: (TransactionItem & { product?: any })[];
  storeName?: string;
  storeAddress?: string;
  storePhone?: string;
  storeWebsite?: string;
  footerMessage?: string;
  showFooter?: boolean;
  logoUrl?: string;
  showLogo?: boolean;
  logoWidth?: number;
  logoHeight?: number;
  logoBitmapData?: {
    widthBytes: number;
    height: number;
    data: number[];
  };
}

interface TemplateSettings {
  storeName: string;
  storeAddress: string;
  storePhone: string;
  storeWebsite: string;
  footerMessage: string;
  showFooter: boolean;
  logoUrl?: string;
  showLogo?: boolean;
  logoWidth?: number;
  logoHeight?: number;
  logoBitmapData?: {
    widthBytes: number;
    height: number;
    data: number[];
  };
}
