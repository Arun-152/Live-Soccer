# Football Live Score

A production-focused **real-time football score web application** built with the **MERN stack and TypeScript**.

The application provides live football scores, upcoming matches, recent results, leagues, standings, lineups, match statistics, and match details using real football data from **API-Football**.

The project is designed with a clean, responsive, and interactive football-themed UI rather than static/mock data.

---

## Features

### Home

* Live matches
* Trending/important matches
* Upcoming matches
* Recent results
* Real team logos
* Real league emblems
* Live match indicators
* Interactive match cards
* Responsive football-focused UI

### Live Matches

* View currently live matches
* Live scores
* Match status
* Match minute
* League information
* Team logos
* Live match events
* Automatic live-data updates
* Interactive match selection

### Leagues

* Browse available football leagues
* Search leagues
* League logo/emblem
* League name
* Country
* Select any league to view its information

### League Details

For a selected league:

* League information
* Upcoming matches
* Recent results
* League standings
* Team logos
* Current season information

### Standings

Display:

* Position
* Team
* Played
* Wins
* Draws
* Losses
* Goals For
* Goals Against
* Goal Difference
* Points

Standings are dynamically loaded according to the selected league and season.

### Match Details

Users can select any match and view:

* League information
* Teams
* Team logos
* Current/final score
* Match status
* Match date and time
* League standings
* Lineups
* Match statistics

The standings shown for a selected match correspond to that match's league and season.

---

## Tech Stack

### Frontend

* React
* TypeScript
* Vite
* React Router
* TanStack Query
* Axios
* CSS / modern responsive UI

### Backend

* Node.js
* Express.js
* TypeScript
* Axios
* REST API architecture

### Database

* MongoDB
* Mongoose

### External API

* API-Football v3

---

## Architecture

```text
                    React UI
               TypeScript + Vite
                         |
                         | HTTP
                         v
                Express Backend
                  TypeScript API
                         |
                         v
                 Football Service
                         |
                 API-Football Client
                         |
                         v
                API-Football v3
                Live Football Data
```

The API key is kept securely on the backend and is never exposed to the React frontend.

---

## API Integration

The application uses:

```text
https://v3.football.api-sports.io
```

The API provides data for:

* Fixtures
* Live matches
* Leagues
* Teams
* Standings
* Lineups
* Match statistics
* Match events

The API account status can be checked using:

```http
GET /status
```

---

## Project Structure

```text
football-live-score/
|
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── middleware/
│   │   ├── types/
│   │   └── server.ts
│   │
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## Data Flow

For example, when a user selects a match:

```text
User selects match
        |
        v
/match/:matchId
        |
        v
Fetch match information
        |
        v
Get league ID + season
        |
        v
Request league standings
        |
        v
API-Football
        |
        v
Backend processes response
        |
        v
React displays standings
```

This ensures that the standings always belong to the **league and season of the selected match**.

---

## Real-Time Updates

Live matches require frequently updated information.

The application uses controlled data refreshing and caching to update:

* Scores
* Match status
* Match minute
* Live events
* Match state

Requests are controlled to avoid unnecessary API calls and respect API request limits.

---

## UI/UX

The application uses a football-inspired visual design.

### Design characteristics

* Dark professional interface
* Football pitch-inspired green accents
* Responsive layouts
* Interactive match cards
* Animated live indicators
* Hover states
* Active navigation states
* Loading skeletons
* Error states
* Empty states
* Mobile-friendly layouts
* Actual team logos and league emblems

The goal is to provide an experience similar to a professional football live-score platform.

---

## Main Routes

```text
/
    Home

/live
    Live Matches

/leagues
    All Leagues

/leagues/:leagueId
    League Details

/match/:matchId
    Match Details
```

---

## Main User Flow

```text
Home
 |
 +-- Live Match
 |       |
 |       v
 |   Match Details
 |       |
 |       v
 |   Standings / Lineups / Statistics
 |
 +-- Upcoming Match
         |
         v
     Match Details


Leagues
   |
   v
All Leagues
   |
   v
Select League
   |
   v
League Details
   |
   +-- Upcoming Matches
   +-- Recent Results
   +-- Standings
```

---

## Responsive Design

The application is designed to work across:

* Desktop
* Laptop
* Tablet
* Mobile

The interface adapts match cards, standings tables, navigation, filters, and league information for smaller screens.

---

## API Request Management

Because API-Football plans have daily request limits, the application avoids unnecessary requests by:

* Caching API responses
* Using controlled polling for live matches
* Avoiding repeated requests on every render
* Fetching standings only when required
* Stopping unnecessary live polling when matches finish

---

## Getting Started

### 1. Clone the repository

```bash
git clone YOUR_REPOSITORY_URL
cd football-live-score
```

### 2. Install frontend dependencies

```bash
cd client
npm install
```

### 3. Install backend dependencies

```bash
cd ../server
npm install
```

### 4. Start the backend

```bash
npm run dev
```

### 5. Start the frontend

```bash
cd ../client
npm run dev
```

The application will then be available through the Vite development server.

---

## Development

Before deploying, verify:

* TypeScript compilation
* API responses
* Live score updates
* League selection
* League standings
* Match details
* Lineups
* Match statistics
* Responsive layouts
* API error handling
* API rate limits

---

## Future Improvements

Possible future improvements include:

* Team-specific pages
* Favorite teams
* Match notifications
* Goal notifications
* More detailed match statistics
* Player profiles
* Search for teams and players
* PWA support
* Push notifications
* Advanced match analytics
* Performance monitoring

---

## Developer

Built as a learning and production-oriented project while studying:

* MERN Stack
* TypeScript
* REST APIs
* Real-time data handling
* React state/server-state management
* Backend architecture
* API integration
* Responsive UI/UX

---

