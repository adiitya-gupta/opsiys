import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { SEO } from "../components/SEO";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Stethoscope, 
  Utensils, 
  GraduationCap, 
  Landmark, 
  ArrowRight 
} from "lucide-react";

export const INDUSTRIES_LIST = [
  {
    slug: "clinics",
    title: "Clinics & Healthcare Practices",
    seoTitle: "Digital Growth Solutions for Clinics & Healthcare | Opsiys",
    seoDesc: "Opsiys helps clinics, dental practices, and aesthetic centers attract patient inquiries, build local search presence, and automate appointment confirmations.",
    icon: Stethoscope,
    image: "/images/clinic_growth.png",
    tagline: "Patient Acquisition & Local Search Authority",
    description: "Tailored digital growth systems for medical practices, specialized clinics, dental centers, and healthcare providers.",
    highlights: ["Patient Appointment Funnels", "Google Maps & Local SEO", "WhatsApp Booking Automations"]
  },
  {
    slug: "real-estate",
    title: "Real Estate Developers & Agencies",
    seoTitle: "Real Estate Lead Generation & Marketing | Opsiys",
    seoDesc: "Drive high-intent home buyers and property investors with targeted Meta ads, automated brochure bots, and CRM buyer pipelines.",
    icon: Building2,
    image: "/images/realestate_growth.png",
    tagline: "High-Intent Property Lead Pipelines",
    description: "Performance acquisition and digital media for residential developers, real estate brokerages, and commercial projects.",
    highlights: ["Qualified Buyer Funnels", "Instant WhatsApp Property Brochures", "CRM Lead Distribution"]
  },
  {
    slug: "restaurants",
    title: "Restaurants & Hospitality",
    seoTitle: "Digital Marketing & Branding for Restaurants | Opsiys",
    seoDesc: "Increase foot traffic, table reservations, and online visibility with visual social campaigns, local SEO, and brand media.",
    icon: Utensils,
    image: "/images/restaurant_growth.png",
    tagline: "Local Visibility & Dining Experience Branding",
    description: "Visual media production, local search pack optimization, and customer retention systems for restaurants and cafes.",
    highlights: ["High-Impact Food & Venue Media", "Google Map Pack Dominance", "Reservation & Promo Workflows"]
  },
  {
    slug: "coaching",
    title: "Coaching & Education Institutes",
    seoTitle: "Student & Client Acquisition for Coaching Institutes | Opsiys",
    seoDesc: "Fill coaching cohorts, courses, and educational programs with performance marketing, landing pages, and email automations.",
    icon: GraduationCap,
    image: "/images/blog_online_presence.png",
    tagline: "Enrollment Expansion & Course Marketing",
    description: "End-to-end enrollment marketing engines designed to attract, qualify, and enroll students and coaching clients.",
    highlights: ["Course Sales Landing Pages", "Lead Nurturing Email Sequences", "Meta Ad Student Acquisition"]
  },
  {
    slug: "finance",
    title: "Finance & Professional Services",
    seoTitle: "Growth Solutions for Finance & Advisory Firms | Opsiys",
    seoDesc: "Build enterprise trust and attract high-net-worth inquiries with search authority, modern web design, and CRM automations.",
    icon: Landmark,
    image: "/images/hero_growth.png",
    tagline: "High-Trust Client Acquisition & Brand Authority",
    description: "Growth partner services for financial advisors, wealth managers, accounting firms, and consultancy practices.",
    highlights: ["Enterprise Web Platforms", "High-Net-Worth Lead Funnels", "Compliant CRM Pipelines"]
  }
];

export const IndustriesPage: React.FC = () => {
  return (
    <>
      <SEO
        title="Industries We Serve | Specialized Growth Partner | Opsiys"
        description="Opsiys provides specialized digital growth, SEO, lead generation, and automation solutions for clinics, real estate, restaurants, coaching, and finance."
        canonical="https://www.opsiys.in/industries"
      />
      <div className="bg-[#FAFAFA] min-h-screen pt-28 pb-20 overflow-hidden">
        <Breadcrumbs items={[{ label: "Industries" }]} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 space-y-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-left space-y-4 max-w-3xl"
          >
            <Badge variant="outline" className="rounded-full px-3 py-1 text-xs border-accent/20 text-accent bg-accent/5 font-mono uppercase tracking-widest">
              Industry Focus
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-tight text-black leading-tight">
              Specialized Industry Growth
            </h1>
            <p className="text-zinc-600 text-base sm:text-lg leading-relaxed font-medium">
              We deploy industry-tailored acquisition strategies, local search optimization, and automated customer communication built specifically for your sector.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {INDUSTRIES_LIST.map((ind, idx) => {
              const IconComp = ind.icon;
              return (
                <motion.div 
                  key={ind.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="bg-white border border-zinc-200 rounded-xl overflow-hidden flex flex-col justify-between hover:border-black transition-all hover:shadow-xl group"
                >
                  <div>
                    {/* Visual Banner Image */}
                    <div className="h-44 overflow-hidden relative bg-zinc-900">
                      <img 
                        src={ind.image} 
                        alt={ind.title} 
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-accent bg-black/60 backdrop-blur-md px-2.5 py-1 rounded">
                          {ind.tagline}
                        </span>
                        <div className="w-8 h-8 rounded bg-accent text-white flex items-center justify-center">
                          <IconComp className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    <div className="p-6 space-y-4">
                      <h2 className="text-xl font-bold uppercase tracking-tight text-black">
                        {ind.title}
                      </h2>
                      <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed">
                        {ind.description}
                      </p>
                      <ul className="space-y-1.5 pt-2 border-t border-zinc-100">
                        {ind.highlights.map((h, i) => (
                          <li key={i} className="text-[11px] font-medium text-zinc-500 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <Link to={`/industries/${ind.slug}`}>
                      <Button variant="outline" className="w-full rounded-none border-zinc-300 group-hover:border-black font-bold text-xs uppercase tracking-widest flex items-center justify-between">
                        <span>View Industry Solutions</span>
                        <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-black group-hover:translate-x-1 transition-all" />
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-black text-white rounded-2xl p-8 sm:p-12 text-center space-y-6"
          >
            <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight">
              Don't See Your Specific Industry Listed?
            </h2>
            <p className="text-zinc-400 text-sm max-w-xl mx-auto leading-relaxed">
              Our core growth framework adapts to any business model requiring online visibility, lead generation, and automated operations.
            </p>
            <a href="/#contact">
              <Button size="lg" className="bg-white text-black hover:bg-zinc-200 font-bold uppercase tracking-widest text-xs px-8 py-6 rounded-none">
                Discuss Your Industry Needs
              </Button>
            </a>
          </motion.div>
        </div>
      </div>
    </>
  );
};
export default IndustriesPage;

