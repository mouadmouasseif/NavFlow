# Audit d’intégration IA NavFlow

| Problème | Fichier | Priorité | Solution | État |
|---|---|---:|---|---|
| Import vidéo limité au nom du fichier | `VideoAnalysisPanel.tsx` | Critique | Lecteur Blob HTML5 avec validation MIME/taille et révocation URL | Terminé |
| Squelette Canvas fictif | `VideoAnalysisPanel.tsx` | Critique | Pipeline MediaPipe séparé et overlay réel | Terminé pour le nouveau lecteur |
| Progression simulée par minuterie | `VideoAnalysisPanel.tsx` | Critique | Progression basée sur les frames parcourues | Terminé pour l’analyse réelle |
| Angles et scores statiques | Plusieurs composants | Critique | Calculs issus des landmarks, stabilité seulement avec 20 frames valides | Terminé dans le pipeline réel |
| Résultats de démonstration non isolés | `server.ts`, `App.tsx` | Haute | Badges de source et migration vers `src/data/demo` | En cours |
| Météo générée avec `Math.random` | `LiveWeatherOverlay.tsx` | Haute | Remplacer par un service météo réel ou afficher indisponible | À faire |
| Port HTTP codé en dur | `server.ts` | Haute | Variables `PORT` et `WS_PORT`, gestion `EADDRINUSE` | Terminé |
| Réponses Gemini prédéfinies ambiguës | `server.ts` | Haute | Nouvelle route Zod `/api/ai/sailing-analysis`, mode sans clé explicite | Terminé pour la nouvelle route |
| Données de sessions en mémoire | `server.ts` | Haute | Persistance IndexedDB et sauvegarde synthétique des résultats | À faire |
| Faux rapports « PDF-style » | `AnalyticsDashboard.tsx`, `AICoachChat.tsx` | Moyenne | Génération PDF réelle | À faire |

## Limites actuelles

- Le panneau historique de démonstration reste visible sous le nouveau lecteur afin de préserver le design. Il doit encore être déplacé dans un mode démonstration centralisé.
- MediaPipe analyse la posture humaine uniquement. Il ne mesure ni GPS, ni vent, ni vitesse réelle, ni VMG.
- Le modèle et le runtime MediaPipe sont chargés depuis les hébergements officiels au premier lancement.
