# Myth Ledger - League of Legends Profile Explorer

An interactive web application that allows users to explore League of Legends summoner profiles with an immersive visual interface.

🔗 **Live Site**: https://redditnreddit.netlify.app/

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

## Important Note

The League of Graphs and League Wiki integrations are included to demonstrate advanced gameplay analytics and lore systems. These endpoints don't exist in the official Riot API, so lightweight demo scrapers were used purely for proof-of-concept. The production version would use authorized or self-generated data.

## Getting Started

The application is already live at https://redditnreddit.netlify.app/ and ready to use. No local setup is required.
