import React from "react";
import NavFlowBrand from "./NavFlowBrand";

export default function NavFlowFooter() {
  return (
    <footer className="relative z-10 border-t border-blue-400/10 bg-[#020713] px-6 py-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 md:flex-row">
        <NavFlowBrand compact />
        <div className="text-center font-mono text-[10px] leading-relaxed text-slate-500 md:text-left">
          <p>© 2026 SailMotion AI — Analyse et performance en voile.</p>
          <p className="mt-1 text-slate-400">SAIL SMART. WIN FAST.</p>
        </div>
        <div className="flex flex-col items-center gap-2 text-center md:items-end md:text-right">
          <p className="text-xs text-slate-300">Développé par <span className="font-bold text-white">Mouad Mouasseif</span></p>
          <span className="rounded-full border border-red-500/25 bg-red-500/10 px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-widest text-red-300">Made in Morocco 🇲🇦</span>
        </div>
      </div>
    </footer>
  );
}
