import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShieldAlert, Lock, ArrowRight, RefreshCw, Mail, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface MaintenanceOverlayProps {
  message?: string;
}

export const MaintenanceOverlay: React.FC<MaintenanceOverlayProps> = ({ message }) => {
  return (
    <div className="fixed inset-0 z-[999] bg-[#0B0B0B] text-white flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Ambient Glow background */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Background Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, #fff 1.5px, transparent 1.5px)`,
          backgroundSize: '48px 48px'
        }}
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 max-w-2xl w-full bg-zinc-900/90 border border-zinc-800/90 rounded-3xl p-8 sm:p-12 md:p-16 text-center space-y-8 shadow-2xl backdrop-blur-2xl"
      >
        <div className="flex items-center justify-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-500/20 via-red-500/20 to-zinc-800 border border-amber-500/30 flex items-center justify-center shadow-inner">
              <ShieldAlert className="w-12 h-12 text-amber-400 animate-pulse" />
            </div>
            <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-amber-500 border-4 border-zinc-900 flex items-center justify-center">
              <RefreshCw className="w-3 h-3 text-black animate-spin" />
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <Badge variant="outline" className="border-amber-500/40 text-amber-400 bg-amber-500/10 font-mono text-xs uppercase tracking-widest px-4 py-1 rounded-full">
            SYSTEM MAINTENANCE MODE ACTIVE
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            OPSIYS Scheduled <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-300 to-red-400">
              Infrastructure Upgrade
            </span>
          </h1>
          <p className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-lg mx-auto font-medium">
            {message || "We are currently conducting scheduled module integration, security updates, and infrastructure upgrades. Website public access is temporarily paused until maintenance completes."}
          </p>
        </div>

        {/* Live System Progress Bar */}
        <div className="space-y-2 bg-zinc-950/80 border border-zinc-800/80 p-5 rounded-2xl text-left font-mono">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-400">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>MODULE SYNCHRONIZATION STATUS: IN PROGRESS</span>
            </span>
            <span className="text-amber-400">SYNCING</span>
          </div>
          <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden border border-zinc-800">
            <motion.div 
              initial={{ width: "15%" }}
              animate={{ width: ["15%", "65%", "85%", "75%"] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 h-full rounded-full"
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1">
            <span>Core Engines & Database</span>
            <span>Est. Return: Pending Admin Release</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link to="/admin" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-white text-black hover:bg-zinc-200 font-extrabold text-xs uppercase tracking-widest h-14 px-8 rounded-xl shadow-xl flex items-center justify-center gap-2">
              <Lock className="w-4 h-4" />
              <span>Admin Console Portal</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
          <a href="mailto:contact@opsiys.in" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 font-bold text-xs uppercase tracking-widest h-14 px-8 rounded-xl flex items-center justify-center gap-2">
              <Mail className="w-4 h-4" />
              <span>Emergency Support</span>
            </Button>
          </a>
        </div>

        <p className="text-[11px] font-mono text-zinc-600 uppercase tracking-widest">
          OPSIYS Systems Inc. © 2026 • Authorized Admin Access Only
        </p>
      </motion.div>
    </div>
  );
};

export default MaintenanceOverlay;
