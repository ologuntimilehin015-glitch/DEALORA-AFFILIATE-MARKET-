import React, { useState } from 'react';
import {
  Search,
  Menu,
  X,
  Shield,
  LogOut,
  Sparkles,
  Compass,
  ArrowUpRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';

interface HeaderProps {
  onOpenAdmin: () => void;
  onOpenAbout: () => void;
  onOpenContact: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAdmin,
  onOpenAbout,
  onOpenContact,
  onNavigateSection,
}) => {
  const { currentUser, isAdmin, logout } = useAuth();
  const { searchQuery, setSearchQuery, setSelectedCategory } = useProducts();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    onNavigateSection(sectionId);
  };

  const handleAllProducts = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    handleNavClick('all-products-section');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAFAF7]/95 backdrop-blur-md border-b border-[#E8E7E1] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavClick('hero-section')}
              className="text-left group flex items-center gap-2.5 focus:outline-hidden"
            >
              <div className="w-10 h-10 rounded-xl bg-[#17243A] text-white flex items-center justify-center font-editorial font-bold text-xl shadow-md group-hover:bg-[#16865D] transition-colors">
                D
              </div>
              <div className="flex flex-col">
                <span className="font-editorial text-xl font-bold tracking-tight text-[#17243A] leading-none group-hover:text-[#16865D] transition-colors">
                  DEALORA
                </span>
                <span className="text-[10px] font-sans-main tracking-widest uppercase text-[#16865D] font-bold mt-0.5">
                  OmniSync Market
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold tracking-wide text-[#252525]">
            <button
              onClick={() => handleNavClick('hero-section')}
              className="hover:text-[#16865D] transition-colors uppercase"
            >
              Home
            </button>
            <button
              onClick={handleAllProducts}
              className="hover:text-[#16865D] transition-colors uppercase"
            >
              All Products
            </button>
            <button
              onClick={() => handleNavClick('categories-section')}
              className="hover:text-[#16865D] transition-colors uppercase"
            >
              Categories
            </button>
            <button
              onClick={() => handleNavClick('featured-section')}
              className="hover:text-[#16865D] transition-colors uppercase"
            >
              Featured
            </button>
            <button
              onClick={() => handleNavClick('special-deals-section')}
              className="hover:text-[#16865D] transition-colors uppercase flex items-center gap-1 text-[#16865D]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Latest Deals
            </button>
            <button
              onClick={onOpenAbout}
              className="hover:text-[#16865D] transition-colors uppercase"
            >
              About Us
            </button>
            <button
              onClick={onOpenContact}
              className="hover:text-[#16865D] transition-colors uppercase"
            >
              Contact
            </button>
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            {/* Search Bar / Icon */}
            <div className="relative">
              {isSearchExpanded ? (
                <div className="flex items-center bg-white border border-[#17243A]/20 rounded-full px-3 py-1.5 shadow-sm animate-fadeIn">
                  <Search className="w-4 h-4 text-[#777777] mr-2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (e.target.value.trim().length > 0) {
                        onNavigateSection('all-products-section');
                      }
                    }}
                    placeholder="Search tools, courses, gear..."
                    className="w-40 sm:w-56 text-xs text-[#252525] bg-transparent focus:outline-hidden"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      setIsSearchExpanded(false);
                      setSearchQuery('');
                    }}
                    className="text-[#777777] hover:text-[#17243A] ml-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsSearchExpanded(true)}
                  aria-label="Search products"
                  className="p-2.5 rounded-full text-[#17243A] hover:bg-[#17243A]/5 transition-colors"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Admin Dashboard Entry Point */}
            {isAdmin ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenAdmin}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#16865D] text-white hover:bg-[#126e4c] transition-all shadow-xs"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin Panel</span>
                </button>
                <button
                  onClick={() => logout()}
                  title="Sign Out"
                  className="hidden sm:inline-flex p-2 rounded-full text-[#777777] hover:text-rose-600 hover:bg-neutral-100 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAdmin}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-[#E8E7E1] bg-white text-[#777777] hover:text-[#17243A] hover:border-[#17243A]/30 transition-all"
              >
                <Shield className="w-3.5 h-3.5 text-[#16865D]" />
                <span>Admin Login</span>
              </button>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-[#17243A] hover:bg-[#17243A]/5 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAFAF7] border-b border-[#E8E7E1] px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
          {/* Mobile Search input */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-3 w-4 h-4 text-[#777777]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                onNavigateSection('all-products-section');
              }}
              placeholder="Search products, software, courses..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-[#E8E7E1] rounded-lg text-[#252525] focus:outline-hidden focus:border-[#16865D]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-[#17243A]">
            <button
              onClick={() => handleNavClick('hero-section')}
              className="text-left px-3 py-2.5 rounded-lg bg-white border border-[#E8E7E1]"
            >
              Home
            </button>
            <button
              onClick={handleAllProducts}
              className="text-left px-3 py-2.5 rounded-lg bg-white border border-[#E8E7E1]"
            >
              All Products
            </button>
            <button
              onClick={() => handleNavClick('categories-section')}
              className="text-left px-3 py-2.5 rounded-lg bg-white border border-[#E8E7E1]"
            >
              Categories
            </button>
            <button
              onClick={() => handleNavClick('featured-section')}
              className="text-left px-3 py-2.5 rounded-lg bg-white border border-[#E8E7E1]"
            >
              Featured
            </button>
            <button
              onClick={() => handleNavClick('special-deals-section')}
              className="text-left px-3 py-2.5 rounded-lg bg-white border border-[#E8E7E1] text-[#16865D]"
            >
              Latest Deals
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAbout();
              }}
              className="text-left px-3 py-2.5 rounded-lg bg-white border border-[#E8E7E1]"
            >
              About Us
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenContact();
              }}
              className="text-left px-3 py-2.5 rounded-lg bg-white border border-[#E8E7E1]"
            >
              Contact
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="text-left px-3 py-2.5 rounded-lg bg-[#17243A] text-white flex items-center justify-between"
            >
              <span>{isAdmin ? 'Admin Panel' : 'Admin Login'}</span>
              <Shield className="w-3.5 h-3.5 text-[#16865D]" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
