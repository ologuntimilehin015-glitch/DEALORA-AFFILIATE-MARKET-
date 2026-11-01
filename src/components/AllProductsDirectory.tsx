import React from 'react';
import { Search, Filter, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { CATEGORIES } from '../data/categories';
import { ProductCard } from './ProductCard';
import { Product, ProductCategory } from '../types';

interface AllProductsDirectoryProps {
  onSelectProduct: (product: Product) => void;
}

export const AllProductsDirectory: React.FC<AllProductsDirectoryProps> = ({
  onSelectProduct,
}) => {
  const {
    filteredProducts,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    products,
  } = useProducts();

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSortBy('featured');
  };

  return (
    <section id="all-products-section" className="py-16 md:py-24 bg-[#FAFAF7] border-t border-[#E8E7E1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E8E7E1] text-[11px] font-bold uppercase tracking-wider text-[#16865D] mb-3 shadow-2xs">
            Complete Directory
          </div>
          <h2 className="font-editorial text-3xl md:text-5xl font-bold text-[#17243A] tracking-tight">
            Explore All Products
          </h2>
          <p className="text-sm text-[#777777] mt-3">
            Search our comprehensive catalogue across software, digital guides, high-impact courses, and everyday technology essentials.
          </p>
        </div>

        {/* Filter & Search Bar Container */}
        <div className="bg-white p-5 rounded-2xl border border-[#E8E7E1] shadow-xs mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Search Input Field */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-[#777777]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by product name, category, or keyword..."
                className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-[#FAFAF7] border border-[#E8E7E1] rounded-xl text-[#252525] focus:outline-hidden focus:border-[#16865D] focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-[#777777] hover:text-[#17243A]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2 self-end md:self-auto">
              <label htmlFor="sort-select" className="text-xs font-semibold text-[#777777] flex items-center gap-1.5 whitespace-nowrap">
                <ArrowUpDown className="w-3.5 h-3.5" />
                Sort By:
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#FAFAF7] border border-[#E8E7E1] text-[#252525] text-xs font-semibold rounded-xl px-3 py-2.5 focus:outline-hidden focus:border-[#16865D] cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="pt-2 border-t border-[#f0eee6] flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-[#777777] font-semibold text-xs whitespace-nowrap mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Category:
            </span>

            <button
              type="button"
              onClick={() => setSelectedCategory('All')}
              className={`px-3 py-1.5 rounded-full font-semibold transition-all whitespace-nowrap ${
                selectedCategory === 'All'
                  ? 'bg-[#17243A] text-white shadow-xs'
                  : 'bg-[#FAFAF7] text-[#777777] hover:text-[#17243A] border border-[#E8E7E1]'
              }`}
            >
              All ({products.filter((p) => p.status === 'published').length})
            </button>

            {CATEGORIES.map((cat) => {
              const count = products.filter((p) => p.category === cat.id && p.status === 'published').length;
              const isSelected = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full font-semibold transition-all whitespace-nowrap ${
                    isSelected
                      ? 'bg-[#16865D] text-white shadow-xs'
                      : 'bg-[#FAFAF7] text-[#777777] hover:text-[#17243A] border border-[#E8E7E1]'
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Metadata Bar */}
        <div className="flex items-center justify-between text-xs text-[#777777] mb-6 px-1">
          <div>
            Showing <strong className="text-[#252525]">{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'product' : 'products'}
            {selectedCategory !== 'All' && (
              <span> in <strong className="text-[#16865D]">{selectedCategory}</strong></span>
            )}
            {searchQuery && (
              <span> matching &ldquo;<strong className="text-[#17243A]">{searchQuery}</strong>&rdquo;</span>
            )}
          </div>

          {(selectedCategory !== 'All' || searchQuery) && (
            <button
              onClick={handleClearFilters}
              className="text-[#16865D] hover:underline font-semibold flex items-center gap-1"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-[#E8E7E1] max-w-lg mx-auto">
            <SlidersHorizontal className="w-10 h-10 text-[#777777] mx-auto mb-3 opacity-60" />
            <h3 className="font-editorial text-xl font-bold text-[#17243A] mb-2">No Products Found</h3>
            <p className="text-xs text-[#777777] leading-relaxed mb-6">
              We couldn&apos;t find any items matching your current filters or search terms. Try searching with different keywords or clear your active category.
            </p>
            <button
              onClick={handleClearFilters}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#17243A] hover:bg-[#16865D] transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={onSelectProduct}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
