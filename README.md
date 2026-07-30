# SailMotion AI

SailMotion AI est un projet marocain d’analyse et de performance en voile, développé par Mouad Mouasseif.

## Fonctionnalités disponibles

- lecture d’une vidéo locale MP4, WebM, MOV ou M4V ;
- analyse locale de posture avec MediaPipe Pose Landmarker ;
- calcul d’angles et de statistiques issus des frames ;
- marqueurs synchronisés à la vidéo ;
- route Gemini côté serveur avec validation Zod ;
- fonctionnement sans clé Gemini avec statut explicite.

Les anciennes cartes de télémétrie et la météo sont encore des démonstrations. Elles ne doivent pas être interprétées comme des mesures réelles.

## Installation

```bash
npm install
copy .env.example .env
npm run dev
```

Ouvrir `http://localhost:3000`. La clé Gemini est facultative : `GEMINI_API_KEY=`.

## Commandes

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Confidentialité et limites

L’analyse MediaPipe reste dans le navigateur. Gemini reçoit uniquement les statistiques structurées demandées par l’utilisateur. SailMotion AI ne peut pas déduire de façon fiable la vitesse, le vent, la VMG ou la position GPS depuis une vidéo seule. Les indicateurs de posture doivent être validés par un entraîneur.

Documentation : `docs/AI_ANALYSIS_ARCHITECTURE.md` et `docs/AI_INTEGRATION_AUDIT.md`.
