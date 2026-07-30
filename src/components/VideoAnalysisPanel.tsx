import React, { useState, useEffect, useRef } from 'react';
import { SailingSession, Mistake, VideoPreset } from '../types';
import { Play, Pause, RotateCcw, Video, Radio, ShieldCheck, AlertCircle, Sparkles, Upload, Activity, Compass, Wind } from 'lucide-react';
import NavFlowAIAnalyzer from './video/NavFlowAIAnalyzer';

interface VideoAnalysisPanelProps {
  session: SailingSession;
  isPlaying: boolean;
  onPlayToggle: (playing: boolean) => void;
  currentTimePct: number;
  onTimeUpdate: (pct: number) => void;
  onScrubMistake: (timeStr: string) => void;
  onUploadProcessed?: (fileName: string, boatType: string, cameraPosition: string) => void;
}

const PRESET_VIDEOS: VideoPreset[] = [
  { id: "drone-01", title: "Starboard Drone Track", cameraPosition: "Drone / Aerial", boatType: "ILCA / Laser", url: "", windDesc: "14-16 kts chopping" },
  { id: "mast-02", title: "Masthead Sailor Motion", cameraPosition: "Mast Camera", boatType: "Optimist", url: "", windDesc: "8-10 kts light wind" },
  { id: "side-03", title: "Offshore Hull Plane", cameraPosition: "Side Camera", boatType: "Catamaran", url: "", windDesc: "18-22 kts strong breeze" },
  { id: "onboard-04", title: "Onboard Rigging Trim", cameraPosition: "Attached Onboard", boatType: "Foiling Moth", url: "", windDesc: "12 kts foiling range" }
];

export default function VideoAnalysisPanel({
  session,
  isPlaying,
  onPlayToggle,
  currentTimePct,
  onTimeUpdate,
  onScrubMistake,
  onUploadProcessed,
}: VideoAnalysisPanelProps) {
  const [selectedVideo, setSelectedVideo] = useState<VideoPreset>(PRESET_VIDEOS[0]);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isHoveringDrop, setIsHoveringDrop] = useState<boolean>(false);
  const [isProcessingFile, setIsProcessingFile] = useState<boolean>(false);
  const [processedFileName, setProcessedFileName] = useState<string>("");
  const [showWindOverlay, setShowWindOverlay] = useState<boolean>(true);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto progression of simulated timestamp
  useEffect(() => {
    if (isPlaying) {
      const intervalDelay = 100 / (20 * playbackSpeed); // progress step adjustment
      timerRef.current = setInterval(() => {
        onTimeUpdate((currentTimePct + 0.5) % 100);
      }, 50);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentTimePct, playbackSpeed]);

  // Canvas renderer simulating video frame analytics
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set DPI Scaling
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    const W = rect.width;
    const H = rect.height;

    // Clear and draw mock live background video frame
    ctx.fillStyle = '#060a13';
    ctx.fillRect(0, 0, W, H);

    // Draw grid sky/sea lines to simulate outdoor horizon
    const skyHeight = H * 0.42;
    // Blue ocean gradient
    const oceanGrad = ctx.createLinearGradient(0, skyHeight, 0, H);
    oceanGrad.addColorStop(0, '#0f1d39');
    oceanGrad.addColorStop(1, '#050a14');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, skyHeight, W, H - skyHeight);

    // Drawing the sky with clouds or sun
    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, W, skyHeight);

    const waveOffset = (currentTimePct * 5) % 100;
    ctx.strokeStyle = '#00F0FF';
    ctx.lineWidth = 1;
    // Draw waves representing real-time sea state index (chopping vs flat)
    ctx.beginPath();
    ctx.moveTo(0, skyHeight);
    for (let x = 0; x < W; x += 15) {
      const yStr = skyHeight + Math.sin((x + waveOffset) * 0.03) * 6;
      ctx.lineTo(x, yStr);
    }
    ctx.stroke();

    // Render Sailing Hull and Mast dependent on video preset selection
    ctx.save();
    ctx.translate(W * 0.5, H * 0.52);

    // Dynamically rock/pitch boat according to timeline coordinate metrics
    const heelRotation = Math.sin(currentTimePct * 0.2) * 5;
    ctx.rotate((heelRotation * Math.PI) / 180);

    // Hull base outline
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#00FF87';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-70, 10);
    ctx.lineTo(50, 10);
    ctx.quadraticCurveTo(70, 0, 75, -15); // bow outline
    ctx.lineTo(65, 10);
    ctx.quadraticCurveTo(20, 20, -70, 18);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Mast
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(10, 10);
    ctx.lineTo(12, -90);
    ctx.stroke();

    // Sail
    ctx.fillStyle = 'rgba(0, 240, 255, 0.12)';
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.7)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(12, -85);
    ctx.quadraticCurveTo(-15, -30, -50, 5); // sail edge curve
    ctx.lineTo(11, 5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // AI Skeleton dots overlay (athlete coordinate tracking)
    const ratio = Math.abs(Math.sin(currentTimePct * 0.1));
    const ankleY = 6;
    const kneeX = -20, kneeY = -5;
    const hipX = -35 - (18 * ratio), hipY = -2;
    const shX = hipX - 15, shY = hipY - 20;
    const hdX = shX + 1, hdY = shY - 10;

    // Draw bone links
    ctx.strokeStyle = '#FF5252';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-5, ankleY);
    ctx.lineTo(kneeX, kneeY);
    ctx.lineTo(hipX, hipY);
    ctx.lineTo(shX, shY);
    ctx.stroke();

    // Draw active tracker node joints circles
    const joints = [
      { x: -5, y: ankleY, label: "Ankle" },
      { x: kneeX, y: kneeY, label: "Knee" },
      { x: hipX, y: hipY, label: "Hip 45°" },
      { x: shX, y: shY, label: "Shoulder" }
    ];

    joints.forEach(j => {
      ctx.fillStyle = '#FF5252';
      ctx.beginPath();
      ctx.arc(j.x, j.y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      // Label coordinate vector values in futuristic cyan
      ctx.fillStyle = '#00F0FF';
      ctx.font = '8px monospace';
      ctx.fillText(j.label, j.x + 6, j.y + 2);
    });

    // Draw Head tracking boundaries
    ctx.fillStyle = '#00FF87';
    ctx.beginPath();
    ctx.arc(hdX, hdY, 5.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    // Head tag box
    ctx.strokeStyle = '#00FF87';
    ctx.strokeRect(hdX - 9, hdY - 9, 18, 18);

    ctx.restore();

    // HUD overlays
    if (showWindOverlay) {
      // Extract active timeline wind speed or session string
      const timelineIdx = Math.min(
        Math.floor((currentTimePct / 100) * (session.timeline?.length || 1)),
        (session.timeline?.length || 1) - 1
      );
      const activeWindValue = session.timeline?.[timelineIdx]?.wind || parseFloat(session.windSpeed) || 12;

      ctx.save();
      ctx.translate(55, 55);
      
      // Outer circular compass ring
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, 32, 0, Math.PI * 2);
      ctx.stroke();

      // Degree increments ticks
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      for (let d = 0; d < 360; d += 45) {
        const rad = d * Math.PI / 180;
        ctx.beginPath();
        ctx.moveTo(Math.cos(rad) * 26, Math.sin(rad) * 26);
        ctx.lineTo(Math.cos(rad) * 32, Math.sin(rad) * 32);
        ctx.stroke();
      }

      // Rotating vector overlay based on timeline wind & speed fluctuations
      const windAngleOffset = Math.sin(currentTimePct * 0.08) * 0.2; // slight wind direction shifts
      ctx.rotate((20 * Math.PI / 180) + windAngleOffset); // offset by 20 deg baseline

      // Elegant neon wind arrow
      ctx.strokeStyle = '#00FF87';
      ctx.fillStyle = '#00FF87';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, 22);
      ctx.lineTo(0, -22);
      ctx.lineTo(-6, -14);
      ctx.moveTo(0, -22);
      ctx.lineTo(6, -14);
      ctx.stroke();
      
      ctx.restore();

      // Readout stats panel
      ctx.fillStyle = '#00FF87';
      ctx.font = 'bold 9px monospace';
      ctx.fillText(`${activeWindValue.toFixed(1)} KTS TWS`, 15, 102);

      ctx.fillStyle = '#00F0FF';
      ctx.font = '8px monospace';
      ctx.fillText("APPARENT WIND DATA", 15, 114);
    } else {
      // Drawn tiny disabled icon/indicator
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.font = '8px monospace';
      ctx.fillText("WIND INDICATOR: OFF", 15, 20);
    }

    // Calibration box overlay
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.strokeRect(W - 120, 20, 100, 30);
    ctx.fillStyle = '#ffffff';
    ctx.font = '8px monospace';
    ctx.fillText("CALIBRATION: PASSED", W - 114, 32);
    ctx.fillStyle = '#00F0FF';
    ctx.fillText("ENG: SAILMOTION-CV", W - 114, 42);

  }, [currentTimePct, selectedVideo, showWindOverlay, session]);

  // Drag and drop video parsing simulation handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsHoveringDrop(true);
  };

  const handleDragLeave = () => {
    setIsHoveringDrop(false);
  };

  const handleDropForm = (e: React.DragEvent) => {
    e.preventDefault();
    setIsHoveringDrop(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      triggerSimulateProcess(file.name);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleManualUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      triggerSimulateProcess(file.name);
    }
  };

  const triggerSimulateProcess = (fileName: string) => {
    setIsProcessingFile(true);
    setProcessedFileName(fileName);
    setTimeout(() => {
      setIsProcessingFile(false);
      
      const nameLower = fileName.toLowerCase();
      // Auto Camera Angle Detection
      let detectedCamera = PRESET_VIDEOS[0]; // defaults to Drone
      if (nameLower.includes("mast")) {
        detectedCamera = PRESET_VIDEOS[1]; // Masthead
      } else if (nameLower.includes("side") || nameLower.includes("hull")) {
        detectedCamera = PRESET_VIDEOS[2]; // Side Cam
      } else if (nameLower.includes("onboard") || nameLower.includes("rig") || nameLower.includes("atach") || nameLower.includes("harness")) {
        detectedCamera = PRESET_VIDEOS[3]; // Attached Onboard
      }

      // Auto Boat Type Detection mapping
      let detectedBoatType = "ILCA / Laser";
      if (nameLower.includes("moth") || nameLower.includes("foil") || nameLower.includes("fly")) {
        detectedBoatType = "Foiling Moth";
      } else if (nameLower.includes("opti")) {
        detectedBoatType = "Optimist";
      } else if (nameLower.includes("cat") || nameLower.includes("nacra")) {
        detectedBoatType = "Catamaran";
      }

      // 1. Instantly select the auto-detected camera preset
      setSelectedVideo(detectedCamera);
      
      // 2. Instantly start playing the tracking overlay feedback
      onPlayToggle(true);

      // 3. Inform parent database/state processor
      if (onUploadProcessed) {
        onUploadProcessed(fileName, detectedBoatType, detectedCamera.cameraPosition);
      }
    }, 2200);
  };

  const selectPredefinedCamera = (video: VideoPreset) => {
    setSelectedVideo(video);
  };

  return (
    <div className="glass-panel overflow-hidden border border-white/10 rounded-2xl flex flex-col justify-between" id="video-analytics-board">
      <div className="p-4 pb-0">
        <NavFlowAIAnalyzer sessionId={session.id} />
      </div>
      
      {/* 1. Header Toolbar */}
      <div className="bg-navy-950/80 px-5 py-4 border-b border-white/5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-rose-500">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#00F0FF] block">
              Active Computer Vision Link
            </span>
            <h3 className="font-display font-medium text-lg text-white">
              SailMotion Dynamic Video Overlay
            </h3>
          </div>
        </div>

        {/* Selected Preset Selector */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto py-1">
          {PRESET_VIDEOS.map(vid => (
            <button
              key={vid.id}
              onClick={() => selectPredefinedCamera(vid)}
              className={`px-3 py-1.5 text-xs font-mono font-medium rounded-lg transition-all ${
                selectedVideo.id === vid.id 
                  ? "bg-red-500/20 text-rose-300 border border-red-500/50 font-bold" 
                  : "bg-white/5 text-slate-400 hover:text-slate-200"
              }`}
            >
              {vid.cameraPosition}
            </button>
          ))}
          <span className="w-px h-5 bg-white/10 mx-1.5 hidden sm:inline" />
          <button
            onClick={() => setShowWindOverlay(!showWindOverlay)}
            className={`px-2.5 py-1.5 text-xs font-mono font-semibold rounded-lg border transition-all flex items-center gap-1.5 shrink-0 ${
              showWindOverlay 
                ? "bg-neon-green/10 text-neon-green border-neon-green/30 shadow-md shadow-neon-green/10" 
                : "bg-white/5 border-white/5 text-slate-400 hover:text-slate-200"
            }`}
            title="Toggle high contrast wind dial overlay"
          >
            <Wind className="w-3.5 h-3.5" />
            <span>VENT HUD</span>
          </button>
        </div>
      </div>

      {/* 2. Drag & Drop parsing + Live Canvas simulation section */}
      <div className="relative">
        {isProcessingFile ? (
          <div className="absolute inset-0 z-20 bg-navy-950/90 flex flex-col items-center justify-center text-center p-6 text-white">
            <div className="w-12 h-12 rounded-full border-2 border-neon-green border-t-transparent animate-spin mb-4" />
            <Sparkles className="w-8 h-8 text-neon-green animate-bounce mb-2" />
            <h4 className="font-display font-bold text-lg text-neon-green">SailMotion AI Neural Sailing Analyzer</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
              Synthesizing apparent wind Shifts and joint coordinates on: <span className="font-mono text-white block">{processedFileName}</span>
            </p>
          </div>
        ) : isHoveringDrop ? (
          <div className="absolute inset-0 z-20 bg-neon-green/10 border-2 border-dashed border-neon-green flex flex-col items-center justify-center text-center text-white pointer-events-none">
            <Upload className="w-12 h-12 text-neon-green animate-bounce mb-3" />
            <h4 className="font-display font-bold text-lg text-neon-green">Drop Sailing Workout Video Here</h4>
            <p className="text-xs text-slate-300 mt-1">Accepts MP4, MOV, AVI up to 30 mins</p>
          </div>
        ) : null}

        <div 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDropForm}
          className="relative aspect-video w-full rounded-b-none border-b border-white/5"
        >
          <canvas ref={canvasRef} className="w-full h-full block cursor-crosshair" />

          {/* Floating telemetry metrics badge */}
          <div className="absolute bottom-4 left-4 bg-navy-950/80 border border-white/10 rounded-xl px-4 py-3 select-none flex gap-6 shrink-0 shadow-xl backdrop-blur-md">
            <div>
              <span className="text-[10px] font-mono text-slate-500 block uppercase">Wind Speed</span>
              <span className="text-sm font-bold text-white font-mono flex items-center gap-1.5 mt-0.5">
                <Wind className="w-3.5 h-3.5 text-neon-green" />
                {selectedVideo.windDesc}
              </span>
            </div>
            <div className="w-px bg-white/10" />
            <div>
              <span className="text-[10px] font-mono text-slate-500 block uppercase">Detected Vessel</span>
              <span className="text-sm font-bold text-white font-mono flex items-center gap-1.5 mt-0.5">
                <Compass className="w-3.5 h-3.5 text-[#00F0FF]" />
                {selectedVideo.boatType}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Drag and Drop triggers footer */}
      <div className="bg-navy-950/40 p-4 border-b border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-slate-400">
          Or upload custom video manually to test SailMotion Intelligence parsing layers:
        </p>
        <div>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload Video File
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleManualUpload} 
            accept="video/mp4,video/quicktime,video/x-msvideo" 
            className="hidden" 
          />
        </div>
      </div>

      {/* 4. Controls toolbar */}
      <div className="p-5 flex flex-col gap-4">
        {/* Timeline Slider with visual mistake zones marked below */}
        <div>
          <div className="flex items-center justify-between mb-1 text-slate-400 font-mono text-xs">
            <span>Video Time Frame Scrubber</span>
            <span>{Math.floor((currentTimePct / 100) * 120)}s / 120s</span>
          </div>

          <div className="relative pt-1.5">
            <input
              type="range"
              min="0"
              max="100"
              value={currentTimePct}
              onChange={(e) => onTimeUpdate(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-navy-950 border border-white/10 rounded-lg appearance-none cursor-pointer accent-neon-green"
            />
            {/* Mistake highlights on timing track */}
            <div className="absolute inset-x-0 bottom-[-18px] h-2 pointer-events-none">
              <div className="absolute left-[10%] w-2 h-2 rounded-full bg-orange-500" title="Sail trim mistake @ 0:12" />
              <div className="absolute left-[50%] w-2 h-2 rounded-full bg-red-500" title="Body Posture warning @ 1:45" />
              <div className="absolute left-[75%] w-2 h-2 rounded-full bg-amber-500" title="Delayed tack timing @ 2:30" />
            </div>
          </div>
        </div>

        {/* Playback action items & Mistake highlights feed */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mt-2">
          {/* Play/Pause Buttons & Rate toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onPlayToggle(!isPlaying)}
              className="w-10 h-10 bg-neon-green text-navy-950 font-bold hover:bg-neon-green/90 rounded-full flex items-center justify-center shadow-lg transition"
            >
              {isPlaying ? <Pause className="w-4.5 h-4.5 text-navy-950" /> : <Play className="w-4.5 h-4.5 text-navy-950 fill-navy-950" />}
            </button>
            <button
              onClick={() => onTimeUpdate(0)}
              className="p-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-slate-300 transition-colors"
              title="Rewind video to start"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <span className="w-px h-6 bg-white/10" />

            <div className="flex gap-1.5">
              {[0.5, 1.0, 2.0].map(speed => (
                <button
                  key={speed}
                  onClick={() => setPlaybackSpeed(speed)}
                  className={`px-2 py-1 text-[10px] font-mono font-semibold rounded-lg ${
                    playbackSpeed === speed 
                      ? "bg-white/15 text-white font-bold" 
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>

          {/* Direct Scrubber triggers list */}
          <div className="flex flex-wrap gap-2">
            {session.mistakes.map(mk => (
              <button
                key={mk.id}
                onClick={() => onScrubMistake(mk.time)}
                className="px-2.5 py-1.5 bg-red-950/40 text-rose-300 hover:bg-red-900/40 rounded-xl text-xs border border-red-950 font-medium flex items-center gap-1.5 transition"
              >
                <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                <span>Fix {mk.type} ({mk.time})</span>
              </button>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
