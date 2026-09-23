import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SEO } from "../components/SEO";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Mail, 
  MapPin, 
  Globe, 
  PhoneCall, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  MessageSquare, 
  Zap, 
  Clock, 
  ShieldCheck, 
  Send, 
  Copy, 
  Check, 
  ChevronDown, 
  HelpCircle, 
  Target, 
  Code2, 
  Workflow, 
  Building2, 
  User, 
  DollarSign,
  TrendingUp,
  Cpu
} from "lucide-react";
import { submitLead } from "../lib/firebase";

const SERVICES_OPTIONS = [
  { id: "ai-automation", label: "AI & Workflow Automation", icon: Workflow, desc: "Self-orchestrating agents & WhatsApp CRM" },
  { id: "meta-ads", label: "Lead Gen & Meta Ads", icon: Target, desc: "High-converting ad funnels & target acquisition" },
  { id: "seo-visibility", label: "SEO & Generative Engine", icon: Globe, desc: "Organic search authority & GEO optimization" },
  { id: "web-dev", label: "Modern Web Application", icon: Code2, desc: "Bespoke, lightning-fast digital flagships" },
  { id: "branding", label: "Branding & Media Strategy", icon: Sparkles, desc: "Visual identity, creative & content production" },
  { id: "custom", label: "Full Growth Partner Suite", icon: Cpu, desc: "End-to-end digital expansion & scaling" }
];

const BUDGET_RANGES = [
  "₹25,000 - ₹50,000",
  "₹50,000 - ₹1,50,000",
  "₹1,50,000 - ₹5,00,000+",
  "Custom / Project-Based"
];

const URGENCY_TIMELINES = [
  "Immediate (Next 7 Days)",
  "Within 1 - 2 Weeks",
  "Within 30 Days",
  "Just Exploring Options"
];

const FAQS = [
  {
    q: "How fast can Opsiys start working on our project?",
    a: "Once we complete our initial discovery call and align on your goals, onboarding takes 24 to 48 hours. Most digital campaigns and initial website builds launch within 7-14 business days."
  },
  {
    q: "What makes Opsiys different from a traditional marketing agency?",
    a: "We are an outcome-focused business growth partner. We combine AI workflow automation, technical SEO, performance advertising, and bespoke web platforms into a single connected system aimed directly at revenue generation."
  },
  {
    q: "Do you offer post-launch support and ongoing optimization?",
    a: "Yes! Every project includes dedicated SLA monitoring, weekly performance analytics, and continuous optimization for ad spend, search rankings, and system automation."
  },
  {
    q: "Can we schedule a live discovery demo before signing?",
    a: "Absolutely. Simply fill out the contact form or email us at opsiyss@gmail.com to book a 30-minute strategic consultation with our core leadership."
  }
];

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "AI & Workflow Automation",
    budget: "₹50,000 - ₹1,50,000",
    urgency: "Immediate (Next 7 Days)",
    message: ""
  });

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("opsiyss@gmail.com");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitLead({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        budget: formData.budget,
        projectType: formData.service,
        urgency: formData.urgency,
        message: formData.message,
        source: "Interactive Contact Page",
        status: "new"
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Submission Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Contact Opsiys | High-Performance Business Growth & Automation Partner"
        description="Connect with Opsiys for bespoke web development, SEO, Meta Ads, AI workflow automation, and custom growth systems."
        canonical="https://www.opsiys.in/contact"
      />

      <div className="bg-[#0B0B0B] text-white min-h-screen pt-28 pb-24 selection:bg-accent selection:text-white relative overflow-hidden">
        {/* Dynamic Glow Spotlight Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-accent/10 blur-[150px] pointer-events-none" />
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-accent/5 blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-10 space-y-16">
          <Breadcrumbs items={[{ label: "Contact Us" }]} />

          {/* Hero Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 max-w-4xl"
          >
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-300">
                01 // INTAKE ORCHESTRATOR ONLINE
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold uppercase tracking-tight leading-[0.95] text-white">
              Let's Build Your <br/>
              <span className="text-accent underline underline-offset-8 decoration-accent/20">Growth Engine</span>
            </h1>

            <p className="text-zinc-400 text-base sm:text-xl font-medium leading-relaxed max-w-2xl">
              Ready to eliminate operational bottlenecks, rank on search engines, and generate predictable client inquiries? Get in touch with our team.
            </p>
          </motion.div>

          {/* Quick SLA Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            {[
              { label: "First Response SLA", value: "< 2 Hours", icon: Clock },
              { label: "Onboarding Window", value: "24-48 Hours", icon: Zap },
              { label: "Client Privacy", value: "100% Guaranteed", icon: ShieldCheck },
              { label: "Global Coverage", value: "India & Worldwide", icon: Globe }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-md flex items-center gap-4 hover:border-zinc-700 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
                  <stat.icon size={20} />
                </div>
                <div>
                  <div className="text-base sm:text-lg font-black uppercase tracking-tight text-white">{stat.value}</div>
                  <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Main Interactive Form & Info Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Form Column (7 Cols) */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-7 bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl pointer-events-none" />

              {submitted ? (
                <AnimatePresence>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-16 space-y-6"
                  >
                    <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/10">
                      <CheckCircle2 size={44} />
                    </div>
                    <div className="space-y-2">
                      <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 font-mono text-xs uppercase tracking-widest">
                        INQUIRY LOGGED SUCCESSFULLY
                      </Badge>
                      <h2 className="text-3xl font-extrabold uppercase tracking-tight text-white">
                        Growth Brief Received!
                      </h2>
                      <p className="text-zinc-400 text-sm max-w-md mx-auto leading-relaxed">
                        Thank you for submitting your project requirement. Our strategic team has logged your submission and will contact you via email/phone within 2 hours.
                      </p>
                    </div>

                    <div className="p-4 bg-zinc-950/80 border border-zinc-800 rounded-2xl max-w-sm mx-auto text-left font-mono text-xs space-y-2 text-zinc-300">
                      <div className="text-zinc-500 text-[10px] uppercase tracking-widest border-b border-zinc-800 pb-1">Submission Ticket</div>
                      <div><span className="text-zinc-500">Service:</span> {formData.service}</div>
                      <div><span className="text-zinc-500">Timeline:</span> {formData.urgency}</div>
                      <div><span className="text-zinc-500">Target Budget:</span> {formData.budget}</div>
                    </div>

                    <Button 
                      onClick={() => setSubmitted(false)} 
                      variant="outline"
                      className="font-bold text-xs uppercase tracking-widest rounded-xl border-zinc-700 text-white hover:bg-white hover:text-black transition-all px-8 py-6"
                    >
                      Submit Another Requirement
                    </Button>
                  </motion.div>
                </AnimatePresence>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="flex items-center justify-between border-b border-zinc-800/80 pb-5">
                    <div>
                      <h2 className="text-2xl font-black uppercase tracking-tight text-white">
                        Project Brief Intake
                      </h2>
                      <p className="text-xs text-zinc-400 font-mono">Fill in details for a customized strategy proposal.</p>
                    </div>
                    <Badge variant="outline" className="border-accent/30 text-accent font-mono text-[9px] uppercase tracking-widest">
                      Step 1 of 1
                    </Badge>
                  </div>

                  {/* 1. Interactive Requirement Chips */}
                  <div className="space-y-3">
                    <label className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 flex items-center justify-between">
                      <span>1. Select Primary Solution</span>
                      <span className="text-[10px] text-accent font-normal">Click to select</span>
                    </label>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {SERVICES_OPTIONS.map((opt) => {
                        const isSelected = formData.service === opt.label;
                        const IconComponent = opt.icon;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setFormData({ ...formData, service: opt.label })}
                            className={`p-3.5 rounded-2xl border text-left transition-all duration-300 flex items-start gap-3 group relative ${
                              isSelected 
                                ? "bg-white text-black border-white shadow-xl shadow-white/5 ring-2 ring-white/20" 
                                : "bg-zinc-950/60 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900/60"
                            }`}
                          >
                            <div className={`p-2 rounded-xl border shrink-0 transition-colors ${
                              isSelected ? "bg-black text-white border-black" : "bg-zinc-900 text-accent border-zinc-800 group-hover:border-zinc-700"
                            }`}>
                              <IconComponent size={18} />
                            </div>
                            <div className="min-w-0 pr-4">
                              <div className={`text-xs font-bold uppercase tracking-tight truncate ${isSelected ? "text-black" : "text-white"}`}>
                                {opt.label}
                              </div>
                              <div className={`text-[10px] leading-tight line-clamp-1 mt-0.5 ${isSelected ? "text-zinc-700 font-medium" : "text-zinc-500"}`}>
                                {opt.desc}
                              </div>
                            </div>
                            {isSelected && (
                              <CheckCircle2 size={16} className="absolute top-3 right-3 text-black shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. Contact Details Inputs */}
                  <div className="space-y-4">
                    <label className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 block">
                      2. Contact Information
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                          <User size={12} className="text-accent" /> Full Name *
                        </label>
                        <input 
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Aditya Gupta"
                          className="w-full h-12 px-4 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-accent transition-colors"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Mail size={12} className="text-accent" /> Email Address *
                        </label>
                        <input 
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="name@company.com"
                          className="w-full h-12 px-4 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-accent transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                          <PhoneCall size={12} className="text-accent" /> Phone / WhatsApp *
                        </label>
                        <input 
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="w-full h-12 px-4 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-accent transition-colors"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Building2 size={12} className="text-accent" /> Company / Clinic Name
                        </label>
                        <input 
                          type="text"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          placeholder="Organization Name"
                          className="w-full h-12 px-4 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-accent transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3. Budget Range Selector */}
                  <div className="space-y-2.5">
                    <label className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                      <DollarSign size={14} className="text-accent" /> 3. Target Budget Range
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {BUDGET_RANGES.map((range) => {
                        const active = formData.budget === range;
                        return (
                          <button
                            key={range}
                            type="button"
                            onClick={() => setFormData({ ...formData, budget: range })}
                            className={`px-3 py-2.5 rounded-xl border text-[11px] font-mono font-bold transition-all text-center truncate ${
                              active 
                                ? "bg-accent/20 border-accent text-accent shadow-sm" 
                                : "bg-zinc-950 border-zinc-800/80 text-zinc-400 hover:border-zinc-700 hover:text-white"
                            }`}
                          >
                            {range}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 4. Timeline Urgency Selector */}
                  <div className="space-y-2.5">
                    <label className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                      <Clock size={14} className="text-accent" /> 4. Expected Timeline
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {URGENCY_TIMELINES.map((time) => {
                        const active = formData.urgency === time;
                        return (
                          <button
                            key={time}
                            type="button"
                            onClick={() => setFormData({ ...formData, urgency: time })}
                            className={`px-3 py-2.5 rounded-xl border text-[11px] font-mono font-bold transition-all text-center truncate ${
                              active 
                                ? "bg-accent/20 border-accent text-accent shadow-sm" 
                                : "bg-zinc-950 border-zinc-800/80 text-zinc-400 hover:border-zinc-700 hover:text-white"
                            }`}
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 5. Project Overview Message */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 block">
                      5. Project Scope / Objectives
                    </label>
                    <textarea 
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Describe your current bottleneck, target metrics, or project scope..."
                      className="w-full p-4 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full h-14 bg-white text-black hover:bg-accent hover:text-white font-extrabold uppercase tracking-[0.2em] text-xs rounded-xl shadow-xl transition-all duration-300 group"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Zap className="w-4 h-4 animate-spin text-black group-hover:text-white" />
                        Logging Project Brief...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-3">
                        Transmit Requirement Brief <Send className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                      </span>
                    )}
                  </Button>
                </form>
              )}
            </motion.div>

            {/* Right Column: Direct Channels & Live Live Summary (5 Cols) */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-5 space-y-6"
            >
              {/* Direct Reach Out Card */}
              <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                  <h3 className="text-lg font-black uppercase tracking-tight text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-accent" /> Direct Contact Channels
                  </h3>
                  <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 font-mono text-[9px] uppercase">
                    ACTIVE
                  </Badge>
                </div>

                {/* Email Channel */}
                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3 group hover:border-zinc-700 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Mail size={12} className="text-accent" /> Official Inquiry Desk
                    </span>
                    <button 
                      type="button" 
                      onClick={handleCopyEmail}
                      className="text-[10px] font-mono text-accent hover:text-white flex items-center gap-1 transition-colors bg-white/5 px-2 py-1 rounded-lg border border-white/10"
                    >
                      {copiedEmail ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      {copiedEmail ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <a href="mailto:opsiyss@gmail.com" className="text-base font-bold text-white group-hover:text-accent transition-colors truncate">
                      opsiyss@gmail.com
                    </a>
                    <a 
                      href="https://mail.google.com/mail/?view=cm&fs=1&to=opsiyss@gmail.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-zinc-400 hover:text-white underline font-mono shrink-0"
                    >
                      Open Gmail ↗
                    </a>
                  </div>
                </div>

                {/* Base Operations */}
                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                    <MapPin size={12} className="text-accent" /> Headquarters & Operations
                  </span>
                  <p className="text-sm font-bold text-white">India • Serving Global Enterprises</p>
                  <p className="text-xs text-zinc-400 font-medium">Remote & On-Site Strategic Execution Worldwide</p>
                </div>

                {/* Web Domain */}
                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Globe size={12} className="text-accent" /> Digital Flagship
                  </span>
                  <a href="https://www.opsiys.in/" className="text-sm font-bold text-accent hover:underline block truncate">
                    https://www.opsiys.in/
                  </a>
                </div>
              </div>

              {/* Dynamic Live Intake Preview Summary Card */}
              <div className="bg-zinc-950 border border-zinc-800/90 rounded-3xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 uppercase tracking-widest border-b border-zinc-800/80 pb-3">
                  <span>LIVE INTAKE CONFIGURATION</span>
                  <span className="text-accent font-bold">READY TO TRANSMIT</span>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between py-1 border-b border-zinc-900">
                    <span className="text-zinc-500">Selected Solution:</span>
                    <span className="text-white font-bold text-right">{formData.service}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-900">
                    <span className="text-zinc-500">Target Budget:</span>
                    <span className="text-accent font-bold">{formData.budget}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-900">
                    <span className="text-zinc-500">Deployment Timeline:</span>
                    <span className="text-white font-bold">{formData.urgency}</span>
                  </div>
                </div>

                <div className="pt-2 text-[10px] text-zinc-400 leading-relaxed font-medium flex items-center gap-2">
                  <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
                  <span>No obligation consultation. Strict privacy protocols applied to all submissions.</span>
                </div>
              </div>

              {/* Interactive FAQ Accordion */}
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <HelpCircle size={16} className="text-accent" /> Frequently Asked Questions
                </h4>

                <div className="space-y-2">
                  {FAQS.map((faq, idx) => {
                    const isOpen = openFaq === idx;
                    return (
                      <div key={idx} className="border border-zinc-800/80 rounded-2xl overflow-hidden bg-zinc-950/60 transition-all">
                        <button
                          type="button"
                          onClick={() => setOpenFaq(isOpen ? null : idx)}
                          className="w-full p-3.5 text-left text-xs font-bold text-white flex items-center justify-between gap-3 hover:text-accent transition-colors"
                        >
                          <span>{faq.q}</span>
                          <ChevronDown size={14} className={`text-zinc-400 shrink-0 transform transition-transform ${isOpen ? "rotate-180 text-accent" : ""}`} />
                        </button>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="px-3.5 pb-3.5 text-xs text-zinc-400 leading-relaxed font-medium border-t border-zinc-900 pt-2"
                            >
                              {faq.a}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>

            </motion.div>

          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
