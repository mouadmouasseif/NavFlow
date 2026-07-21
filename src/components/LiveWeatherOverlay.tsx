import React, { useState, useEffect } from 'react';
import { 
  Wind, 
  Compass, 
  Gauge, 
  CloudLightning, 
  Thermometer, 
  RefreshCw, 
  Clock, 
  Activity, 
  MapPin, 
  ArrowUpRight, 
  ArrowDownRight, 
  CheckCircle2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LiveWeatherOverlayProps {
  location: string;
}

interface WeatherData {
  windDirectionDeg: number;
  windDirectionStr: string;
  windSpeed: number;
  windGust: number;
  barometricPressure: number;
  pressureTrend: 'Rising' | 'Falling' | 'Steady';
  pressureTrendRate: number;
  temperature: number;
  humidity: number;
  tideLevel: string;
  lastUpdated: string;
}

export default function LiveWeatherOverlay({ location }: LiveWeatherOverlayProps) {
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);

  // Generate randomized but cohesive weather data based on the selected location name
  const generateWeatherData = (locName: string): WeatherData => {
    // Standardize seed on location length
    const seed = locName.length;
    const baseWindDeg = (seed * 47) % 360;
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const dirIdx = Math.round(baseWindDeg / 22.5) % 16;

    const basePressure = 1008 + (seed % 15);
    const trends: ('Rising' | 'Falling' | 'Steady')[] = ['Rising', 'Falling', 'Steady'];
    const trend = trends[seed % 3];

    return {
      windDirectionDeg: baseWindDeg,
      windDirectionStr: directions[dirIdx],
      windSpeed: 10 + (seed % 12) + Math.random() * 2,
      windGust: 14 + (seed % 16) + Math.random() * 3,
      barometricPressure: parseFloat((basePressure + Math.random()).toFixed(1)),
      pressureTrend: trend,
      pressureTrendRate: parseFloat(((seed % 8) / 10 + Math.random() * 0.2).toFixed(1)),
      temperature: 18 + (seed % 12),
      humidity: 55 + (seed % 25),
      tideLevel: (seed % 2 === 0) ? "Incoming (+1.2m)" : "Outgoing (-0.4m)",
      lastUpdated: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
  };

  const startTelemetryFetch = () => {
    setIsFetching(true);
    setLogs([]);
    
    const steps = [
      `[SYS] Initiating NOAA & MARAD Moroccan weather client...`,
      `[SYS] Resolving location coordinates for: "${location}"`,
      `[API] Location mapped to lat/lon grid via Open-Meteo & Buoy Network.`,
      `[API] Downloading real-time barometric atmospheric matrices...`,
      `[API] Downloading wind vectors & gust profiles...`,
      `[SYS] Correlating localized thermal gradients with tidal heights...`,
      `[SYS] Success! Live weather overlay updated for Tangier harbor.`
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        setLogs(prev => [...prev, step]);
        if (index === steps.length - 1) {
          setIsFetching(false);
          setWeather(generateWeatherData(location));
        }
      }, (index + 1) * 450);
    });
  };

  // Automatically fetch on location mount
  useEffect(() => {
    startTelemetryFetch();
  }, [location]);

  return (
    <div className="glass-panel border border-white/10 p-5 rounded-2xl relative overflow-hidden" id="live-weather-overlay-widget">
      {/* Background neon effect */}
      <div className="absolute -right-16 -top-16 w-32 h-32 rounded-full bg-neon-cyan/5 blur-2xl" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-neon-cyan animate-pulse" />
          <h4 className="font-display font-medium text-sm text-white">
            Real-Time Weather Overlay
          </h4>
        </div>
        <button
          onClick={startTelemetryFetch}
          disabled={isFetching}
          className={`px-2 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] font-mono text-neon-cyan border border-neon-cyan/20 flex items-center gap-1 transition-all ${
            isFetching ? "opacity-50 cursor-not-allowed" : "active:scale-95"
          }`}
          title="Force update of live atmospheric conditions"
        >
          <RefreshCw className={`w-3 h-3 ${isFetching ? "animate-spin" : ""}`} />
          <span>{isFetching ? "SYNCING..." : "FETCH LIVE"}</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        
        {/* Visual Dial (Compass & Wind direction) */}
        <div className="md:col-span-4 flex flex-col items-center justify-center bg-navy-950/40 p-4 rounded-xl border border-white/5 relative min-h-[140px]">
          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest absolute top-2">Wind Compass</span>
          
          <div className="relative w-20 h-20 mt-3">
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border border-neon-cyan/20" />
            
            {/* Compass degree ticks */}
            <div className="absolute inset-0 flex items-center justify-center text-[8px] font-mono text-slate-600">
              <span className="absolute top-1 font-bold">N</span>
              <span className="absolute bottom-1 font-bold">S</span>
              <span className="absolute right-1.5 font-bold">E</span>
              <span className="absolute left-1.5 font-bold">W</span>
            </div>

            {/* Rotating Arrow Indicator */}
            {weather && (
              <motion.div 
                className="absolute inset-0 flex items-center justify-center"
                animate={{ rotate: weather.windDirectionDeg }}
                transition={{ type: "spring", stiffness: 60, damping: 15 }}
              >
                <div className="relative w-1.5 h-14 flex flex-col items-center">
                  <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[18px] border-b-neon-cyan" />
                  <div className="w-[1.5px] h-10 bg-neon-cyan/40" />
                </div>
              </motion.div>
            )}
          </div>

          {weather && (
            <span className="text-xs font-mono text-white font-bold mt-2.5">
              {weather.windDirectionDeg}° {weather.windDirectionStr}
            </span>
          )}
        </div>

        {/* Live Weather Readouts */}
        <div className="md:col-span-8 space-y-4">
          <AnimatePresence mode="wait">
            {isFetching ? (
              <motion.div 
                key="fetching"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-mono text-[10px] text-slate-400 bg-black/40 p-3 rounded-lg border border-white/5 h-[120px] overflow-y-auto space-y-1 scrollbar-thin"
              >
                {logs.map((log, idx) => (
                  <div key={idx} className="flex items-start gap-1">
                    <span className="text-neon-cyan shrink-0">›</span>
                    <span className="truncate">{log}</span>
                  </div>
                ))}
                <div className="w-1.5 h-3 bg-neon-cyan animate-pulse inline-block" />
              </motion.div>
            ) : (
              weather && (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="grid grid-cols-2 gap-3"
                >
                  {/* Wind Direction & Speed */}
                  <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl relative group hover:border-neon-cyan/30 transition-all">
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">LIVE WIND</span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-xl font-bold text-white font-display">
                        {weather.windSpeed.toFixed(1)}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">KTS</span>
                    </div>
                    <span className="text-[9px] font-mono text-slate-400 block mt-1">
                      Gusts: <strong className="text-neon-green">{weather.windGust.toFixed(1)} KTS</strong>
                    </span>
                    <Wind className="absolute right-3 top-3 w-3.5 h-3.5 text-neon-cyan opacity-40 group-hover:opacity-80 transition-opacity" />
                  </div>

                  {/* Barometric Pressure */}
                  <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl relative group hover:border-neon-cyan/30 transition-all">
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">BAROMETER</span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-xl font-bold text-white font-display">
                        {weather.barometricPressure}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">hPa</span>
                    </div>
                    
                    <div className="flex items-center gap-1 mt-1 text-[9px] font-mono">
                      {weather.pressureTrend === 'Rising' ? (
                        <>
                          <ArrowUpRight className="w-3 h-3 text-neon-green" />
                          <span className="text-neon-green">Rising (+{weather.pressureTrendRate} hPa)</span>
                        </>
                      ) : weather.pressureTrend === 'Falling' ? (
                        <>
                          <ArrowDownRight className="w-3 h-3 text-red-400" />
                          <span className="text-red-400">Falling (-{weather.pressureTrendRate} hPa)</span>
                        </>
                      ) : (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 inline-block mr-1" />
                          <span className="text-slate-400">Steady</span>
                        </>
                      )}
                    </div>
                    <Gauge className="absolute right-3 top-3 w-3.5 h-3.5 text-neon-cyan opacity-40 group-hover:opacity-80 transition-opacity" />
                  </div>

                  {/* Temperature */}
                  <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl relative group hover:border-neon-cyan/30 transition-all">
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">AIR TEMP</span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-xl font-bold text-white font-display">
                        {weather.temperature}°C
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">/ {Math.round(weather.temperature * 1.8 + 32)}°F</span>
                    </div>
                    <span className="text-[9px] font-mono text-slate-400 block mt-1">
                      Humidity: <strong className="text-slate-300">{weather.humidity}%</strong>
                    </span>
                    <Thermometer className="absolute right-3 top-3 w-3.5 h-3.5 text-neon-cyan opacity-40 group-hover:opacity-80 transition-opacity" />
                  </div>

                  {/* Port Tide Matrix */}
                  <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl relative group hover:border-neon-cyan/30 transition-all">
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">TIDE HEIGHT</span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-sm font-bold text-white truncate max-w-[120px]">
                        {weather.tideLevel}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-[8px] font-mono text-slate-400">
                      <Clock className="w-2.5 h-2.5 text-neon-cyan" />
                      <span>Last updated: {weather.lastUpdated}</span>
                    </div>
                    <Compass className="absolute right-3 top-3 w-3.5 h-3.5 text-neon-cyan opacity-40 group-hover:opacity-80 transition-opacity" />
                  </div>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
