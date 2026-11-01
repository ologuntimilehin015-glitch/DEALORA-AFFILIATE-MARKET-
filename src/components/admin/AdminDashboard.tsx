import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Plus,
  Edit,
  Trash2,
  Upload,
  Search,
  Filter,
  ArrowUpDown,
  Check,
  Sparkles,
  Flame,
  Eye,
  EyeOff,
  ExternalLink,
  Shield,
  Layers,
  Mail,
  Loader2,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { useAuth } from '../../context/AuthContext';
import { Product, ProductCategory, NewsletterSubscriber } from '../../types';
import { CATEGORIES } from '../../data/categories';
import { optimizeImageFile } from '../../utils/imageOptimizer';
import { getNewsletterSubscribers } from '../../services/productService';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onPreviewProduct: (product: Product) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  onPreviewProduct,
}) => {
  const {
    products,
    addProduct,
    editProduct,
    removeProduct,
    toggleFeatured,
    toggleTrending,
    togglePublishStatus,
  } = useProducts();
  const { currentUser, logout, devAdminBypass } = useAuth();

  const [activeTab, setActiveTab] = useState<'manage' | 'editor' | 'subscribers'>('manage');
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [subscribersLoading, setSubscribersLoading] = useState(false);

  // Table search & filters
  const [tableSearch, setTableSearch] = useState('');
  const [tableCategory, setTableCategory] = useState<string>('All');
  const [tableSort, setTableSort] = useState<'newest' | 'price-low' | 'price-high' | 'name'>('newest');

  // Delete confirmation modal state
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State for Add / Edit
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    category: ProductCategory;
    shortDescription: string;
    fullDescription: string;
    price: string;
    previousPrice: string;
    discountPercentage: string;
    rating: string;
    reviewsCount: string;
    buttonText: string;
    affiliateUrl: string;
    imageUrl: string;
    additionalImages: string[];
    features: string[];
    benefits: string[];
    isFeatured: boolean;
    isTrending: boolean;
    status: 'published' | 'draft';
  }>({
    name: '',
    category: 'Technology & Gadgets',
    shortDescription: '',
    fullDescription: '',
    price: '',
    previousPrice: '',
    discountPercentage: '',
    rating: '4.8',
    reviewsCount: '150',
    buttonText: 'SHOP PRODUCT',
    affiliateUrl: '',
    imageUrl: '',
    additionalImages: [],
    features: [''],
    benefits: [''],
    isFeatured: false,
    isTrending: false,
    status: 'published',
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isOptimizingImage, setIsOptimizingImage] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (activeTab === 'subscribers') {
      loadSubscribers();
    }
  }, [activeTab]);

  const loadSubscribers = async () => {
    setSubscribersLoading(true);
    try {
      const list = await getNewsletterSubscribers();
      setSubscribers(list);
    } catch (e) {
      console.warn('Could not fetch subscribers:', e);
    } finally {
      setSubscribersLoading(false);
    }
  };

  if (!isOpen) return null;

  // Reset form to blank
  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: '',
      category: 'Technology & Gadgets',
      shortDescription: '',
      fullDescription: '',
      price: '',
      previousPrice: '',
      discountPercentage: '',
      rating: '4.8',
      reviewsCount: '100',
      buttonText: 'VIEW OFFER',
      affiliateUrl: '',
      imageUrl: '',
      additionalImages: [],
      features: [''],
      benefits: [''],
      isFeatured: false,
      isTrending: false,
      status: 'published',
    });
    setFormError(null);
    setFormSuccess(null);
  };

  // Switch to Edit Mode
  const startEditProduct = (prod: Product) => {
    setEditingId(prod.id);
    setFormData({
      name: prod.name,
      category: prod.category,
      shortDescription: prod.shortDescription,
      fullDescription: prod.fullDescription,
      price: prod.price.toString(),
      previousPrice: prod.previousPrice ? prod.previousPrice.toString() : '',
      discountPercentage: prod.discountPercentage ? prod.discountPercentage.toString() : '',
      rating: prod.rating ? prod.rating.toString() : '4.8',
      reviewsCount: prod.reviewsCount ? prod.reviewsCount.toString() : '100',
      buttonText: prod.buttonText || 'VIEW OFFER',
      affiliateUrl: prod.affiliateUrl,
      imageUrl: prod.imageUrl,
      additionalImages: prod.additionalImages || [],
      features: prod.features && prod.features.length > 0 ? [...prod.features] : [''],
      benefits: prod.benefits && prod.benefits.length > 0 ? [...prod.benefits] : [''],
      isFeatured: prod.isFeatured,
      isTrending: prod.isTrending,
      status: prod.status,
    });
    setFormError(null);
    setFormSuccess(null);
    setActiveTab('editor');
  };

  // Primary image upload with Canvas optimization
  const handlePrimaryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsOptimizingImage(true);
    setFormError(null);
    try {
      const optimizedUrl = await optimizeImageFile(file, 1200, 1200, 0.82);
      setFormData((prev) => ({ ...prev, imageUrl: optimizedUrl }));
    } catch (err: any) {
      setFormError('Image compression failed. Please select a valid JPG, PNG, or WebP image.');
    } finally {
      setIsOptimizingImage(false);
    }
  };

  // Additional image upload
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsOptimizingImage(true);
    try {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const optimized = await optimizeImageFile(files[i], 1000, 1000, 0.8);
        newUrls.push(optimized);
      }
      setFormData((prev) => ({
        ...prev,
        additionalImages: [...prev.additionalImages, ...newUrls],
      }));
    } catch (err) {
      setFormError('Failed to process gallery images.');
    } finally {
      setIsOptimizingImage(false);
    }
  };

  // Auto calculate discount percentage
  const handleCalculateDiscount = () => {
    const cur = parseFloat(formData.price);
    const prev = parseFloat(formData.previousPrice);
    if (!isNaN(cur) && !isNaN(prev) && prev > cur) {
      const pct = Math.round(((prev - cur) / prev) * 100);
      setFormData((f) => ({ ...f, discountPercentage: pct.toString() }));
    }
  };

  // Form Submit (Add or Edit)
  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!formData.name.trim()) {
      setFormError('Product title is required.');
      return;
    }
    if (!formData.imageUrl.trim()) {
      setFormError('Product image is required. Upload an image or enter a URL.');
      return;
    }
    if (!formData.affiliateUrl.trim()) {
      setFormError('Affiliate redirect destination URL is required.');
      return;
    }
    const priceNum = parseFloat(formData.price);
    if (isNaN(priceNum) || priceNum < 0) {
      setFormError('Please enter a valid price.');
      return;
    }

    setIsSaving(true);

    const prevPriceNum = formData.previousPrice ? parseFloat(formData.previousPrice) : undefined;
    const discountNum = formData.discountPercentage ? parseFloat(formData.discountPercentage) : undefined;
    const ratingNum = formData.rating ? parseFloat(formData.rating) : 4.8;
    const reviewsNum = formData.reviewsCount ? parseInt(formData.reviewsCount, 10) : 50;

    const cleanFeatures = formData.features.map((f) => f.trim()).filter(Boolean);
    const cleanBenefits = formData.benefits.map((b) => b.trim()).filter(Boolean);

    try {
      if (editingId) {
        await editProduct(editingId, {
          name: formData.name.trim(),
          category: formData.category,
          shortDescription: formData.shortDescription.trim(),
          fullDescription: formData.fullDescription.trim(),
          price: priceNum,
          previousPrice: prevPriceNum,
          discountPercentage: discountNum,
          rating: ratingNum,
          reviewsCount: reviewsNum,
          buttonText: formData.buttonText.trim() || 'VIEW OFFER',
          affiliateUrl: formData.affiliateUrl.trim(),
          imageUrl: formData.imageUrl.trim(),
          additionalImages: formData.additionalImages,
          features: cleanFeatures,
          benefits: cleanBenefits,
          isFeatured: formData.isFeatured,
          isTrending: formData.isTrending,
          status: formData.status,
        });
        setFormSuccess('Product listing updated successfully!');
      } else {
        await addProduct({
          name: formData.name.trim(),
          category: formData.category,
          shortDescription: formData.shortDescription.trim(),
          fullDescription: formData.fullDescription.trim(),
          price: priceNum,
          previousPrice: prevPriceNum,
          discountPercentage: discountNum,
          rating: ratingNum,
          reviewsCount: reviewsNum,
          buttonText: formData.buttonText.trim() || 'VIEW OFFER',
          affiliateUrl: formData.affiliateUrl.trim(),
          imageUrl: formData.imageUrl.trim(),
          additionalImages: formData.additionalImages,
          features: cleanFeatures,
          benefits: cleanBenefits,
          isFeatured: formData.isFeatured,
          isTrending: formData.isTrending,
          status: formData.status,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: currentUser?.email || 'admin',
        });
        setFormSuccess('New product successfully published to directory!');
        resetForm();
      }

      setTimeout(() => {
        setActiveTab('manage');
      }, 1200);
    } catch (err: any) {
      console.error('Error saving product:', err);
      setFormError('Failed to commit changes to Firestore. Please check permissions.');
    } finally {
      setIsSaving(false);
    }
  };

  // Confirm and delete
  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      await removeProduct(productToDelete.id);
      setProductToDelete(null);
    } catch (err) {
      alert('Could not delete product.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered & sorted products in table
  const tableFilteredProducts = products
    .filter((p) => {
      const matchesSearch =
        tableSearch === '' ||
        p.name.toLowerCase().includes(tableSearch.toLowerCase()) ||
        p.category.toLowerCase().includes(tableSearch.toLowerCase());
      const matchesCat = tableCategory === 'All' || p.category === tableCategory;
      return matchesSearch && matchesCat;
    })
    .sort((a, b) => {
      if (tableSort === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (tableSort === 'price-low') {
        return a.price - b.price;
      }
      if (tableSort === 'price-high') {
        return b.price - a.price;
      }
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fadeIn">
      <div
        className="relative w-full max-w-6xl bg-[#FAFAF7] rounded-3xl shadow-2xl overflow-hidden border border-[#E8E7E1] my-auto flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Admin Header */}
        <div className="bg-[#17243A] text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#16865D] text-white flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-editorial text-xl font-bold tracking-tight">
                  Dealora Admin Console
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-white/10 text-emerald-400 rounded-md">
                  {devAdminBypass ? 'Preview SuperAdmin' : 'Verified Admin'}
                </span>
              </div>
              <p className="text-xs text-neutral-300">
                {currentUser?.email || 'ologuntimilehin94@gmail.com'}
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('manage')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'manage'
                  ? 'bg-white text-[#17243A] shadow-sm'
                  : 'text-neutral-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Catalog Management ({products.length})
            </button>
            <button
              onClick={() => {
                resetForm();
                setActiveTab('editor');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'editor'
                  ? 'bg-white text-[#17243A] shadow-sm'
                  : 'text-neutral-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{editingId ? 'Edit Product' : 'Add Product'}</span>
            </button>
            <button
              onClick={() => setActiveTab('subscribers')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'subscribers'
                  ? 'bg-white text-[#17243A] shadow-sm'
                  : 'text-neutral-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Subscribers
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors ml-2"
              aria-label="Close Admin"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* TAB 1: PRODUCT MANAGEMENT TABLE */}
          {activeTab === 'manage' && (
            <div className="space-y-6">
              {/* Filter & Search Bar */}
              <div className="bg-white p-4 rounded-2xl border border-[#E8E7E1] flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xs">
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#777777]" />
                  <input
                    type="text"
                    value={tableSearch}
                    onChange={(e) => setTableSearch(e.target.value)}
                    placeholder="Search by title or category..."
                    className="w-full pl-9 pr-4 py-2 text-xs bg-[#FAFAF7] border border-[#E8E7E1] rounded-xl text-[#252525] focus:outline-hidden focus:border-[#16865D]"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                  <select
                    value={tableCategory}
                    onChange={(e) => setTableCategory(e.target.value)}
                    className="bg-[#FAFAF7] border border-[#E8E7E1] text-[#252525] text-xs font-medium rounded-xl px-3 py-2 focus:outline-hidden"
                  >
                    <option value="All">All Categories</option>
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={tableSort}
                    onChange={(e) => setTableSort(e.target.value as any)}
                    className="bg-[#FAFAF7] border border-[#E8E7E1] text-[#252525] text-xs font-medium rounded-xl px-3 py-2 focus:outline-hidden"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Alphabetical</option>
                  </select>

                  <button
                    onClick={() => {
                      resetForm();
                      setActiveTab('editor');
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#17243A] hover:bg-[#16865D] transition-colors shadow-xs ml-auto"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Listing</span>
                  </button>
                </div>
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-2xl border border-[#E8E7E1] shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAFAF7] border-b border-[#E8E7E1] text-[#777777] font-semibold uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="px-4 py-3.5">Product</th>
                        <th className="px-4 py-3.5">Category</th>
                        <th className="px-4 py-3.5">Price</th>
                        <th className="px-4 py-3.5 text-center">Status</th>
                        <th className="px-4 py-3.5 text-center">Featured</th>
                        <th className="px-4 py-3.5 text-center">Trending</th>
                        <th className="px-4 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f0eee6]">
                      {tableFilteredProducts.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center text-[#777777]">
                            No products match your filter criteria.
                          </td>
                        </tr>
                      ) : (
                        tableFilteredProducts.map((prod) => (
                          <tr key={prod.id} className="hover:bg-[#FAFAF7]/60 transition-colors">
                            {/* Product Info */}
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-3">
                                <img
                                  src={prod.imageUrl}
                                  alt={prod.name}
                                  className="w-12 h-12 rounded-lg object-cover bg-neutral-100 border border-[#E8E7E1] shrink-0"
                                />
                                <div className="max-w-xs">
                                  <div className="font-bold text-[#17243A] truncate">
                                    {prod.name}
                                  </div>
                                  <div className="text-[11px] text-[#777777] truncate">
                                    {prod.shortDescription}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Category */}
                            <td className="px-4 py-3.5 text-[#252525] font-medium">
                              <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-[11px]">
                                {prod.category}
                              </span>
                            </td>

                            {/* Price */}
                            <td className="px-4 py-3.5 font-bold text-[#17243A]">
                              ${prod.price.toFixed(2)}
                              {prod.previousPrice && (
                                <span className="block text-[10px] text-[#777777] line-through font-normal">
                                  ${prod.previousPrice.toFixed(2)}
                                </span>
                              )}
                            </td>

                            {/* Status Toggle */}
                            <td className="px-4 py-3.5 text-center">
                              <button
                                type="button"
                                onClick={() => togglePublishStatus(prod.id)}
                                title="Click to toggle publish status"
                                className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                                  prod.status === 'published'
                                    ? 'bg-[#16865D]/10 text-[#16865D] hover:bg-[#16865D]/20'
                                    : 'bg-neutral-200 text-neutral-600 hover:bg-neutral-300'
                                }`}
                              >
                                {prod.status === 'published' ? 'Published' : 'Draft'}
                              </button>
                            </td>

                            {/* Featured Toggle */}
                            <td className="px-4 py-3.5 text-center">
                              <button
                                type="button"
                                onClick={() => toggleFeatured(prod.id)}
                                title="Toggle Featured badge"
                                className={`p-1.5 rounded-lg transition-colors ${
                                  prod.isFeatured
                                    ? 'bg-amber-100 text-amber-700'
                                    : 'text-[#777777] hover:bg-neutral-100'
                                }`}
                              >
                                <Sparkles className="w-4 h-4" />
                              </button>
                            </td>

                            {/* Trending Toggle */}
                            <td className="px-4 py-3.5 text-center">
                              <button
                                type="button"
                                onClick={() => toggleTrending(prod.id)}
                                title="Toggle Trending badge"
                                className={`p-1.5 rounded-lg transition-colors ${
                                  prod.isTrending
                                    ? 'bg-rose-100 text-rose-700'
                                    : 'text-[#777777] hover:bg-neutral-100'
                                }`}
                              >
                                <Flame className="w-4 h-4" />
                              </button>
                            </td>

                            {/* Actions */}
                            <td className="px-4 py-3.5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => onPreviewProduct(prod)}
                                  title="Preview product page"
                                  className="p-1.5 rounded-lg text-[#777777] hover:text-[#17243A] hover:bg-neutral-100"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => startEditProduct(prod)}
                                  title="Edit product details"
                                  className="p-1.5 rounded-lg text-[#16865D] hover:bg-[#16865D]/10"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setProductToDelete(prod)}
                                  title="Delete product"
                                  className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ADD / EDIT PRODUCT FORM */}
          {activeTab === 'editor' && (
            <form onSubmit={handleSubmitProduct} className="max-w-4xl mx-auto space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-[#E8E7E1] shadow-2xs space-y-6">
                <div className="flex items-center justify-between border-b border-[#E8E7E1] pb-4">
                  <div>
                    <h3 className="font-editorial text-2xl font-bold text-[#17243A]">
                      {editingId ? 'Edit Product Details' : 'Create New Product Offer'}
                    </h3>
                    <p className="text-xs text-[#777777]">
                      Configure title, pricing, affiliate routing URL, and rich feature bullets.
                    </p>
                  </div>
                  {editingId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="text-xs font-semibold text-[#16865D] hover:underline"
                    >
                      Clear & Create New
                    </button>
                  )}
                </div>

                {formError && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                {formSuccess && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{formSuccess}</span>
                  </div>
                )}

                {/* Basic Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-[#17243A] mb-1.5">
                      Product Name / Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Complete Digital Marketing Blueprint"
                      className="w-full px-3.5 py-2.5 text-xs bg-[#FAFAF7] border border-[#E8E7E1] rounded-xl text-[#252525] focus:outline-hidden focus:border-[#16865D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#17243A] mb-1.5">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                      className="w-full px-3.5 py-2.5 text-xs bg-[#FAFAF7] border border-[#E8E7E1] rounded-xl text-[#252525] focus:outline-hidden focus:border-[#16865D]"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#17243A] mb-1.5">
                      CTA Button Text (e.g. &apos;EXPLORE COURSE&apos;, &apos;SHOP PRODUCT&apos;) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.buttonText}
                      onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                      placeholder="EXPLORE PRODUCT"
                      className="w-full px-3.5 py-2.5 text-xs bg-[#FAFAF7] border border-[#E8E7E1] rounded-xl text-[#252525] focus:outline-hidden focus:border-[#16865D]"
                    />
                  </div>
                </div>

                {/* Pricing & Discount */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-[#17243A] mb-1.5">
                      Current Price ($) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="29.00"
                      className="w-full px-3.5 py-2.5 text-xs bg-[#FAFAF7] border border-[#E8E7E1] rounded-xl text-[#252525] focus:outline-hidden focus:border-[#16865D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#17243A] mb-1.5">
                      Previous Price ($ optional)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.previousPrice}
                      onChange={(e) => setFormData({ ...formData, previousPrice: e.target.value })}
                      placeholder="79.00"
                      className="w-full px-3.5 py-2.5 text-xs bg-[#FAFAF7] border border-[#E8E7E1] rounded-xl text-[#252525] focus:outline-hidden focus:border-[#16865D]"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-[#17243A]">
                        Discount %
                      </label>
                      <button
                        type="button"
                        onClick={handleCalculateDiscount}
                        className="text-[10px] text-[#16865D] font-bold hover:underline"
                      >
                        Calculate
                      </button>
                    </div>
                    <input
                      type="number"
                      value={formData.discountPercentage}
                      onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
                      placeholder="63"
                      className="w-full px-3.5 py-2.5 text-xs bg-[#FAFAF7] border border-[#E8E7E1] rounded-xl text-[#252525] focus:outline-hidden focus:border-[#16865D]"
                    />
                  </div>
                </div>

                {/* Affiliate URL */}
                <div className="pt-2">
                  <label className="block text-xs font-bold text-[#17243A] mb-1.5">
                    Affiliate Destination URL (Exact tracking parameters preserved) *
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.affiliateUrl}
                    onChange={(e) => setFormData({ ...formData, affiliateUrl: e.target.value })}
                    placeholder="https://vendor.com/product?ref=dealora_omnisync"
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FAFAF7] border border-[#E8E7E1] rounded-xl text-[#252525] focus:outline-hidden focus:border-[#16865D] font-mono"
                  />
                  <span className="text-[11px] text-[#777777] mt-1 block">
                    All UTM and affiliate tracking tokens are preserved verbatim and tagged with sponsored nofollow.
                  </span>
                </div>

                {/* Descriptions */}
                <div className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-[#17243A] mb-1.5">
                      Short Description (Card Summary) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.shortDescription}
                      onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                      placeholder="A practical learning resource covering digital marketing fundamentals..."
                      className="w-full px-3.5 py-2.5 text-xs bg-[#FAFAF7] border border-[#E8E7E1] rounded-xl text-[#252525] focus:outline-hidden focus:border-[#16865D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#17243A] mb-1.5">
                      Full Editorial Description *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.fullDescription}
                      onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                      placeholder="Detailed overview for the dedicated product detail modal..."
                      className="w-full px-3.5 py-2.5 text-xs bg-[#FAFAF7] border border-[#E8E7E1] rounded-xl text-[#252525] focus:outline-hidden focus:border-[#16865D]"
                    />
                  </div>
                </div>

                {/* IMAGE MANAGEMENT (Requirement 13 E) */}
                <div className="pt-2 space-y-4 border-t border-[#E8E7E1]">
                  <div>
                    <label className="block text-xs font-bold text-[#17243A] mb-1.5">
                      Primary Showcase Image *
                    </label>
                    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                      <input
                        type="text"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        placeholder="https://images.unsplash.com/... or upload from device"
                        className="flex-1 px-3.5 py-2.5 text-xs bg-[#FAFAF7] border border-[#E8E7E1] rounded-xl text-[#252525] focus:outline-hidden focus:border-[#16865D]"
                      />

                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handlePrimaryImageUpload}
                        className="hidden"
                      />

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isOptimizingImage}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#E8E7E1] bg-white text-xs font-bold text-[#17243A] hover:bg-[#FAFAF7] transition-colors whitespace-nowrap cursor-pointer shadow-2xs"
                      >
                        {isOptimizingImage ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Upload className="w-3.5 h-3.5 text-[#16865D]" />
                        )}
                        <span>Upload From Device</span>
                      </button>
                    </div>

                    {formData.imageUrl && (
                      <div className="mt-3 flex items-center gap-3">
                        <img
                          src={formData.imageUrl}
                          alt="Preview"
                          className="w-16 h-16 rounded-xl object-cover border border-[#E8E7E1]"
                        />
                        <span className="text-[11px] text-[#16865D] font-semibold">
                          Image ready (Optimized for performance)
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Additional Gallery Images */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-[#17243A]">
                        Additional Gallery Images (Optional)
                      </label>
                      <button
                        type="button"
                        onClick={() => galleryInputRef.current?.click()}
                        className="text-[11px] font-bold text-[#16865D] hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add Image
                      </button>
                      <input
                        type="file"
                        ref={galleryInputRef}
                        accept="image/*"
                        multiple
                        onChange={handleGalleryUpload}
                        className="hidden"
                      />
                    </div>

                    {formData.additionalImages.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {formData.additionalImages.map((img, i) => (
                          <div key={i} className="relative w-14 h-14 rounded-lg overflow-hidden border border-[#E8E7E1] group">
                            <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  additionalImages: prev.additionalImages.filter((_, idx) => idx !== i),
                                }));
                              }}
                              className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Key Features dynamic points */}
                <div className="pt-2 space-y-2 border-t border-[#E8E7E1]">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#17243A]">
                      Key Features & Specifications
                    </label>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, features: [...formData.features, ''] })}
                      className="text-[11px] font-bold text-[#16865D] hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add Feature
                    </button>
                  </div>

                  {formData.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={feat}
                        onChange={(e) => {
                          const updated = [...formData.features];
                          updated[idx] = e.target.value;
                          setFormData({ ...formData, features: updated });
                        }}
                        placeholder={`Feature ${idx + 1}`}
                        className="flex-1 px-3 py-2 text-xs bg-[#FAFAF7] border border-[#E8E7E1] rounded-lg text-[#252525] focus:outline-hidden focus:border-[#16865D]"
                      />
                      {formData.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              features: formData.features.filter((_, i) => i !== idx),
                            });
                          }}
                          className="p-1.5 text-neutral-400 hover:text-rose-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Benefits dynamic points */}
                <div className="pt-2 space-y-2 border-t border-[#E8E7E1]">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#17243A]">
                      User Benefits & Takeaways
                    </label>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, benefits: [...formData.benefits, ''] })}
                      className="text-[11px] font-bold text-[#16865D] hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add Benefit
                    </button>
                  </div>

                  {formData.benefits.map((b, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={b}
                        onChange={(e) => {
                          const updated = [...formData.benefits];
                          updated[idx] = e.target.value;
                          setFormData({ ...formData, benefits: updated });
                        }}
                        placeholder={`Benefit ${idx + 1}`}
                        className="flex-1 px-3 py-2 text-xs bg-[#FAFAF7] border border-[#E8E7E1] rounded-lg text-[#252525] focus:outline-hidden focus:border-[#16865D]"
                      />
                      {formData.benefits.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              benefits: formData.benefits.filter((_, i) => i !== idx),
                            });
                          }}
                          className="p-1.5 text-neutral-400 hover:text-rose-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Flags and Publishing */}
                <div className="pt-4 border-t border-[#E8E7E1] grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <label className="flex items-center gap-3 p-3 bg-[#FAFAF7] border border-[#E8E7E1] rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="rounded-sm text-[#16865D] focus:ring-[#16865D]"
                    />
                    <div>
                      <div className="text-xs font-bold text-[#17243A]">Mark as Featured</div>
                      <div className="text-[10px] text-[#777777]">Shown in homepage staff picks</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-[#FAFAF7] border border-[#E8E7E1] rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isTrending}
                      onChange={(e) => setFormData({ ...formData, isTrending: e.target.checked })}
                      className="rounded-sm text-[#16865D] focus:ring-[#16865D]"
                    />
                    <div>
                      <div className="text-xs font-bold text-[#17243A]">Mark as Trending</div>
                      <div className="text-[10px] text-[#777777]">Shown with velocity fire badge</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-[#FAFAF7] border border-[#E8E7E1] rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.status === 'published'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.checked ? 'published' : 'draft',
                        })
                      }
                      className="rounded-sm text-[#16865D] focus:ring-[#16865D]"
                    />
                    <div>
                      <div className="text-xs font-bold text-[#17243A]">Publish Immediately</div>
                      <div className="text-[10px] text-[#777777]">Uncheck to keep as draft</div>
                    </div>
                  </label>
                </div>

                {/* Form Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8E7E1]">
                  <button
                    type="button"
                    onClick={() => setActiveTab('manage')}
                    className="px-5 py-2.5 rounded-xl text-xs font-semibold text-[#777777] hover:text-[#17243A]"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-[#17243A] hover:bg-[#16865D] transition-colors shadow-md disabled:opacity-50 cursor-pointer"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving Changes...</span>
                      </>
                    ) : (
                      <span>{editingId ? 'Save Updates' : 'Publish Product'}</span>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* TAB 3: NEWSLETTER SUBSCRIBERS */}
          {activeTab === 'subscribers' && (
            <div className="bg-white p-6 rounded-2xl border border-[#E8E7E1] shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#E8E7E1] pb-4">
                <div>
                  <h3 className="font-editorial text-2xl font-bold text-[#17243A]">
                    Newsletter Subscribers
                  </h3>
                  <p className="text-xs text-[#777777]">
                    Audience members who registered for new discovery notifications.
                  </p>
                </div>
                <button
                  onClick={loadSubscribers}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#FAFAF7] border border-[#E8E7E1] text-[#252525] hover:bg-neutral-100"
                >
                  Refresh
                </button>
              </div>

              {subscribersLoading ? (
                <div className="py-12 text-center text-[#777777] flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-[#16865D]" />
                  <span>Loading subscribers list...</span>
                </div>
              ) : subscribers.length === 0 ? (
                <div className="py-12 text-center text-[#777777]">
                  No subscribers recorded yet in the database.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAFAF7] border-b border-[#E8E7E1] text-[#777777] font-semibold uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="px-4 py-3">Email Address</th>
                        <th className="px-4 py-3">Consent Status</th>
                        <th className="px-4 py-3">Subscribed Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f0eee6]">
                      {subscribers.map((s, idx) => (
                        <tr key={idx} className="hover:bg-[#FAFAF7]">
                          <td className="px-4 py-3 font-semibold text-[#17243A]">{s.email}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                              Verified Consent
                            </span>
                          </td>
                          <td className="px-4 py-3 text-[#777777]">
                            {new Date(s.subscribedAt).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {productToDelete && (
        <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-[#E8E7E1] shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="font-sans-main font-bold text-base text-[#17243A]">
              Delete Product Listing?
            </h4>
            <p className="text-xs text-[#777777] leading-relaxed">
              Are you sure you want to remove &ldquo;<strong className="text-[#252525]">{productToDelete.name}</strong>&rdquo;? This will permanently erase the product and its affiliate link from the catalog.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#777777] hover:text-[#17243A] bg-neutral-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-xs"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
