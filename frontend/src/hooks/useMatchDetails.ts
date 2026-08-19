import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import type { MatchDetailsResponse } from '../types/football';

export const useMatchDetails = (matchId: number) => {
  return useQuery({
    queryKey: ['matchDetails', matchId],
    queryFn: async (): Promise<MatchDetailsResponse> => {
      const response = await api.get(`/matches/${matchId}/details`);
      return response.data.data;
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
