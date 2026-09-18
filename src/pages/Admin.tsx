import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SEO } from "../components/SEO";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  auth, 
  signInWithGoogle, 
  logout,
  subscribeToAllLeads,
  updateLeadStatus,
  deleteLead,
  subscribeToCareerApplications,
  updateCareerApplicationStatus,
  deleteCareerApplication,
  subscribeToPayments,
  subscribeToProfiles,
  subscribeToJobOpenings,
  saveJobOpening,
  deleteJobOpening,
  subscribeToSystemSettings,
  updateSystemMaintenanceMode
} from "../lib/firebase";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { 
  ShieldCheck, 
  Users, 
  Briefcase, 
  CreditCard, 
  UserCheck, 
  Plus, 
  Trash2, 
  Search, 
  Filter, 
  Download, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Eye, 
  X, 
  Sparkles, 
  TrendingUp, 
  ArrowUpRight, 
  FileText, 
  ExternalLink,
  Lock,
  LogOut,
  ChevronRight,
  RefreshCw,
  Building2,
  Mail,
  Phone,
  MapPin,
  ShieldAlert,
  Power
} from "lucide-react";

const ADMIN_EMAIL = "adityaofficial9918@gmail.com";

export const AdminPage: React.FC = () => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "leads" | "careers" | "payments" | "profiles" | "jobs" | "settings">("overview");

  // Real-time State
  const [leads, setLeads] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [jobOpenings, setJobOpenings] = useState<any[]>([]);
  const [systemSettings, setSystemSettings] = useState<any>({ maintenanceMode: true, message: "" });
  const [customMsg, setCustomMsg] = useState("");
  const [savingSettings, setSavingSettings] = useState(false);


  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Selected item modal
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<any | null>(null);
  const [showJobModal, setShowJobModal] = useState(false);

  // New Job Opening Form State
  const [jobFormData, setJobFormData] = useState({
    id: "",
    title: "",
    department: "Engineering",
    location: "Noida / Hybrid",
    type: "Full-Time",
    experience: "1-3 Yrs",
    description: "",
    active: true
  });

  const [authError, setAuthError] = useState("");
  const [adminPasscode, setAdminPasscode] = useState("");
  const [isPasscodeUnlocked, setIsPasscodeUnlocked] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    setAuthError("");
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.error("Google Sign-In Error:", err);
      if (err?.code === "auth/unauthorized-domain" || err?.message?.includes("unauthorized-domain")) {
        setAuthError("Domain Unauthorized in Firebase: Add your current domain (e.g. localhost or your domain) to Firebase Console -> Authentication -> Settings -> Authorized domains.");
      } else {
        setAuthError(err?.message || "Google Authentication failed. Please try again.");
      }
    }
  };

  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasscode === "opsiys2026" || adminPasscode === "aditya9918") {
      setIsPasscodeUnlocked(true);
      setAuthError("");
    } else {
      setAuthError("Invalid Admin Passcode. Try again.");
    }
  };

  const isAdmin = (user && user.email === ADMIN_EMAIL) || isPasscodeUnlocked;

  // Attach Real-time Listeners when authenticated as Admin
  useEffect(() => {
    if (!isAdmin) return;

    const unSubLeads = subscribeToAllLeads(setLeads);
    const unSubApps = subscribeToCareerApplications(setApplications);
    const unSubPayments = subscribeToPayments(setPayments);
    const unSubProfiles = subscribeToProfiles(setProfiles);
    const unSubJobs = subscribeToJobOpenings(setJobOpenings);
    const unSubSettings = subscribeToSystemSettings((settings) => {
      setSystemSettings(settings);
      if (settings?.message && !customMsg) setCustomMsg(settings.message);
    });

    return () => {
      unSubLeads();
      unSubApps();
      unSubPayments();
      unSubProfiles();
      unSubJobs();
      unSubSettings();
    };
  }, [isAdmin]);

  const handleToggleMaintenance = async (targetState?: boolean) => {
    setSavingSettings(true);
    try {
      const newState = targetState !== undefined ? targetState : !systemSettings?.maintenanceMode;
      await updateSystemMaintenanceMode(newState, customMsg || systemSettings?.message);
    } catch (err) {
      console.error("Failed to update maintenance mode:", err);
    } finally {
      setSavingSettings(false);
    }
  };


  // Auth Guard Screen
  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] text-white flex items-center justify-center">
        <div className="flex items-center gap-3 text-zinc-400 font-mono text-sm">
          <RefreshCw className="w-5 h-5 animate-spin text-accent" />
          <span>Verifying Admin Credentials...</span>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <>
        <SEO title="Admin Portal Security | Opsiys" description="Opsiys Master Control Admin Portal" />
        <div className="min-h-screen bg-[#0B0B0B] text-white flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full bg-zinc-900/90 border border-zinc-800 rounded-3xl p-8 sm:p-10 text-center space-y-6 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="w-20 h-20 bg-zinc-800 border border-zinc-700 text-red-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Lock size={36} />
            </div>

            <div className="space-y-2">
              <Badge variant="outline" className="border-red-500/30 text-red-400 bg-red-500/10 font-mono text-xs uppercase tracking-widest">
                RESTRICTED ACCESS
              </Badge>
              <h1 className="text-3xl font-extrabold uppercase tracking-tight text-white">
                Opsiys Master Control
              </h1>
              <p className="text-zinc-400 text-xs leading-relaxed font-medium">
                This administration console is restricted to authorized personnel ({ADMIN_EMAIL}).
              </p>
            </div>

            {authError && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-mono text-left space-y-2">
                <div className="flex items-center gap-2 font-bold text-red-400">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Authentication Warning</span>
                </div>
                <p className="text-[11px] leading-relaxed">{authError}</p>
              </div>
            )}

            {user && user.email !== ADMIN_EMAIL && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-mono">
                Signed in as {user.email} (Not Authorized)
              </div>
            )}

            <div className="space-y-4 pt-2">
              {!user ? (
                <Button 
                  onClick={handleGoogleSignIn}
                  className="w-full h-14 bg-white text-black hover:bg-zinc-200 font-extrabold text-xs uppercase tracking-widest rounded-xl shadow-xl"
                >
                  Sign In With Admin Google Account
                </Button>
              ) : (
                <Button 
                  onClick={logout}
                  variant="outline"
                  className="w-full h-12 border-zinc-700 text-white hover:bg-zinc-800 font-bold text-xs uppercase tracking-widest rounded-xl"
                >
                  Sign Out ({user.email})
                </Button>
              )}

              {/* Admin Key Emergency Fallback */}
              <div className="pt-4 border-t border-zinc-800 space-y-3">
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                  Admin Passcode Login (Bypass Domain Restriction)
                </p>
                <form onSubmit={handlePasscodeSubmit} className="flex gap-2">
                  <Input 
                    type="password"
                    placeholder="Enter Admin Passcode"
                    value={adminPasscode}
                    onChange={e => setAdminPasscode(e.target.value)}
                    className="bg-zinc-950 border-zinc-800 text-xs h-11 text-white placeholder:text-zinc-600 rounded-xl"
                  />
                  <Button type="submit" className="bg-zinc-800 hover:bg-zinc-700 text-white font-extrabold text-xs uppercase px-4 h-11 rounded-xl shrink-0">
                    Unlock
                  </Button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </>
    );
  }

  // --- Calculations ---
  const totalRevenue = payments
    .filter(p => p.status === "success")
    .reduce((acc, curr) => acc + (Number(curr.amountInINR) || 0), 0);

  const newLeadsCount = leads.filter(l => l.status === "new").length;
  const pendingAppsCount = applications.filter(a => a.status === "under_review").length;

  // Filtered Lists
  const filteredLeads = leads.filter(l => {
    const matchesSearch = (l.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (l.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (l.company || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (l.projectType || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredApps = applications.filter(a => {
    const matchesSearch = (a.fullName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (a.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (a.position || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (a.city || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredPayments = payments.filter(p => {
    const matchesSearch = (p.customerName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (p.customerEmail || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (p.paymentId || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (p.packageName || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // CSV Exporters
  const exportLeadsCSV = () => {
    const headers = ["Name", "Email", "Company", "Phone", "Project Type", "Urgency", "Budget", "Status", "Message", "Created At"];
    const rows = leads.map(l => [
      `"${l.name || ''}"`,
      `"${l.email || ''}"`,
      `"${l.company || ''}"`,
      `"${l.phone || ''}"`,
      `"${l.projectType || ''}"`,
      `"${l.urgency || ''}"`,
      `"${l.budget || ''}"`,
      `"${l.status || ''}"`,
      `"${(l.message || '').replace(/"/g, '""')}"`,
      `"${l.createdAt?.toDate ? l.createdAt.toDate().toLocaleString() : ''}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `opsiys_leads_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportCandidatesCSV = () => {
    const headers = ["Full Name", "Email", "Phone", "City", "Position", "Experience", "Notice Period", "Expected CTC", "Status", "Portfolio URL"];
    const rows = applications.map(a => [
      `"${a.fullName || ''}"`,
      `"${a.email || ''}"`,
      `"${a.phone || ''}"`,
      `"${a.city || ''}"`,
      `"${a.position || ''}"`,
      `"${a.experience || ''}"`,
      `"${a.noticePeriod || ''}"`,
      `"${a.expectedSalary || ''}"`,
      `"${a.status || ''}"`,
      `"${a.portfolioUrl || ''}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `opsiys_candidates_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveJobOpening(jobFormData);
      setShowJobModal(false);
      setJobFormData({
        id: "",
        title: "",
        department: "Engineering",
        location: "Noida / Hybrid",
        type: "Full-Time",
        experience: "1-3 Yrs",
        description: "",
        active: true
      });
    } catch (err) {
      console.error("Error saving job opening:", err);
    }
  };

  return (
    <>
      <SEO title="Opsiys Master Control Admin Dashboard" description="Management portal for Opsiys leads, career candidates, transactions and operations." />

      <div className="bg-[#0B0B0B] text-white min-h-screen pt-24 pb-20 font-sans">
        
        {/* TOP NAVIGATION BAR */}
        <header className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
            <div className="space-y-1">
              <Badge variant="outline" className="border-accent/40 text-accent bg-accent/10 font-mono text-[10px] uppercase tracking-widest flex items-center gap-1.5 w-fit">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>OPSIYS MASTER CONTROL</span>
              </Badge>
              <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white flex items-center gap-3">
                Admin Control Center
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3.5 py-2 rounded-full text-xs font-mono text-zinc-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{user.email}</span>
              </div>
              <Button 
                onClick={logout}
                variant="outline"
                size="sm"
                className="border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 font-bold uppercase text-[10px] tracking-widest rounded-full"
              >
                <LogOut className="w-3.5 h-3.5 mr-1.5" /> Sign Out
              </Button>
            </div>
          </div>

          {/* TAB BUTTONS */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-6">
            {[
              { id: "overview", label: "Overview", icon: TrendingUp, count: null },
              { id: "leads", label: "Leads & Inquiries", icon: Users, count: newLeadsCount > 0 ? newLeadsCount : null },
              { id: "careers", label: "Career Applicants", icon: Briefcase, count: pendingAppsCount > 0 ? pendingAppsCount : null },
              { id: "payments", label: "Payments Audit", icon: CreditCard, count: null },
              { id: "profiles", label: "Registered Users", icon: UserCheck, count: profiles.length },
              { id: "jobs", label: "Job Postings", icon: Building2, count: jobOpenings.length },
              { id: "settings", label: "Maintenance & Settings", icon: ShieldAlert, count: systemSettings?.maintenanceMode ? "ACTIVE" : null }
            ].map(tab => {
              const IconComp = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id as any); setSearchTerm(""); setStatusFilter("all"); }}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-extrabold uppercase tracking-widest transition-all shrink-0 ${
                    isActive 
                      ? "bg-white text-black shadow-lg" 
                      : "bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800/80"
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.count !== null && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                      isActive ? "bg-black text-white" : "bg-amber-500/20 text-amber-400 font-bold"
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </header>

        {/* MAIN BODY CONTAINER */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">

          {/* MAINTENANCE MODE ALERT BANNER */}
          <div className={`mb-8 p-4 sm:p-6 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono ${
            systemSettings?.maintenanceMode
              ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
              : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full animate-ping ${systemSettings?.maintenanceMode ? 'bg-amber-400' : 'bg-emerald-400'}`} />
              <div>
                <p className="font-bold text-sm uppercase">
                  {systemSettings?.maintenanceMode ? "SYSTEM MAINTENANCE MODE IS CURRENTLY ACTIVE" : "WEBSITE IS LIVE & OPERATIONAL FOR PUBLIC"}
                </p>
                <p className="text-xs text-zinc-400 font-sans mt-0.5">
                  {systemSettings?.maintenanceMode 
                    ? "Public visitors see the Maintenance Page. Admin Panel remains accessible for operations." 
                    : "Public visitors can browse all pages, services, package purchases and submit inquiries."}
                </p>
              </div>
            </div>

            <Button 
              disabled={savingSettings}
              onClick={() => handleToggleMaintenance(!systemSettings?.maintenanceMode)}
              className={`h-11 px-6 font-extrabold text-xs uppercase tracking-widest rounded-xl shrink-0 shadow-lg ${
                systemSettings?.maintenanceMode
                  ? "bg-emerald-500 hover:bg-emerald-400 text-black font-black"
                  : "bg-amber-500 hover:bg-amber-400 text-black font-black"
              }`}
            >
              <Power className="w-4 h-4 mr-2" />
              <span>{savingSettings ? "Updating System..." : systemSettings?.maintenanceMode ? "DISABLE MAINTENANCE (GO LIVE)" : "ENABLE MAINTENANCE MODE"}</span>
            </Button>
          </div>


          {/* 1. OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Stat Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    title: "Total Revenue",
                    value: `₹${totalRevenue.toLocaleString('en-IN')}`,
                    sub: `${payments.filter(p => p.status === "success").length} successful payments`,
                    icon: CreditCard,
                    color: "border-emerald-500/30 text-emerald-400 bg-emerald-500/5"
                  },
                  {
                    title: "Client Leads",
                    value: leads.length,
                    sub: `${newLeadsCount} new uncontacted leads`,
                    icon: Users,
                    color: "border-blue-500/30 text-blue-400 bg-blue-500/5"
                  },
                  {
                    title: "Candidate Profiles",
                    value: applications.length,
                    sub: `${pendingAppsCount} applications under review`,
                    icon: Briefcase,
                    color: "border-purple-500/30 text-purple-400 bg-purple-500/5"
                  },
                  {
                    title: "Active Job Openings",
                    value: jobOpenings.filter(j => j.active !== false).length,
                    sub: `${jobOpenings.length} total postings defined`,
                    icon: Building2,
                    color: "border-amber-500/30 text-amber-400 bg-amber-500/5"
                  }
                ].map((stat, idx) => {
                  const IconComp = stat.icon;
                  return (
                    <div key={idx} className={`border rounded-2xl p-6 space-y-4 shadow-lg ${stat.color}`}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">{stat.title}</span>
                        <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white">
                          <IconComp className="w-5 h-5" />
                        </div>
                      </div>
                      <div>
                        <div className="text-3xl font-extrabold tracking-tight text-white">{stat.value}</div>
                        <p className="text-[11px] font-mono text-zinc-400 mt-1">{stat.sub}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Recent Activity Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Leads */}
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold uppercase tracking-tight flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-400" /> Recent Inquiries
                    </h2>
                    <Button 
                      onClick={() => setActiveTab("leads")} 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white"
                    >
                      View All ({leads.length}) <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {leads.slice(0, 5).map(lead => (
                      <div key={lead.id} className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <p className="font-bold text-sm text-white truncate">{lead.name}</p>
                          <p className="text-xs text-zinc-400 font-mono truncate">{lead.email} • {lead.projectType || 'General'}</p>
                        </div>
                        <Badge variant="outline" className={`font-mono text-[10px] uppercase ${
                          lead.status === 'new' ? 'border-amber-500/40 text-amber-400 bg-amber-500/10' :
                          lead.status === 'qualified' ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10' :
                          'border-zinc-700 text-zinc-400'
                        }`}>
                          {lead.status}
                        </Badge>
                      </div>
                    ))}
                    {leads.length === 0 && (
                      <p className="text-center text-xs font-mono text-zinc-500 py-6">No client inquiries received yet.</p>
                    )}
                  </div>
                </div>

                {/* Recent Candidates */}
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold uppercase tracking-tight flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-purple-400" /> Recent Candidates
                    </h2>
                    <Button 
                      onClick={() => setActiveTab("careers")} 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white"
                    >
                      View All ({applications.length}) <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {applications.slice(0, 5).map(app => (
                      <div key={app.id} className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <p className="font-bold text-sm text-white truncate">{app.fullName}</p>
                          <p className="text-xs text-zinc-400 font-mono truncate">{app.position} • {app.city}</p>
                        </div>
                        <Badge variant="outline" className="font-mono text-[10px] uppercase border-purple-500/40 text-purple-400 bg-purple-500/10">
                          {app.status || 'under_review'}
                        </Badge>
                      </div>
                    ))}
                    {applications.length === 0 && (
                      <p className="text-center text-xs font-mono text-zinc-500 py-6">No candidate applications submitted yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. LEADS & INQUIRIES TAB */}
          {activeTab === "leads" && (
            <div className="space-y-6">
              {/* Filter controls */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-zinc-900/60 border border-zinc-800 p-4 rounded-2xl">
                <div className="flex flex-1 items-center gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <Input 
                      placeholder="Search leads by name, email, company or project..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="pl-10 bg-zinc-950 border-zinc-800 text-xs rounded-xl h-11 text-white placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-accent"
                    />
                  </div>
                  <select 
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="bg-zinc-950 border border-zinc-800 text-xs rounded-xl h-11 px-3 text-zinc-300 focus:outline-none"
                  >
                    <option value="all">All Statuses</option>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <Button 
                  onClick={exportLeadsCSV}
                  variant="outline" 
                  size="sm" 
                  className="border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 text-xs font-bold uppercase tracking-widest h-11 rounded-xl shrink-0"
                >
                  <Download className="w-4 h-4 mr-2 text-emerald-400" /> Export CSV
                </Button>
              </div>

              {/* Leads Table */}
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-zinc-950 border-b border-zinc-800 uppercase tracking-wider text-zinc-400 text-[10px]">
                      <tr>
                        <th className="p-4">Contact Person</th>
                        <th className="p-4">Company</th>
                        <th className="p-4">Project Type</th>
                        <th className="p-4">Urgency & Budget</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60">
                      {filteredLeads.map(lead => (
                        <tr key={lead.id} className="hover:bg-zinc-800/40 transition-colors">
                          <td className="p-4">
                            <p className="font-bold text-white text-sm font-sans">{lead.name}</p>
                            <p className="text-[11px] text-zinc-400">{lead.email}</p>
                            <p className="text-[11px] text-zinc-500">{lead.phone}</p>
                          </td>
                          <td className="p-4 text-zinc-300 font-sans font-bold">{lead.company || "N/A"}</td>
                          <td className="p-4 text-zinc-300 font-sans">{lead.projectType || "General"}</td>
                          <td className="p-4 text-zinc-400">
                            <div>Urgency: <span className="text-white">{lead.urgency}</span></div>
                            <div>Budget: <span className="text-white">{lead.budget}</span></div>
                          </td>
                          <td className="p-4">
                            <select 
                              value={lead.status || "new"}
                              onChange={async (e) => await updateLeadStatus(lead.id, e.target.value)}
                              className="bg-zinc-950 border border-zinc-800 text-[11px] font-bold rounded-lg px-2.5 py-1.5 text-zinc-200 focus:outline-none cursor-pointer"
                            >
                              <option value="new">New</option>
                              <option value="contacted">Contacted</option>
                              <option value="qualified">Qualified</option>
                              <option value="closed">Closed</option>
                            </select>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button 
                                onClick={() => setSelectedLead(lead)} 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0 text-zinc-400 hover:text-white"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button 
                                onClick={async () => {
                                  if (confirm(`Delete lead from ${lead.name}?`)) {
                                    await deleteLead(lead.id);
                                  }
                                }} 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0 text-zinc-500 hover:text-red-400"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredLeads.length === 0 && (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-zinc-500">
                            No matching client inquiries found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 3. CAREER APPLICANTS TAB */}
          {activeTab === "careers" && (
            <div className="space-y-6">
              {/* Filter controls */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-zinc-900/60 border border-zinc-800 p-4 rounded-2xl">
                <div className="flex flex-1 items-center gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <Input 
                      placeholder="Search candidates by name, position, email or city..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="pl-10 bg-zinc-950 border-zinc-800 text-xs rounded-xl h-11 text-white placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-accent"
                    />
                  </div>
                  <select 
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="bg-zinc-950 border border-zinc-800 text-xs rounded-xl h-11 px-3 text-zinc-300 focus:outline-none"
                  >
                    <option value="all">All Candidate Statuses</option>
                    <option value="under_review">Under Review</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="interviewed">Interviewed</option>
                    <option value="hired">Hired</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <Button 
                  onClick={exportCandidatesCSV}
                  variant="outline" 
                  size="sm" 
                  className="border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 text-xs font-bold uppercase tracking-widest h-11 rounded-xl shrink-0"
                >
                  <Download className="w-4 h-4 mr-2 text-purple-400" /> Export Candidates CSV
                </Button>
              </div>

              {/* Applicants Table */}
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-zinc-950 border-b border-zinc-800 uppercase tracking-wider text-zinc-400 text-[10px]">
                      <tr>
                        <th className="p-4">Candidate Name</th>
                        <th className="p-4">Position / Role</th>
                        <th className="p-4">Experience & City</th>
                        <th className="p-4">Notice & CTC</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60">
                      {filteredApps.map(app => (
                        <tr key={app.id} className="hover:bg-zinc-800/40 transition-colors">
                          <td className="p-4">
                            <p className="font-bold text-white text-sm font-sans">{app.fullName}</p>
                            <p className="text-[11px] text-zinc-400">{app.email}</p>
                            <p className="text-[11px] text-zinc-500">{app.phone}</p>
                          </td>
                          <td className="p-4 text-zinc-300 font-sans font-bold">{app.position}</td>
                          <td className="p-4 text-zinc-400">
                            <div>Exp: <span className="text-white">{app.experience}</span></div>
                            <div>City: <span className="text-white">{app.city}</span></div>
                          </td>
                          <td className="p-4 text-zinc-400">
                            <div>Notice: <span className="text-white">{app.noticePeriod}</span></div>
                            <div>Expected: <span className="text-white">{app.expectedSalary || 'N/A'}</span></div>
                          </td>
                          <td className="p-4">
                            <select 
                              value={app.status || "under_review"}
                              onChange={async (e) => await updateCareerApplicationStatus(app.id, e.target.value)}
                              className="bg-zinc-950 border border-zinc-800 text-[11px] font-bold rounded-lg px-2.5 py-1.5 text-zinc-200 focus:outline-none cursor-pointer"
                            >
                              <option value="under_review">Under Review</option>
                              <option value="shortlisted">Shortlisted</option>
                              <option value="interviewed">Interviewed</option>
                              <option value="hired">Hired</option>
                              <option value="rejected">Rejected</option>
                            </select>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button 
                                onClick={() => setSelectedCandidate(app)} 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0 text-zinc-400 hover:text-white"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button 
                                onClick={async () => {
                                  if (confirm(`Delete candidate profile for ${app.fullName}?`)) {
                                    await deleteCareerApplication(app.id);
                                  }
                                }} 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0 text-zinc-500 hover:text-red-400"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredApps.length === 0 && (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-zinc-500">
                            No candidate applications found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 4. PAYMENTS AUDIT TAB */}
          {activeTab === "payments" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-zinc-900/60 border border-zinc-800 p-4 rounded-2xl">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <Input 
                    placeholder="Search transactions by customer, payment ID, or package..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-10 bg-zinc-950 border-zinc-800 text-xs rounded-xl h-11 text-white placeholder:text-zinc-600"
                  />
                </div>
                <div className="flex items-center gap-3 font-mono text-xs bg-zinc-950 px-4 py-2.5 rounded-xl border border-zinc-800">
                  <span className="text-zinc-400">Total Collected:</span>
                  <span className="font-bold text-emerald-400 text-sm">₹{totalRevenue.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-zinc-950 border-b border-zinc-800 uppercase tracking-wider text-zinc-400 text-[10px]">
                      <tr>
                        <th className="p-4">Transaction ID</th>
                        <th className="p-4">Customer Details</th>
                        <th className="p-4">Package & Type</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60">
                      {filteredPayments.map(p => (
                        <tr key={p.id} className="hover:bg-zinc-800/40 transition-colors">
                          <td className="p-4 font-bold text-zinc-300">{p.paymentId || p.id}</td>
                          <td className="p-4">
                            <p className="font-bold text-white font-sans">{p.customerName}</p>
                            <p className="text-[11px] text-zinc-400">{p.customerEmail}</p>
                          </td>
                          <td className="p-4 font-sans font-medium text-zinc-300">
                            {p.packageName}
                            {p.isDeposit && <Badge className="ml-2 bg-amber-500/20 text-amber-300 text-[9px] border-amber-500/30">Deposit Token</Badge>}
                          </td>
                          <td className="p-4 text-emerald-400 font-bold text-sm">₹{Number(p.amountInINR).toLocaleString('en-IN')}</td>
                          <td className="p-4">
                            <Badge variant="outline" className={`font-mono text-[10px] uppercase ${
                              p.status === 'success' ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10' : 'border-red-500/40 text-red-400 bg-red-500/10'
                            }`}>
                              {p.status}
                            </Badge>
                          </td>
                          <td className="p-4 text-zinc-400">
                            {p.createdAt?.toDate ? p.createdAt.toDate().toLocaleDateString() : 'Recent'}
                          </td>
                        </tr>
                      ))}
                      {filteredPayments.length === 0 && (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-zinc-500">
                            No payment audit records recorded.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 5. REGISTERED PROFILES TAB */}
          {activeTab === "profiles" && (
            <div className="space-y-6">
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-zinc-950 border-b border-zinc-800 uppercase tracking-wider text-zinc-400 text-[10px]">
                      <tr>
                        <th className="p-4">User ID / Profile</th>
                        <th className="p-4">Company</th>
                        <th className="p-4">Industry</th>
                        <th className="p-4">Role</th>
                        <th className="p-4">Last Updated</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60">
                      {profiles.map(prof => (
                        <tr key={prof.id} className="hover:bg-zinc-800/40 transition-colors">
                          <td className="p-4 font-sans font-bold text-white">
                            {prof.displayName || prof.id}
                          </td>
                          <td className="p-4 text-zinc-300 font-sans">{prof.company || "N/A"}</td>
                          <td className="p-4 text-zinc-300 font-sans">{prof.industry || "N/A"}</td>
                          <td className="p-4 text-zinc-300 font-sans">{prof.role || "N/A"}</td>
                          <td className="p-4 text-zinc-400">
                            {prof.updatedAt?.toDate ? prof.updatedAt.toDate().toLocaleDateString() : 'N/A'}
                          </td>
                        </tr>
                      ))}
                      {profiles.length === 0 && (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-zinc-500">
                            No registered user profiles found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 6. JOB POSTINGS MANAGER TAB */}
          {activeTab === "jobs" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-zinc-900/60 border border-zinc-800 p-4 rounded-2xl">
                <div>
                  <h2 className="text-lg font-bold uppercase tracking-tight text-white">Active Vacancies & Careers Manager</h2>
                  <p className="text-xs text-zinc-400 font-mono">Job postings defined here will dynamically display on the Careers page.</p>
                </div>
                <Button 
                  onClick={() => {
                    setJobFormData({
                      id: "",
                      title: "",
                      department: "Engineering",
                      location: "Noida / Hybrid",
                      type: "Full-Time",
                      experience: "1-3 Yrs",
                      description: "",
                      active: true
                    });
                    setShowJobModal(true);
                  }}
                  className="bg-white text-black hover:bg-zinc-200 font-extrabold text-xs uppercase tracking-widest rounded-xl px-5 h-11 shadow-lg"
                >
                  <Plus className="w-4 h-4 mr-2" /> Post New Job Opening
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {jobOpenings.map(job => (
                  <div key={job.id} className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-4 hover:border-zinc-700 transition-all">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Badge variant="outline" className="text-[10px] font-mono uppercase border-accent/30 text-accent mb-2">
                          {job.department}
                        </Badge>
                        <h3 className="text-xl font-bold uppercase tracking-tight text-white">{job.title}</h3>
                      </div>
                      <Badge variant="outline" className={`font-mono text-[10px] uppercase ${job.active ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10' : 'border-zinc-700 text-zinc-500'}`}>
                        {job.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>

                    <p className="text-zinc-400 text-xs leading-relaxed">{job.description}</p>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400 pt-3 border-t border-zinc-800/80">
                      <span>📍 {job.location}</span>
                      <span>⏱️ {job.type}</span>
                      <span>💼 {job.experience}</span>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                      <Button 
                        onClick={() => {
                          setJobFormData({
                            id: job.id,
                            title: job.title || "",
                            department: job.department || "Engineering",
                            location: job.location || "Noida",
                            type: job.type || "Full-Time",
                            experience: job.experience || "1-3 Yrs",
                            description: job.description || "",
                            active: job.active ?? true
                          });
                          setShowJobModal(true);
                        }}
                        variant="outline"
                        size="sm"
                        className="border-zinc-800 text-zinc-300 hover:text-white font-bold text-xs uppercase"
                      >
                        Edit
                      </Button>
                      <Button 
                        onClick={async () => {
                          if (confirm(`Remove job opening "${job.title}"?`)) {
                            await deleteJobOpening(job.id);
                          }
                        }}
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:bg-red-500/10 font-bold text-xs uppercase"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}

                {jobOpenings.length === 0 && (
                  <div className="col-span-full bg-zinc-900/40 border border-zinc-800 rounded-3xl p-12 text-center text-zinc-500 font-mono space-y-4">
                    <p className="text-sm">No custom job postings created yet.</p>
                    <p className="text-xs">Click "Post New Job Opening" above to create career opportunities for candidates.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 7. SYSTEM MAINTENANCE & SETTINGS TAB */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                  <div className="space-y-1">
                    <h2 className="text-xl font-bold uppercase tracking-tight text-white flex items-center gap-2">
                      <ShieldAlert className="w-5 h-5 text-amber-400" /> System Maintenance & Release Control
                    </h2>
                    <p className="text-xs text-zinc-400 font-mono">
                      Control website global public access status and system maintenance announcements.
                    </p>
                  </div>
                  <Badge variant="outline" className={`font-mono text-xs uppercase px-3 py-1 ${
                    systemSettings?.maintenanceMode
                      ? "border-amber-500/40 text-amber-400 bg-amber-500/10"
                      : "border-emerald-500/40 text-emerald-400 bg-emerald-500/10"
                  }`}>
                    {systemSettings?.maintenanceMode ? "MAINTENANCE ACTIVE" : "PUBLIC SITE LIVE"}
                  </Badge>
                </div>

                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-6 bg-zinc-950 border border-zinc-800 rounded-xl">
                    <div className="space-y-1">
                      <h3 className="font-bold text-sm uppercase text-white">Maintenance Mode Status</h3>
                      <p className="text-xs text-zinc-400 font-sans">
                        When enabled, all public site visitors are shown the Maintenance Screen. Admin Panel remains accessible.
                      </p>
                    </div>

                    <Button 
                      disabled={savingSettings}
                      onClick={() => handleToggleMaintenance(!systemSettings?.maintenanceMode)}
                      className={`h-12 px-8 font-extrabold text-xs uppercase tracking-widest rounded-xl shadow-lg shrink-0 ${
                        systemSettings?.maintenanceMode
                          ? "bg-emerald-500 hover:bg-emerald-400 text-black font-black"
                          : "bg-amber-500 hover:bg-amber-400 text-black font-black"
                      }`}
                    >
                      <Power className="w-4 h-4 mr-2" />
                      <span>{savingSettings ? "Saving..." : systemSettings?.maintenanceMode ? "DISABLE MAINTENANCE (GO LIVE)" : "ENABLE MAINTENANCE MODE"}</span>
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono text-zinc-400 uppercase font-bold">Public Maintenance Notice Message</label>
                    <textarea 
                      rows={3}
                      value={customMsg}
                      onChange={e => setCustomMsg(e.target.value)}
                      placeholder="Custom message shown to visitors during maintenance..."
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-zinc-600 font-sans"
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button 
                      disabled={savingSettings}
                      onClick={() => handleToggleMaintenance(systemSettings?.maintenanceMode)}
                      className="bg-white text-black hover:bg-zinc-200 font-extrabold text-xs uppercase tracking-widest px-8 h-12 rounded-xl"
                    >
                      {savingSettings ? "Updating Message..." : "Save Maintenance Notice"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* --- MODAL 1: LEAD DETAIL --- */}
      <AnimatePresence>
        {selectedLead && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedLead(null)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative z-10 bg-zinc-900 border border-zinc-800 max-w-lg w-full rounded-2xl p-6 sm:p-8 text-white space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <h3 className="text-xl font-bold uppercase tracking-tight">Client Inquiry Details</h3>
                <button onClick={() => setSelectedLead(null)} className="text-zinc-400 hover:text-white"><X size={20} /></button>
              </div>

              <div className="space-y-4 text-xs font-mono">
                <div>
                  <span className="text-zinc-500 uppercase">Client Name</span>
                  <p className="text-white text-base font-sans font-bold">{selectedLead.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-zinc-500 uppercase">Email</span>
                    <p className="text-zinc-200">{selectedLead.email}</p>
                  </div>
                  <div>
                    <span className="text-zinc-500 uppercase">Phone</span>
                    <p className="text-zinc-200">{selectedLead.phone}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-zinc-500 uppercase">Company</span>
                    <p className="text-zinc-200 font-sans font-bold">{selectedLead.company}</p>
                  </div>
                  <div>
                    <span className="text-zinc-500 uppercase">Project Type</span>
                    <p className="text-zinc-200">{selectedLead.projectType}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-zinc-500 uppercase">Urgency</span>
                    <p className="text-zinc-200">{selectedLead.urgency}</p>
                  </div>
                  <div>
                    <span className="text-zinc-500 uppercase">Budget</span>
                    <p className="text-zinc-200">{selectedLead.budget}</p>
                  </div>
                </div>
                <div>
                  <span className="text-zinc-500 uppercase">Full Message / Requirements</span>
                  <p className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-300 font-sans text-xs leading-relaxed mt-1">
                    {selectedLead.message}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800 flex justify-end">
                <Button onClick={() => setSelectedLead(null)} className="bg-white text-black hover:bg-zinc-200 font-bold text-xs uppercase px-6">Close</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- MODAL 2: CANDIDATE DETAIL --- */}
      <AnimatePresence>
        {selectedCandidate && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedCandidate(null)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative z-10 bg-zinc-900 border border-zinc-800 max-w-xl w-full max-h-[90vh] overflow-y-auto rounded-2xl p-6 sm:p-8 text-white space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <h3 className="text-xl font-bold uppercase tracking-tight">Candidate Profile Application</h3>
                <button onClick={() => setSelectedCandidate(null)} className="text-zinc-400 hover:text-white"><X size={20} /></button>
              </div>

              <div className="space-y-4 text-xs font-mono">
                <div>
                  <span className="text-zinc-500 uppercase">Full Candidate Name</span>
                  <p className="text-white text-lg font-sans font-bold">{selectedCandidate.fullName}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-zinc-500 uppercase">Position</span>
                    <p className="text-zinc-200 font-sans font-bold">{selectedCandidate.position}</p>
                  </div>
                  <div>
                    <span className="text-zinc-500 uppercase">Experience</span>
                    <p className="text-zinc-200">{selectedCandidate.experience}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-zinc-500 uppercase">Email</span>
                    <p className="text-zinc-200">{selectedCandidate.email}</p>
                  </div>
                  <div>
                    <span className="text-zinc-500 uppercase">Phone</span>
                    <p className="text-zinc-200">{selectedCandidate.phone}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-zinc-500 uppercase">City</span>
                    <p className="text-zinc-200">{selectedCandidate.city}</p>
                  </div>
                  <div>
                    <span className="text-zinc-500 uppercase">Notice Period</span>
                    <p className="text-zinc-200">{selectedCandidate.noticePeriod}</p>
                  </div>
                </div>

                {selectedCandidate.portfolioUrl && (
                  <div>
                    <span className="text-zinc-500 uppercase">Portfolio / LinkedIn</span>
                    <p className="mt-1">
                      <a href={selectedCandidate.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-accent underline flex items-center gap-1.5 font-bold">
                        <span>{selectedCandidate.portfolioUrl}</span>
                        <ExternalLink size={12} />
                      </a>
                    </p>
                  </div>
                )}

                <div>
                  <span className="text-zinc-500 uppercase">Introduction / Self-Summary</span>
                  <p className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-300 font-sans text-xs leading-relaxed mt-1">
                    {selectedCandidate.introduction}
                  </p>
                </div>

                {selectedCandidate.resumeData && (
                  <div className="pt-2">
                    <span className="text-zinc-500 uppercase block mb-2">Attached Resume / CV File</span>
                    <a 
                      href={selectedCandidate.resumeData} 
                      download={selectedCandidate.resumeFileName || "Candidate_Resume.pdf"}
                      className="inline-flex items-center gap-2 bg-white text-black font-extrabold text-xs uppercase px-5 py-3 rounded-xl hover:bg-zinc-200 shadow-md"
                    >
                      <Download size={14} /> Download {selectedCandidate.resumeFileName || "Attached Resume"}
                    </a>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-zinc-800 flex justify-end">
                <Button onClick={() => setSelectedCandidate(null)} className="bg-white text-black hover:bg-zinc-200 font-bold text-xs uppercase px-6">Close</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- MODAL 3: CREATE/EDIT JOB POSTING --- */}
      <AnimatePresence>
        {showJobModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowJobModal(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative z-10 bg-zinc-900 border border-zinc-800 max-w-md w-full rounded-2xl p-6 sm:p-8 text-white space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <h3 className="text-xl font-bold uppercase tracking-tight">{jobFormData.id ? "Edit Job Posting" : "Create New Job Posting"}</h3>
                <button onClick={() => setShowJobModal(false)} className="text-zinc-400 hover:text-white"><X size={20} /></button>
              </div>

              <form onSubmit={handleSaveJob} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-zinc-400 uppercase">Job Title</label>
                  <Input 
                    required 
                    value={jobFormData.title}
                    onChange={e => setJobFormData({ ...jobFormData, title: e.target.value })}
                    placeholder="e.g. Senior Frontend Engineer" 
                    className="bg-zinc-950 border-zinc-800 text-xs h-11"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-zinc-400 uppercase">Department</label>
                    <Input 
                      required 
                      value={jobFormData.department}
                      onChange={e => setJobFormData({ ...jobFormData, department: e.target.value })}
                      placeholder="e.g. Engineering" 
                      className="bg-zinc-950 border-zinc-800 text-xs h-11"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-zinc-400 uppercase">Location</label>
                    <Input 
                      required 
                      value={jobFormData.location}
                      onChange={e => setJobFormData({ ...jobFormData, location: e.target.value })}
                      placeholder="e.g. Noida / Hybrid" 
                      className="bg-zinc-950 border-zinc-800 text-xs h-11"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-zinc-400 uppercase">Employment Type</label>
                    <select 
                      value={jobFormData.type}
                      onChange={e => setJobFormData({ ...jobFormData, type: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 text-xs rounded-xl h-11 px-3 text-white"
                    >
                      <option value="Full-Time">Full-Time</option>
                      <option value="Internship">Internship</option>
                      <option value="Freelance / Contract">Freelance / Contract</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-zinc-400 uppercase">Experience</label>
                    <Input 
                      required 
                      value={jobFormData.experience}
                      onChange={e => setJobFormData({ ...jobFormData, experience: e.target.value })}
                      placeholder="e.g. 1-3 Yrs" 
                      className="bg-zinc-950 border-zinc-800 text-xs h-11"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-zinc-400 uppercase">Description</label>
                  <textarea 
                    required 
                    rows={3}
                    value={jobFormData.description}
                    onChange={e => setJobFormData({ ...jobFormData, description: e.target.value })}
                    placeholder="Responsibilities and requirements..." 
                    className="w-full bg-zinc-950 border border-zinc-800 text-xs rounded-xl p-3 text-white focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input 
                    type="checkbox" 
                    id="activeToggle"
                    checked={jobFormData.active}
                    onChange={e => setJobFormData({ ...jobFormData, active: e.target.checked })}
                    className="w-4 h-4 accent-accent"
                  />
                  <label htmlFor="activeToggle" className="text-xs font-mono text-zinc-300">Publish as Active Opening</label>
                </div>

                <div className="pt-4 border-t border-zinc-800 flex justify-end gap-3">
                  <Button type="button" variant="ghost" onClick={() => setShowJobModal(false)} className="text-xs uppercase font-bold text-zinc-400">Cancel</Button>
                  <Button type="submit" className="bg-white text-black hover:bg-zinc-200 font-extrabold text-xs uppercase px-6 h-11 rounded-xl">Save Opening</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminPage;
