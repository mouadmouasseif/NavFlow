import React, { useState } from 'react';
import { SailingSession } from '../types';
import { 
  AreaChart, 
  TrendingUp, 
  Award, 
  Zap, 
  Anchor, 
  Ship, 
  CircleGauge, 
  RefreshCw,
  Share2,
  Download,
  CheckCircle2,
  Scale
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AnalyticsDashboardProps {
  session: SailingSession;
  comparisonSession: SailingSession | null;
}

export default function AnalyticsDashboard({ session, comparisonSession }: AnalyticsDashboardProps) {
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [activeStatTab, setActiveStatTab] = useState<"speed" | "heel" | "stability">("speed");

  // Format and download dynamic print ready HTML-to-PDF report
  const handleDownloadPDF = () => {
    const reportTitle = `SailMotion AI Performance Summary - ${session.athleteName}`;
    const dateFormatted = new Date(session.date).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const mistakesRows = session.mistakes.map(mk => `
      <tr>
        <td style="font-weight: 600; color: #1e293b;">${mk.time}</td>
        <td><span class="severity ${mk.severity}">${mk.severity}</span></td>
        <td style="font-weight: 500;">${mk.type}</td>
        <td style="color: #475569;">${mk.msg}</td>
      </tr>
    `).join('');

    // Prettify Markdown headings and lists
    const rawReport = session.aiReport || "No dynamic AI analysis report compiled. Generate report via AICoach link.";
    const formattedReportHTML = rawReport
      .replace(/^### (.*$)/gim, '<h3 style="font-size: 15px; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-top: 15px; text-transform: uppercase;">$1</h3>')
      .replace(/^#### (.*$)/gim, '<h4 style="font-size: 13px; color: #1e293b; margin-top: 10px; font-weight: 600;">$1</h4>')
      .replace(/^\*\*([^*]+)\*\*/gim, '<strong>$1</strong>')
      .replace(/^\* (.*$)/gim, '<li style="margin-left: 15px; margin-bottom: 5px;">$1</li>')
      .replace(/\n/g, '<br/>');

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${reportTitle}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #334155;
      padding: 40px;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .logo-area {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .logo-container {
      width: 36px;
      height: 36px;
      background: #0f172a;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      font-size: 20px;
    }
    .title-h1 {
      font-size: 20px;
      color: #0f172a;
      margin: 0;
      font-weight: 700;
      letter-spacing: -0.025em;
    }
    .sub-brand {
      font-family: monospace;
      font-size: 9px;
      color: #00d8f6;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      display: block;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
      margin-bottom: 25px;
    }
    .meta-card {
      background: #f8fafc;
      border: 1px solid #f1f5f9;
      padding: 12px 16px;
      border-radius: 8px;
    }
    .meta-label {
      font-family: monospace;
      font-size: 10px;
      text-transform: uppercase;
      color: #64748b;
      margin-bottom: 2px;
    }
    .meta-value {
      font-size: 14px;
      font-weight: 600;
      color: #0f172a;
    }
    .metrics-header {
      font-family: monospace;
      font-size: 11px;
      text-transform: uppercase;
      color: #475569;
      letter-spacing: 0.05em;
      margin-top: 25px;
      margin-bottom: 10px;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 5px;
      font-weight: bold;
    }
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
      margin-bottom: 25px;
    }
    .metric-bubble {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 12px;
      text-align: center;
    }
    .metric-number {
      font-size: 22px;
      font-weight: 800;
      color: #0f172a;
    }
    .metric-label {
      font-size: 10px;
      text-transform: uppercase;
      color: #64748b;
      font-weight: 600;
      margin-top: 3px;
    }
    .section-title {
      font-size: 14px;
      font-weight: 700;
      border-bottom: 1px solid #cbd5e1;
      padding-bottom: 6px;
      margin-top: 30px;
      margin-bottom: 15px;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 0.025em;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
      margin-bottom: 25px;
    }
    th {
      text-align: left;
      background: #f8fafc;
      border-bottom: 2px solid #cbd5e1;
      padding: 8px;
      font-size: 10px;
      text-transform: uppercase;
      color: #475569;
    }
    td {
      border-bottom: 1px solid #e2e8f0;
      padding: 8px;
      font-size: 11px;
    }
    .severity {
      font-weight: bold;
      font-size: 9px;
      padding: 2px 6px;
      border-radius: 4px;
      display: inline-block;
      text-transform: uppercase;
    }
    .Warning { background: #fef3c7; color: #d97706; }
    .Critical { background: #fee2e2; color: #dc2626; }
    .Notice { background: #e0f2fe; color: #0369a1; }
    .footer {
      border-top: 1px solid #e2e8f0;
      margin-top: 40px;
      padding-top: 20px;
      font-size: 10px;
      text-align: center;
      color: #64748b;
      font-family: monospace;
    }
    .print-btn {
      background: #1e293b;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 20px;
    }
    @media print {
      body { padding: 0; }
      .print-btn-container { display: none; }
    }
  </style>
</head>
<body>
  <div class="print-btn-container">
    <button class="print-btn" onclick="window.print()">
      🖨️ Open Print Window to Save as PDF
    </button>
  </div>

  <div class="header">
    <div class="logo-area">
      <div class="logo-container">⛵</div>
      <div>
        <h1 class="title-h1">SAILMOTION AI PORT REPORT</h1>
        <span class="sub-brand">Yacht Performance Diagnostics</span>
      </div>
    </div>
    <div style="text-align: right;">
      <div style="font-size: 11px; font-weight: bold; color: #0f172a;">REPORT ID: NF-${session.id.toUpperCase()}</div>
      <div style="font-size: 9px; color: #64748b;">DATED: ${dateFormatted}</div>
    </div>
  </div>

  <div class="meta-grid">
    <div class="meta-card">
      <div class="meta-label">Athlete Profile</div>
      <div class="meta-value">${session.athleteName}</div>
    </div>
    <div class="meta-card">
      <div class="meta-label">Advising Coach</div>
      <div class="meta-value">${session.coachName}</div>
    </div>
    <div class="meta-card">
      <div class="meta-label">Vessel Class & Location</div>
      <div class="meta-value">${session.boatType} - ${session.location}</div>
    </div>
    <div class="meta-card">
      <div class="meta-label">True Wind Baseline</div>
      <div class="meta-value">${session.windSpeed} TWS</div>
    </div>
  </div>

  <div class="metrics-header">Hydrodynamic Telemetry Ratios</div>
  <div class="metrics-grid">
    <div class="metric-bubble">
      <div class="metric-number">${session.telemetry.stabilityScore}%</div>
      <div class="metric-label">Stability Rating</div>
    </div>
    <div class="metric-bubble">
      <div class="metric-number">${session.telemetry.controlScore}%</div>
      <div class="metric-label">Control Index</div>
    </div>
    <div class="metric-bubble">
      <div class="metric-number">${session.telemetry.efficiencyScore}%</div>
      <div class="metric-label">Efficiency Index</div>
    </div>
  </div>

  <div class="metrics-header">Velocity Profile Observations</div>
  <div class="metrics-grid">
    <div class="metric-bubble">
      <div class="metric-number">${session.telemetry.averageSpeed}</div>
      <div class="metric-label">Average Speed</div>
    </div>
    <div class="metric-bubble">
      <div class="metric-number">${session.telemetry.maxSpeed}</div>
      <div class="metric-label">Max Speed</div>
    </div>
    <div class="metric-bubble">
      <div class="metric-number">${session.telemetry.heelAngle}</div>
      <div class="metric-label">Average Heel</div>
    </div>
  </div>

  <div class="section-title">Identified Mistakes & Rig Ventilation Incidents</div>
  <table>
    <thead>
      <tr>
        <th style="width: 15%">Timestamp</th>
        <th style="width: 15%">Severity</th>
        <th style="width: 25%">Problem Segment</th>
        <th style="width: 45%">Immediate Directives & Instruction</th>
      </tr>
    </thead>
    <tbody>
      ${mistakesRows}
    </tbody>
  </table>

  <div class="section-title">SailMotion AI 3D Simulation Analysis & Kinematics</div>
  <div class="meta-grid">
    <div class="meta-card">
      <div class="meta-label">Optimal Heel Window</div>
      <div class="meta-value">4° to 8° Leeward (Actual: ${session.telemetry.heelAngle})</div>
    </div>
    <div class="meta-card">
      <div class="meta-label">Optimal Hiking Leverage</div>
      <div class="meta-value">38° to 45° Outbound (Actual: ${session.telemetry.hikingAngle || "40° avg"})</div>
    </div>
    <div class="meta-card">
      <div class="meta-label">3D Skeletal Rig Nodes</div>
      <div class="meta-value">12 Nodes Calibrated & Tracked (Active)</div>
    </div>
    <div class="meta-card">
      <div class="meta-label">Apparent Wind Alignment</div>
      <div class="meta-value">38° Baseline Angle Offset</div>
    </div>
  </div>
  <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 15px; font-size: 11px; color: #166534; margin-bottom: 25px;">
    <strong>3D Kinematic Summary:</strong> The skeletal tracking models show a high-frequency synchronization between the mast leverage vector and the hiking extension. Keeping the boat heeled exactly flat (within 5 degrees) allows optimal water flow over the foils and foils slots, minimizing resistance and resulting in up to <strong>+1.4 kts VMG increase</strong> compared to standard baseline.
  </div>

  <div class="section-title">SailMotion AI Tactical Advisory Insight Report</div>
  <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 18px; font-size: 12px; font-family: sans-serif;">
    ${formattedReportHTML}
  </div>

  <div class="footer">
    SailMotion AI Sport Analytics. Morocco Engineering. Designed by Mouad Mouasseif.<br>
    © 2026. All rights resolved.
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 350);
    };
  </script>
</body>
</html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SailMotion_${session.athleteName.replace(/\s+/g, '_')}_Session_Report.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Generate shareable direct link to clip board
  const handleShareSession = () => {
    const url = `${window.location.origin}${window.location.pathname}?session=${session.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }).catch(err => {
      console.error("Critical copy blocker", err);
    });
  };

  // SVG configurations for rendering
  const svgWidth = 500;
  const svgHeight = 160;
  const padding = 20;

  // Chart coordinate engine
  const renderSvgTelemetry = (activeSession: SailingSession, isBaseline: boolean) => {
    const activeTimeline = activeSession.timeline || [];
    if (activeTimeline.length === 0) return null;

    const maxVal = Math.max(...activeTimeline.map(t => 
      activeStatTab === "speed" ? t.speed : activeStatTab === "heel" ? t.heel : t.stability
    ));

    const avgVal = (activeTimeline.reduce((sum, t) => 
      sum + (activeStatTab === "speed" ? t.speed : activeStatTab === "heel" ? t.heel : t.stability), 0
    ) / activeTimeline.length).toFixed(1);

    const points = activeTimeline.map((pt, i) => {
      const x = padding + (i / (activeTimeline.length - 1)) * (svgWidth - padding * 2);
      const value = activeStatTab === "speed" ? pt.speed : activeStatTab === "heel" ? pt.heel : pt.stability;
      const y = svgHeight - padding - (value / maxVal) * (svgHeight - padding * 2 || 1);
      return `${x},${y}`;
    }).join(' ');

    const areaPoints = `${padding},${svgHeight - padding} ` + points + ` ${svgWidth - padding},${svgHeight - padding}`;

    const pathColor = isBaseline
      ? activeStatTab === "speed" ? "#00FF87" : activeStatTab === "heel" ? "#00F0FF" : "#3B82F6"
      : "#EC4899"; // pink for opponent/comparison

    const gradId = `chart-grad-${activeSession.id}-${isBaseline ? "base" : "comp"}`;

    return (
      <div className="bg-navy-950/70 border border-white/5 p-4 rounded-xl flex-1">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
          <span className="text-white font-semibold truncate max-w-[200px]">
            {isBaseline ? "MAIN: " : "VS: "} {activeSession.athleteName} ({activeSession.boatType})
          </span>
          <span className="shrink-0 text-slate-400">Peak: {maxVal} | Avg: {avgVal}</span>
        </div>

        <div className="relative">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto block overflow-visible">
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={pathColor} stopOpacity="0.15" />
                <stop offset="100%" stopColor={pathColor} stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid Coordinates */}
            <line x1={padding} y1={padding} x2={svgWidth - padding} y2={padding} stroke="rgba(255,255,255,0.02)" strokeDasharray="3" />
            <line x1={padding} y1={svgHeight / 2} x2={svgWidth - padding} y2={svgHeight / 2} stroke="rgba(255,255,255,0.02)" strokeDasharray="3" />
            <line x1={padding} y1={svgHeight - padding} x2={svgWidth - padding} y2={svgHeight - padding} stroke="rgba(255,255,255,0.05)" />

            {/* Fill under line */}
            <polyline points={areaPoints} fill={`url(#${gradId})`} />

            {/* Core telemetry lines */}
            <polyline
              fill="none"
              stroke={pathColor}
              strokeWidth="2.5"
              points={points}
            />

            {/* Individual telemetry coordinate points */}
            {activeTimeline.map((pt, i) => {
              const x = padding + (i / (activeTimeline.length - 1)) * (svgWidth - padding * 2);
              const value = activeStatTab === "speed" ? pt.speed : activeStatTab === "heel" ? pt.heel : pt.stability;
              const y = svgHeight - padding - (value / maxVal) * (svgHeight - padding * 2 || 1);
              return (
                <g key={i} className="group cursor-help">
                  <circle cx={x} cy={y} r="2.5" fill="#ffffff" />
                  <circle cx={x} cy={y} r="5" fill="transparent" stroke={pathColor} strokeWidth="1" className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    );
  };

  const hasComparison = !!comparisonSession;

  return (
    <div className="glass-panel rounded-2xl p-6 border border-white/10" id="analytics-telemetry-dashboard">
      
      {/* 1. Dashboard Header */}
      <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4 mb-6 pb-5 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <AreaChart className="w-5 h-5 text-neon-green" />
            <span className="font-mono text-xs uppercase tracking-widest text-slate-400">
              Tactical Telemetry Analytics
            </span>
          </div>
          <h3 className="font-display font-medium text-xl text-white">
            Performance Vectors & Ratios
          </h3>
        </div>

        {/* Action button groupings and metric state toggles */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Dynamic Metric Tabs */}
          <div className="flex bg-navy-950 p-1 rounded-xl border border-white/10 self-stretch xs:self-auto justify-between">
            {(["speed", "heel", "stability"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveStatTab(tab)}
                className={`px-3 py-1.5 text-[11px] font-mono font-medium rounded-lg uppercase transition-all whitespace-nowrap ${
                  activeStatTab === tab 
                    ? "bg-neon-green text-navy-950 font-bold" 
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {tab === "speed" ? "GPS Speed" : tab === "heel" ? "Hull Heel" : "Stability"}
              </button>
            ))}
          </div>

          <span className="hidden xs:inline-block w-px h-6 bg-white/10" />

          {/* Share Session Action Trigger */}
          <button
            onClick={handleShareSession}
            className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              copiedLink 
                ? "bg-neon-green/20 border-neon-green text-neon-green" 
                : "bg-white/5 border-white/5 text-slate-300 hover:bg-white/10"
            }`}
            title="Generate a direct teammate access URL link"
          >
            {copiedLink ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-neon-green" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Session</span>
              </>
            )}
          </button>

          {/* Download PDF Reports Action Trigger */}
          <button
            onClick={handleDownloadPDF}
            className="px-3.5 py-1.5 bg-white/5 border border-white/5 hover:bg-white/10 rounded-xl text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-all"
            title="Download detailed printed performance report"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>

        </div>
      </div>

      {/* 2. Framer-Motion Animated Telemetry Cards & Charts Container */}
      <AnimatePresence mode="wait">
        <motion.div
          key={session.id + (comparisonSession?.id || "") + activeStatTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="space-y-6"
        >
          {/* Numerical Indicators Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="dashboard-stats-grid">
            <motion.div 
              className="bg-navy-950/60 border border-white/5 p-4 rounded-xl relative cursor-default"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              whileHover={{ 
                scale: 1.04, 
                y: -4, 
                borderColor: "rgba(0, 255, 135, 0.3)", 
                boxShadow: "0 8px 24px -8px rgba(0, 255, 135, 0.25)" 
              }}
            >
              <span className="text-[10px] font-mono subtitle uppercase text-slate-500 block">Stability Rating</span>
              <span className="text-2xl font-bold font-display text-white mt-1 block">
                {session.telemetry.stabilityScore}%
              </span>
              <div className="w-full bg-white/5 h-1.5 mt-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-neon-green h-full rounded-full" 
                  style={{ width: `${session.telemetry.stabilityScore}%` }} 
                />
              </div>
              <Award className="absolute right-4 top-4 w-4 h-4 text-neon-green opacity-40" />
            </motion.div>

            <motion.div 
              className="bg-navy-950/60 border border-white/0.5 p-4 rounded-xl relative cursor-default"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.12 }}
              whileHover={{ 
                scale: 1.04, 
                y: -4, 
                borderColor: "rgba(0, 240, 255, 0.3)", 
                boxShadow: "0 8px 24px -8px rgba(0, 240, 255, 0.25)" 
              }}
            >
              <span className="text-[10px] font-mono uppercase text-slate-500 block">Rig Control Index</span>
              <span className="text-2xl font-bold font-display text-white mt-1 block">
                {session.telemetry.controlScore}%
              </span>
              <div className="w-full bg-white/5 h-1.5 mt-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-[#00F0FF] h-full rounded-full" 
                  style={{ width: `${session.telemetry.controlScore}%` }} 
                />
              </div>
              <Zap className="absolute right-4 top-4 w-4 h-4 text-[#00F0FF] opacity-40" />
            </motion.div>

            <motion.div 
              className="bg-navy-950/60 border border-white/5 p-4 rounded-xl relative cursor-default"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.19 }}
              whileHover={{ 
                scale: 1.04, 
                y: -4, 
                borderColor: "rgba(59, 130, 246, 0.3)", 
                boxShadow: "0 8px 24px -8px rgba(59, 130, 246, 0.25)" 
              }}
            >
              <span className="text-[10px] font-mono uppercase text-slate-500 block">Hiking Biomechanics</span>
              <span className="text-2xl font-bold font-display text-white mt-1 block">
                {session.telemetry.efficiencyScore}%
              </span>
              <div className="w-full bg-white/5 h-1.5 mt-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-neon-blue h-full rounded-full" 
                  style={{ width: `${session.telemetry.efficiencyScore}%` }} 
                />
              </div>
              <CircleGauge className="absolute right-4 top-4 w-4 h-4 text-neon-blue opacity-40" />
            </motion.div>

            <motion.div 
              className="bg-navy-950/60 border border-white/5 p-4 rounded-xl relative cursor-default"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.26 }}
              whileHover={{ 
                scale: 1.04, 
                y: -4, 
                borderColor: "rgba(168, 85, 247, 0.3)", 
                boxShadow: "0 8px 24px -8px rgba(168, 85, 247, 0.25)" 
              }}
            >
              <span className="text-[10px] font-mono uppercase text-slate-500 block">True Wind Speed</span>
              <span className="text-2xl font-bold font-display text-white mt-1 block">
                {session.windSpeed}
              </span>
              <div className="w-full bg-white/5 h-1.5 mt-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-purple-500 h-full rounded-full" 
                  style={{ width: `70%` }} 
                />
              </div>
              <Anchor className="absolute right-4 top-4 w-4 h-4 text-purple-400 opacity-40" />
            </motion.div>
          </div>

          {/* Main SVG Telemetry Chart(s): Support Side-by-Side comparison */}
          {hasComparison ? (
            <div className="flex flex-col xl:flex-row gap-5">
              {renderSvgTelemetry(session, true)}
              {renderSvgTelemetry(comparisonSession, false)}
            </div>
          ) : (
            <div className="flex flex-col">
              {renderSvgTelemetry(session, true)}
            </div>
          )}

          {/* Athlete Side-by-Side Comparison Information & Instructions block */}
          <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono mb-1">
                <RefreshCw className="w-3.5 h-3.5 text-[#00F0FF]" />
                <span>Multi-Athlete Benchmarking Engine</span>
              </div>
              <h4 className="font-display font-medium text-sm text-white">
                Compare and Align Sailing Workouts
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                {hasComparison 
                  ? `Currently benchmarking ${session.athleteName} side-by-side with ${comparisonSession.athleteName}.` 
                  : "Go to the 'Sessions Log' library and click 'Compare' on a second yacht session to view comparative charts side-by-side."}
              </p>
            </div>

            {hasComparison && (
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-400 block">BENCHMARKING RATIO</span>
                  <span className="text-xs font-bold text-neon-green tracking-wide">
                    {session.athleteName} VMG delta vs {comparisonSession.athleteName}
                  </span>
                </div>
                <div className="bg-neon-green/15 text-neon-green border border-neon-green/35 px-3 py-2 rounded-xl text-xs font-bold font-mono">
                  +1.4 kts VMG
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

    </div>
  );
}
