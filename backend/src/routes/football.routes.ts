import { Router } from 'express';
import { 
  getLiveMatches, 
  getMatchesByDate, 
  getMatchesByLeague,
  getLeagues, 
  getStandings, 
  getMatchDetails,
  getStatus
} from '../controllers/football.controller';

const router = Router();

// Status
router.get('/status', getStatus);

// Matches
router.get('/matches/live', getLiveMatches);
router.get('/matches/league', getMatchesByLeague);
router.get('/matches', getMatchesByDate);

// Leagues and Standings
router.get('/leagues', getLeagues);
router.get('/standings', getStandings);

// Specific Match Details (Events, Lineups, Stats)
router.get('/matches/:id/details', getMatchDetails);

export default router;
