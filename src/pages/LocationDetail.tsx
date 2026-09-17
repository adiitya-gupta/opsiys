import React from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { SEO } from "../components/SEO";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, CheckCircle2, ChevronRight, HelpCircle } from "lucide-react";

interface LocationData {
  name: string;
  region: string;
  seoTitle: string;
  seoDesc: string;
  tagline: string;
  overview: string;
  marketLandscape: string;
  keyServices: { title: string; slug: string; desc: string }[];
  industriesServed: { title: string; slug: string }[];
  faqs: { question: string; answer: string }[];
}

const LOCATION_DETAILS_MAP: Record<string, LocationData> = {
  "noida": {
    name: "Noida",
    region: "Uttar Pradesh",
    seoTitle: "Business Growth & Digital Solutions Partner in Noida | Opsiys",
    seoDesc: "Opsiys helps Noida tech companies, real estate firms, clinics, and local commercial brands increase search visibility, generate leads, and automate client pipelines.",
    tagline: "Digital Growth & Local Market Dominance in Noida",
    overview: "Noida is one of India's fastest-growing commercial and technological hubs. Standing out requires robust local search presence, high-converting digital ad channels, and automated lead follow-up.",
    marketLandscape: "With dense commercial sectors, real estate developments, and tech parks across Noida and Greater Noida, businesses face intense competition for qualified digital leads.",
    keyServices: [
      { title: "Local SEO & Google Maps Optimization", slug: "seo", desc: "Position your Noida business at the top of local Google Map Pack searches." },
      { title: "Meta Ads & Buyer Acquisition", slug: "meta-ads", desc: "Target high-intent Noida residential buyers and commercial clients." },
      { title: "WhatsApp Business API Automation", slug: "whatsapp-automation", desc: "Instant automated responses for local customer inquiries 24/7." }
    ],
    industriesServed: [
      { title: "Real Estate Developers", slug: "real-estate" },
      { title: "Clinics & Healthcare", slug: "clinics" },
      { title: "Finance & Advisory", slug: "finance" }
    ],
    faqs: [
      { question: "How does local SEO help businesses in Noida?", answer: "Local SEO optimizes your Google Business Profile and local keywords so customers in Noida, Greater Noida, and nearby sectors find your service first." },
      { question: "Can Opsiys help Noida real estate developers generate buyers?", answer: "Yes, our targeted Meta ads, WhatsApp brochure bots, and CRM lead pipelines deliver pre-qualified buyer inquiries for Noida residential and commercial projects." }
    ]
  },

  "delhi-ncr": {
    name: "Delhi NCR",
    region: "National Capital Region",
    seoTitle: "Business Growth Partner Delhi NCR | SEO, Ads & Automation | Opsiys",
    seoDesc: "Opsiys provides growth marketing, search engine optimization, modern web platforms, and business automation across Delhi, Gurgaon, Noida, and NCR.",
    tagline: "Regional Digital Infrastructure Across Delhi NCR",
    overview: "Operating across the Delhi National Capital Region demands an integrated growth approach that combines search authority, multi-channel advertising, and seamless CRM lead management.",
    marketLandscape: "The Delhi NCR market is highly competitive across corporate, medical, real estate, and consumer sectors. Brands must offer fast web experiences and instant communication.",
    keyServices: [
      { title: "Business Growth Solutions", slug: "business-growth", desc: "Connected acquisition and operational pipelines across NCR markets." },
      { title: "Modern Website Development", slug: "website-development", desc: "Enterprise-grade web platforms built for speed, SEO, and conversion." },
      { title: "Qualified Lead Generation", slug: "lead-generation", desc: "Predictable B2B and B2C lead pipelines for NCR companies." }
    ],
    industriesServed: [
      { title: "Finance & Professional Services", slug: "finance" },
      { title: "Clinics & Healthcare", slug: "clinics" },
      { title: "Coaching & Education", slug: "coaching" }
    ],
    faqs: [
      { question: "Does Opsiys handle multi-location marketing across Delhi NCR?", answer: "Yes, we build integrated SEO and campaign structures that target specific NCR sub-markets including Gurgaon, Delhi, and Noida." },
      { question: "What web development tech do you use for NCR businesses?", answer: "We build modern, ultra-fast frontend platforms optimized for search speed, security, and conversion UX." }
    ]
  },

  "gorakhpur": {
    name: "Gorakhpur",
    region: "Eastern Uttar Pradesh",
    seoTitle: "Business Growth & Digital Solutions in Gorakhpur | Opsiys",
    seoDesc: "Helping local businesses, medical centers, retail brands, and institutes in Gorakhpur build digital visibility, rank on Google, and capture regional leads.",
    tagline: "Local Visibility & Digital Business Expansion in Gorakhpur",
    overview: "Gorakhpur is rapidly emerging as an economic and medical epicenter in Eastern UP. Establishing top search rankings and instant WhatsApp automation gives local businesses a major competitive edge.",
    marketLandscape: "Consumer and patient search behavior in Gorakhpur has shifted heavily to mobile devices and Google local search. Businesses with fast websites and instant messaging capture the majority of market demand.",
    keyServices: [
      { title: "Search Engine Optimization (SEO)", slug: "seo", desc: "Dominate local Google searches across Gorakhpur and surrounding catchments." },
      { title: "WhatsApp Business Messaging", slug: "whatsapp-automation", desc: "Engage local Gorakhpur customers instantly on WhatsApp with automated bots." },
      { title: "Digital Marketing & Ads", slug: "digital-marketing", desc: "Targeted campaigns bringing regional clients directly into your business." }
    ],
    industriesServed: [
      { title: "Clinics & Healthcare Practices", slug: "clinics" },
      { title: "Coaching Institutes", slug: "coaching" },
      { title: "Restaurants & Hospitality", slug: "restaurants" }
    ],
    faqs: [
      { question: "Why is WhatsApp automation effective for Gorakhpur businesses?", answer: "WhatsApp is the primary daily communication tool in Gorakhpur. Automated replies ensure instant customer responses even during peak business hours." },
      { question: "Can Opsiys help Gorakhpur clinics attract regional patients?", answer: "Yes, our targeted Google local SEO and Meta campaigns reach patients across Gorakhpur and neighboring districts." }
    ]
  },

  "chandigarh": {
    name: "Chandigarh",
    region: "Tricity Area",
    seoTitle: "Digital Growth & SEO Solutions in Chandigarh | Opsiys",
    seoDesc: "Transforming online presence for Chandigarh, Mohali, and Panchkula businesses with modern web development, Meta ads, and local SEO.",
    tagline: "High-Trust Digital Branding & Growth in Chandigarh Tricity",
    overview: "The Chandigarh Tricity area demands sleek visual branding, high-speed modern websites, and targeted performance marketing that appeals to discerning clients.",
    marketLandscape: "With growing healthcare, real estate, boutique, and education sectors in Chandigarh, Mohali, and Panchkula, premium brand presentation and search authority are paramount.",
    keyServices: [
      { title: "Modern Website Development", slug: "website-development", desc: "Bespoke, high-speed digital flagships designed for Tricity businesses." },
      { title: "Corporate Branding & Media", slug: "branding", desc: "Premium visual identity systems that build instant market trust." },
      { title: "Meta Ads & Lead Generation", slug: "meta-ads", desc: "High-converting social ad campaigns targeting Chandigarh prospects." }
    ],
    industriesServed: [
      { title: "Clinics & Healthcare", slug: "clinics" },
      { title: "Real Estate Agencies", slug: "real-estate" },
      { title: "Finance & Advisory", slug: "finance" }
    ],
    faqs: [
      { question: "Do you service Mohali and Panchkula businesses alongside Chandigarh?", answer: "Yes, our growth solutions cover the entire Tricity catchment area including Chandigarh, Mohali, and Panchkula." },
      { question: "How does modern website design improve client conversions in Chandigarh?", answer: "A fast, beautifully designed website builds immediate corporate credibility, encouraging prospects to submit inquiries." }
    ]
  },

  "ludhiana": {
    name: "Ludhiana",
    region: "Punjab",
    seoTitle: "Business Growth Partner in Ludhiana | Web & Automation | Opsiys",
    seoDesc: "Opsiys empowers Ludhiana manufacturers, commercial enterprises, and retail brands with automated lead pipelines, search visibility, and CRM systems.",
    tagline: "Industrial & Commercial Growth Engineering in Ludhiana",
    overview: "As Punjab's premier industrial and commercial hub, Ludhiana businesses require strong B2B online visibility, modern web assets, and automated CRM lead pipelines.",
    marketLandscape: "Ludhiana manufacturers and commercial firms face expanding domestic and international buyer queries. Digitizing sales pipelines and ranking on search engines is essential for market leadership.",
    keyServices: [
      { title: "Qualified Lead Generation", slug: "lead-generation", desc: "B2B and B2C lead pipelines connecting prospects to your sales team." },
      { title: "CRM & Pipeline Automation", slug: "crm-automation", desc: "Zero-drop lead management setups for Ludhiana commercial teams." },
      { title: "Search Engine Optimization (SEO)", slug: "seo", desc: "Rank for commercial and industrial search terms on Google." }
    ],
    industriesServed: [
      { title: "Finance & Professional Services", slug: "finance" },
      { title: "Real Estate Developers", slug: "real-estate" },
      { title: "Restaurants & Hospitality", slug: "restaurants" }
    ],
    faqs: [
      { question: "Can Opsiys help Ludhiana B2B companies capture trade leads?", answer: "Yes, our combined SEO, targeted ad, and CRM pipeline strategies capture and qualify high-value business buyer inquiries." },
      { question: "How does CRM automation help Ludhiana sales teams?", answer: "It eliminates manual data entry, assigns leads automatically, and sends follow-up alerts to ensure no sales deal falls through." }
    ]
  }
};

export const LocationDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const location = slug ? LOCATION_DETAILS_MAP[slug] : null;

  if (!location) {
    return <Navigate to="/locations" replace />;
  }

  return (
    <>
      <SEO
        title={location.seoTitle}
        description={location.seoDesc}
        canonical={`https://www.opsiys.in/locations/${slug}`}
      />

      <div className="bg-[#FAFAFA] min-h-screen pt-28 pb-20 overflow-hidden">
        <Breadcrumbs
          items={[
            { label: "Locations", href: "/locations" },
            { label: location.name }
          ]}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 space-y-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4 max-w-4xl text-left"
          >
            <Badge variant="outline" className="rounded-full px-3 py-1 text-xs border-accent/20 text-accent bg-accent/5 font-mono uppercase tracking-widest flex items-center gap-1.5 w-fit">
              <MapPin className="w-3.5 h-3.5" />
              <span>{location.region}</span>
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-tight text-black leading-tight">
              {location.name} Growth Solutions
            </h1>
            <p className="text-zinc-600 text-base sm:text-lg leading-relaxed font-medium">
              {location.overview}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white border border-zinc-200 rounded-xl p-6 sm:p-8 space-y-3"
          >
            <span className="text-xs font-mono font-bold text-accent uppercase tracking-widest">
              [ Market Context ]
            </span>
            <h2 className="text-xl font-bold uppercase tracking-tight text-black">
              The Digital Market Opportunity in {location.name}
            </h2>
            <p className="text-zinc-600 text-sm leading-relaxed">
              {location.marketLandscape}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold uppercase tracking-tight text-black">
              Key Growth Services for {location.name} Businesses
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {location.keyServices.map((ks, idx) => (
                <div key={idx} className="bg-white border border-zinc-200 rounded-xl p-6 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-black uppercase tracking-tight">
                      {ks.title}
                    </h3>
                    <p className="text-xs text-zinc-600 leading-relaxed">
                      {ks.desc}
                    </p>
                  </div>
                  <Link to={`/services/${ks.slug}`} className="pt-4">
                    <Button variant="outline" className="w-full text-xs font-bold uppercase tracking-widest rounded-none border-zinc-300 hover:border-black">
                      Explore Service
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold uppercase tracking-tight text-black">
              Key Industries We Support in {location.name}
            </h2>
            <div className="flex flex-wrap gap-3">
              {location.industriesServed.map((ind, idx) => (
                <Link key={idx} to={`/industries/${ind.slug}`}>
                  <Badge variant="outline" className="px-4 py-2 text-xs font-bold border-zinc-300 hover:border-black hover:bg-black hover:text-white transition-colors cursor-pointer">
                    {ind.title}
                  </Badge>
                </Link>
              ))}
            </div>
          </motion.div>

          {location.faqs && location.faqs.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold uppercase tracking-tight text-black">
                {location.name} Business FAQs
              </h2>
              <div className="space-y-4">
                {location.faqs.map((faq, idx) => (
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
              Expand Your Business in {location.name}
            </h2>
            <p className="text-zinc-400 text-sm max-w-lg mx-auto leading-relaxed">
              Schedule a strategy call with our digital growth team to evaluate your local online presence and lead infrastructure.
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
export default LocationDetailPage;

