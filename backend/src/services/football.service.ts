import axios from 'axios';
import axiosRetry from 'axios-retry';
import dotenv from 'dotenv';

dotenv.config();

const FOOTBALL_API_KEY = process.env.FOOTBALL_API_KEY;
const FOOTBALL_API_URL = process.env.FOOTBALL_API_URL || 'https://v3.football.api-sports.io';

if (!FOOTBALL_API_KEY || FOOTBALL_API_KEY === 'your_api_sports_key_here') {
  console.warn('WARNING: FOOTBALL_API_KEY is not set or is using the default placeholder.');
}

const apiClient = axios.create({
  baseURL: FOOTBALL_API_URL,
  headers: {
    'x-rapidapi-host': 'v3.football.api-sports.io',
    'x-apisports-key': FOOTBALL_API_KEY || '',
  },
  timeout: 10000, // 10s timeout
});

// Retry logic for rate limits (429) or network timeouts
axiosRetry(apiClient, {
  retries: 3,
  retryDelay: (retryCount) => {
    return retryCount * 1000; // time interval between retries
  },
  retryCondition: (error) => {
    // if retry condition is not specified, by default idempotent requests are retried
    return error.response?.status === 429 || error.response?.status === 499 || axiosRetry.isNetworkOrIdempotentRequestError(error);
  },
});

export const footballService = {
  getLiveMatches: async () => {
    const response = await apiClient.get('/fixtures', { params: { live: 'all' } });
    return response.data;
  },
  
  getMatchById: async (fixtureId: number) => {
    const response = await apiClient.get('/fixtures', { params: { id: fixtureId } });
    return response.data;
  },
  
  getMatchesByDate: async (date: string) => {
    const response = await apiClient.get('/fixtures', { params: { date } });
    return response.data;
  },
  
  getMatchesByLeague: async (leagueId: number, season: number) => {
    const response = await apiClient.get('/fixtures', { params: { league: leagueId, season } });
    return response.data;
  },
  
  getLeagues: async () => {
    // Fetch all leagues so we can filter by specific seasons on the frontend
    const response = await apiClient.get('/leagues');
    return response.data;
  },
  
  getStandings: async (leagueId: number, season: number) => {
    const response = await apiClient.get('/standings', { params: { league: leagueId, season } });
    return response.data;
  },
  
  getMatchEvents: async (fixtureId: number) => {
    const response = await apiClient.get('/fixtures/events', { params: { fixture: fixtureId } });
    return response.data;
  },
  
  getMatchLineups: async (fixtureId: number) => {
    const response = await apiClient.get('/fixtures/lineups', { params: { fixture: fixtureId } });
    return response.data;
  },
  
  getMatchStatistics: async (fixtureId: number) => {
    const response = await apiClient.get('/fixtures/statistics', { params: { fixture: fixtureId } });
    return response.data;
  },
  
  getStatus: async () => {
    const response = await apiClient.get('/status');
    return response.data;
  }
};
