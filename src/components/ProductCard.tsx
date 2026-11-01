import React from 'react';
import { Star, ExternalLink, ArrowRight, Sparkles, Flame } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const hasDiscount =
    product.previousPrice &&
    product.previousPrice > product.price &&
    (product.discountPercentage || 0) > 0;

  const handleAffiliateClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Track click or open external seller directly
    window.open(product.affiliateUrl, '_blank', 'noopener,noreferrer,sponsored');
  };

  return (
    <div
      onClick={() => onSelect(product)}
      className="group relative flex flex-col bg-white rounded-xl overflow-hidden border border-[#E8E7E1] transition-all duration-300 hover:shadow-xl hover:border-[#17243A]/20 cursor-pointer"
    >
      {/* Product Image Container */}
      <div className="relative aspect-[4/3] w-full bg-[#f4f3ee] overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
          {hasDiscount && (
            <span className="px-2 py-0.5 text-xs font-semibold tracking-wide bg-[#16865D] text-white rounded-full shadow-sm">
              SAVE {product.discountPercentage}%
            </span>
          )}
          {product.isTrending && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold bg-[#17243A] text-white rounded-full shadow-sm">
              <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
              Trending
            </span>
          )}
          {product.isFeatured && !product.isTrending && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200 rounded-full shadow-sm">
              <Sparkles className="w-3 h-3 text-amber-600" />
              Featured
            </span>
          )}
        </div>

        {/* Quick View Hover Indicator */}
        <div className="absolute inset-0 bg-[#17243A]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="bg-white/95 backdrop-blur-xs text-[#17243A] px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide shadow-md flex items-center gap-1.5">
            Quick Overview
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>

      {/* Product Card Body */}
      <div className="flex flex-1 flex-col p-5">
        {/* Category & Rating */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[11px] font-semibold tracking-wider uppercase text-[#16865D] bg-[#16865D]/10 px-2.5 py-0.5 rounded-full">
            {product.category}
          </span>
          {product.rating && (
            <div className="flex items-center gap-1 text-xs font-medium text-[#252525]">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{product.rating.toFixed(1)}</span>
              {product.reviewsCount && (
                <span className="text-[#777777] text-[11px]">({product.reviewsCount})</span>
              )}
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="font-sans-main font-bold text-base text-[#17243A] line-clamp-1 group-hover:text-[#16865D] transition-colors mb-2">
          {product.name}
        </h3>

        {/* Short Description */}
        <p className="text-xs text-[#777777] line-clamp-2 leading-relaxed mb-4 flex-1">
          {product.shortDescription}
        </p>

        {/* Price & Action Footer */}
        <div className="pt-3 border-t border-[#f0eee6] flex items-center justify-between gap-3 mt-auto">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-[#17243A]">
                ${product.price.toFixed(2)}
              </span>
              {product.previousPrice && product.previousPrice > product.price && (
                <span className="text-xs text-[#777777] line-through">
                  ${product.previousPrice.toFixed(2)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-[#777777] block">Verified Affiliate Offer</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleAffiliateClick}
              title={`Visit official seller for ${product.name}`}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white bg-[#17243A] hover:bg-[#16865D] transition-all shadow-xs"
            >
              <span>{product.buttonText || 'VIEW OFFER'}</span>
              <ExternalLink className="w-3 h-3 opacity-80" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
