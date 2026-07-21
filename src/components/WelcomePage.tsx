import React from 'react';
import NavFlowBrand from './NavFlowBrand';
import NavFlowFooter from './NavFlowFooter';
import { 
  Compass, 
  MapPin, 
  Wind, 
  Layers, 
  Award, 
  ShieldCheck, 
  Activity, 
  Sparkles, 
  Clock, 
  UploadCloud, 
  Gauge, 
  Milestone, 
  Users, 
  FileText, 
  Ship, 
  ChevronRight,
  ArrowRight
} from 'lucide-react';

interface WelcomePageProps {
  onEnterApp: () => void;
}

export default function WelcomePage({ onEnterApp }: WelcomePageProps) {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col justify-between selection:bg-neon-green selection:text-navy-950 font-sans relative overflow-hidden" id="navflow-welcome-screen">
      
      {/* Dynamic Background Mesh Glow Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-neon-green/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#00F0FF]/5 blur-[120px] pointer-events-none" />

      {/* 1. Header Toolbar */}
      <header className="bg-navy-950/40 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between relative z-30">
        <NavFlowBrand compact />
        <div className="hidden">
          <div className="w-10 h-10 rounded-xl bg-navy-900 border border-neon-green/30 flex items-center justify-center p-1.5 shrink-0 shadow-lg shadow-neon-green/10">
            <svg viewBox="0 0 100 100" className="w-full h-full text-neon-green">
              <path d="M50 5 L85 75 L50 62 L15 75 Z" fill="url(#logo-grad-welcome)" />
              <path d="M50 15 L72 65 L50 55 L28 65 Z" fill="#ffffff" className="opacity-80" />
              <defs>
                <linearGradient id="logo-grad-welcome" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00FF87" />
                  <stop offset="100%" stopColor="#00F0FF" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div>
            <h1 className="font-display font-bold text-base leading-none text-white tracking-wider">
              NAVFLOW <span className="text-neon-cyan">AI</span>
            </h1>
            <p className="text-[9px] font-mono text-slate-400 mt-0.5 uppercase tracking-widest">Performance System</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={onEnterApp}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-xs font-mono font-bold text-slate-200 border border-white/10 rounded-xl transition duration-200 flex items-center gap-1.5 active:scale-95"
          >
            <span>CONSOLE DIRECTE</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* 2. Main Hero Layout Split */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
        
        {/* Left Side: Pitch and Interactive Features Grid */}
        <div className="flex-1 space-y-8 text-left max-w-2xl">
          
          {/* Moroccan Flag & Designer Badge */}
          <div className="inline-flex items-center gap-2.5 bg-[#00FF87]/10 border border-[#00FF87]/30 px-3.5 py-1.5 rounded-full shadow-md shadow-neon-green/5">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-mono font-black uppercase text-neon-green tracking-wider flex items-center gap-1.5">
              100% Développé par un Marocain <span className="text-xs">🇲🇦</span>
            </span>
          </div>

          {/* Slogans */}
          <div className="space-y-4">
            <h2 className="font-display font-black text-3.5xl sm:text-4.5xl text-white tracking-tight leading-none">
              L'analyse qui fait <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green via-neon-cyan to-blue-500">la différence</span> sur l'eau.
            </h2>
            <p className="text-slate-400 leading-relaxed text-sm sm:text-base">
              Navflow est l'application ultime pour analyser, comprendre et améliorer vos performances en voile olympique et haut niveau. En temps réel ou via votre vidéo de tack, pour toutes les classes de voiliers.
            </p>
          </div>

          {/* Big Launch Call to Action button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
            <button
              onClick={onEnterApp}
              className="px-8 py-4 bg-gradient-to-r from-neon-green to-neon-cyan text-navy-950 font-display font-black text-sm tracking-wide rounded-2xl hover:brightness-110 active:scale-98 transition duration-200 shadow-xl shadow-neon-green/20 flex items-center justify-center gap-3 group"
            >
              <span>LANCER L'APPLICATION</span>
              <ArrowRight className="w-4 h-4 text-navy-950 transition-transform group-hover:translate-x-1" />
            </button>
            <div className="flex items-center justify-center gap-2 text-xs font-mono text-slate-500">
              <Compass className="w-4 h-4 text-[#00F0FF]" />
              <span>Calibré sur la Baie de Tanger</span>
            </div>
          </div>

          {/* Core Feature Matrix */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#00F0FF] border-l-2 border-neon-cyan pl-2">
              Fonctionnalités Clés
            </h3>
            
            <div className="grid grid-cols-2 gap-3" id="welcome-features-grid">
              
              <div className="bg-navy-950/40 p-4 border border-white/5 hover:border-white/10 rounded-2xl flex items-start gap-3 transition">
                <div className="p-2 rounded-xl bg-neon-green/10 text-neon-green shrink-0">
                  <Clock className="w-4 .5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase">Analyse Temps Réel</h4>
                  <p className="text-[10px] text-slate-500 mt-1">Acquisition de données en direct sur l'eau</p>
                </div>
              </div>

              <div className="bg-navy-950/40 p-4 border border-white/5 hover:border-white/10 rounded-2xl flex items-start gap-3 transition">
                <div className="p-2 rounded-xl bg-[#00F0FF]/10 text-[#00F0FF] shrink-0">
                  <UploadCloud className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase">Upload Vidéo & Analyse Auto</h4>
                  <p className="text-[10px] text-slate-500 mt-1">Détéction automatique du bateau sans saisie</p>
                </div>
              </div>

              <div className="bg-navy-950/40 p-4 border border-white/5 hover:border-white/10 rounded-2xl flex items-start gap-3 transition">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 shrink-0">
                  <Wind className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase">Calcul Du Vent</h4>
                  <p className="text-[10px] text-slate-500 mt-1">Calcule l'apparent, le réel et la polaire VMG</p>
                </div>
              </div>

              <div className="bg-navy-950/40 p-4 border border-white/5 hover:border-white/10 rounded-2xl flex items-start gap-3 transition">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
                  <Gauge className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase">Vitesse & Ratios</h4>
                  <p className="text-[10px] text-slate-500 mt-1">Accéléromètre et inclinaison du mât</p>
                </div>
              </div>

              <div className="bg-navy-950/40 p-4 border border-white/5 hover:border-white/10 rounded-2xl flex items-start gap-3 transition">
                <div className="p-2 rounded-xl bg-[#FF5252]/10 text-[#FF5252] shrink-0">
                  <Milestone className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase">Trajectoire & CV Squelette</h4>
                  <p className="text-[10px] text-slate-500 mt-1">Rappels de posture bio-mécanique d'athlète</p>
                </div>
              </div>

              <div className="bg-navy-950/40 p-4 border border-white/5 hover:border-white/10 rounded-2xl flex items-start gap-3 transition">
                <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400 shrink-0">
                  <Users className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase">Comparaison Concurrents</h4>
                  <p className="text-[10px] text-slate-500 mt-1">Benchmarking direct avec l'élite</p>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Right Side: Visual Mockup Showcase representing the Application in Desktop & Mobile */}
        <div className="flex-1 w-full flex flex-col items-center justify-center relative max-w-lg lg:max-w-none">
          
          {/* Radial backdrop light highlight */}
          <div className="absolute w-[340px] h-[340px] bg-neon-green/10 rounded-full blur-3xl pointer-events-none" />

          {/* Large stylized 'N' logo brand badge */}
          <div className="w-full bg-navy-950/40 border border-white/10 rounded-3xl p-6 relative overflow-hidden backdrop-blur-md shadow-2xl space-y-6">
            
            {/* Big official brand mark resembling the user's uploaded mockup */}
            <div className="flex flex-col items-center text-center space-y-3 py-6 relative">
              <div className="absolute top-[-20%] inset-x-0 h-[100%] bg-gradient-to-b from-transparent via-neon-green/5 to-transparent blur-xl pointer-events-none" />
              <NavFlowBrand className="relative" />
              
              {/* Premium N logo with integrated boat sail curvature */}
              <div className="hidden w-24 h-24 relative select-none">
                <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-[0_0_8px_rgba(0,255,135,0.3)]">
                  {/* Backdrop sail waves */}
                  <path d="M 12 75 C 35 75, 45 40, 88 75 Z" fill="none" stroke="rgba(0, 240, 255, 0.25)" strokeWidth="1.5" />
                  {/* The big bold N */}
                  <path 
                    d="M 18,72 L 18,22 Q 40,40 50,48 L 50,15 L 82,72 L 82,22" 
                    fill="none" 
                    stroke="url(#n-sail-grad)" 
                    strokeWidth="11" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />
                  {/* Decorative sail elements on the diagonal */}
                  <path d="M 54,16 C 65,35, 75,55, 82,71 L 53,71 Z" fill="url(#n-sail-shading)" className="opacity-70" />
                  
                  <defs>
                    <linearGradient id="n-sail-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#00FF87" />
                      <stop offset="50%" stopColor="#00F0FF" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                    <linearGradient id="n-sail-shading" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#00FF87" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div className="hidden">
                <h3 className="font-display font-black text-3.5xl tracking-widest text-white leading-none">
                  NAVFLOW
                </h3>
                <p className="text-[10px] font-mono tracking-[0.25em] text-neon-cyan uppercase mt-1">
                  Analyse de Performance & Compétition
                </p>
              </div>
            </div>

            {/* Vessel classes tags selector visualization from graphic */}
            <div className="space-y-3">
              <span className="text-[10px] font-mono text-slate-500 uppercase block text-center">
                Pour toutes les classes de voiliers
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {[
                  { name: "ILCA / Laser", desc: "Monotype" },
                  { name: "Catamaran", desc: "Nacra / Foiling" },
                  { name: "Habitable", desc: "IRC / J70" },
                  { name: "Foiling Moth", desc: "Immersive SSL" }
                ].map((vc, idx) => (
                  <span 
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-navy-950 border border-white/5 hover:border-neon-cyan/20 text-[10px] font-mono text-slate-300 font-semibold transition"
                  >
                    ⛵ {vc.name}
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* 3. High Fidelity Badge Moroccan Crafts Footers */}
      <section className="bg-navy-950/80 border-t border-white/5 py-8 px-6 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          
          {/* Moroccan Emblem Credits */}
          <div className="flex items-center gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
            <div className="w-14 h-14 bg-red-600 border border-emerald-500/30 rounded-full flex items-center justify-center p-1.5 shrink-0 relative overflow-hidden shadow-lg shadow-red-500/10">
              <svg viewBox="0 0 100 100" className="w-8 h-8 text-[#006233] drop-shadow">
                <polygon 
                  points="50,9 61,43 92,43 67,61 76,95 50,73 24,95 33,61 8,43 39,43" 
                  fill="none" 
                  stroke="#006233" 
                  strokeWidth="8" 
                />
              </svg>
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Développé par Mouad Mouasseif</h4>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">
                Architecte digital passionné au service de la performance nautique.
              </p>
            </div>
          </div>

          {/* Checked Values list */}
          <div className="space-y-1.5">
            {[
              "100% conçu et programmé au Maroc",
              "Spécifiquement optimisé pour les compétiteurs",
              "Sécurisé, rapide & sans saisie manuelle de bateau",
              "Soutien local aux clubs de yachting"
            ].map((chk, index) => (
              <div key={index} className="flex items-center gap-2 text-[11px] font-mono text-slate-300">
                <span className="text-neon-green font-bold">✓</span>
                <span>{chk}</span>
              </div>
            ))}
          </div>

          {/* Bilingual Arabic Callography box */}
          <div className="flex items-center gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
            <div className="w-10 h-10 bg-emerald-950/60 border border-emerald-500/20 rounded-xl flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 text-neon-green" />
            </div>
            <div className="text-left font-mono">
              <span className="text-[11px] text-[#00FF87] font-black block tracking-wider uppercase">
                MADE IN MOROCCO
              </span>
              <span className="text-xs text-white block mt-0.5" dir="rtl">
                صنع في المغرب بذكاء مغربي 🇲🇦
              </span>
            </div>
          </div>

        </div>
      </section>

      <NavFlowFooter />

    </div>
  );
}
