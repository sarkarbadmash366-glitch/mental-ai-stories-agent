# Mental AI Stories — Viral Vegetable Story Agent v1

A deployable starter for an AI content pipeline focused on viral vegetable stories.

## What v1 does
- Generates 5 candidate vegetable-story ideas from a configurable seed list.
- Scores ideas using Hook, Curiosity, Emotion/Comedy, Shareability, Trend fit, and Production ease.
- Selects the highest-scoring idea.
- Generates a structured Urdu story outline and 8-second scene plan from deterministic templates.
- Enforces a Character Lock and a negative prompt policy to reduce human-face/character drift.
- Produces YouTube title, description, hashtags, and tags.
- Provides a simple dashboard with buttons for "Find Ideas" and "Build Story".
- Stores generated projects locally in the browser for this demo.

## Important
This is the FIRST WORKING VERSION of the orchestration layer. It does not secretly automate Google Flow, TikTok, Instagram, or YouTube accounts. Those require provider APIs/OAuth and credentials.

## Run locally
1. Install Node.js 20+.
2. `npm install`
3. `npm run dev`
4. Open http://localhost:3000

## Deploy later
This project is structured for Vercel/Next.js. Add API integrations and environment variables before production use.
