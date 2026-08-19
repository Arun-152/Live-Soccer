import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import type { Match } from '../types/football';

export const useLiveMatches = () => {
  return useQuery({
    queryKey: ['matches', 'live'],
    queryFn: async (): Promise<Match[]> => {
      const response = await api.get('/matches/live');
      return response.data.data;
    },
    refetchInterval: 30000, // Refetch every 30s for live data
  });
};

export const useMatchesByDate = (date: string) => {
  return useQuery({
    queryKey: ['matches', 'date', date],
    queryFn: async (): Promise<Match[]> => {
      const response = await api.get('/matches', { params: { date } });
      return response.data.data;
    },
    refetchInterval: (query) => {
      const matches = query.state.data;
      if (matches && matches.some(match => ['1H', '2H', 'HT', 'ET', 'P'].includes(match.fixture.status.short))) {
        return 30000;
      }
      return false;
    }
  });
};

export const useMatchesByLeague = (leagueId: number, season: number) => {
  return useQuery({
    queryKey: ['matches', 'league', leagueId, season],
    queryFn: async (): Promise<Match[]> => {
      const response = await api.get('/matches/league', { params: { league: leagueId, season } });
      return response.data.data;
    },
    enabled: !!leagueId && !!season,
  });
};
