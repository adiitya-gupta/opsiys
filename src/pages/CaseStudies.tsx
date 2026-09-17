import React from "react";
import { Link } from "react-router-dom";
import { SEO } from "../components/SEO";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, TrendingUp, Users, CheckCircle2 } from "lucide-react";

export const CASE_STUDIES = [
  {
    id: "medical-clinic-growth",
    client: "Specialist Aesthetics & Medical Clinic",
    industry: "Clinics & Healthcare",
    serviceUsed: "SEO & WhatsApp Automation",
    metrics: "+240% Patient Appointments",
    summary: "Transformed local search visibility across 3 catchment areas and implemented automated WhatsApp booking reminders, reducing no-shows to under 4%.",
    results: [
      "Achieved Top 3 Google Map Pack rankings for 14 commercial treatment terms",
      "Automated 24/7 patient inquiry handling via official WhatsApp Cloud API",
      "Increased monthly appointment volume from 45 to 150+ verified bookings"
    ]
  },
  {
    id: "real-estate-buyer-pipeline",
    client: "Residential Real Estate Developer",
    industry: "Real Estate",
    serviceUsed: "Meta Ads & CRM Automation",
    metrics: "₹4.2 Cr Project Sales Closed",
    summary: "Built a high-converting Meta lead funnel coupled with instant WhatsApp property brochure delivery and automated CRM sales team notifications.",
    results: [
      "Generated 380+ qualified home buyer inquiries within 60 days",
      "Reduced lead response time from 4 hours to under 30 seconds",
      "Achieved a 12.4x return on advertising spend (ROAS)"
    ]
  },
  {
    id: "coaching-institute-enrollments",
    client: "Regional Coaching Institute",
    industry: "Coaching & Education",
    serviceUsed: "Lead Generation & Email Automation",
    metrics: "310 New Student Enrollments",
    summary: "Deployed dedicated enrollment landing pages and email drip sequences that educated parents and students prior to counseling calls.",
    results: [
      "Increased landing page lead conversion rate from 3.2% to 11.8%",
      "Automated 6-part email nurture sequence for course prospects",
      "Filled 100% of seats for annual entrance preparation batches"
    ]
  }
];

export const CaseStudiesPage: React.FC = () => {
  return (
    <>
      <SEO
        title="Case Studies & Client Results | Opsiys Growth Partner"
        description="See how Opsiys helps clinics, real estate developers, and education institutes expand online presence, generate qualified leads, and automate growth."
        canonical="https://www.opsiys.in/case-studies"
      />

      <div className="bg-[#FAFAFA] min-h-screen pt-28 pb-20">
        <Breadcrumbs items={[{ label: "Case Studies" }]} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 space-y-12">
          <div className="text-left space-y-4 max-w-3xl">
            <Badge variant="outline" className="rounded-full px-3 py-1 text-xs border-accent/20 text-accent bg-accent/5 font-mono uppercase tracking-widest">
              Proven Performance
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-tight text-black leading-tight">
              Case Studies & Growth Results
            </h1>
            <p className="text-zinc-600 text-base sm:text-lg leading-relaxed font-medium">
              Explore how our connected growth solutions, search authority architecture, and automated lead infrastructure scale real businesses.
            </p>
          </div>

          <div className="space-y-8">
            {CASE_STUDIES.map((cs) => (
              <div key={cs.id} className="bg-white border border-zinc-200 rounded-xl p-6 sm:p-10 space-y-6 shadow-sm hover:border-black transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 pb-6">
                  <div className="space-y-1">
                    <Badge variant="outline" className="text-[10px] font-mono uppercase tracking-widest border-accent/30 text-accent">
                      {cs.industry} • {cs.serviceUsed}
                    </Badge>
                    <h2 className="text-2xl font-bold uppercase tracking-tight text-black">
                      {cs.client}
                    </h2>
                  </div>
                  <div className="bg-black text-white px-5 py-3 rounded-lg font-mono font-bold text-lg text-center shadow-md">
                    {cs.metrics}
                  </div>
                </div>

                <p className="text-zinc-600 text-sm sm:text-base leading-relaxed font-medium">
                  {cs.summary}
                </p>

                <div className="space-y-3 pt-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-black">
                    Key Outcomes & System Deliverables:
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {cs.results.map((r, i) => (
                      <div key={i} className="flex items-start gap-2.5 bg-zinc-50 p-3 rounded-lg border border-zinc-100 text-xs text-zinc-700 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                        <span>{r}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-black text-white rounded-2xl p-8 sm:p-12 text-center space-y-6 shadow-2xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight">
              Ready for Similar Growth Results?
            </h2>
            <p className="text-zinc-400 text-sm max-w-xl mx-auto leading-relaxed">
              Let's evaluate your online presence, search visibility, and lead systems to build your custom growth roadmap.
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
export default CaseStudiesPage;
