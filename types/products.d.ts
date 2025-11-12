interface Product {
  id: number;
  uid: string;
  name: string;
  price: number;
  modal: number;
  stock: number;
  sold: number;
  unit: string;
  image_url?: string;
  barcode: string;
  is_active: boolean;
  min_stock: number;
  discount: number;
  description?: string;
  category_id?: number;
  size_id?: number;
  supplier_id?: number;
  best_seller: boolean;
  created_at: string;
  updated_at: string;
}

interface AllProductsCardProps {
  item: {
    id: number;
    name: string;
    barcode: string;
    stock: number;
    sold: number;
    price: number;
    image_url?: string;
  };
  formatIDR: (amount: number) => string;
}

interface ProductFormData {
  name: string;
  price: string;
  modal: string;
  stock: string;
  unit: string;
  barcode: string;
  category_id: string;
  size_id: string;
  supplier_id: string;
  description: string;
  min_stock: string;
  discount: string;
  image_url: string;
  best_seller: boolean;
}

interface UseStateCreateProductsProps {
  // Optional - jika tidak diberikan, akan menggunakan hooks internal
  id?: string | string[];
  product?: any;
  createProduct?: (productData: any) => Promise<any>;
  updateProduct?: (id: number, productData: any) => Promise<any>;
  categories?: any[];
  sizes?: any[];
  suppliers?: any[];
}

type ProductWithRelations = Product & {
  product_categories?: ProductCategory | null;
  product_sizes?: ProductSize | null;
  suppliers?: Supplier | null;
};

type CardProductsProps = {
  item: any;
  onViewDetails: (item: any) => void;
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
};

interface ProductCategory {
  id: number;
  uid: string;
  name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ProductSize {
  id: number;
  uid: string;
  name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface Supplier {
  id: number;
  name: string;
  contact_person: string;
  phone: string;
  email: string;
  address: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

type SupplierFormData = {
  name: string;
  contact_person: string;
  phone: string;
  email: string;
  address: string;
  is_active: boolean;
};

interface ProductDetailsViewKaryawanProps {
  product: Product;
  categories: ProductCategory[];
  sizes: ProductSize[];
  suppliers: Supplier[];
  onClose: () => void;
}

interface ProductDetailsViewProps {
  product: Product;
  categories: ProductCategory[];
  sizes: ProductSize[];
  suppliers: Supplier[];
  onClose: () => void;
  onEdit: (product: Product) => void;
  formatIDR: (amount: number) => string;
  formatDateTime: (
    dateInput: string | number | Date,
    options?: Intl.DateTimeFormatOptions
  ) => string;
}

type ProductsCategoryCardProps = {
  item: any;
  formatDate: (date: any) => string;
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
};

type ManagementSectionProps = {
  categoriesCount: number;
  sizesCount: number;
  suppliersCount: number;
  productsCount: number;
  onNavigateCategory: () => void;
  onNavigateSize: () => void;
  onNavigateSupplier: () => void;
  handleNavigateAllProducts: () => void;
  onNavigateBarcode: () => void;
};

interface ProductContextType {
  // Products
  products: Product[];
  productsWithRelations: ProductWithRelations[];
  loading: boolean;
  error: string | null;

  // Categories
  categories: ProductCategory[];

  // Sizes
  sizes: ProductSize[];

  // Suppliers
  suppliers: Supplier[];

  // Product Actions
  createProduct: (
    productData: Omit<Product, "id" | "created_at" | "updated_at">
  ) => Promise<Product>;
  updateProduct: (
    id: number,
    productData: Partial<Product>
  ) => Promise<Product | null>;
  deleteProduct: (id: number) => Promise<boolean>;
  getProductById: (id: number) => Promise<Product | null>;
  searchProducts: (name: string) => Promise<Product[]>;
  getProductsByCategory: (categoryId: number) => Promise<Product[]>;
  getLowStockProducts: () => Promise<Product[]>;
  updateProductStock: (id: number, newStock: number) => Promise<Product | null>;
  updateProductSold: (
    id: number,
    soldQuantity: number
  ) => Promise<Product | null>;

  // Category Actions
  createCategory: (
    categoryData: Omit<ProductCategory, "id" | "created_at" | "updated_at">
  ) => Promise<ProductCategory>;
  updateCategory: (
    id: number,
    categoryData: Partial<ProductCategory>
  ) => Promise<ProductCategory | null>;
  deleteCategory: (id: number) => Promise<boolean>;
  searchCategories: (name: string) => Promise<ProductCategory[]>;

  // Size Actions
  createSize: (
    sizeData: Omit<ProductSize, "id" | "created_at" | "updated_at">
  ) => Promise<ProductSize>;
  updateSize: (
    id: number,
    sizeData: Partial<ProductSize>
  ) => Promise<ProductSize | null>;
  deleteSize: (id: number) => Promise<boolean>;
  searchSizes: (name: string) => Promise<ProductSize[]>;

  // Supplier Actions
  createSupplier: (
    supplierData: Omit<Supplier, "id" | "created_at" | "updated_at">
  ) => Promise<Supplier>;
  updateSupplier: (
    id: number,
    supplierData: Partial<Supplier>
  ) => Promise<Supplier | null>;
  deleteSupplier: (id: number) => Promise<boolean>;
  searchSuppliers: (name: string) => Promise<Supplier[]>;

  // Utility
  refreshData: () => Promise<void>;
  clearError: () => void;
}

interface TopSellerCardProps {
  item: Product;
  qty: number;
  addQty: (id: number) => void;
  subQty: (id: number) => void;
  formatIDR: (amount: number) => string;
}
