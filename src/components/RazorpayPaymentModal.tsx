import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  Smartphone, 
  Building2, 
  Receipt, 
  Sparkles,
  ArrowRight,
  Download,
  User,
  Mail,
  Phone,
  HelpCircle,
  Zap,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  initiateRazorpayPayment, 
  RazorpayPaymentSuccessPayload, 
  RazorpayCustomerDetails 
} from "../lib/razorpay";

export interface PackageItemForPayment {
  name: string;
  priceInINR: number;
  description: string;
  level: string;
  stage?: string;
  keyDeliverables?: string[];
}

interface RazorpayPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage: PackageItemForPayment | null;
}

export const RazorpayPaymentModal: React.FC<RazorpayPaymentModalProps> = ({
  isOpen,
  onClose,
  selectedPackage
}) => {
  const [customer, setCustomer] = useState<RazorpayCustomerDetails>({
    name: "",
    email: "",
    phone: "",
    company: "",
    gstin: ""
  });
  const [includeGst, setIncludeGst] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccessData, setPaymentSuccessData] = useState<{
    payload: RazorpayPaymentSuccessPayload;
    package: PackageItemForPayment;
    customer: RazorpayCustomerDetails;
    timestamp: string;
    totalAmount: number;
  } | null>(null);

  if (!isOpen || !selectedPackage) return null;

  const basePrice = selectedPackage.priceInINR;
  const gstAmount = includeGst ? Math.round(basePrice * 0.18) : 0;
  const totalAmount = basePrice + gstAmount;

  const handleInputChange = (field: keyof RazorpayCustomerDetails, value: string) => {
    setCustomer(prev => ({ ...prev, [field]: value }));
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.name.trim() || !customer.email.trim() || !customer.phone.trim()) {
      alert("Please fill in your Full Name, Email Address, and Phone Number to launch Razorpay Checkout.");
      return;
    }

    setIsProcessing(true);

    const success = await initiateRazorpayPayment({
      amountInINR: totalAmount,
      packageName: selectedPackage.name,
      customer,
      onSuccess: (payload) => {
        setIsProcessing(false);
        setPaymentSuccessData({
          payload,
          package: selectedPackage,
          customer,
          timestamp: new Date().toLocaleString("en-IN", {
            dateStyle: "full",
            timeStyle: "short"
          }),
          totalAmount
        });
      },
      onFailure: (err) => {
        setIsProcessing(false);
        console.warn("Payment checkout cancelled or failed:", err);
      }
    });

    if (!success) {
      setIsProcessing(false);
    }
  };

  const handleCloseModal = () => {
    setPaymentSuccessData(null);
    setIsProcessing(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleCloseModal}
          className="fixed inset-0 bg-black/85 backdrop-blur-xl"
        />

        {/* Main Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative z-[130] w-full max-w-4xl bg-[#0B0B0B] border border-white/15 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.8)] overflow-hidden my-auto text-white ring-1 ring-white/10"
        >
          {/* Top Bar */}
          <div className="px-6 py-4 border-b border-white/10 bg-black/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20 text-white">
                <Lock size={14} className="text-emerald-400" />
              </div>
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-zinc-300 block">
                  Secure Razorpay Gateway
                </span>
                <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  256-Bit SSL Encrypted Session
                </span>
              </div>
            </div>

            <button
              onClick={handleCloseModal}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white flex items-center justify-center transition-all active:scale-95"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>

          {/* Modal Body */}
          {paymentSuccessData ? (
            /* SUCCESS STATE RECEIPT */
            <div className="p-8 sm:p-12 space-y-8 text-center bg-gradient-to-b from-[#0B0B0B] to-black">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-20 h-20 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(52,211,153,0.3)]"
              >
                <CheckCircle2 size={44} />
              </motion.div>

              <div className="space-y-3">
                <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 uppercase tracking-widest font-mono text-xs px-3 py-1">
                  Payment Confirmed
                </Badge>
                <h3 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
                  Subscription Active!
                </h3>
                <p className="text-zinc-400 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
                  Thank you for subscribing to <strong className="text-white font-bold">{paymentSuccessData.package.name}</strong>. Our business growth engineering team has received your order and will contact you within 6 hours.
                </p>
              </div>

              {/* Digital Receipt Card */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left space-y-3 font-mono text-xs max-w-xl mx-auto backdrop-blur-md">
                <div className="flex justify-between pb-3 border-b border-white/10">
                  <span className="text-zinc-400 uppercase">Transaction ID:</span>
                  <span className="font-bold text-white tracking-wider">{paymentSuccessData.payload.razorpay_payment_id}</span>
                </div>
                {paymentSuccessData.payload.razorpay_order_id && (
                  <div className="flex justify-between pb-3 border-b border-white/10">
                    <span className="text-zinc-400 uppercase">Razorpay Order ID:</span>
                    <span className="font-bold text-zinc-300">{paymentSuccessData.payload.razorpay_order_id}</span>
                  </div>
                )}
                <div className="flex justify-between pb-3 border-b border-white/10">
                  <span className="text-zinc-400 uppercase">Total Amount Paid:</span>
                  <span className="font-extrabold text-emerald-400 text-base">₹{paymentSuccessData.totalAmount.toLocaleString("en-IN")} INR</span>
                </div>
                <div className="flex justify-between pb-3 border-b border-white/10">
                  <span className="text-zinc-400 uppercase">Client Name:</span>
                  <span className="font-bold text-white">{paymentSuccessData.customer.name}</span>
                </div>
                <div className="flex justify-between pb-3 border-b border-white/10">
                  <span className="text-zinc-400 uppercase">Email Contact:</span>
                  <span className="text-zinc-300">{paymentSuccessData.customer.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400 uppercase">Date &amp; Timestamp:</span>
                  <span className="text-zinc-400 text-[11px]">{paymentSuccessData.timestamp}</span>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => window.print()}
                  variant="outline"
                  className="rounded-full border-white/20 hover:bg-white/10 text-white font-bold uppercase tracking-wider text-xs h-12 px-8"
                >
                  <Download size={14} className="mr-2" /> Download Tax Invoice
                </Button>
                <Button 
                  onClick={handleCloseModal}
                  className="bg-white text-black hover:bg-zinc-200 rounded-full font-bold uppercase tracking-wider text-xs h-12 px-10 shadow-xl"
                >
                  Return to Dashboard
                </Button>
              </div>
            </div>
          ) : (
            /* CHECKOUT STEP FORM */
            <form onSubmit={handlePay} className="grid grid-cols-1 lg:grid-cols-12">
              {/* Left Column: Plan Summary */}
              <div className="lg:col-span-5 p-6 sm:p-8 bg-zinc-900/90 border-r border-white/10 space-y-6 flex flex-col justify-between">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Badge variant="outline" className="text-[10px] border-accent/40 text-accent bg-accent/10 uppercase tracking-widest font-mono">
                      Selected Plan
                    </Badge>
                    <h4 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white">
                      {selectedPackage.name}
                    </h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {selectedPackage.description}
                    </p>
                  </div>

                  {/* Price Calculation Card */}
                  <div className="bg-black/60 border border-white/10 rounded-2xl p-5 space-y-3 font-mono text-xs">
                    <div className="flex justify-between items-center text-zinc-400">
                      <span>Base Package Fee:</span>
                      <span className="text-white font-bold">₹{basePrice.toLocaleString("en-IN")}</span>
                    </div>

                    <div className="flex justify-between items-center text-zinc-400 pt-2 border-t border-white/10">
                      <label className="flex items-center gap-2 cursor-pointer select-none text-[11px]">
                        <input
                          type="checkbox"
                          checked={includeGst}
                          onChange={(e) => setIncludeGst(e.target.checked)}
                          className="rounded bg-zinc-800 border-zinc-700 text-accent focus:ring-0 w-3.5 h-3.5"
                        />
                        <span>Est. GST (18%):</span>
                      </label>
                      <span className="text-zinc-300">₹{gstAmount.toLocaleString("en-IN")}</span>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-white/15 text-sm font-bold">
                      <span className="text-white uppercase font-sans">Total Payable:</span>
                      <span className="text-xl font-extrabold text-emerald-400">
                        ₹{totalAmount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  {/* Highlights Bullet List */}
                  {selectedPackage.keyDeliverables && selectedPackage.keyDeliverables.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 block">
                        Included Deliverables:
                      </span>
                      <ul className="space-y-1.5">
                        {selectedPackage.keyDeliverables.slice(0, 4).map((d, i) => (
                          <li key={i} className="text-xs text-zinc-300 flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Trust Badge */}
                <div className="pt-6 border-t border-white/10 flex items-center gap-3">
                  <ShieldCheck size={28} className="text-emerald-400 shrink-0" />
                  <div className="text-[10px] text-zinc-400 leading-tight font-medium">
                    Backed by Opsiys 100% Satisfaction Guarantee. Instant digital invoice sent upon payment.
                  </div>
                </div>
              </div>

              {/* Right Column: Billing Information & Payment Launch */}
              <div className="lg:col-span-7 p-6 sm:p-8 space-y-6 flex flex-col justify-between bg-black/40">
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <h5 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-300 flex items-center gap-2">
                      <User size={14} className="text-accent" />
                      <span>Subscriber &amp; Billing Info</span>
                    </h5>
                    <span className="text-[9px] font-mono text-zinc-500">Step 1 of 2</span>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                        <User size={12} className="text-zinc-500" />
                        <span>Full Name</span> <span className="text-red-400">*</span>
                      </label>
                      <Input
                        type="text"
                        required
                        placeholder="e.g. Rahul Sharma"
                        value={customer.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="bg-white/5 border-white/15 focus-visible:border-white focus-visible:ring-0 text-white placeholder:text-zinc-600 text-xs h-11 rounded-xl"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                          <Mail size={12} className="text-zinc-500" />
                          <span>Email Address</span> <span className="text-red-400">*</span>
                        </label>
                        <Input
                          type="email"
                          required
                          placeholder="rahul@company.com"
                          value={customer.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          className="bg-white/5 border-white/15 focus-visible:border-white focus-visible:ring-0 text-white placeholder:text-zinc-600 text-xs h-11 rounded-xl"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                          <Phone size={12} className="text-zinc-500" />
                          <span>Phone (UPI/OTP)</span> <span className="text-red-400">*</span>
                        </label>
                        <Input
                          type="tel"
                          required
                          placeholder="9876543210"
                          value={customer.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          className="bg-white/5 border-white/15 focus-visible:border-white focus-visible:ring-0 text-white placeholder:text-zinc-600 text-xs h-11 rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                          <Building2 size={12} className="text-zinc-600" />
                          <span>Company Name</span> <span className="text-zinc-600 text-[9px]">(Optional)</span>
                        </label>
                        <Input
                          type="text"
                          placeholder="Acme Pvt Ltd"
                          value={customer.company}
                          onChange={(e) => handleInputChange("company", e.target.value)}
                          className="bg-white/5 border-white/15 focus-visible:border-white focus-visible:ring-0 text-white placeholder:text-zinc-600 text-xs h-11 rounded-xl"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                          <Receipt size={12} className="text-zinc-600" />
                          <span>GSTIN</span> <span className="text-zinc-600 text-[9px]">(Optional)</span>
                        </label>
                        <Input
                          type="text"
                          placeholder="07AAAAA0000A1Z5"
                          value={customer.gstin}
                          onChange={(e) => handleInputChange("gstin", e.target.value)}
                          className="bg-white/5 border-white/15 focus-visible:border-white focus-visible:ring-0 text-white placeholder:text-zinc-600 text-xs h-11 rounded-xl uppercase"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Method Badges */}
                  <div className="space-y-2 pt-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block">
                      Instant Payment Channels Supported:
                    </span>
                    <div className="flex flex-wrap gap-1.5 text-[10px] font-mono text-zinc-400">
                      <Badge variant="outline" className="border-white/15 bg-white/5 text-zinc-300 px-2.5 py-1">
                        Google Pay / PhonePe / Paytm
                      </Badge>
                      <Badge variant="outline" className="border-white/15 bg-white/5 text-zinc-300 px-2.5 py-1">
                        Credit &amp; Debit Cards
                      </Badge>
                      <Badge variant="outline" className="border-white/15 bg-white/5 text-zinc-300 px-2.5 py-1">
                        NetBanking
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Launch Action Button */}
                <div className="pt-6">
                  <Button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full h-14 bg-white text-black hover:bg-zinc-200 rounded-full font-extrabold text-xs sm:text-sm uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-3"
                  >
                    {isProcessing ? (
                      <span>Launching Razorpay Window...</span>
                    ) : (
                      <>
                        <CreditCard size={18} />
                        <span>Pay ₹{totalAmount.toLocaleString("en-IN")} via Razorpay</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
