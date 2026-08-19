import axios from 'axios';

const FOOTBALL_API_KEY = import.meta.env.VITE_FOOTBALL_API_KEY;
const FOOTBALL_API_URL = import.meta.env.VITE_FOOTBALL_API_URL || 'https://v3.football.api-sports.io';

const api = axios.create({
  baseURL: FOOTBALL_API_URL,
  headers: {
    'x-rapidapi-host': 'v3.football.api-sports.io',
    'x-apisports-key': FOOTBALL_API_KEY || '',
  },
  timeout: 10000,
});

export default api;
