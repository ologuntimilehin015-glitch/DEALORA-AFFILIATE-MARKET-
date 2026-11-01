import React from 'react';
import { CheckCircle2, Layers, Compass, ExternalLink } from 'lucide-react';

export const WhyDiscoverSection: React.FC = () => {
  const cards = [
    {
      icon: <CheckCircle2 className="w-6 h-6 text-[#16865D]" />,
      title: 'Carefully Selected Finds',
      description:
        'Every tool, guide, course, and accessory is hand-reviewed for real utility, verified legitimacy, and high production quality before listing.',
    },
    {
      icon: <Layers className="w-6 h-6 text-[#16865D]" />,
      title: 'Multiple Product Categories',
      description:
        'A unified destination spanning generative software, business masterclasses, digital design assets, and everyday tech hardware essentials.',
    },
    {
      icon: <Compass className="w-6 h-6 text-[#16865D]" />,
      title: 'Simple Product Discovery',
      description:
        'Streamlined search, clean categorisation, and transparent specs eliminate decision fatigue and help you choose with confidence.',
    },
    {
      icon: <ExternalLink className="w-6 h-6 text-[#16865D]" />,
      title: 'Convenient External Shopping',
      description:
        'One-click direct routing to official vendor checkouts and verified store pages with intact buyer protections and guaranteed pricing.',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white border-t border-[#E8E7E1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#16865D] mb-2">
            Why Choose Dealora
          </div>
          <h2 className="font-editorial text-3xl md:text-4xl font-bold text-[#17243A]">
            Why Discover with Dealora?
          </h2>
          <p className="text-xs sm:text-sm text-[#777777] mt-3">
            Built for thoughtful buyers who value quality curation over algorithmic clutter.
          </p>
        </div>

        {/* 4 Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#FAFAF7] border border-[#E8E7E1] hover:border-[#17243A]/20 transition-all duration-300 hover:shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-white border border-[#E8E7E1] flex items-center justify-center mb-5 shadow-2xs">
                  {card.icon}
                </div>
                <h3 className="font-sans-main font-bold text-base text-[#17243A] mb-2">
                  {card.title}
                </h3>
                <p className="text-xs text-[#777777] leading-relaxed">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
