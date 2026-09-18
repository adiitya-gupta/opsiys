import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { SEO } from "../components/SEO";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { RazorpayPaymentModal, PackageItemForPayment } from "../components/RazorpayPaymentModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Layers, 
  Globe, 
  TrendingUp, 
  Zap, 
  ChevronDown, 
  ChevronUp,
  MessageSquare,
  BarChart3,
  Bot,
  Calendar,
  ShieldAlert,
  HelpCircle,
  CreditCard,
  Lock,
  Check,
  Star,
  ShieldCheck,
  Percent
} from "lucide-react";

export const PACKAGES_DATA = [
  {
    id: "signature",
    level: "LEVEL 1",
    stage: "PRESENCE",
    name: "Opsiys Signature",
    price: "₹12,000",
    numericPrice: 12000,
    period: "/ month",
    annualPrice: "₹10,200",
    annualNumericPrice: 10200,
    annualTotal: "₹1,22,400",
    annualNumericTotal: 122400,
    annualSavingsNote: "Save ₹21,600 / yr (15% OFF)",
    positioning: "For established businesses seeking a polished, high-authority brand & social presence.",
    bestFor: "Established brands, professional service firms, executive profiles & growing businesses.",
    popular: false,
    badgeColor: "bg-zinc-100 text-zinc-800 border-zinc-200",
    accentColor: "border-zinc-300 hover:border-black",
    stats: [
      { label: "Social Platforms", value: "2" },
      { label: "Monthly Assets", value: "12" },
      { label: "Static Posts", value: "8" },
      { label: "Reels / Short Video", value: "4" }
    ],
    keyDeliverables: [
      "Monthly Content Calendar & Strategy",
      "Engaging Caption Writing & Formatting",
      "Basic Hashtag & Keyword Strategy",
      "Social Profile Optimization",
      "Basic Competitor Observation",
      "Basic Community Engagement",
      "Monthly Performance Report"
    ],
    details: {
      socialPlatforms: "2 Platforms (e.g. Instagram & Facebook)",
      assetsBreakdown: "12 Total Assets: 8 Static Posts + 4 Reels",
      websiteScope: "NOT INCLUDED",
      adsManagement: "Not included in Level 1",
      strategyMeeting: "Email & async performance summary"
    },
    adBudgetNotice: null
  },
  {
    id: "momentum",
    level: "LEVEL 2",
    stage: "VISIBILITY",
    name: "Opsiys Momentum",
    price: "₹22,000",
    numericPrice: 22000,
    period: "/ month",
    annualPrice: "₹18,700",
    annualNumericPrice: 18700,
    annualTotal: "₹2,24,400",
    annualNumericTotal: 224400,
    annualSavingsNote: "Save ₹39,600 / yr (15% OFF)",
    positioning: "For businesses looking to accelerate growth with unified social presence and modern web visibility.",
    bestFor: "Growing local companies, professional services & established brands.",
    popular: false,
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    accentColor: "border-blue-200 hover:border-blue-600",
    stats: [
      { label: "Social Platforms", value: "3" },
      { label: "Monthly Assets", value: "20" },
      { label: "Carousels", value: "6" },
      { label: "Website Pages", value: "4–5 Pages" }
    ],
    keyDeliverables: [
      "4–5 Page Modern Informational Website",
      "Home, About, Services/Products, Portfolio, Contact",
      "Responsive Mobile-Friendly UI Design",
      "WhatsApp Button & Contact Forms",
      "Google Maps & Social Links Integration",
      "Basic On-Page SEO & Analytics Setup",
      "20 Monthly Social Assets (8 Static, 6 Carousels, 6 Reels)"
    ],
    details: {
      socialPlatforms: "3 Platforms (Instagram, Facebook, LinkedIn/Google Business)",
      assetsBreakdown: "20 Assets: 8 Static + 6 Carousels + 6 Reels",
      websiteScope: "4–5 Page Static Informational Website (Home, About, Services, Contact, Gallery)",
      adsManagement: "Organic content focus (Ads setup available on Performance/Prime)",
      strategyMeeting: "Monthly WhatsApp/Email performance review"
    },
    adBudgetNotice: "Static informational site only. Custom e-commerce or booking apps are quoted separately."
  },
  {
    id: "performance",
    level: "LEVEL 3",
    stage: "ACQUISITION",
    name: "Opsiys Performance",
    price: "₹35,000",
    numericPrice: 35000,
    period: "/ month",
    annualPrice: "₹29,750",
    annualNumericPrice: 29750,
    annualTotal: "₹3,57,000",
    annualNumericTotal: 357000,
    annualSavingsNote: "Save ₹63,000 / yr (15% OFF)",
    positioning: "For high-growth businesses that demand visibility PLUS predictable lead acquisition.",
    bestFor: "Clinics, real estate firms, coaching centers & high-ticket service providers.",
    popular: true,
    badgeColor: "bg-emerald-500 text-white border-emerald-400",
    accentColor: "border-black shadow-2xl ring-2 ring-black",
    stats: [
      { label: "Social Platforms", value: "3" },
      { label: "Monthly Assets", value: "34" },
      { label: "Meta Ad Creatives", value: "6 / Mo" },
      { label: "Website Pages", value: "6–7 Pages" }
    ],
    keyDeliverables: [
      "Enhanced 6–7 Page Conversion Website",
      "Individual Service Pages & Testimonials",
      "Meta Ads Strategy, Setup & Lead Generation",
      "3 Active Campaign Structures + 6 Extra Ad Creatives",
      "Audience Targeting & Retargeting Setup",
      "Lead Qualification & WhatsApp Routing",
      "Technical SEO & Conversion Tracking"
    ],
    details: {
      socialPlatforms: "3 Major Social Channels",
      assetsBreakdown: "34 Total Content Assets: 8 Static + 8 Carousels + 12 Reels + 6 Ad Creatives",
      websiteScope: "Enhanced 6–7 Page Conversion Site (Service details, Testimonials, Multiple CTAs, Lead Forms)",
      adsManagement: "Meta Ads (Facebook & Instagram) strategy, setup, audience research & retargeting",
      strategyMeeting: "Monthly strategy alignment call"
    },
    adBudgetNotice: "Ad budget (₹20K–₹50K/mo) is paid directly by client to ad platforms (Meta) and kept separate from package price."
  },
  {
    id: "prime",
    level: "LEVEL 4",
    stage: "GROWTH SYSTEM",
    name: "Opsiys Prime",
    price: "₹55,000",
    numericPrice: 55000,
    period: "/ month",
    annualPrice: "₹46,750",
    annualNumericPrice: 46750,
    annualTotal: "₹5,61,000",
    annualNumericTotal: 561000,
    annualSavingsNote: "Save ₹99,000 / yr (15% OFF)",
    positioning: "For market leaders seeking autonomous growth systems, multi-channel marketing & custom AI workflows.",
    bestFor: "Established enterprises, multi-location brands & scaling companies.",
    popular: false,
    badgeColor: "bg-accent/20 text-accent border-accent/40",
    accentColor: "border-zinc-400 hover:border-black",
    stats: [
      { label: "Social Platforms", value: "4" },
      { label: "Monthly Assets", value: "48" },
      { label: "AI Workflows", value: "Up to 2" },
      { label: "Website Pages", value: "8–10 Pages" }
    ],
    keyDeliverables: [
      "Advanced Business Website (8–10 Pages)",
      "Dedicated Product/Solution & FAQ Pages",
      "Meta Ads & Google Ads Performance Marketing",
      "4 Social Platforms (40 Content Assets + 8 Ad Creatives)",
      "Up to 2 Practical AI & Automation Workflows/Month",
      "Basic CRM Integration & Automated Follow-Ups",
      "Monthly Live Strategy & Performance Session"
    ],
    details: {
      socialPlatforms: "4 Social Platforms",
      assetsBreakdown: "48 Total Assets: 8 Static + 8 Carousels + 16 Reels + 8 Ad Creatives",
      websiteScope: "Advanced 8–10 Page Business Site (Solutions, Testimonials, FAQ, Search Console, Speed Opt)",
      adsManagement: "Meta & Google Ads, retargeting, creative testing, up to 2 active campaign structures",
      strategyMeeting: "One monthly 1-on-1 growth strategy session with Opsiys leadership"
    },
    adBudgetNotice: "Excludes custom software apps & e-commerce backends. Ad spend billed directly by ad networks."
  }
];

export const COMPARISON_FEATURES = [
  { feature: "Monthly Price", signature: "₹12,000", momentum: "₹22,000", performance: "₹35,000", prime: "₹55,000" },
  { feature: "Social Platforms Managed", signature: "2", momentum: "3", performance: "3", prime: "4" },
  { feature: "Static Social Posts", signature: "8", momentum: "8", performance: "8", prime: "8" },
  { feature: "Carousel Posts", signature: "—", momentum: "6", performance: "8", prime: "8" },
  { feature: "Reels / Short Videos", signature: "4", momentum: "6", performance: "12", prime: "16" },
  { feature: "Extra Ad Creatives", signature: "—", momentum: "—", performance: "6 / mo", prime: "8 / mo" },
  { feature: "Total Monthly Content Assets", signature: "12 Assets", momentum: "20 Assets", performance: "34 Assets", prime: "48 Assets" },
  { feature: "Custom Business Website", signature: "—", momentum: "4–5 Pages", performance: "6–7 Pages", prime: "8–10 Pages" },
  { feature: "Responsive Mobile UI", signature: "—", momentum: "Included", performance: "Included", prime: "Included" },
  { feature: "WhatsApp & Contact Forms", signature: "—", momentum: "Included", performance: "Included", prime: "Included" },
  { feature: "On-Page Technical SEO", signature: "—", momentum: "Basic", performance: "Included", prime: "Advanced" },
  { feature: "Analytics & Tracking", signature: "Basic", momentum: "Included", performance: "Included", prime: "Advanced + Search Console" },
  { feature: "Meta Ads Management", signature: "—", momentum: "—", performance: "Included", prime: "Included" },
  { feature: "Google Ads Management", signature: "—", momentum: "—", performance: "—", prime: "Included" },
  { feature: "Lead Qualification & Funnel", signature: "—", momentum: "Basic", performance: "Included", prime: "Advanced" },
  { feature: "CRM Integration", signature: "—", momentum: "—", performance: "—", prime: "Basic CRM Pipeline" },
  { feature: "AI & Business Automation", signature: "—", momentum: "—", performance: "Basic Lead Flow", prime: "Up to 2 Workflows/mo" },
  { feature: "Monthly Strategy Session", signature: "—", momentum: "—", performance: "—", prime: "Included (Monthly)" }
];

export const PackagesPage: React.FC = () => {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [showTable, setShowTable] = useState(true);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [selectedStageFilter, setSelectedStageFilter] = useState<string | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPaymentPackage, setSelectedPaymentPackage] = useState<PackageItemForPayment | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const handleOpenPayment = (pkg: typeof PACKAGES_DATA[0]) => {
    const isAnnual = billingCycle === "annual";
    const rawPrice = isAnnual ? pkg.annualNumericTotal : pkg.numericPrice;
    
    setSelectedPaymentPackage({
      name: `${pkg.name} (${isAnnual ? "Annual Subscription — 12 Months Access" : "Monthly Subscription"})`,
      priceInINR: rawPrice,
      description: `${pkg.positioning} (${isAnnual ? `Annual Lump Sum: ${pkg.annualTotal} upfront with 15% discount` : `Billed monthly at ${pkg.price}/mo`})`,
      level: pkg.level,
      stage: pkg.stage,
      keyDeliverables: pkg.keyDeliverables,
      isAnnual: isAnnual
    });
    setPaymentModalOpen(true);
  };

  return (
    <>
      <SEO
        title="Opsiys Packages | Business Growth Plans & Pricing"
        description="Explore Opsiys growth packages for online presence, visibility, customer acquisition and growth systems, from Signature to Prime."
        canonical="https://opsiys.in/packages"
      />

      <RazorpayPaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        selectedPackage={selectedPaymentPackage}
      />

      <div className="bg-[#FAFAFA] min-h-screen pt-24 pb-16 text-[#0B0B0B]">
        <Breadcrumbs items={[{ label: "Packages & Pricing" }]} />

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 space-y-10">
          
          {/* PRICING PAGE HERO */}
          <div className="text-center sm:text-left space-y-4 max-w-4xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="rounded-full px-3 py-1 text-xs border-accent/20 text-accent bg-accent/5 font-mono uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>OPSIYS GROWTH PLANS</span>
              </Badge>
              <Badge variant="outline" className="rounded-full px-3 py-1 text-xs border-emerald-500/20 text-emerald-600 bg-emerald-500/5 font-mono uppercase tracking-widest flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Transparent Non-Negotiable Pricing</span>
              </Badge>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-tight text-black leading-none">
              Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-black via-zinc-800 to-zinc-500">Growth Stage.</span>
            </h1>

            <p className="text-zinc-600 text-sm sm:text-base font-medium leading-relaxed max-w-2xl">
              Start with signature presence. Accelerate visibility. Generate opportunities. Scale with autonomous systems.
            </p>

            {/* Interactive Billing Cycle Toggle & Stage Stepper */}
            <div className="pt-3 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white border border-zinc-200 rounded-2xl p-4 sm:p-5 shadow-sm">
              
              {/* Stage Stepper */}
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs font-bold">
                <span className="text-[10px] text-zinc-400 uppercase tracking-widest mr-1 block sm:inline">Stage Progression:</span>
                {[
                  { id: "signature", label: "1. SIGNATURE (₹12K)", color: "border-zinc-300 bg-zinc-100 text-black" },
                  { id: "momentum", label: "2. MOMENTUM (₹22K)", color: "border-blue-200 bg-blue-50 text-blue-800" },
                  { id: "performance", label: "3. PERFORMANCE (₹35K)", color: "border-emerald-500 bg-emerald-500 text-white" },
                  { id: "prime", label: "4. PRIME (₹55K)", color: "border-zinc-800 bg-zinc-900 text-white" }
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedStageFilter(selectedStageFilter === s.id ? null : s.id)}
                    className={`px-3 py-1.5 rounded-lg border transition-all active:scale-95 text-[11px] flex items-center gap-1 ${s.color} ${
                      selectedStageFilter === s.id ? "ring-2 ring-black scale-105 shadow-md" : "opacity-85 hover:opacity-100"
                    }`}
                  >
                    <span>{s.label}</span>
                  </button>
                ))}
              </div>

              {/* Annual Billing Toggle */}
              <div className="flex items-center gap-2 bg-zinc-100 p-1.5 rounded-xl border border-zinc-200 shrink-0 self-start sm:self-auto">
                <button
                  onClick={() => setBillingCycle("monthly")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                    billingCycle === "monthly" ? "bg-white text-black shadow-sm" : "text-zinc-500 hover:text-black"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle("annual")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition-all flex items-center gap-1.5 ${
                    billingCycle === "annual" ? "bg-black text-white shadow-sm" : "text-zinc-600 hover:text-black"
                  }`}
                >
                  <span>Annual</span>
                  <Badge className="bg-emerald-500 text-white border-none text-[9px] font-mono px-1.5 py-0.5">
                    Save 15%
                  </Badge>
                </button>
              </div>

            </div>
          </div>

          {/* PACKAGE CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 xl:gap-6 items-stretch">
            {PACKAGES_DATA.map((pkg, idx) => {
              const isExpanded = expandedCard === pkg.id;
              const isPopular = pkg.popular;
              const isSelectedStage = selectedStageFilter === pkg.id;
              const isAnnual = billingCycle === "annual";
              const displayPrice = isAnnual ? pkg.annualTotal : pkg.price;
              const displayPeriod = isAnnual ? "/ year" : pkg.period;

              return (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.06 }}
                  className={`relative rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 ${
                    isPopular 
                      ? "bg-[#0B0B0B] text-white border-2 border-emerald-500 shadow-2xl scale-[1.01] z-10" 
                      : "bg-white text-black border border-zinc-200 shadow-sm hover:border-black hover:shadow-lg"
                  } ${isSelectedStage ? "ring-2 ring-emerald-500" : ""}`}
                >
                  {/* Badge for Popular Option */}
                  {isPopular && (
                    <div className="bg-emerald-500 text-white text-[10px] font-mono font-extrabold uppercase tracking-widest text-center py-1.5 flex items-center justify-center gap-1.5">
                      <Star size={11} className="fill-white" />
                      <span>MOST POPULAR GROWTH STAGE</span>
                    </div>
                  )}

                  <div className="p-5 sm:p-6 space-y-4 flex-1">
                    {/* Level & Stage Badge */}
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-mono font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${pkg.badgeColor}`}>
                        {pkg.level} • {pkg.stage}
                      </span>
                      {isAnnual && (
                        <span className="text-[10px] font-mono text-emerald-500 font-bold flex items-center gap-0.5">
                          <Percent size={10} /> 15% SAVINGS
                        </span>
                      )}
                    </div>

                    {/* Package Name */}
                    <div className="space-y-1">
                      <h2 className="text-xl sm:text-2xl font-extrabold uppercase tracking-tight leading-tight">
                        {pkg.name}
                      </h2>
                      <p className={`text-xs leading-relaxed font-medium min-h-[36px] ${isPopular ? "text-zinc-300" : "text-zinc-500"}`}>
                        {pkg.positioning}
                      </p>
                    </div>

                    {/* Price Block */}
                    <div className="space-y-1 pt-2 border-t border-zinc-100/20">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl sm:text-4xl font-black tracking-tight">
                          {displayPrice}
                        </span>
                        <span className={`text-xs font-mono font-medium ${isPopular ? "text-zinc-400" : "text-zinc-500"}`}>
                          {displayPeriod}
                        </span>
                      </div>
                      {isAnnual ? (
                        <span className="text-[10px] text-emerald-400 font-mono font-bold block">
                          ₹{pkg.annualPrice}/mo billed annually • {pkg.annualSavingsNote}
                        </span>
                      ) : (
                        <span className="text-[10px] text-zinc-400 font-mono block">
                          Standard monthly billing • Cancel anytime
                        </span>
                      )}
                    </div>

                    {/* Key Stats Grid */}
                    <div className={`grid grid-cols-2 gap-2 p-2.5 rounded-2xl border text-center font-mono text-xs ${
                      isPopular ? "bg-zinc-900/90 border-zinc-800" : "bg-zinc-50 border-zinc-100"
                    }`}>
                      {pkg.stats.map((s, i) => (
                        <div key={i} className="p-1.5 bg-white/5 rounded-xl">
                          <span className="block font-black text-xs text-current">{s.value}</span>
                          <span className={`text-[8px] uppercase tracking-wider block ${isPopular ? "text-zinc-400" : "text-zinc-500"}`}>{s.label}</span>
                        </div>
                      ))}
                    </div>

                    {/* Deliverables Highlights */}
                    <div className="space-y-2 pt-1">
                      <span className={`text-[10px] font-mono font-bold uppercase tracking-widest block ${isPopular ? "text-zinc-400" : "text-zinc-500"}`}>
                        Included Deliverables:
                      </span>
                      <ul className="space-y-1.5">
                        {pkg.keyDeliverables.slice(0, 5).map((item, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-xs font-medium leading-snug">
                            <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isPopular ? "text-emerald-400" : "text-black"}`} />
                            <span className={isPopular ? "text-zinc-200" : "text-zinc-700"}>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Accordion Toggle for Full Details */}
                    <button
                      onClick={() => toggleExpand(pkg.id)}
                      className={`w-full py-1.5 flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider border-t transition-colors ${
                        isPopular 
                          ? "border-zinc-800 text-zinc-300 hover:text-white" 
                          : "border-zinc-100 text-zinc-600 hover:text-black"
                      }`}
                    >
                      <span>{isExpanded ? "Hide Details" : "View Full Details"}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {/* Expanded Details Content */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-3 pt-2 text-xs border-t border-dashed border-zinc-700/50"
                        >
                          <div className="space-y-0.5">
                            <span className="font-mono font-bold text-[9px] text-accent uppercase tracking-widest">BEST FOR:</span>
                            <p className={isPopular ? "text-zinc-300" : "text-zinc-600"}>{pkg.bestFor}</p>
                          </div>

                          <div className="space-y-0.5">
                            <span className="font-mono font-bold text-[9px] text-accent uppercase tracking-widest">WEBSITE SCOPE:</span>
                            <p className={isPopular ? "text-zinc-300" : "text-zinc-600"}>{pkg.details.websiteScope}</p>
                          </div>

                          <div className="space-y-0.5">
                            <span className="font-mono font-bold text-[9px] text-accent uppercase tracking-widest">ADS &amp; MARKETING:</span>
                            <p className={isPopular ? "text-zinc-300" : "text-zinc-600"}>{pkg.details.adsManagement}</p>
                          </div>

                          {pkg.adBudgetNotice && (
                            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] leading-relaxed">
                              <strong>Note:</strong> {pkg.adBudgetNotice}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Payment CTA */}
                  <div className="p-5 pt-0 space-y-2">
                    <Button
                      onClick={() => handleOpenPayment(pkg)}
                      className={`w-full h-11 font-extrabold uppercase tracking-widest text-xs rounded-full transition-all flex items-center justify-center gap-2 shadow-md active:scale-95 ${
                        isPopular
                          ? "bg-white text-black hover:bg-zinc-200 shadow-white/10"
                          : "bg-black text-white hover:bg-zinc-800"
                      }`}
                    >
                      <CreditCard size={15} />
                      <span>Pay {displayPrice}</span>
                    </Button>

                    <Link to={`/contact?package=${pkg.id}`} className="block text-center">
                      <Button
                        variant="ghost"
                        className={`w-full py-1.5 font-mono text-[10px] uppercase tracking-wider rounded-full h-7 ${
                          isPopular ? "text-zinc-400 hover:text-white" : "text-zinc-500 hover:text-black"
                        }`}
                      >
                        or Request Custom Strategy
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* GST & Invoicing Business Terms Disclaimer */}
          <div className="text-center font-mono text-[11px] text-zinc-500 max-w-3xl mx-auto pt-2 leading-relaxed">
            * All packages are billed upfront based on the selected billing cycle. Prices exclude 18% GST where applicable. Official Tax Invoices with GSTIN compliance are issued for all business orders to claim Input Tax Credit (ITC).
          </div>

          {/* SECTION 3 — FEATURE COMPARISON MATRIX */}
          <section className="space-y-6 pt-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-200 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-accent uppercase tracking-widest block">
                  [ DETAILED BREAKDOWN ]
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-black">
                  Package Comparison Matrix
                </h2>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowTable(!showTable)}
                className="font-mono text-xs font-bold uppercase tracking-widest border-zinc-300 text-black hover:border-black rounded-full"
              >
                {showTable ? "Hide Matrix" : "View Matrix"}
              </Button>
            </div>

            {showTable && (
              <div className="overflow-x-auto border border-zinc-200 rounded-2xl bg-white shadow-sm">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-zinc-900 text-white font-mono text-[11px] uppercase tracking-wider border-b border-zinc-800">
                      <th className="p-4 border-r border-zinc-800">Feature</th>
                      <th className="p-4 border-r border-zinc-800 text-center">Signature (₹12K)</th>
                      <th className="p-4 border-r border-zinc-800 text-center">Momentum (₹22K)</th>
                      <th className="p-4 border-r border-zinc-800 text-center bg-accent text-white">Performance (₹35K)</th>
                      <th className="p-4 text-center">Prime (₹55K)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 font-medium">
                    {COMPARISON_FEATURES.map((row, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-zinc-50/50"}>
                        <td className="p-4 border-r border-zinc-200 font-bold text-black">{row.feature}</td>
                        <td className="p-4 border-r border-zinc-200 text-center">{row.signature}</td>
                        <td className="p-4 border-r border-zinc-200 text-center">{row.momentum}</td>
                        <td className="p-4 border-r border-zinc-200 text-center font-bold text-black bg-accent/5">{row.performance}</td>
                        <td className="p-4 text-center font-bold text-black">{row.prime}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* SECTION 4 — CUSTOM PLAN & STRATEGY CTA BANNER */}
          <div className="bg-black text-white rounded-3xl p-8 sm:p-14 text-center sm:text-left grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="lg:col-span-8 space-y-4 relative z-10">
              <Badge variant="outline" className="text-emerald-400 border-emerald-400/30 bg-emerald-400/10 uppercase tracking-widest font-mono text-xs">
                Need a Custom Solution?
              </Badge>
              <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white">
                Not sure where to start?
              </h2>
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-medium max-w-xl">
                Tell us where your business is today and we'll help you identify the right growth stage and custom deliverable mix.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 relative z-10">
              <Link to="/contact">
                <Button size="lg" className="w-full bg-white text-black hover:bg-zinc-200 font-extrabold uppercase tracking-widest text-xs h-14 rounded-full shadow-xl">
                  Talk to Opsiys <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/discovery">
                <Button size="lg" className="w-full border-2 border-white/40 text-white bg-white/10 hover:bg-white/20 font-extrabold uppercase tracking-widest text-xs h-14 rounded-full shadow-lg">
                  Request Custom Plan
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default PackagesPage;
