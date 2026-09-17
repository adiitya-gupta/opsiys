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
  Layers 
} from "lucide-react";

export const SERVICES_LIST = [
  {
    slug: "business-growth",
    title: "Business Growth Solutions",
    seoTitle: "Business Growth Solutions & Partner Services | Opsiys",
    seoDesc: "Opsiys helps companies scale with connected business growth strategies, digital visibility, lead generation, and automated workflows.",
    icon: BarChart3,
    tagline: "Strategic Scaling for Growing Companies",
    description: "End-to-end growth partner services combining brand strategy, digital acquisition, and automated execution systems.",
    highlights: ["Revenue Pipeline Optimization", "Market Expansion Strategy", "Digital Growth Roadmaps"]
  },
  {
    slug: "digital-marketing",
    title: "Digital Marketing Solutions",
    seoTitle: "Digital Marketing Services | Growth Marketing | Opsiys",
    seoDesc: "Drive measurable customer acquisition with data-backed digital marketing strategies across paid social, search, and content channels.",
    icon: Megaphone,
    tagline: "Performance Acquisition Campaigns",
    description: "Multi-channel digital marketing programs engineered to increase brand awareness, drive traffic, and generate customer inquiries.",
    highlights: ["Omnichannel Campaigns", "Performance Ad Strategy", "Conversion Rate Optimization"]
  },
  {
    slug: "seo",
    title: "Search Engine Optimization (SEO)",
    seoTitle: "SEO Services | Search Visibility & Organic Growth | Opsiys",
    seoDesc: "Opsiys delivers technical SEO, keyword research, on-page optimization, and local search authority to grow organic revenue.",
    icon: Search,
    tagline: "Dominate Search Results & Organic Visibility",
    description: "Technical SEO, search authority building, and content optimization designed to put your business in front of ready-to-buy customers.",
    highlights: ["Technical & On-Page SEO", "Local SEO & Map Pack", "Organic Lead Flow"]
  },
  {
    slug: "meta-ads",
    title: "Meta Ads Management",
    seoTitle: "Meta Ads Management | Facebook & Instagram Ads | Opsiys",
    seoDesc: "Scale paid acquisition with hyper-targeted Facebook and Instagram ad campaigns that capture high-intent buyers.",
    icon: Target,
    tagline: "High-Converting Paid Social Advertising",
    description: "Full-funnel Meta advertising campaigns with custom creative, copy, precise audience targeting, and real-time tracking.",
    highlights: ["High-Intent Audience Targeting", "Creative & Copy Testing", "ROI Tracking & Attribution"]
  },
  {
    slug: "lead-generation",
    title: "Qualified Lead Generation",
    seoTitle: "Lead Generation Services & Pipeline Automation | Opsiys",
    seoDesc: "Consistent, predictable lead generation systems that deliver verified inquiries directly into your CRM pipeline.",
    icon: Layers,
    tagline: "Predictable B2B & B2C Lead Pipelines",
    description: "Custom lead acquisition funnels optimized to filter out cold inquiries and deliver qualified opportunities.",
    highlights: ["Qualified Prospect Capture", "Automated Lead Verification", "Direct CRM Routing"]
  },
  {
    slug: "website-development",
    title: "Modern Website Development",
    seoTitle: "Website Development | Modern Business Websites | Opsiys",
    seoDesc: "Bespoke, lightning-fast business website development built for maximum conversion, accessibility, and search ranking.",
    icon: Code2,
    tagline: "High-Performance Digital Platforms",
    description: "Custom digital platforms engineered with modern frontend tech, responsive design, fast load times, and conversion architecture.",
    highlights: ["Mobile-First & Ultra Fast", "Conversion-Focused UX", "SEO-Ready Architecture"]
  },
  {
    slug: "email-automation",
    title: "Email Marketing & Automation",
    seoTitle: "Email Automation & Bulk Email Systems | Opsiys",
    seoDesc: "Turn subscribers into lifetime clients with automated email nurture sequences, newsletters, and transactional campaigns.",
    icon: Mail,
    tagline: "Automated Nurture & Retention Funnels",
    description: "High-deliverability email messaging workflows that engage prospects, recover lost leads, and drive repeat sales automatically.",
    highlights: ["Automated Drip Sequences", "High Deliverability Setup", "CRM Integration"]
  },
  {
    slug: "whatsapp-automation",
    title: "WhatsApp Business Automation",
    seoTitle: "WhatsApp Automation & Business Messaging | Opsiys",
    seoDesc: "Engage leads instantly on WhatsApp with official API integration, chatbot workflows, appointment reminders, and broadcast campaigns.",
    icon: MessageSquare,
    tagline: "Instant Messaging Conversational Commerce",
    description: "Official WhatsApp Business API automations enabling 24/7 instant replies, broadcast updates, and interactive lead routing.",
    highlights: ["WhatsApp Official API", "24/7 Auto-Reply Bots", "Broadcast Campaign Engines"]
  },
  {
    slug: "crm-automation",
    title: "CRM & Pipeline Automation",
    seoTitle: "CRM Automation & Lead Pipeline Integration | Opsiys",
    seoDesc: "Eliminate manual data entry and missed leads by connecting your marketing channels directly into an automated CRM pipeline.",
    icon: Workflow,
    tagline: "Zero-Drop Lead Management Systems",
    description: "Streamlined CRM setups that capture, score, assign, and track leads automatically across your entire sales organization.",
    highlights: ["Multi-Channel Lead Sync", "Automated Task Assignment", "Real-Time Pipeline Analytics"]
  },
  {
    slug: "ai-business-automation",
    title: "AI & Business Automation",
    seoTitle: "AI Business Automation & Workflow Engineering | Opsiys",
    seoDesc: "Deploy autonomous AI agents, workflow automations, and custom intelligence tools to reduce operational costs and scale output.",
    icon: Cpu,
    tagline: "Autonomous Operations & Custom AI Workflows",
    description: "Cutting-edge artificial intelligence integrations designed to automate repetitive business tasks, data processing, and client queries.",
    highlights: ["Custom AI Chatbots & Agents", "Workflow Automation (Zapier/Make)", "Process Cost Reduction"]
  },
  {
    slug: "branding",
    title: "Branding & Visual Identity",
    seoTitle: "Corporate Branding & Visual Identity Systems | Opsiys",
    seoDesc: "Build an unforgettable brand image with cohesive visual systems, logo design, typography, and brand messaging guidelines.",
    icon: Sparkles,
    tagline: "Premium Brand Positioning & Identity",
    description: "Strategic branding packages that build instant trust, communicate enterprise quality, and set your business apart from competitors.",
    highlights: ["Brand Strategy & Messaging", "Logo & Visual Design Systems", "Brand Style Guidelines"]
  },
  {
    slug: "creative",
    title: "Creative Content, Photo & Video",
    seoTitle: "Creative Solutions, Photography & Videography | Opsiys",
    seoDesc: "High-impact visual media, brand photography, commercial video production, and creator marketing content for growth.",
    icon: Camera,
    tagline: "Compelling Visual Media for Digital Channels",
    description: "Professional photo and video production tailored for social media campaigns, website assets, product showcases, and brand storytelling.",
    highlights: ["Commercial Video Production", "Brand & Product Photography", "Creator & Social Content"]
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.4, ease: "easeOut" } 
  }
};

export const ServicesPage: React.FC = () => {
  return (
    <>
      <SEO
        title="Services | Business Growth Solutions & Digital Partner | Opsiys"
        description="Explore Opsiys growth solutions: SEO, Meta Ads, web development, WhatsApp automation, email systems, AI business automation, and branding."
        canonical="https://www.opsiys.in/services"
      />
      <div className="bg-[#FAFAFA] min-h-screen pt-28 pb-20">
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
                <span>Connected Solutions Engine</span>
              </Badge>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-tight text-black leading-tight">
                Growth Solutions
              </h1>
              <p className="text-zinc-600 text-base sm:text-lg leading-relaxed font-medium">
                We design, build, and optimize the digital infrastructure your business needs to build online presence, increase search visibility, generate leads, and automate growth.
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
                alt="Growth Solutions Engine"
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
              return (
                <motion.div 
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
                    <ul className="space-y-1.5 pt-2 border-t border-zinc-100">
                      {service.highlights.map((h, i) => (
                        <li key={i} className="text-[11px] font-medium text-zinc-500 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6">
                    <Link to={`/services/${service.slug}`}>
                      <Button variant="outline" className="w-full rounded-none border-zinc-300 group-hover:border-black font-bold text-xs uppercase tracking-widest flex items-center justify-between">
                        <span>Explore Solution</span>
                        <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-black group-hover:translate-x-1 transition-all" />
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* CTA Banner */}
          <div className="bg-black text-white rounded-2xl p-8 sm:p-12 text-center space-y-6 shadow-2xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight">
              Ready to Accelerate Your Business Growth?
            </h2>
            <p className="text-zinc-400 text-sm max-w-xl mx-auto leading-relaxed">
              Build Your Online Presence. Increase Your Visibility. Generate Opportunities. Automate Growth.
            </p>
            <a href="/#contact">
              <Button size="lg" className="bg-white text-black hover:bg-zinc-200 font-bold uppercase tracking-widest text-xs px-8 py-6 rounded-none">
                Request a Growth Consultation
              </Button>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
export default ServicesPage;
