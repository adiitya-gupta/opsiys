import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { SEO } from "../components/SEO";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, ArrowRight } from "lucide-react";

export const LOCATIONS_LIST = [
  {
    slug: "noida",
    name: "Noida",
    region: "Uttar Pradesh",
    seoTitle: "Business Growth & Digital Solutions Partner in Noida | Opsiys",
    seoDesc: "Opsiys helps Noida businesses, tech firms, real estate developers, and clinics build online visibility, rank in local search, and automate lead pipelines.",
    description: "Digital growth, local SEO, Meta ads, and business automation solutions for commercial hubs and enterprises in Noida.",
    focusAreas: ["Tech & IT Hubs", "Commercial Real Estate", "Medical & Diagnostic Clinics"]
  },
  {
    slug: "delhi-ncr",
    name: "Delhi NCR",
    region: "National Capital Region",
    seoTitle: "Business Growth Partner Delhi NCR | SEO, Ads & Automation | Opsiys",
    seoDesc: "Opsiys provides growth marketing, search engine optimization, web development, and CRM automation across Delhi, Gurgaon, Noida, and NCR.",
    description: "Regional growth partner services for enterprise brands, professional services, and high-growth companies across the Delhi NCR region.",
    focusAreas: ["Enterprise Services", "Omnichannel Growth", "Corporate Web Platforms"]
  },
  {
    slug: "gorakhpur",
    name: "Gorakhpur",
    region: "Eastern Uttar Pradesh",
    seoTitle: "Business Growth & Digital Solutions in Gorakhpur | Opsiys",
    seoDesc: "Helping local businesses, medical centers, retail brands, and institutions in Gorakhpur expand their online presence and capture regional leads.",
    description: "Local search authority, WhatsApp business messaging, and performance acquisition for expanding businesses in Gorakhpur.",
    focusAreas: ["Healthcare & Hospitals", "Retail & Commerce", "Coaching Institutes"]
  },
  {
    slug: "chandigarh",
    name: "Chandigarh",
    region: "Tricity Area",
    seoTitle: "Digital Growth & SEO Solutions in Chandigarh | Opsiys",
    seoDesc: "Transforming online presence for Chandigarh, Mohali, and Panchkula businesses with modern website development, Meta ads, and local SEO.",
    description: "Bespoke digital platforms, high-converting paid social ads, and search engine optimization for Tricity companies.",
    focusAreas: ["Boutique Clinics & Aesthetics", "Real Estate Brokers", "Professional Practices"]
  },
  {
    slug: "ludhiana",
    name: "Ludhiana",
    region: "Punjab",
    seoTitle: "Business Growth Partner in Ludhiana | Web & Automation | Opsiys",
    seoDesc: "Opsiys empowers Ludhiana manufacturers, commercial enterprises, and retail brands with automated lead pipelines and search visibility.",
    description: "B2B lead generation, corporate website development, and workflow automation for industrial and commercial leaders in Ludhiana.",
    focusAreas: ["Manufacturing & B2B", "Commercial Brands", "Export & Wholesale"]
  }
];

export const LocationsPage: React.FC = () => {
  return (
    <>
      <SEO
        title="Locations We Serve | Regional Business Growth Partner | Opsiys"
        description="Opsiys serves businesses across Noida, Delhi NCR, Gorakhpur, Chandigarh, and Ludhiana with localized SEO, digital solutions, and growth marketing."
        canonical="https://opsiys.in/locations"
      />

      <div className="bg-[#FAFAFA] min-h-screen pt-28 pb-20 overflow-hidden">
        <Breadcrumbs items={[{ label: "Locations" }]} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 space-y-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-left space-y-4 max-w-3xl"
          >
            <Badge variant="outline" className="rounded-full px-3 py-1 text-xs border-accent/20 text-accent bg-accent/5 font-mono uppercase tracking-widest">
              Regional Presence
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-tight text-black leading-tight">
              Locations & Market Focus
            </h1>
            <p className="text-zinc-600 text-base sm:text-lg leading-relaxed font-medium">
              We deliver tailored digital growth strategies, local search authority, and customer automation systems built for key commercial regions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {LOCATIONS_LIST.map((loc, idx) => (
              <motion.div 
                key={loc.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                whileHover={{ y: -4 }}
                className="bg-white border border-zinc-200 rounded-xl p-6 sm:p-8 flex flex-col justify-between hover:border-black transition-all hover:shadow-xl group"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-zinc-900 text-white flex items-center justify-center group-hover:bg-accent transition-colors">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold text-accent uppercase tracking-widest block">
                      {loc.region}
                    </span>
                    <h2 className="text-2xl font-bold uppercase tracking-tight text-black">
                      {loc.name}
                    </h2>
                  </div>
                  <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed">
                    {loc.description}
                  </p>
                  <ul className="space-y-1.5 pt-2 border-t border-zinc-100">
                    {loc.focusAreas.map((f, idx) => (
                      <li key={idx} className="text-[11px] font-medium text-zinc-500 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6">
                  <Link to={`/locations/${loc.slug}`}>
                    <Button variant="outline" className="w-full rounded-none border-zinc-300 group-hover:border-black font-bold text-xs uppercase tracking-widest flex items-center justify-between">
                      <span>View Location Growth Page</span>
                      <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-black group-hover:translate-x-1 transition-all" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-black text-white rounded-2xl p-8 sm:p-12 text-center space-y-6"
          >
            <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight">
              Serving Businesses Across India & Globally
            </h2>
            <p className="text-zinc-400 text-sm max-w-xl mx-auto leading-relaxed">
              Based in India, serving companies globally. We deploy cloud-based lead infrastructure and automation systems accessible anywhere.
            </p>
            <a href="/#contact">
              <Button size="lg" className="bg-white text-black hover:bg-zinc-200 font-bold uppercase tracking-widest text-xs px-8 py-6 rounded-none">
                Get Started
              </Button>
            </a>
          </motion.div>
        </div>
      </div>
    </>
  );
};
export default LocationsPage;

