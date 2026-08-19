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
    queryKey: ['leagues', 2026],
    queryFn: async (): Promise<League[]> => {
      const response = await api.get('/leagues');
      const rawData: ApiLeagueResponse[] = response.data?.data || [];
      
      const seenLeagues = new Set<number>();

      // Transform API-Football nested response into our flat League type
      return rawData
        .filter(item => item.league && item.league.name && item.league.id) // Filter out broken entries
        .filter(item => item.seasons?.some(s => s.year === 2026)) // ONLY keep leagues with a 2026 season
        .filter(item => {
          // Remove duplicates
          if (seenLeagues.has(item.league.id)) {
            return false;
          }
          seenLeagues.add(item.league.id);
          return true;
        })
        .map(item => {
          return {
            id: item.league.id,
            name: item.league.name,
            country: item.country?.name || 'International',
            logo: item.league.logo,
            flag: item.country?.flag || null,
            season: 2026, // As explicitly requested
          };
        });
    },
    staleTime: 1000 * 60 * 60 * 24, // Leagues don't change often, cache for 24h
  });
};
