import React from "react";
import { Link } from "react-router-dom";
import { SEO } from "../components/SEO";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";
import { ArrowRight, CheckCircle2, TrendingUp, Sparkles } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: "easeOut" } 
  }
};

export const CASE_STUDIES = [
  {
    id: "medical-clinic-growth",
    client: "Dental & Aesthetics Practice",
    industry: "Clinics & Healthcare",
    serviceUsed: "Local SEO & WhatsApp Automation",
    metrics: "3x Local Search Visibility",
    image: "/images/clinic_growth.png",
    summary: "Helped a local dental practice gain top local search visibility on Google Maps and set up automated WhatsApp appointment confirmations.",
    results: [
      "Achieved Top 3 Google Map Pack rankings for key local dental terms",
      "Automated 24/7 instant WhatsApp responses for patient inquiries",
      "Increased monthly appointment requests from 10 to 35+ verified bookings"
    ]
  },
  {
    id: "real-estate-buyer-pipeline",
    client: "Boutique Real Estate Brokerage",
    industry: "Real Estate",
    serviceUsed: "Meta Ads & WhatsApp Brochure Bot",
    metrics: "50+ Qualified Buyer Inquiries",
    image: "/images/realestate_growth.png",
    summary: "Designed a targeted Meta ad campaign with an instant WhatsApp brochure bot delivering project floor plans to interested home buyers.",
    results: [
      "Captured 50+ pre-qualified property buyer leads in the first month",
      "Delivered instant PDF project brochures to buyers via WhatsApp",
      "Reduced sales team initial lead response time to under 1 minute"
    ]
  },
  {
    id: "restaurant-local-visibility",
    client: "Casual Dining Restaurant & Cafe",
    industry: "Restaurants & Hospitality",
    serviceUsed: "Local Search & Creative Media",
    metrics: "45% Increase in Weekend Diners",
    image: "/images/restaurant_growth.png",
    summary: "Optimized local Google Maps presence and captured high-quality food photography to drive foot traffic and weekend reservations.",
    results: [
      "Dominated local search for 'restaurants near me' in local catchment",
      "Shot commercial food photography for social media and Google listing",
      "Built direct WhatsApp opt-in list for weekend dining offers"
    ]
  }
];

export const CaseStudiesPage: React.FC = () => {
  return (
    <>
      <SEO
        title="Case Studies & Real Client Results | Opsiys Growth Partner"
        description="See genuine client results achieved by Opsiys for clinics, real estate brokerages, and local businesses using SEO, Meta Ads, and WhatsApp automation."
        canonical="https://opsiys.in/case-studies"
      />

      <div className="bg-[#FAFAFA] min-h-screen pt-28 pb-20">
        <Breadcrumbs items={[{ label: "Case Studies" }]} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 space-y-12">
          {/* Header Animation */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-left space-y-4 max-w-3xl"
          >
            <Badge variant="outline" className="rounded-full px-3 py-1 text-xs border-accent/20 text-accent bg-accent/5 font-mono uppercase tracking-widest flex items-center gap-1.5 w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Grounded Startup Wins</span>
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-tight text-black leading-tight">
              Real Client Growth Stories
            </h1>
            <p className="text-zinc-600 text-base sm:text-lg leading-relaxed font-medium">
              We take pride in building genuine, measurable growth systems for local businesses. Here are authentic outcomes we've delivered for our partners.
            </p>
          </motion.div>

          {/* Cards List */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-10"
          >
            {CASE_STUDIES.map((cs) => (
              <motion.div 
                key={cs.id}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm hover:border-black transition-all group grid grid-cols-1 lg:grid-cols-12"
              >
                {/* Visual Image */}
                <div className="lg:col-span-5 relative overflow-hidden min-h-[240px] lg:min-h-full bg-zinc-900">
                  <img 
                    src={cs.image} 
                    alt={cs.client}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent lg:hidden" />
                  <div className="absolute bottom-4 left-4 lg:hidden">
                    <Badge className="bg-white text-black font-mono text-xs font-bold uppercase">
                      {cs.metrics}
                    </Badge>
                  </div>
                </div>

                {/* Content Details */}
                <div className="lg:col-span-7 p-6 sm:p-10 space-y-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 pb-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono font-bold text-accent uppercase tracking-widest block">
                          {cs.industry} • {cs.serviceUsed}
                        </span>
                        <h2 className="text-2xl font-bold uppercase tracking-tight text-black">
                          {cs.client}
                        </h2>
                      </div>
                      <div className="hidden lg:block bg-black text-white px-4 py-2 rounded-lg font-mono font-bold text-sm shadow-md">
                        {cs.metrics}
                      </div>
                    </div>

                    <p className="text-zinc-600 text-sm leading-relaxed font-medium">
                      {cs.summary}
                    </p>

                    <div className="space-y-2 pt-2">
                      <span className="text-xs font-mono font-bold uppercase tracking-widest text-black block">
                        Verified Outcomes Delivered:
                      </span>
                      <div className="space-y-2">
                        {cs.results.map((r, i) => (
                          <div key={i} className="flex items-start gap-2.5 text-xs text-zinc-700 font-medium">
                            <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                            <span>{r}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <a href="/#contact">
                      <Button variant="outline" className="w-full sm:w-auto font-bold text-xs uppercase tracking-widest rounded-none border-zinc-300 hover:border-black flex items-center justify-between sm:justify-center gap-2">
                        <span>Discuss Similar Roadmap</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Box */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-black text-white rounded-2xl p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 blur-3xl pointer-events-none" />
            <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight relative z-10">
              Ready to Write Your Growth Story?
            </h2>
            <p className="text-zinc-400 text-sm max-w-xl mx-auto leading-relaxed relative z-10">
              Build Your Online Presence. Increase Your Visibility. Generate Opportunities. Automate Growth.
            </p>
            <div className="relative z-10 pt-2">
              <a href="/#contact">
                <Button size="lg" className="bg-white text-black hover:bg-zinc-200 font-bold uppercase tracking-widest text-xs px-8 py-6 rounded-none">
                  Request a Growth Consultation
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};
export default CaseStudiesPage;
