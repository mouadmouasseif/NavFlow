import React from 'react';
import { SailingSession } from '../types';
import { Play, Anchor, Calendar, Compass, ShieldCheck, Activity } from 'lucide-react';

interface RecentUploadsProps {
  sessions: SailingSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
}

export default function RecentUploads({ sessions, activeSessionId, onSelectSession }: RecentUploadsProps) {
  // Sort sessions to make sure recently processed or uploaded ones appear first
  const sortedSessions = [...sessions].sort((a, b) => {
    // uploaded sessions have id with prefix "session-upload-"
    const aIsUpload = a.id.startsWith("session-upload-");
    const bIsUpload = b.id.startsWith("session-upload-");
    if (aIsUpload && !bIsUpload) return -1;
    if (!aIsUpload && bIsUpload) return 1;
    return b.date.localeCompare(a.date);
  });

  // Simple pure-CSS/SVG stylized thumbnail generator corresponding to boat classes
  const getSimulatedThumbnailGlow = (boatType: string) => {
    const lower = boatType.toLowerCase();
    if (lower.includes("moth") || lower.includes("foil")) {
      return {
        gradient: "from-purple-950/70 to-indigo-950/70",
        laserColor: "#00F0FF",
        waveAmplitude: 4,
        dots: [{ x: 40, y: 35 }, { x: 55, y: 50 }, { x: 75, y: 45 }]
      };
    } else if (lower.includes("cat") || lower.includes("nacra")) {
      return {
        gradient: "from-cyan-950/70 to-emerald-950/70",
        laserColor: "#00FF87",
        waveAmplitude: 8,
        dots: [{ x: 30, y: 40 }, { x: 50, y: 42 }, { x: 80, y: 35 }]
      };
    } else if (lower.includes("opti")) {
      return {
        gradient: "from-blue-950/70 to-navy-950/70",
        laserColor: "#FF5252",
        waveAmplitude: 3,
        dots: [{ x: 35, y: 45 }, { x: 55, y: 45 }, { x: 70, y: 48 }]
      };
    }
    // Default ILCA / Laser
    return {
      gradient: "from-emerald-950/70 to-blue-950/70",
      laserColor: "#00FF87",
      waveAmplitude: 6,
      dots: [{ x: 38, y: 38 }, { x: 52, y: 48 }, { x: 72, y: 42 }]
    };
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-white/10" id="recent-uploads-panel">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Compass className="w-5 h-5 text-neon-green" />
            <span className="font-mono text-xs uppercase tracking-widest text-[#00F0FF]">Multi-Session Optical Storage</span>
          </div>
          <h3 className="font-display font-medium text-xl text-white">
            Recent Video Telemetry Uploads
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Re-launch instant 3D joint rendering or ask Coach Mouad about any of these historic segments.
          </p>
        </div>

        <div className="bg-navy-950/80 px-3 py-1.5 rounded-xl border border-white/5 font-mono text-[11px] text-slate-400 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
          <span>{sessions.length} Segmented Runs</span>
        </div>
      </div>

      {sortedSessions.length === 0 ? (
        <div className="p-8 text-center text-slate-500 border border-dashed border-white/5 rounded-xl">
          No sailing video runs have been processed yet. Drop your workout videos inside the video panel overlay to inject live data models.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" id="recent-uploads-grid">
          {sortedSessions.map((sess) => {
            const isActive = sess.id === activeSessionId;
            const styleOpts = getSimulatedThumbnailGlow(sess.boatType);
            const isUpload = sess.id.startsWith("session-upload-");

            return (
              <div
                key={sess.id}
                onClick={() => onSelectSession(sess.id)}
                className={`group cursor-pointer rounded-xl overflow-hidden border transition-all duration-300 flex flex-col justify-between ${
                  isActive
                    ? "bg-navy-950 border-neon-green shadow-lg shadow-neon-green/10 translate-y-[-2px]"
                    : "bg-navy-950/40 border-white/5 hover:border-white/15 hover:bg-navy-950/70"
                }`}
              >
                {/* Visual computer vision style thumbnail */}
                <div className={`relative h-28 bg-gradient-to-br ${styleOpts.gradient} p-3 flex flex-col justify-between overflow-hidden border-b border-white/5`}>
                  {/* Neon laser tracker grids overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
                  
                  {/* Dynamic tracking lines illustration */}
                  <svg className="absolute inset-0 w-full h-full opacity-60 pointer-events-none">
                    {/* Simulated Wave */}
                    <path
                      d={`M 0 70 Q 50 ${70 - styleOpts.waveAmplitude} 100 70 T 200 70 T 300 70 T 400 70`}
                      fill="none"
                      stroke={styleOpts.laserColor}
                      strokeWidth="1.5"
                    />
                    {/* Skeleton Bones representation */}
                    <polyline
                      points={`${styleOpts.dots[0].x},${styleOpts.dots[0].y} ${styleOpts.dots[1].x},${styleOpts.dots[1].y} ${styleOpts.dots[2].x},${styleOpts.dots[2].y}`}
                      fill="none"
                      stroke="#FF5252"
                      strokeWidth="2"
                    />
                    {/* Joint markers */}
                    {styleOpts.dots.map((dot, index) => (
                      <circle
                        key={index}
                        cx={dot.x}
                        cy={dot.y}
                        r="3.5"
                        fill={styleOpts.laserColor}
                        stroke="#ffffff"
                        strokeWidth="1"
                      />
                    ))}
                  </svg>

                  {/* Header badges inside thumbnail */}
                  <div className="flex justify-between items-start z-10">
                    <span className="text-[8px] font-mono tracking-wider text-slate-400 bg-black/60 px-2 py-0.5 rounded-full uppercase border border-white/5">
                      {sess.duration}
                    </span>
                    {isUpload ? (
                      <span className="text-[8px] font-mono font-bold text-navy-950 bg-[#00FF87] px-2 py-0.5 rounded-full uppercase shadow">
                        USER CV
                      </span>
                    ) : (
                      <span className="text-[8px] font-mono font-semibold text-rose-300 bg-red-950/60 px-2 py-0.5 rounded-full uppercase border border-red-800/40">
                        PRESET
                      </span>
                    )}
                  </div>

                  {/* Laser alignment overlay stats */}
                  <div className="z-10 bg-black/30 backdrop-blur-xs p-1.5 rounded-md border border-white/5 flex justify-between items-center text-[9px] font-mono select-none">
                    <span className="text-[#00F0FF]">{sess.telemetry.averageSpeed} avg</span>
                    <span className="w-px h-2.5 bg-white/10" />
                    <span className="text-neon-green">{sess.telemetry.stabilityScore}% stability</span>
                  </div>

                  {/* Play Hover overlay icon */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-9 h-9 rounded-full bg-neon-green text-navy-950 font-bold flex items-center justify-center shadow-lg transition transform scale-90 group-hover:scale-100">
                      <Play className="w-4 h-4 fill-navy-950 text-navy-950 ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Info Metadata Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-display text-sm font-semibold text-white truncate max-w-[130px]">
                        {sess.athleteName}
                      </h4>
                      <span className="text-[10px] font-mono text-slate-500">
                        {sess.date}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5" title={sess.videoName}>
                      {sess.videoName}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span className="flex items-center gap-1">
                      <Anchor className="w-3 h-3 text-[#00F0FF]" />
                      {sess.boatType}
                    </span>
                    <span className="bg-white/5 px-2 py-0.5 rounded text-slate-300 block truncate max-w-[80px]" title={sess.location}>
                      {sess.location.split(',')[0]}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
