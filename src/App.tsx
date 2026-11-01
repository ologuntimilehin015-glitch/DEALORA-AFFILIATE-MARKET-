import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProductProvider, useProducts } from './context/ProductContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategoryGrid } from './components/CategoryGrid';
import { FeaturedSection } from './components/FeaturedSection';
import { TrendingSection } from './components/TrendingSection';
import { LatestArrivals } from './components/LatestArrivals';
import { SpecialDealsSection } from './components/SpecialDealsSection';
import { AllProductsDirectory } from './components/AllProductsDirectory';
import { WhyDiscoverSection } from './components/WhyDiscoverSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { NewsletterSection } from './components/NewsletterSection';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { AdminAuthModal } from './components/admin/AdminAuthModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { InfoModals } from './components/InfoModals';
import { Product, ProductCategory } from './types';

const MainAppContent: React.FC = () => {
  const { isAdmin } = useAuth();
  const { setSelectedCategory, setSearchQuery } = useProducts();

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adminAuthOpen, setAdminAuthOpen] = useState(false);
  const [adminDashboardOpen, setAdminDashboardOpen] = useState(false);
  const [infoModal, setInfoModal] = useState<'privacy' | 'terms' | 'about' | 'contact' | null>(null);

  const handleOpenAdmin = () => {
    if (isAdmin) {
      setAdminDashboardOpen(true);
    } else {
      setAdminAuthOpen(true);
    }
  };

  const handleNavigateSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCategorySelect = (category: ProductCategory) => {
    setSelectedCategory(category);
    handleNavigateSection('all-products-section');
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#252525] flex flex-col font-sans-main selection:bg-[#16865D]/20 selection:text-[#17243A]">
      {/* Sticky Header */}
      <Header
        onOpenAdmin={handleOpenAdmin}
        onOpenAbout={() => setInfoModal('about')}
        onOpenContact={() => setInfoModal('contact')}
        onNavigateSection={handleNavigateSection}
      />

      <main className="flex-1">
        {/* 1. Hero Section */}
        <Hero
          onExploreProducts={() => handleNavigateSection('all-products-section')}
          onBrowseCategories={() => handleNavigateSection('categories-section')}
        />

        {/* 2. Visual Categories Grid */}
        <CategoryGrid onCategorySelect={handleCategorySelect} />

        {/* 3. Featured Products */}
        <FeaturedSection
          onSelectProduct={(p) => setSelectedProduct(p)}
          onViewAll={() => {
            setSelectedCategory('All');
            handleNavigateSection('all-products-section');
          }}
        />

        {/* 4. Trending Products */}
        <TrendingSection
          onSelectProduct={(p) => setSelectedProduct(p)}
          onViewAll={() => {
            setSelectedCategory('All');
            handleNavigateSection('all-products-section');
          }}
        />

        {/* 5. Latest Arrivals */}
        <LatestArrivals
          onSelectProduct={(p) => setSelectedProduct(p)}
          onViewAll={() => {
            setSelectedCategory('All');
            handleNavigateSection('all-products-section');
          }}
        />

        {/* 6. Special Deals Banner & Grid */}
        <SpecialDealsSection onSelectProduct={(p) => setSelectedProduct(p)} />

        {/* 7. All Products Directory with live search, category pills & price sorting */}
        <AllProductsDirectory onSelectProduct={(p) => setSelectedProduct(p)} />

        {/* 8. Why Discover with Dealora */}
        <WhyDiscoverSection />

        {/* 9. How It Works (3 Steps) */}
        <HowItWorksSection />

        {/* 10. Newsletter Section */}
        <NewsletterSection />

        {/* 11. Frequently Asked Questions */}
        <FAQSection onContactClick={() => setInfoModal('contact')} />
      </main>

      {/* 12. Footer */}
      <Footer
        onCategorySelect={handleCategorySelect}
        onNavigateSection={handleNavigateSection}
        onOpenPrivacy={() => setInfoModal('privacy')}
        onOpenTerms={() => setInfoModal('terms')}
        onOpenContact={() => setInfoModal('contact')}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Individual Dedicated Product Details Page / Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      {/* Protected Admin Auth Modal */}
      <AdminAuthModal
        isOpen={adminAuthOpen}
        onClose={() => setAdminAuthOpen(false)}
        onSuccess={() => {
          setAdminAuthOpen(false);
          setAdminDashboardOpen(true);
        }}
      />

      {/* Admin Dashboard */}
      <AdminDashboard
        isOpen={adminDashboardOpen}
        onClose={() => setAdminDashboardOpen(false)}
        onPreviewProduct={(p) => setSelectedProduct(p)}
      />

      {/* Informational Modals (About, Privacy, Terms, Contact) */}
      <InfoModals
        type={infoModal}
        onClose={() => setInfoModal(null)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <MainAppContent />
      </ProductProvider>
    </AuthProvider>
  );
}
