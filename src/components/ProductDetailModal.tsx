import React, { useState, useEffect } from 'react';
import {
  X,
  ExternalLink,
  Star,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Share2,
  Info,
  ChevronLeft,
} from 'lucide-react';
import { Product } from '../types';
import { useProducts } from '../context/ProductContext';
import { ProductCard } from './ProductCard';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onSelectProduct,
}) => {
  const { products } = useProducts();
  const [activeImage, setActiveImage] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (product) {
      setActiveImage(product.imageUrl);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [product]);

  if (!product) return null;

  const galleryImages = [
    product.imageUrl,
    ...(product.additionalImages || []),
  ].filter(Boolean);

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const hasDiscount =
    product.previousPrice &&
    product.previousPrice > product.price &&
    (product.discountPercentage || 0) > 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex justify-center p-2 sm:p-4 md:p-6 animate-fadeIn">
      <div
        className="relative w-full max-w-5xl bg-[#FAFAF7] rounded-2xl shadow-2xl overflow-hidden my-auto border border-[#E8E7E1]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Action Header inside Modal */}
        <div className="sticky top-0 z-20 bg-[#FAFAF7]/95 backdrop-blur-md px-6 py-3.5 border-b border-[#E8E7E1] flex items-center justify-between">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#777777] hover:text-[#17243A] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Directory
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              title="Share listing link"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white border border-[#E8E7E1] text-[#252525] hover:bg-neutral-50 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-[#777777]" />
              {copied ? 'Link Copied!' : 'Share'}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-[#777777] hover:text-[#17243A] hover:bg-neutral-200/50 transition-colors"
              aria-label="Close details"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Content Container */}
        <div className="p-6 md:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left: Gallery Column */}
            <div className="lg:col-span-6 space-y-4">
              {/* Main Showcase Image */}
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#f0eee6] border border-[#E8E7E1] shadow-inner">
                <img
                  src={activeImage || product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover object-center transition-all duration-300"
                />

                {hasDiscount && (
                  <span className="absolute top-4 left-4 px-3 py-1 text-xs font-bold bg-[#16865D] text-white rounded-full shadow-md">
                    SAVE {product.discountPercentage}%
                  </span>
                )}
              </div>

              {/* Thumbnails Row */}
              {galleryImages.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {galleryImages.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImage(imgUrl)}
                      className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                        activeImage === imgUrl
                          ? 'border-[#16865D] ring-2 ring-[#16865D]/20 scale-95'
                          : 'border-[#E8E7E1] hover:border-neutral-400 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Security & Authenticity Trust Badge */}
              <div className="bg-white p-4 rounded-xl border border-[#E8E7E1] flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-[#16865D] shrink-0" />
                <div className="text-xs text-[#777777]">
                  <strong className="text-[#252525] font-semibold block">Curated External Destination</strong>
                  This item is offered directly by the authorized partner. Clicking below takes you to the official checkout page.
                </div>
              </div>
            </div>

            {/* Right: Product Details Column */}
            <div className="lg:col-span-6 space-y-6">
              {/* Category & Badge */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#16865D] bg-[#16865D]/10 px-3 py-1 rounded-full">
                  {product.category}
                </span>

                {product.rating && (
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-[#252525] bg-white px-3 py-1 rounded-full border border-[#E8E7E1]">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span>{product.rating.toFixed(1)}</span>
                    {product.reviewsCount && (
                      <span className="text-[#777777] text-xs font-normal">
                        ({product.reviewsCount} verified reviews)
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Product Title */}
              <h1 className="font-editorial text-2xl md:text-3xl lg:text-4xl font-bold text-[#17243A] leading-tight">
                {product.name}
              </h1>

              {/* Price Block */}
              <div className="flex items-baseline gap-3 p-4 bg-white rounded-xl border border-[#E8E7E1]">
                <div className="text-3xl font-extrabold text-[#17243A]">
                  ${product.price.toFixed(2)}
                </div>
                {product.previousPrice && product.previousPrice > product.price && (
                  <div className="text-base text-[#777777] line-through">
                    ${product.previousPrice.toFixed(2)}
                  </div>
                )}
                {hasDiscount && (
                  <span className="text-xs font-bold text-[#16865D] bg-[#16865D]/10 px-2.5 py-1 rounded-md">
                    {product.discountPercentage}% Discount Active
                  </span>
                )}
              </div>

              {/* Short & Full Description */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-[#252525] leading-relaxed">
                  {product.shortDescription}
                </p>
                <div className="text-xs md:text-sm text-[#777777] leading-relaxed whitespace-pre-line border-t border-[#E8E7E1] pt-3">
                  {product.fullDescription}
                </div>
              </div>

              {/* Key Features Section */}
              {product.features && product.features.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#17243A] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#16865D]" />
                    Key Highlights & Features
                  </h4>
                  <ul className="grid grid-cols-1 gap-2">
                    {product.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-[#252525]">
                        <CheckCircle2 className="w-4 h-4 text-[#16865D] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Benefits Section */}
              {product.benefits && product.benefits.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#17243A]">
                    Why You’ll Love It
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {product.benefits.map((b, i) => (
                      <div
                        key={i}
                        className="bg-white/80 p-3 rounded-lg border border-[#E8E7E1] text-xs text-[#252525] font-medium"
                      >
                        {b}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Main Affiliate CTA Button (Requirement 13 & 15) */}
              <div className="pt-4 space-y-3">
                <a
                  href={product.affiliateUrl}
                  target="_blank"
                  rel="sponsored nofollow noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl text-base font-bold text-white bg-[#17243A] hover:bg-[#16865D] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  <span>{product.buttonText || 'EXPLORE PRODUCT ON OFFICIAL SITE'}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                {/* Affiliate Disclosure in Product Page */}
                <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl flex items-start gap-2.5 text-[11px] text-[#777777]">
                  <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p>
                    <strong className="text-neutral-800 font-semibold">Affiliate Transparency:</strong> When you purchase through our links, OmniSync Market may receive a qualifying commission from the external seller at zero additional cost to you.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <div className="mt-16 pt-10 border-t border-[#E8E7E1]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#16865D]">
                    Curated Discovery
                  </span>
                  <h3 className="font-editorial text-xl md:text-2xl font-bold text-[#17243A]">
                    More in {product.category}
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedProducts.map((rel) => (
                  <ProductCard
                    key={rel.id}
                    product={rel}
                    onSelect={(p) => onSelectProduct(p)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
