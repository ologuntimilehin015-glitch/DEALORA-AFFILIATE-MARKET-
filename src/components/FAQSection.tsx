import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

export const FAQSection: React.FC<{ onContactClick: () => void }> = ({ onContactClick }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: 'What is Dealora?',
      answer:
        'Dealora (operating as OmniSync Market) is an editorial-first affiliate product discovery directory. We discover, review, and organize high-yield digital tools, online courses, software applications, and everyday essentials so you can shop smarter and choose better from trusted creators and vendors.',
    },
    {
      question: 'How do I purchase a product?',
      answer:
        'When you find an item you are interested in, simply click the action button (such as "Explore Course", "Discover Tool", or "Shop Product"). You will be securely redirected to the official seller’s website or digital checkout page, where you complete your transaction directly under the seller’s standard terms.',
    },
    {
      question: 'Are products sold directly on Dealora?',
      answer:
        'No. Dealora is a curated discovery catalog and affiliate marketplace. We do not process payments, store physical inventory, or hold credit card details. All financial transactions, fulfillment, software licensing, and customer support are handled by the respective official vendors.',
    },
    {
      question: 'Do I pay extra when using affiliate links?',
      answer:
        'Never. When you click an affiliate link on Dealora, you pay the exact same price (and often receive exclusive discounts or promotional pricing negotiated specifically for our community). Dealora may receive a small commission from the merchant at zero extra expense to you.',
    },
    {
      question: 'How can I contact Dealora?',
      answer:
        'You can reach our editorial and partnership team anytime via our Contact form, or by emailing us directly at support@dealora-market.com. We respond to inquiries regarding listings, corrections, and affiliate collaborations within 24 to 48 hours.',
    },
    {
      question: 'How can I suggest a product?',
      answer:
        'We welcome suggestions from tool makers, course creators, and curious shoppers! Visit our Contact portal or submit your product proposal with the official website URL, category, and a brief overview of why it provides exceptional value to our community.',
    },
  ];

  const toggleItem = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq-section" className="py-16 md:py-24 bg-[#FAFAF7] border-t border-[#E8E7E1]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#16865D] mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            Clear Answers
          </div>
          <h2 className="font-editorial text-3xl md:text-4xl font-bold text-[#17243A]">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-[#777777] mt-3">
            Everything you need to know about navigating Dealora, affiliate transparency, and external purchases.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#E8E7E1] overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggleItem(idx)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-sans-main font-bold text-sm sm:text-base text-[#17243A] hover:text-[#16865D] transition-colors focus:outline-hidden"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#777777] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-[#16865D]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-[#777777] leading-relaxed border-t border-[#f0eee6] animate-fadeIn">
                    <p>{faq.answer}</p>
                    {idx === 4 && (
                      <button
                        onClick={onContactClick}
                        className="mt-3 text-xs font-bold text-[#16865D] hover:underline block"
                      >
                        Open Contact Form →
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
