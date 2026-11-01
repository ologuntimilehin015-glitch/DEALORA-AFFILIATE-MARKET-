import React from 'react';
import { Flame, ArrowRight } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { ProductCard } from './ProductCard';
import { Product } from '../types';

interface TrendingSectionProps {
  onSelectProduct: (product: Product) => void;
  onViewAll: () => void;
}

export const TrendingSection: React.FC<TrendingSectionProps> = ({
  onSelectProduct,
  onViewAll,
}) => {
  const { trendingProducts } = useProducts();

  if (trendingProducts.length === 0) return null;

  return (
    <section id="trending-section" className="py-16 md:py-20 bg-[#FAFAF7] border-t border-[#E8E7E1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-[#E8E7E1]">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-600 mb-1.5">
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
              High Community Velocity
            </div>
            <h2 className="font-editorial text-3xl md:text-4xl font-bold text-[#17243A]">
              Trending Right Now
            </h2>
          </div>
          <button
            onClick={onViewAll}
            className="mt-3 sm:mt-0 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#17243A] hover:text-[#16865D] transition-colors"
          >
            <span>Explore All</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {trendingProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
