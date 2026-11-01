import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { Product, ProductCategory } from '../types';
import {
  getProductsFromDb,
  createProductInDb,
  updateProductInDb,
  deleteProductFromDb,
  subscribeToProducts,
} from '../services/productService';
import { useAuth } from './AuthContext';
import { INITIAL_PRODUCTS } from '../data/seedProducts';

interface ProductContextType {
  products: Product[];
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  sortBy: 'featured' | 'newest' | 'price-low' | 'price-high' | 'rating';
  setSortBy: (sort: 'featured' | 'newest' | 'price-low' | 'price-high' | 'rating') => void;
  filteredProducts: Product[];
  featuredProducts: Product[];
  trendingProducts: Product[];
  latestProducts: Product[];
  specialDeals: Product[];
  addProduct: (productData: Omit<Product, 'id'>) => Promise<Product>;
  editProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
  toggleFeatured: (id: string) => Promise<void>;
  toggleTrending: (id: string) => Promise<void>;
  togglePublishStatus: (id: string) => Promise<void>;
  getProductById: (id: string) => Product | undefined;
  refreshProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | null>(null);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin } = useAuth();
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'price-low' | 'price-high' | 'rating'>('featured');

  useEffect(() => {
    let isMounted = true;
    
    // Subscribe to realtime products if available
    const unsubscribe = subscribeToProducts(
      (newProducts) => {
        if (isMounted) {
          setProducts(newProducts);
          setLoading(false);
        }
      },
      (error) => {
        console.warn('Realtime subscription error:', error);
        // Fallback to fetch
        getProductsFromDb().then((prods) => {
          if (isMounted) {
            setProducts(prods);
            setLoading(false);
          }
        });
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const refreshProducts = async () => {
    setLoading(true);
    const prods = await getProductsFromDb();
    setProducts(prods);
    setLoading(false);
  };

  // Filter products for visitors vs admins (visitors only see published)
  const accessibleProducts = useMemo(() => {
    if (isAdmin) return products;
    return products.filter((p) => p.status === 'published');
  }, [products, isAdmin]);

  const filteredProducts = useMemo(() => {
    let result = [...accessibleProducts];

    // Filter by category
    if (selectedCategory && selectedCategory !== 'All') {
      result = result.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by search query (name, category, shortDescription, fullDescription, tags)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }

    // Sorting
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'featured':
      default:
        // Prioritize featured, then newest
        result.sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        break;
    }

    return result;
  }, [accessibleProducts, selectedCategory, searchQuery, sortBy]);

  // Featured products
  const featuredProducts = useMemo(() => {
    return accessibleProducts.filter((p) => p.isFeatured);
  }, [accessibleProducts]);

  // Trending products
  const trendingProducts = useMemo(() => {
    return accessibleProducts.filter((p) => p.isTrending);
  }, [accessibleProducts]);

  // Latest arrivals (sorted by createdAt desc)
  const latestProducts = useMemo(() => {
    return [...accessibleProducts].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [accessibleProducts]);

  // Special Deals (products with previousPrice and verified discount)
  const specialDeals = useMemo(() => {
    return accessibleProducts.filter(
      (p) => p.previousPrice && p.previousPrice > p.price && (p.discountPercentage || 0) > 0
    );
  }, [accessibleProducts]);

  const addProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      const created = await createProductInDb(productData);
      setProducts((prev) => [created, ...prev]);
      return created;
    } catch (e) {
      // Local fallback for optimistic updates
      const localProduct: Product = {
        ...productData,
        id: `prod-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setProducts((prev) => [localProduct, ...prev]);
      return localProduct;
    }
  };

  const editProduct = async (id: string, updates: Partial<Product>) => {
    try {
      await updateProductInDb(id, updates);
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p))
      );
    } catch (e) {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p))
      );
    }
  };

  const removeProduct = async (id: string) => {
    try {
      await deleteProductFromDb(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const toggleFeatured = async (id: string) => {
    const prod = products.find((p) => p.id === id);
    if (!prod) return;
    await editProduct(id, { isFeatured: !prod.isFeatured });
  };

  const toggleTrending = async (id: string) => {
    const prod = products.find((p) => p.id === id);
    if (!prod) return;
    await editProduct(id, { isTrending: !prod.isTrending });
  };

  const togglePublishStatus = async (id: string) => {
    const prod = products.find((p) => p.id === id);
    if (!prod) return;
    const nextStatus = prod.status === 'published' ? 'draft' : 'published';
    await editProduct(id, { status: nextStatus });
  };

  const getProductById = (id: string) => {
    return products.find((p) => p.id === id);
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        sortBy,
        setSortBy,
        filteredProducts,
        featuredProducts,
        trendingProducts,
        latestProducts,
        specialDeals,
        addProduct,
        editProduct,
        removeProduct,
        toggleFeatured,
        toggleTrending,
        togglePublishStatus,
        getProductById,
        refreshProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
