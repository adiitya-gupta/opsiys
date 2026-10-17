import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, CheckCircle2, AlertCircle, X, ChevronDown, ShieldAlert, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

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
  onSave: (phone: string, countryCode: string) => Promise<void>;
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
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string>("");

  if (!isOpen) return null;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, ""); // Allow digits only
    // If India, limit to 10 digits
    if (selectedCountryCode === "+91" && rawVal.length > 10) return;
    setPhoneNumber(rawVal);
    if (validationError) setValidationError("");
  };

  const validatePhone = (): boolean => {
    if (!phoneNumber.trim()) {
      setValidationError("Phone number is required.");
      return false;
    }

    if (selectedCountryCode === "+91") {
      if (phoneNumber.length !== 10) {
        setValidationError("India phone number must be exactly 10 digits.");
        return false;
      }
      if (!/^[6-9]\d{9}$/.test(phoneNumber)) {
        setValidationError("Enter a valid 10-digit Indian mobile number.");
        return false;
      }
    } else {
      if (phoneNumber.length < 7 || phoneNumber.length > 15) {
        setValidationError("Please enter a valid phone number (7-15 digits).");
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
      await onSave(phoneNumber.trim(), selectedCountryCode);
      onClose();
    } catch (err: any) {
      setValidationError(err?.message || "Failed to save phone number. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="bg-white text-black max-w-lg w-full relative z-10 shadow-2xl border border-border p-6 sm:p-8 rounded-none overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-muted-foreground hover:text-black transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Partner Onboarding
              </span>
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight mb-2">
              Connect WhatsApp Number
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Welcome{userName ? `, ${userName}` : ""}! Link your direct WhatsApp phone number to enable real-time project updates, instant partner communications, and high-priority ticket support.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                <Phone size={12} /> WhatsApp Mobile Number
              </label>

              <div className="flex gap-2">
                {/* Country Code Dropdown */}
                <div className="relative w-36 shrink-0">
                  <select
                    value={selectedCountryCode}
                    onChange={(e) => {
                      setSelectedCountryCode(e.target.value);
                      if (validationError) setValidationError("");
                    }}
                    className="w-full h-10 px-3 pr-8 bg-zinc-50 border border-border text-xs font-mono font-bold appearance-none rounded-none focus:outline-none focus:ring-1 focus:ring-black cursor-pointer"
                  >
                    {COUNTRY_CODES.map((item) => (
                      <option key={item.code} value={item.code}>
                        {item.flag} {item.code} ({item.country})
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground"
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
                    className="rounded-none h-10 font-mono text-xs focus-visible:ring-1 focus-visible:ring-black"
                  />
                </div>
              </div>

              {validationError && (
                <p className="text-[11px] text-red-600 font-medium flex items-center gap-1.5 pt-1">
                  <AlertCircle size={12} /> {validationError}
                </p>
              )}
            </div>

            {/* Verification Notice Card */}
            <div className="p-3.5 bg-zinc-50 border border-zinc-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-600 flex items-center gap-1.5">
                  <ShieldAlert size={12} className="text-amber-500" /> Security Status
                </span>
                <Badge
                  variant="outline"
                  className="border-amber-300 bg-amber-50 text-amber-700 text-[10px] font-bold uppercase tracking-wider"
                >
                  Unverified Number
                </Badge>
              </div>
              <p className="text-[11px] text-zinc-500 leading-normal">
                This number will be stored in your secure profile. Numbers remain <span className="font-semibold text-zinc-700">Unverified</span> until confirmed through standard authentication protocol.
              </p>
            </div>

            {/* User Reference */}
            {userEmail && (
              <p className="text-[10px] text-zinc-400 font-mono">
                Linked Account: <span className="text-zinc-600">{userEmail}</span>
              </p>
            )}

            {/* Actions */}
            <div className="pt-2 border-t border-border flex flex-col-reverse sm:flex-row justify-between items-center gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="w-full sm:w-auto text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-black rounded-none"
              >
                Skip For Now
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting || !phoneNumber.trim()}
                className="w-full sm:w-auto bg-black text-white hover:bg-zinc-800 text-xs font-bold uppercase tracking-widest px-6 h-10 rounded-none shadow-md flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  "Saving..."
                ) : (
                  <>
                    Confirm & Save <ArrowRight size={14} />
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
