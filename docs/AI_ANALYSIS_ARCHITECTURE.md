# Architecture d’analyse IA NavFlow

## Pipeline local

1. Validation du type MIME et de la limite de 500 Mo.
2. Création d’une URL Blob locale et lecture par le navigateur.
3. Chargement unique de MediaPipe Pose Landmarker en mode `VIDEO`.
4. Parcours de la vidéo à 3, 8 ou 12 FPS, avec annulation possible.
5. Calcul des angles des coudes, genoux, hanches, tronc et épaules.
6. Agrégation des moyennes, variations, symétrie et confiance.
7. Création de marqueurs techniques à partir de seuils documentés.
8. Affichage du squelette et des résultats avec leur source.

L’analyse est exécutée dans le navigateur : la vidéo n’est pas envoyée au serveur. Le lecteur restaure sa position après analyse et l’URL Blob est révoquée au changement ou au démontage.

## Gemini

La route Express `POST /api/ai/sailing-analysis` accepte uniquement un résumé JSON validé par Zod. La vidéo et les images personnelles ne sont pas envoyées. La clé `GEMINI_API_KEY` reste côté serveur. Sans clé, la route retourne explicitement `mode: demo` et n’affirme pas avoir contacté Gemini.

## Sources et limites

- `mediapipe` : posture et points corporels visibles.
- `gemini` : interprétation textuelle des statistiques transmises.
- `demo` : contenu fictif identifié comme tel.
- GPS, vitesse, vent et VMG sont indisponibles sans télémétrie externe.
- Les indicateurs ne constituent pas un diagnostic médical et doivent être confirmés par un entraîneur qualifié.

## Configuration

Voir `.env.example`. Les réglages principaux sont `PORT`, `WS_PORT`, `GEMINI_API_KEY`, `AI_ANALYSIS_DEFAULT_FPS`, `AI_ANALYSIS_MAX_DURATION_MINUTES` et `AI_ANALYSIS_MIN_CONFIDENCE`.
