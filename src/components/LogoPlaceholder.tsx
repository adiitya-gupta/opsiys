import React from "react";
import { cn } from "@/lib/utils";
import { Sparkles, Image as ImageIcon } from "lucide-react";

interface LogoPlaceholderProps {
  src?: string;
  variant?: "navbar" | "footer";
  className?: string;
}

export const LogoPlaceholder: React.FC<LogoPlaceholderProps> = ({
  src = "/logos/opsiyslogo.png",
  variant = "navbar",
  className
}) => {
  const [hasError, setHasError] = React.useState(false);

  // If user dropped an actual logo image file into public/
  if (src && !hasError) {
    return (
      <div className={cn("flex items-center gap-2.5 group cursor-pointer", className)}>
        <img
          src={src}
          alt="Company Logo"
          onError={() => setHasError(true)}
          className={cn(
            "object-contain transition-transform group-hover:scale-105",
            variant === "navbar" ? "h-7 max-w-[140px]" : "h-9 max-w-[180px]"
          )}
        />
      </div>
    );
  }

  // Visual Clean Logo Placeholder box
  if (variant === "footer") {
    return (
      <div 
        className={cn(
          "inline-flex items-center gap-3 p-2.5 px-4 bg-zinc-900/90 border border-dashed border-zinc-700/80 rounded-sm hover:border-accent transition-colors group cursor-pointer select-none",
          className
        )}
        title="Replace with your logo in public/logo.png"
      >
        <div className="w-8 h-8 rounded bg-white text-black flex items-center justify-center font-black text-sm shadow-sm group-hover:scale-105 transition-transform">
          <ImageIcon className="w-4 h-4 text-zinc-800" />
        </div>
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[9px] uppercase tracking-widest text-accent font-bold">
              [ LOGO PLACEHOLDER ]
            </span>
          </div>
          <span className="font-extrabold text-sm tracking-tight text-white uppercase group-hover:text-zinc-200">
            YOUR COMPANY LOGO
          </span>
        </div>
      </div>
    );
  }

  // Navbar compact logo placeholder
  return (
    <div 
      className={cn(
        "flex items-center gap-2 px-2.5 py-1 bg-zinc-900/80 border border-dashed border-white/20 rounded-full hover:border-white/40 transition-colors group cursor-pointer select-none",
        className
      )}
      title="Replace with your logo in public/logo.png"
    >
      <div className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center font-mono font-black text-[9px]">
        L
      </div>
      <div className="flex items-center gap-1">
        <span className="font-mono text-[10px] font-bold tracking-tight text-zinc-300 group-hover:text-white uppercase">
          LOGO<span className="text-accent font-black">.</span>
        </span>
        <span className="text-[8px] font-mono text-zinc-500 hidden sm:inline uppercase tracking-wider">
          (PLACEHOLDER)
        </span>
      </div>
    </div>
  );
};
