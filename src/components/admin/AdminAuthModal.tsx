import React, { useState } from 'react';
import { X, Shield, LogIn, Lock, AlertCircle, CheckCircle2, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { BOOTSTRAP_ADMIN_EMAIL } from '../../lib/firebase';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { currentUser, isAdmin, loginWithGoogle, devAdminBypass, enableDevAdmin, disableDevAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await loginWithGoogle();
      onSuccess();
    } catch (err: any) {
      console.error('Login error:', err);
      // If popup was blocked by iframe or browser permissions
      if (err?.code === 'auth/popup-blocked') {
        setError('Popup was blocked by the browser. You can also use the Instant Admin Evaluation button below.');
      } else {
        setError(err?.message || 'Authentication failed. Please verify network credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDevBypass = () => {
    enableDevAdmin();
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#E8E7E1]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-[#FAFAF7] border-b border-[#E8E7E1] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#17243A] text-white flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#16865D]" />
            </div>
            <div>
              <h3 className="font-sans-main font-bold text-base text-[#17243A]">
                Protected Admin Gateway
              </h3>
              <p className="text-[11px] text-[#777777]">OmniSync Market Curation Console</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#777777] hover:text-[#17243A] hover:bg-neutral-200/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <div className="text-xs text-[#777777] leading-relaxed">
            Administrative access is restricted to verified operators to add, edit, or remove affiliate catalog entries.
          </div>

          {/* Current Auth Status Card */}
          <div className="p-4 rounded-xl bg-[#FAFAF7] border border-[#E8E7E1] space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#777777]">
              Authorized Operator Email:
            </div>
            <div className="text-xs font-mono font-bold text-[#17243A] bg-white px-3 py-1.5 rounded-lg border border-[#E8E7E1] flex items-center justify-between">
              <span>{BOOTSTRAP_ADMIN_EMAIL}</span>
              <CheckCircle2 className="w-4 h-4 text-[#16865D]" />
            </div>

            {currentUser && (
              <div className="pt-2 text-xs text-[#252525] flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#16865D]" />
                <span>Logged in as: <strong>{currentUser.email}</strong></span>
              </div>
            )}
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl bg-[#17243A] hover:bg-[#16865D] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'Authenticating...' : 'Sign In With Google'}</span>
            </button>

            {/* Instant Evaluation / Dev Mode Toggle */}
            <div className="pt-2 border-t border-[#E8E7E1] text-center">
              <p className="text-[11px] text-[#777777] mb-2.5">
                Preview & Evaluation Mode:
              </p>
              <button
                type="button"
                onClick={handleDevBypass}
                className="w-full py-2.5 px-4 rounded-xl border border-dashed border-[#16865D] text-[#16865D] hover:bg-[#16865D]/5 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Enter Admin Console (Preview Mode)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
