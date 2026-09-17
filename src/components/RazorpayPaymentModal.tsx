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
  Download
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
  const [customAmount, setCustomAmount] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccessData, setPaymentSuccessData] = useState<{
    payload: RazorpayPaymentSuccessPayload;
    package: PackageItemForPayment;
    customer: RazorpayCustomerDetails;
    timestamp: string;
  } | null>(null);

  if (!isOpen || !selectedPackage) return null;

  const activeAmount = customAmount !== null ? customAmount : selectedPackage.priceInINR;

  const handleInputChange = (field: keyof RazorpayCustomerDetails, value: string) => {
    setCustomer(prev => ({ ...prev, [field]: value }));
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.name || !customer.email || !customer.phone) {
      alert("Please fill in your Name, Email, and Phone Number to proceed.");
      return;
    }

    setIsProcessing(true);

    const success = await initiateRazorpayPayment({
      amountInINR: activeAmount,
      packageName: selectedPackage.name,
      customer,
      onSuccess: (payload) => {
        setIsProcessing(false);
        setPaymentSuccessData({
          payload,
          package: selectedPackage,
          customer,
          timestamp: new Date().toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short"
          })
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
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleCloseModal}
          className="fixed inset-0 bg-black/70 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative z-[120] w-full max-w-2xl bg-white border border-zinc-200 rounded-2xl shadow-2xl overflow-hidden my-auto text-black"
        >
          {/* Header */}
          <div className="bg-[#0B0B0B] text-white p-6 sm:p-8 flex items-center justify-between border-b border-zinc-800">
            <div className="space-y-1 text-left">
              <Badge variant="outline" className="text-[9px] border-accent/40 text-accent bg-accent/10 uppercase tracking-widest font-mono">
                Official Razorpay Checkout
              </Badge>
              <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2">
                <span>Subscribe to {selectedPackage.name}</span>
              </h3>
              <p className="text-zinc-400 text-xs font-medium">
                {selectedPackage.description}
              </p>
            </div>
            <button
              onClick={handleCloseModal}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white flex items-center justify-center transition-colors shrink-0"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body Content */}
          {paymentSuccessData ? (
            /* SUCCESS STATE RECEIPT */
            <div className="p-6 sm:p-10 space-y-6 text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 size={36} />
              </div>

              <div className="space-y-2">
                <h4 className="text-2xl font-black uppercase tracking-tight text-black">
                  Payment Successful!
                </h4>
                <p className="text-zinc-600 text-xs sm:text-sm max-w-md mx-auto">
                  Thank you for subscribing to <strong className="text-black">{paymentSuccessData.package.name}</strong>. Our business growth team has received your order and will contact you within 6 hours.
                </p>
              </div>

              {/* Receipt Summary Card */}
              <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5 text-left space-y-3 font-mono text-xs">
                <div className="flex justify-between pb-2 border-b border-zinc-200">
                  <span className="text-zinc-500 uppercase">Payment ID:</span>
                  <span className="font-bold text-black">{paymentSuccessData.payload.razorpay_payment_id}</span>
                </div>
                {paymentSuccessData.payload.razorpay_order_id && (
                  <div className="flex justify-between pb-2 border-b border-zinc-200">
                    <span className="text-zinc-500 uppercase">Order ID:</span>
                    <span className="font-bold text-black">{paymentSuccessData.payload.razorpay_order_id}</span>
                  </div>
                )}
                <div className="flex justify-between pb-2 border-b border-zinc-200">
                  <span className="text-zinc-500 uppercase">Amount Paid:</span>
                  <span className="font-extrabold text-emerald-600 text-sm">₹{paymentSuccessData.package.priceInINR.toLocaleString("en-IN")} INR</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-zinc-200">
                  <span className="text-zinc-500 uppercase">Subscriber:</span>
                  <span className="font-bold text-black">{paymentSuccessData.customer.name} ({paymentSuccessData.customer.email})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 uppercase">Date &amp; Time:</span>
                  <span className="text-zinc-700">{paymentSuccessData.timestamp}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  onClick={() => window.print()}
                  variant="outline"
                  className="rounded-none border-zinc-300 font-bold uppercase tracking-wider text-xs h-11"
                >
                  <Download size={14} className="mr-2" /> Download Receipt
                </Button>
                <Button 
                  onClick={handleCloseModal}
                  className="bg-black text-white hover:bg-zinc-800 rounded-none font-bold uppercase tracking-wider text-xs h-11 px-8"
                >
                  Return to Opsiys
                </Button>
              </div>
            </div>
          ) : (
            /* CHECKOUT FORM */
            <form onSubmit={handlePay} className="p-6 sm:p-8 space-y-6 text-left">
              {/* Pricing Callout */}
              <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-accent tracking-widest block">
                    {selectedPackage.level}
                  </span>
                  <h4 className="text-lg font-bold uppercase tracking-tight text-black">
                    {selectedPackage.name}
                  </h4>
                </div>

                <div className="text-right">
                  <span className="text-2xl font-black tracking-tight text-black">
                    ₹{activeAmount.toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs text-zinc-500 block font-medium">/ month + GST</span>
                </div>
              </div>

              {/* Billing Customer Details */}
              <div className="space-y-4">
                <h5 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-500 border-b border-zinc-100 pb-2 flex items-center justify-between">
                  <span>Billing &amp; Contact Details</span>
                  <span className="text-[9px] text-zinc-400 font-sans">100% Encrypted &amp; Secure</span>
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-700">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      required
                      placeholder="e.g. Vikram Sharma"
                      value={customer.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="rounded-none border-zinc-300 focus-visible:ring-black text-xs h-10"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-700">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="email"
                      required
                      placeholder="e.g. vikram@company.com"
                      value={customer.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="rounded-none border-zinc-300 focus-visible:ring-black text-xs h-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-700">
                      Mobile Number (UPI/OTP) <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={customer.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="rounded-none border-zinc-300 focus-visible:ring-black text-xs h-10"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-700">
                      Company / Organization <span className="text-zinc-400 font-normal">(Optional)</span>
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. Acma Enterprises"
                      value={customer.company}
                      onChange={(e) => handleInputChange("company", e.target.value)}
                      className="rounded-none border-zinc-300 focus-visible:ring-black text-xs h-10"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-700">
                    GSTIN Number <span className="text-zinc-400 font-normal">(Optional for Tax Invoice)</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. 07AAAAA0000A1Z5"
                    value={customer.gstin}
                    onChange={(e) => handleInputChange("gstin", e.target.value)}
                    className="rounded-none border-zinc-300 focus-visible:ring-black text-xs h-10 uppercase"
                  />
                </div>
              </div>

              {/* Supported Payment Options & Security Badge */}
              <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wide text-zinc-700">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-emerald-600" />
                    <span>Supported Payment Methods</span>
                  </span>
                  <span className="text-[9px] font-mono text-zinc-400">Razorpay 256-Bit SSL</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-zinc-500 pt-1">
                  <Badge variant="outline" className="bg-white border-zinc-200 text-zinc-700">UPI (GPay / PhonePe / Paytm)</Badge>
                  <Badge variant="outline" className="bg-white border-zinc-200 text-zinc-700">Credit &amp; Debit Cards</Badge>
                  <Badge variant="outline" className="bg-white border-zinc-200 text-zinc-700">NetBanking (50+ Banks)</Badge>
                  <Badge variant="outline" className="bg-white border-zinc-200 text-zinc-700">Wallets</Badge>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full h-14 bg-black text-white hover:bg-zinc-800 rounded-none font-bold text-sm uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-3"
                >
                  {isProcessing ? (
                    <span>Launching Razorpay Checkout...</span>
                  ) : (
                    <>
                      <Lock size={16} />
                      <span>Proceed to Pay ₹{activeAmount.toLocaleString("en-IN")}</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
