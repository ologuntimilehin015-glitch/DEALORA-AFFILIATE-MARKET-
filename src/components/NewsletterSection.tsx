import React, { useState } from 'react';
import { Mail, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { subscribeToNewsletter } from '../services/productService';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@') || !email.includes('.')) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!consent) {
      setStatus('error');
      setErrorMessage('Please confirm your consent to receive updates before subscribing.');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      await subscribeToNewsletter(email.trim(), consent);
      setStatus('success');
      setEmail('');
    } catch (err) {
      console.error('Subscription error:', err);
      setStatus('error');
      setErrorMessage(
        'Subscription service could not be reached. Please check your network or try again shortly.'
      );
    }
  };

  return (
    <section className="py-16 md:py-20 bg-white border-t border-[#E8E7E1]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-[#FAFAF7] rounded-3xl p-8 sm:p-12 border border-[#E8E7E1] shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-[#17243A] text-white flex items-center justify-center mx-auto mb-6 shadow-md">
            <Mail className="w-6 h-6 text-[#16865D]" />
          </div>

          {/* Headline */}
          <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#17243A] tracking-tight mb-4">
            Good Finds Deserve to Be Shared.
          </h2>

          {/* Description */}
          <p className="text-xs sm:text-sm text-[#777777] max-w-xl mx-auto leading-relaxed mb-8">
            Get updates about new discoveries, useful resources and selected offers. Be the first to know when something interesting arrives.
          </p>

          {status === 'success' ? (
            <div className="p-6 rounded-2xl bg-[#16865D]/10 border border-[#16865D]/30 max-w-md mx-auto animate-fadeIn">
              <CheckCircle2 className="w-8 h-8 text-[#16865D] mx-auto mb-2" />
              <h4 className="font-sans-main font-bold text-sm text-[#17243A]">Subscription Confirmed</h4>
              <p className="text-xs text-[#777777] mt-1">
                Your email has been added to our curated discovery roster. You will only receive meaningful, hand-selected product updates.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === 'error') setStatus('idle');
                  }}
                  placeholder="Enter your primary email address..."
                  disabled={status === 'loading'}
                  className="flex-1 px-4 py-3 text-xs sm:text-sm bg-white border border-[#E8E7E1] rounded-xl text-[#252525] focus:outline-hidden focus:border-[#16865D] shadow-2xs"
                  required
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="px-6 py-3 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider text-white bg-[#17243A] hover:bg-[#16865D] transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Subscribing...</span>
                    </>
                  ) : (
                    <span>Subscribe</span>
                  )}
                </button>
              </div>

              {/* Privacy Consent Checkbox */}
              <div className="flex items-start gap-2.5 text-left pt-1">
                <input
                  type="checkbox"
                  id="newsletter-consent"
                  checked={consent}
                  onChange={(e) => {
                    setConsent(e.target.checked);
                    if (status === 'error') setStatus('idle');
                  }}
                  className="mt-0.5 rounded-sm border-[#E8E7E1] text-[#16865D] focus:ring-[#16865D]"
                />
                <label htmlFor="newsletter-consent" className="text-[11px] text-[#777777] leading-tight select-none cursor-pointer">
                  I agree to receive occasional curated product updates and verify that I have read the privacy disclosure. Unsubscribe anytime.
                </label>
              </div>

              {status === 'error' && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 text-left animate-fadeIn">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
