import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { SEO } from "../components/SEO";
import { Breadcrumbs } from "../components/Breadcrumbs";
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
  HelpCircle
} from "lucide-react";

export const PACKAGES_DATA = [
  {
    id: "start",
    level: "LEVEL 1",
    name: "Opsiys Start",
    price: "₹12,000",
    period: "/ month",
    stage: "PRESENCE",
    positioning: "For businesses that need a consistent and professional social presence.",
    bestFor: "New businesses, Local businesses, Startups, Personal brands",
    stats: [
      { label: "Social Platforms", value: "2" },
      { label: "Monthly Assets", value: "12" },
      { label: "Static Posts", value: "8" },
      { label: "Reels / Videos", value: "4" }
    ],
    websiteIncluded: false,
    websiteSummary: "NOT INCLUDED",
    keyDeliverables: [
      "Monthly Content Calendar & Planning",
      "Engaging Caption Writing & Formatting",
      "Basic Hashtag & Keyword Strategy",
      "Social Profile Optimization",
      "Basic Competitor Observation",
      "Basic Community Engagement",
      "Monthly Performance Summary Report"
    ],
    details: {
      socialPlatforms: "2 Platforms (e.g. Instagram & Facebook / LinkedIn)",
      contentAssets: "12 Total Assets / Month (8 Static Posts + 4 Reels)",
      websiteScope: "None (Social Media Focus Only)",
      adsManagement: "Not Included",
      leadInfrastructure: "Social Direct Inquiries Only",
      automation: "Not Included"
    }
  },
  {
    id: "grow",
    level: "LEVEL 2",
    name: "Opsiys Grow",
    price: "₹22,000",
    period: "/ month",
    stage: "VISIBILITY",
    positioning: "For businesses that need visibility across both social media and the web.",
    bestFor: "Growing local practices, Professional services, Expanding clinics",
    stats: [
      { label: "Social Platforms", value: "3" },
      { label: "Monthly Assets", value: "20" },
      { label: "Carousels", value: "6" },
      { label: "Website", value: "4–5 Pages" }
    ],
    websiteIncluded: true,
    websiteSummary: "4–5 Page Static Website Included",
    keyDeliverables: [
      "4–5 Page Modern Informational Website",
      "Home, About, Services/Products, Portfolio, Contact",
      "Responsive Mobile-Friendly UI Design",
      "WhatsApp Instant Button & Contact Forms",
      "Google Maps & Social Links Integration",
      "Basic On-Page SEO & Web Analytics",
      "3 Social Platforms (20 Content Assets / Month)",
      "8 Static Posts, 6 Carousels, 6 Reels"
    ],
    details: {
      socialPlatforms: "3 Platforms (Instagram, Facebook, LinkedIn)",
      contentAssets: "20 Total Assets / Month (8 Static + 6 Carousels + 6 Reels)",
      websiteScope: "4–5 Page Static Informational Website (Home, About, Services, Gallery, Contact)",
      adsManagement: "Not Included",
      leadInfrastructure: "Website Contact Forms & WhatsApp Button",
      automation: "Basic Form Routing"
    }
  },
  {
    id: "scale",
    level: "LEVEL 3",
    name: "Opsiys Scale",
    price: "₹35,000",
    period: "/ month",
    stage: "ACQUISITION",
    popular: true,
    positioning: "For businesses that want visibility PLUS customer acquisition.",
    bestFor: "Real estate firms, High-volume clinics, B2B services, Education institutes",
    stats: [
      { label: "Social Platforms", value: "3" },
      { label: "Monthly Assets", value: "34" },
      { label: "Meta Ad Campaigns", value: "3" },
      { label: "Website", value: "6–7 Pages" }
    ],
    websiteIncluded: true,
    websiteSummary: "6–7 Page Enhanced Website Included",
    keyDeliverables: [
      "Enhanced 6–7 Page Conversion Website",
      "Individual Service Detail & Testimonial Pages",
      "Meta Ads Strategy, Setup & Lead Generation",
      "3 Active Campaign Structures + 6 Extra Ad Creatives",
      "Audience Targeting & Retargeting Setup",
      "Instant WhatsApp Lead Forms & Qualification",
      "3 Social Platforms (28 Content Assets / Month)",
      "8 Static Posts, 8 Carousels, 12 Reels"
    ],
    adBudgetNotice: "Recommended ad budget: ₹20,000–₹50,000/month (paid directly by client to advertising platform).",
    details: {
      socialPlatforms: "3 Platforms (Instagram, Facebook, LinkedIn)",
      contentAssets: "34 Total Assets (28 Organic: 8 Static, 8 Carousels, 12 Reels + 6 Extra Ad Creatives)",
      websiteScope: "6–7 Page Conversion Website with Service Detail & Lead Tracking",
      adsManagement: "Meta Ads (Strategy, Setup, Lead-Gen, Retargeting, Creative Testing)",
      leadInfrastructure: "Lead Forms, WhatsApp CTA, Basic Funnel Review",
      automation: "Basic Lead Notifications & Tracking"
    }
  },
  {
    id: "growth-engine",
    level: "LEVEL 4",
    name: "Opsiys Growth Engine",
    price: "₹55,000",
    period: "/ month",
    stage: "GROWTH SYSTEM",
    positioning: "For businesses that want Opsiys to manage their broader digital growth system.",
    bestFor: "Established brands, Multi-location businesses, Enterprise advisory",
    stats: [
      { label: "Social Platforms", value: "4" },
      { label: "Monthly Assets", value: "48" },
      { label: "AI Workflows", value: "Up to 2" },
      { label: "Website", value: "8–10 Pages" }
    ],
    websiteIncluded: true,
    websiteSummary: "8–10 Page Advanced Business Website Included",
    keyDeliverables: [
      "Advanced Business Website (8–10 Pages)",
      "Dedicated Product/Solution & FAQ Pages",
      "Meta Ads & Google Ads Performance Marketing",
      "4 Social Platforms (40 Content Assets + 8 Ad Creatives)",
      "Up to 2 Practical AI & Automation Workflows/Month",
      "Lead Qualification, CRM Integration & Tracking",
      "Monthly Executive Growth & Strategy Session",
      "Search Console & Speed Optimization"
    ],
    adBudgetNotice: "Ad budget is paid directly to platforms. Excludes e-commerce & custom web apps.",
    details: {
      socialPlatforms: "4 Platforms (Instagram, Facebook, LinkedIn, YouTube/X)",
      contentAssets: "48 Total Assets (40 Organic: 8 Static, 8 Carousels, 16 Reels + 8 Ad Creatives)",
      websiteScope: "8–10 Page Advanced Business Website with Speed & Analytics Optimization",
      adsManagement: "Meta Ads & Google Ads (Search, Retargeting, Weekly Optimization)",
      leadInfrastructure: "WhatsApp Workflows, CRM Integration, Lead Qualification",
      automation: "Up to 2 AI Workflows (FAQ Bot, Lead Alert, Auto Follow-up)"
    }
  }
];

export const COMPARISON_TABLE = [
  { feature: "Monthly Package Investment", start: "₹12,000/mo", grow: "₹22,000/mo", scale: "₹35,000/mo", engine: "₹55,000/mo" },
  { feature: "Core Focus", start: "Presence", grow: "Presence + Web", scale: "Acquisition + Leads", engine: "Full Growth System" },
  { feature: "Social Media Platforms", start: "2 Platforms", grow: "3 Platforms", scale: "3 Platforms", engine: "4 Platforms" },
  { feature: "Static Posts / Month", start: "8 Posts", grow: "8 Posts", scale: "8 Posts", engine: "8 Posts" },
  { feature: "Carousel Posts / Month", start: "—", grow: "6 Carousels", scale: "8 Carousels", engine: "8 Carousels" },
  { feature: "Reels / Video Assets", start: "4 Reels", grow: "6 Reels", scale: "12 Reels", engine: "16 Reels" },
  { feature: "Dedicated Ad Creatives", start: "—", grow: "—", scale: "6 Ad Creatives", engine: "8 Ad Creatives" },
  { feature: "Total Content Assets", start: "12 Assets", grow: "20 Assets", scale: "34 Assets", engine: "48 Assets" },
  { feature: "Website Development", start: "Not Included", grow: "4–5 Pages (Static)", scale: "6–7 Pages (Conversion)", engine: "8–10 Pages (Advanced)" },
  { feature: "Mobile Responsive UI", start: "—", grow: "Included", scale: "Included", engine: "Included" },
  { feature: "WhatsApp & Contact Forms", start: "—", grow: "Included", scale: "Included", engine: "Included" },
  { feature: "Basic On-Page SEO", start: "—", grow: "Included", scale: "Included", engine: "Technical & Speed" },
  { feature: "Web Analytics Setup", start: "Basic", grow: "Included", scale: "Included", engine: "Advanced" },
  { feature: "Meta Ads Management", start: "—", grow: "—", scale: "Included", engine: "Included" },
  { feature: "Google Ads Setup", start: "—", grow: "—", scale: "—", engine: "Included" },
  { feature: "Lead Qualification & Funnel", start: "—", grow: "Basic", scale: "Included", engine: "Advanced" },
  { feature: "CRM Integration", start: "—", grow: "—", scale: "—", engine: "Basic CRM Pipeline" },
  { feature: "AI & Business Automation", start: "—", grow: "—", scale: "Basic Lead Flow", engine: "Up to 2 Workflows/mo" },
  { feature: "Monthly Strategy Session", start: "—", grow: "—", scale: "—", engine: "Included (Monthly)" }
];

export const PackagesPage: React.FC = () => {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [showTable, setShowTable] = useState(true);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPaymentPackage, setSelectedPaymentPackage] = useState<PackageItemForPayment | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const handleOpenPayment = (pkg: typeof PACKAGES_DATA[0]) => {
    // Extract numeric price from string e.g. "₹12,000" -> 12000
    const rawPrice = parseInt(pkg.price.replace(/[^\d]/g, ""), 10) || 12000;
    setSelectedPaymentPackage({
      name: pkg.name,
      priceInINR: rawPrice,
      description: pkg.positioning,
      level: pkg.level
    });
    setPaymentModalOpen(true);
  };

  return (
    <>
      <SEO
        title="Opsiys Packages | Business Growth Plans & Pricing"
        description="Explore Opsiys growth packages for online presence, visibility, customer acquisition and growth systems, from Start to Growth Engine."
        canonical="https://opsiys.in/packages"
      />

      <RazorpayPaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        selectedPackage={selectedPaymentPackage}
      />

      <div className="bg-[#FAFAFA] min-h-screen pt-28 pb-20 overflow-hidden">
        <Breadcrumbs items={[{ label: "Packages & Pricing" }]} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 space-y-16">
          
          {/* PRICING PAGE HERO */}
          <div className="text-left space-y-6 max-w-4xl">
            <Badge variant="outline" className="rounded-full px-3 py-1 text-xs border-accent/20 text-accent bg-accent/5 font-mono uppercase tracking-widest flex items-center gap-1.5 w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              <span>OPSIYS PACKAGES</span>
            </Badge>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold uppercase tracking-tight text-black leading-tight">
              Choose Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-black via-zinc-800 to-zinc-500">
                Growth Stage.
              </span>
            </h1>

            <p className="text-zinc-600 text-base sm:text-xl font-medium leading-relaxed">
              Start with presence. Build visibility. Generate opportunities. Scale with systems.
            </p>

            {/* Visual Progression Step Bar */}
            <div className="pt-4 flex flex-wrap items-center gap-2 font-mono text-xs font-bold text-zinc-600">
              <div className="px-3 py-1.5 rounded-lg bg-zinc-100 border border-zinc-200 text-black flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-zinc-400" />
                <span>1. PRESENCE (₹12K)</span>
              </div>
              <span>→</span>
              <div className="px-3 py-1.5 rounded-lg bg-zinc-100 border border-zinc-200 text-black flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>2. VISIBILITY (₹22K)</span>
              </div>
              <span>→</span>
              <div className="px-3 py-1.5 rounded-lg bg-black text-white flex items-center gap-1.5 shadow-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>3. ACQUISITION (₹35K)</span>
              </div>
              <span>→</span>
              <div className="px-3 py-1.5 rounded-lg bg-zinc-900 text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-accent" />
                <span>4. GROWTH SYSTEM (₹55K)</span>
              </div>
            </div>
          </div>

          {/* PACKAGE CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
            {PACKAGES_DATA.map((pkg, idx) => {
              const isExpanded = expandedCard === pkg.id;
              const isPopular = pkg.popular;

              return (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className={`relative rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 ${
                    isPopular 
                      ? "bg-black text-white ring-2 ring-black shadow-2xl scale-[1.02] z-10" 
                      : "bg-white text-black border border-zinc-200 shadow-sm hover:border-black"
                  }`}
                >
                  {/* Badge for Popular Option */}
                  {isPopular && (
                    <div className="bg-accent text-white text-[10px] font-mono font-extrabold uppercase tracking-widest text-center py-1.5">
                      MOST POPULAR GROWTH STAGE
                    </div>
                  )}

                  <div className="p-6 sm:p-8 space-y-6">
                    {/* Level & Name */}
                    <div className="space-y-1">
                      <span className={`text-[10px] font-mono font-extrabold uppercase tracking-widest ${isPopular ? "text-accent" : "text-zinc-400"}`}>
                        {pkg.level} • {pkg.stage}
                      </span>
                      <h2 className="text-2xl font-extrabold uppercase tracking-tight">
                        {pkg.name}
                      </h2>
                    </div>

                    {/* Price */}
                    <div className="space-y-1">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                          {pkg.price}
                        </span>
                        <span className={`text-xs font-mono font-medium ${isPopular ? "text-zinc-400" : "text-zinc-500"}`}>
                          {pkg.period}
                        </span>
                      </div>
                      <p className={`text-xs leading-relaxed ${isPopular ? "text-zinc-300" : "text-zinc-600"}`}>
                        {pkg.positioning}
                      </p>
                    </div>

                    {/* Key Stats Grid */}
                    <div className={`grid grid-cols-2 gap-2 p-3 rounded-xl border text-center font-mono text-xs ${
                      isPopular ? "bg-zinc-900 border-zinc-800" : "bg-zinc-50 border-zinc-100"
                    }`}>
                      {pkg.stats.map((s, i) => (
                        <div key={i} className="p-1.5">
                          <span className="block font-extrabold text-sm text-current">{s.value}</span>
                          <span className={`text-[9px] uppercase tracking-wider block ${isPopular ? "text-zinc-400" : "text-zinc-500"}`}>{s.label}</span>
                        </div>
                      ))}
                    </div>

                    {/* Deliverables Highlights */}
                    <div className="space-y-3 pt-2">
                      <span className={`text-[10px] font-mono font-bold uppercase tracking-widest block ${isPopular ? "text-zinc-400" : "text-zinc-500"}`}>
                        Package Highlights:
                      </span>
                      <ul className="space-y-2">
                        {pkg.keyDeliverables.slice(0, 5).map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs font-medium">
                            <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isPopular ? "text-accent" : "text-black"}`} />
                            <span className={isPopular ? "text-zinc-200" : "text-zinc-700"}>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Accordion Toggle for Full Details */}
                    <button
                      onClick={() => toggleExpand(pkg.id)}
                      className={`w-full py-2 flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider border-t transition-colors ${
                        isPopular 
                          ? "border-zinc-800 text-zinc-300 hover:text-white" 
                          : "border-zinc-100 text-zinc-600 hover:text-black"
                      }`}
                    >
                      <span>{isExpanded ? "Hide Details" : "View Full Details"}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {/* Expanded Details Content */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-4 pt-2 text-xs border-t border-dashed border-zinc-700/50"
                        >
                          <div className="space-y-1">
                            <span className="font-mono font-bold text-[10px] text-accent uppercase tracking-widest">BEST FOR:</span>
                            <p className={isPopular ? "text-zinc-300" : "text-zinc-600"}>{pkg.bestFor}</p>
                          </div>

                          <div className="space-y-1">
                            <span className="font-mono font-bold text-[10px] text-accent uppercase tracking-widest">WEBSITE SCOPE:</span>
                            <p className={isPopular ? "text-zinc-300" : "text-zinc-600"}>{pkg.details.websiteScope}</p>
                          </div>

                          <div className="space-y-1">
                            <span className="font-mono font-bold text-[10px] text-accent uppercase tracking-widest">ADS &amp; MARKETING:</span>
                            <p className={isPopular ? "text-zinc-300" : "text-zinc-600"}>{pkg.details.adsManagement}</p>
                          </div>

                          {pkg.adBudgetNotice && (
                            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[11px] leading-relaxed">
                              <strong>Note:</strong> {pkg.adBudgetNotice}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Razorpay Payment CTA */}
                  <div className="p-6 pt-0 space-y-2">
                    <Button
                      onClick={() => handleOpenPayment(pkg)}
                      className={`w-full py-6 font-extrabold uppercase tracking-widest text-xs rounded-none transition-all flex items-center justify-center gap-2 shadow-lg ${
                        isPopular
                          ? "bg-white text-black hover:bg-zinc-200"
                          : "bg-black text-white hover:bg-zinc-800"
                      }`}
                    >
                      <CreditCard size={15} />
                      <span>Pay {pkg.price} with Razorpay</span>
                    </Button>
                    <Link to={`/contact?package=${pkg.id}`} className="block">
                      <Button
                        variant="ghost"
                        className={`w-full py-2 font-mono text-[10px] uppercase tracking-wider ${
                          isPopular ? "text-zinc-400 hover:text-white" : "text-zinc-500 hover:text-black"
                        }`}
                      >
                        or Request Custom Quote
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
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
                className="font-mono text-xs font-bold uppercase tracking-widest border-zinc-300 text-black hover:border-black"
              >
                {showTable ? "Collapse Table" : "View Full Comparison Table"}
              </Button>
            </div>

            {showTable && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm"
              >
                <table className="w-full text-left text-xs">
                  <thead className="bg-black text-white font-mono uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="p-4 border-b border-zinc-800">Feature / Scope</th>
                      <th className="p-4 border-b border-zinc-800">Start (₹12K)</th>
                      <th className="p-4 border-b border-zinc-800">Grow (₹22K)</th>
                      <th className="p-4 border-b border-zinc-800 text-accent font-extrabold">Scale (₹35K)</th>
                      <th className="p-4 border-b border-zinc-800">Growth Engine (₹55K)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 font-medium">
                    {COMPARISON_TABLE.map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-zinc-50/50"}>
                        <td className="p-4 font-bold text-black">{row.feature}</td>
                        <td className="p-4 text-zinc-600">{row.start}</td>
                        <td className="p-4 text-zinc-600">{row.grow}</td>
                        <td className="p-4 text-black font-bold bg-emerald-50/30">{row.scale}</td>
                        <td className="p-4 text-zinc-900 font-bold">{row.engine}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}
          </section>

          {/* SECTION 4 — PRICING CTA */}
          <section className="bg-black text-white rounded-3xl p-8 sm:p-14 md:p-16 text-center space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <Badge variant="outline" className="border-accent/30 text-accent font-mono text-xs uppercase tracking-widest">
                CUSTOM CONSULTATION
              </Badge>
              <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white leading-tight">
                Not Sure Where to Start?
              </h2>
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                Tell us where your business is today and we'll help you identify the right growth stage and custom scope for your budget.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <Link to="/contact" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto bg-white text-black hover:bg-zinc-200 font-extrabold uppercase tracking-widest text-xs px-8 py-6 rounded-none">
                    <span>Talk to Opsiys</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/contact?plan=custom" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto border-zinc-700 text-white hover:border-white font-extrabold uppercase tracking-widest text-xs px-8 py-6 rounded-none">
                    Request a Custom Plan
                  </Button>
                </Link>
              </div>
            </div>
          </section>

        </div>
      </div>
    </>
  );
};

export default PackagesPage;
