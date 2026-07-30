import React from "react";

interface NavFlowBrandProps {
  compact?: boolean;
  className?: string;
}

export default function NavFlowBrand({ compact = false, className = "" }: NavFlowBrandProps) {
  return (
    <div className={`flex items-center ${compact ? "gap-2.5" : "gap-4"} ${className}`}>
      <div className={`${compact ? "h-11 w-11" : "h-20 w-20 sm:h-24 sm:w-24"} overflow-hidden rounded-2xl border border-blue-400/20 bg-[#020713] shadow-lg shadow-blue-500/10 shrink-0`}>
        <img src="/brand/navflow-official-logo.png" alt="Logo officiel SailMotion AI" className="h-full w-full object-cover" />
      </div>
      <div className="min-w-0">
        <p className={`${compact ? "text-base" : "text-2xl sm:text-3xl"} font-display font-black tracking-[0.12em] text-white leading-none`}>
          SAIL<span className="text-blue-400">MOTION AI</span>
        </p>
        <p className={`${compact ? "text-[8px]" : "text-[10px]"} mt-1 font-mono uppercase tracking-[0.18em] text-blue-300/80`}>
          Analyse · Performance · Compétition
        </p>
      </div>
    </div>
  );
}
