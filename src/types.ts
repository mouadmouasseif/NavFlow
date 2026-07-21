export interface TelemetryMetrics {
  averageSpeed: string;
  maxSpeed: string;
  stabilityScore: number;
  controlScore: number;
  efficiencyScore: number;
  heelAngle: string;
  hikingAngle: string;
}

export interface Mistake {
  id: number;
  time: string;
  type: string;
  severity: "Warning" | "Critical" | "Notice";
  msg: string;
}

export interface TimelineData {
  time: number;
  speed: number;
  wind: number;
  heel: number;
  hike: number;
  stability: number;
}

export interface SailingSession {
  id: string;
  boatType: string;
  athleteName: string;
  coachName: string;
  date: string;
  videoName: string;
  duration: string;
  location: string;
  windSpeed: string;
  telemetry: TelemetryMetrics;
  mistakes: Mistake[];
  timeline: TimelineData[];
  aiReport?: string;
  isCustom?: boolean;
}

export interface Message {
  id: string;
  role: "user" | "model" | "system";
  content: string;
  timestamp: string;
}

export type PlatformView = "desktop" | "web" | "mobile";

export interface VideoPreset {
  id: string;
  title: string;
  cameraPosition: string;
  boatType: string;
  url: string; // simulated url / mock id
  windDesc: string;
}
