import React from "react";
import { 
  Code2, 
  Target, 
  Globe, 
  Workflow, 
  Sparkles, 
  TrendingUp, 
  Layers, 
  Search,
  ExternalLink,
  Image as ImageIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PortfolioPlaceholderProps {
  category: "Automation" | "Marketing" | "SEO" | "Website Development" | string;
  title: string;
  metric?: string;
  badge?: string;
  imageSrc?: string;
  className?: string;
  aspectRatio?: "video" | "wide" | "square";
  isModal?: boolean;
}

export const PortfolioPlaceholder: React.FC<PortfolioPlaceholderProps> = ({
  category,
  title,
  metric,
  badge,
  imageSrc,
  className,
  isModal = false
}) => {
  const [imgError, setImgError] = React.useState(false);

  // If user provides a valid image and it hasn't errored, render real image with fallback
  const hasValidImage = imageSrc && imageSrc.trim() !== "" && !imageSrc.includes("placeholder-mockup") && !imgError;

  if (hasValidImage) {
    return (
      <div className={cn("relative w-full h-full overflow-hidden bg-zinc-950", className)}>
        <img
          src={imageSrc}
          alt={title}
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
      </div>
    );
  }

  // Portfolio Sample Wireframe Mockup Canvas
  return (
    <div className={cn(
      "relative w-full h-full overflow-hidden bg-[#0D0D11] text-white flex flex-col justify-between select-none font-mono border-b border-zinc-800/80 group-hover:border-zinc-700 transition-colors",
      className
    )}>
      {/* Background Architectural Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.07] pointer-events-none" 
        style={{ 
          backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
          backgroundSize: '16px 16px' 
        }} 
      />

      {/* Top Browser / Window Frame Header */}
      <div className="relative z-10 flex items-center justify-between px-3.5 py-2.5 bg-black/60 backdrop-blur-md border-b border-white/10 text-[10px]">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-zinc-700/80 group-hover:bg-red-500/80 transition-colors" />
          <span className="w-2.5 h-2.5 rounded-full bg-zinc-700/80 group-hover:bg-amber-500/80 transition-colors" />
          <span className="w-2.5 h-2.5 rounded-full bg-zinc-700/80 group-hover:bg-emerald-500/80 transition-colors" />
          <span className="ml-2 text-[9px] text-zinc-500 font-mono tracking-wider truncate max-w-[140px] sm:max-w-[200px]">
            portfolio / {category.toLowerCase().replace(/\s+/g, '-')}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-400 bg-white/5 px-2 py-0.5 border border-white/10">
            {badge || "Sample"}
          </span>
          <span className="text-[9px] text-zinc-500 hidden sm:inline">
            800×500
          </span>
        </div>
      </div>

      {/* Center Portfolio Mockup Graphic tailored by Category */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6">
        {category === "Website Development" && (
          <div className="w-full max-w-[320px] bg-zinc-900/95 border border-white/15 p-3.5 sm:p-4 rounded shadow-2xl space-y-3 transform group-hover:scale-[1.02] transition-transform duration-500">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-accent" />
                <span className="text-[11px] font-bold text-zinc-200 uppercase tracking-wider">Web UI Architecture</span>
              </div>
              <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 font-bold border border-emerald-500/30">100 / 100 Speed</span>
            </div>
            
            <div className="grid grid-cols-3 gap-2.5">
              <div className="col-span-1 bg-black/60 p-2.5 border border-white/5 space-y-1.5 rounded-sm">
                <div className="h-1.5 bg-zinc-600 w-3/4 rounded-full" />
                <div className="h-1 bg-zinc-800 w-1/2 rounded-full" />
                <div className="h-1 bg-zinc-800 w-2/3 rounded-full" />
                <div className="h-1 bg-accent/60 w-4/5 rounded-full mt-2" />
              </div>
              <div className="col-span-2 bg-black/60 p-2.5 border border-white/5 space-y-2 rounded-sm">
                <div className="flex justify-between items-center">
                  <div className="h-1.5 bg-zinc-500 w-1/3 rounded-full" />
                  <span className="text-[9px] text-accent font-bold">&lt;0.4s Fast Load</span>
                </div>
                {/* Mini chart line */}
                <div className="flex items-end gap-1.5 h-10 pt-1">
                  <div className="w-1/5 bg-zinc-800 h-3 rounded-t-xs" />
                  <div className="w-1/5 bg-zinc-700 h-5 rounded-t-xs" />
                  <div className="w-1/5 bg-zinc-600 h-7 rounded-t-xs" />
                  <div className="w-1/5 bg-zinc-500 h-8 rounded-t-xs" />
                  <div className="w-1/5 bg-accent h-10 rounded-t-xs" />
                </div>
              </div>
            </div>
          </div>
        )}

        {category === "Marketing" && (
          <div className="w-full max-w-[320px] bg-zinc-900/95 border border-white/15 p-3.5 sm:p-4 rounded shadow-2xl space-y-3 transform group-hover:scale-[1.02] transition-transform duration-500">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-accent" />
                <span className="text-[11px] font-bold text-zinc-200 uppercase tracking-wider">Growth Engine Graph</span>
              </div>
              <span className="text-[9px] bg-accent/20 text-accent px-2 py-0.5 font-bold border border-accent/40">+320% ROAS</span>
            </div>

            {/* Growth chart graphic */}
            <div className="bg-black/60 p-3 border border-white/5 relative overflow-hidden rounded-sm">
              <div className="flex justify-between text-[9px] text-zinc-400 mb-2 font-mono">
                <span>Phase 1</span>
                <span>Optimization</span>
                <span className="text-accent font-bold">Scale Matrix</span>
              </div>
              {/* Stepped growth bars */}
              <div className="flex items-end justify-between gap-2 h-12">
                <div className="w-full bg-zinc-800 h-[30%] rounded-t-xs" />
                <div className="w-full bg-zinc-700 h-[48%]" />
                <div className="w-full bg-zinc-600 h-[65%]" />
                <div className="w-full bg-zinc-500 h-[82%]" />
                <div className="w-full bg-accent h-[100%] shadow-[0_0_12px_rgba(255,255,255,0.2)]" />
              </div>
            </div>
          </div>
        )}

        {category === "SEO" && (
          <div className="w-full max-w-[320px] bg-zinc-900/95 border border-white/15 p-3.5 sm:p-4 rounded shadow-2xl space-y-2.5 transform group-hover:scale-[1.02] transition-transform duration-500">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-accent" />
                <span className="text-[11px] font-bold text-zinc-200 uppercase tracking-wider">Search Rank #1 Snippet</span>
              </div>
              <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 font-bold">Google SERP</span>
            </div>

            <div className="bg-black/60 p-3 border border-white/5 space-y-2 text-[10px] rounded-sm">
              <div className="flex items-center gap-1.5 text-[9px] text-emerald-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                <span>google.com/search • Rank #1</span>
              </div>
              <div className="h-2.5 bg-zinc-300 w-5/6 rounded-xs" />
              <div className="h-2 bg-zinc-600 w-full rounded-xs opacity-70" />
              <div className="h-2 bg-zinc-700 w-2/3 rounded-xs opacity-50" />
            </div>
          </div>
        )}

        {category === "Automation" && (
          <div className="w-full max-w-[320px] bg-zinc-900/95 border border-white/15 p-3.5 sm:p-4 rounded shadow-2xl space-y-3 transform group-hover:scale-[1.02] transition-transform duration-500">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <Workflow className="w-4 h-4 text-accent" />
                <span className="text-[11px] font-bold text-zinc-200 uppercase tracking-wider">Automated Workflow Node</span>
              </div>
              <span className="text-[9px] bg-blue-500/20 text-blue-400 px-2 py-0.5 font-bold border border-blue-500/30">24/7 Active</span>
            </div>

            <div className="flex items-center justify-between gap-1.5 bg-black/60 p-2.5 border border-white/5 text-[9px] rounded-sm">
              <div className="bg-zinc-800 px-2.5 py-1.5 border border-white/10 text-center">
                <div className="text-zinc-500 text-[8px]">Event</div>
                <div className="font-bold text-white text-[10px]">Trigger</div>
              </div>
              <div className="h-0.5 flex-1 bg-accent/40 relative">
                <div className="w-1.5 h-1.5 bg-accent rounded-full absolute -top-[2px] right-0 animate-ping" />
              </div>
              <div className="bg-zinc-800 px-2.5 py-1.5 border border-white/10 text-center">
                <div className="text-zinc-500 text-[8px]">Agent</div>
                <div className="font-bold text-accent text-[10px]">AI Logic</div>
              </div>
              <div className="h-0.5 flex-1 bg-accent/40" />
              <div className="bg-zinc-800 px-2.5 py-1.5 border border-white/10 text-center">
                <div className="text-zinc-500 text-[8px]">Output</div>
                <div className="font-bold text-emerald-400 text-[10px]">CRM Sync</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Footer Details */}
      <div className="relative z-10 flex items-center justify-between px-3.5 py-2 bg-black/80 backdrop-blur-md border-t border-white/10 text-[9px]">
        <div className="flex items-center gap-1.5 text-zinc-400">
          <ImageIcon className="w-3 h-3 text-accent" />
          <span className="truncate max-w-[170px] sm:max-w-[220px]">
            {title}
          </span>
        </div>
        <span className="text-accent font-bold">
          {metric}
        </span>
      </div>

      {/* Subtle Hover Hint */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none z-20">
        <span className="bg-black/90 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 border border-white/20 shadow-xl flex items-center gap-1.5">
          <span>View Blueprint</span>
          <ExternalLink className="w-3 h-3 text-accent" />
        </span>
      </div>
    </div>
  );
};
