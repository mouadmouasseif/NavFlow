import React, { useRef, useEffect, useState } from 'react';
import { SailingSession } from '../types';
import { Compass, RotateCw, Video, Layers, Wind, Eye, Activity } from 'lucide-react';

interface Simulation3DProps {
  session: SailingSession;
  isPlaying: boolean;
  currentTimePct: number; // 0 to 100 representing playback progression
}

type CameraView = "top" | "side" | "behind" | "skeleton-only";

export default function Simulation3D({ session, isPlaying, currentTimePct }: Simulation3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraView, setCameraView] = useState<CameraView>("behind");
  const [ghostMode, setGhostMode] = useState(true);
  const [windVectors, setWindVectors] = useState(true);
  const [autoRotateAngle, setAutoRotateAngle] = useState(0);

  // Auto-rotate effect for the free/active visualization
  useEffect(() => {
    let animId: number;
    if (isPlaying) {
      const updateRotation = () => {
        setAutoRotateAngle(prev => (prev + 0.5) % 360);
        animId = requestAnimationFrame(updateRotation);
      };
      animId = requestAnimationFrame(updateRotation);
    }
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  // Canvas drawing loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high-DPI scaling
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    const W = rect.width;
    const H = rect.height;
    const cx = W / 2;
    const cy = H / 2;

    // Clear background
    ctx.fillStyle = '#0a101f';
    ctx.fillRect(0, 0, W, H);

    // Draw dynamic ocean waves lines using timeline percent
    const waveShift = (currentTimePct * 4) % 100;
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < H; i += 20) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      for (let x = 0; x < W; x += 10) {
        const y = i + Math.sin((x + waveShift) * 0.04) * 4;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Coordinates timeline index
    const timelineLen = session.timeline.length;
    const timeIndex = Math.min(
      Math.floor((currentTimePct / 100) * timelineLen),
      timelineLen - 1
    );
    const activeFrame = session.timeline[timeIndex] || session.timeline[0];

    const actualHeel = activeFrame ? activeFrame.heel : 12;
    const actualHike = activeFrame ? activeFrame.hike : 45;
    const actualSpeed = activeFrame ? activeFrame.speed : 6.8;

    // Wind overlay
    if (windVectors) {
      drawWindGrid(ctx, W, H, currentTimePct);
    }

    // Ghost boat setup
    if (ghostMode && cameraView !== "skeleton-only") {
      ctx.save();
      // Draw ghost boat representing perfect elite model
      ctx.translate(cx - 30, cy + 20);
      drawYacht(ctx, "ghost", 10, 48, cameraView, currentTimePct);
      ctx.restore();
    }

    // Active Boat
    ctx.save();
    ctx.translate(cx, cy);
    // Apply dynamic telemetry heel and rotate values depending on CAMERA VIEW projection
    drawYacht(ctx, "athlete", actualHeel, actualHike, cameraView, currentTimePct);
    ctx.restore();

    // Draw 3D coordinate box labels
    drawHudLabels(ctx, W, H, actualSpeed, actualHeel, actualHike, cameraView);

  }, [cameraView, ghostMode, windVectors, currentTimePct, session, autoRotateAngle]);

  // Helper 1: Draw Apparent Wind Grid
  const drawWindGrid = (ctx: CanvasRenderingContext2D, W: number, H: number, timePct: number) => {
    ctx.save();
    ctx.strokeStyle = 'rgba(0, 255, 135, 0.15)';
    ctx.fillStyle = 'rgba(0, 255, 135, 0.4)';
    ctx.lineWidth = 1;

    const spacing = 60;
    const gridShift = (timePct * 2) % spacing;

    for (let x = gridShift; x < W + spacing; x += spacing) {
      for (let y = 0; y < H; y += spacing) {
        // Draw wind indicator arrows
        ctx.beginPath();
        ctx.moveTo(x, y);
        // Angle of wind arrow from northeast
        const arrowLen = 15;
        const windAng = Math.PI * 0.75; // Direction towards southwest
        const tx = x + Math.cos(windAng) * arrowLen;
        const ty = y + Math.sin(windAng) * arrowLen;
        ctx.lineTo(tx, ty);
        ctx.stroke();

        // Arrow tip
        ctx.beginPath();
        const tipSize = 3;
        ctx.arc(tx, ty, tipSize / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  };

  // Helper 2: Draw the 3D Yacht Model projection depending on view
  const drawYacht = (
    ctx: CanvasRenderingContext2D,
    type: "athlete" | "ghost",
    heel: number,
    hike: number,
    view: CameraView,
    timePct: number
  ) => {
    const isGhost = type === "ghost";
    const primaryColor = isGhost ? '#94A3B8' : '#00FF87';
    const accentColor = isGhost ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 240, 255, 0.8)';
    const opacity = isGhost ? 0.35 : 1.0;

    if (view === "top") {
      // TOP CAMERA VIEW
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.rotate(isGhost ? -0.1 : 0);

      // Boat Hull
      ctx.fillStyle = isGhost ? 'rgba(74, 85, 104, 0.5)' : '#0F172A';
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 2.5;

      ctx.beginPath();
      ctx.moveTo(0, -60); // Bow
      ctx.bezierCurveTo(20, -20, 24, 20, 18, 50); // Starboard hull curve
      ctx.lineTo(-18, 50); // Transom
      ctx.bezierCurveTo(-24, 20, -20, -20, 0, -60); // Port hull curve
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Daggerboard/Centerboard slot
      ctx.fillStyle = accentColor;
      ctx.fillRect(-2, -5, 4, 15);

      // Boom & Sail
      const waveSweep = Math.sin(timePct * 0.15) * 8;
      const sailAngle = view === "top" ? -25 + waveSweep : -28;
      ctx.save();
      ctx.translate(0, -20); // Mast base
      ctx.rotate((sailAngle * Math.PI) / 180);

      // Boom line
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, 65);
      ctx.stroke();

      // Curved Sail canvas
      ctx.strokeStyle = isGhost ? 'rgba(250,250,250,0.4)' : 'rgba(0, 240, 255, 0.55)';
      ctx.fillStyle = isGhost ? 'rgba(200,200,200,0.1)' : 'rgba(0, 240, 255, 0.15)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(15, 30, 0, 60); // Curved sail belly
      ctx.lineTo(0, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // Athlete Skeleton dot
      const hikerDist = isGhost ? 15 : (hike / 40) * 18;
      ctx.fillStyle = '#FF5252';
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(-hikerDist, 10, 5, 0, Math.PI * 2); // Hiking outbound
      ctx.fill();
      ctx.stroke();

      ctx.restore();

    } else if (view === "side") {
      // SIDE CAMERA VIEW
      ctx.save();
      ctx.globalAlpha = opacity;
      
      // Sea level line
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
      ctx.beginPath();
      ctx.moveTo(-100, 30);
      ctx.lineTo(100, 30);
      ctx.stroke();

      // Hull
      ctx.fillStyle = isGhost ? 'rgba(74, 85, 104, 0.5)' : '#0F172A';
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 2.5;

      ctx.beginPath();
      ctx.moveTo(-70, 20); // Transom
      ctx.lineTo(60, 20); // Bow entry
      ctx.quadraticCurveTo(75, 10, 80, 5); // Bow nose
      ctx.lineTo(75, 20);
      ctx.quadraticCurveTo(40, 30, -70, 28); // Bottom hull rocker curvature
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Mast
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(10, 20);
      ctx.lineTo(12, -80); // Tall mast
      ctx.stroke();

      // Sail Canvas
      ctx.fillStyle = isGhost ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 240, 255, 0.1)';
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(11, -75); // Mast Head apex
      ctx.quadraticCurveTo(-25, -20, -50, 15); // Sail leech
      ctx.lineTo(11, 15); // Tack base boom joint
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Sailor skeleton sitting / hiking
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.5;
      ctx.fillStyle = '#E11D48';

      // Knee (sitting near deck)
      const kx = -15, ky = 16;
      // Hip
      const hx = -32, hy = 10;
      // Shoulder
      const sx = -28 - (hike / 8), sy = -10;
      // Head
      const h_ex = -27 - (hike / 8), h_ey = -22;

      ctx.beginPath();
      ctx.moveTo(0, 18); // Ankle straps
      ctx.lineTo(kx, ky); // Knee
      ctx.lineTo(hx, hy); // Hip
      ctx.lineTo(sx, sy); // Shoulder
      ctx.stroke();

      // Head circle
      ctx.beginPath();
      ctx.arc(h_ex, h_ey, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.restore();

    } else if (view === "behind" || view === "skeleton-only") {
      // BEHIND SAILING STABLE CAMERA VIEW
      ctx.save();
      ctx.globalAlpha = opacity;

      // Apply heel tilt to the whole coordinate space
      ctx.rotate((heel * Math.PI) / 180);

      if (view !== "skeleton-only") {
        // Hull cross section
        ctx.fillStyle = isGhost ? 'rgba(74, 85, 104, 0.5)' : '#0F172A';
        ctx.strokeStyle = primaryColor;
        ctx.lineWidth = 2.5;

        ctx.beginPath();
        ctx.moveTo(-45, 12); // Windward rail
        ctx.lineTo(45, 12); // Leeward rail
        ctx.quadraticCurveTo(35, 28, 0, 28); // Bottom hull rocker profile
        ctx.quadraticCurveTo(-35, 28, -45, 12);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Cockpit floor
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(-30, 2, 60, 10);

        // Mast vertical profile
        ctx.strokeStyle = '#94A3B8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, 2);
        ctx.lineTo(0, -90);
        ctx.stroke();

        // Sail cross curvature
        const waveFlutter = Math.sin(timePct * 0.2) * 5;
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 1.5;
        ctx.fillStyle = isGhost ? 'rgba(255,255,255,0.05)' : 'rgba(0, 240, 255, 0.12)';
        ctx.beginPath();
        ctx.moveTo(0, -85);
        ctx.quadraticCurveTo(30 + waveFlutter, -45, 20, 0); // Leeward billowing sail
        ctx.lineTo(0, 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }

      // 3D Skeleton structure of athlete hiking out of windward rail (left edge relative to behind camera)
      // Straps anchorage coordinate
      const strapX = -10, strapY = 8;
      // Knee coordinate (raised above gunwale)
      const kneeX = -32, kneeY = -5;
      // Hip leverage coordinate (slung outbound)
      const ratio = hike / 45; // scale hike leverage
      const hipX = -45 - (18 * ratio), hipY = -2;
      // Shoulder (leaning way off deck)
      const shoulderX = hipX - (25 * ratio), shoulderY = hipY - 26;
      // Head
      const headX = shoulderX + 3, headY = shoulderY - 14;

      // Draw skeleton lines
      ctx.strokeStyle = isGhost ? '#64748B' : '#00F0FF';
      ctx.lineWidth = 2.5;
      ctx.shadowBlur = isGhost ? 0 : 8;
      ctx.shadowColor = '#00F0FF';

      // Spine & thighs
      ctx.beginPath();
      ctx.moveTo(strapX, strapY); // Toes
      ctx.lineTo(kneeX, kneeY); // Knee joint
      ctx.lineTo(hipX, hipY); // Hip joint
      ctx.lineTo(shoulderX, shoulderY); // Shoulder core
      ctx.stroke();

      // Arms holding mainsheet
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(shoulderX, shoulderY);
      ctx.lineTo(10, -5); // Arm reaching hand-to-sheet
      ctx.stroke();

      // Head dot
      ctx.fillStyle = isGhost ? '#475569' : '#00FF87';
      ctx.beginPath();
      ctx.arc(headX, headY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.stroke();

      // Display hiking angle text label next to the hip
      if (!isGhost && view !== "skeleton-only") {
        ctx.fillStyle = '#00FF87';
        ctx.font = '10px monospace';
        ctx.fillText(`Hike Offset: ${hike}°`, hipX - 5, hipY + 18);
      }

      ctx.restore();
    }
  };

  // Helper 3: HUD Text Elements
  const drawHudLabels = (
    ctx: CanvasRenderingContext2D,
    W: number,
    H: number,
    speed: number,
    heel: number,
    hike: number,
    view: string
  ) => {
    ctx.save();
    // Border box
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    ctx.strokeRect(10, 10, W - 20, H - 20);

    // Coordinate grid overlay
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '9px monospace';
    ctx.fillText("CAM REF: NV-FLW-3D", 18, 24);
    ctx.fillText(`MODE: ${view.toUpperCase()}`, 18, 35);

    // Interactive compass coordinate on right corner
    ctx.fillStyle = '#00FF87';
    ctx.fillText(`GPS VEL: ${speed} kts`, W - 120, 24);
    ctx.fillStyle = '#00F0FF';
    ctx.fillText(`TRANS HEEL: ${heel}°`, W - 120, 35);
    ctx.restore();
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-white/10 flex flex-col justify-between h-[360px]" id="simulation-3d-panel">
      
      {/* Top Controls Row */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4.5 h-4.5 text-[#00F0FF]" />
          <span className="font-display font-medium text-sm text-slate-200">
            SailMotion AI 3D Skeletal Replay
          </span>
        </div>

        <div className="flex flex-wrap gap-1 bg-navy-950/80 p-1 rounded-lg border border-white/10">
          {(["behind", "top", "side", "skeleton-only"] as CameraView[]).map(viewOpt => (
            <button
              key={viewOpt}
              onClick={() => setCameraView(viewOpt)}
              className={`px-2 py-1 text-[10px] uppercase font-mono font-semibold rounded transition-colors ${
                cameraView === viewOpt 
                  ? "bg-neon-green text-navy-950 font-bold" 
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              {viewOpt === "skeleton-only" ? "Skeleton" : viewOpt}
            </button>
          ))}
        </div>
      </div>

      {/* Main Canvas Frame */}
      <div className="relative flex-1 rounded-xl overflow-hidden border border-white/5">
        <canvas 
          ref={canvasRef} 
          className="w-full h-full block cursor-crosshair"
          title="SailMotion AI Interactive 3D Canvas Projection" 
        />
        
        {/* Real-time Compass Widget overlay */}
        <div className="absolute bottom-3 right-3 bg-navy-950/90 border border-white/10 rounded-xl px-3 py-2 flex items-center gap-2 select-none shadow-lg">
          <Compass className="w-4 h-4 text-neon-green animate-spin" style={{ animationDuration: '20s' }} />
          <div className="text-right">
            <span className="text-[9px] font-mono text-slate-500 block uppercase">Tangier Bay Comp</span>
            <span className="text-[11px] font-mono text-slate-200 font-bold">AWA 038° W</span>
          </div>
        </div>
      </div>

      {/* Lower Toggle Config Controls */}
      <div className="flex items-center justify-between gap-4 mt-3 pt-2 border-t border-white/5">
        <div className="flex gap-4">
          <label className="flex items-center gap-1.5 text-xs text-slate-300 font-medium cursor-pointer">
            <input 
              type="checkbox" 
              checked={ghostMode}
              onChange={e => setGhostMode(e.target.checked)}
              className="accent-neon-green rounded bg-navy-950/80 border-white/10"
            />
            <span>Ghost Mode (Optimal Bench)</span>
          </label>
          <label className="flex items-center gap-1.5 text-xs text-slate-300 font-medium cursor-pointer">
            <input 
              type="checkbox" 
              checked={windVectors}
              onChange={e => setWindVectors(e.target.checked)}
              className="accent-neon-green rounded bg-navy-950/80 border-white/10"
            />
            <span>Apparent Wind Vectors</span>
          </label>
        </div>

        <div className="text-[10px] text-slate-500 font-mono">
          FPS: 60 | GPU Acceleration Active
        </div>
      </div>

    </div>
  );
}
