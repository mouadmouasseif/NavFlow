import React from 'react';
import { Award, Code2, Globe2, Heart, Sparkles } from 'lucide-react';

export default function CreatorBadge() {
  return (
    <div className="glass-panel text-white/95 rounded-2xl p-6 relative overflow-hidden border border-white/10 shadow-xl" id="creator-mouad-badge">
      {/* Decorative gradient sphere */}
      <div className="absolute -right-20 -bottom-20 w-48 h-48 rounded-full bg-neon-green/10 blur-3xl pointer-events-none" />
      <div className="absolute -left-10 -top-10 w-40 h-40 rounded-full bg-neon-cyan/5 blur-2xl pointer-events-none" />
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-navy-900 to-navy-800 border-2 border-neon-green/40 flex items-center justify-center shadow-lg neon-glow-green overflow-hidden">
              {/* Double M Monogram with Moroccan Star Accent */}
              <div className="font-display font-black text-2xl tracking-tighter text-white">
                M<span className="text-neon-green">M</span>
              </div>
            </div>
            {/* Pulsing online pill */}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-600 rounded-full border-2 border-navy-950 flex items-center justify-center pulsing-ring" title="Moroccan Ingenuity">
              <div className="w-1.5 h-1.5 bg-white rounded-full" />
            </div>
          </div>
          
          <div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <h4 className="font-display font-bold text-lg tracking-tight">Mouad Mouasseif</h4>
              <span className="bg-red-950/80 text-red-400 text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border border-red-500/30 flex items-center gap-1">
                <span className="inline-block w-2.5 h-1.5 bg-red-600 rounded-sm relative overflow-hidden">
                  {/* Small Moroccan Pentagram Star */}
                  <span className="absolute inset-0 flex items-center justify-center text-[6px] font-bold text-emerald-500 leading-none">★</span>
                </span>
                MAROCAIN DÉVELOPPEUR
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              NavFlow AI is an elite tactical platform architected in Morocco for professional yacht racing teams and Olympic-level sailing feedback.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#00F0FF] block">Official Architect</span>
            <span className="text-sm font-semibold text-slate-200">Mouad Mouasseif</span>
          </div>
          <div className="h-8 w-px bg-white/10 hidden sm:block" />
          <div className="flex gap-2">
            <a 
              href="mailto:mouad.mouasseif@um5r.ac.ma"
              className="px-4 py-2 bg-white/5 hover:bg-neutral-800/80 rounded-xl text-xs font-semibold text-slate-300 border border-white/5 transition flex items-center gap-1.5"
              title=" m.mouasseif@um5r.ac.ma"
            >
              <Code2 className="w-3.5 h-3.5 text-neon-green" />
              Contact
            </a>
            <div className="px-4 py-2 bg-gradient-to-r from-neon-green/20 via-neon-cyan/20 to-neon-blue/20 rounded-xl text-xs font-bold text-neon-green border border-neon-green/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Elite Tech
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
