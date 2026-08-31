import * as React from "react";
import { 
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate
} from "react-router-dom";
import AboutPage from "./pages/About";
import { PortfolioPlaceholder } from "./components/PortfolioPlaceholder";
import { LogoPlaceholder } from "./components/LogoPlaceholder";
import { 
  Search, 
  ArrowRight, 
  Bot, 
  MessageSquare, 
  Zap, 
  LineChart, 
  Workflow,
  CheckCircle2,
  Menu,
  X,
  Mail,
  User,
  Building2,
  Wallet,
  Twitter,
  Github,
  Linkedin,
  LogIn,
  LogOut,
  Info,
  Globe,
  Code2,
  Target,
  Sparkles,
  Monitor,
  BarChart3,
  Layers,
  Megaphone,
  ChevronRight,
  ShieldCheck,
  Cpu
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { signInWithGoogle, logout, auth, submitLead, updateProfile, getUserProfile, subscribeToUserLeads } from "./lib/firebase";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";

/**
 * BRAND COLORS:
 * Primary: #0B0B0B (Black)
 * Soft Red: #E53935
 * Accent: #A1A1AA (Gray)
 */

const fadeIn = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

// --- Components ---

// --- Shared Components ---

const Logo = ({ variant = "navbar" }: { variant?: "navbar" | "footer" }) => (
  <LogoPlaceholder variant={variant} />
);

const Navbar = ({ 
  user, 
  handleSignIn, 
  logout, 
  profile, 
  onOpenSettings, 
  onOpenHistory 
}: { 
  user: any, 
  handleSignIn: any, 
  logout: any, 
  profile: any,
  onOpenSettings: () => void,
  onOpenHistory: () => void
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [portalOpen, setPortalOpen] = React.useState(false);
  const location = useLocation();
  const isAboutPage = location.pathname.endsWith("/about") || location.pathname.includes("/about");

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = isAboutPage 
    ? [{ name: "Home", href: "/" }] 
    : [
        { name: "Services", href: "#services" },
        { name: "Process", href: "#process" },
        { name: "Discovery", href: "#discovery" },
        { name: "About", href: "/about" }
      ];

  return (
    <>
      {/* Floating Pill Navigation */}
      <div className="fixed top-4 md:top-6 left-0 right-0 z-[60] px-4 md:px-6 flex justify-start md:justify-center pointer-events-none">
        <motion.nav 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "circOut" }}
          className={cn(
            "pointer-events-auto flex items-center justify-between gap-4 md:gap-8 px-2 md:px-3 py-1 md:py-1.5 rounded-full border transition-all duration-700 w-full md:w-auto md:max-w-none group shadow-2xl relative",
            scrolled || isAboutPage
              ? "bg-black/95 backdrop-blur-2xl border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] ring-1 ring-white/5" 
              : "bg-[#0B0B0B]/90 backdrop-blur-md border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.1)]"
          )}
        >
          {/* Logo Section */}
          <Link to="/" className="pl-3 pr-1 transition-all duration-500">
            <Logo />
          </Link>

          {/* Table (Desktop) */}
          <div className="hidden md:flex items-center gap-1 overflow-x-auto no-scrollbar">
            {navItems.map((item) => (
              item.href.startsWith("/") ? (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "px-4 py-2 text-[12px] font-bold uppercase tracking-widest transition-all duration-300 rounded-full shrink-0",
                    "text-zinc-400 hover:text-white hover:bg-white/10"
                  )}
                >
                  {item.name}
                </Link>
              ) : (
                <a 
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "px-4 py-2 text-[12px] font-bold uppercase tracking-widest transition-all duration-300 rounded-full shrink-0",
                    "text-zinc-400 hover:text-white hover:bg-white/10"
                  )}
                >
                  {item.name}
                </a>
              )
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-1 sm:gap-2 pr-1.5 shrink-0">
            {/* Unified Partner Access */}
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setPortalOpen(!portalOpen)}
                  className="w-8 h-8 md:w-9 md:h-9 rounded-full overflow-hidden border border-white/20 transition-all ring-1 ring-white/10 active:scale-95 shadow-lg"
                >
                  <img src={user.photoURL || ""} alt="User" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </button>
                <AnimatePresence>
                  {portalOpen && (
                    <div className="absolute right-0 mt-4 w-64 bg-white border border-zinc-100 shadow-2xl p-4 rounded-2xl overflow-hidden text-black z-[100] pointer-events-auto">
                      <div className="flex items-center gap-3 pb-4 border-b border-zinc-50">
                        <img src={user.photoURL || ""} alt="User" referrerPolicy="no-referrer" className="w-8 h-8 rounded-full border border-zinc-100" />
                        <div className="min-w-0">
                          <p className="text-[11px] font-black truncate uppercase tracking-tight leading-none mb-1">{profile?.displayName || user.displayName}</p>
                          <p className="text-[9px] text-zinc-400 truncate font-bold">{user.email}</p>
                        </div>
                      </div>
                      <div className="py-2 space-y-1">
                        <Button 
                          variant="ghost" 
                          onClick={() => { onOpenHistory(); setPortalOpen(false); }}
                          className="w-full justify-start text-[9px] font-extrabold uppercase tracking-widest h-9 hover:bg-emerald-50 rounded-xl group"
                        >
                          <LineChart size={12} className="mr-2 group-hover:text-emerald-600" /> Project History
                        </Button>
                        <Button 
                          variant="ghost" 
                          onClick={() => { onOpenSettings(); setPortalOpen(false); }}
                          className="w-full justify-start text-[9px] font-extrabold uppercase tracking-widest h-9 hover:bg-blue-50 rounded-xl group"
                        >
                          <User size={12} className="mr-2 group-hover:text-blue-600" /> Account Settings
                        </Button>
                        <div className="pt-1 mt-1 border-t border-zinc-50">
                          <Button 
                            variant="ghost" 
                            onClick={() => { logout(); setPortalOpen(false); }}
                            className="w-full justify-start text-[9px] font-extrabold uppercase tracking-widest h-9 hover:bg-red-50 text-red-600 rounded-xl"
                          >
                            <LogOut size={12} className="mr-2" /> Sign Out
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Button 
                onClick={handleSignIn}
                className="bg-accent/90 hover:bg-accent text-white hover:scale-105 active:scale-95 transition-all rounded-full h-8 md:h-9 px-3 md:px-5 text-[9px] md:text-[10px] font-extrabold uppercase tracking-widest shadow-lg"
              >
                <LogIn size={12} className="mr-0 md:mr-2" /> 
                <span className="hidden sm:inline">Partner Portal</span>
                <span className="sm:hidden">Login</span>
              </Button>
            )}

            <a href="/#contact" className="hidden sm:block transition-all">
              <Button 
                size="sm" 
                className="rounded-full px-6 h-8 sm:h-9 transition-all duration-500 font-bold text-[11px] uppercase tracking-wider bg-white text-black hover:bg-zinc-200"
              >
                Start
              </Button>
            </a>
            
            {/* Mobile Toggle */}
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isOpen}
              className="md:hidden w-8 h-8 rounded-full text-white hover:bg-white/10 shrink-0"
            >
              {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </motion.nav>
      </div>

      {/* Mobile Overlay Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(24px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 z-[55] bg-black/95 flex items-center justify-center p-6 md:hidden"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-sm max-h-[calc(100dvh-3rem)] space-y-12 overflow-y-auto no-scrollbar py-10"
            >
              <div className="flex flex-col items-center gap-8">
                {navItems.map((item, idx) => (
                   item.href.startsWith("/") ? (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className="text-4xl font-extrabold uppercase tracking-tighter text-zinc-500 hover:text-white transition-colors"
                    >
                      <motion.span
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        {item.name}
                      </motion.span>
                    </Link>
                  ) : (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="text-4xl font-extrabold uppercase tracking-tighter text-zinc-500 hover:text-white transition-colors"
                    >
                      <motion.span
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        {item.name}
                      </motion.span>
                    </a>
                  )
                ))}
              </div>

              {user && (
                <div className="pt-8 border-t border-white/10 flex flex-col items-center gap-6 w-full">
                  <button 
                    onClick={() => { onOpenHistory(); setIsOpen(false); }}
                    className="flex items-center gap-4 text-2xl font-bold uppercase text-zinc-500 hover:text-white transition-colors"
                  >
                    <LineChart size={24} /> History
                  </button>
                  <button 
                    onClick={() => { onOpenSettings(); setIsOpen(false); }}
                    className="flex items-center gap-4 text-2xl font-bold uppercase text-zinc-500 hover:text-white transition-colors"
                  >
                    <User size={24} /> Settings
                  </button>
                  <button 
                    onClick={() => { logout(); setIsOpen(false); }}
                    className="flex items-center gap-4 text-2xl font-bold uppercase text-red-500 hover:text-red-400 transition-colors"
                  >
                    <LogOut size={24} /> Sign Out
                  </button>
                </div>
              )}
              
              <div className="pt-12 border-t border-white/10 flex flex-col items-center gap-6">
                <a href="/#contact" onClick={() => setIsOpen(false)} className="w-full">
                  <Button className="w-full h-16 rounded-none bg-white text-black font-bold text-lg uppercase tracking-widest hover:bg-zinc-200">
                    Book Discovery Call
                  </Button>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const AuthPortal = () => {
  const [user, setUser] = React.useState<FirebaseUser | null>(null);
  const [showSettings, setShowSettings] = React.useState(false);
  const [showHistory, setShowHistory] = React.useState(false);
  const [profile, setProfile] = React.useState<any>(null);
  const [leads, setLeads] = React.useState<any[]>([]);
  const [isSaving, setIsSaving] = React.useState(false);
  const [showWelcome, setShowWelcome] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const p = await getUserProfile(currentUser.uid);
        setProfile(p || { displayName: currentUser.displayName || "", company: "", role: "", industry: "" });
      } else {
        setProfile(null);
        setLeads([]);
      }
    });
    return () => unsubscribe();
  }, []);

  React.useEffect(() => {
    if (!user || !showHistory) return;

    const unsubscribe = subscribeToUserLeads(user.uid, (fetchedLeads) => {
      setLeads(fetchedLeads);
    });

    return () => unsubscribe();
  }, [user, showHistory]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    try {
      await updateProfile(user.uid, profile);
      setShowSettings(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') return;
      console.error("Authentication Error:", error);
    }
  };

  return (
    <>
      <Navbar 
        user={user} 
        handleSignIn={handleSignIn} 
        logout={logout} 
        profile={profile} 
        onOpenSettings={() => setShowSettings(true)}
        onOpenHistory={() => setShowHistory(true)}
      />
      
      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSettings(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white max-w-md w-full max-h-[90dvh] relative z-10 shadow-2xl border border-border p-5 sm:p-8 rounded-none overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8 border-b border-border pb-4">
                <h3 className="text-2xl font-black uppercase tracking-tighter">Account Management</h3>
                <button onClick={() => setShowSettings(false)} className="text-muted-foreground hover:text-black">
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                      <User size={12} /> Pro Account Name
                    </label>
                    <Input 
                      value={profile?.displayName || ""} 
                      onChange={e => setProfile({...profile, displayName: e.target.value})}
                      className="rounded-none focus-visible:ring-0" 
                      placeholder="Enter legal name"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                        <Building2 size={12} /> Company
                      </label>
                      <Input 
                        value={profile?.company || ""} 
                        onChange={e => setProfile({...profile, company: e.target.value})}
                        className="rounded-none focus-visible:ring-0" 
                        placeholder="Organization"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                        <Mail size={12} /> Industry
                      </label>
                      <Input 
                        value={profile?.industry || ""} 
                        onChange={e => setProfile({...profile, industry: e.target.value})}
                        className="rounded-none focus-visible:ring-0" 
                        placeholder="Sector"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-border flex justify-end gap-3">
                  <Button type="button" variant="ghost" onClick={() => setShowSettings(false)} className="rounded-none font-bold text-xs uppercase tracking-widest">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSaving} className="bg-black text-white rounded-none px-8 font-bold text-xs uppercase tracking-widest min-w-[120px]">
                    {isSaving ? "Saving..." : "Update Portal"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* History Modal */}
      <AnimatePresence>
        {showHistory && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHistory(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white max-w-2xl w-full max-h-[90dvh] relative z-10 shadow-2xl border border-border p-5 sm:p-8 rounded-none overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8 border-b border-border pb-4">
                <h3 className="text-2xl font-black uppercase tracking-tighter">Project History</h3>
                <button onClick={() => setShowHistory(false)} className="text-muted-foreground hover:text-black">
                  <X size={24} />
                </button>
              </div>

              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-6">
                  {leads.length > 0 ? (
                    leads.map((lead, i) => (
                      <div key={lead.id || i} className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-zinc-100 hover:border-black transition-colors bg-zinc-50/50">
                        <div>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                            {lead.createdAt?.toDate ? lead.createdAt.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Recently Submitted"}
                          </p>
                          <h4 className="font-extrabold text-lg tracking-tight uppercase">{lead.projectType || "General Inquiry"}</h4>
                          <p className="text-xs text-muted-foreground uppercase tracking-tighter truncate max-w-[250px]">{lead.message}</p>
                        </div>
                        <div className="mt-4 md:mt-0">
                          <Badge 
                            variant={lead.status === 'qualified' ? 'secondary' : 'outline'} 
                            className={cn(
                              "rounded-none font-bold uppercase text-[9px] tracking-widest px-3",
                              lead.status === 'new' && "border-accent text-accent",
                              lead.status === 'contacted' && "border-blue-500 text-blue-500",
                              lead.status === 'qualified' && "bg-emerald-500 text-white border-none"
                            )}
                          >
                            {lead.status}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 border-2 border-dashed border-zinc-100 text-muted-foreground bg-zinc-50/30">
                      <p className="text-xs font-bold uppercase tracking-widest">No project history found</p>
                    </div>
                  )}
                  
                  {leads.length > 0 && (
                    <div className="text-center py-8 border-t border-zinc-100 text-muted-foreground mt-4">
                      <p className="text-[9px] font-bold uppercase tracking-[0.3em]">End of Transmission</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
              
              <div className="mt-8 flex justify-end">
                <Button onClick={() => setShowHistory(false)} className="bg-black text-white rounded-none px-12 font-bold text-[10px] uppercase tracking-[0.2em]">
                  Close Panel
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Welcome Login Modal */}
      <AnimatePresence>
        {showWelcome && !user && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowWelcome(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative z-[210] w-full max-w-md max-h-[90dvh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-zinc-200 p-6 sm:p-10 md:p-12 text-center"
            >
              <button 
                onClick={() => setShowWelcome(false)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-black transition-colors p-2"
                aria-label="Close"
              >
                <X size={24} />
              </button>

              <div className="space-y-8">
                <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center mx-auto">
                  <ArrowRight size={40} />
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-4xl font-black uppercase tracking-tighter leading-tight">
                    Log In
                  </h2>
                  <p className="text-gray-400 font-bold text-xl uppercase tracking-wide">
                    First
                  </p>
                </div>

                <p className="text-gray-600 font-medium text-sm leading-relaxed">
                  Sign in to explore our collection of AI tools designed to help you work smarter, not harder.
                </p>

                <div className="space-y-3 pt-4">
                  <Button 
                    onClick={async () => {
                      await handleSignIn();
                      setShowWelcome(false);
                    }}
                    className="w-full h-12 rounded-full bg-black text-white font-bold text-xs uppercase tracking-widest hover:bg-zinc-800 transition-all"
                  >
                    Connect with Google
                  </Button>
                  <button 
                    onClick={() => setShowWelcome(false)}
                    className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500 hover:text-black transition-colors"
                  >
                    Continue as Guest
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

const Hero = () => {
  const [index, setIndex] = React.useState(0);
  const words = ["systems", "marketing", "automation", "websites"];

  React.useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="pt-24 pb-10 md:pt-56 md:pb-40 px-4 md:px-6 overflow-hidden bg-[#FAFAFA] relative">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none" 
        style={{ 
          backgroundImage: `radial-gradient(circle, #000 1.5px, transparent 1.5px)`,
          backgroundSize: '64px 64px' 
        }} 
      />

      {/* Subtle Background Spotlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-gradient-to-b from-accent/10 to-transparent blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-24 items-center relative z-10 px-4 sm:px-10">
        <motion.div 
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="space-y-8 md:space-y-12 text-left"
        >
          <motion.div variants={fadeIn} className="space-y-4 md:space-y-6">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="rounded-full px-3 py-0.5 text-[9px] md:text-xs border-accent/20 text-accent bg-accent/5 backdrop-blur-sm">
                Efficiency Redefined
              </Badge>
            </div>
            
            <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[0.95] uppercase">
              We build AI <br/>
              <span className="relative inline-block min-w-[150px] xs:min-w-[200px] sm:min-w-[280px]">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.4, ease: "circOut" }}
                    className="text-accent absolute left-0"
                  >
                    {words[index]}
                  </motion.span>
                </AnimatePresence>
                <span className="opacity-0">{words[0]}</span> {/* Spacer */}
              </span>
              <br/>
              that run your business
            </h1>
          </motion.div>
          
          <motion.div variants={fadeIn} className="space-y-8 md:space-y-10">
            <p className="text-sm md:text-xl text-muted-foreground max-w-md leading-relaxed font-medium">
              AI automation, growth marketing, search intelligence, and bespoke web platforms engineered for high-performance teams. Clarity over complexity.
            </p>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4">
              <a href="#contact" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-black hover:bg-zinc-800 text-white rounded-none px-8 py-7 md:px-10 md:py-8 text-xs md:text-sm font-bold uppercase tracking-[0.2em] transition-all active:scale-95 shadow-2xl shadow-black/10">
                  Book a Call <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </a>
              <a href="#services" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-none px-8 py-7 md:px-10 md:py-8 text-xs md:text-sm font-bold uppercase tracking-[0.2em] border-2 border-zinc-100 hover:border-black transition-all">
                  Explore Services
                </Button>
              </a>
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="relative lg:mt-0 w-full"
        >
          <motion.div 
            animate={{ 
              y: [0, -10, 0],
            }}
            transition={{ 
              duration: 6, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="relative z-10 bg-white border border-border shadow-2xl rounded-xl p-6 sm:p-10 overflow-hidden transform-gpu"
          >
            <div className="flex items-center justify-between mb-8 border-b border-border pb-6">
              <div className="flex gap-2.5">
                <div className="w-3.5 h-3.5 rounded-full bg-red-400" />
                <div className="w-3.5 h-3.5 rounded-full bg-amber-400" />
                <div className="w-3.5 h-3.5 rounded-full bg-green-400" />
              </div>
              <div className="text-[11px] font-mono font-bold text-muted-foreground flex items-center gap-3">
                <motion.div 
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"
                />
                SYSTEM_OPERATIONS_ACTIVE
              </div>
            </div>
            
            <div className="space-y-6">
              {[
                { label: "AI Lead Enrichment", status: "Active", width: "w-full" },
                { label: "WhatsApp CRM Sync", status: "Processing", width: "w-2/3", color: "bg-accent" },
                { label: "Workflow Optimization", status: "Complete", width: "w-5/6" },
                { label: "Internal Agent Bot", status: "Active", width: "w-3/4" }
              ].map((item, idx) => (
                <div key={idx} className="space-y-3">
                  <div className="flex justify-between text-[13px] font-bold">
                    <span>{item.label}</span>
                    <span className={cn(idx === 1 ? "text-accent" : "text-black", "uppercase tracking-tighter")}>{item.status}</span>
                  </div>
                  <div className="h-2.5 bg-secondary w-full rounded-full overflow-hidden border border-black/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: item.width.split('-')[1] === 'full' ? '100%' : item.width.split('-')[1] === '2/3' ? '66%' : item.width.split('-')[1] === '5/6' ? '83%' : '75%' }}
                      transition={{ duration: 1.5, delay: 0.5 + idx * 0.2 }}
                      className={cn("h-full", item.color ?? "bg-black")}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5 }}
              className="mt-10 p-6 bg-zinc-50 rounded-lg border border-zinc-100 shadow-inner"
            >
              <div className="flex items-center gap-4">
                <Zap className="text-accent w-6 h-6 animate-pulse" />
                <div>
                  <div className="text-base font-black tracking-tight">Operational Efficiency</div>
                  <div className="text-xs text-muted-foreground font-medium">Verified gain of +42.8% since logic deployment</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Subtle Background Elements */}
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl -z-0" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-black/5 rounded-full blur-2xl -z-0" />
        </motion.div>
      </div>
    </section>
  );
};

const Trust = () => {
  const logos = ["LINEAR", "VERCEL", "STRIPE", "REPLICATE", "LANCER", "ANTHROPIC", "OPENAI", "NOTION"];
  
  return (
    <section className="py-10 border-y border-border bg-white overflow-hidden relative">
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10" />
      
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Trusted by Innovative Operations Teams
        </p>
      </div>

      <div className="flex overflow-hidden">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ 
            duration: 30, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="flex gap-16 items-center whitespace-nowrap"
        >
          {[...logos, ...logos].map((logo, idx) => (
            <div key={idx} className="text-2xl font-bold tracking-tighter opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300 px-4">
              {logo}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

interface ServiceItem {
  id: string;
  category: "Automation" | "Marketing" | "SEO" | "Website Development";
  title: string;
  desc: string;
  icon: React.ReactNode;
  highlights: string[];
  deliverables: string[];
  stack: string[];
  metric?: string;
  timeline: string;
  image: string;
  badge?: string;
  showcaseSection?: string;
}

const Features = () => {
  const [activeCategory, setActiveCategory] = React.useState<string>("All");
  const [selectedService, setSelectedService] = React.useState<ServiceItem | null>(null);

  // Core Pillars Overview
  const pillars = [
    {
      id: "web-dev",
      category: "Website Development" as const,
      tag: "Design & Build",
      title: "Website Development",
      subtitle: "Modern Websites & Dashboards",
      desc: "Custom designed modern websites and client dashboards tailored for your brand with clean layouts, mobile responsiveness, and high speed.",
      icon: <Code2 className="w-6 h-6" />,
      metric: "Sub-Second Fast Load",
      keyPoints: ["Clean & Modern UI Design", "Interactive Client Dashboards", "100% Mobile & Desktop Ready"]
    },
    {
      id: "marketing",
      category: "Marketing" as const,
      tag: "Business Growth",
      title: "Marketing & Ads",
      subtitle: "Targeted Growth Campaigns",
      desc: "Reach the right customers with high-performing ads, automated outreach, and marketing campaigns designed to grow revenue.",
      icon: <Target className="w-6 h-6" />,
      metric: "+320% Revenue Growth",
      keyPoints: ["Targeted Social & Meta Ads", "High-Converting Sales Funnels", "Consistent Inbound Inquiries"]
    },
    {
      id: "seo",
      category: "SEO" as const,
      tag: "Organic Reach",
      title: "SEO & Search",
      subtitle: "Google Rankings & Research",
      desc: "Rank higher on Google and modern search platforms with thorough research, optimized web pages, and continuous traffic growth.",
      icon: <Globe className="w-6 h-6" />,
      metric: "Top Google Rankings",
      keyPoints: ["Higher Search Visibility", "Keyword & Market Research", "Fast Organic Traffic Growth"]
    },
    {
      id: "automation",
      category: "Automation" as const,
      tag: "Time Saving",
      title: "AI Automation",
      subtitle: "Smart Daily Workflows",
      desc: "Automate repetitive daily tasks, connect your customer channels, and streamline operations so your business runs smoothly 24/7.",
      icon: <Workflow className="w-6 h-6" />,
      metric: "Save 25+ Hrs/Week",
      keyPoints: ["Automated Customer Replies", "Instant CRM & Lead Sync", "Hands-Off Daily Tasks"]
    }
  ];

  // Comprehensive Services Catalog with customizable portfolio preview assets
  const allServices: ServiceItem[] = [
    // Website Development
    {
      id: "bespoke-web-platforms",
      category: "Website Development",
      title: "Custom Modern Websites",
      desc: "Fast, elegant websites with clean layouts that look beautiful on mobile, tablet, and desktop.",
      icon: <Code2 className="w-6 h-6" />,
      highlights: ["Fast Loading Under 0.5s", "Custom Tailored Design", "100% Mobile Responsive"],
      deliverables: ["Custom UI/UX Design", "Responsive Web Build", "Fast Global Hosting", "Easy Content Updates"],
      stack: ["React", "TypeScript", "Tailwind CSS", "Fast CDN"],
      metric: "0.4s Fast Load",
      timeline: "1-3 Weeks",
      image: "/images/portfolio/websiteui-image4.jpg",
      badge: "Website UI"
    },
    {
      id: "ai-integrated-web",
      category: "Website Development",
      title: "Interactive Client Portals & Dashboards",
      desc: "Modern web portals and management dashboards with live charts, user logins, and metrics.",
      icon: <Cpu className="w-6 h-6" />,
      highlights: ["Real-Time Data Charts", "Secure Client Accounts", "Intuitive Clean UI"],
      deliverables: ["Interactive Dashboard UI", "User Authentication", "Database Integration", "Export & Reporting Tools"],
      stack: ["Modern Dashboard", "Real-Time DB", "Tailwind CSS", "Charts"],
      metric: "100% Intuitive UI",
      timeline: "2-4 Weeks",
      image: "/images/portfolio/websiteui-image2.jpg",
      badge: "Dashboard UI"
    },
    {
      id: "high-perf-uiux",
      category: "Website Development",
      title: "Clean UI/UX & Responsive Layouts",
      desc: "Pristine visual design, intuitive typography, and smooth interactive animations that elevate your brand.",
      icon: <Monitor className="w-6 h-6" />,
      highlights: ["Pixel-Perfect Design", "Smooth Micro-Animations", "Clear Visual Hierarchy"],
      deliverables: ["Full Interactive Mockups", "Design System & Icons", "Mobile-First Polish", "Brand Style Guide"],
      stack: ["Figma Design", "Responsive Layouts", "Modern Typography", "Icons"],
      metric: "100/100 UI Quality",
      timeline: "1-2 Weeks",
      image: "/images/portfolio/websiteui-image3.jpg",
      badge: "Sleek Design"
    },
    {
      id: "enterprise-cloud-sec",
      category: "Website Development",
      title: "Fast Hosting & 99.9% Uptime",
      desc: "Secure, reliable cloud deployment ensuring your website is always fast, online, and protected.",
      icon: <ShieldCheck className="w-6 h-6" />,
      highlights: ["99.9% Guaranteed Uptime", "Free SSL Security", "Global Fast CDN"],
      deliverables: ["Cloud Deployment Setup", "SSL Security Certificate", "Automated Daily Backups", "24/7 Uptime Monitoring"],
      stack: ["Cloud Hosting", "SSL Encryption", "Global CDN", "Security Guard"],
      metric: "99.9% Uptime SLA",
      timeline: "1 Week",
      image: "/images/portfolio/websiteui-image4.jpg",
      badge: "Performance"
    },

    // Marketing & Ads
    {
      id: "ai-growth-marketing",
      category: "Marketing",
      title: "Targeted Meta & Social Ads",
      desc: "High-ROI Facebook, Instagram, and Google ad campaigns optimized for consistent sales growth.",
      icon: <Target className="w-6 h-6" />,
      highlights: ["Targeted Customer Audiences", "High-Converting Ad Creatives", "Continuous Growth Optimization"],
      deliverables: ["Ad Campaign Setup & Launch", "Custom Visuals & Ad Copy", "Audience Targeting Strategy", "Weekly Performance Reports"],
      stack: ["Meta Ads", "Google Ads", "Conversion Tracking", "Creative Design"],
      metric: "+320% Revenue",
      timeline: "1-2 Weeks",
      image: "/images/portfolio/marketing-image1.jpg",
      badge: "Growth Graph"
    },
    {
      id: "automated-outbound",
      category: "Marketing",
      title: "Automated Email Campaigns",
      desc: "Personalized outbound email sequences that book qualified sales meetings with ideal clients.",
      icon: <Megaphone className="w-6 h-6" />,
      highlights: ["Spam-Proof Inboxes", "Personalized Messages", "Automated Call Booking"],
      deliverables: ["Domain & Inbox Warmup", "Tailored Email Copywriting", "Automated Reply Handling", "Direct Calendar Booking"],
      stack: ["Email Outreach", "Domain Security", "Copy Optimization", "Calendar Sync"],
      metric: "4.2x Meeting Bookings",
      timeline: "1-2 Weeks",
      image: "/images/portfolio/marketing-image2.jpg",
      badge: "Sales Scaling"
    },
    {
      id: "conversion-cro",
      category: "Marketing",
      title: "High-Converting Sales Funnels",
      desc: "Turn website visitors into paying customers with optimized layouts and frictionless checkouts.",
      icon: <Sparkles className="w-6 h-6" />,
      highlights: ["Friction-Free Checkout", "Clear Call-to-Actions", "Proven Conversion Layouts"],
      deliverables: ["Sales Page Redesign", "A/B Testing Setup", "Mobile Checkout Optimization", "Customer Heatmap Analysis"],
      stack: ["Landing Pages", "Payment Gateways", "Analytics", "A/B Testing"],
      metric: "+45% Conversion Rate",
      timeline: "1-2 Weeks",
      image: "/images/portfolio/marketing-image3.jpg",
      badge: "Sales Boost"
    },
    {
      id: "brand-content-scale",
      category: "Marketing",
      title: "Brand Strategy & Growth Content",
      desc: "Consistent, high-quality social content and brand assets designed to build trust and audience growth.",
      icon: <Layers className="w-6 h-6" />,
      highlights: ["Consistent Brand Voice", "Multi-Platform Distribution", "High Quality Visuals"],
      deliverables: ["Monthly Content Calendar", "Graphic Design & Copy", "Automated Publishing", "Engagement Tracking"],
      stack: ["Brand Assets", "Content Studio", "Scheduler", "Social Analytics"],
      metric: "5x Audience Growth",
      timeline: "Ongoing",
      image: "/images/portfolio/marketing-image4.jpg",
      badge: "Authority"
    },

    // SEO & Search / Research
    {
      id: "technical-seo",
      category: "SEO",
      title: "Google Search Optimization",
      desc: "Optimize your website structure so search engines index and rank your pages on page 1 of Google.",
      icon: <Globe className="w-6 h-6" />,
      highlights: ["Page 1 Search Ranking", "Fast Page Indexing", "Clean Website Structure"],
      deliverables: ["Full SEO Website Audit", "Speed & Loading Optimization", "Google Search Console Setup", "Sitemap & Indexing Fixes"],
      stack: ["Google Search Console", "SEO Analytics", "Speed Optimization", "Schema Data"],
      metric: "#1 Search Ranking",
      timeline: "1-2 Weeks",
      image: "/images/portfolio/seo-image1.jpg",
      badge: "Google Rank #1"
    },
    {
      id: "ai-search-geo",
      category: "SEO",
      title: "Modern AI & Voice Search",
      desc: "Get your business cited as the recommended choice when customers ask questions on Google AI and ChatGPT.",
      icon: <Search className="w-6 h-6" />,
      highlights: ["Top AI Recommendations", "Direct Brand Citations", "Voice Search Ready"],
      deliverables: ["AI Search Audit", "Business Profile Optimization", "Structured Knowledge Answers", "Monthly Search Visibility Report"],
      stack: ["AI Discovery", "Knowledge Graphs", "Search Optimization", "Directory Citations"],
      metric: "Top AI Citations",
      timeline: "2 Weeks",
      image: "/images/portfolio/seo-image2.jpg",
      badge: "AI Discovery"
    },
    {
      id: "programmatic-seo",
      category: "SEO",
      title: "Target Keyword & Market Research",
      desc: "In-depth competitor and keyword research to capture high-buying intent customers searching for your services.",
      icon: <BarChart3 className="w-6 h-6" />,
      highlights: ["High-Intent Keywords", "Competitor Research", "Content Topic Hubs"],
      deliverables: ["In-Depth Keyword Report", "Competitor Gap Analysis", "High-Ranking Content Strategy", "Keyword Progress Dashboard"],
      stack: ["Keyword Tools", "Competitor Intel", "Content Architecture", "Rank Tracker"],
      metric: "+250% Organic Traffic",
      timeline: "2 Weeks",
      image: "/images/portfolio/seo-image3.jpg",
      badge: "Organic Growth"
    },
    {
      id: "authority-telemetry",
      category: "SEO",
      title: "Search Analytics & Ranking Tracker",
      desc: "Clear visual dashboards tracking your organic keywords, website visits, and rank advancements.",
      icon: <LineChart className="w-6 h-6" />,
      highlights: ["Live Ranking Reports", "Visitor Growth Tracking", "Clear Monthly Metrics"],
      deliverables: ["Live Analytics Dashboard", "Weekly Rank Alerts", "Competitor Movement Tracking", "Monthly Executive Summary"],
      stack: ["Live Dashboard", "Traffic Analytics", "Rank Monitors", "Reports"],
      metric: "Top 3 Ranking",
      timeline: "Ongoing",
      image: "/images/portfolio/seo-image4.jpg",
      badge: "Live Tracking"
    },

    // Automation
    {
      id: "ai-auto-systems",
      category: "Automation",
      title: "AI Business Automation",
      desc: "Connect your favorite apps and automate daily repetitive tasks with smart AI assistants.",
      icon: <Workflow className="w-6 h-6" />,
      highlights: ["Hands-Off Daily Workflows", "Automated Customer Handoffs", "Instant Task Triggers"],
      deliverables: ["Custom Workflow Setup", "App & Tool Integrations", "Reliable Error-Handling", "Easy-to-Use Control Panel"],
      stack: ["AI Assistants", "Cloud Triggers", "Webhooks", "Custom Automation"],
      metric: "Save 25+ Hrs/Week",
      timeline: "1-2 Weeks",
      image: "/images/portfolio/automation-image1.jpg",
      badge: "Popular"
    },
    {
      id: "whatsapp-auto",
      category: "Automation",
      title: "WhatsApp & Chat Automation",
      desc: "Instant, friendly AI chatbot for WhatsApp and website chat to answer inquiries and book calls 24/7.",
      icon: <MessageSquare className="w-6 h-6" />,
      highlights: ["24/7 Instant Responses", "Automatic Customer Triage", "Calendar Call Booking"],
      deliverables: ["WhatsApp Business Setup", "Natural Friendly Chatbot", "Lead & Contact Capture", "Instant Team Alerts"],
      stack: ["WhatsApp API", "Chat System", "CRM Connectors", "Notifications"],
      metric: "24/7 Instant Replies",
      timeline: "1 Week",
      image: "/images/portfolio/automation-image2.jpg",
      badge: "Instant Support"
    },
    {
      id: "lead-gen-systems",
      category: "Automation",
      title: "Automated Lead Pipeline",
      desc: "Automatically gather, verify, and organize qualified leads directly into your sales pipeline.",
      icon: <LineChart className="w-6 h-6" />,
      highlights: ["Verified Prospect Lists", "Automated Follow-Ups", "CRM Auto-Updating"],
      deliverables: ["Target Prospect Sourcing", "Email Verification Setup", "Automated Sequence Logic", "Sales Pipeline Dashboard"],
      stack: ["Lead Enrichment", "Email Infrastructure", "CRM Sync", "Analytics"],
      metric: "3.5x More Leads",
      timeline: "1-2 Weeks",
      image: "/images/portfolio/automation-image3.jpg",
      badge: "High Growth"
    },
    {
      id: "internal-workflow",
      category: "Automation",
      title: "Smart Internal Tools",
      desc: "Custom internal tools and document parsers that eliminate paperwork and save team hours.",
      icon: <Bot className="w-6 h-6" />,
      highlights: ["Instant Document Summaries", "Internal Knowledge Search", "No More Manual Entry"],
      deliverables: ["Document & PDF Reader Bots", "Team Knowledge Base", "Automated Daily Reports", "Slack & Teams Notifications"],
      stack: ["Smart Document AI", "Knowledge Database", "Workflow Nodes", "Dashboard"],
      metric: "Zero Manual Paperwork",
      timeline: "1-2 Weeks",
      image: "/images/portfolio/automation-image1.jpg",
      badge: "Productivity"
    }
  ];

  const filteredServices = activeCategory === "All" 
    ? allServices 
    : allServices.filter(s => s.category === activeCategory);

  const handleInquire = (serviceTitle: string) => {
    setSelectedService(null);
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
    // Dispatch custom event to auto-select project category in Contact form
    window.dispatchEvent(new CustomEvent("select-service-inquiry", { detail: { service: serviceTitle } }));
  };

  return (
    <section id="services" className="py-16 md:py-32 px-4 sm:px-8 lg:px-12 bg-white overflow-hidden relative">
      {/* Compatibility Anchor for existing #systems links */}
      <div id="systems" className="absolute -top-24 pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 md:space-y-24">
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 max-w-2xl"
          >
            <h2 className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.3em] mb-4 md:mb-6 flex items-center gap-3">
              <span className="w-8 h-px bg-zinc-200" /> Full-Spectrum Capabilities
            </h2>
            <p className="text-3xl xs:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter leading-[1.05] uppercase">
              Engineered for scale. <br className="hidden sm:block" /> Built for impact.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-5 pb-2"
          >
            <p className="text-zinc-500 text-sm md:text-base leading-relaxed border-l-2 border-zinc-100 pl-6">
              We architect comprehensive digital engines across four integrated pillars: autonomous AI automation, high-impact growth marketing, search engine authority, and bespoke web platforms.
            </p>
          </motion.div>
        </div>

        {/* 4 Core Pillars Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => (
            <motion.div
              key={pillar.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              onClick={() => setActiveCategory(pillar.category)}
              className={cn(
                "p-6 sm:p-8 border transition-all duration-500 bg-white relative cursor-pointer flex flex-col justify-between group",
                activeCategory === pillar.category 
                  ? "border-black shadow-lg ring-1 ring-black/5" 
                  : "border-zinc-100 hover:border-zinc-300"
              )}
            >
              <div className="absolute top-0 left-0 w-1 h-0 bg-accent group-hover:h-full transition-all duration-500" />
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 bg-zinc-50 border border-zinc-100 flex items-center justify-center rounded-none transition-all duration-300 group-hover:bg-black group-hover:text-white group-hover:border-black">
                    {pillar.icon}
                  </div>
                  <span className="text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 bg-zinc-100 text-zinc-600 rounded-none">
                    {pillar.tag}
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-accent uppercase tracking-widest block">{pillar.subtitle}</span>
                  <h3 className="text-2xl font-black tracking-tight uppercase group-hover:text-accent transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-zinc-500 text-xs leading-relaxed font-medium line-clamp-3">
                    {pillar.desc}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-zinc-100">
                  {pillar.keyPoints.map((point, pIdx) => (
                    <div key={pIdx} className="flex items-center gap-2 text-xs font-semibold text-zinc-700">
                      <span className="w-1.5 h-1.5 bg-accent rounded-full shrink-0" />
                      <span className="truncate">{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-zinc-100 flex items-center justify-between">
                <span className="text-xs font-bold text-black tracking-tight">{pillar.metric}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 group-hover:text-black flex items-center gap-1 transition-colors">
                  Filter Grid <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Portfolio Showcase */}
        <div className="pt-8 md:pt-12 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
            <div>
              <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight">Specialized Capabilities Catalog</h3>
              <p className="text-xs md:text-sm text-zinc-500 font-medium mt-1">
                Explore all granular modules and technical deliverables.
              </p>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {['All', 'Website Development', 'Marketing', 'SEO', 'Automation'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    'px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-widest transition-all rounded-none shrink-0 border',
                    activeCategory === cat
                      ? 'bg-black text-white border-black'
                      : 'bg-zinc-50 text-zinc-500 border-zinc-200 hover:text-black hover:border-zinc-400'
                  )}
                >
                  {cat === 'All' ? 'All Services' : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6 md:space-y-8">
            {(() => {
              const showcaseSections = [
                {
                  category: 'Website Development',
                  title: 'Custom Modern Websites',
                  subtitle: 'Blueprints for premium digital experiences',
                  description: 'Elegant, high-converting websites designed for clarity, speed, and brand trust.',
                  images: [
                    '/images/portfolio/dynamicui.mp4',
                    '/images/portfolio/websiteui-image1.jpg',
                    '/images/portfolio/websiteui-image2.jpg',
                    '/images/portfolio/websiteui-image3.jpg',
                    '/images/portfolio/websiteui-image4.jpg'
                  ],
                  accent: 'bg-[#edf2eb]',
                  reversed: false,
                  visualSize: 'wide',
                  tags: ['UI Systems', 'Responsive Build', 'Landing Pages']
                },
                {
                  category: 'Marketing',
                  title: 'High-Converting Sales Funnels',
                  subtitle: 'Creative-led growth that turns attention into demand',
                  description: 'Campaigns and landing experiences engineered to bring in qualified leads and measurable revenue.',
                  images: [
                    '/images/portfolio/marketing-image1.jpg',
                    '/images/portfolio/marketing-image2.jpg',
                    '/images/portfolio/marketing-image3.jpg',
                    '/images/portfolio/marketing-image4.jpg'
                  ],
                  accent: 'bg-[#f5f3f0]',
                  reversed: true,
                  visualSize: 'standard',
                  tags: ['Ad Strategy', 'Funnel Design', 'Lead Flow']
                },
                {
                  category: 'SEO',
                  title: 'Search Growth & Visibility',
                  subtitle: 'Search authority designed for long-term organic momentum',
                  description: 'Technical SEO and content structures that help your brand rank and stay discoverable.',
                  images: [
                    '/images/portfolio/seo-image1.jpg',
                    '/images/portfolio/seo-image2.jpg',
                    '/images/portfolio/seo-image3.jpg',
                    '/images/portfolio/seo-image4.jpg'
                  ],
                  accent: 'bg-[#eef4f8]',
                  reversed: false,
                  visualSize: 'standard',
                  tags: ['Keyword Strategy', 'Technical SEO', 'Organic Reach']
                },
                {
                  category: 'Automation',
                  title: 'AI Business Automation',
                  subtitle: 'Operational systems that remove repetitive work',
                  description: 'Connected workflows and smart automations that keep enquiries, tasks, and follow-ups running smoothly.',
                  images: [
                    '/images/portfolio/automation-image1.jpg',
                    '/images/portfolio/automation-image2.jpg',
                    '/images/portfolio/automation-image3.jpg'
                  ],
                  accent: 'bg-[#f2f2f3]',
                  reversed: true,
                  visualSize: 'standard',
                  tags: ['Workflow Logic', 'AI Agents', 'CRM Sync']
                }
              ];

              const visibleShowcase = activeCategory === 'All'
                ? showcaseSections
                : showcaseSections.filter((item) => item.category === activeCategory);

              return visibleShowcase.map((item, idx) => (
                <motion.div
                  key={item.category}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: idx * 0.08 }}
                  whileHover={{ y: -6 }}
                  className={cn(
                    'group overflow-hidden rounded-[32px] border border-zinc-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.06)] transition-all duration-500 hover:shadow-[0_28px_80px_rgba(15,23,42,0.09)]',
                    item.accent,
                    item.visualSize === 'wide' && 'md:scale-[1.01]'
                  )}
                >
                  <div
                    className={cn(
                      'grid items-stretch md:grid-cols-[1.5fr_1.1fr]',
                      item.visualSize === 'standard' && 'md:grid-cols-[1.45fr_1.15fr]',
                      item.reversed && 'md:[&>*:first-child]:order-2 md:[&>*:last-child]:order-1'
                    )}
                  >
                    <div className="relative min-h-[240px] md:min-h-[280px] overflow-hidden bg-zinc-100 flex items-center justify-center p-4 md:p-6">
                      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/20 to-transparent z-10" />
                      {item.images[0].endsWith('.mp4') ? (
                        <video
                          src={item.images[0]}
                          autoPlay
                          muted
                          loop
                          className="h-auto w-4/5 max-h-[85%] object-contain transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                        />
                      ) : (
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          className="h-auto w-4/5 max-h-[85%] object-contain transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                        />
                      )}
                      <div className="absolute inset-x-0 bottom-4 md:bottom-6 z-20 p-4 sm:p-5 md:p-6">
                        <div className="text-[8px] font-bold uppercase tracking-[0.22em] text-white/75">{item.category}</div>
                        <h3 className="mt-1 text-lg sm:text-xl md:text-2xl font-black uppercase tracking-[-0.05em] leading-[0.95] text-white max-w-xl">
                          {item.title}
                        </h3>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between p-3 sm:p-4 md:p-4 lg:p-5">
                      <div>
                        <div className="text-[9px] font-bold uppercase tracking-[0.22em] text-zinc-500">{item.subtitle}</div>
                        <p className="mt-2 max-w-md text-sm sm:text-base leading-relaxed text-zinc-600">
                          {item.description}
                        </p>
                      </div>

                      <div className="mt-3 space-y-3">
                        <div className="flex flex-wrap gap-2">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full border border-zinc-300 bg-white/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-700 shadow-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => setActiveCategory(item.category)}
                          className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.24em] text-zinc-900 transition-all duration-300 hover:text-black hover:gap-3"
                        >
                          Explore section <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-zinc-200 bg-white/60 p-2.5 sm:p-3 md:p-3">
                    <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-2.5">
                      {item.images.filter((img) => !img.endsWith('.mp4')).map((image, imageIdx) => (
                        <div
                          key={`${item.category}-${imageIdx}`}
                          className="overflow-hidden border border-zinc-200 bg-zinc-50"
                        >
                          <img
                            src={image}
                            alt={`${item.category} preview ${imageIdx + 1}`}
                            className="h-28 w-full object-cover transition-transform duration-500 hover:scale-[1.04] md:h-32"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ));
            })()}
          </div>
        </div>

        {/* Interactive Service Detail Modal / Drawer */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-2xl bg-white border border-zinc-200 shadow-2xl p-6 sm:p-8 space-y-6 z-10 max-h-[90vh] overflow-y-auto"
            >
              {/* Visual Banner Header */}
              <div className="relative h-64 sm:h-72 md:h-80 -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 overflow-hidden bg-zinc-950">
                <PortfolioPlaceholder 
                  category={selectedService.category}
                  title={selectedService.title}
                  metric={selectedService.metric}
                  badge={selectedService.badge}
                  imageSrc={selectedService.image}
                  isModal={true}
                />
                
                <button 
                  onClick={() => setSelectedService(null)}
                  className="absolute top-3 right-3 p-1.5 bg-black/80 text-white hover:bg-black transition-colors rounded-full z-30 border border-white/20"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Core Description */}
              <p className="text-zinc-600 text-sm sm:text-base leading-relaxed">
                {selectedService.desc}
              </p>

              {/* Deliverables Checklist */}
              <div className="space-y-3 bg-zinc-50 p-5 sm:p-6 border border-zinc-100">
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">Key Deliverables & Specifications</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {selectedService.deliverables.map((del, dIdx) => (
                    <div key={dIdx} className="flex items-start gap-2.5 text-xs font-semibold text-zinc-800">
                      <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                      <span>{del}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Stack & Execution Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 border border-zinc-100 space-y-1">
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block">Typical Timeline</span>
                  <span className="text-sm font-bold text-black">{selectedService.timeline}</span>
                </div>
                <div className="p-4 border border-zinc-100 space-y-1">
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block">Expected Impact</span>
                  <span className="text-sm font-bold text-accent">{selectedService.metric || "Instant Scale"}</span>
                </div>
                <div className="p-4 border border-zinc-100 space-y-1">
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block">Tech Ecosystem</span>
                  <span className="text-xs font-semibold text-zinc-700 truncate block">{selectedService.stack.join(", ")}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-4 border-t border-zinc-100">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedService(null)}
                  className="rounded-none uppercase tracking-widest text-xs font-bold py-5 px-5"
                >
                  Close
                </Button>
                <Button 
                  onClick={() => handleInquire(selectedService.title)}
                  className="rounded-none bg-black hover:bg-zinc-800 text-white uppercase tracking-widest text-xs font-bold py-5 px-6 flex items-center gap-2 shadow-lg"
                >
                  Inquire For This Service <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  </section>
  );
};

const HowItWorks = () => {
  const steps = [
    {
      num: "01",
      title: "Understand your workflow",
      desc: "We dive deep into your manual bottlenecks and paper-trails."
    },
    {
      num: "02",
      title: "Design system",
      desc: "Architecting a custom AI-first logic that fits your operations."
    },
    {
      num: "03",
      title: "Automate & integrate",
      desc: "Building and connecting the tools to your existing stack."
    },
    {
      num: "04",
      title: "Scale",
      desc: "Monitoring, refining, and scaling the system to match growth."
    }
  ];

  return (
    <section id="process" className="py-12 md:py-32 px-6 sm:px-10 bg-[#0B0B0B] text-white overflow-hidden relative">
      {/* Subtle Pattern Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      <div className="max-w-7xl mx-auto space-y-12 md:space-y-20 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 md:gap-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4 md:space-y-6"
          >
            <h2 className="text-[10px] font-bold text-accent uppercase tracking-[0.4em] flex items-center gap-4">
               <span className="w-8 md:w-12 h-px bg-white/10" /> The Blueprint
            </h2>
            <p className="text-3xl xs:text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tighter leading-tight uppercase">How we turn <br/> chaos into <span className="text-accent underline decoration-white/10 underline-offset-8">clarity</span>.</p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-sm border-l border-white/10 pl-6 md:pl-8 pb-2"
          >
            <p className="text-zinc-400 text-sm md:text-base leading-relaxed font-medium">
              Our process is rigorous and outcome-driven. We don't just 'do AI'—we build operational infrastructure.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12 relative">
          <div className="hidden lg:block absolute top-[2.25rem] left-0 right-0 h-px bg-white/5 -z-0" />
          
          {steps.map((step, idx) => (
            <motion.div 
              key={idx}
              className="space-y-6 md:space-y-8 relative z-10 group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.6 }}
            >
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white text-black flex items-center justify-center font-bold text-xs md:text-sm rounded-none group-hover:bg-accent group-hover:text-white transition-all duration-500 transform group-hover:-rotate-12">
                {step.num}
              </div>
              <div className="space-y-3 md:space-y-4">
                <h3 className="text-xl md:text-2xl font-extrabold uppercase tracking-tight group-hover:translate-x-2 transition-transform duration-500">{step.title}</h3>
                <p className="text-zinc-500 text-[13px] md:text-sm leading-relaxed font-medium">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};


const ToolDiscovery = () => {
  const [user, setUser] = React.useState<FirebaseUser | null>(null);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  const tools = [
    // Intelligence
    { name: "GPT-4o", cat: "Intelligence", use: "Multi-modal foundation model for complex reasoning and logic.", status: "Active", url: "https://chatgpt.com" },
    { name: "Claude 3.5 Sonnet", cat: "Intelligence", use: "High-accuracy LLM focused on coding and creative writing.", status: "Active", url: "https://claude.ai" },
    { name: "Gemini 1.5 Pro", cat: "Intelligence", use: "Powerful model with massive context window for large-scale analysis.", status: "Active", url: "https://gemini.google.com" },
    
    // Creative
    { name: "Midjourney v6", cat: "Creative", use: "State-of-the-art photorealistic image generation workflows.", status: "Active", url: "https://midjourney.com" },
    { name: "Jasper", cat: "Creative", use: "AI content platform for marketing and brand voice scaling.", status: "Active", url: "https://jasper.ai" },
    { name: "Canva Magic", cat: "Creative", use: "AI-powered design suite for instant visual asset creation.", status: "Active", url: "https://canva.com" },
    { name: "Copy.ai", cat: "Creative", use: "GTM (Go-to-Market) automation platform for high-growth teams.", status: "Active", url: "https://copy.ai" },
    
    // Automation
    { name: "FlowGenie", cat: "Automation", use: "Advanced workflow orchestration and revenue operations.", status: "Featured", highlight: true, url: "#" },
    { name: "SalesBridge", cat: "Automation", use: "Lead-to-deal pipeline orchestration with AI nurturing.", status: "Featured", highlight: true, url: "#" },
    { name: "Zapier Central", cat: "Automation", use: "Autonomous agents that connect with 6000+ business apps.", status: "Active", url: "https://zapier.com" },
    { name: "Notion AI", cat: "Automation", use: "Integrated workspace intelligence for docs and projects.", status: "Active", url: "https://notion.ai" },
    { name: "Make", cat: "Automation", use: "Advanced visual automation platform for complex integrations.", status: "Active", url: "https://make.com" },
    { name: "AutoGPT", cat: "Automation", use: "Semi-autonomous agent framework for multi-step tasks.", status: "Active", url: "https://github.com/Significant-Gravitas/AutoGPT" },
    
    // Search & Data
    { name: "Perplexity", cat: "Search", use: "Real-time answer engine with cited sources and logic checks.", status: "Active", url: "https://perplexity.ai" },
    { name: "Tableau AI", cat: "Data", use: "Predictive analytics and automated data storytelling.", status: "Active", url: "https://tableau.com" },
    { name: "DeepEnrich", cat: "Data", use: "Precision lead data enrichment utilizing neural scrapers.", status: "Featured", highlight: true, url: "#" },
    
    // Development
    { name: "Cursor", cat: "Development", use: "AI-native IDE that understands entire codebases natively.", status: "Active", url: "https://cursor.com" },
    { name: "GitHub Copilot", cat: "Development", use: "The world's most widely adopted AI pair programmer.", status: "Active", url: "https://github.com/features/copilot" }
  ];

  const [search, setSearch] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("all");

  const filteredTools = tools.filter(tool => {
    const matchesSearch = 
      tool.name.toLowerCase().includes(search.toLowerCase()) || 
      tool.use.toLowerCase().includes(search.toLowerCase()) ||
      tool.cat.toLowerCase().includes(search.toLowerCase());
    
    const matchesTab = 
      activeTab === "all" || 
      tool.cat.toLowerCase() === activeTab.toLowerCase();
      
    return matchesSearch && matchesTab;
  });

  const categories = ["All", "Intelligence", "Automation", "Creative", "Search", "Data", "Development"];

  return (
    <section id="discovery" className="py-12 md:py-32 px-6 sm:px-10 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-8 md:space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight uppercase">AI Tool Discovery</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed text-xs md:text-base font-medium">
            Discover the best AI tools and workflows to simplify your work and boost productivity.
          </p>
        </div>

        <div className="space-y-6 md:space-y-12">
          <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between items-center bg-zinc-50 p-4 md:p-6 rounded-none border border-zinc-100">
            <div className="relative w-full max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-3.5 h-3.5" />
              <Input 
                placeholder="Search tools..." 
                className="pl-10 py-5 md:pl-12 md:py-7 rounded-none border-zinc-200 focus:border-black focus-visible:ring-0 transition-all bg-white text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab} 
              className="w-full lg:w-auto overflow-x-auto"
            >
              <ScrollArea className="w-full whitespace-nowrap pb-1">
                <TabsList className="bg-transparent rounded-none p-0 inline-flex border-b border-zinc-200 w-full lg:w-auto">
                  {categories.map(cat => (
                    <TabsTrigger 
                      key={cat} 
                      value={cat.toLowerCase()} 
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:text-black data-[state=active]:shadow-none px-4 md:px-6 py-3 md:py-4 font-bold uppercase tracking-widest text-[8px] md:text-[9px] text-zinc-400 hover:text-black transition-colors"
                    >
                      {cat}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </ScrollArea>
            </Tabs>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "200px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 relative min-h-[500px]"
          >
            {!user && (
              <div className="absolute inset-x-0 top-0 bottom-0 z-20 bg-white/40 backdrop-blur-[24px] flex items-start justify-center p-6 md:p-12 overflow-hidden pointer-events-none">
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: "circOut" }}
                  className="bg-white p-10 md:p-16 border border-zinc-100 shadow-[0_100px_150px_-50px_rgba(0,0,0,0.2)] text-center max-w-[340px] md:max-w-xl space-y-10 relative mt-16 md:mt-24 pointer-events-auto rounded-[3rem]"
                >
                  <div className="w-16 h-16 md:w-24 md:h-24 bg-black text-white rounded-full flex items-center justify-center mx-auto shadow-2xl transition-transform hover:scale-110 duration-500">
                    <LogIn size={32} />
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-black text-3xl md:text-5xl tracking-tighter uppercase leading-[0.8] text-black">
                      Log In <br/><span className="text-zinc-200">First</span>
                    </h3>
                    <p className="text-[11px] md:text-base text-zinc-400 leading-relaxed font-medium max-w-[280px] md:max-w-md mx-auto">
                      Sign in to explore our collection of AI tools designed to help you work smarter, not harder.
                    </p>
                  </div>
                  <div className="pt-4 flex flex-col items-center gap-6">
                    <Button 
                      onClick={async () => {
                        try {
                          await signInWithGoogle();
                        } catch (error: any) {
                          if (error.code === 'auth/popup-closed-by-user') return;
                          console.error("Auth Error:", error);
                        }
                      }}
                      className="w-full h-14 md:h-16 rounded-full bg-black text-white font-black text-[10px] md:text-xs uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all shadow-xl active:scale-95"
                    >
                      Connect with Google
                    </Button>
                    <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-zinc-300">Ready to boost your workflow?</p>
                  </div>
                </motion.div>
              </div>
            )}
            <AnimatePresence mode="popLayout">
              {filteredTools.map((tool) => (
                <motion.div
                  layout
                  variants={fadeIn}
                  key={tool.name}
                  className="h-full"
                >
                  <a 
                    href={tool.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="h-full block"
                  >
                    <Card className={cn(
                      "rounded-none border-zinc-100 hover:border-black transition-all duration-500 cursor-pointer group h-full flex flex-col shadow-none hover:shadow-xl hover:shadow-black/[0.02]",
                      tool.highlight ? "bg-zinc-50/50 ring-1 ring-black/5 shadow-sm" : ""
                    )}>
                      <CardContent className="p-5 md:p-6 flex flex-col justify-between h-full">
                        <div className="space-y-3 md:space-y-4">
                          <div className="flex justify-between items-start">
                            <Badge variant={tool.highlight ? "default" : "secondary"} className="rounded-none uppercase text-[8px] md:text-[9px] font-bold tracking-widest px-2">
                              {tool.cat}
                            </Badge>
                            <span className={cn(
                              "text-[9px] md:text-[10px] font-bold uppercase tracking-tight",
                              tool.highlight ? "text-accent" : "text-muted-foreground"
                            )}>
                              {tool.status}
                            </span>
                          </div>
                          <div className="space-y-1 md:space-y-2">
                            <h3 className="text-base md:text-lg font-extrabold group-hover:text-accent transition-colors uppercase tracking-tight leading-tight">{tool.name}</h3>
                            <p className="text-muted-foreground text-[11px] md:text-xs leading-relaxed line-clamp-2 md:line-clamp-3">
                              {tool.use}
                            </p>
                          </div>
                        </div>
                        <div className="mt-6 md:mt-8 pt-4 border-t border-zinc-50 flex items-center justify-between text-[8px] md:text-[10px] font-bold uppercase tracking-widest group-hover:text-accent transition-colors">
                          <span>{tool.status === 'Featured' ? 'See Details' : 'Visit Site'}</span>
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </a>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          
          {filteredTools.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 md:py-32 border-2 border-dashed border-zinc-100 text-muted-foreground bg-zinc-50/30"
            >
              <Search className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-4 opacity-10" />
              <p className="text-xs md:text-sm font-medium">No matches found for "{search}"</p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    projectType: "AI Automation",
    urgency: "Medium (1-4 weeks)",
    budget: "",
    message: ""
  });
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = React.useState("");
  const [user, setUser] = React.useState<FirebaseUser | null>(null);

  React.useEffect(() => {
    const handleServiceInquiry = (e: any) => {
      if (e.detail?.service) {
        const s = e.detail.service;
        let mappedType = "AI Automation";
        if (s.toLowerCase().includes("marketing") || s.toLowerCase().includes("outbound") || s.toLowerCase().includes("conversion") || s.toLowerCase().includes("content")) {
          mappedType = "Growth Marketing";
        } else if (s.toLowerCase().includes("seo") || s.toLowerCase().includes("search") || s.toLowerCase().includes("authority")) {
          mappedType = "Search Engine Optimization (SEO)";
        } else if (s.toLowerCase().includes("web") || s.toLowerCase().includes("ui") || s.toLowerCase().includes("platform")) {
          mappedType = "Website Development";
        }
        setFormData(prev => ({ 
          ...prev, 
          projectType: mappedType,
          message: prev.message || `Inquiry regarding: ${s}`
        }));
      }
    };

    window.addEventListener("select-service-inquiry", handleServiceInquiry);
    return () => window.removeEventListener("select-service-inquiry", handleServiceInquiry);
  }, []);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setFormData(prev => ({
          ...prev,
          name: currentUser.displayName || "",
          email: currentUser.email || ""
        }));
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      await submitLead({
        ...formData,
        userId: user?.uid
      });
      
      setStatus('success');
      setFeedback("Strategic inquiry captured. Our leads architect will review your technical requirements and contact you within 6 business hours.");
      setFormData({ 
        name: "", 
        email: "", 
        company: "", 
        phone: "", 
        projectType: "AI Automation",
        urgency: "Medium (1-4 weeks)",
        budget: "", 
        message: "" 
      });
    } catch (err) {
      console.error(err);
      setStatus('error');
      setFeedback("Encryption layer error: Failed to save strategic data. Please check your network.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const projectTypes = [
    "AI Automation", 
    "Growth Marketing", 
    "Search Engine Optimization (SEO)", 
    "Website Development", 
    "Custom AI Agent Mesh", 
    "Full-Stack Transformation"
  ];
  const urgencyLevels = ["High (Immediate)", "Medium (1-4 weeks)", "Low (Planning)"];

  return (
    <section id="contact" className="py-12 md:py-32 px-6 bg-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-zinc-50/50 -z-0" />
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20 relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-5 space-y-10 md:space-y-12"
        >
          <div className="space-y-4 md:space-y-6">
            <Badge className="bg-accent/10 text-accent hover:bg-accent/20 border-none px-4 py-1.5 rounded-full text-[9px] uppercase font-bold tracking-widest">
              Available for Q4 Bookings
            </Badge>
            <h2 className="text-3xl md:text-6xl font-black tracking-tighter leading-[0.9] uppercase">
              Book Your <br/><span className="text-accent">Free Call</span>
            </h2>
            <p className="text-zinc-500 text-sm md:text-xl font-medium leading-relaxed max-w-sm">
              Secure your spot for a discovery session. We'll show you exactly how AI can automate your manual work.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-4 md:gap-6">
            {[
              { title: "Discovery Session", desc: "A deep dive into your manual processes." },
              { title: "Savings Analysis", desc: "A report on money and time AI will save you." },
              { title: "Automation Roadmap", desc: "A step-by-step plan for launching your systems." }
            ].map((item, idx) => (
              <motion.div 
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                viewport={{ once: true }}
                className="flex gap-4 md:gap-6 group"
              >
                <div className="w-8 h-8 md:w-12 md:h-12 shrink-0 bg-black text-white flex items-center justify-center font-black text-xs md:text-lg rounded-xl">
                  0{idx + 1}
                </div>
                <div>
                  <h4 className="font-black uppercase text-[10px] md:text-sm tracking-tight mb-0.5">{item.title}</h4>
                  <p className="text-zinc-400 text-[10px] md:text-sm leading-snug">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="pt-8 md:pt-10 border-t border-zinc-100 flex items-center gap-4 md:gap-6"
          >
            <div className="flex -space-x-2 md:-space-x-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white overflow-hidden bg-zinc-100">
                  <img src={`https://picsum.photos/seed/face${i}/100/100`} alt="Client" referrerPolicy="no-referrer" />
                </div>
              ))}
            </div>
            <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              Trusted by <span className="text-black">12+ Enterprise Teams</span>
            </p>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-7 bg-white border border-zinc-200 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.1)] p-8 md:p-12 rounded-3xl relative"
        >
          <AnimatePresence>
            {status === 'success' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className="absolute inset-x-8 inset-y-12 z-50 bg-white flex flex-col items-center justify-center text-center space-y-8"
              >
                <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 size={48} />
                </div>
                <div className="space-y-4">
                  <h3 className="text-3xl font-extrabold uppercase tracking-tight">Transmission Received</h3>
                  <p className="text-zinc-500 max-w-sm mx-auto font-medium">{feedback}</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setStatus('idle')} 
                  className="rounded-full px-8 h-12 border-zinc-200 hover:border-black font-bold uppercase tracking-widest text-[10px]"
                >
                  Return to Form
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <form className={cn("grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 transition-all duration-500", status === 'success' && "opacity-0 invisible scale-95")} onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1 leading-none">Contact Name</label>
              <Input id="name" value={formData.name} onChange={handleChange} required placeholder="Lead Contact" className="rounded-xl h-12 md:h-14 border-zinc-100 bg-zinc-50/30 focus-visible:ring-black/5 px-4 font-bold text-xs md:text-base" />
            </div>
            
            <div className="space-y-1">
              <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1 leading-none">Business Email</label>
              <Input id="email" type="email" value={formData.email} onChange={handleChange} required placeholder="name@company.com" className="rounded-xl h-12 md:h-14 border-zinc-100 bg-zinc-50/30 focus-visible:ring-black/5 px-4 font-bold text-xs md:text-base" />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1 leading-none">Organization</label>
              <Input id="company" value={formData.company} onChange={handleChange} required placeholder="Acme Systems" className="rounded-xl h-12 md:h-14 border-zinc-100 bg-zinc-50/30 focus-visible:ring-black/5 px-4 font-bold text-xs md:text-base" />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1 leading-none">Phone Number</label>
              <Input id="phone" value={formData.phone} onChange={handleChange} required placeholder="+1 (555) 000-0000" className="rounded-xl h-12 md:h-14 border-zinc-100 bg-zinc-50/30 focus-visible:ring-black/5 px-4 font-bold text-xs md:text-base" />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1 leading-none">Project Category</label>
              <select 
                id="projectType" 
                value={formData.projectType} 
                onChange={handleChange as any}
                className="w-full rounded-xl h-12 md:h-14 border border-zinc-100 bg-zinc-50/30 focus:outline-none focus:border-black/20 px-4 font-bold text-xs appearance-none cursor-pointer"
              >
                {projectTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1 leading-none">Target Urgency</label>
              <select 
                id="urgency" 
                value={formData.urgency} 
                onChange={handleChange as any}
                className="w-full rounded-xl h-12 md:h-14 border border-zinc-100 bg-zinc-50/30 focus:outline-none focus:border-black/20 px-4 font-bold text-xs appearance-none cursor-pointer"
              >
                {urgencyLevels.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1 leading-none">Investment Range ($)</label>
              <Input id="budget" value={formData.budget} onChange={handleChange} required placeholder="e.g. 5,000 - 15,000" className="rounded-xl h-12 md:h-14 border-zinc-100 bg-zinc-50/30 focus-visible:ring-black/5 px-4 font-bold text-xs md:text-base" />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1 leading-none">System Requirements</label>
              <textarea 
                id="message"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full min-h-[100px] md:min-h-[140px] p-4 text-xs md:text-sm border border-zinc-100 bg-zinc-50/30 rounded-2xl focus:outline-none focus:border-black/20 transition-colors font-bold"
                placeholder="Describe the current manual process you want to automate..."
              />
            </div>
            
            <div className="md:col-span-2 pt-2">
              {status === 'error' && <p className="text-[10px] text-red-500 font-bold mb-4 bg-red-50 p-2 rounded-lg border border-red-100">{feedback}</p>}
              <Button 
                type="submit" 
                disabled={status === 'loading'} 
                className="w-full bg-black hover:bg-zinc-800 text-white rounded-full h-12 md:h-16 text-base md:text-lg font-extrabold uppercase tracking-widest shadow-xl shadow-black/10 group overflow-hidden"
              >
                {status === 'loading' ? (
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  <span className="flex items-center justify-center gap-3">
                    Submit Project Brief <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-2 transition-transform" />
                  </span>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-12 md:py-20 px-6 sm:px-10 border-t border-zinc-800 bg-[#0B0B0B] text-zinc-400">
      <div className="max-w-7xl mx-auto space-y-12 md:space-y-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
          <div className="col-span-1 sm:col-span-2 md:col-span-2 space-y-6">
            <Logo variant="footer" />
            <p className="text-zinc-500 text-xs md:text-sm leading-relaxed max-w-sm">
              The premier AI automation agency for high-growth businesses. Building systems that scale while you sleep.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-zinc-500 hover:text-white transition-colors"><Twitter size={18} className="md:size-5" /></a>
              <a href="#" className="text-zinc-500 hover:text-white transition-colors"><Github size={18} className="md:size-5" /></a>
              <a href="#" className="text-zinc-500 hover:text-white transition-colors"><Linkedin size={18} className="md:size-5" /></a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-white">Navigation</h4>
            <div className="flex flex-col gap-2 md:gap-3 text-xs md:text-sm text-zinc-500 font-medium font-mono uppercase tracking-tight">
              <a href="#services" className="hover:text-white transition-colors">Services</a>
              <a href="#process" className="hover:text-white transition-colors">Process</a>
              <a href="#discovery" className="hover:text-white transition-colors">Discovery</a>
              <Link to="/about" className="hover:text-white transition-colors">About OPSIYS</Link>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-white">Office</h4>
            <div className="space-y-3">
              <p className="text-xs md:text-sm text-zinc-500 leading-relaxed font-mono uppercase tracking-tight">
                Based in India.<br/>
                Serving globally.
              </p>
              <div className="flex items-center gap-2 text-[10px] md:text-sm text-accent font-bold font-mono min-w-0">
                <Mail className="w-3 h-3 md:w-4 md:h-4" />
                <span className="break-all">opsiyss@gmail.com</span>
              </div>
            </div>
          </div>
        </div>
        
        <Separator className="bg-zinc-800" />
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-zinc-600 text-center md:text-left">
          <p>© 2026 OPSIYS SYSTEMS INC. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-4 md:gap-8">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- HomePage Component ---

const HomePage = () => {
  return (
    <main>
      <Hero />
      <Trust />
      <Features />
      <HowItWorks />
      <ToolDiscovery />
      <Contact />
    </main>
  );
};

// --- Error Boundary ---

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  props: ErrorBoundaryProps;
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.props = props;
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("App Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8 text-center font-sans">
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-6">
            <Bot size={32} />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight mb-2">OPSIYS System Recovered</h2>
          <p className="text-zinc-400 text-sm max-w-md mb-8 leading-relaxed">
            An unexpected render event occurred. Click below to refresh the operational interface.
          </p>
          <Button 
            onClick={() => window.location.reload()} 
            className="bg-white text-black hover:bg-zinc-200 font-bold uppercase tracking-widest text-xs px-8 py-6 rounded-none"
          >
            Reload Interface
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}

// --- Main App ---

export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen min-w-0 w-full overflow-x-hidden bg-white font-sans selection:bg-accent selection:text-white relative">
          <AuthPortal />
          <Routes>
            <Route path="/about" element={<AboutPage />} />
            <Route path="*/about" element={<AboutPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </ErrorBoundary>
  );
}
