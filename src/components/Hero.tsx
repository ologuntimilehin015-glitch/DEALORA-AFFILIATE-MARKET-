import React from 'react';
import { ArrowRight, Compass, Sparkles, CheckCircle2, ShieldCheck, Flame } from 'lucide-react';

interface HeroProps {
  onExploreProducts: () => void;
  onBrowseCategories: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreProducts,
  onBrowseCategories,
}) => {
  return (
    <section id="hero-section" className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24">
      {/* Subtle architectural background grid accent */}
      <div className="absolute inset-0 bg-[radial-gradient(#17243A_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 md:space-y-8 text-left">
            {/* Tagline / Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E8E7E1] text-[11px] font-bold tracking-wider text-[#17243A] uppercase shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#16865D] animate-pulse" />
              <span>OmniSync Market</span>
              <span className="text-[#777777]">•</span>
              <span className="text-[#16865D]">Curated Affiliate Hub</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-editorial text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#17243A] leading-[1.12]">
              Find Something <br />
              <span className="italic font-normal text-[#16865D]">Worth Discovering.</span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-[#777777] leading-relaxed max-w-xl font-normal">
              Explore a carefully organised collection of products, digital resources, innovative tools and everyday essentials. Discover your next great find, all in one place.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                type="button"
                onClick={onExploreProducts}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider text-white bg-[#17243A] hover:bg-[#16865D] transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
              >
                <span>EXPLORE PRODUCTS</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onBrowseCategories}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider text-[#17243A] bg-white border border-[#E8E7E1] hover:border-[#17243A]/40 hover:bg-[#FAFAF7] transition-all cursor-pointer shadow-xs"
              >
                <span>BROWSE CATEGORIES</span>
                <Compass className="w-4 h-4 text-[#16865D]" />
              </button>
            </div>

            {/* Trust Badges Row */}
            <div className="pt-4 border-t border-[#E8E7E1]/80 grid grid-cols-3 gap-4 max-w-lg">
              <div className="flex items-center gap-2 text-xs text-[#252525]">
                <ShieldCheck className="w-4 h-4 text-[#16865D] shrink-0" />
                <span className="font-medium text-[11px] sm:text-xs">Verified Direct Links</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#252525]">
                <Sparkles className="w-4 h-4 text-[#16865D] shrink-0" />
                <span className="font-medium text-[11px] sm:text-xs">Zero Extra Markups</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#252525]">
                <CheckCircle2 className="w-4 h-4 text-[#16865D] shrink-0" />
                <span className="font-medium text-[11px] sm:text-xs">Editorial Curation</span>
              </div>
            </div>
          </div>

          {/* Right Product Composition Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Showcase Image Frame */}
              <div className="relative rounded-2xl overflow-hidden bg-white p-3 border border-[#E8E7E1] shadow-2xl">
                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#e9e8e2] relative">
                  <img
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80"
                    alt="Curated Lifestyle Hardware and Digital Essentials"
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#16865D] bg-white px-2 py-0.5 rounded-md inline-block mb-1">
                      Featured Discovery
                    </span>
                    <h3 className="font-serif-title font-bold text-base text-white drop-shadow-sm">
                      Smart Everyday Tech Essentials
                    </h3>
                  </div>
                </div>
              </div>

              {/* Floating Pill Card: Handpicked Discovery */}
              <div className="absolute -top-4 -right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-[#E8E7E1] shadow-xl flex items-center gap-3 animate-float">
                <div className="w-10 h-10 rounded-lg bg-[#16865D]/10 flex items-center justify-center text-[#16865D]">
                  <Flame className="w-5 h-5 fill-[#16865D]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#17243A]">8 Categories</div>
                  <div className="text-[10px] text-[#777777]">Digital, Tools & Hardware</div>
                </div>
              </div>

              {/* Floating Pill Card: Real Value */}
              <div className="absolute -bottom-5 -left-4 bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-[#E8E7E1] shadow-xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#17243A] text-white flex items-center justify-center font-bold text-xs">
                  100%
                </div>
                <div>
                  <div className="text-xs font-bold text-[#17243A]">Transparent Curation</div>
                  <div className="text-[10px] text-[#777777]">Direct to Authorized Sellers</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
