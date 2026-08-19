import { useState, useMemo } from 'react';
import { Search, Trophy } from 'lucide-react';
import styles from './Leagues.module.css';
import { useLeagues } from '../../hooks/useLeagues';
import { LeagueCard } from '../../components/leagues/LeagueCard';
import { Skeleton } from '../../components/ui/Skeleton';

export const Leagues = () => {
  const { data: leagues, isLoading, error } = useLeagues();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLeagues = useMemo(() => {
    if (!leagues) return [];
    
    if (!searchTerm) {
      return leagues;
    }
    
    const term = searchTerm.toLowerCase();
    return leagues.filter(league => 
      league.name.toLowerCase().includes(term) || 
      league.country.toLowerCase().includes(term)
    );
  }, [leagues, searchTerm]);

  // Group leagues by country for better organization
  const groupedLeagues = useMemo(() => {
    const groups: Record<string, typeof filteredLeagues> = {};
    filteredLeagues.forEach(league => {
      const country = league.country || 'International';
      if (!groups[country]) {
        groups[country] = [];
      }
      groups[country].push(league);
    });
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredLeagues]);

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <Trophy size={40} className={styles.errorIcon} />
          <h2>Failed to load leagues</h2>
          <p>There was an error connecting to the server. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>Leagues</h1>
          {leagues && (
            <span className={styles.leagueCount}>{filteredLeagues.length} of {leagues.length}</span>
          )}
        </div>
        
        <div className={styles.searchContainer}>
          <Search size={18} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search leagues or countries..." 
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className={styles.clearButton} onClick={() => setSearchTerm('')}>
              ×
            </button>
          )}
        </div>
      </header>

      <div className={styles.content}>
        {isLoading ? (
          <div className={styles.gridContainer}>
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} type="card" width="100%" height="72px" />
            ))}
          </div>
        ) : filteredLeagues.length > 0 ? (
          searchTerm ? (
            // Flat grid when searching
            <div className={styles.gridContainer}>
              {filteredLeagues.map(league => (
                <LeagueCard key={league.id} league={league} />
              ))}
            </div>
          ) : (
            // Grouped by country when browsing
            groupedLeagues.map(([country, countryLeagues]) => (
              <section key={country} className={styles.countrySection}>
                <div className={styles.countrySectionHeader}>
                  <h2 className={styles.countryName}>{country}</h2>
                  <span className={styles.countryCount}>{countryLeagues.length}</span>
                </div>
                <div className={styles.gridContainer}>
                  {countryLeagues.map(league => (
                    <LeagueCard key={league.id} league={league} />
                  ))}
                </div>
              </section>
            ))
          )
        ) : (
          <div className={styles.emptyState}>
            <Search size={40} className={styles.emptyIcon} />
            <h2>No leagues found</h2>
            <p>Try a different search term or clear your filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};
