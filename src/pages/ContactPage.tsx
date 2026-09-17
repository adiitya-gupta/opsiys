import React from "react";
import { motion } from "framer-motion";
import { SEO } from "../components/SEO";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, MapPin, Globe, PhoneCall, CheckCircle2 } from "lucide-react";
import { submitLead } from "../lib/firebase";

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "Business Growth Solutions",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitLead({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        projectType: formData.service,
        message: formData.message,
        source: "Contact Page",
        status: "new"
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Contact Opsiys | Start Your Business Growth Journey"
        description="Contact Opsiys for websites, SEO, Meta Ads, marketing, automation, CRM and other digital business growth solutions."
        canonical="https://opsiys.in/contact"
      />

      <div className="bg-[#FAFAFA] min-h-screen pt-28 pb-20 overflow-hidden">
        <Breadcrumbs items={[{ label: "Contact" }]} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 space-y-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-left space-y-4 max-w-3xl"
          >
            <Badge variant="outline" className="rounded-full px-3 py-1 text-xs border-accent/20 text-accent bg-accent/5 font-mono uppercase tracking-widest">
              Direct Communication
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-tight text-black leading-tight">
              Talk to Opsiys
            </h1>
            <p className="text-zinc-600 text-base sm:text-lg leading-relaxed font-medium">
              Ready to build your online presence, increase search visibility, generate leads, and automate growth? Let's connect.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Form */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-10 shadow-sm"
            >
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 size={36} />
                  </div>
                  <h2 className="text-2xl font-bold uppercase tracking-tight text-black">
                    Inquiry Received
                  </h2>
                  <p className="text-zinc-600 text-sm max-w-sm mx-auto leading-relaxed">
                    Thank you for reaching out. Our growth engineering team will review your inquiry and connect with you shortly.
                  </p>
                  <Button 
                    onClick={() => setSubmitted(false)} 
                    variant="outline"
                    className="font-bold text-xs uppercase tracking-widest rounded-none border-zinc-300"
                  >
                    Send Another Inquiry
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h2 className="text-2xl font-bold uppercase tracking-tight text-black">
                    Request a Growth Consultation
                  </h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-700">Name *</label>
                      <input 
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your full name"
                        className="w-full h-12 px-4 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-black focus:outline-none focus:border-black"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-700">Email *</label>
                      <input 
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your@email.com"
                        className="w-full h-12 px-4 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-black focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-700">Phone</label>
                      <input 
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full h-12 px-4 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-black focus:outline-none focus:border-black"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-700">Company Name</label>
                      <input 
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Company or Clinic name"
                        className="w-full h-12 px-4 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-black focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-700">Primary Requirement</label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full h-12 px-4 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-black focus:outline-none focus:border-black"
                    >
                      <option value="Business Growth Solutions">Business Growth Solutions</option>
                      <option value="Search Engine Optimization (SEO)">Search Engine Optimization (SEO)</option>
                      <option value="Meta Ads Management">Meta Ads Management</option>
                      <option value="Qualified Lead Generation">Qualified Lead Generation</option>
                      <option value="Modern Website Development">Modern Website Development</option>
                      <option value="WhatsApp & Email Automation">WhatsApp & Email Automation</option>
                      <option value="AI & Business Automation">AI & Business Automation</option>
                      <option value="Branding & Media">Branding & Media</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-700">Project Overview</label>
                    <textarea 
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about your business goals and current growth challenges..."
                      className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-black focus:outline-none focus:border-black"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full h-14 bg-black text-white hover:bg-zinc-800 font-bold uppercase tracking-widest text-xs rounded-none"
                  >
                    {loading ? "Submitting Inquiry..." : "Submit Growth Inquiry"}
                  </Button>
                </form>
              )}
            </motion.div>

            {/* Verification Info */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-8"
            >
              <div className="bg-zinc-900 text-white rounded-2xl p-6 sm:p-10 space-y-6 shadow-xl">
                <h2 className="text-2xl font-bold uppercase tracking-tight text-white">
                  Contact Information
                </h2>
                
                <div className="space-y-4 font-mono text-xs sm:text-sm">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <div>
                      <span className="text-zinc-500 uppercase block text-[10px] tracking-widest">Official Email</span>
                      <a href="mailto:opsiyss@gmail.com" className="text-white font-bold hover:text-accent transition-colors">
                        opsiyss@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pt-2">
                    <MapPin className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <div>
                      <span className="text-zinc-500 uppercase block text-[10px] tracking-widest">Base Operations</span>
                      <span className="text-zinc-300">Based in India • Serving Globally</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pt-2">
                    <Globe className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <div>
                      <span className="text-zinc-500 uppercase block text-[10px] tracking-widest">Website</span>
                      <a href="https://opsiys.in/" className="text-accent font-bold hover:underline">
                        https://opsiys.in/
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 space-y-4">
                <h3 className="text-lg font-bold uppercase tracking-tight text-black">
                  Our Commitment to Your Growth
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                  We don't sell vanity metrics. We construct connected acquisition systems, search engine visibility, and automated lead workflows engineered for genuine revenue expansion.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};
export default ContactPage;

