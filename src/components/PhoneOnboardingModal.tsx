import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, CheckCircle2, AlertCircle, X, ChevronDown, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface CountryCodeOption {
  code: string;
  country: string;
  flag: string;
}

export const COUNTRY_CODES: CountryCodeOption[] = [
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+1", country: "United States / Canada", flag: "🇺🇸" },
  { code: "+44", country: "United Kingdom", flag: "🇬🇧" },
  { code: "+971", country: "United Arab Emirates", flag: "🇦🇪" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+974", country: "Qatar", flag: "🇶🇦" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+41", country: "Switzerland", flag: "🇨🇭" },
  { code: "+31", country: "Netherlands", flag: "🇳🇱" },
  { code: "+353", country: "Ireland", flag: "🇮🇪" },
  { code: "+27", country: "South Africa", flag: "🇿🇦" },
];

interface PhoneOnboardingModalProps {
  isOpen: boolean;
  userEmail?: string;
  userName?: string;
  onSave: (phone: string, countryCode: string, company?: string) => Promise<void>;
  onClose: () => void;
}

export const PhoneOnboardingModal: React.FC<PhoneOnboardingModalProps> = ({
  isOpen,
  userEmail,
  userName,
  onSave,
  onClose,
}) => {
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("+91");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [company, setCompany] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string>("");

  if (!isOpen) return null;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, ""); // Digits only
    if (selectedCountryCode === "+91" && rawVal.length > 10) return;
    setPhoneNumber(rawVal);
    if (validationError) setValidationError("");
  };

  const validatePhone = (): boolean => {
    if (!phoneNumber.trim()) {
      setValidationError("Please enter your WhatsApp contact number.");
      return false;
    }

    if (selectedCountryCode === "+91") {
      if (phoneNumber.length !== 10) {
        setValidationError("Indian WhatsApp number must be exactly 10 digits.");
        return false;
      }
      if (!/^[6-9]\d{9}$/.test(phoneNumber)) {
        setValidationError("Please enter a valid 10-digit Indian mobile number.");
        return false;
      }
    } else {
      if (phoneNumber.length < 7 || phoneNumber.length > 15) {
        setValidationError("Please enter a valid mobile number (7-15 digits).");
        return false;
      }
    }

    setValidationError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePhone()) return;

    setIsSubmitting(true);
    try {
      await onSave(phoneNumber.trim(), selectedCountryCode, company.trim());
      onClose();
    } catch (err: any) {
      setValidationError(err?.message || "Failed to save contact number. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop matching OPSIYS style */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal card matching OPSIYS clean white design language */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-[160] w-full max-w-md bg-white border border-zinc-200 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.15)] rounded-3xl p-6 sm:p-10 text-center my-6 overflow-hidden space-y-6"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-500 hover:text-black flex items-center justify-center transition-all active:scale-95"
            aria-label="Close"
          >
            <X size={16} />
          </button>

          {/* OPSIYS circular branded badge */}
          <div className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center mx-auto shadow-xl ring-4 ring-zinc-50">
            <Phone size={22} className="text-white" />
          </div>

          {/* Header section */}
          <div className="space-y-2">
            <Badge className="bg-accent/10 text-accent hover:bg-accent/20 border-none px-3.5 py-1 rounded-full text-[9px] uppercase font-bold tracking-widest inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Partner Onboarding
            </Badge>

            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-black leading-tight">
              Connect <span className="text-accent">WhatsApp</span>
            </h2>

            <p className="text-xs text-zinc-500 font-medium leading-relaxed max-w-sm mx-auto">
              Link your WhatsApp contact to receive real-time project milestones, sprint updates, and direct coordination from our team.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {/* Phone Number Input Group */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 ml-1">
                  WhatsApp Mobile Number *
                </label>
                <span className="text-[9px] font-mono font-bold text-zinc-400">Default: India (+91)</span>
              </div>

              <div className="flex gap-2">
                {/* Country Code Dropdown */}
                <div className="relative w-28 shrink-0">
                  <select
                    value={selectedCountryCode}
                    onChange={(e) => {
                      setSelectedCountryCode(e.target.value);
                      if (validationError) setValidationError("");
                    }}
                    className="w-full h-12 px-3 pr-7 bg-zinc-50/70 border border-zinc-200 text-xs font-mono font-bold appearance-none rounded-xl focus:outline-none focus:border-black focus:bg-white transition-all cursor-pointer text-black"
                  >
                    {COUNTRY_CODES.map((item) => (
                      <option key={item.code} value={item.code}>
                        {item.flag} {item.code}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400"
                  />
                </div>

                {/* Number Input */}
                <div className="flex-1">
                  <Input
                    type="tel"
                    inputMode="numeric"
                    placeholder={selectedCountryCode === "+91" ? "98765 43210" : "Mobile number"}
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    className="rounded-xl h-12 border-zinc-200 bg-zinc-50/70 text-black placeholder:text-zinc-400 focus-visible:ring-black px-4 font-bold text-xs sm:text-sm font-mono transition-all focus-visible:bg-white"
                  />
                </div>
              </div>

              {validationError && (
                <p className="text-[10px] text-red-600 font-bold flex items-center gap-1.5 pt-1 pl-1">
                  <AlertCircle size={12} /> {validationError}
                </p>
              )}
            </div>

            {/* Optional Organization */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 ml-1">
                Company / Organization <span className="text-zinc-400 font-normal">(Optional)</span>
              </label>
              <Input
                placeholder="Acme Growth Systems"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="rounded-xl h-12 border-zinc-200 bg-zinc-50/70 text-black placeholder:text-zinc-400 focus-visible:ring-black px-4 font-bold text-xs sm:text-sm transition-all focus-visible:bg-white"
              />
            </div>

            {/* Account Reference Card */}
            {userEmail && (
              <div className="py-2.5 px-3.5 bg-zinc-50 rounded-xl border border-zinc-100 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                <span className="truncate max-w-[200px] font-medium">{userEmail}</span>
                <span className="text-accent font-bold flex items-center gap-1 uppercase text-[9px] tracking-wider">
                  <ShieldCheck size={12} /> Verified
                </span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 space-y-2.5">
              <Button
                type="submit"
                disabled={isSubmitting || !phoneNumber.trim()}
                className="w-full h-12 sm:h-14 rounded-full bg-black hover:bg-zinc-800 text-white font-extrabold text-xs uppercase tracking-[0.2em] shadow-xl hover:shadow-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  "Saving Details..."
                ) : (
                  <>
                    Confirm & Access Portal <ArrowRight size={14} />
                  </>
                )}
              </Button>

              <button
                type="button"
                onClick={onClose}
                className="w-full text-center text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400 hover:text-black transition-colors py-1.5"
              >
                Skip For Now & Continue
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
