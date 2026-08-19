import { Request, Response } from 'express';
import { footballService } from '../services/football.service';
import { apiCache } from '../utils/cache';

export const getLiveMatches = async (req: Request, res: Response) => {
  try {
    const cacheKey = 'live_matches';
    const cachedData = apiCache.get(cacheKey);
    if (cachedData) {
      return res.status(200).json({ status: 'success', data: cachedData, cached: true });
    }

    const data = await footballService.getLiveMatches();
    if (data.errors && Object.keys(data.errors).length > 0) {
      return res.status(400).json({ status: 'error', message: 'API Error', errors: data.errors });
    }
    
    apiCache.set(cacheKey, data.response, 30); // Cache for 30s
    res.status(200).json({ status: 'success', data: data.response });
  } catch (error: any) {
    console.error('Error in getLiveMatches:', error.message);
    res.status(500).json({ status: 'error', message: 'Failed to fetch live matches' });
  }
};

export const getMatchesByDate = async (req: Request, res: Response) => {
  try {
    const { date } = req.query; // YYYY-MM-DD
    if (!date) {
      return res.status(400).json({ status: 'error', message: 'Date parameter is required' });
    }

    const cacheKey = `matches_date_${date}`;
    const cachedData = apiCache.get(cacheKey);
    if (cachedData) {
      return res.status(200).json({ status: 'success', data: cachedData, cached: true });
    }

    const data = await footballService.getMatchesByDate(date as string);
    if (data.errors && Object.keys(data.errors).length > 0) {
      return res.status(400).json({ status: 'error', message: 'API Error', errors: data.errors });
    }
    
    apiCache.set(cacheKey, data.response, 60); // Cache for 60s
    res.status(200).json({ status: 'success', data: data.response });
  } catch (error: any) {
    console.error('Error in getMatchesByDate:', error.message);
    res.status(500).json({ status: 'error', message: 'Failed to fetch matches' });
  }
};

export const getMatchesByLeague = async (req: Request, res: Response) => {
  try {
    const { league, season } = req.query;
    if (!league || !season) {
      return res.status(400).json({ status: 'error', message: 'League and season parameters are required' });
    }

    const cacheKey = `matches_league_${league}_${season}`;
    const cachedData = apiCache.get(cacheKey);
    if (cachedData) {
      return res.status(200).json({ status: 'success', data: cachedData, cached: true });
    }

    const data = await footballService.getMatchesByLeague(Number(league), Number(season));
    if (data.errors && Object.keys(data.errors).length > 0) {
      return res.status(400).json({ status: 'error', message: 'API Error', errors: data.errors });
    }
    
    apiCache.set(cacheKey, data.response, 60); // Cache for 60s
    res.status(200).json({ status: 'success', data: data.response });
  } catch (error: any) {
    console.error('Error in getMatchesByLeague:', error.message);
    res.status(500).json({ status: 'error', message: 'Failed to fetch matches by league' });
  }
};

export const getLeagues = async (req: Request, res: Response) => {
  try {
    const cacheKey = 'leagues_current';
    const cachedData = apiCache.get(cacheKey);
    if (cachedData) {
      return res.status(200).json({ status: 'success', data: cachedData, cached: true });
    }

    const data = await footballService.getLeagues();
    if (data.errors && Object.keys(data.errors).length > 0) {
      return res.status(400).json({ status: 'error', message: 'API Error', errors: data.errors });
    }
    
    apiCache.set(cacheKey, data.response, 3600); // Cache for 1 hour
    res.status(200).json({ status: 'success', data: data.response });
  } catch (error: any) {
    console.error('Error in getLeagues:', error.message);
    res.status(500).json({ status: 'error', message: 'Failed to fetch leagues' });
  }
};

export const getStandings = async (req: Request, res: Response) => {
  try {
    const { league, season } = req.query;
    if (!league || !season) {
      return res.status(400).json({ status: 'error', message: 'League and Season parameters are required' });
    }

    const cacheKey = `standings_${league}_${season}`;
    const cachedData = apiCache.get(cacheKey);
    if (cachedData) {
      return res.status(200).json({ status: 'success', data: cachedData, cached: true });
    }

    const data = await footballService.getStandings(Number(league), Number(season));
    if (data.errors && Object.keys(data.errors).length > 0) {
      return res.status(400).json({ status: 'error', message: 'API Error', errors: data.errors });
    }
    
    apiCache.set(cacheKey, data.response, 300); // Cache for 5 mins
    res.status(200).json({ status: 'success', data: data.response });
  } catch (error: any) {
    console.error('Error in getStandings:', error.message);
    res.status(500).json({ status: 'error', message: 'Failed to fetch standings' });
  }
};

export const getMatchDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ status: 'error', message: 'Fixture ID is required' });
    }
    
    const cacheKey = `match_details_${id}`;
    const cachedData = apiCache.get(cacheKey);
    if (cachedData) {
      return res.status(200).json({ status: 'success', data: cachedData, cached: true });
    }

    // Fetch all details concurrently to improve response time
    // Removed getMatchEvents to save API calls as requested
    const [matchData, lineupsData, statisticsData] = await Promise.all([
      footballService.getMatchById(Number(id)),
      footballService.getMatchLineups(Number(id)),
      footballService.getMatchStatistics(Number(id))
    ]);

    const result = {
      match: matchData.response[0] || null,
      events: [], // Return empty array to not break types
      lineups: lineupsData.response || [],
      statistics: statisticsData.response || []
    };

    apiCache.set(cacheKey, result, 30); // Cache for 30s
    res.status(200).json({ status: 'success', data: result });
  } catch (error: any) {
    console.error('Error in getMatchDetails:', error.message);
    res.status(500).json({ status: 'error', message: 'Failed to fetch match details' });
  }
};

export const getStatus = async (req: Request, res: Response) => {
  try {
    const data = await footballService.getStatus();
    if (data.errors && Object.keys(data.errors).length > 0) {
      return res.status(400).json({ status: 'error', message: 'API Error', errors: data.errors });
    }
    
    // Status can change as requests are consumed, maybe don't cache or cache shortly
    res.status(200).json({ status: 'success', data: data.response });
  } catch (error: any) {
    console.error('Error in getStatus:', error.message);
    res.status(500).json({ status: 'error', message: 'Failed to fetch API status' });
  }
};
