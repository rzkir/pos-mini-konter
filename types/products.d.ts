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
}

type ManagementSectionProps = {
  categoriesCount: number;
  sizesCount: number;
  suppliersCount: number;
  productsCount: number;
  onNavigateCategory: () => void;
  onNavigateSize: () => void;
  onNavigateSupplier: () => void;
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
