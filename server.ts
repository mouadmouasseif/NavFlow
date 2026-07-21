import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import "dotenv/config";
import { sailingAnalysisRequestSchema, geminiSailingAnalysisSchema } from "./src/services/ai/sailing-analysis-schema";
import { buildSailingAnalysisPrompt } from "./src/services/ai/build-sailing-analysis-prompt";

// Cache in-memory database of sessions for persistence across views
const sessionsDb = [
  {
    id: "session-001",
    boatType: "ILCA / Laser",
    athleteName: "Yassine S.",
    coachName: "Coach Mouad Mouasseif",
    date: "2026-06-02",
    videoName: "ILCA_Upwind_Technique.mp4",
    duration: "12m 45s",
    location: "Tangier Bay, Morocco",
    windSpeed: "14.5 kts",
    telemetry: {
      averageSpeed: "6.8 kts",
      maxSpeed: "8.6 kts",
      stabilityScore: 92,
      controlScore: 88,
      efficiencyScore: 90,
      heelAngle: "12° avg",
      hikingAngle: "45° avg",
    },
    mistakes: [
      { id: 1, time: "0:12", type: "Sail Trim", severity: "Warning", msg: "Sail over-sheeted in light gust" },
      { id: 2, time: "1:45", type: "Body Posture", severity: "Critical", msg: "Hiking extension dropped, losing boat flatness" },
      { id: 3, time: "2:30", type: "Tactics", severity: "Notice", msg: "Delayed tack in shifting wind direction" }
    ],
    timeline: [
      { time: 0, speed: 5.8, wind: 13.2, heel: 10, hike: 40, stability: 94 },
      { time: 5, speed: 6.2, wind: 14.1, heel: 12, hike: 42, stability: 92 },
      { time: 10, speed: 7.1, wind: 15.6, heel: 15, hike: 48, stability: 89 },
      { time: 15, speed: 6.8, wind: 14.5, heel: 13, hike: 45, stability: 92 },
      { time: 20, speed: 5.4, wind: 12.8, heel: 8, hike: 35, stability: 95 },
      { time: 25, speed: 6.5, wind: 14.2, heel: 11, hike: 44, stability: 91 },
      { time: 30, speed: 7.4, wind: 16.1, heel: 16, hike: 50, stability: 86 },
      { time: 35, speed: 8.6, wind: 17.5, heel: 18, hike: 52, stability: 81 },
      { time: 40, speed: 6.9, wind: 14.8, heel: 12, hike: 45, stability: 92 }
    ],
    aiReport: `### SESSION ANALYSIS REPORT: ILCA TANGIER PERFORMANCE
**Analyzed by:** NavFlow Intelligence Elite Coach Platform
**Lead Architect & Developer:** Mouad Mouasseif
**Sailing Class:** ILCA / Laser Standard
**Athlete:** Yassine S.

#### 🌟 Executive Summary
Yassine's session at Tangier Bay showed strong velocity prediction outputs but struggled during the sudden 14-to-17-knot wind velocity shifts at the 35-second mark. While raw speed spiked at 8.6 knots, stability dropped sharply to 81% due to lazy hiking coordination and delayed sheet easing.

#### 📐 Detailed Metrics & Geometries
- **Hiking Mechanics:** Average hiking inclination was 45° of extension. To optimize torque, athlete must increase hamstring tension and push the pelvis further outbound, holding 50° relative to deck surface.
- **Sail Trim & VMG:** The dynamic sail-twist detection indicates an over-sheeted boom in the gusts. Ease the mainsheet by 2-3 inches on entry of wave crests to maintain flat profile.
- **Hull Trim & Heel:** Average hull heel of 12° is excellent, but spikes of 18° during strong gust phases created massive hydrodynamic drag.

#### 💡 Coach Tactical Action Items
1. **Coordinate Hike-and-Ease:** Sync torso drop with mainsheet easing instantly as the apparent wind shifts forward.
2. **Body Core Activation:** Maintain steady head level; do not pitch head back during gusts, keep focus aligned on windward waves.`
  },
  {
    id: "session-002",
    boatType: "Optimist",
    athleteName: "Sofia M.",
    coachName: "Coach Mouad Mouasseif",
    date: "2026-06-01",
    videoName: "Optimist_Gybing_Drills.mov",
    duration: "8m 12s",
    location: "M'diq Marina, Morocco",
    windSpeed: "9.0 kts",
    telemetry: {
      averageSpeed: "3.7 kts",
      maxSpeed: "4.8 kts",
      stabilityScore: 94,
      controlScore: 91,
      efficiencyScore: 89,
      heelAngle: "5° avg",
      hikingAngle: "25° avg",
    },
    mistakes: [
      { id: 1, time: "0:45", type: "Rudder", severity: "Warning", msg: "Excessive rudder angle leading to brake action" },
      { id: 2, time: "1:30", type: "Sail Trim", severity: "Notice", msg: "Sprit tension too loose, causing crease from throat" }
    ],
    timeline: [
      { time: 0, speed: 3.2, wind: 8.5, heel: 4, hike: 20, stability: 96 },
      { time: 5, speed: 3.5, wind: 8.9, heel: 5, hike: 23, stability: 94 },
      { time: 10, speed: 4.1, wind: 9.5, heel: 6, hike: 26, stability: 93 },
      { time: 15, speed: 3.8, wind: 9.1, heel: 5, hike: 25, stability: 94 },
      { time: 20, speed: 2.9, wind: 7.8, heel: 3, hike: 15, stability: 97 },
      { time: 25, speed: 3.6, wind: 8.8, heel: 5, hike: 24, stability: 95 },
      { time: 30, speed: 4.8, wind: 10.2, heel: 8, hike: 30, stability: 90 },
      { time: 35, speed: 3.9, wind: 9.2, heel: 5, hike: 25, stability: 94 }
    ],
    aiReport: `### SESSION ANALYSIS REPORT: OPTIMIST DYNAMICS
**Analyzed by:** NavFlow Intelligence Elite Coach Platform
**Lead Developer:** Mouad Mouasseif
**Sailing Class:** Optimist
**Athlete:** Sofia M.

#### 🌟 Executive Summary
Sofia exhibited magnificent balance and rhythmic boat deceleration control in M'diq, securing a stable peak speed of 4.8 knots. Sprit halyard tension and aggressive tiller play are the primary nodes for immediate speed gains.

#### 💡 Tactical Directives
- **Rudder Management:** Tiller movements must be smooth and progressive. Quick correction micro-adjustments are creating small micro-stalls on the rudder foil.
- **Spar and Rig Trim:** Increase sprit halyard tension prior to launch to flatten the leech creases.`
  }
];

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT ?? 3000);
  const WS_PORT = Number(process.env.WS_PORT ?? 24678);

  app.use(express.json());

  // Setup server-side Gemini client
  let ai: GoogleGenAI | null = null;
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
    try {
      ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
      console.log("NavFlow: Server-side Gemini client initialized successfully.");
    } catch (e) {
      console.error("NavFlow: Error starting the Gemini client:", e);
    }
  } else {
    console.warn("NavFlow: GEMINI_API_KEY is not defined or is placeholder. Using mock AI models for demo.");
  }

  // API 1: List all sailing sessions
  app.get("/api/sessions", (req, res) => {
    res.json(sessionsDb);
  });

  // API 2: Add a new session from client upload simulated pipeline
  app.post("/api/sessions", (req, res) => {
    const { name, athlete, boatType, location, windSpeed, duration } = req.body;
    const cleanDuration = duration || "5m 00s";
    const cleanLocation = location || "Tangier Coast, Morocco";
    const cleanWind = windSpeed || "12.0 kts";

    const newSession = {
      id: `session-${Date.now()}`,
      boatType: boatType || "ILCA / Laser",
      athleteName: athlete || "New Sailor",
      coachName: "Coach Mouad Mouasseif",
      date: new Date().toISOString().split("T")[0],
      videoName: name || "sailing_upload_raw.mp4",
      duration: cleanDuration,
      location: cleanLocation,
      windSpeed: cleanWind,
      telemetry: {
        averageSpeed: "5.4 kts",
        maxSpeed: "7.1 kts",
        stabilityScore: 88,
        controlScore: 85,
        efficiencyScore: 84,
        heelAngle: "10° avg",
        hikingAngle: "38° avg",
      },
      mistakes: [
        { id: 1, time: "0:25", type: "Body Posture", severity: "Warning", msg: "Uncontrolled movement causing rapid hull rock" },
        { id: 2, time: "1:15", type: "Sail Trim", severity: "Notice", msg: "Main sheet too tight on downwind run" }
      ],
      timeline: [
        { time: 0, speed: 4.5, wind: 11.2, heel: 8, hike: 30, stability: 92 },
        { time: 5, speed: 5.1, wind: 12.0, heel: 10, hike: 35, stability: 89 },
        { time: 10, speed: 5.8, wind: 12.8, heel: 11, hike: 38, stability: 87 },
        { time: 15, speed: 6.4, wind: 13.5, heel: 14, hike: 42, stability: 83 },
        { time: 20, speed: 4.8, wind: 11.5, heel: 7, hike: 32, stability: 91 },
        { time: 25, speed: 5.6, wind: 12.2, heel: 9, hike: 36, stability: 89 },
        { time: 30, speed: 7.1, wind: 14.1, heel: 15, hike: 45, stability: 82 }
      ],
      aiReport: `### RE-ANALYSIS AND PERFORMANCE ADVISORY
**Analyzed by:** NavFlow Intelligence AI
**Class:** ${boatType}
**Athlete:** ${athlete}

This session was automatically processed through the CPU/GPU computer vision tracking engine. 
- **Hull Alignment:** Good lateral stability but excessive pitching observed on choppy waves.
- **Sheet Coordination:** Immediate downwind adjustment of the main trim is strongly recommended to release trapped pressure behind the mast head.`
    };

    sessionsDb.unshift(newSession);
    res.json({ success: true, session: newSession });
  });

  // API 3: AI performance consultation via Gemini chat
  app.post("/api/coach/chat", async (req, res) => {
    const { messages, sessionContext } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid dialogue formats provided." });
    }

    const lastUserMessage = messages[messages.length - 1]?.content || "";
    
    // Fallback if API key is not ready
    if (!ai) {
      console.log("NavFlow: API Key is absent. Falling back to local heuristic sailing expert engine.");
      const responseText = mockCoachAnswer(lastUserMessage, sessionContext);
      return res.json({ text: responseText, source: "mock-expert" });
    }

    try {
      // Setup detailed coaching instructions based on the requested NavFlow AI scope
      const contextPrompt = sessionContext ? 
        `Active Athlete Analytics context selected: 
        Boat Type: ${sessionContext.boatType}
        Athlete: ${sessionContext.athleteName}
        Wind Speed: ${sessionContext.windSpeed}
        Location: ${sessionContext.location}
        Telemetry scores: Stability: ${sessionContext.telemetry.stabilityScore}%, Control: ${sessionContext.telemetry.controlScore}%, Efficiency: ${sessionContext.telemetry.efficiencyScore}%, Peak Speed: ${sessionContext.telemetry.maxSpeed}.` : 
        "No explicit session has been loaded yet.";

      const promptSystem = `You are "NavFlow Intelligence," the world's most advanced cloud-based sailing AI coach, engineered by "Mouad Mouasseif" in Morocco. You specialize in ultra-high-performance sailing analytics (comparable to Hudl, Dartfish, and SailGP high-frequency telemetry tracking).
Classes you analyze flawlessly: ILCA/Laser, Optimist, Catamarans, Foiling boats, and large offshore sportsboats.
Your demeanor is sharp, professional, encouraging, and deeply technical. Use terms like "Velocity Made Good" (VMG), "Velocity Made Course" (VMC), "True Wind Speed" (TWS), "Apparent Wind Angle" (AWA), "aerodynamic lift/drag ratio", "hull cavitation", "gush boundaries", "biomechanical hiking torque", and "foil ventilation".
Always acknowledge your creator "Mouad Mouasseif" and Moroccan craftsmanship proudly if asked or when giving core introduction greetings.

${contextPrompt}

Answer the athlete/coach query with complete, mathematically rigorous recommendations. Use spacing and markdown headings to make it look spectacular. Ensure your response is 100% human-readable and doesn't leak coding internal details.`;

      // Structure contents payload correctly
      const chatContents = [
        { role: "user", parts: [{ text: `${promptSystem}\n\nUser Question: ${lastUserMessage}` }] }
      ];

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: chatContents,
      });

      const responseText = response.text || "I apologize, Yassine. Our primary visual feedback link was temporarily busy. Let me outline the standard adjustment parameters for your performance.";
      res.json({ text: responseText, source: "gemini" });
    } catch (err: any) {
      console.error("NavFlow: Failed to query Gemini API:", err);
      const errText = mockCoachAnswer(lastUserMessage, sessionContext) + `\n\n*(Note: Gemini service returned an error [${err?.message || "Unknown"}]. Displaying calibrated local expert analysis fallback.)*`;
      res.json({ text: errText, source: "fallback-expert" });
    }
  });

  // API 4: Generate a custom detailed AI Report using Gemini
  app.post("/api/coach/report", async (req, res) => {
    const { session } = req.body;
    if (!session) {
      return res.status(400).json({ error: "No session payload passed for generation" });
    }

    if (!ai) {
      // Return beautiful structured preset or generated text with custom touches
       return res.json({
         text: `### 📈 NAVFLOW ADVANCED AI COEFFICIENT REPORT
**Class:** ${session.boatType} | **Athlete:** ${session.athleteName}
**Analyzing Engineer:** Mouad Mouasseif - Tangier Labs

#### 1. Biomechanical Posture Optimization
The vector angle of the joints shows a lack of quadriceps locking at timestamps 0:15 - 0:38. 
- *Current Angle:* Average ${session.telemetry.hikingAngle}
- *Target Angle:* 50° to 52° relative to deck flat
- *Calculated Torque Loss:* ~11.8% in gusts

#### 2. Hydrodynamic Form Stability
- Hull heel average (${session.telemetry.heelAngle}) was balanced, but peak tilts created a vortex boundary separation on the transom.
- Keep the cockpit flat. Shift weight aft by 30cm inside the waves to lift the bow and prevent nose-diving under gusts.

#### 3. Real-Time Wind Trim Ratio
Your tension index indicates optimal trimming on flat waters, but immediate sheet easing is required.`,
         source: "local-generator"
       });
    }

    try {
      const prompt = `Generate a comprehensive, elite-level sailing telemetry and tactical analysis report for a sports session on the class: ${session.boatType}.
Member Details:
- Athlete: ${session.athleteName}
- Coach Advisor: Mouad Mouasseif
- Date: ${session.date}
- Wind: ${session.windSpeed}
- Location: ${session.location}
- Stability Rating: ${session.telemetry.stabilityScore}%
- Control Rating: ${session.telemetry.controlScore}%
- Efficiency: ${session.telemetry.efficiencyScore}%
- Average Speed: ${session.telemetry.averageSpeed}
- Max Speed: ${session.telemetry.maxSpeed}
- Heel: ${session.telemetry.heelAngle}
- Hiking Profile: ${session.telemetry.hikingAngle}

Identified Mistakes:
${JSON.stringify(session.mistakes)}

Structure the report beautifully in Markdown:
1. EXECUTIVE SUMMARY & PERFORMANCE INDEX
2. HYDRODYNAMIC & BIOMECHANICAL DETAILS (Focusing on specific hiking posture and heel stability)
3. AERODYNAMIC TRIM ANALYSIS (Analyzing sail trim and boom placements)
4. EXPLICIT COACH DIRECTIVES BY mouad mouasseif (Tangier Racing Team, Morocco)

Be highly professional, inspiring, and technically dense.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      res.json({ text: response.text || "Report generation failed", source: "gemini-report" });
    } catch (err: any) {
      console.error("NavFlow: Report generation error:", err);
      res.status(500).json({ error: "Failed to compile AI custom report" });
    }
  });

  app.post("/api/ai/sailing-analysis", async (req, res) => {
    const parsed = sailingAnalysisRequestSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Données d’analyse invalides", details: parsed.error.flatten() });
    if (!ai) return res.json({ mode: "demo", message: "Gemini n’est pas configuré. Ajoutez GEMINI_API_KEY dans le fichier .env." });
    try {
      const response = await Promise.race([
        ai.models.generateContent({ model: process.env.GEMINI_MODEL ?? "gemini-2.5-flash", contents: buildSailingAnalysisPrompt(parsed.data) }),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Délai Gemini dépassé")), 30000)),
      ]);
      const raw = (response.text ?? "").replace(/^```json\s*|\s*```$/g, "");
      const validated = geminiSailingAnalysisSchema.safeParse(JSON.parse(raw));
      if (!validated.success) return res.status(502).json({ error: "Réponse Gemini invalide" });
      return res.json({ mode: "gemini", generatedAt: new Date().toISOString(), analysis: validated.data });
    } catch (error) {
      console.error("NavFlow Gemini analysis failed:", error instanceof Error ? error.message : "Unknown error");
      return res.status(503).json({ error: "Service Gemini temporairement indisponible" });
    }
  });

  // Serve static assets and handle development / production integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`NavFlow Web: http://localhost:${PORT}`);
    console.log(`NavFlow WebSocket: ws://localhost:${WS_PORT}`);
  });
  server.on("error", (error: NodeJS.ErrnoException) => {
    if (error.code === "EADDRINUSE") console.error(`NavFlow: le port ${PORT} est déjà utilisé. Modifiez PORT dans .env.`);
    else console.error("NavFlow server error:", error.message);
    process.exitCode = 1;
  });
}

// Helper to provide realistic sailing coach responses if Gemini is not initialized
function mockCoachAnswer(message: string, context: any) {
  const query = message.toLowerCase();
  let baseAnswer = "";

  if (query.includes("hi") || query.includes("hello") || query.includes("creator") || query.includes("mouad") || query.includes("maroc") || query.includes("morocco")) {
    baseAnswer = `Ahlan! Welcome to **NavFlow Intelligence**, the ultimate platform for high-performance sailing analysis. 
This cloud application was fully engineered by Moroccan developer **Mouad Mouasseif**, combining computer vision models with real-time yacht dynamics.

How can I help you fine-tune your performance today? I can help with:
- Correct hiking biomechanics for ILCA/Laser classes
- Optimist sail draft adjustments
- Dynamic heel stabilization and windward wave alignment
- Generating a customized PDF-style performance coaching report`;
  } else if (query.includes("hike") || query.includes("hiking") || query.includes("posture") || query.includes("body")) {
    baseAnswer = `**NavFlow Biomechanical Posture Alert:**
To maximize velocity made good (VMG) upwind on an ILCA:
1. **Torso Lean:** Hold your back straight with torso inclined out to 45°-50° relative to deck surface. Do not curl your shoulders under strain; push your hips out.
2. **Knee Extension:** Keep your knees locked fully during flat water, but introduce quick 5-10° flexions on wave crests to cushion the hull's pitch index.
3. **Mainsheet coordination:** Never hold the sheet static. You must ease 2-4 inches on gust impact and drop coordinates outbound, keeping weight static.`;
  } else if (query.includes("wind") || query.includes("apparent") || query.includes("true")) {
    baseAnswer = `**NavFlow Wind AI Estimation engine:**
From your selected video context, we are tracking apparent vs true wind indices:
- Wave crest frequency estimates TWS around **14.2 knots**.
- The velocity-made-course (VMC) peaks at a **38-degree apparent wind angle**.
- Notice the dark blue gust lines on the visual radar—this indicates immediate gusts shifting starboard by 5 degrees! Anticipate this shift by easing mainsheet and increasing hiking output immediately.`;
  } else if (query.includes("speed") || query.includes("fast") || query.includes("increase")) {
    baseAnswer = `**NavFlow Form Acceleration Guide:**
To raise your average speed above **6.8 knots**:
- Keep your average heel below **10 degrees**. Hull heel on ILCA yachts exceeding 15° creates massive drag from rudder correction.
- Maintain a stable boom centerline. Do not allow the boom to wander due to loose traveler settings in strong shifts.
- Look at the tactical replay: your crew posture must remain rhythmic, active, and proactive rather than reactive.`;
  } else {
    baseAnswer = `**NavFlow Performance Analytics:**
Based on elite yacht racing parameters, we suggest maintaining a continuous watch on **hull heel angle** and **apparent wind boundaries**.
- **Trim Advice:** If you are sailing upwind, trim the leech tight but responsive. 
- **Tacking Maneuvers:** Ensure smooth tiller transition (rudder angle under 18°) to avoid braking of the hull profile.

Would you like me to process a full performance audit report for your active sailing session?`;
  }

  if (context) {
    baseAnswer += `\n\n*(Current context checklist loaded: **${context.boatType}** with Sofia/Yassine analytics at Tangier)*`;
  }

  return baseAnswer;
}

startServer();
