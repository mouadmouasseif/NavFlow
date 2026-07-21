import { FilesetResolver, PoseLandmarker } from "@mediapipe/tasks-vision";
import { calculateFrameJointAngles, calculatePoseConfidence } from "../../lib/analysis/pose-calculations";
import type { FramePoseResult, NormalizedPoint } from "../../types/ai-analysis";

class PoseLandmarkerService {
  private landmarker: PoseLandmarker | null = null;
  private loadingPromise: Promise<void> | null = null;
  async initialize(): Promise<void> {
    if (this.landmarker) return;
    if (typeof window === "undefined" || typeof WebAssembly === "undefined") throw new Error("Ce navigateur ne prend pas en charge WebAssembly.");
    if (!this.loadingPromise) this.loadingPromise = (async () => {
      const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm");
      this.landmarker = await PoseLandmarker.createFromOptions(vision, { baseOptions: { modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task", delegate: "GPU" }, runningMode: "VIDEO", numPoses: 1, minPoseDetectionConfidence: .55, minTrackingConfidence: .55 });
    })().catch(error => { this.loadingPromise=null; throw new Error(`Impossible de charger MediaPipe : ${error instanceof Error?error.message:String(error)}`); });
    return this.loadingPromise;
  }
  async detectVideoFrame(video: HTMLVideoElement, timestampMs: number): Promise<FramePoseResult> {
    await this.initialize();
    if (!this.landmarker) throw new Error("MediaPipe n’est pas initialisé.");
    const result=this.landmarker.detectForVideo(video,timestampMs); const landmarks=(result.landmarks[0]??[]) as NormalizedPoint[];
    if(!landmarks.length)return{timestamp:timestampMs/1000,detected:false,confidence:0};
    return{timestamp:timestampMs/1000,detected:true,confidence:calculatePoseConfidence(landmarks),landmarks,jointAngles:calculateFrameJointAngles(landmarks)};
  }
  dispose(){this.landmarker?.close();this.landmarker=null;this.loadingPromise=null;}
}
export const poseLandmarkerService=new PoseLandmarkerService();
