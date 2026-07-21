import React, { useState, useEffect } from "react";
import { 
  SailingSession, 
  PlatformView 
} from "./types";
import { 
  Activity, 
  Compass, 
  MapPin, 
  Wind, 
  Video, 
  Layers, 
  Award, 
  Database, 
  MessageSquare, 
  CheckCircle2, 
  Sparkles, 
  Smartphone, 
  Laptop, 
  Globe,
  Anchor,
  CircleGauge,
  HelpCircle,
  Menu,
  ChevronRight
} from "lucide-react";

// Components
import CreatorBadge from "./components/CreatorBadge";
import DatabaseExplorer from "./components/DatabaseExplorer";
import Simulation3D from "./components/Simulation3D";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import AICoachChat from "./components/AICoachChat";
import VideoAnalysisPanel from "./components/VideoAnalysisPanel";
import RecentUploads from "./components/RecentUploads";
import WelcomePage from "./components/WelcomePage";
import LiveWeatherOverlay from "./components/LiveWeatherOverlay";
import NavFlowBrand from "./components/NavFlowBrand";
import NavFlowFooter from "./components/NavFlowFooter";

export default function App() {
  const [showWelcome, setShowWelcome] = useState<boolean>(true);
  const [sessions, setSessions] = useState<SailingSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>("session-001");
  const [platformMode, setPlatformMode] = useState<PlatformView>("desktop");
  const [sidebarTab, setSidebarTab] = useState<"coach" | "replay" | "analytics" | "database">("coach");
  
  // Shared synchronized timeline play states
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentProgressPct, setCurrentProgressPct] = useState(0);

  // Benchmarking and multi-athlete comparison states
  const [comparisonSessionId, setComparisonSessionId] = useState<string | null>(null);
  const comparisonSession = comparisonSessionId ? sessions.find(s => s.id === comparisonSessionId) || null : null;

  useEffect(() => {
    if (activeSessionId === comparisonSessionId) {
      setComparisonSessionId(null);
    }
  }, [activeSessionId, comparisonSessionId]);

  // Success window overlay trigger state
  const [uploadSuccessOverlay, setUploadSuccessOverlay] = useState<{
    open: boolean;
    fileName: string;
    boatType: string;
    cameraPosition: string;
  } | null>(null);

  const handleUploadProcessed = (fileName: string, boatType: string, cameraPosition: string) => {
    // Instantiate a gorgeous new dynamic AI-calibrated session matching parameters perfectly
    const dynamicSession: SailingSession = {
      id: `session-upload-${Date.now()}`,
      boatType: boatType,
      athleteName: "Yassine S. (Live CV)",
      coachName: "Coach Mouad Mouasseif",
      date: new Date().toISOString().split("T")[0],
      videoName: fileName,
      duration: "4m 15s",
      location: "Tangier Bay, Morocco 🇲🇦",
      windSpeed: "15.0 kts TWS",
      telemetry: {
        averageSpeed: boatType === "Foiling Moth" ? "18.4 kts" : boatType === "Catamaran" ? "14.2 kts" : "6.9 kts",
        maxSpeed: boatType === "Foiling Moth" ? "24.6 kts" : boatType === "Catamaran" ? "18.8 kts" : "8.8 kts",
        stabilityScore: 91,
        controlScore: 89,
        efficiencyScore: 92,
        heelAngle: "5° avg",
        hikingAngle: "42° avg",
      },
      mistakes: [
        { id: 1, time: "0:15", type: "Rudder Position", severity: "Warning", msg: "Over-steering in wave troughs causing minor foil ventilation" },
        { id: 2, time: "0:52", type: "Rig Trim", severity: "Notice", msg: "Leech windage has minor crease. Tighten outhaul line by 1 inch." }
      ],
      timeline: Array.from({ length: 15 }, (_, i) => ({
        time: i * 10,
        speed: (boatType === "Foiling Moth" ? 17 : boatType === "Catamaran" ? 13 : 6) + Math.sin(i * 0.5) * 2,
        wind: 15.0,
        heel: 6 + Math.cos(i * 0.4) * 4,
        hike: 35 + Math.sin(i * 0.6) * 10,
        stability: 85 + Math.sin(i * 0.3) * 10
      })),
      aiReport: `### 🚀 NAVFLOW AUTOMATIC CAMERA & BOAT ANALYSIS
**Vessel Mapped:** ${boatType}
**Optical Camera Detected:** ${cameraPosition} (Auto-calibrated)
**Lead Architect:** Mouad Mouasseif

#### 🎯 Real-time Computational Diagnostics
The NavFlow AI computer vision pipelines successfully tracked the rig silhouette and athlete joints with no manual boat type inputs needed.
- Flat stability is maintained in high-speed zones.
- 3D Skeletal model projection is active and playing in real-time. Feel free to review the tracking nodes!`
    };

    // Update session arrays and activate the uploaded video instantly
    setSessions(prev => [dynamicSession, ...prev]);
    setActiveSessionId(dynamicSession.id);
    
    // Auto navigate to Replay tab
    setSidebarTab("replay");
    
    // Force active real-time timeline simulation play
    setIsPlaying(true);

    // Open clean, immersive dashboard overlay/window
    setUploadSuccessOverlay({
      open: true,
      fileName,
      boatType,
      cameraPosition
    });
  };

  // Load initial session profiles from backend database API
  useEffect(() => {
    async function loadSessions() {
      try {
        const response = await fetch("/api/sessions");
        const data = await response.json();
        if (data && data.length > 0) {
          setSessions(data);
          
          // Check URL query parameters for dynamic session sharing loading!
          const params = new URLSearchParams(window.location.search);
          const sharedId = params.get("session");
          if (sharedId && data.some((s: SailingSession) => s.id === sharedId)) {
            setActiveSessionId(sharedId);
            setSidebarTab("analytics"); // automatically navigate to analytics charts!
          } else {
            setActiveSessionId(data[0].id);
          }
        }
      } catch (e) {
        console.error("NavFlow: API fetch error. Using mock offline backup", e);
      }
    }
    loadSessions();
  }, []);

  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];

  // Simulated REST upload integration
  const handleAddSessionSimulate = async (data: { athlete: string; boatType: string; wind: string; location: string }) => {
    try {
      const response = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          athlete: data.athlete,
          boatType: data.boatType,
          windSpeed: data.wind,
          location: data.location,
          name: `${data.boatType.replace(/\s+/g, "_")}_live_CV.mp4`
        })
      });
      const result = await response.json();
      if (result.success && result.session) {
        setSessions(prev => [result.session, ...prev]);
        setActiveSessionId(result.session.id);
        alert(`Successfully computed computer-vision data model for: "${data.athlete}" on "${data.boatType}"! Running video tracking.`);
      }
    } catch (err) {
      console.error("Failed to inject simulation", err);
    }
  };

  // Convert time notation like "1:45" to percentage for scrub sync
  const handleScrubMistake = (timeString: string) => {
    const parts = timeString.split(":");
    const seconds = parseInt(parts[0]) * 60 + parseInt(parts[1]);
    const pct = Math.min((seconds / 120) * 100, 100);
    setCurrentProgressPct(pct);
    setIsPlaying(false);
  };

  if (showWelcome) {
    return <WelcomePage onEnterApp={() => setShowWelcome(false)} />;
  }

  if (!activeSession) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#030712] text-white">
        <div className="text-center font-mono space-y-4">
          <Activity className="w-12 h-12 text-[#00FF87] animate-spin mx-auto" />
          <p className="text-sm">Initiating NavFlow Intel telemetry arrays...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col justify-between select-none">
      
      {/* 1. TOP PREMIUM HEADER BAR */}
      <header className="bg-navy-950 border-b border-white/5 px-6 py-4 flex items-center justify-between relative z-30 shadow-xl">
        <NavFlowBrand compact />
        <div className="hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-navy-900 to-navy-805 border border-neon-green/30 flex items-center justify-center shadow-lg shadow-neon-green/10 p-1.5 shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full text-neon-green">
              <path d="M50 5 L85 75 L50 62 L15 75 Z" fill="url(#logo-grad)" />
              <path d="M50 15 L72 65 L50 55 L28 65 Z" fill="#ffffff" className="opacity-80" />
              <defs>
                <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00FF87" />
                  <stop offset="100%" stopColor="#00F0FF" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div>
            <h1 className="font-display font-bold text-lg leading-none text-white tracking-tight flex items-center gap-1.5Spec">
              NavFlow AI
              <span className="bg-neon-green/20 text-neon-green text-[9px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full border border-neon-green/30">
                PRO RACING
              </span>
            </h1>
            <p className="text-[10px] font-mono text-slate-400 mt-0.5">Elite Performance Video Coach Analytics</p>
          </div>
        </div>

        {/* Dynamic Platform Viewport Selectors */}
        <div className="hidden md:flex gap-1 bg-navy-900 p-1 rounded-xl border border-white/10 shrink-0">
          <button
            onClick={() => setPlatformMode("desktop")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
              platformMode === "desktop" 
                ? "bg-neon-green text-navy-950 font-bold shadow shadow-neon-green/10" 
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            Desktop Layout View
          </button>
          
          <button
            onClick={() => setPlatformMode("web")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
              platformMode === "web" 
                ? "bg-neon-green text-navy-950 font-bold shadow shadow-neon-green/10" 
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            Responsive Web View
          </button>

          <button
            onClick={() => setPlatformMode("mobile")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
              platformMode === "mobile" 
                ? "bg-neon-green text-navy-950 font-bold shadow shadow-neon-green/10" 
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            Mobile App View
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowWelcome(true)}
            className="px-2.5 py-1.5 rounded-lg bg-navy-900 border border-white/10 hover:border-neon-cyan/40 hover:bg-navy-850 text-[11px] font-mono font-bold text-neon-cyan transition-all flex items-center gap-1 active:scale-95 shrink-0"
            title="Afficher la page d'explications de l'application"
          >
            <HelpCircle className="w-3.5 h-3.5 text-neon-cyan" />
            <span className="hidden xs:inline">GUIDE & RÔLE</span>
          </button>

          <span className="text-right hidden sm:block">
            <span className="text-[10px] font-mono text-slate-500 block">Lead Architect</span>
            <span className="text-xs font-bold text-slate-300 font-mono">Mouad Mouasseif</span>
          </span>
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 pulsing-ring" title="Systems online" />
        </div>
      </header>

      {/* 2. MAIN WORKSPACE CONTAINER */}
      <main className="flex-1 p-4 lg:p-6" id="navflow-main-workspace-frame">
        
        {/* -- DESKTOP SIMULATOR CASE -- */}
        {platformMode === "desktop" && (
          <div className="glass-panel rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex min-h-[750px] relative" id="desktop-wrapper-container">
            
            {/* Bezel Title header bar of the fake OS OS */}
            <div className="absolute top-0 right-0 left-0 h-10 bg-navy-950 border-b border-white/5 flex items-center justify-between px-4 text-xs font-mono text-slate-400 z-10 select-none">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 bg-red-500/80 rounded-full inline-block" />
                <span className="w-3 h-3 bg-yellow-500/80 rounded-full inline-block" />
                <span className="w-3 h-3 bg-green-500/80 rounded-full inline-block" />
              </div>
              <span>NAVFLOW SPORT CONSOLE OS • v3.1</span>
              <span>Tangier Bay Local Connection - Lat: 35.79 N</span>
            </div>

            {/* Simulated Desktop Sidebar */}
            <aside className="w-64 bg-navy-950/90 pt-14 border-r border-white/5 flex flex-col justify-between px-3 pb-4 shrink-0 select-none">
              
              <div className="space-y-6">
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500 px-3 font-semibold">Active Workouts</span>
                  <div className="mt-2 space-y-1">
                    {sessions.map(sess => {
                      const isActiveCase = sess.id === activeSessionId;
                      return (
                        <button
                          key={sess.id}
                          onClick={() => setActiveSessionId(sess.id)}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors flex items-center justify-between group ${
                            isActiveCase 
                              ? "bg-neon-green/10 text-neon-green font-bold border border-neon-green/20" 
                              : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                          }`}
                        >
                          <div>
                            <span className="block truncate">{sess.athleteName}</span>
                            <span className="text-[10px] text-slate-500 font-mono italic">{sess.boatType}</span>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500 px-3 font-semibold">Module Navigator</span>
                  <nav className="mt-2 space-y-1">
                    <button
                      onClick={() => setSidebarTab("coach")}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors ${
                        sidebarTab === "coach" 
                          ? "bg-white/10 text-white font-bold" 
                          : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                      }`}
                    >
                      <MessageSquare className="w-4 h-4 text-neon-green" />
                      NavFlow AI Coach (Gemini)
                    </button>

                    <button
                      onClick={() => setSidebarTab("replay")}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors ${
                        sidebarTab === "replay" 
                          ? "bg-white/10 text-white font-bold" 
                          : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                      }`}
                    >
                      <Layers className="w-4 h-4 text-[#00F0FF]" />
                      3D Skeletal Replay
                    </button>

                    <button
                      onClick={() => setSidebarTab("analytics")}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors ${
                        sidebarTab === "analytics" 
                          ? "bg-white/10 text-white font-bold" 
                          : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                      }`}
                    >
                      <Activity className="w-4 h-4 text-neon-blue" />
                      Dynamic Telemetry
                    </button>

                    <button
                      onClick={() => setSidebarTab("database")}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors ${
                        sidebarTab === "database" 
                          ? "bg-white/10 text-white font-bold" 
                          : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                      }`}
                    >
                      <Database className="w-4 h-4 text-purple-400" />
                      PostgreSQL Database
                    </button>
                  </nav>
                </div>
              </div>

              {/* Sidebar bottom indicator */}
              <div className="bg-navy-900/60 p-3 rounded-xl border border-white/5 text-center">
                <span className="text-[10px] font-mono text-[#00FF87] block uppercase">GPS satellite plane</span>
                <span className="text-[11px] text-slate-300 font-bold block mt-0.5">Wind Shifts: 5° STB</span>
              </div>
            </aside>

            {/* Desktop content stage */}
            <div className="flex-1 pt-14 pb-6 px-6 overflow-y-auto space-y-6">
              
              {/* Telemetry quick overview row */}
              <div className="bg-white/[0.01] border border-white/5 p-4 rounded-xl flex items-center flex-wrap justify-between gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <MapPin className="text-[#00F0FF] w-4.5 h-4.5" />
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-mono block">Selected Workout Location</span>
                    <span className="text-sm font-semibold text-slate-200">{activeSession.location}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Wind className="text-[#00FF87] w-4.5 h-4.5" />
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-mono block">Wind Range estimate</span>
                    <span className="text-sm font-semibold text-slate-200">{activeSession.windSpeed} north</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-neon-green/10 text-neon-green border border-neon-green/20 px-2 py-1 rounded font-bold font-mono">
                    VMG efficiency: {activeSession.telemetry.stabilityScore}%
                  </span>
                </div>
              </div>

              {/* Main functional workspace layout */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Visual Video overlay feeds */}
                <VideoAnalysisPanel 
                  session={activeSession}
                  isPlaying={isPlaying}
                  onPlayToggle={setIsPlaying}
                  currentTimePct={currentProgressPct}
                  onTimeUpdate={setCurrentProgressPct}
                  onScrubMistake={handleScrubMistake}
                  onUploadProcessed={handleUploadProcessed}
                />

                {/* Left column displays component based on sidebar tab selection */}
                <div className="space-y-6">
                  {/* Real-time Atmospheric Telemetry Overlay */}
                  <LiveWeatherOverlay location={activeSession.location} />

                  {sidebarTab === "coach" && (
                    <AICoachChat session={activeSession} />
                  )}

                  {sidebarTab === "replay" && (
                    <Simulation3D 
                      session={activeSession}
                      isPlaying={isPlaying}
                      currentTimePct={currentProgressPct}
                    />
                  )}

                  {sidebarTab === "analytics" && (
                    <AnalyticsDashboard 
                      session={activeSession} 
                      comparisonSession={comparisonSession} 
                    />
                  )}

                  {sidebarTab === "database" && (
                    <DatabaseExplorer 
                      sessions={sessions}
                      onSelectSession={setActiveSessionId}
                      selectedSessionId={activeSessionId}
                      onAddSessionSimulate={handleAddSessionSimulate}
                      comparisonSessionId={comparisonSessionId}
                      onSelectComparisonSession={setComparisonSessionId}
                    />
                  )}
                </div>
              </div>

              {/* Recent Video Telemetry Uploads Storage */}
              <RecentUploads 
                sessions={sessions}
                activeSessionId={activeSessionId}
                onSelectSession={setActiveSessionId}
              />

              {/* Moroccan Digital Craftsmanship Ad */}
              <CreatorBadge />

            </div>
          </div>
        )}


        {/* -- FULL WIDTH RESPONSIVE WEB PORTAL -- */}
        {platformMode === "web" && (
          <div className="space-y-6" id="web-layout-wrapper">
            
            {/* Big Web Portal Hero Section */}
            <div className="glass-panel p-8 rounded-2xl border border-white/10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6" id="web-hero">
              <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-neon-green/5 blur-3xl" />
              <div className="relative">
                <span className="text-xs font-bold text-neon-green bg-neon-green/15 border border-neon-green/20 px-3 py-1 rounded-full uppercase tracking-wider">
                  Hudl + SailGP Advanced Analytics
                </span>
                <h2 className="font-display font-black text-3.5xl text-white tracking-tight leading-none mt-3.5">
                  NavFlow AI Engine
                </h2>
                <p className="text-slate-400 mt-2 text-sm max-w-xl">
                  Process, review and segment sailing biomechanics and rig trim directly from the water using state-of-the-art computer vision models.
                </p>
              </div>

              <div className="flex gap-3 relative shrink-0">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-6 py-3 bg-neon-green text-navy-950 font-bold hover:bg-neon-green/90 transition-all rounded-xl shadow-lg shadow-neon-green/25 font-display flex items-center gap-2"
                >
                  <Activity className="w-4.5 h-4.5" />
                  {isPlaying ? "Pause Tracking" : "Start Real-Time Tracking"}
                </button>
              </div>
            </div>

            {/* Split Visual Layout grids */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Unified video trim analyser */}
              <VideoAnalysisPanel 
                session={activeSession}
                isPlaying={isPlaying}
                onPlayToggle={setIsPlaying}
                currentTimePct={currentProgressPct}
                onTimeUpdate={setCurrentProgressPct}
                onScrubMistake={handleScrubMistake}
                onUploadProcessed={handleUploadProcessed}
              />

              {/* 3D skeleton simulation block */}
              <Simulation3D 
                session={activeSession}
                isPlaying={isPlaying}
                currentTimePct={currentProgressPct}
              />

            </div>

            {/* Recent Video Telemetry Uploads Storage */}
            <RecentUploads 
              sessions={sessions}
              activeSessionId={activeSessionId}
              onSelectSession={setActiveSessionId}
            />

            {/* Interactive database grid */}
            <DatabaseExplorer 
              sessions={sessions}
              onSelectSession={setActiveSessionId}
              selectedSessionId={activeSessionId}
              onAddSessionSimulate={handleAddSessionSimulate}
              comparisonSessionId={comparisonSessionId}
              onSelectComparisonSession={setComparisonSessionId}
            />

            {/* Core Recharts replacement and chat */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="lg:col-span-2">
                <AnalyticsDashboard 
                  session={activeSession} 
                  comparisonSession={comparisonSession} 
                />
              </div>
              
              <div className="space-y-6">
                <LiveWeatherOverlay location={activeSession.location} />

                <div className="glass-panel p-5 rounded-2xl border border-white/10 text-center relative overflow-hidden">
                  <Award className="w-8 h-8 text-neon-green mx-auto mb-2.5" />
                  <h4 className="font-display font-bold text-slate-100 text-sm">Tangier Performance Championship</h4>
                  <p className="text-xs text-slate-400 mt-1">Sailing Club Tangier-Med racing criteria</p>
                  <div className="mt-4 p-3 bg-navy-950/80 border border-white/5 rounded-xl inline-block max-w-[200px]">
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">Leader</span>
                    <span className="text-sm font-bold text-white block truncate">Yassine Standard</span>
                  </div>
                </div>

                <div className="glass-panel p-5 rounded-2xl border border-white/10 text-center relative overflow-hidden">
                  <CircleGauge className="w-8 h-8 text-[#00F0FF] mx-auto mb-2.5" />
                  <h4 className="font-display font-bold text-slate-100 text-sm">GPU Render Accelerations</h4>
                  <p className="text-xs text-slate-400 mt-1">Core tracking algorithms operating at 120fps</p>
                </div>
              </div>

            </div>

            {/* Coaching Consultation box */}
            <AICoachChat session={activeSession} />

            {/* Moroccan Digital Craftsmanship Ad */}
            <CreatorBadge />

          </div>
        )}


        {/* -- HIGH-FIDELITY MOBILE APP INTERATIVE VIEWPORT -- */}
        {platformMode === "mobile" && (
          <div className="flex items-center justify-center py-6" id="mobile-layout-wrapper">
            
            {/* Simulated iPhone-style Bezel Frame */}
            <div className="w-[380px] h-[780px] bg-[#090D1A] rounded-[48px] border-[10px] border-[#1C2541] shadow-2xl overflow-hidden relative flex flex-col justify-between" id="iphone-bezel">
              
              {/* iPhone top sensor notch */}
              <div className="absolute top-0 inset-x-0 h-6 bg-black flex items-center justify-center z-40">
                <div className="w-24 h-4 bg-zinc-900 rounded-full flex items-center justify-end px-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                </div>
              </div>

              {/* Mobile app header status bar */}
              <div className="bg-[#090D1A] pt-7 px-6 pb-3 border-b border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400 z-30">
                <span>9:41 AM</span>
                <span className="text-neon-green">▲ TGR GPS connected</span>
                <span>80% 🔋</span>
              </div>

              {/* Mobile Content Stage viewport */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                
                {/* Mobile Welcome Title */}
                <div className="flex items-center justify-between pb-2">
                  <div>
                    <span className="text-[9px] uppercase font-mono tracking-wider text-rose-500">Coach Advisor App</span>
                    <h2 className="font-display font-black text-xl text-white tracking-tight leading-none mt-1">
                      NavFlow Mobile
                    </h2>
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-neon-green/10 border border-neon-green/20 flex items-center justify-center text-neon-green text-xs font-bold font-display">
                    N
                  </div>
                </div>

                {/* Interactive mobile camera preview simulator */}
                <div className="glass-panel overflow-hidden border border-white/10 rounded-xl">
                  {/* Aspect ratio vertical for phone layout */}
                  <div className="relative aspect-[3/4] bg-[#02050c] flex flex-col justify-between p-3">
                    
                    {/* Live indicator tag */}
                    <div className="flex items-center justify-between text-[9px] font-mono">
                      <span className="bg-red-500 text-white px-2 py-0.5 rounded uppercase font-bold tracking-wider animate-pulse">
                        LIVE HUD
                      </span>
                      <span className="text-slate-400 uppercase">ILCA Tracker</span>
                    </div>

                    {/* Simple Vector drawing to indicate sailing motion */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center opacity-70 pointer-events-none select-none">
                      {/* Interactive graphic skeleton */}
                      <div className="w-20 h-20 rounded-full border border-neon-green/20 flex items-center justify-center animate-spin" style={{ animationDuration: '12s' }}>
                        <div className="w-3.5 h-3.5 bg-red-500 rounded-full" />
                      </div>
                      <span className="text-[10px] font-mono text-neon-green tracking-widest uppercase mt-3">SKELETON PROJECTION</span>
                    </div>

                    {/* Mobile telemetries */}
                    <div className="bg-navy-950/95 border border-white/10 p-2.5 rounded-lg flex items-center justify-between gap-1 select-none z-10 w-full">
                      <div className="text-center">
                        <span className="text-[8px] font-mono text-slate-500 uppercase block">VMG Speed</span>
                        <span className="text-xs font-bold text-neon-green font-mono">
                          {activeSession.telemetry.averageSpeed}
                        </span>
                      </div>
                      <div className="w-px bg-white/10 h-6" />
                      <div className="text-center">
                        <span className="text-[8px] font-mono text-slate-500 uppercase block">heel dev</span>
                        <span className="text-xs font-bold text-[#00F0FF] font-mono">
                          {activeSession.telemetry.heelAngle}
                        </span>
                      </div>
                      <div className="w-px bg-white/10 h-6" />
                      <div className="text-center">
                        <span className="text-[8px] font-mono text-slate-500 uppercase block">stability</span>
                        <span className="text-xs font-bold text-[#3B82F6] font-mono">
                          {activeSession.telemetry.stabilityScore}%
                        </span>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Live Weather Indicator */}
                <LiveWeatherOverlay location={activeSession.location} />

                {/* Instant Prompt Coaching Advice */}
                <div className="bg-red-950/20 border border-red-500/20 p-3.5 rounded-xl">
                  <div className="flex gap-2 items-start">
                    <span className="text-xs">💡</span>
                    <div>
                      <h4 className="text-xs font-bold text-rose-300 uppercase">Immediate post-upwind advice:</h4>
                      <p className="text-[11px] text-slate-300 leading-relaxed mt-1">
                        Torso leverage dropped to 45°. Push outbound to hold optimal kinetic thrust.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Compact Mobile Recent Uploads slider */}
                <div className="space-y-2">
                  <span className="text-[9px] uppercase font-mono tracking-widest text-[#00FF87] block">Recent Runs Storage</span>
                  <div className="flex gap-3 overflow-x-auto pb-2 snap-x scrollbar-none">
                    {sessions.map((sess) => {
                      const isActive = sess.id === activeSessionId;
                      return (
                        <button
                          key={sess.id}
                          onClick={() => setActiveSessionId(sess.id)}
                          className={`snap-center shrink-0 w-32 p-3 rounded-xl border text-left transition-all ${
                            isActive
                              ? "bg-neon-green/10 border-neon-green text-white font-bold"
                              : "bg-navy-950/80 border-white/5 text-slate-400 hover:border-white/15"
                          }`}
                        >
                          <span className="block text-[10px] font-bold truncate">{sess.athleteName}</span>
                          <span className="block text-[9px] text-slate-500 font-mono mt-0.5 truncate">{sess.boatType}</span>
                          <span className="block text-[8px] text-neon-cyan font-mono mt-1">{sess.telemetry.averageSpeed} avg</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Dynamic mini chat consult for phone */}
                <div className="p-3 bg-navy-950/80 border border-white/5 rounded-xl">
                  <span className="text-[9px] uppercase font-mono tracking-widest text-[#00F0FF] block mb-2">Live AI Assistant thread</span>
                  <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                    <div className="bg-white/5 p-2.5 rounded-lg text-xs leading-relaxed text-slate-300">
                      **Sofia's gybe tracking:** Sprit creases observed at 9kts wind. Increase tension indexing.
                    </div>
                  </div>
                </div>

                {/* Moroccan developers credit for phone */}
                <div className="text-center bg-white/[0.02] border border-white/5 rounded-xl p-3">
                  <span className="text-[8px] font-mono text-slate-500 block uppercase">App Dev</span>
                  <span className="text-xs font-bold text-slate-300">Mouad Mouasseif</span>
                  <p className="text-[9px] text-slate-500">Tangier Bay Yacht Racing, Morocco</p>
                </div>

              </div>

              {/* iPhone bottom swipe navigation bar */}
              <div className="bg-[#090D1A] py-3.5 border-t border-white/5 flex items-center justify-center z-30">
                <div className="w-32 h-1 bg-white/40 rounded-full" />
              </div>

            </div>
          </div>
        )}

      </main>

      {/* Dynamic HUD Calibration Success Modal Overlay */}
      {uploadSuccessOverlay && uploadSuccessOverlay.open && (
        <div className="fixed inset-0 bg-[#02050c]/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in" id="navflow-ai-calibration-success-overlay">
          <div className="max-w-md w-full bg-[#090D1A]/95 border border-neon-green/30 hover:border-neon-cyan/40 p-6 rounded-3xl shadow-2xl relative overflow-hidden text-center space-y-5 transition-all">
            
            {/* Ambient glows inside overlay */}
            <div className="absolute -right-16 -bottom-16 w-32 h-32 rounded-full bg-neon-green/15 blur-2xl pointer-events-none" />
            <div className="absolute -left-16 -top-16 w-32 h-32 rounded-full bg-neon-cyan/15 blur-2xl pointer-events-none" />
            
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-neon-green/10 border border-neon-green/30 flex items-center justify-center animate-bounce shadow-lg shadow-neon-green/10">
                <Sparkles className="w-7 h-7 text-neon-green animate-pulse" />
              </div>
              <span className="bg-neon-green/10 text-neon-green text-[10px] uppercase font-mono font-black tracking-widest px-3 py-1 rounded-full border border-neon-green/20">
                COMPUTER VISION SYSTEM ARMED
              </span>
              <h3 className="font-display font-black text-xl text-white tracking-tight">
                NavFlow AI Calibration
              </h3>
              <p className="text-xs text-slate-400 max-w-sm">
                Optical telemetry has automatically mapped your video feed without requiring manual boat classification prompts.
              </p>
            </div>

            <div className="bg-navy-950/90 border border-white/5 rounded-2xl p-4.5 text-left space-y-3 shadow-inner font-mono text-[11px] text-slate-300">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-slate-500 uppercase">Fichier source:</span>
                <span className="text-white font-medium truncate max-w-[180px]">{uploadSuccessOverlay.fileName}</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-[#00FF87] uppercase font-bold">Bateau d&eacute;tect&eacute; (Bateau):</span>
                <span className="text-white font-black bg-neon-green/10 border border-neon-green/20 px-2.5 py-0.5 rounded">
                  ⛵ {uploadSuccessOverlay.boatType}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-[#00F0FF] uppercase">Angle cam&eacute;ra (Auto):</span>
                <span className="text-white font-bold">{uploadSuccessOverlay.cameraPosition}</span>
              </div>
              <div className="flex items-start justify-between">
                <span className="text-amber-500 uppercase">Statut lecture:</span>
                <span className="text-slate-300 text-right font-medium leading-relaxed">
                  Lecteur actif (&Eacute;coute en d&eacute;roule)<br/>
                  <span className="text-neutral-500 italic text-[10px]">(Play on Real Time Active)</span>
                </span>
              </div>
            </div>

            <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl text-center">
              <p className="text-[10px] text-slate-500 leading-relaxed">
                Appuyez sur Confirmer pour fermer ce widget. L'application a d&eacute;j&agrave; d&eacute;marr&eacute; la projection squelettique 3D dans l'onglet Analyse tactique.
              </p>
            </div>

            <button
              onClick={() => setUploadSuccessOverlay(null)}
              className="w-full py-3 bg-gradient-to-r from-neon-green to-neon-cyan text-navy-950 font-display font-bold text-xs rounded-xl hover:opacity-90 transition-all shadow-lg shadow-neon-green/20 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-navy-950" />
              CONFIRMER L'ACC&Egrave;S TACTIQUE VMG
            </button>
          </div>
        </div>
      )}

      <div className="hidden">
        <div>
          <span>© 2026 NavFlow AI performance metrics. Marine Dynamics & Optical Telemetry.</span>
          <span className="ml-2 pl-2 border-l border-white/10 hidden sm:inline-block">Olympic High-Frequency Sailing Feedback Core.</span>
        </div>

        <div className="flex items-center gap-2.5">
          <span>Projet conçu et développé avec excellence par</span>
          <span className="text-white font-bold hover:text-neon-green transition-colors decoration-neon-cyan underline underline-offset-4 decoration-2">
            Mouad Mouasseif
          </span>
          <span className="text-[10px] bg-emerald-950/80 text-emerald-400 font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Maroc 🇲🇦
          </span>
        </div>
      </div>
      <NavFlowFooter />

    </div>
  );
}
