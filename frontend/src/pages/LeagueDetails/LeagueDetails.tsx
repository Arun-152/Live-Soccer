import { useState, useMemo } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { ArrowLeft, Info, CalendarDays, BarChart3 } from 'lucide-react';
import styles from './LeagueDetails.module.css';
import { useLeagues } from '../../hooks/useLeagues';
import { useMatchesByLeague } from '../../hooks/useMatches';
import { useStandings } from '../../hooks/useStandings';
import { MatchCard } from '../../components/matches/MatchCard';
import { Skeleton } from '../../components/ui/Skeleton';

type TabType = 'Overview' | 'Matches' | 'Standings';

const TAB_ICONS = {
  Overview: <Info size={16} />,
  Matches: <CalendarDays size={16} />,
  Standings: <BarChart3 size={16} />,
};

export const LeagueDetails = () => {
  const { id } = useParams<{ id: string }>();
  const leagueId = Number(id);
  
  const [activeTab, setActiveTab] = useState<TabType>('Overview');

  const { data: leagues, isLoading: leaguesLoading } = useLeagues();
  const league = useMemo(() => leagues?.find(l => l.id === leagueId), [leagues, leagueId]);
  
  const season = league?.season || 2026;

  const { data: matches, isLoading: matchesLoading, isError: matchesError } = useMatchesByLeague(leagueId, season);
  const { data: standings, isLoading: standingsLoading, isError: standingsError } = useStandings(leagueId, season);

  const fixtures = useMemo(() => matches?.filter(m => m.fixture.status.short === 'NS') || [], [matches]);
  const results = useMemo(() => matches?.filter(m => ['FT', 'AET', 'PEN'].includes(m.fixture.status.short)).reverse() || [], [matches]);

  if (leaguesLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.headerSkeleton}>
          <Skeleton type="circle" width="80px" height="80px" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Skeleton type="text" width="200px" height="28px" />
            <Skeleton type="text" width="140px" height="20px" />
          </div>
        </div>
      </div>
    );
  }

  if (!league) {
    return <Navigate to="/leagues" />;
  }

  const renderStandings = () => {
    if (standingsLoading) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} type="text" width="100%" height="48px" />
          ))}
        </div>
      );
    }

    if (standingsError) {
      return (
        <div className={styles.errorState}>
          <BarChart3 size={36} className={styles.errorIcon} />
          <p>Unable to load league data. Please try again.</p>
        </div>
      );
    }

    if (!standings || standings.length === 0) {
      return (
        <div className={styles.emptyState}>
          <BarChart3 size={36} className={styles.emptyIcon} />
          <p>Standings not available for this league.</p>
        </div>
      );
    }

    return (
      <div className={styles.tableContainer}>
        <table className={styles.standingsTable}>
          <thead>
            <tr>
              <th className={styles.centerAlign}>#</th>
              <th className={styles.leftAlign}>Team</th>
              <th className={styles.centerAlign}>P</th>
              <th className={styles.centerAlign}>W</th>
              <th className={styles.centerAlign}>D</th>
              <th className={styles.centerAlign}>L</th>
              <th className={styles.centerAlign}>GD</th>
              <th className={styles.centerAlign}>Pts</th>
            </tr>
          </thead>
          <tbody>
            {standings.map(row => (
              <tr key={row.team.id} className={styles.standingsRow}>
                <td className={styles.centerAlign}>
                  <span className={`${styles.rank} ${
                    row.description?.includes('Promotion') || row.description?.includes('Champions League') ? styles.promotion :
                    row.description?.includes('Relegation') ? styles.relegation :
                    row.description?.includes('Europa') ? styles.europa : ''
                  }`}>
                    {row.rank}
                  </span>
                </td>
                <td className={styles.leftAlign}>
                  <div className={styles.teamCell}>
                    <img src={row.team.logo} alt={row.team.name} className={styles.teamLogo} loading="lazy" />
                    <span className={styles.teamName}>{row.team.name}</span>
                  </div>
                </td>
                <td className={styles.centerAlign}>{row.all.played}</td>
                <td className={styles.centerAlign}>{row.all.win}</td>
                <td className={styles.centerAlign}>{row.all.draw}</td>
                <td className={styles.centerAlign}>{row.all.lose}</td>
                <td className={styles.centerAlign}>{row.goalsDiff}</td>
                <td className={`${styles.centerAlign} ${styles.points}`}>{row.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderMatchesList = (matchList: typeof matches, loading: boolean, isError: boolean, emptyMsg: string) => {
    if (loading) {
      return (
        <div className={styles.gridContainer}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} type="card" width="100%" height="140px" />
          ))}
        </div>
      );
    }
    
    if (isError) {
      return (
        <div className={styles.errorState}>
          <CalendarDays size={36} className={styles.errorIcon} />
          <p>Unable to load league data. Please try again.</p>
        </div>
      );
    }
    
    if (!matchList || matchList.length === 0) {
      return <div className={styles.emptyState}><p>{emptyMsg}</p></div>;
    }

    return (
      <div className={styles.gridContainer}>
        {matchList.map(match => (
          <MatchCard key={match.fixture.id} match={match} />
        ))}
      </div>
    );
  };

  const renderOverview = () => {
    return (
      <div className={styles.overviewContainer}>
        <div className={styles.overviewGrid}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Season</span>
            <span className={styles.statValue}>{season}/{season + 1}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Country</span>
            <span className={styles.statValue}>{league.country}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Fixtures</span>
            <span className={styles.statValue}>{fixtures.length} upcoming</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Results</span>
            <span className={styles.statValue}>{results.length} played</span>
          </div>
        </div>
        
        {standings && standings.length > 0 && (
          <div className={styles.overviewSection}>
            <h3 className={styles.overviewSectionTitle}>Top Teams</h3>
            <div className={styles.topTeams}>
              {standings.slice(0, 5).map(row => (
                <div key={row.team.id} className={styles.topTeamCard}>
                  <span className={styles.topTeamRank}>{row.rank}</span>
                  <img src={row.team.logo} alt={row.team.name} className={styles.topTeamLogo} />
                  <span className={styles.topTeamName}>{row.team.name}</span>
                  <span className={styles.topTeamPoints}>{row.points} pts</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {fixtures.length > 0 && (
          <div className={styles.overviewSection}>
            <div className={styles.overviewSectionHeader}>
              <h3 className={styles.overviewSectionTitle}>Next Matches</h3>
              <button className={styles.seeAllButton} onClick={() => setActiveTab('Matches')}>See all</button>
            </div>
            <div className={styles.gridContainer}>
              {fixtures.slice(0, 3).map(match => (
                <MatchCard key={match.fixture.id} match={match} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderMatchesTab = () => {
    return (
      <div className={styles.matchesTabContainer}>
        <div className={styles.matchesSection}>
          <h3 className={styles.matchesSectionTitle}>Upcoming ({fixtures.length})</h3>
          {renderMatchesList(fixtures, matchesLoading, matchesError, 'No upcoming fixtures available.')}
        </div>
        
        <div className={styles.matchesSection}>
          <h3 className={styles.matchesSectionTitle}>Results ({results.length})</h3>
          {renderMatchesList(results, matchesLoading, matchesError, 'No recent results available.')}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <Link to="/leagues" className={styles.backLink}>
        <ArrowLeft size={18} />
        All Leagues
      </Link>

      <header className={styles.header}>
        <div className={styles.logoWrapper}>
          {league.logo && (
            <img src={league.logo} alt={league.name} className={styles.mainLogo} />
          )}
        </div>
        <div className={styles.headerInfo}>
          <h1 className={styles.title}>{league.name}</h1>
          <p className={styles.subtitle}>
            {league.country} • {season}/{season + 1}
          </p>
        </div>
      </header>

      <div className={styles.tabsContainer}>
        {(['Overview', 'Matches', 'Standings'] as TabType[]).map(tab => (
          <button
            key={tab}
            className={`${styles.tabButton} ${activeTab === tab ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {TAB_ICONS[tab]}
            {tab}
          </button>
        ))}
      </div>

      <div className={styles.tabContent}>
        {activeTab === 'Overview' && renderOverview()}
        {activeTab === 'Matches' && renderMatchesTab()}
        {activeTab === 'Standings' && renderStandings()}
      </div>
    </div>
  );
};
