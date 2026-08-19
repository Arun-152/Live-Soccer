# Football Live Score

A real-time football score web application built with React and TypeScript. The application provides live football scores, upcoming matches, recent results, leagues, standings, lineups, match statistics, and detailed match information using real football data from API-Football.

The project focuses on providing a responsive, interactive, and football-themed user experience with dynamically fetched data instead of static or mock data.

---

## Features

### Home

- Live matches
- Trending matches
- Upcoming matches
- Recent results
- Real team logos
- Real league emblems
- Live match indicators
- Interactive match cards
- Responsive layout

### Live Matches

- View currently live matches
- Live scores
- Match status
- Match minute
- League information
- Team logos
- Live match updates
- Interactive match selection

### Leagues

- Browse football leagues
- Search leagues
- League logos and emblems
- League name and country
- 2026/2027 season leagues
- Select a league to view its details

### League Details

For a selected league:

- League information
- Current season
- Upcoming matches
- Recent results
- League standings
- Team logos
- Match information

### Standings

Display:

- Position
- Team
- Team logo
- Played
- Wins
- Draws
- Losses
- Goals For
- Goals Against
- Goal Difference
- Points

Standings are dynamically fetched according to the selected league and season.

### Match Details

Users can select any match and view:

- League information
- Teams
- Team logos
- Current/final score
- Match status
- Match date and time
- League standings
- Lineups
- Match statistics

The standings displayed for a selected match correspond to the league and season of that match.

---

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- React Router
- TanStack Query
- Axios
- CSS

### API

- API-Football v3

---

## API Integration

The application uses API-Football v3 to retrieve real football data.

Base API:

```text
https://v3.football.api-sports.io
