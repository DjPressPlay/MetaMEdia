# Myth Ledger - League of Legends Profile Explorer

An interactive web application that allows users to explore League of Legends summoner profiles with an immersive visual interface.

## Features

- **Summoner Profile Lookup**: Search for any League of Legends summoner by game name and tag
- **Real-time Data**: Fetches live profile data including level, rank, LP, wins, and losses from League of Graphs
- **Dynamic Backgrounds**: Displays random League of Legends champion splash art as animated backgrounds
- **Interactive Home Room**: Navigate through an immersive interface with character spawns and visual effects
- **Profile Management**: Save and confirm summoner profiles for personalized experience

## How It Works

1. **Landing Page**: Start screen with animated bubbles showing top-ranked summoners
2. **Profile Setup**: Enter your summoner name and tag to fetch your League stats
3. **Home Room**: Interactive environment with visual effects and character interactions

## Tech Stack

- Frontend: HTML, CSS, TypeScript
- Build: esbuild for TypeScript compilation
- Functions: Netlify serverless functions for API calls
- External APIs: League of Legends Data Dragon API, League of Graphs web scraping

## Getting Started

```bash
npm install
npm run build
netlify dev
```

Visit `http://localhost:8888` to explore the application.
