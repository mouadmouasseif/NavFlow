export type AnalysisSource = "mediapipe" | "computer-vision" | "telemetry" | "manual" | "gemini" | "demo" | "unavailable";
export type AnalysisMode = "athlete" | "boat" | "trajectory" | "complete";
export type AnalysisStatus = "idle" | "loading-model" | "preparing-video" | "analyzing" | "generating-report" | "completed" | "cancelled" | "error";
export type MarkerSeverity = "info" | "warning" | "critical";
export interface NormalizedPoint { x: number; y: number; z?: number; visibility?: number }
export interface JointAngles { leftElbow?: number; rightElbow?: number; leftKnee?: number; rightKnee?: number; leftHip?: number; rightHip?: number; torsoInclination?: number; shoulderAlignment?: number }
export interface FramePoseResult { timestamp: number; detected: boolean; confidence: number; landmarks?: NormalizedPoint[]; jointAngles?: JointAngles }
export interface AnalysisMarker { id: string; timestamp: number; endTimestamp?: number; title: string; description: string; category: "body-position" | "balance" | "maneuver" | "sail-trim" | "trajectory" | "speed" | "stability" | "other"; severity: MarkerSeverity; source: AnalysisSource; confidence?: number }
export interface PostureStatistics { averageTorsoInclination?: number; torsoVariation?: number; averageLeftKneeAngle?: number; averageRightKneeAngle?: number; averageLeftElbowAngle?: number; averageRightElbowAngle?: number; bodyStabilityScore?: number; symmetryScore?: number }
export interface VideoAIAnalysisResult { id: string; sessionId: string; mode: AnalysisMode; createdAt: string; duration: number; processedFrames: number; detectedFrames: number; detectionRate: number; averageConfidence: number; posture?: PostureStatistics; frames: FramePoseResult[]; markers: AnalysisMarker[]; technicalSummary: string; limitations: string[]; sources: AnalysisSource[]; isDemo: boolean }
export interface AIAnalysisProgress { status: AnalysisStatus; currentFrame: number; totalFrames: number; percentage: number; elapsedTime: number; message: string }
