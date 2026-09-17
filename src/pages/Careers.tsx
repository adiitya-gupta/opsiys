import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { SEO } from "../components/SEO";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Brain, 
  Code2, 
  Palette, 
  TrendingUp, 
  Briefcase, 
  GraduationCap, 
  FileCode2, 
  UserCheck, 
  CheckCircle2, 
  Upload, 
  ArrowRight,
  ShieldCheck,
  Building2,
  Clock,
  MapPin,
  Send,
  AlertCircle
} from "lucide-react";
import { submitCareerApplication } from "../lib/firebase";

// --- Types ---
interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  description: string;
  active: boolean;
}

// Configurable job openings list (empty by default as per rule)
export const JOB_OPENINGS_LIST: JobOpening[] = [];

export const CareersPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [fileError, setFileError] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    position: "Growth & Performance Marketing",
    employmentType: "Full-Time",
    experience: "1-3 Yrs",
    portfolioUrl: "",
    resumeFileName: "",
    resumeData: "",
    introduction: "",
    noticePeriod: "Immediate",
    expectedSalary: "",
    preferredWorkMode: "Hybrid",
    additionalInfo: ""
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError("");
    
    if (!file) return;

    // Validate File Format (.pdf, .doc, .docx)
    const validExtensions = ["pdf", "doc", "docx"];
    const fileExt = file.name.split(".").pop()?.toLowerCase() || "";
    if (!validExtensions.includes(fileExt)) {
      setFileError("Invalid file type. Please upload a PDF, DOC, or DOCX document.");
      return;
    }

    // Validate File Size (Max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setFileError("File size exceeds 5MB limit. Please upload a smaller file.");
      return;
    }

    setSelectedFileName(file.name);

    // Read Base64 file string for secure storage
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        resumeFileName: file.name,
        resumeData: reader.result as string
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.resumeFileName && !formData.portfolioUrl) {
      setFileError("Please attach a Resume/CV document or provide a Portfolio link.");
      return;
    }

    setLoading(true);
    try {
      await submitCareerApplication({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        position: formData.position,
        employmentType: formData.employmentType,
        experience: formData.experience,
        portfolioUrl: formData.portfolioUrl,
        resumeFileName: formData.resumeFileName,
        resumeData: formData.resumeData,
        introduction: formData.introduction,
        noticePeriod: formData.noticePeriod,
        expectedSalary: formData.expectedSalary,
        preferredWorkMode: formData.preferredWorkMode,
        additionalInfo: formData.additionalInfo
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert("An error occurred submitting your profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <SEO
        title="Careers at Opsiys | Join Our Team"
        description="Explore career opportunities at Opsiys and submit your profile for relevant full-time, internship, freelance and future opportunities."
        canonical="https://opsiys.in/careers"
      />

      <div className="bg-[#FAFAFA] min-h-screen pt-28 pb-20 overflow-hidden">
        <Breadcrumbs items={[{ label: "Careers" }]} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 space-y-20">
          
          {/* SECTION 1 — HERO */}
          <section className="relative rounded-3xl bg-black text-white p-8 sm:p-14 md:p-20 overflow-hidden shadow-2xl">
            {/* Ambient Background Accents */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl space-y-6">
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Badge variant="outline" className="rounded-full px-3.5 py-1 text-xs border-accent/40 text-accent bg-accent/10 font-mono uppercase tracking-widest flex items-center gap-2 w-fit">
                  <Sparkles className="w-3.5 h-3.5 text-accent" />
                  <span>CAREERS AT OPSIYS</span>
                </Badge>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl sm:text-6xl md:text-7xl font-extrabold uppercase tracking-tight text-white leading-tight"
              >
                Build What's <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
                  Next With Us.
                </span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-zinc-300 text-base sm:text-xl font-medium leading-relaxed max-w-2xl"
              >
                We're building a team that thinks, creates, builds and grows. Connect your potential to high-impact client systems and digital infrastructure.
              </motion.p>

              {/* Action Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4"
              >
                <Button 
                  onClick={() => scrollToSection("apply")}
                  size="lg" 
                  className="bg-white text-black hover:bg-zinc-200 font-extrabold uppercase tracking-widest text-xs px-8 py-6 rounded-none shadow-xl"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button 
                  onClick={() => scrollToSection("openings")}
                  variant="outline" 
                  size="lg" 
                  className="border-zinc-700 text-white hover:border-white font-extrabold uppercase tracking-widest text-xs px-8 py-6 rounded-none"
                >
                  Explore Opportunities
                </Button>
              </motion.div>

              {/* Animated Growth Sequence Badges */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="pt-8 border-t border-zinc-800/80 flex flex-wrap items-center gap-3 font-mono text-[11px] font-bold text-zinc-400"
              >
                <span className="text-zinc-500 uppercase tracking-widest mr-2">OUR CULTURE PILLARS:</span>
                <span className="px-3 py-1 rounded bg-zinc-900 border border-zinc-800 text-white">1. THINK</span>
                <span className="text-zinc-600">→</span>
                <span className="px-3 py-1 rounded bg-zinc-900 border border-zinc-800 text-white">2. BUILD</span>
                <span className="text-zinc-600">→</span>
                <span className="px-3 py-1 rounded bg-zinc-900 border border-zinc-800 text-white">3. CREATE</span>
                <span className="text-zinc-600">→</span>
                <span className="px-3 py-1 rounded bg-zinc-900 border border-zinc-800 text-accent">4. GROW</span>
              </motion.div>
            </div>
          </section>

          {/* SECTION 2 — WHY OPSIYS */}
          <section className="space-y-8">
            <div className="text-left space-y-2">
              <span className="text-xs font-mono font-bold text-accent uppercase tracking-widest block">
                [ THE OPSIYS DNA ]
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-black">
                Why Build Your Career at Opsiys
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  step: "01",
                  title: "THINK",
                  icon: Brain,
                  desc: "Strategy, ideas and deep problem solving for genuine business growth.",
                  color: "border-blue-500/30 text-blue-600"
                },
                {
                  step: "02",
                  title: "BUILD",
                  icon: Code2,
                  desc: "High-performance websites, technology platforms and CRM systems.",
                  color: "border-emerald-500/30 text-emerald-600"
                },
                {
                  step: "03",
                  title: "CREATE",
                  icon: Palette,
                  desc: "Brand identity, commercial content media and magnetic visual experiences.",
                  color: "border-amber-500/30 text-amber-600"
                },
                {
                  step: "04",
                  title: "GROW",
                  icon: TrendingUp,
                  desc: "Performance marketing, customer acquisition and business automation.",
                  color: "border-purple-500/30 text-purple-600"
                }
              ].map((card, idx) => {
                const IconComp = card.icon;
                return (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    whileHover={{ y: -4 }}
                    className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className={`w-12 h-12 rounded-xl bg-zinc-900 text-white flex items-center justify-center`}>
                          <IconComp className="w-6 h-6" />
                        </div>
                        <span className="font-mono text-xs font-extrabold text-zinc-400">
                          {card.step}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold uppercase tracking-tight text-black">
                        {card.title}
                      </h3>
                      <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed">
                        {card.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* SECTION 3 — OPPORTUNITY TYPES */}
          <section className="space-y-8">
            <div className="text-left space-y-2">
              <span className="text-xs font-mono font-bold text-accent uppercase tracking-widest block">
                [ ENGAGEMENT MODELS ]
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-black">
                Ways to Work With Us
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Full-Time Roles",
                  type: "Full-Time",
                  icon: Briefcase,
                  desc: "Core growth engineering, web development, performance marketing, and creative production."
                },
                {
                  title: "Internship Programs",
                  type: "Internship",
                  icon: GraduationCap,
                  desc: "Hands-on mentorship for rising talent looking to build real-world digital client infrastructure."
                },
                {
                  title: "Freelance & Contract",
                  type: "Project-Based",
                  icon: FileCode2,
                  desc: "Specialized project-based collaborations for experienced designers, videographers & developers."
                },
                {
                  title: "Future Talent Pool",
                  type: "Priority Network",
                  icon: UserCheck,
                  desc: "Register your profile to be prioritized when new department positions unlock."
                }
              ].map((opt, idx) => {
                const IconComp = opt.icon;
                return (
                  <motion.div
                    key={opt.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    className="bg-zinc-900 text-white rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <Badge variant="outline" className="border-accent/30 text-accent text-[10px] font-mono uppercase tracking-widest">
                        {opt.type}
                      </Badge>
                      <div className="flex items-center gap-3">
                        <IconComp className="w-5 h-5 text-accent shrink-0" />
                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">
                          {opt.title}
                        </h3>
                      </div>
                      <p className="text-zinc-400 text-xs leading-relaxed">
                        {opt.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* SECTION 4 — CURRENT OPENINGS */}
          <section id="openings" className="space-y-8 scroll-mt-28">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-accent uppercase tracking-widest block">
                  [ ACTIVE POSITIONS ]
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-black">
                  Current Openings
                </h2>
              </div>
              <Badge variant="outline" className="px-3.5 py-1 text-xs font-mono font-bold border-zinc-300 text-zinc-700 bg-white">
                Status: Talent Network Active
              </Badge>
            </div>

            {JOB_OPENINGS_LIST.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {JOB_OPENINGS_LIST.map((job) => (
                  <div key={job.id} className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 space-y-4 hover:border-black transition-all shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Badge variant="outline" className="text-[10px] font-mono uppercase tracking-widest mb-2 border-accent/20 text-accent">
                          {job.department}
                        </Badge>
                        <h3 className="text-xl font-bold uppercase tracking-tight text-black">
                          {job.title}
                        </h3>
                      </div>
                      <Button onClick={() => scrollToSection("apply")} size="sm" className="bg-black text-white text-xs font-bold uppercase tracking-widest rounded-none">
                        Apply
                      </Button>
                    </div>
                    <p className="text-zinc-600 text-xs leading-relaxed">
                      {job.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-500 pt-3 border-t border-zinc-100">
                      <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                      <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {job.type}</span>
                      <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" /> {job.experience}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* No current vacancies state */
              <div className="bg-white border border-zinc-200 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-sm">
                <div className="w-16 h-16 bg-zinc-100 text-zinc-700 rounded-full flex items-center justify-center mx-auto">
                  <Briefcase className="w-8 h-8" />
                </div>
                <div className="space-y-2 max-w-lg mx-auto">
                  <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700 text-[10px] font-mono uppercase tracking-widest">
                    No Current Openings
                  </Badge>
                  <h3 className="text-2xl font-bold uppercase tracking-tight text-black">
                    Don't See a Role For You?
                  </h3>
                  <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed">
                    We don't currently have active open vacancies, but we are always eager to connect with exceptional talent. Send us your profile and we'll keep it in consideration for relevant future opportunities.
                  </p>
                </div>
                <Button 
                  onClick={() => scrollToSection("apply")}
                  className="bg-black text-white hover:bg-zinc-800 font-extrabold uppercase tracking-widest text-xs px-8 py-6 rounded-none"
                >
                  Submit Your Profile
                </Button>
              </div>
            )}
          </section>

          {/* SECTION 5 — APPLICATION FORM */}
          <section id="apply" className="scroll-mt-28">
            <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-10 md:p-14 shadow-xl space-y-8">
              {submitted ? (
                /* Application Success State */
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12 space-y-6 max-w-md mx-auto"
                >
                  <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 size={44} />
                  </div>
                  <div className="space-y-2">
                    <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 font-mono text-xs uppercase tracking-widest">
                      CONFIRMED
                    </Badge>
                    <h3 className="text-3xl font-extrabold uppercase tracking-tight text-black">
                      Application Received
                    </h3>
                    <p className="text-zinc-600 text-sm leading-relaxed">
                      Thanks for your interest in Opsiys. We've received your profile and will review it for relevant opportunities. If your profile matches a relevant opening, our team will contact you directly.
                    </p>
                  </div>
                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Button 
                      onClick={() => setSubmitted(false)} 
                      variant="outline"
                      className="w-full sm:w-auto font-bold text-xs uppercase tracking-widest rounded-none border-zinc-300"
                    >
                      Submit Another Profile
                    </Button>
                    <Link to="/" className="w-full sm:w-auto">
                      <Button className="w-full sm:w-auto bg-black text-white hover:bg-zinc-800 font-bold text-xs uppercase tracking-widest rounded-none">
                        Back to Opsiys
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-2">
                    <Badge variant="outline" className="border-accent/20 text-accent bg-accent/5 font-mono text-xs uppercase tracking-widest">
                      TALENT INGESTION FORM
                    </Badge>
                    <h2 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-black">
                      Submit Your Profile
                    </h2>
                    <p className="text-zinc-600 text-xs sm:text-sm">
                      Complete the application below. Required fields are marked with an asterisk (*).
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 1. Full Name */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-700">Full Name *</label>
                      <input 
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full h-12 px-4 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-black focus:outline-none focus:border-black"
                      />
                    </div>

                    {/* 2. Email */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-700">Email Address *</label>
                      <input 
                        type="email"
                        required
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@domain.com"
                        className="w-full h-12 px-4 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-black focus:outline-none focus:border-black"
                      />
                    </div>

                    {/* 3. Phone */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-700">Phone Number *</label>
                      <input 
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full h-12 px-4 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-black focus:outline-none focus:border-black"
                      />
                    </div>

                    {/* 4. Current City */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-700">Current City *</label>
                      <input 
                        type="text"
                        required
                        value={formData.city}
                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                        placeholder="e.g. Noida / Delhi / Remote"
                        className="w-full h-12 px-4 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-black focus:outline-none focus:border-black"
                      />
                    </div>

                    {/* 5. Position / Area of Interest */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-700">Area of Interest *</label>
                      <select 
                        value={formData.position}
                        onChange={e => setFormData({ ...formData, position: e.target.value })}
                        className="w-full h-12 px-4 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-black focus:outline-none focus:border-black"
                      >
                        <option value="Growth & Performance Marketing">Growth & Performance Marketing</option>
                        <option value="Web Development & Engineering">Web Development & Engineering</option>
                        <option value="Creative Production & Brand Media">Creative Production & Brand Media</option>
                        <option value="Copywriting & Content Strategy">Copywriting & Content Strategy</option>
                        <option value="Business Automation & Systems">Business Automation & Systems</option>
                        <option value="Client Success & Account Management">Client Success & Account Management</option>
                        <option value="Other Future Role">Other Future Role</option>
                      </select>
                    </div>

                    {/* 6. Employment Type */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-700">Desired Engagement *</label>
                      <select 
                        value={formData.employmentType}
                        onChange={e => setFormData({ ...formData, employmentType: e.target.value })}
                        className="w-full h-12 px-4 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-black focus:outline-none focus:border-black"
                      >
                        <option value="Full-Time">Full-Time</option>
                        <option value="Internship">Internship</option>
                        <option value="Freelance / Contract">Freelance / Contract</option>
                        <option value="Open to Any">Open to Any</option>
                      </select>
                    </div>

                    {/* 7. Experience */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-700">Years of Experience *</label>
                      <select 
                        value={formData.experience}
                        onChange={e => setFormData({ ...formData, experience: e.target.value })}
                        className="w-full h-12 px-4 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-black focus:outline-none focus:border-black"
                      >
                        <option value="Fresh Graduate / 0-1 Yr">Fresh Graduate / 0–1 Yr</option>
                        <option value="1-3 Yrs">1–3 Years</option>
                        <option value="3-5 Yrs">3–5 Years</option>
                        <option value="5+ Yrs">5+ Years</option>
                      </select>
                    </div>

                    {/* 8. Portfolio / LinkedIn */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-700">Portfolio / LinkedIn URL *</label>
                      <input 
                        type="url"
                        required
                        value={formData.portfolioUrl}
                        onChange={e => setFormData({ ...formData, portfolioUrl: e.target.value })}
                        placeholder="https://linkedin.com/in/username or portfolio link"
                        className="w-full h-12 px-4 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-black focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>

                  {/* 9. Resume / CV File Attachment */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-700 flex items-center justify-between">
                      <span>Resume / CV Document * (PDF, DOC, DOCX - Max 5MB)</span>
                      {selectedFileName && <span className="text-emerald-600 font-bold">Attached: {selectedFileName}</span>}
                    </label>
                    <div className="border-2 border-dashed border-zinc-300 rounded-xl p-6 text-center bg-zinc-50 hover:bg-zinc-100/80 transition-colors relative cursor-pointer">
                      <input 
                        type="file" 
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      <div className="space-y-2 pointer-events-none">
                        <Upload className="w-8 h-8 text-zinc-400 mx-auto" />
                        <p className="text-xs font-bold uppercase tracking-widest text-zinc-700">
                          {selectedFileName ? selectedFileName : "Click or drag file to attach resume"}
                        </p>
                        <p className="text-[10px] text-zinc-500 font-mono">Accepted: .pdf, .doc, .docx (Max size: 5MB)</p>
                      </div>
                    </div>
                    {fileError && (
                      <p className="text-xs font-mono font-bold text-red-500 flex items-center gap-1.5 mt-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{fileError}</span>
                      </p>
                    )}
                  </div>

                  {/* 10. Short Introduction */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-700">Short Introduction / About You *</label>
                    <textarea 
                      required
                      rows={3}
                      value={formData.introduction}
                      onChange={e => setFormData({ ...formData, introduction: e.target.value })}
                      placeholder="Briefly tell us about your key skills, past achievements, and why you want to work with Opsiys..."
                      className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-black focus:outline-none focus:border-black"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* 11. Notice Period */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-700">Availability / Notice Period *</label>
                      <select 
                        value={formData.noticePeriod}
                        onChange={e => setFormData({ ...formData, noticePeriod: e.target.value })}
                        className="w-full h-12 px-4 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-black focus:outline-none focus:border-black"
                      >
                        <option value="Immediate">Immediate / 0 Days</option>
                        <option value="15 Days">15 Days</option>
                        <option value="30 Days">30 Days</option>
                        <option value="60+ Days">60+ Days</option>
                      </select>
                    </div>

                    {/* Optional: Work Mode */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-700">Preferred Work Mode</label>
                      <select 
                        value={formData.preferredWorkMode}
                        onChange={e => setFormData({ ...formData, preferredWorkMode: e.target.value })}
                        className="w-full h-12 px-4 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-black focus:outline-none focus:border-black"
                      >
                        <option value="Hybrid">Hybrid</option>
                        <option value="Remote">Remote</option>
                        <option value="On-site">On-site Office</option>
                      </select>
                    </div>

                    {/* Optional: Expected Salary */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-700">Expected CTC (Optional)</label>
                      <input 
                        type="text"
                        value={formData.expectedSalary}
                        onChange={e => setFormData({ ...formData, expectedSalary: e.target.value })}
                        placeholder="e.g. ₹4-6 LPA or Standard"
                        className="w-full h-12 px-4 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-black focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full h-14 bg-black text-white hover:bg-zinc-800 font-extrabold uppercase tracking-widest text-xs rounded-none shadow-xl"
                  >
                    {loading ? "Submitting Candidate Profile..." : "Submit Candidate Profile"}
                  </Button>
                </form>
              )}
            </div>
          </section>

        </div>
      </div>
    </>
  );
};

export default CareersPage;
