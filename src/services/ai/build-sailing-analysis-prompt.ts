import type { z } from "zod";
import type { sailingAnalysisRequestSchema } from "./sailing-analysis-schema";
export type SailingAnalysisInput=z.infer<typeof sailingAnalysisRequestSchema>;
export function buildSailingAnalysisPrompt(input:SailingAnalysisInput){return `Tu es un assistant d’analyse technique en voile pour un coach. N’invente aucune mesure absente, distingue données mesurées, estimations et indisponibles, et ne fournis aucun diagnostic médical. Réponds uniquement en JSON valide dans la langue ${input.language}. Structure: {"summary":"","strengths":[],"corrections":[{"title":"","explanation":"","priority":"low|medium|high","relatedTimestamps":[]}],"exercises":[{"name":"","objective":"","instructions":""}],"nextSessionGoal":"","limitations":[]}.
Session: ${JSON.stringify(input.session)}
Mesures MediaPipe: ${JSON.stringify(input.metrics)}
Marqueurs: ${JSON.stringify(input.markers)}`.slice(0,24000)}
