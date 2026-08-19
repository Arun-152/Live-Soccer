import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import type { Standing } from '../types/football';

export const useStandings = (leagueId: number, season: number) => {
  return useQuery({
    queryKey: ['standings', leagueId, season],
    queryFn: async (): Promise<Standing[]> => {
      const response = await api.get('/standings', { params: { league: leagueId, season } });
      // The API returns an array of leagues, we assume index 0 is our league, 
      // and it contains a nested array of standings (sometimes multiple groups).
      // We will flatten it for simplicity, or just return the first group.
      const leagueData = response.data.data[0]?.league;
      if (!leagueData || !leagueData.standings) return [];
      
      // Usually standings[0] is the main table
      return leagueData.standings[0] || [];
    },
    enabled: !!leagueId && !!season,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};
