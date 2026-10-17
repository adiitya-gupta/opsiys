import * as React from "react";
import { SEO } from "../components/SEO";
import { motion } from "motion/react";
import { 
  Phone, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Building2, 
  User, 
  CheckCircle2, 
  ChevronDown, 
  AlertCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { COUNTRY_CODES } from "../components/PhoneOnboardingModal";
import { signInWithGoogle, onAuthStateChanged, NormalizedUser, updateProfile } from "../lib/supabase";
import { submitLead } from "../lib/firebase";
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
  const [name, setName] = React.useState("");
  const [company, setCompany] = React.useState("");
  const [countryCode, setCountryCode] = React.useState("+91");
  const [phone, setPhone] = React.useState("");
  const [validationError, setValidationError] = React.useState("");
  const [user, setUser] = React.useState<NormalizedUser | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, "");
    if (countryCode === "+91" && rawVal.length > 10) return;
    setPhone(rawVal);
    if (validationError) setValidationError("");
  };

  const validate = (): boolean => {
    if (!phone.trim()) {
      setValidationError("Please enter your WhatsApp contact number.");
      return false;
    }

    if (countryCode === "+91") {
      if (phone.length !== 10) {
        setValidationError("Indian WhatsApp number must be exactly 10 digits.");
        return false;
      }
      if (!/^[6-9]\d{9}$/.test(phone)) {
        setValidationError("Please enter a valid 10-digit Indian mobile number.");
        return false;
      }
    } else {
      if (phone.length < 7 || phone.length > 15) {
        setValidationError("Please enter a valid mobile number (7-15 digits).");
        return false;
      }
    }

    setValidationError("");
    return true;
  };

  const handleGoogleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      // 1. Store pending onboarding details in sessionStorage so they are automatically
      // bound to the user's Supabase profile and lead record upon Google OAuth return
      sessionStorage.setItem("opsiys_pending_whatsapp_phone", phone.trim());
      sessionStorage.setItem("opsiys_pending_country_code", countryCode);
      if (name.trim()) sessionStorage.setItem("opsiys_pending_name", name.trim());
      if (company.trim()) sessionStorage.setItem("opsiys_pending_company", company.trim());

      // 2. If user is already authenticated, update directly
      if (user) {
        await updateProfile(user.id, {
          displayName: name.trim() || user.displayName,
          company: company.trim(),
          phone: phone.trim(),
          phoneCountryCode: countryCode,
          phoneVerified: false,
          email: user.email,
        });

        await submitLead({
          name: name.trim() || user.displayName,
          email: user.email,
          company: company.trim() || "Partner Onboarding",
          phone: `${countryCode} ${phone.trim()}`,
          projectType: "Partner Onboarding",
          userId: user.id,
          status: "qualified"
        });

        window.location.href = "/";
        return;
      }

      // 3. Initiate Google OAuth returning strictly to OPSIYS website
      await signInWithGoogle(`${window.location.origin}/`);
    } catch (err: any) {
      console.error(err);
      setValidationError(err?.message || "Sign-up failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-accent selection:text-white pt-24 pb-20">
      <SEO 
        title="Partner Onboarding & Signup | OPSIYS" 
        description="Join the OPSIYS partner ecosystem. Connect your WhatsApp contact number for real-time project updates and dedicated engineering support."
        canonical="https://www.opsiys.in/signup"
      />

      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Brand & Value Prop */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4">
              <Badge className="bg-accent/10 text-accent hover:bg-accent/20 border-none px-4 py-1.5 rounded-full text-[9px] uppercase font-bold tracking-widest inline-flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                Partner Ecosystem
              </Badge>

              <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9]">
                Join The <br />
                <span className="text-accent">Partner Network</span>
              </h1>

              <p className="text-zinc-500 text-sm md:text-lg font-medium leading-relaxed max-w-lg">
                Register your business to connect your project pipeline, access bespoke AI automation workflows, and receive direct WhatsApp sprint notifications from our solutions architect.
              </p>
            </div>

            {/* 3 Pillars matching OPSIYS layout */}
            <div className="space-y-4 pt-4 border-t border-zinc-100">
              {[
                { 
                  title: "Direct WhatsApp Sprint Sync", 
                  desc: "Milestone approvals, deployment logs, and priority updates sent directly to your mobile." 
                },
                { 
                  title: "Dedicated Leads & Growth Pipeline", 
                  desc: "Track client inquiries, submitted requirements, and project scope in real time." 
                },
                { 
                  title: "Single Sign-On Security", 
                  desc: "Fast, encrypted authentication powered by Supabase with Row Level Security." 
                }
              ].map((item, idx) => (
                <div key={item.title} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-xl bg-black text-white font-black text-xs flex items-center justify-center shrink-0">
                    0{idx + 1}
                  </div>
                  <div>
                    <h3 className="font-black uppercase text-xs tracking-tight">{item.title}</h3>
                    <p className="text-zinc-400 text-xs leading-normal">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: High-End OPSIYS Signup Form Card */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white border border-zinc-200 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.1)] p-8 sm:p-12 rounded-3xl relative space-y-6"
            >
              {/* Form Header */}
              <div className="text-center space-y-2">
                <div className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center mx-auto shadow-xl ring-4 ring-zinc-50">
                  <Sparkles size={22} className="text-accent" />
                </div>
                <h2 className="font-black text-2xl md:text-3xl tracking-tighter uppercase text-black">
                  Create Partner Profile
                </h2>
                <p className="text-xs text-zinc-500 font-medium">
                  Enter your details once. We will connect your WhatsApp to your Google account.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleGoogleSignup} className="space-y-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 ml-1">
                    Full Name / Contact Name
                  </label>
                  <Input
                    placeholder="Aditya Gupta"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-xl h-12 md:h-14 border-zinc-200 bg-zinc-50/70 text-black placeholder:text-zinc-400 focus-visible:ring-black px-4 font-bold text-xs md:text-sm transition-all focus-visible:bg-white"
                  />
                </div>

                {/* Company / Organization */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 ml-1">
                    Company / Organization
                  </label>
                  <Input
                    placeholder="Acme Growth Systems"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="rounded-xl h-12 md:h-14 border-zinc-200 bg-zinc-50/70 text-black placeholder:text-zinc-400 focus-visible:ring-black px-4 font-bold text-xs md:text-sm transition-all focus-visible:bg-white"
                  />
                </div>

                {/* WhatsApp Phone Number */}
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
                        value={countryCode}
                        onChange={(e) => {
                          setCountryCode(e.target.value);
                          if (validationError) setValidationError("");
                        }}
                        className="w-full h-12 md:h-14 px-3 pr-7 bg-zinc-50/70 border border-zinc-200 text-xs font-mono font-bold appearance-none rounded-xl focus:outline-none focus:border-black focus:bg-white transition-all cursor-pointer text-black"
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
                        placeholder={countryCode === "+91" ? "98765 43210" : "Mobile number"}
                        value={phone}
                        onChange={handlePhoneChange}
                        className="rounded-xl h-12 md:h-14 border-zinc-200 bg-zinc-50/70 text-black placeholder:text-zinc-400 focus-visible:ring-black px-4 font-bold text-xs md:text-sm tracking-wide font-mono transition-all focus-visible:bg-white"
                      />
                    </div>
                  </div>

                  {validationError && (
                    <p className="text-[10px] text-red-600 font-bold flex items-center gap-1.5 pt-1 pl-1">
                      <AlertCircle size={12} /> {validationError}
                    </p>
                  )}
                </div>

                {/* Submit with Google Button */}
                <div className="pt-3 space-y-3">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 md:h-14 rounded-full bg-black hover:bg-zinc-800 text-white font-extrabold text-xs uppercase tracking-[0.2em] shadow-xl hover:shadow-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    {isSubmitting ? "Connecting..." : "Continue with Google"}
                  </Button>

                  <p className="text-center text-[10px] text-zinc-400 font-medium leading-relaxed">
                    By signing up, you agree to receive project milestone alerts on WhatsApp. You can update or remove your number at any time in Account Settings.
                  </p>
                </div>
              </form>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
