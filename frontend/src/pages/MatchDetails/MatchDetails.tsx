import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Info, Users, BarChart3, Trophy } from 'lucide-react';
import styles from './MatchDetails.module.css';
import { useMatchDetails } from '../../hooks/useMatchDetails';
import { useStandings } from '../../hooks/useStandings';
import { Skeleton } from '../../components/ui/Skeleton';

type TabType = 'Overview' | 'Standings' | 'Lineups' | 'Statistics';

const TAB_ICONS = {
  Overview: <Info size={16} />,
  Standings: <Trophy size={16} />,
  Lineups: <Users size={16} />,
  Statistics: <BarChart3 size={16} />,
};

export const MatchDetails = () => {
  const { id } = useParams<{ id: string }>();
  const matchId = Number(id);

  const [activeTab, setActiveTab] = useState<TabType>('Overview');
  
  // Match Details
  const { data, isLoading: matchLoading, error: matchError, dataUpdatedAt } = useMatchDetails(matchId);
  const match = data?.match;
  
  // Standings
  const leagueId = match?.league.id || 0;
  const season = match?.league.season || 0;
  const { data: standings, isLoading: standingsLoading, error: standingsError } = useStandings(leagueId, season);

  if (matchLoading) {
    return (
      <div className={styles.container}>
        <Skeleton type="card" width="100%" height="200px" />
        <div style={{ marginTop: '24px', display: 'flex', gap: '8px' }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} type="text" width="100px" height="40px" />
          ))}
        </div>
        <Skeleton type="card" width="100%" height="300px" />
      </div>
    );
  }

  if (matchError || !data || !match) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <Info size={40} className={styles.errorIcon} />
          <h2>Match not found</h2>
          <p>This match could not be loaded. It may not exist or there was a server error.</p>
          <Link to="/" className={styles.backButton}>Return to Home</Link>
        </div>
      </div>
    );
  }

  const { lineups, statistics } = data;
  const { fixture, league, teams, goals } = match;

  const isLive = ['1H', '2H', 'HT', 'ET', 'P'].includes(fixture.status.short);
  const isFinished = ['FT', 'AET', 'PEN'].includes(fixture.status.short);
  const matchStatus = fixture.status.elapsed ? `${fixture.status.elapsed}'` : fixture.status.long;

  const renderOverview = () => {
    return (
      <div className={styles.overviewTab}>
        <div className={styles.overviewGrid}>
          <div className={styles.infoCard}>
            <span className={styles.infoLabel}>Date</span>
            <span className={styles.infoValue}>{new Date(fixture.date).toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <div className={styles.infoCard}>
            <span className={styles.infoLabel}>Time</span>
            <span className={styles.infoValue}>{new Date(fixture.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div className={styles.infoCard}>
            <span className={styles.infoLabel}>Status</span>
            <span className={styles.infoValue}>{fixture.status.long}</span>
          </div>
          <div className={styles.infoCard}>
            <span className={styles.infoLabel}>Competition</span>
            <span className={styles.infoValue}>{league.name}</span>
          </div>
        </div>
      </div>
    );
  };

  const renderStandings = () => {
    if (standingsLoading) {
      return (
        <div className={styles.emptyState}>
          <BarChart3 size={36} className={styles.emptyIcon} />
          <p>Loading standings...</p>
        </div>
      );
    }
    
    if (standingsError) {
      return (
        <div className={styles.errorState}>
          <BarChart3 size={36} className={styles.errorIcon} />
          <p>Unable to load standings. Please try again.</p>
        </div>
      );
    }

    if (!standings || standings.length === 0) {
      return (
        <div className={styles.emptyState}>
          <Trophy size={36} className={styles.emptyIcon} />
          <p>No standings available for this league.</p>
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
              <th className={styles.centerAlign}>GF</th>
              <th className={styles.centerAlign}>GA</th>
              <th className={styles.centerAlign}>GD</th>
              <th className={styles.centerAlign}>Pts</th>
            </tr>
          </thead>
          <tbody>
            {standings.map(row => {
              const isMatchTeam = row.team.id === teams.home.id || row.team.id === teams.away.id;
              
              return (
                <tr key={row.team.id} className={`${styles.standingsRow} ${isMatchTeam ? styles.highlightedRow : ''}`}>
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
                      <img src={row.team.logo} alt={row.team.name} className={styles.teamLogoSmall} loading="lazy" />
                      <span className={styles.teamNameSmall}>{row.team.name}</span>
                    </div>
                  </td>
                  <td className={styles.centerAlign}>{row.all.played}</td>
                  <td className={styles.centerAlign}>{row.all.win}</td>
                  <td className={styles.centerAlign}>{row.all.draw}</td>
                  <td className={styles.centerAlign}>{row.all.lose}</td>
                  <td className={styles.centerAlign}>{row.all.goals.for}</td>
                  <td className={styles.centerAlign}>{row.all.goals.against}</td>
                  <td className={styles.centerAlign}>{row.goalsDiff}</td>
                  <td className={`${styles.centerAlign} ${styles.points}`}>{row.points}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const renderLineups = () => {
    if (!lineups || lineups.length === 0) {
      return (
        <div className={styles.emptyState}>
          <Users size={36} className={styles.emptyIcon} />
          <p>Lineups not available yet.</p>
        </div>
      );
    }

    return (
      <div className={styles.lineupsContainer}>
        {lineups.map(lineup => (
          <div key={lineup.team.id} className={styles.teamLineup}>
            <div className={styles.lineupHeader}>
              <img src={lineup.team.logo} alt={lineup.team.name} className={styles.lineupTeamLogo} />
              <h3>{lineup.team.name}</h3>
              <span className={styles.formation}>{lineup.formation}</span>
            </div>
            
            <div className={styles.playersList}>
              <h4>Starting XI</h4>
              {lineup.startXI.map((item, idx) => (
                <div key={idx} className={styles.playerRow}>
                  <span className={styles.playerNumber}>{item.player.number}</span>
                  <span className={styles.playerName}>{item.player.name}</span>
                  <span className={styles.playerPosition}>{item.player.pos}</span>
                </div>
              ))}
            </div>

            <div className={styles.playersList}>
              <h4>Substitutes</h4>
              {lineup.substitutes.map((item, idx) => (
                <div key={idx} className={styles.playerRow}>
                  <span className={styles.playerNumber}>{item.player.number}</span>
                  <span className={styles.playerName}>{item.player.name}</span>
                  <span className={styles.playerPosition}>{item.player.pos}</span>
                </div>
              ))}
            </div>
            
            {lineup.coach && (
              <div className={styles.coachInfo}>
                <h4>Coach</h4>
                <p>{lineup.coach.name}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderStatistics = () => {
    if (!statistics || statistics.length === 0) {
      return (
        <div className={styles.emptyState}>
          <BarChart3 size={36} className={styles.emptyIcon} />
          <p>Statistics not available.</p>
        </div>
      );
    }

    const homeStats = statistics.find(s => s.team.id === teams.home.id)?.statistics || [];
    const awayStats = statistics.find(s => s.team.id === teams.away.id)?.statistics || [];
    const statTypes = Array.from(new Set([...homeStats.map(s => s.type), ...awayStats.map(s => s.type)]));

    return (
      <div className={styles.statsContainer}>
        <div className={styles.statsHeader}>
          <div className={styles.statsTeam}>
            <img src={teams.home.logo} alt={teams.home.name} />
            <span>{teams.home.name}</span>
          </div>
          <div className={styles.statsTeam}>
            <span>{teams.away.name}</span>
            <img src={teams.away.logo} alt={teams.away.name} />
          </div>
        </div>
        
        {statTypes.map(type => {
          const homeVal = homeStats.find(s => s.type === type)?.value ?? 0;
          const awayVal = awayStats.find(s => s.type === type)?.value ?? 0;
          
          let hNum = parseInt(homeVal.toString().replace('%', '')) || 0;
          let aNum = parseInt(awayVal.toString().replace('%', '')) || 0;
          const total = hNum + aNum;
          
          const homePercent = total > 0 ? (hNum / total) * 100 : 50;
          const awayPercent = total > 0 ? (aNum / total) * 100 : 50;

          return (
            <div key={type} className={styles.statRow}>
              <div className={styles.statValues}>
                <span className={styles.statNum}>{homeVal !== null ? homeVal : 0}</span>
                <span className={styles.statLabel}>{type}</span>
                <span className={styles.statNum}>{awayVal !== null ? awayVal : 0}</span>
              </div>
              <div className={styles.statBar}>
                <div className={styles.statBarHome} style={{ width: `${homePercent}%` }}></div>
                <div className={styles.statBarAway} style={{ width: `${awayPercent}%` }}></div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <Link to="/" className={styles.backLink}>
        <ArrowLeft size={18} />
        Back
      </Link>

      <header className={styles.header}>
        <Link to={`/league/${league.id}`} className={styles.leagueContext}>
          {league.logo && <img src={league.logo} alt={league.name} className={styles.leagueLogo} />}
          <span>{league.name}</span>
        </Link>
        
        <div className={styles.scoreboard}>
          <div className={styles.team}>
            <img src={teams.home.logo} alt={teams.home.name} className={styles.teamLogo} />
            <h2 className={styles.teamName}>{teams.home.name}</h2>
          </div>
          
          <div className={styles.scoreCenter}>
            <div className={styles.statusInfo}>
              {isLive && <span className={styles.liveIndicator}></span>}
              <span className={isLive ? styles.liveText : styles.statusText}>{matchStatus}</span>
            </div>
            <div className={styles.score}>
              <span className={isFinished && goals.home !== null && goals.away !== null && goals.home > goals.away ? styles.scoreWinner : ''}>
                {goals.home !== null ? goals.home : '-'}
              </span>
              <span className={styles.scoreDivider}>-</span>
              <span className={isFinished && goals.home !== null && goals.away !== null && goals.away > goals.home ? styles.scoreWinner : ''}>
                {goals.away !== null ? goals.away : '-'}
              </span>
            </div>
            {isLive && dataUpdatedAt > 0 && (
              <div className={styles.lastUpdated}>
                <Clock size={12} />
                {new Date(dataUpdatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
            )}
          </div>
          
          <div className={styles.team}>
            <img src={teams.away.logo} alt={teams.away.name} className={styles.teamLogo} />
            <h2 className={styles.teamName}>{teams.away.name}</h2>
          </div>
        </div>
      </header>

      <div className={styles.tabsContainer}>
        {(['Overview', 'Standings', 'Lineups', 'Statistics'] as TabType[]).map(tab => (
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
        {activeTab === 'Standings' && renderStandings()}
        {activeTab === 'Lineups' && renderLineups()}
        {activeTab === 'Statistics' && renderStatistics()}
      </div>
    </div>
  );
};
