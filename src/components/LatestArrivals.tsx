import React from 'react';
import { Clock, ArrowRight } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { ProductCard } from './ProductCard';
import { Product } from '../types';

interface LatestArrivalsProps {
  onSelectProduct: (product: Product) => void;
  onViewAll: () => void;
}

export const LatestArrivals: React.FC<LatestArrivalsProps> = ({
  onSelectProduct,
  onViewAll,
}) => {
  const { latestProducts } = useProducts();
  const recentArrivals = latestProducts.slice(0, 4);

  return (
    <section id="latest-arrivals-section" className="py-16 md:py-20 bg-white border-t border-[#E8E7E1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-[#E8E7E1]">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#16865D] mb-1.5">
              <Clock className="w-3.5 h-3.5 text-[#16865D]" />
              New Additions
            </div>
            <h2 className="font-editorial text-3xl md:text-4xl font-bold text-[#17243A]">
              Latest Discoveries
            </h2>
          </div>
          <button
            onClick={onViewAll}
            className="mt-3 sm:mt-0 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#17243A] hover:text-[#16865D] transition-colors"
          >
            <span>See Fresh Additions</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentArrivals.map((product) => (
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
