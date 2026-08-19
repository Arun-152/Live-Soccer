import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Clock } from 'lucide-react';
import styles from './Live.module.css';
import { useLiveMatches } from '../../hooks/useMatches';
import { LiveMatchCard } from '../../components/matches/LiveMatchCard';
import { Skeleton } from '../../components/ui/Skeleton';
import type { Match } from '../../types/football';

type FilterType = 'All' | 'Live' | 'First Half' | 'Half Time' | 'Second Half';

export const Live = () => {
  const { data: matches, isLoading, error, dataUpdatedAt } = useLiveMatches();
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');

  const filters: FilterType[] = ['All', 'Live', 'First Half', 'Half Time', 'Second Half'];

  const filteredMatches = useMemo(() => {
    if (!matches) return [];
    
    return matches.filter(match => {
      const status = match.fixture.status.short;
      
      switch (activeFilter) {
        case 'All':
          return true;
        case 'Live':
          return ['1H', '2H', 'ET', 'P'].includes(status);
        case 'First Half':
          return status === '1H';
        case 'Half Time':
          return status === 'HT';
        case 'Second Half':
          return status === '2H';
        default:
          return true;
      }
    });
  }, [matches, activeFilter]);

  const groupedMatches = useMemo(() => {
    const groups: Record<number, { league: Match['league']; matches: Match[] }> = {};
    
    filteredMatches.forEach(match => {
      if (!groups[match.league.id]) {
        groups[match.league.id] = {
          league: match.league,
          matches: []
        };
      }
      groups[match.league.id].matches.push(match);
    });

    return Object.values(groups).sort((a, b) => a.league.name.localeCompare(b.league.name));
  }, [filteredMatches]);

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <Activity size={40} className={styles.errorIcon} />
          <h2>Failed to load live matches</h2>
          <p>There was an error connecting to the server. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.titleGroup}>
            <h1 className={styles.title}>
              <span className={styles.liveIndicator}></span>
              Live Matches
            </h1>
            {matches && (
              <span className={styles.matchCount}>{matches.length} match{matches.length !== 1 ? 'es' : ''}</span>
            )}
          </div>
          {dataUpdatedAt > 0 && (
            <div className={styles.lastUpdated}>
              <Clock size={14} />
              {new Date(dataUpdatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
          )}
        </div>
        
        <div className={styles.filtersContainer}>
          {filters.map(filter => (
            <button
              key={filter}
              className={`${styles.filterButton} ${activeFilter === filter ? styles.active : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </header>

      <div className={styles.content}>
        {isLoading ? (
          <div className={styles.loadingState}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className={styles.skeletonGroup}>
                <Skeleton type="text" width="200px" height="24px" />
                <div className={styles.gridContainer}>
                  {Array.from({ length: 2 }).map((_, j) => (
                    <Skeleton key={j} type="card" width="100%" height="200px" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : groupedMatches.length > 0 ? (
          groupedMatches.map(group => (
            <section key={group.league.id} className={styles.leagueSection}>
              <Link to={`/league/${group.league.id}`} className={styles.leagueHeader}>
                {group.league.logo && (
                  <img src={group.league.logo} alt={group.league.name} className={styles.leagueLogo} />
                )}
                <h2 className={styles.leagueName}>
                  {group.league.name}
                  <span className={styles.countryName}>{group.league.country}</span>
                </h2>
                <span className={styles.leagueMatchCount}>{group.matches.length}</span>
              </Link>
              <div className={styles.gridContainer}>
                {group.matches.map(match => (
                  <LiveMatchCard key={match.fixture.id} match={match} />
                ))}
              </div>
            </section>
          ))
        ) : (
          <div className={styles.emptyState}>
            <Activity size={40} className={styles.emptyIcon} />
            <h2>No matches found</h2>
            <p>Try changing your filter or check back later for live action.</p>
          </div>
        )}
      </div>
    </div>
  );
};
