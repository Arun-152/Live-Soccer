import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import type { League } from '../types/football';

interface ApiLeagueResponse {
  league: {
    id: number;
    name: string;
    type: string;
    logo: string;
  };
  country: {
    name: string;
    code: string | null;
    flag: string | null;
  };
  seasons: Array<{
    year: number;
    current: boolean;
  }>;
}

export const useLeagues = () => {
  return useQuery({
    queryKey: ['leagues'],
    queryFn: async (): Promise<League[]> => {
      const response = await api.get('/leagues');
      const rawData: ApiLeagueResponse[] = response.data.data;
      
      // Transform API-Football nested response into our flat League type
      return rawData
        .filter(item => item.league && item.league.name) // Filter out broken entries
        .map(item => {
          const currentSeason = item.seasons?.find(s => s.current);
          return {
            id: item.league.id,
            name: item.league.name,
            country: item.country?.name || 'International',
            logo: item.league.logo,
            flag: item.country?.flag || null,
            season: currentSeason?.year || new Date().getFullYear(),
          };
        });
    },
    staleTime: 1000 * 60 * 60 * 24, // Leagues don't change often, cache for 24h
  });
};
