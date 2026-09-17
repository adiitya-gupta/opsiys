import React from "react";
import { Link } from "react-router-dom";
import { SEO } from "../components/SEO";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";
import { 
  ArrowRight, 
  BarChart3, 
  Megaphone, 
  Search, 
  Target, 
  Code2, 
  Mail, 
  MessageSquare, 
  Workflow, 
  Cpu, 
  Sparkles, 
  Camera, 
  Layers,
  Video,
  Users,
  CheckCircle2
} from "lucide-react";

export const SERVICES_LIST = [
  {
    slug: "website-development",
    title: "Website Development",
    seoTitle: "Website Development | Modern Business Websites | Opsiys",
    seoDesc: "Bespoke, lightning-fast business website development built for maximum conversion, accessibility, and search ranking.",
    icon: Code2,
    tagline: "High-Performance Digital Platforms",
    description: "Custom digital platforms engineered with modern frontend tech, responsive design, fast load times, and conversion-focused architecture.",
    benefits: ["Ultra-Fast Load Times & Core Web Vitals", "Conversion-Focused UX Architecture", "SEO-Ready Technical Infrastructure"],
    useCases: ["Corporate Flagship Sites", "Conversion Landing Pages", "SaaS & Product Platforms"]
  },
  {
    slug: "digital-marketing",
    title: "Digital Marketing",
    seoTitle: "Digital Marketing Services | Growth Marketing | Opsiys",
    seoDesc: "Drive measurable customer acquisition with data-backed digital marketing strategies across paid social, search, and content channels.",
    icon: Megaphone,
    tagline: "Performance Acquisition Campaigns",
    description: "Multi-channel digital marketing programs engineered to build brand awareness, increase organic visibility, and drive customer inquiries.",
    benefits: ["Omnichannel Campaign Orchestration", "Data-Driven Audience Targeting", "Measurable Customer Acquisition ROI"],
    useCases: ["Multi-Channel Brand Growth", "Seasonal Promotion Campaigns", "Customer Retention Programs"]
  },
  {
    slug: "meta-ads",
    title: "Meta Ads",
    seoTitle: "Meta Ads Management | Facebook & Instagram Ads | Opsiys",
    seoDesc: "Scale paid acquisition with hyper-targeted Facebook and Instagram ad campaigns that capture high-intent buyers.",
    icon: Target,
    tagline: "High-Converting Paid Social Advertising",
    description: "Full-funnel Meta advertising campaigns with custom creative, copy, precise audience targeting, and real-time conversion tracking.",
    benefits: ["High-Intent Audience Segmentation", "Continuous Creative & Copy Testing", "Transparent Return on Ad Spend (ROAS)"],
    useCases: ["Direct Response Lead Generation", "Retargeting Lost Visitors", "Product & Service Launch Ads"]
  },
  {
    slug: "seo",
    title: "SEO",
    seoTitle: "SEO Services | Search Visibility & Organic Growth | Opsiys",
    seoDesc: "Opsiys delivers technical SEO, keyword research, on-page optimization, and local search authority to grow organic revenue.",
    icon: Search,
    tagline: "Dominate Search Results & Organic Visibility",
    description: "Technical SEO, search authority building, and high-intent keyword optimization designed to put your business in front of ready-to-buy clients.",
    benefits: ["Sustainable Long-Term Organic Traffic", "High-Intent Keyword Rankings", "Technical Site Speed & Architecture"],
    useCases: ["Local Business Map Pack Dominance", "B2B & B2C Search Visibility", "Organic Lead Generation Engine"]
  },
  {
    slug: "lead-generation",
    title: "Lead Generation",
    seoTitle: "Lead Generation Services & Pipeline Automation | Opsiys",
    seoDesc: "Consistent, predictable lead generation systems that deliver verified inquiries directly into your sales pipeline.",
    icon: Layers,
    tagline: "Predictable Customer Acquisition Funnels",
    description: "Custom lead acquisition funnels optimized to filter out unqualified leads and deliver verified sales opportunities directly to your team.",
    benefits: ["Qualified Inquiries Filtered & Scored", "Predictable Cost per Lead (CPL)", "Direct CRM Routing & Follow-up"],
    useCases: ["B2B Qualified Pipeline Creation", "High-Ticket Service Acquisition", "Appointment Booking Automation"]
  },
  {
    slug: "email-automation",
    title: "Email Automation",
    seoTitle: "Email Automation & Bulk Email Systems | Opsiys",
    seoDesc: "Turn subscribers into lifetime clients with automated email nurture sequences, newsletters, and transactional campaigns.",
    icon: Mail,
    tagline: "Automated Nurture & Retention Funnels",
    description: "High-deliverability email messaging workflows that engage prospects, recover abandoned funnels, and drive repeat sales automatically.",
    benefits: ["High Domain Inbox Deliverability", "Automated Drip & Nurture Sequences", "Full CRM & Funnel Integration"],
    useCases: ["Automated Onboarding Flows", "Lead Nurture & Re-engagement", "Customer Lifetime Value Growth"]
  },
  {
    slug: "whatsapp-automation",
    title: "WhatsApp Automation",
    seoTitle: "WhatsApp Automation & Business Messaging | Opsiys",
    seoDesc: "Engage leads instantly on WhatsApp with official API integration, chatbot workflows, appointment reminders, and broadcast campaigns.",
    icon: MessageSquare,
    tagline: "Instant Messaging Conversational Commerce",
    description: "Official WhatsApp Business API automations enabling 24/7 instant replies, broadcast updates, and interactive lead routing.",
    benefits: ["Instant 24/7 Lead Engagement", "Higher Open Rates Than Email", "Automated Appointment Scheduling"],
    useCases: ["Instant Lead Response Bot", "Customer Support Automation", "Broadcast News & Offer Blast"]
  },
  {
    slug: "crm-automation",
    title: "CRM & Lead Management",
    seoTitle: "CRM Automation & Lead Pipeline Integration | Opsiys",
    seoDesc: "Eliminate manual data entry and missed leads by connecting your marketing channels directly into an automated CRM pipeline.",
    icon: Workflow,
    tagline: "Zero-Drop Lead Management Systems",
    description: "Streamlined CRM setups that capture, score, assign, and track leads automatically across your entire sales organization.",
    benefits: ["Eliminate Missed Lead Opportunities", "Automated Sales Lead Assignment", "Real-Time Pipeline Analytics"],
    useCases: ["Multi-Channel Lead Sync", "Sales Rep Task Automation", "Pipeline Conversion Reporting"]
  },
  {
    slug: "ai-business-automation",
    title: "AI & Business Automation",
    seoTitle: "AI Business Automation & Workflow Engineering | Opsiys",
    seoDesc: "Deploy autonomous AI agents, workflow automations, and custom intelligence tools to reduce operational costs and scale output.",
    icon: Cpu,
    tagline: "Autonomous Operations & Custom AI Workflows",
    description: "Cutting-edge artificial intelligence integrations designed to automate repetitive business tasks, data processing, and client inquiries.",
    benefits: ["Drastic Operational Cost Reduction", "24/7 Autonomous Process Execution", "Seamless API & Tool Integrations"],
    useCases: ["Automated Data Extraction & Processing", "Custom AI Support Agents", "Internal Workflow Automation"]
  },
  {
    slug: "branding",
    title: "Branding",
    seoTitle: "Corporate Branding & Visual Identity Systems | Opsiys",
    seoDesc: "Build an unforgettable brand image with cohesive visual systems, logo design, typography, and brand messaging guidelines.",
    icon: Sparkles,
    tagline: "Premium Brand Positioning & Identity",
    description: "Strategic branding packages that build instant trust, communicate enterprise quality, and set your business apart from market competitors.",
    benefits: ["Instant Market Trust & Authority", "Cohesive Visual System Guidelines", "Distinctive Brand Positioning"],
    useCases: ["New Business Brand Identity", "Rebranding Established Enterprises", "Brand Style Guide Creation"]
  },
  {
    slug: "creative",
    title: "Creative",
    seoTitle: "Creative Solutions & Visual Content | Opsiys",
    seoDesc: "High-impact visual creative, ad graphics, promotional layouts, and digital visual assets engineered for business growth.",
    icon: Camera,
    tagline: "Compelling Visual Assets & Ad Creatives",
    description: "Data-informed graphic design, social ad creatives, graphic assets, and brand content that capture attention and drive conversions.",
    benefits: ["Higher Click-Through Rates (CTR)", "Brand-Consistent Visual Assets", "Fast Creative Turnaround"],
    useCases: ["High-Converting Ad Creatives", "Social Content Assets", "Marketing Collateral Design"]
  },
  {
    slug: "photography",
    title: "Photography",
    seoTitle: "Commercial Photography & Brand Visuals | Opsiys",
    seoDesc: "Professional commercial, product, corporate, and brand photography tailored for websites, advertising, and marketing collateral.",
    icon: Camera,
    tagline: "High-Resolution Brand & Commercial Imagery",
    description: "Authentic, high-resolution corporate and product photography designed to showcase your real team, products, and operational environment.",
    benefits: ["Authentic Brand Representation", "High-Resolution Web & Print Ready", "Enhanced Visual Trust"],
    useCases: ["Product Catalog Shoots", "Executive & Team Headshots", "Facility & Operational Visuals"]
  },
  {
    slug: "videography",
    title: "Videography",
    seoTitle: "Commercial Video Production & Reels | Opsiys",
    seoDesc: "High-impact video production, brand stories, customer video testimonials, and short-form video content for reels and ads.",
    icon: Video,
    tagline: "Cinematic Commercial & Social Video Production",
    description: "Full-service video production from scripting to editing, crafting high-converting video ads, brand documentaries, and engaging reels.",
    benefits: ["Maximized Engagement Across Channels", "High-Converting Video Ad Formats", "Professional Scripting & Editing"],
    useCases: ["Brand Showcase Videos", "Short-Form Social Reels", "Client Testimonials & Case Videos"]
  },
  {
    slug: "influencer-marketing",
    title: "Influencer & Creator Marketing",
    seoTitle: "Influencer & Creator Marketing Solutions | Opsiys",
    seoDesc: "Connect with relevant niche creators and influencers to expand reach, generate authentic content, and acquire new customers.",
    icon: Users,
    tagline: "Strategic Creator Partnerships & Campaign Management",
    description: "End-to-end creator and influencer campaign management, connecting your brand with trusted voices to drive authentic engagement.",
    benefits: ["Targeted Niche Audience Reach", "Authentic Social Proof Content", "Turnkey Campaign Management"],
    useCases: ["Product Launch Awareness", "Creator User-Generated Content (UGC)", "Niche Brand Endorsements"]
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.35, ease: "easeOut" } 
  }
};

export const ServicesPage: React.FC = () => {
  return (
    <>
      <SEO
        title="Digital Growth Services | Marketing, SEO, Websites & Automation | Opsiys"
        description="Explore Opsiys services for business growth including websites, Meta Ads, SEO, lead generation, email automation, WhatsApp automation, CRM and AI-powered business automation."
        canonical="https://opsiys.in/services"
      />
      <div className="bg-[#FAFAFA] min-h-screen pt-28 pb-20 text-[#0B0B0B]">
        <Breadcrumbs items={[{ label: "Services" }]} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 space-y-12">
          {/* Header Banner */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white border border-zinc-200 rounded-2xl p-6 sm:p-10 shadow-sm">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 space-y-4 text-left"
            >
              <Badge variant="outline" className="rounded-full px-3 py-1 text-xs border-accent/20 text-accent bg-accent/5 font-mono uppercase tracking-widest flex items-center gap-1.5 w-fit">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Connected Growth Engine</span>
              </Badge>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-tight text-black leading-tight">
                Digital Growth Services
              </h1>
              <p className="text-zinc-600 text-base sm:text-lg leading-relaxed font-medium">
                We design, build, and optimize the connected digital infrastructure your business needs to build online presence, increase search visibility, generate leads, and automate growth.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-5 rounded-xl overflow-hidden shadow-lg border border-zinc-200 bg-zinc-900"
            >
              <img 
                src="/images/hero_growth.png" 
                alt="Digital Growth Services - Opsiys"
                className="w-full h-full object-cover max-h-[260px]"
              />
            </motion.div>
          </div>

          {/* Cards Grid */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {SERVICES_LIST.map((service) => {
              const IconComp = service.icon;
              const detailSlug = service.slug.includes("photography") || service.slug.includes("videography") 
                ? "creative" 
                : service.slug.includes("influencer") 
                ? "digital-marketing" 
                : service.slug;

              return (
                <motion.article 
                  key={service.slug}
                  variants={itemVariants}
                  whileHover={{ y: -4 }}
                  className="bg-white border border-zinc-200 rounded-xl p-6 sm:p-8 flex flex-col justify-between hover:border-black transition-all hover:shadow-xl group"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-lg bg-zinc-900 text-white flex items-center justify-center group-hover:bg-accent transition-colors">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono font-bold text-accent uppercase tracking-widest block">
                        {service.tagline}
                      </span>
                      <h2 className="text-xl font-bold uppercase tracking-tight text-black">
                        {service.title}
                      </h2>
                    </div>
                    <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed">
                      {service.description}
                    </p>

                    <div className="space-y-2 pt-3 border-t border-zinc-100">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Key Benefits:</p>
                      <ul className="space-y-1">
                        {service.benefits.map((b, i) => (
                          <li key={i} className="text-[11px] font-medium text-zinc-600 flex items-center gap-2">
                            <CheckCircle2 className="w-3 h-3 text-accent shrink-0" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-1.5 pt-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Use Cases:</p>
                      <div className="flex flex-wrap gap-1">
                        {service.useCases.map((uc, i) => (
                          <Badge key={i} variant="secondary" className="text-[9px] font-mono bg-zinc-100 text-zinc-700 hover:bg-zinc-200 border-none rounded-sm">
                            {uc}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-6">
                    <Link to={`/services/${detailSlug}`}>
                      <Button variant="outline" className="w-full rounded-none border-zinc-300 group-hover:border-black font-bold text-xs uppercase tracking-widest flex items-center justify-between">
                        <span>Explore {service.title}</span>
                        <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-black group-hover:translate-x-1 transition-all" />
                      </Button>
                    </Link>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>

          {/* Detailed Crawlable Content Section for Search Crawlers & Users */}
          <section className="bg-white border border-zinc-200 rounded-2xl p-8 sm:p-12 space-y-8">
            <div className="max-w-3xl space-y-3">
              <span className="text-xs font-mono font-bold text-accent uppercase tracking-widest">
                Comprehensive Capability Breakdown
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-black">
                End-to-End Business Growth &amp; Technology Infrastructure
              </h2>
              <p className="text-zinc-600 text-sm leading-relaxed font-medium">
                Opsiys provides connected business growth services designed to eliminate fragmented marketing and software setups. Discover how each service category drives tangible business outcomes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-zinc-100">
              <div className="space-y-3">
                <h3 className="text-lg font-bold uppercase text-black">Modern Web &amp; Search Visibility</h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Our <Link to="/services/website-development" className="text-black font-semibold underline underline-offset-2 hover:text-accent">Website Development</Link> and <Link to="/services/seo" className="text-black font-semibold underline underline-offset-2 hover:text-accent">SEO Services</Link> establish a authoritative digital foundation. We build fast, responsive platforms that rank on Google, capture target audiences, and convert visitors into qualified business inquiries.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-bold uppercase text-black">Paid Acquisition &amp; Customer Generation</h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Through <Link to="/services/meta-ads" className="text-black font-semibold underline underline-offset-2 hover:text-accent">Meta Ads Management</Link> and data-driven <Link to="/services/lead-generation" className="text-black font-semibold underline underline-offset-2 hover:text-accent">Lead Generation Systems</Link>, we deliver targeted paid campaigns on Facebook and Instagram that capture ready-to-buy prospects and lower client acquisition costs.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-bold uppercase text-black">Messaging &amp; Business Automation</h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Combine <Link to="/services/whatsapp-automation" className="text-black font-semibold underline underline-offset-2 hover:text-accent">WhatsApp Automation</Link>, <Link to="/services/email-automation" className="text-black font-semibold underline underline-offset-2 hover:text-accent">Email Systems</Link>, and <Link to="/services/crm-automation" className="text-black font-semibold underline underline-offset-2 hover:text-accent">CRM Pipeline Integration</Link> to ensure zero lost leads. Automate 24/7 client communication, appointment reminders, and sales team task assignments.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-bold uppercase text-black">AI Engineering &amp; Operational Efficiency</h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Our <Link to="/services/ai-business-automation" className="text-black font-semibold underline underline-offset-2 hover:text-accent">AI &amp; Business Automation</Link> deployments engineer custom workflows, intelligent chatbots, and API integrations that reduce operational overhead while scaling output exponentially.
                </p>
              </div>
            </div>
          </section>

          {/* CTA Banner */}
          <div className="bg-black text-white rounded-2xl p-8 sm:p-12 text-center space-y-6 shadow-2xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight">
              Ready to Accelerate Your Business Growth?
            </h2>
            <p className="text-zinc-400 text-sm max-w-xl mx-auto leading-relaxed font-medium">
              Build Your Online Presence. Increase Your Visibility. Generate Opportunities. Automate Growth.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-4">
              <Link to="/contact">
                <Button size="lg" className="bg-white text-black hover:bg-zinc-200 font-bold uppercase tracking-widest text-xs px-8 py-6 rounded-none">
                  Request a Growth Consultation
                </Button>
              </Link>
              <Link to="/packages">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 font-bold uppercase tracking-widest text-xs px-8 py-6 rounded-none">
                  Explore Growth Packages
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default ServicesPage;

