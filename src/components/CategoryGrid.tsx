import React from 'react';
import {
  Cpu,
  FileText,
  GraduationCap,
  TrendingUp,
  Bot,
  Sparkles,
  HeartPulse,
  Compass,
  ArrowRight,
} from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { useProducts } from '../context/ProductContext';
import { ProductCategory } from '../types';

interface CategoryGridProps {
  onCategorySelect: (category: ProductCategory) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Cpu: <Cpu className="w-5 h-5" />,
  FileText: <FileText className="w-5 h-5" />,
  GraduationCap: <GraduationCap className="w-5 h-5" />,
  TrendingUp: <TrendingUp className="w-5 h-5" />,
  Bot: <Bot className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />,
  HeartPulse: <HeartPulse className="w-5 h-5" />,
  Compass: <Compass className="w-5 h-5" />,
};

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onCategorySelect }) => {
  const { products, selectedCategory, setSelectedCategory } = useProducts();

  const handleSelect = (catName: ProductCategory) => {
    setSelectedCategory(catName);
    onCategorySelect(catName);
  };

  return (
    <section id="categories-section" className="py-16 md:py-20 border-t border-[#E8E7E1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#16865D] mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16865D]" />
              Multi-Domain Directory
            </div>
            <h2 className="font-editorial text-3xl md:text-4xl font-bold text-[#17243A]">
              Explore by Category
            </h2>
          </div>
          <p className="text-xs md:text-sm text-[#777777] max-w-md mt-2 md:mt-0">
            From vetted software suites and video masterclasses to minimalist hardware essentials and productivity tools.
          </p>
        </div>

        {/* Categories Grid (8 Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => {
            const count = products.filter((p) => p.category === cat.id && p.status === 'published').length;
            const isSelected = selectedCategory === cat.id;

            return (
              <div
                key={cat.id}
                onClick={() => handleSelect(cat.id)}
                className={`group relative rounded-xl overflow-hidden bg-white border cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                  isSelected
                    ? 'border-[#16865D] ring-2 ring-[#16865D]/30 shadow-md'
                    : 'border-[#E8E7E1] hover:border-[#17243A]/30'
                }`}
              >
                {/* Visual Image Background with Dark Gradient */}
                <div className="relative aspect-[16/10] overflow-hidden bg-neutral-900">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    loading="lazy"
                    className="w-full h-full object-cover object-center opacity-85 group-hover:scale-105 group-hover:opacity-95 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#17243A] via-[#17243A]/40 to-transparent" />

                  {/* Icon and Count Badge */}
                  <div className="absolute top-3 left-3 w-9 h-9 rounded-lg bg-white/90 backdrop-blur-xs text-[#17243A] flex items-center justify-center shadow-sm">
                    {ICON_MAP[cat.iconName]}
                  </div>

                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-xs text-white text-[11px] font-semibold border border-white/20">
                    {count} {count === 1 ? 'Product' : 'Products'}
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="font-sans-main font-bold text-base tracking-tight text-white group-hover:text-[#FAFAF7]">
                      {cat.name}
                    </h3>
                  </div>
                </div>

                {/* Card Description & Action Footer */}
                <div className="p-4 flex flex-col justify-between">
                  <p className="text-xs text-[#777777] line-clamp-2 leading-relaxed mb-3">
                    {cat.description}
                  </p>

                  <div className="flex items-center justify-between text-xs font-semibold text-[#16865D] group-hover:text-[#126e4c]">
                    <span>{isSelected ? 'Currently Viewing' : 'Explore Category'}</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
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
