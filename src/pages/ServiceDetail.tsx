import React from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { SEO } from "../components/SEO";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { SERVICES_LIST } from "./Services";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CheckCircle2, HelpCircle, ChevronRight, PhoneCall } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface ServiceData {
  title: string;
  seoTitle: string;
  seoDesc: string;
  tagline: string;
  description: string;
  problem: string;
  solution: string;
  deliverables: string[];
  whoFor: string[];
  process: { step: string; title: string; desc: string }[];
  faqs: FAQItem[];
  relatedServices: { title: string; slug: string }[];
  relatedIndustries: { title: string; slug: string }[];
}

const SERVICE_DETAILS_MAP: Record<string, ServiceData> = {
  "business-growth": {
    title: "Business Growth Solutions",
    seoTitle: "Business Growth Solutions & Partner Services | Opsiys",
    seoDesc: "Opsiys helps companies scale with connected business growth strategies, digital visibility, lead generation, and automated workflows.",
    tagline: "Connected Strategy for Sustainable Revenue Expansion",
    description: "Our Business Growth Solutions provide ambitious business owners with a connected system for acquiring clients, increasing market visibility, and streamlining daily operations.",
    problem: "Many growing businesses struggle with disconnected marketing campaigns, inconsistent lead flow, and manual operational bottlenecks that cap revenue growth.",
    solution: "We align your online presence, search engine visibility, paid social acquisition, and automated CRM lead management into a single predictable growth system.",
    deliverables: [
      "Custom Digital Growth & Acquisition Strategy",
      "Full Online Visibility & Brand Positioning Audit",
      "Omnichannel Lead Pipeline Architecture",
      "Sales CRM & Follow-Up Automation System",
      "Monthly Growth Performance & Analytics Audits"
    ],
    whoFor: [
      "Clinics and healthcare practices seeking patient acquisition",
      "Real estate agencies and developers requiring qualified buyers",
      "Professional service providers and financial advisors",
      "Restaurants, gyms, and local consumer businesses expanding operations"
    ],
    process: [
      { step: "01", title: "Growth Audit", desc: "We evaluate your current online presence, lead sources, and operational bottlenecks." },
      { step: "02", title: "System Architecture", desc: "We design a connected acquisition funnel combining SEO, Meta Ads, and automated follow-ups." },
      { step: "03", title: "Execution & Deployment", desc: "Our team implements the websites, automations, campaigns, and tracking systems." },
      { step: "04", title: "Optimization & Scaling", desc: "We continuously refine performance based on conversion data and revenue goals." }
    ],
    faqs: [
      { question: "How does Opsiys act as a business growth partner?", answer: "We take full technical responsibility for building and managing your digital growth infrastructure—from web presence and lead generation to messaging automations." },
      { question: "How quickly can we expect measurable growth?", answer: "Paid acquisition campaigns and automations begin generating inquiries within days, while organic SEO and search visibility build exponential long-term momentum." }
    ],
    relatedServices: [
      { title: "SEO Services", slug: "seo" },
      { title: "Meta Ads Management", slug: "meta-ads" },
      { title: "CRM Pipeline Automation", slug: "crm-automation" }
    ],
    relatedIndustries: [
      { title: "Real Estate Growth", slug: "real-estate" },
      { title: "Clinics & Healthcare", slug: "clinics" },
      { title: "Finance & Advisory", slug: "finance" }
    ]
  },

  "digital-marketing": {
    title: "Digital Marketing Solutions",
    seoTitle: "Digital Marketing Services | Growth Marketing | Opsiys",
    seoDesc: "Drive measurable customer acquisition with data-backed digital marketing strategies across paid social, search, and content channels.",
    tagline: "Data-Driven Performance & Multi-Channel Marketing",
    description: "Our digital marketing services focus on capturing attention, building search authority, and driving high-intent prospects into your sales funnel.",
    problem: "Wasted ad spend on low-quality traffic, low conversion rates, and lack of clear revenue attribution.",
    solution: "We create full-funnel digital marketing campaigns that combine targeted ads, persuasive ad copy, conversion-optimized landing pages, and lead tracking.",
    deliverables: [
      "Multi-Channel Campaign Strategy & Execution",
      "Ad Creative Design & Video Copywriting",
      "Conversion Landing Page Optimization",
      "Real-Time ROI Tracking & Analytics Dashboard"
    ],
    whoFor: [
      "Businesses seeking predictable online lead generation",
      "Companies launching new products or entering competitive markets",
      "Brands wanting to optimize return on marketing spend"
    ],
    process: [
      { step: "01", title: "Audience Analysis", desc: "We identify your ideal customer profiles and high-converting audience segments." },
      { step: "02", title: "Creative Production", desc: "We design high-converting visual assets, ad copy, and landing pages." },
      { step: "03", title: "Campaign Launch", desc: "We deploy targeted ad campaigns across Meta, Search, and Display networks." },
      { step: "04", title: "Continuous Optimization", desc: "We A/B test creatives and scale top-performing ad channels." }
    ],
    faqs: [
      { question: "What ad channels do you manage?", answer: "We specialize in Meta Ads (Facebook & Instagram), Search Engine Ads, and retargeting display networks." },
      { question: "How do you measure marketing ROI?", answer: "We track verified cost-per-lead, conversion rates, and client acquisition pipelines in real time." }
    ],
    relatedServices: [
      { title: "Meta Ads Management", slug: "meta-ads" },
      { title: "Lead Generation", slug: "lead-generation" },
      { title: "Creative & Media", slug: "creative" }
    ],
    relatedIndustries: [
      { title: "Restaurants & Hospitality", slug: "restaurants" },
      { title: "Coaching & Education", slug: "coaching" }
    ]
  },

  "seo": {
    title: "Search Engine Optimization (SEO)",
    seoTitle: "SEO Services | Improve Search Visibility | Opsiys",
    seoDesc: "Opsiys helps businesses improve search visibility through keyword research, on-page SEO, technical SEO, local SEO and content optimization.",
    tagline: "Build Organic Search Authority & Local Market Dominance",
    description: "Our technical and content SEO services establish your business as the authoritative choice on Google for high-intent industry searches.",
    problem: "Low search visibility, competitors ranking higher on key commercial terms, and lack of organic organic lead flow.",
    solution: "We implement comprehensive technical site audits, strategic keyword research, on-page HTML optimization, schema markup, and local search authority.",
    deliverables: [
      "Comprehensive Technical & Architectural SEO Audit",
      "Commercial Keyword & Search Intent Mapping",
      "On-Page Heading, Content, and Metadata Optimization",
      "Local Map Pack & Business Profile Optimization",
      "Schema.org Structured Data Implementation"
    ],
    whoFor: [
      "Local service providers needing top Google Map Pack placements",
      "B2B companies seeking high-value organic search inquiries",
      "Healthcare practices and clinics competing in local catchments"
    ],
    process: [
      { step: "01", title: "Keyword Research", desc: "We identify high-value search terms used by ready-to-buy customers." },
      { step: "02", title: "Technical Optimization", desc: "We fix site crawlability, speed, mobile responsiveness, and schema tags." },
      { step: "03", title: "Content Enhancement", desc: "We craft authoritative, search-optimized page copy that answers user intent." },
      { step: "04", title: "Authority Growth", desc: "We optimize internal linking and local citations for sustained rankings." }
    ],
    faqs: [
      { question: "What is the difference between technical SEO and local SEO?", answer: "Technical SEO ensures search engines can crawl, index, and render your site fast, while local SEO optimizes your Google Map Pack presence for geographical searches." },
      { question: "How long does SEO take to produce results?", answer: "Technical fixes show impact within weeks, while organic rankings build compounding strength over 3 to 6 months." }
    ],
    relatedServices: [
      { title: "Modern Website Development", slug: "website-development" },
      { title: "Business Growth Solutions", slug: "business-growth" }
    ],
    relatedIndustries: [
      { title: "Clinics & Healthcare", slug: "clinics" },
      { title: "Real Estate", slug: "real-estate" }
    ]
  },

  "meta-ads": {
    title: "Meta Ads Management",
    seoTitle: "Meta Ads Management | Facebook & Instagram Advertising | Opsiys",
    seoDesc: "Opsiys manages high-converting Facebook and Instagram ad campaigns with precision targeting, creative testing, and lead attribution.",
    tagline: "Precision Paid Social Acquisition Systems",
    description: "Our Meta Ads management delivers targeted Facebook and Instagram campaigns built to generate qualified leads and high-intent buyer inquiries.",
    problem: "Ad budgets spent on audience clicks that never convert into actual sales inquiries or appointments.",
    solution: "We design custom ad creatives, test audience hooks, build lead capture funnels, and integrate immediate CRM notifications.",
    deliverables: [
      "Audience Research & Laser-Targeted Custom Audiences",
      "Ad Creative Design & High-Impact Video Copy",
      "Lead Form & Landing Page Funnel Setup",
      "Meta Pixel & Conversions API Tracking Setup"
    ],
    whoFor: [
      "Real estate firms selling residential or commercial properties",
      "Clinics offering high-value medical or aesthetic treatments",
      "Coaching and online education programs requiring qualified leads"
    ],
    process: [
      { step: "01", title: "Strategy & Offer", desc: "We craft an irresistible lead offer tailored to your target audience." },
      { step: "02", title: "Creative Build", desc: "We produce engaging image and video ad variants for testing." },
      { step: "03", title: "Testing & Scaling", desc: "We test ad angles and scale winning ad sets to maximize return." },
      { step: "04", title: "Lead Delivery", desc: "Inquiries are instantly pushed to your sales team via WhatsApp and CRM." }
    ],
    faqs: [
      { question: "Do you create the ad imagery and copy?", answer: "Yes, our team handles all ad copy, graphics, video formatting, and landing page setup." },
      { question: "How are leads delivered to us?", answer: "Leads enter your CRM instantly and trigger automated email and WhatsApp notifications." }
    ],
    relatedServices: [
      { title: "Lead Generation", slug: "lead-generation" },
      { title: "WhatsApp Automation", slug: "whatsapp-automation" }
    ],
    relatedIndustries: [
      { title: "Real Estate", slug: "real-estate" },
      { title: "Coaching", slug: "coaching" }
    ]
  },

  "lead-generation": {
    title: "Qualified Lead Generation",
    seoTitle: "Qualified Lead Generation Services & Pipeline Systems | Opsiys",
    seoDesc: "Build a consistent, automated pipeline of qualified B2B and B2C leads through integrated multi-channel funnels.",
    tagline: "Predictable Lead Flow Engineered for High Conversion",
    description: "Our lead generation systems combine targeted traffic, pre-qualification forms, and instant automated messaging to deliver high-quality client inquiries.",
    problem: "Inconsistent lead volume, low lead quality, and delayed sales team response times.",
    solution: "We build dedicated acquisition funnels that filter out non-qualifying leads and notify your team the instant a qualified inquiry submits.",
    deliverables: [
      "Custom Lead Capture Funnel Architecture",
      "Qualifying Questionnaire & Form Filters",
      "Automated Instant Lead Notifications (SMS/WhatsApp)",
      "CRM Lead Scoring & Assignment Rules"
    ],
    whoFor: [
      "B2B companies selling high-ticket services or contracts",
      "Healthcare practices filling specialized appointment calendars",
      "Financial advisory firms needing verified prospect inquiries"
    ],
    process: [
      { step: "01", title: "Qualification Setup", desc: "We define the exact criteria that separate qualified prospects from window shoppers." },
      { step: "02", title: "Funnel Build", desc: "We build dedicated landing pages and qualification forms." },
      { step: "03", title: "Traffic Activation", desc: "We connect targeted paid search and social campaigns to the funnel." },
      { step: "04", title: "Nurture Integration", desc: "Automated follow-up emails and messages keep leads engaged until closed." }
    ],
    faqs: [
      { question: "How do you ensure lead quality?", answer: "We implement custom qualifying questions and automated verification steps before leads reach your team." },
      { question: "Can we connect this to our existing CRM?", answer: "Yes, our lead pipelines seamlessly connect with HubSpot, Salesforce, Zoho, and custom CRMs." }
    ],
    relatedServices: [
      { title: "CRM Automation", slug: "crm-automation" },
      { title: "Meta Ads Management", slug: "meta-ads" }
    ],
    relatedIndustries: [
      { title: "Clinics", slug: "clinics" },
      { title: "Finance", slug: "finance" }
    ]
  },

  "website-development": {
    title: "Modern Website Development",
    seoTitle: "Website Development | Modern Business Websites | Opsiys",
    seoDesc: "Opsiys builds fast, responsive, conversion-focused business websites designed for modern user experience and search engine visibility.",
    tagline: "High-Speed, Conversion-Engineered Web Platforms",
    description: "Our web development service creates bespoke, mobile-optimized business websites engineered to load instantly, rank in search, and convert visitors into clients.",
    problem: "Slow, outdated websites that fail to convert visitors, look poor on mobile devices, or suffer from technical SEO errors.",
    solution: "We build clean frontend web platforms using modern web standards, optimized performance code, structured schema markup, and conversion UI.",
    deliverables: [
      "Bespoke Responsive Web Design (Desktop, Tablet, Mobile)",
      "Ultra-Fast Performance & Core Web Vitals Optimization",
      "Built-In Technical SEO & Schema Markup",
      "Lead Capture Forms & Interactive Chat Integrations",
      "CMS / Content Management Empowerment"
    ],
    whoFor: [
      "Growing businesses needing an enterprise-grade digital flagship",
      "Companies rebranding or launching new service divisions",
      "Service providers replacing slow legacy websites"
    ],
    process: [
      { step: "01", title: "Architecture & UX", desc: "We map out clear user journeys, page hierarchies, and conversion paths." },
      { step: "02", title: "Modern Design", desc: "We design custom visual mockups aligned with your brand positioning." },
      { step: "03", title: "Clean Frontend Build", desc: "We code high-speed, SEO-compliant components." },
      { step: "04", title: "Launch & Testing", desc: "We test responsiveness, accessibility, speed metrics, and forms before going live." }
    ],
    faqs: [
      { question: "Will our new website be mobile friendly?", answer: "Yes, every website we build is engineered mobile-first for flawless performance across all device sizes." },
      { question: "Is the site optimized for search engines?", answer: "Absolutely. Clean semantic HTML, speed optimization, meta tags, and structured JSON-LD schema are built into every page." }
    ],
    relatedServices: [
      { title: "SEO Services", slug: "seo" },
      { title: "Branding Solutions", slug: "branding" }
    ],
    relatedIndustries: [
      { title: "Real Estate", slug: "real-estate" },
      { title: "Restaurants", slug: "restaurants" }
    ]
  },

  "email-automation": {
    title: "Email Marketing & Automation",
    seoTitle: "Email Automation & Bulk Email Systems | Opsiys",
    seoDesc: "Turn prospects into clients with automated email nurture campaigns, bulk newsletter systems, and CRM email triggers.",
    tagline: "Automated Lifecycle Messaging & Client Retention",
    description: "Our email automation setups ensure every inquiry receives instant personal follow-up and long-term value sequences that build trust.",
    problem: "Leads growing cold due to delayed follow-up and lack of automated email lead nurturing.",
    solution: "We build automated email drip series, welcome sequences, appointment reminders, and re-engagement campaigns.",
    deliverables: [
      "Custom Automated Email Sequences (Welcome, Nurture, Sales)",
      "Email Deliverability & Domain Authentication Setup (SPF/DKIM/DMARC)",
      "Responsive Email Template Design",
      "Audience Segmentation & Behavioral Triggers"
    ],
    whoFor: [
      "Businesses with growing prospect databases",
      "Service firms needing structured onboarding series",
      "E-commerce & educational providers boosting repeat sales"
    ],
    process: [
      { step: "01", title: "Domain Authentication", desc: "We configure SPF, DKIM, and DMARC to guarantee high inbox deliverability." },
      { step: "02", title: "Sequence Copywriting", desc: "We write persuasive, brand-aligned email content tailored to search intent." },
      { step: "03", title: "Trigger Integration", desc: "We connect form submissions and lead actions to trigger automated emails." },
      { step: "04", title: "Performance Review", desc: "We monitor open rates, click rates, and conversions to refine messaging." }
    ],
    faqs: [
      { question: "How do you prevent emails from landing in SPAM?", answer: "We implement full technical email domain authentication and maintain clean list hygiene protocols." },
      { question: "Can email automation connect with our CRM?", answer: "Yes, sequences trigger automatically based on prospect stage changes in your CRM." }
    ],
    relatedServices: [
      { title: "CRM Automation", slug: "crm-automation" },
      { title: "WhatsApp Automation", slug: "whatsapp-automation" }
    ],
    relatedIndustries: [
      { title: "Coaching", slug: "coaching" },
      { title: "Finance", slug: "finance" }
    ]
  },

  "whatsapp-automation": {
    title: "WhatsApp Business Automation",
    seoTitle: "WhatsApp Automation & Business Messaging | Opsiys",
    seoDesc: "Opsiys sets up official WhatsApp Business API automations, chatbots, instant notifications, and broadcast messaging.",
    tagline: "High-Open Conversational Automation & Messaging",
    description: "Engage customers where they are most responsive. Our WhatsApp automations deliver 98% open rates with instant automated replies and broadcast engines.",
    problem: "Missed phone calls, slow response times, and low open rates on traditional communication channels.",
    solution: "We deploy official WhatsApp API integrations that send instant booking confirmations, answer FAQs 24/7, and route hot leads to live staff.",
    deliverables: [
      "Official WhatsApp Business API Setup & Verification",
      "24/7 Interactive FAQ & Lead Routing Chatbots",
      "Automated Booking & Appointment Reminder Workflows",
      "Broadcast Messaging & Segmented Campaign Engine"
    ],
    whoFor: [
      "Clinics and practices managing appointment schedules",
      "Real estate firms providing instant property brochures",
      "Local service businesses driving instant client conversations"
    ],
    process: [
      { step: "01", title: "API Onboarding", desc: "We verify your business phone number on the official WhatsApp Cloud API." },
      { step: "02", title: "Bot & Flow Design", desc: "We build intuitive conversational flows to answer questions and capture data." },
      { step: "03", title: "System Integration", desc: "We sync WhatsApp messages directly with your CRM and lead notifications." },
      { step: "04", title: "Launch & Monitoring", desc: "We test message delivery and optimize chatbot resolution rates." }
    ],
    faqs: [
      { question: "Is this using the official WhatsApp Business API?", answer: "Yes, we implement official WhatsApp API connections to ensure account compliance and high deliverability." },
      { question: "Can multiple team members respond to WhatsApp chats?", answer: "Yes, an shared team inbox allows multiple agents to manage customer conversations simultaneously." }
    ],
    relatedServices: [
      { title: "AI Business Automation", slug: "ai-business-automation" },
      { title: "Email Automation", slug: "email-automation" }
    ],
    relatedIndustries: [
      { title: "Clinics", slug: "clinics" },
      { title: "Real Estate", slug: "real-estate" }
    ]
  },

  "crm-automation": {
    title: "CRM & Pipeline Automation",
    seoTitle: "CRM Automation & Lead Pipeline Integration | Opsiys",
    seoDesc: "Connect your marketing lead sources into an automated CRM pipeline to eliminate manual data entry and increase sales conversion.",
    tagline: "Automated Lead Management & Zero-Drop Pipelines",
    description: "Our CRM automation service connects your website forms, social ads, and phone leads into a unified pipeline that tracks every prospect from inquiry to closed deal.",
    problem: "Leads slipping through the cracks due to messy spreadsheets, manual data entry, and unassigned tasks.",
    solution: "We build automated Zapier/Make/native CRM workflows that capture, score, and assign leads instantly to sales reps with follow-up tasks.",
    deliverables: [
      "Multi-Channel CRM Integration & Pipeline Architecture",
      "Automated Lead Scoring & Territory Assignment",
      "Task Reminders & Stale Deal Alerts",
      "Executive Revenue & Pipeline Reporting Dashboards"
    ],
    whoFor: [
      "Growing sales teams handling dozens of weekly inquiries",
      "Service businesses needing structured lead management",
      "Companies wanting complete visibility into sales team performance"
    ],
    process: [
      { step: "01", title: "Pipeline Mapping", desc: "We define your exact sales stages, lead states, and team responsibilities." },
      { step: "02", title: "CRM Setup", desc: "We configure your CRM software with custom deal stages and custom fields." },
      { step: "03", title: "Workflow Automation", desc: "We build automations to handle data sync, notifications, and task creation." },
      { step: "04", title: "Team Onboarding", desc: "We train your team to use the automated pipeline efficiently." }
    ],
    faqs: [
      { question: "Which CRMs do you support?", answer: "We work with HubSpot, Salesforce, Zoho, Pipedrive, GoHighLevel, and custom CRM platforms." },
      { question: "What happens when a lead submits a form on our site?", answer: "The lead instantly enters the CRM, receives an automated confirmation, and triggers an alert for your sales team." }
    ],
    relatedServices: [
      { title: "Qualified Lead Generation", slug: "lead-generation" },
      { title: "AI Business Automation", slug: "ai-business-automation" }
    ],
    relatedIndustries: [
      { title: "Real Estate", slug: "real-estate" },
      { title: "Finance", slug: "finance" }
    ]
  },

  "ai-business-automation": {
    title: "AI & Business Automation",
    seoTitle: "AI Business Automation & Workflow Engineering | Opsiys",
    seoDesc: "Deploy autonomous AI agents, intelligent chatbots, and workflow automations to reduce manual operational costs and scale company output.",
    tagline: "Autonomous Operations & Intelligent AI Workflows",
    description: "Our AI business automation services replace repetitive manual work with intelligent AI agents, custom workflow automations, and smart data processing.",
    problem: "High labor costs, manual data copying, slow response times, and operational bottlenecks scaling up.",
    solution: "We build custom AI chatbots, document processing pipelines, and autonomous workflow engines that handle routine work 24/7 without error.",
    deliverables: [
      "Custom AI Assistant & Knowledge Base Integration",
      "Zapier / Make / Python Operational Workflows",
      "Automated Client Inquiry & Support Systems",
      "Internal Process Cost Optimization Audit"
    ],
    whoFor: [
      "Businesses seeking to increase operational throughput without ballooning headcount",
      "Teams spending hours on repetitive data entry and customer reporting",
      "Service providers needing 24/7 intelligent customer interactions"
    ],
    process: [
      { step: "01", title: "Process Audit", desc: "We identify manual, repetitive tasks that consume valuable team hours." },
      { step: "02", title: "AI Architecture", desc: "We design AI prompt flows, agent behaviors, and API connections." },
      { step: "03", title: "Implementation", desc: "We build and integrate AI models with your existing business tools." },
      { step: "04", title: "Verification", desc: "We thoroughly test AI outputs for accuracy, speed, and reliability." }
    ],
    faqs: [
      { question: "How safe is AI automation for our business data?", answer: "We deploy secure API connections with strict data privacy protocols to keep your proprietary business data safe." },
      { question: "Will AI replace our staff?", answer: "AI automations empower your team by removing tedious manual tasks so they can focus on high-value client relationships." }
    ],
    relatedServices: [
      { title: "WhatsApp Automation", slug: "whatsapp-automation" },
      { title: "CRM Automation", slug: "crm-automation" }
    ],
    relatedIndustries: [
      { title: "Clinics", slug: "clinics" },
      { title: "Finance", slug: "finance" }
    ]
  },

  "branding": {
    title: "Branding & Visual Identity",
    seoTitle: "Corporate Branding & Visual Identity Systems | Opsiys",
    seoDesc: "Establish a high-trust corporate brand identity with custom visual design, logo architecture, typography, and messaging guidelines.",
    tagline: "Strategic Brand Positioning & Enterprise Visual Design",
    description: "Our branding services transform your business image into a high-trust, premium brand that attracts high-value clients and stands out in competitive markets.",
    problem: "Outdated visual identity, inconsistent messaging across platforms, and lack of brand distinction from competitors.",
    solution: "We develop comprehensive brand identity systems including logo marks, color palettes, typography, brand voice guidelines, and marketing templates.",
    deliverables: [
      "Comprehensive Brand Strategy & Positioning Guide",
      "Primary & Secondary Logo System Architecture",
      "Color Palette & Typography Hierarchy Specs",
      "Digital & Print Marketing Assets Guidelines"
    ],
    whoFor: [
      "Established businesses elevating their brand market position",
      "Startups launching new commercial offerings",
      "Companies merging or modernizing their visual assets"
    ],
    process: [
      { step: "01", title: "Brand Discovery", desc: "We analyze your market, competitors, and core value proposition." },
      { step: "02", title: "Visual Direction", desc: "We present mood boards, concept directions, and messaging pillars." },
      { step: "03", title: "Design System", desc: "We craft final vector logos, color codes, font pairs, and layout rules." },
      { step: "04", title: "Guidelines Delivery", desc: "We compile an actionable Brand Style Guide for all future company assets." }
    ],
    faqs: [
      { question: "What files do we receive with a branding package?", answer: "You receive vector master files (SVG, EPS, AI), high-resolution web formats (PNG, JPG), font assets, and a PDF brand guide." },
      { question: "Can branding be integrated directly into our website build?", answer: "Yes, our web development team uses your brand guidelines to build a completely cohesive digital presence." }
    ],
    relatedServices: [
      { title: "Modern Website Development", slug: "website-development" },
      { title: "Creative Solutions", slug: "creative" }
    ],
    relatedIndustries: [
      { title: "Restaurants", slug: "restaurants" },
      { title: "Coaching", slug: "coaching" }
    ]
  },

  "creative": {
    title: "Creative Content, Photo & Video",
    seoTitle: "Creative Solutions, Photography & Videography | Opsiys",
    seoDesc: "High-impact visual media production, commercial videography, brand photography, and creator marketing content for growth.",
    tagline: "High-Converting Visual Media & Production",
    description: "Our creative media production delivers commercial-grade video, photography, and social content designed to capture attention and communicate brand quality.",
    problem: "Low-quality stock photos and amateur videos that reduce brand credibility and fail to convert in ad campaigns.",
    solution: "We shoot, edit, and format professional visual media specifically crafted for ad campaigns, website heroes, and social engagement.",
    deliverables: [
      "Commercial Brand & Promotional Video Production",
      "High-Resolution Product & Service Photography",
      "Social Media Video Formats (Reels, TikToks, Shorts)",
      "Creator & Influencer Marketing Assets"
    ],
    whoFor: [
      "Restaurants, clinics, and spaces showcasing physical environments",
      "Brands running visual Meta and YouTube ad campaigns",
      "Companies launching premium products or specialized services"
    ],
    process: [
      { step: "01", title: "Creative Brief", desc: "We define shot lists, visual themes, script hooks, and campaign goals." },
      { step: "02", title: "Production Shoot", desc: "Our media crew handles lighting, audio, high-definition filming, and direction." },
      { step: "03", title: "Post-Production", desc: "We edit, color grade, add motion graphics, and format for multi-channel use." },
      { step: "04", title: "Asset Delivery", desc: "Final assets are delivered ready for immediate web, ad, and social deployment." }
    ],
    faqs: [
      { question: "Are video assets formatted for social media and ads?", answer: "Yes, we deliver videos optimized in vertical (9:16), horizontal (16:9), and square (1:1) aspect ratios." },
      { question: "Can you combine creative production with Meta ad campaigns?", answer: "Yes, creative content produced by our team directly powers our high-ROI Meta ad strategies." }
    ],
    relatedServices: [
      { title: "Meta Ads Management", slug: "meta-ads" },
      { title: "Branding Solutions", slug: "branding" }
    ],
    relatedIndustries: [
      { title: "Restaurants", slug: "restaurants" },
      { title: "Clinics", slug: "clinics" }
    ]
  }
};

export const ServiceDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const service = slug ? SERVICE_DETAILS_MAP[slug] : null;

  if (!service) {
    return <Navigate to="/services" replace />;
  }

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.title,
    "provider": {
      "@type": "Organization",
      "name": "OPSIYS Systems Inc.",
      "url": "https://opsiys.in/"
    },
    "description": service.seoDesc,
    "areaServed": "Global",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": service.title,
      "itemListElement": service.deliverables.map((item, idx) => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": item
        }
      }))
    }
  };

  const faqSchema = service.faqs && service.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": service.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;

  return (
    <>
      <SEO
        title={service.seoTitle}
        description={service.seoDesc}
        canonical={`https://opsiys.in/services/${slug}`}
        schema={faqSchema ? [serviceSchema, faqSchema] : [serviceSchema]}
      />
      
      <div className="bg-[#FAFAFA] min-h-screen pt-28 pb-20">
        <Breadcrumbs 
          items={[
            { label: "Services", href: "/services" },
            { label: service.title }
          ]} 
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 space-y-16">
          {/* Header */}
          <div className="space-y-4 max-w-4xl text-left">
            <Badge variant="outline" className="rounded-full px-3 py-1 text-xs border-accent/20 text-accent bg-accent/5 font-mono uppercase tracking-widest">
              {service.tagline}
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-tight text-black leading-tight">
              {service.title}
            </h1>
            <p className="text-zinc-600 text-base sm:text-lg leading-relaxed font-medium">
              {service.description}
            </p>
          </div>

          {/* Problem vs Solution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white border border-red-200/80 rounded-xl p-6 sm:p-8 space-y-4 shadow-sm">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-red-500">
                [ The Business Challenge ]
              </span>
              <h2 className="text-xl font-bold uppercase tracking-tight text-black">
                Obstacles Companies Encounter
              </h2>
              <p className="text-zinc-600 text-sm leading-relaxed">
                {service.problem}
              </p>
            </div>

            <div className="bg-zinc-900 text-white border border-zinc-800 rounded-xl p-6 sm:p-8 space-y-4 shadow-xl">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-accent">
                [ The Opsiys Solution ]
              </span>
              <h2 className="text-xl font-bold uppercase tracking-tight text-white">
                How We Resolve & Scale It
              </h2>
              <p className="text-zinc-300 text-sm leading-relaxed">
                {service.solution}
              </p>
            </div>
          </div>

          {/* Deliverables */}
          <div className="bg-white border border-zinc-200 rounded-xl p-6 sm:p-10 space-y-6 shadow-sm">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-accent uppercase tracking-widest">
                [ Deliverables & Capabilities ]
              </span>
              <h2 className="text-2xl font-bold uppercase tracking-tight text-black">
                What We Build & Deliver
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {service.deliverables.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 bg-zinc-50 border border-zinc-100 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm font-semibold text-zinc-800">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Process */}
          <div className="space-y-8">
            <div className="space-y-1 text-left">
              <span className="text-xs font-mono font-bold text-accent uppercase tracking-widest">
                [ Systematic Implementation ]
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-black">
                Our Implementation Process
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {service.process.map((p, idx) => (
                <div key={idx} className="bg-white border border-zinc-200 rounded-xl p-6 space-y-3 relative overflow-hidden">
                  <span className="text-4xl font-extrabold text-zinc-100 font-mono absolute top-4 right-4 pointer-events-none">
                    {p.step}
                  </span>
                  <h3 className="text-lg font-bold uppercase tracking-tight text-black relative z-10">
                    {p.title}
                  </h3>
                  <p className="text-xs text-zinc-600 leading-relaxed relative z-10">
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Who It's For */}
          <div className="bg-zinc-100 border border-zinc-200 rounded-xl p-6 sm:p-8 space-y-4">
            <h2 className="text-xl font-bold uppercase tracking-tight text-black">
              Who This Solution Is Designed For
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {service.whoFor.map((w, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-zinc-700 font-medium">
                  <ChevronRight className="w-4 h-4 text-accent shrink-0" />
                  <span>{w}</span>
                </div>
              ))}
            </div>
          </div>

          {/* FAQs */}
          {service.faqs && service.faqs.length > 0 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-accent uppercase tracking-widest">
                  [ Clarity & Answers ]
                </span>
                <h2 className="text-2xl font-bold uppercase tracking-tight text-black">
                  Frequently Asked Questions
                </h2>
              </div>
              <div className="space-y-4">
                {service.faqs.map((faq, idx) => (
                  <div key={idx} className="bg-white border border-zinc-200 rounded-xl p-6 space-y-2">
                    <h3 className="text-base font-bold text-black flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-accent shrink-0" />
                      <span>{faq.question}</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed pl-6">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Internal Linking: Related Services & Industries */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-zinc-200">
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-black">
                Related Growth Solutions
              </h3>
              <div className="flex flex-wrap gap-2">
                {service.relatedServices.map((rs, idx) => (
                  <Link key={idx} to={`/services/${rs.slug}`}>
                    <Badge variant="outline" className="px-3 py-1.5 text-xs border-zinc-300 hover:border-black hover:bg-black hover:text-white transition-colors cursor-pointer">
                      {rs.title}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-black">
                Industry Applications
              </h3>
              <div className="flex flex-wrap gap-2">
                {service.relatedIndustries.map((ri, idx) => (
                  <Link key={idx} to={`/industries/${ri.slug}`}>
                    <Badge variant="outline" className="px-3 py-1.5 text-xs border-zinc-300 hover:border-black hover:bg-black hover:text-white transition-colors cursor-pointer">
                      {ri.title}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-black text-white rounded-2xl p-8 sm:p-12 text-center space-y-6 shadow-2xl">
            <h2 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight">
              Ready to Implement {service.title}?
            </h2>
            <p className="text-zinc-400 text-sm max-w-lg mx-auto leading-relaxed">
              Schedule a strategy call with our growth engineering team to discuss your project requirements and custom roadmap.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/#contact">
                <Button size="lg" className="bg-white text-black hover:bg-zinc-200 font-bold uppercase tracking-widest text-xs px-8 py-6 rounded-none">
                  Request a Growth Consultation
                </Button>
              </a>
              <Link to="/services">
                <Button variant="outline" size="lg" className="border-zinc-700 text-white hover:border-white font-bold uppercase tracking-widest text-xs px-8 py-6 rounded-none">
                  View All Solutions
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};
export default ServiceDetailPage;
