import React, { useState } from 'react';
import { X, Mail, Send, CheckCircle2, ShieldCheck, FileText, Info } from 'lucide-react';

interface InfoModalProps {
  type: 'privacy' | 'terms' | 'about' | 'contact' | null;
  onClose: () => void;
}

export const InfoModals: React.FC<InfoModalProps> = ({ type, onClose }) => {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  if (!type) return null;

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    setContactSubmitted(true);
    setTimeout(() => {
      // keep message visible
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#E8E7E1] my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#FAFAF7] border-b border-[#E8E7E1]">
          <div className="flex items-center gap-2">
            {type === 'privacy' && <ShieldCheck className="w-5 h-5 text-[#16865D]" />}
            {type === 'terms' && <FileText className="w-5 h-5 text-[#16865D]" />}
            {type === 'about' && <Info className="w-5 h-5 text-[#16865D]" />}
            {type === 'contact' && <Mail className="w-5 h-5 text-[#16865D]" />}

            <h3 className="font-sans-main font-bold text-base text-[#17243A]">
              {type === 'privacy' && 'Privacy Policy'}
              {type === 'terms' && 'Terms and Conditions'}
              {type === 'about' && 'About OmniSync Market (Dealora)'}
              {type === 'contact' && 'Contact Editorial & Partnerships'}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#777777] hover:text-[#17243A] hover:bg-neutral-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto text-xs sm:text-sm text-[#252525] leading-relaxed space-y-4">
          {type === 'about' && (
            <div className="space-y-4">
              <p className="font-medium text-[#17243A] text-base">
                Discover More. Choose Better. Shop Smarter.
              </p>
              <p className="text-[#777777]">
                Dealora (OmniSync Market) was established with a singular mission: to restore discernment, editorial depth, and authentic curation to online product discovery.
              </p>
              <p className="text-[#777777]">
                The internet is inundated with repetitive generic storefronts and algorithmic spam. We operate differently. Our team rigorously evaluates digital learning blueprints, generative software suites, creator assets, and everyday tech equipment before featuring them in our catalog.
              </p>
              <h4 className="font-bold text-[#17243A] text-sm pt-2">Our Operating Standards:</h4>
              <ul className="list-disc pl-5 space-y-1.5 text-[#777777]">
                <li>Zero paid placements without independent verification of product merit.</li>
                <li>Direct links to authorized, legitimate merchant gateways.</li>
                <li>Uncompromising affiliate transparency under international FTC regulations.</li>
                <li>Ongoing curation sweeps to remove discontinued or degraded offers.</li>
              </ul>
            </div>
          )}

          {type === 'privacy' && (
            <div className="space-y-4 text-[#777777]">
              <p>
                <strong className="text-[#17243A]">Last updated: October 2026</strong>
              </p>
              <p>
                Dealora respects your personal privacy. We do not sell, rent, or trade visitor data to third-party data brokers.
              </p>
              <h4 className="font-bold text-[#17243A] text-xs uppercase tracking-wide">1. Information We Collect</h4>
              <p>
                When you browse our directory, standard anonymous telemetry (such as browser type, approximate geography, and pages viewed) may be logged solely to ensure platform stability. When you subscribe to our newsletter, we securely store your email address with explicit consent.
              </p>
              <h4 className="font-bold text-[#17243A] text-xs uppercase tracking-wide">2. Outbound Links & Third-Party Cookies</h4>
              <p>
                When you click an affiliate referral link, you navigate to an independent third-party website. That merchant may place standard attribution cookies on your browser to recognize Dealora as the referring publisher.
              </p>
              <h4 className="font-bold text-[#17243A] text-xs uppercase tracking-wide">3. Unsubscribing</h4>
              <p>
                You may revoke consent or unsubscribe from our curated newsletter at any time with one click via the footer link in any update email.
              </p>
            </div>
          )}

          {type === 'terms' && (
            <div className="space-y-4 text-[#777777]">
              <p>
                <strong className="text-[#17243A]">Terms of Use & Service</strong>
              </p>
              <p>
                By accessing and utilizing Dealora (OmniSync Market), you accept the following terms in their entirety:
              </p>
              <h4 className="font-bold text-[#17243A] text-xs uppercase tracking-wide">1. Nature of Directory Service</h4>
              <p>
                Dealora operates as an informational directory and referral service. We do not act as the vendor, merchant of record, or manufacturer of products linked on the site.
              </p>
              <h4 className="font-bold text-[#17243A] text-xs uppercase tracking-wide">2. Pricing & Availability</h4>
              <p>
                While we strive to ensure that all listed prices, discounts, and terms are accurate at the time of publication, merchant pricing is subject to independent vendor change. The price shown on the external seller checkout page represents the binding final cost.
              </p>
              <h4 className="font-bold text-[#17243A] text-xs uppercase tracking-wide">3. Warranties & Returns</h4>
              <p>
                Customer service requests, refunds, license keys, warranty claims, and shipping inquiries must be directed to the external seller through whom the purchase was made.
              </p>
            </div>
          )}

          {type === 'contact' && (
            <div>
              {contactSubmitted ? (
                <div className="py-8 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-[#16865D] mx-auto" />
                  <h4 className="font-bold text-base text-[#17243A]">Message Transmitted</h4>
                  <p className="text-xs text-[#777777] max-w-sm mx-auto">
                    Thank you for contacting the Dealora editorial desk. We have received your inquiry and will review your notes promptly.
                  </p>
                  <button
                    onClick={() => {
                      setContactSubmitted(false);
                      setContactForm({ name: '', email: '', subject: 'General Inquiry', message: '' });
                      onClose();
                    }}
                    className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#17243A] text-white hover:bg-[#16865D] transition-colors"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <p className="text-[#777777] text-xs">
                    Have a product suggestion, partnership inquiry, or question about a listing? Send a direct note to our team.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#17243A] mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        placeholder="Jane Doe"
                        className="w-full px-3 py-2 text-xs border border-[#E8E7E1] rounded-lg focus:outline-hidden focus:border-[#16865D]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#17243A] mb-1">Your Email</label>
                      <input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder="jane@example.com"
                        className="w-full px-3 py-2 text-xs border border-[#E8E7E1] rounded-lg focus:outline-hidden focus:border-[#16865D]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#17243A] mb-1">Inquiry Topic</label>
                    <select
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-[#E8E7E1] rounded-lg focus:outline-hidden focus:border-[#16865D]"
                    >
                      <option value="General Inquiry">General Discovery Question</option>
                      <option value="Product Suggestion">Suggest a New Product / Course / Tool</option>
                      <option value="Affiliate Partnership">Affiliate Partnership / Creator Request</option>
                      <option value="Correction Request">Listing Correction / Price Update</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#17243A] mb-1">Message</label>
                    <textarea
                      required
                      rows={4}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Please include full product links or partnership details..."
                      className="w-full px-3 py-2 text-xs border border-[#E8E7E1] rounded-lg focus:outline-hidden focus:border-[#16865D]"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 rounded-lg text-xs font-semibold text-[#777777] hover:text-[#17243A]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-bold text-white bg-[#17243A] hover:bg-[#16865D] transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Inquiry</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
