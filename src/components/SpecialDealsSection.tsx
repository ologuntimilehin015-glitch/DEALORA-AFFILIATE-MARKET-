import React from 'react';
import { Tag, ExternalLink, ArrowRight, Sparkles } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { Product } from '../types';

interface SpecialDealsSectionProps {
  onSelectProduct: (product: Product) => void;
}

export const SpecialDealsSection: React.FC<SpecialDealsSectionProps> = ({
  onSelectProduct,
}) => {
  const { specialDeals } = useProducts();

  if (specialDeals.length === 0) return null;

  return (
    <section id="special-deals-section" className="py-16 md:py-24 bg-[#17243A] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#16865D] text-white text-xs font-bold uppercase tracking-wider mb-3">
              <Tag className="w-3.5 h-3.5" />
              Verified Price Reductions
            </div>
            <h2 className="font-editorial text-3xl md:text-5xl font-bold text-white tracking-tight">
              Special Limited Deals
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-md mt-3 md:mt-0 font-normal">
            Directly verified discounts negotiated with original tool creators, course academies, and tech hardware brands.
          </p>
        </div>

        {/* Deals Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {specialDeals.slice(0, 3).map((deal) => {
            const savings = deal.previousPrice ? (deal.previousPrice - deal.price).toFixed(2) : '0';

            return (
              <div
                key={deal.id}
                className="bg-[#1f2e47] rounded-2xl overflow-hidden border border-white/10 flex flex-col justify-between group hover:border-[#16865D]/60 transition-all duration-300 hover:shadow-2xl"
              >
                {/* Image Frame */}
                <div className="relative aspect-[16/10] overflow-hidden bg-black/40">
                  <img
                    src={deal.imageUrl}
                    alt={deal.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#16865D] text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-lg">
                    {deal.discountPercentage}% OFF
                  </div>
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs text-neutral-200 text-[10px] font-semibold px-2.5 py-1 rounded-full">
                    Save ${savings}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400 block mb-1">
                      {deal.category}
                    </span>
                    <h3
                      onClick={() => onSelectProduct(deal)}
                      className="font-sans-main text-lg font-bold text-white group-hover:text-emerald-300 transition-colors cursor-pointer line-clamp-1 mb-2"
                    >
                      {deal.name}
                    </h3>
                    <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed mb-4">
                      {deal.shortDescription}
                    </p>
                  </div>

                  {/* Pricing and Button */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-extrabold text-white">
                          ${deal.price.toFixed(2)}
                        </span>
                        {deal.previousPrice && (
                          <span className="text-sm text-neutral-400 line-through">
                            ${deal.previousPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-emerald-400 font-medium">Verified Active Link</span>
                    </div>

                    <a
                      href={deal.affiliateUrl}
                      target="_blank"
                      rel="sponsored nofollow noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-bold text-[#17243A] bg-white hover:bg-emerald-400 transition-all shadow-md"
                    >
                      <span>VIEW DEAL</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
