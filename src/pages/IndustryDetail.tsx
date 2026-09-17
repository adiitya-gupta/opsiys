import React from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { SEO } from "../components/SEO";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ChevronRight, HelpCircle } from "lucide-react";

interface IndustryData {
  title: string;
  seoTitle: string;
  seoDesc: string;
  tagline: string;
  heroCopy: string;
  image: string;
  challenges: string[];
  solutions: string[];
  recommendedServices: { title: string; slug: string }[];
  faqs: { question: string; answer: string }[];
}

const INDUSTRY_DETAILS_MAP: Record<string, IndustryData> = {
  "clinics": {
    title: "Clinics & Healthcare Practices",
    seoTitle: "Digital Growth & Patient Acquisition for Clinics | Opsiys",
    seoDesc: "Opsiys helps medical clinics, dental practices, and specialist centers build local search presence, capture patient leads, and automate appointment reminders.",
    tagline: "Patient Acquisition & Local Search Dominance",
    heroCopy: "Modern medical practices need consistent patient acquisition, Google Maps pack visibility, and frictionless appointment booking systems.",
    image: "/images/clinic_growth.png",
    challenges: [
      "Inconsistent patient bookings during off-peak periods",
      "Competitor clinics outranking your practice in local Google Maps searches",
      "High front-desk phone volume resulting in missed patient inquiries",
      "Lack of automated appointment reminder sequences causing no-shows"
    ],
    solutions: [
      "Targeted Local SEO to rank your clinic in the top 3 Google Map Pack spots",
      "High-converting Meta ad campaigns targeting patients in your local radius",
      "24/7 WhatsApp chatbot integration for instant appointment requests",
      "Automated SMS & WhatsApp reminder sequences to eliminate no-shows"
    ],
    recommendedServices: [
      { title: "SEO Services", slug: "seo" },
      { title: "WhatsApp Automation", slug: "whatsapp-automation" },
      { title: "Qualified Lead Generation", slug: "lead-generation" }
    ],
    faqs: [
      { question: "How does local SEO help our clinic get more patients?", answer: "Local SEO optimizes your Google Business Profile and website so nearby patients searching for your medical specialty find your clinic first." },
      { question: "Can WhatsApp automation reduce patient no-shows?", answer: "Yes, sending automated WhatsApp confirmation and reminder messages 24 hours prior significantly improves appointment attendance rates." }
    ]
  },

  "real-estate": {
    title: "Real Estate Developers & Agencies",
    seoTitle: "Real Estate Digital Growth & Lead Generation | Opsiys",
    seoDesc: "Drive high-intent home buyers and investors to real estate projects with targeted Meta ads, automated property brochure bots, and CRM lead pipelines.",
    tagline: "High-Intent Property Buyer Acquisition Systems",
    heroCopy: "Real estate firms need high-volume, pre-qualified buyer inquiries and zero-delay sales team notifications to close site visits.",
    image: "/images/realestate_growth.png",
    challenges: [
      "Ad budgets spent on tire-kickers who don't have budget for property purchases",
      "Slow sales agent response time causing interested buyers to contact competing projects",
      "Manual distribution of digital property brochures and floor plans",
      "Lack of real-time visibility into sales pipeline conversion rates"
    ],
    solutions: [
      "Laser-targeted Meta & Search ad campaigns focused on active property buyers",
      "Interactive pre-qualification questionnaires before leads enter your CRM",
      "Instant WhatsApp bot delivering project brochures and booking site visits 24/7",
      "Automated lead assignment to sales reps with instant mobile notifications"
    ],
    recommendedServices: [
      { title: "Meta Ads Management", slug: "meta-ads" },
      { title: "CRM Pipeline Automation", slug: "crm-automation" },
      { title: "WhatsApp Automation", slug: "whatsapp-automation" }
    ],
    faqs: [
      { question: "How quickly do real estate leads get delivered to our sales agents?", answer: "Leads enter your CRM instantly within seconds of submission, triggering immediate WhatsApp and SMS alerts for sales reps." },
      { question: "Can we filter out unqualified buyers?", answer: "Yes, we integrate custom qualifying questions regarding budget, timeline, and location preferences directly into lead forms." }
    ]
  },

  "restaurants": {
    title: "Restaurants & Hospitality",
    seoTitle: "Digital Growth & Visual Branding for Restaurants | Opsiys",
    seoDesc: "Attract diners, boost table reservations, and build a magnetic brand presence with local search pack dominance, photography, and social campaigns.",
    tagline: "Local Search Dominance & Visual Media Production",
    heroCopy: "Restaurants and cafes thrive on high local search visibility, irresistible visual media content, and recurring customer loyalty.",
    image: "/images/restaurant_growth.png",
    challenges: [
      "Low visibility on Google local maps when diners search 'restaurants near me'",
      "Outdated menu media and amateur social photography that fails to excite customers",
      "High dependency on third-party aggregator commissions without building direct customer relationships",
      "Inability to re-engage past diners for special events and weekend promotions"
    ],
    solutions: [
      "Local Map Pack optimization ensuring your venue dominates local dining queries",
      "Commercial culinary photography and short-form video production for social media",
      "Direct customer database creation via digital menu scans and WiFi opt-ins",
      "Automated WhatsApp & Email broadcast campaigns for weekend events and offers"
    ],
    recommendedServices: [
      { title: "Creative & Media Solutions", slug: "creative" },
      { title: "SEO Services", slug: "seo" },
      { title: "Branding Systems", slug: "branding" }
    ],
    faqs: [
      { question: "How does Google Map Pack optimization help our restaurant?", answer: "Most diners select restaurants based on top Google map results. Ranking in the top 3 brings a consistent stream of new walk-in and reservation customers." },
      { question: "Do you produce food photography and videos on location?", answer: "Yes, our media production crew films on location to capture high-definition dishes, ambiance, and chef stories." }
    ]
  },

  "coaching": {
    title: "Coaching & Education Institutes",
    seoTitle: "Student Acquisition & Lead Generation for Coaching | Opsiys",
    seoDesc: "Scale student enrollments for competitive exams, professional certifications, and coaching programs through conversion funnels and automated follow-ups.",
    tagline: "Predictable Student Enrollment & Course Marketing",
    heroCopy: "Coaching centers and education providers require predictable student lead flow, high landing page conversion rates, and automated parent/student communication.",
    image: "/images/blog_online_presence.png",
    challenges: [
      "High cost per student enrollment across competitive education keywords",
      "Prospects dropping off after downloading course prospectuses",
      "Manual counseling call scheduling causing lost student sign-ups",
      "Fragmented marketing across social platforms without clear attribution"
    ],
    solutions: [
      "High-converting landing pages built specifically for course and workshop sign-ups",
      "Targeted Meta & Search ad campaigns focused on students and parents in key regions",
      "Automated email & WhatsApp drip sequences nurturing leads until counseling calls",
      "Integrated CRM setup tracking leads from initial inquiry to fee enrollment"
    ],
    recommendedServices: [
      { title: "Qualified Lead Generation", slug: "lead-generation" },
      { title: "Email Automation", slug: "email-automation" },
      { title: "Modern Website Development", slug: "website-development" }
    ],
    faqs: [
      { question: "How do automated drip sequences help education lead conversion?", answer: "Automated sequences continuously deliver success stories, syllabus breakdowns, and exam tips, building trust until prospects enroll." },
      { question: "Can we track which ad campaign generates the most enrolled students?", answer: "Yes, full end-to-end tracking connects ad clicks directly to enrolled student profiles in your CRM." }
    ]
  },

  "finance": {
    title: "Finance & Professional Services",
    seoTitle: "Digital Growth Solutions for Finance & Advisory | Opsiys",
    seoDesc: "Opsiys helps financial planners, advisory firms, and professional practices build corporate search authority, enterprise web platforms, and compliant CRM pipelines.",
    tagline: "Enterprise Trust & High-Net-Worth Client Acquisition",
    heroCopy: "Financial advisory firms, wealth managers, and corporate consultants require high-trust branding, enterprise web platforms, and authoritative organic search positioning.",
    image: "/images/hero_growth.png",
    challenges: [
      "Difficulty attracting high-net-worth clients online due to lack of visual brand authority",
      "Outdated web platforms that look unprofessional on mobile devices",
      "Strict compliance requirements for marketing communications and prospect data storage",
      "Manual follow-ups causing corporate inquiries to go unanswered"
    ],
    solutions: [
      "Modern, enterprise-grade web development engineered with maximum speed and security",
      "Thought-leadership SEO strategy positioning your partners on high-intent financial keywords",
      "High-trust corporate branding, visual identity, and pitch deck templates",
      "Automated, secure CRM pipelines with encrypted data workflows"
    ],
    recommendedServices: [
      { title: "Modern Website Development", slug: "website-development" },
      { title: "SEO Services", slug: "seo" },
      { title: "Business Growth Solutions", slug: "business-growth" }
    ],
    faqs: [
      { question: "How do you ensure data security for financial clients?", answer: "We implement modern HTTPS, encrypted form handling, and compliant CRM API integrations to protect client data." },
      { question: "Can SEO help our firm rank for specialized advisory keywords?", answer: "Yes, our targeted technical and content SEO places your firm at the top of Google for commercial advisory searches." }
    ]
  }
};

export const IndustryDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const industry = slug ? INDUSTRY_DETAILS_MAP[slug] : null;

  if (!industry) {
    return <Navigate to="/industries" replace />;
  }

  return (
    <>
      <SEO
        title={industry.seoTitle}
        description={industry.seoDesc}
        canonical={`https://opsiys.in/industries/${slug}`}
      />

      <div className="bg-[#FAFAFA] min-h-screen pt-28 pb-20 overflow-hidden">
        <Breadcrumbs
          items={[
            { label: "Industries", href: "/industries" },
            { label: industry.title }
          ]}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 space-y-16">
          {/* Hero section with image layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7 space-y-4 text-left"
            >
              <Badge variant="outline" className="rounded-full px-3 py-1 text-xs border-accent/20 text-accent bg-accent/5 font-mono uppercase tracking-widest">
                {industry.tagline}
              </Badge>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-tight text-black leading-tight">
                {industry.title}
              </h1>
              <p className="text-zinc-600 text-base sm:text-lg leading-relaxed font-medium">
                {industry.heroCopy}
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-5 rounded-2xl overflow-hidden border border-zinc-200 shadow-xl bg-zinc-900 h-64 sm:h-80"
            >
              <img 
                src={industry.image} 
                alt={industry.title} 
                className="w-full h-full object-cover object-center"
              />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white border border-red-200/80 rounded-xl p-6 sm:p-8 space-y-4 shadow-sm"
            >
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-red-500">
                [ Industry Friction Points ]
              </span>
              <h2 className="text-xl font-bold uppercase tracking-tight text-black">
                Common Operational & Growth Challenges
              </h2>
              <ul className="space-y-3">
                {industry.challenges.map((c, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-2" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-zinc-900 text-white border border-zinc-800 rounded-xl p-6 sm:p-8 space-y-4 shadow-xl"
            >
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-accent">
                [ The Opsiys Growth Blueprint ]
              </span>
              <h2 className="text-xl font-bold uppercase tracking-tight text-white">
                How We Solve & Scale Your Market Position
              </h2>
              <ul className="space-y-3">
                {industry.solutions.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold uppercase tracking-tight text-black">
              Recommended Growth Solutions for {industry.title}
            </h2>
            <div className="flex flex-wrap gap-3">
              {industry.recommendedServices.map((rs, idx) => (
                <Link key={idx} to={`/services/${rs.slug}`}>
                  <Badge variant="outline" className="px-4 py-2 text-xs font-bold border-zinc-300 hover:border-black hover:bg-black hover:text-white transition-colors cursor-pointer">
                    {rs.title}
                  </Badge>
                </Link>
              ))}
            </div>
          </motion.div>

          {industry.faqs && industry.faqs.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold uppercase tracking-tight text-black">
                Industry FAQs
              </h2>
              <div className="space-y-4">
                {industry.faqs.map((faq, idx) => (
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
            </motion.div>
          )}

          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-black text-white rounded-2xl p-8 sm:p-12 text-center space-y-6 shadow-2xl"
          >
            <h2 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight">
              Scale Your {industry.title} Operations
            </h2>
            <p className="text-zinc-400 text-sm max-w-lg mx-auto leading-relaxed">
              Book a consultation with our industry growth specialists to evaluate your digital presence and lead infrastructure.
            </p>
            <a href="/#contact">
              <Button size="lg" className="bg-white text-black hover:bg-zinc-200 font-bold uppercase tracking-widest text-xs px-8 py-6 rounded-none">
                Request a Growth Consultation
              </Button>
            </a>
          </motion.div>
        </div>
      </div>
    </>
  );
};
export default IndustryDetailPage;

