import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { ProductCard } from './ProductCard';
import { Product } from '../types';

interface FeaturedSectionProps {
  onSelectProduct: (product: Product) => void;
  onViewAll: () => void;
}

export const FeaturedSection: React.FC<FeaturedSectionProps> = ({
  onSelectProduct,
  onViewAll,
}) => {
  const { featuredProducts } = useProducts();

  return (
    <section id="featured-section" className="py-16 md:py-20 bg-white border-t border-[#E8E7E1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-[#E8E7E1]">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#16865D] mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#16865D]" />
              Staff Selections
            </div>
            <h2 className="font-editorial text-3xl md:text-4xl font-bold text-[#17243A]">
              Featured Discoveries
            </h2>
          </div>
          <button
            onClick={onViewAll}
            className="mt-3 sm:mt-0 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#17243A] hover:text-[#16865D] transition-colors"
          >
            <span>View All Directory</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Featured Products Grid */}
        {featuredProducts.length === 0 ? (
          <div className="p-12 text-center text-[#777777] bg-[#FAFAF7] rounded-xl border border-dashed border-[#E8E7E1]">
            No products currently marked as featured.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
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
