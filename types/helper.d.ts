interface SelectOption {
  label: string;
  value: string | number;
}

interface SelectProps {
  options: SelectOption[];
  value?: string | number;
  onSelect: (value: string | number) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

interface HeaderGradientProps {
  colors?: [string, string, ...string[]];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  style?: ViewStyle;
  icon?: string;
  logoUrl?: string;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

interface FilterBottomSheetProps {
  visible: boolean;
  categories: any[];
  sizes: any[];
  selectedCategoryId: number | null;
  selectedSizeId: number | null;
  onClose: () => void;
  onApply: (categoryId: number | null, sizeId: number | null) => void;
  onReset: () => void;
}

interface BottomSheetProps {
  visible: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxHeightPercent?: number;
  showCloseButton?: boolean;
  enableSwipeToClose?: boolean;
}

type Props = {
  visible: boolean;
  onClose: () => void;
  showCharts: boolean;
  setShowCharts: (value: boolean) => void;
};
