import React from 'react';
import { Search, BookOpen, ShoppingBag, ArrowRight } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'STEP 1: DISCOVER',
      subtitle: 'Explore Products and Categories',
      description:
        'Browse our curated catalogue across digital assets, online courses, software applications, and physical everyday gadgets tailored to your goals.',
      icon: <Search className="w-6 h-6 text-[#16865D]" />,
    },
    {
      step: '02',
      title: 'STEP 2: EXPLORE',
      subtitle: 'Read Descriptions and Specs',
      description:
        'Examine verified pricing, authentic user ratings, detailed feature breakdowns, and practical benefits before making your selection.',
      icon: <BookOpen className="w-6 h-6 text-[#16865D]" />,
    },
    {
      step: '03',
      title: 'STEP 3: GET YOUR PRODUCT',
      subtitle: 'Visit the Official Seller & Purchase',
      description:
        'Click the direct CTA button to visit the official seller’s platform to complete your purchase securely with guaranteed vendor pricing and zero hidden fees.',
      icon: <ShoppingBag className="w-6 h-6 text-[#16865D]" />,
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-[#FAFAF7] border-t border-[#E8E7E1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#16865D] mb-2">
            The Process
          </div>
          <h2 className="font-editorial text-3xl md:text-4xl font-bold text-[#17243A]">
            How Dealora Works
          </h2>
          <p className="text-xs sm:text-sm text-[#777777] mt-3">
            A seamless path from curated product discovery to official seller checkout in three simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="relative p-8 rounded-2xl bg-white border border-[#E8E7E1] shadow-xs flex flex-col justify-between"
            >
              {/* Step Number Accent */}
              <div className="flex items-center justify-between mb-6">
                <span className="font-editorial text-4xl font-bold text-[#16865D]/30">
                  {item.step}
                </span>
                <div className="w-12 h-12 rounded-xl bg-[#16865D]/10 flex items-center justify-center">
                  {item.icon}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold tracking-widest uppercase text-[#16865D] block mb-1">
                  {item.title}
                </span>
                <h3 className="font-sans-main font-bold text-lg text-[#17243A] mb-3">
                  {item.subtitle}
                </h3>
                <p className="text-xs text-[#777777] leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
