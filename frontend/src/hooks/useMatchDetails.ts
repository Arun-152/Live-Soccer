import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import type { MatchDetailsResponse } from '../types/football';

export const useMatchDetails = (matchId: number) => {
  return useQuery({
    queryKey: ['matchDetails', matchId],
    queryFn: async (): Promise<MatchDetailsResponse> => {
      const [matchRes, lineupsRes, statsRes] = await Promise.all([
        api.get('/fixtures', { params: { id: matchId } }),
        api.get('/fixtures/lineups', { params: { fixture: matchId } }),
        api.get('/fixtures/statistics', { params: { fixture: matchId } }),
      ]);

      return {
        match: matchRes.data?.response?.[0] || null,
        events: [],
        lineups: lineupsRes.data?.response || [],
        statistics: statsRes.data?.response || [],
      };
    },
    enabled: !!matchId,
    refetchInterval: (query) => {
      // Check the match status from the cached data if it exists
      const match = query.state.data?.match;
      if (match) {
        const status = match.fixture.status.short;
        // Poll every 30s if the match is live
        if (['1H', '2H', 'HT', 'ET', 'P'].includes(status)) {
          return 30000;
        }
      }
      return false; // Disable polling for finished or not started matches
    },
  });
};
