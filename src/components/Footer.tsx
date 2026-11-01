import React from 'react';
import {
  ShieldAlert,
  Mail,
  MapPin,
  ExternalLink,
  Twitter,
  Linkedin,
  Github,
  Globe,
} from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { ProductCategory } from '../types';

interface FooterProps {
  onCategorySelect: (cat: ProductCategory) => void;
  onNavigateSection: (sectionId: string) => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenContact: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onCategorySelect,
  onNavigateSection,
  onOpenPrivacy,
  onOpenTerms,
  onOpenContact,
  onOpenAdmin,
}) => {
  return (
    <footer className="bg-[#17243A] text-white pt-16 pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 4-column footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          {/* Col 1: Brand & Description (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white text-[#17243A] flex items-center justify-center font-editorial font-bold text-lg">
                D
              </div>
              <div>
                <span className="font-editorial text-xl font-bold tracking-tight text-white block leading-none">
                  DEALORA
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#16865D] font-bold">
                  OmniSync Market
                </span>
              </div>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed max-w-sm">
              Discover More. Choose Better. Shop Smarter. An independent editorial directory connecting curious professionals and consumers with vetted digital resources, practical software, and everyday essentials.
            </p>

            {/* Social Media Links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-neutral-300 hover:text-white transition-colors"
                aria-label="Twitter / X"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-neutral-300 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-neutral-300 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://dealora-market.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-neutral-300 hover:text-white transition-colors"
                aria-label="Website"
              >
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Navigation (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#16865D]">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-neutral-300">
              <li>
                <button
                  onClick={() => onNavigateSection('hero-section')}
                  className="hover:text-white transition-colors"
                >
                  Homepage
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('all-products-section')}
                  className="hover:text-white transition-colors"
                >
                  All Products Directory
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('featured-section')}
                  className="hover:text-white transition-colors"
                >
                  Staff Selections
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('special-deals-section')}
                  className="hover:text-white transition-colors"
                >
                  Special Deals
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('faq-section')}
                  className="hover:text-white transition-colors"
                >
                  Help & FAQs
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenContact}
                  className="hover:text-white transition-colors"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Product Categories (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#16865D]">
              Categories
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-2 text-xs text-neutral-300">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    onCategorySelect(c.id);
                    onNavigateSection('all-products-section');
                  }}
                  className="text-left hover:text-white transition-colors line-clamp-1"
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Col 4: Contact & Transparency (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#16865D]">
              Editorial Office
            </h4>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Curated and maintained with high standards of commercial affiliate ethics.
            </p>
            <div className="space-y-2 text-xs text-neutral-300 pt-1">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#16865D]" />
                <span>support@dealora-market.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#16865D]" />
                <span>Global Discovery Network</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenAdmin}
                className="text-[11px] font-semibold text-neutral-400 hover:text-emerald-400 underline decoration-neutral-600"
              >
                Owner / Merchant Access Portal
              </button>
            </div>
          </div>
        </div>

        {/* Affiliate Disclosure Callout Box (Requirement 12) */}
        <div className="my-8 p-4 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-[#16865D] shrink-0 mt-0.5" />
          <div className="text-xs text-neutral-300 leading-relaxed">
            <strong className="text-white font-semibold block mb-0.5">Mandatory Affiliate Disclosure</strong>
            Dealora participates in affiliate marketing programmes. Some links on this website are affiliate links, meaning we may earn a commission when you make a qualifying purchase through them, at no additional cost to you.
          </div>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400 pt-4">
          <div>
            © {new Date().getFullYear()} OmniSync Market / Dealora. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={onOpenPrivacy}
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={onOpenTerms}
              className="hover:text-white transition-colors"
            >
              Terms & Conditions
            </button>
            <span>•</span>
            <button
              onClick={onOpenContact}
              className="hover:text-white transition-colors"
            >
              Partnership Inquiries
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
