// Opsiys Clean Contact Page Module v2.0 - Clean White Aesthetic
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SEO } from "../components/SEO";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Mail, 
  MapPin, 
  Globe, 
  PhoneCall, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  Copy, 
  Check, 
  ChevronDown, 
  HelpCircle,
  MessageSquare,
  Zap,
  Building2,
  User,
  Phone
} from "lucide-react";
import { submitLead } from "../lib/firebase";

const PROJECT_TYPES = [
  "AI Automation", 
  "Growth Marketing", 
  "Search Engine Optimization (SEO)", 
  "Website Development", 
  "WhatsApp & CRM Automation", 
  "Branding & Media Strategy",
  "Full-Stack Transformation"
];

const BUDGET_RANGES = [
  "₹25,000 - ₹50,000",
  "₹50,000 - ₹1,50,000",
  "₹1,50,000 - ₹5,00,000+",
  "Custom / Project-Based"
];

const FAQS = [
  {
    q: "How fast can Opsiys start working on our project?",
    a: "Once we complete our initial discovery call and align on your goals, onboarding takes 24 to 48 hours. Most digital campaigns and website builds launch within 7-14 business days."
  },
  {
    q: "What makes Opsiys different from a traditional marketing agency?",
    a: "We are a connected business growth partner. We combine AI workflow automation, technical SEO, performance advertising, and bespoke web applications into a single unified growth engine."
  },
  {
    q: "Do you offer post-launch support and ongoing optimization?",
    a: "Yes! Every project includes dedicated SLA monitoring, weekly analytics reporting, and continuous performance optimization for ad spend, search engine rankings, and automated workflows."
  },
  {
    q: "Can we schedule a live discovery call before committing?",
    a: "Absolutely. Simply fill out the form or send us an email at opsiyss@gmail.com to book a 30-minute strategic consultation with our growth leaders."
  }
];

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    projectType: "Business Growth Solutions",
    budget: "₹50,000 - ₹1,50,000",
    message: ""
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState("");
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("opsiyss@gmail.com");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      await submitLead({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        budget: formData.budget,
        projectType: formData.projectType,
        message: formData.message,
        source: "Contact Page",
        status: "new"
      });
      
      setStatus('success');
      setFeedback("Thank you for reaching out. Our growth engineering team will review your inquiry and connect with you within 6 business hours.");
      setFormData({ 
        name: "", 
        email: "", 
        company: "", 
        phone: "", 
        projectType: "Business Growth Solutions",
        budget: "₹50,000 - ₹1,50,000", 
        message: "" 
      });
    } catch (err) {
      console.error(err);
      setStatus('error');
      setFeedback("Submission error: Failed to save your inquiry. Please check your connection and try again.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  return (
    <>
      <SEO
        title="Contact Opsiys | Start Your Business Growth Journey"
        description="Contact Opsiys for websites, SEO, Meta Ads, marketing, automation, CRM and digital business growth solutions."
        canonical="https://www.opsiys.in/contact"
      />

      <div className="bg-white text-[#0B0B0B] min-h-screen pt-28 pb-20 selection:bg-accent selection:text-white relative">
        <Breadcrumbs items={[{ label: "Contact" }]} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 space-y-16">
          
          {/* Page Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4 max-w-3xl"
          >
            <Badge className="bg-accent/10 text-accent hover:bg-accent/20 border-none px-4 py-1.5 rounded-full text-[9px] uppercase font-bold tracking-widest">
              Direct Communication
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-tight text-black leading-tight">
              Talk to Opsiys <br/>
              <span className="text-accent underline underline-offset-8 decoration-accent/10">Growth Partner</span>
            </h1>
            <p className="text-zinc-600 text-base sm:text-lg leading-relaxed font-medium">
              Ready to build your online presence, increase search visibility, generate qualified leads, and automate growth? Let's connect.
            </p>
          </motion.div>

          {/* Main 2-Column Section Matching Homepage Contact Module */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20 items-start relative z-10">
            
            {/* Left Column: Contact Channels & Process (5 Cols) */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-5 space-y-10"
            >
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
                  Start Your Growth Brief
                </h2>
                <p className="text-zinc-500 text-sm leading-relaxed font-medium">
                  Fill out our intake form or reach out directly to our team. We'll analyze your goals and present a step-by-step expansion plan.
                </p>
              </div>

              {/* Direct Reach Out Cards */}
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-3 transition-all hover:border-black/20">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Mail size={14} className="text-accent" /> Official Email Desk
                    </span>
                    <button 
                      type="button" 
                      onClick={handleCopyEmail}
                      className="text-[10px] font-mono font-bold text-zinc-600 hover:text-black flex items-center gap-1 transition-colors bg-white px-2.5 py-1 rounded-lg border border-zinc-200 shadow-sm"
                    >
                      {copiedEmail ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                      {copiedEmail ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <a href="mailto:opsiyss@gmail.com" className="text-base font-bold text-black hover:text-accent transition-colors truncate">
                      opsiyss@gmail.com
                    </a>
                    <a 
                      href="https://mail.google.com/mail/?view=cm&fs=1&to=opsiyss@gmail.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-zinc-500 hover:text-black font-bold uppercase tracking-wider underline shrink-0"
                    >
                      Gmail ↗
                    </a>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-1">
                  <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                    <MapPin size={14} className="text-accent" /> Base Operations
                  </span>
                  <div className="text-sm font-bold text-black">Based in India • Serving Worldwide</div>
                  <div className="text-xs text-zinc-500 font-medium">Remote & On-Site Strategic Execution</div>
                </div>

                <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-1">
                  <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Globe size={14} className="text-accent" /> Digital Flagship
                  </span>
                  <a href="https://www.opsiys.in/" className="text-sm font-bold text-accent hover:underline block truncate">
                    https://www.opsiys.in/
                  </a>
                </div>
              </div>

              {/* Step Cards Matching Homepage */}
              <div className="space-y-4 pt-4 border-t border-zinc-100">
                {[
                  { title: "Discovery Session", desc: "A deep dive into your business goals & manual workflows." },
                  { title: "Growth & Savings Analysis", desc: "A comprehensive report on lead pipelines and time savings." },
                  { title: "Automation Roadmap", desc: "A step-by-step execution plan for launching your systems." }
                ].map((item, idx) => (
                  <div key={item.title} className="flex gap-4 items-start group">
                    <div className="w-10 h-10 shrink-0 bg-black text-white flex items-center justify-center font-black text-xs rounded-xl shadow-md">
                      0{idx + 1}
                    </div>
                    <div>
                      <h4 className="font-black uppercase text-xs sm:text-sm tracking-tight mb-0.5 text-black">{item.title}</h4>
                      <p className="text-zinc-500 text-xs leading-snug">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-zinc-100 flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-zinc-100">
                      <img src={`https://picsum.photos/seed/face${i}/100/100`} alt="Client" referrerPolicy="no-referrer" />
                    </div>
                  ))}
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  Trusted by <span className="text-black">12+ Enterprise Teams</span>
                </p>
              </div>
            </motion.div>

            {/* Right Column: Clean White Form Module (7 Cols) */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-7 bg-white border border-zinc-200 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.08)] p-8 md:p-12 rounded-3xl relative"
            >
              <AnimatePresence>
                {status === 'success' && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    className="py-12 flex flex-col items-center justify-center text-center space-y-6"
                  >
                    <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                      <CheckCircle2 size={44} />
                    </div>
                    <div className="space-y-2 max-w-md mx-auto">
                      <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 bg-emerald-50 font-mono text-xs uppercase tracking-widest">
                        INQUIRY LOGGED SUCCESSFULLY
                      </Badge>
                      <h3 className="text-3xl font-extrabold uppercase tracking-tight text-black">Inquiry Received</h3>
                      <p className="text-zinc-600 text-sm leading-relaxed font-medium">{feedback}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => setStatus('idle')} 
                      className="rounded-full px-8 h-12 border-zinc-300 hover:border-black font-bold uppercase tracking-widest text-xs"
                    >
                      Send Another Inquiry
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>

              <form 
                className={`grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 transition-all duration-500 ${status === 'success' ? "hidden" : ""}`} 
                onSubmit={handleSubmit}
              >
                <div className="md:col-span-2 pb-2 border-b border-zinc-100 mb-2">
                  <h3 className="text-xl font-black uppercase tracking-tight text-black">
                    Request a Growth Consultation
                  </h3>
                  <p className="text-xs text-zinc-400 font-medium">Fill in your details below and we will get back to you promptly.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 ml-1">Contact Name *</label>
                  <Input 
                    id="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                    placeholder="Your full name" 
                    className="rounded-xl h-12 md:h-14 border-zinc-200 bg-zinc-50/50 text-black placeholder:text-zinc-400 focus-visible:ring-black px-4 font-bold text-xs md:text-sm" 
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 ml-1">Business Email *</label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                    placeholder="name@company.com" 
                    className="rounded-xl h-12 md:h-14 border-zinc-200 bg-zinc-50/50 text-black placeholder:text-zinc-400 focus-visible:ring-black px-4 font-bold text-xs md:text-sm" 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 ml-1">Phone / WhatsApp *</label>
                  <Input 
                    id="phone" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    required 
                    placeholder="+91 98765 43210" 
                    className="rounded-xl h-12 md:h-14 border-zinc-200 bg-zinc-50/50 text-black placeholder:text-zinc-400 focus-visible:ring-black px-4 font-bold text-xs md:text-sm" 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 ml-1">Organization / Clinic</label>
                  <Input 
                    id="company" 
                    value={formData.company} 
                    onChange={handleChange} 
                    placeholder="Company Name" 
                    className="rounded-xl h-12 md:h-14 border-zinc-200 bg-zinc-50/50 text-black placeholder:text-zinc-400 focus-visible:ring-black px-4 font-bold text-xs md:text-sm" 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 ml-1">Primary Requirement</label>
                  <select 
                    id="projectType" 
                    value={formData.projectType} 
                    onChange={handleChange as any}
                    className="w-full rounded-xl h-12 md:h-14 border border-zinc-200 bg-zinc-50/50 text-black focus:outline-none focus:border-black px-4 font-bold text-xs cursor-pointer"
                  >
                    {PROJECT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 ml-1">Target Budget Range</label>
                  <select 
                    id="budget" 
                    value={formData.budget} 
                    onChange={handleChange as any}
                    className="w-full rounded-xl h-12 md:h-14 border border-zinc-200 bg-zinc-50/50 text-black focus:outline-none focus:border-black px-4 font-bold text-xs cursor-pointer"
                  >
                    {BUDGET_RANGES.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>

                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 ml-1">Project Details / Message</label>
                  <textarea 
                    id="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full p-4 text-xs md:text-sm border border-zinc-200 bg-zinc-50/50 text-black placeholder:text-zinc-400 rounded-2xl focus:outline-none focus:border-black transition-colors font-bold"
                    placeholder="Tell us about your business goals and current growth challenges..."
                  />
                </div>
                
                <div className="md:col-span-2 pt-2">
                  {status === 'error' && <p className="text-xs text-red-600 font-bold mb-4 bg-red-50 p-3 rounded-xl border border-red-200">{feedback}</p>}
                  <Button 
                    type="submit" 
                    disabled={status === 'loading'} 
                    className="w-full bg-black hover:bg-zinc-800 text-white rounded-full h-14 md:h-16 text-sm md:text-base font-extrabold uppercase tracking-widest shadow-xl shadow-black/10 group transition-all"
                  >
                    {status === 'loading' ? (
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        <span>Processing Inquiry...</span>
                      </div>
                    ) : (
                      <span className="flex items-center justify-center gap-3">
                        Submit Growth Inquiry <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-2 transition-transform" />
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>

          {/* Clean Light FAQ Accordion Section */}
          <div className="bg-zinc-50/60 border border-zinc-200/80 rounded-3xl p-8 md:p-12 space-y-8">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-black flex items-center justify-center gap-2">
                <HelpCircle className="w-6 h-6 text-accent" /> Frequently Asked Questions
              </h3>
              <p className="text-xs sm:text-sm text-zinc-500 font-medium">Everything you need to know about working with Opsiys.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
              {FAQS.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className="border border-zinc-200 rounded-2xl overflow-hidden bg-white shadow-sm transition-all">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-5 text-left text-sm font-extrabold text-black flex items-center justify-between gap-4 hover:text-accent transition-colors"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown size={16} className={`text-zinc-400 shrink-0 transform transition-transform ${isOpen ? "rotate-180 text-black" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="px-5 pb-5 text-xs text-zinc-600 leading-relaxed font-medium border-t border-zinc-100 pt-3"
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

        </div>
      </div>
    </>
  );
};

export default ContactPage;
