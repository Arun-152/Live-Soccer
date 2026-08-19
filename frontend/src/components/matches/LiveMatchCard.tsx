import { Link } from 'react-router-dom';
import styles from './LiveMatchCard.module.css';
import type { Match, MatchEvent } from '../../types/football';

interface LiveMatchCardProps {
  match: Match;
}

export const LiveMatchCard = ({ match }: LiveMatchCardProps) => {
  const { fixture, league, teams, goals, events } = match;
  
  const isLive = ['1H', '2H', 'HT', 'ET', 'P'].includes(fixture.status.short);
  const matchStatus = fixture.status.elapsed ? `${fixture.status.elapsed}'` : fixture.status.short;

  const renderEventIcon = (event: MatchEvent) => {
    if (event.type === 'Goal') return '⚽';
    if (event.type === 'Card' && event.detail === 'Yellow Card') return '🟨';
    if (event.type === 'Card' && event.detail === 'Red Card') return '🟥';
    if (event.type === 'subst') return '🔄';
    if (event.type === 'Var') return '📺';
    return '•';
  };

  return (
    <Link to={`/match/${fixture.id}`} className={styles.card}>
      <div className={styles.header}>
        <div className={styles.leagueInfo}>
          {league.logo && <img src={league.logo} alt={league.name} className={styles.leagueLogo} loading="lazy" />}
          <span className={styles.leagueName}>{league.name}</span>
        </div>
        <div className={styles.statusContainer}>
          {isLive && <span className={styles.liveIndicator}></span>}
          <span className={`${styles.statusText} ${isLive ? styles.liveText : ''}`}>
            {matchStatus}
          </span>
        </div>
      </div>
      
      <div className={styles.teamsContainer}>
        <div className={styles.team}>
          <img src={teams.home.logo} alt={teams.home.name} className={styles.teamLogo} loading="lazy" />
          <span className={styles.teamName}>{teams.home.name}</span>
          <span className={styles.score}>{goals.home !== null ? goals.home : '-'}</span>
        </div>
        
        <div className={styles.team}>
          <img src={teams.away.logo} alt={teams.away.name} className={styles.teamLogo} loading="lazy" />
          <span className={styles.teamName}>{teams.away.name}</span>
          <span className={styles.score}>{goals.away !== null ? goals.away : '-'}</span>
        </div>
      </div>

      {events && events.length > 0 && (
        <div className={styles.eventsTimeline}>
          {events.slice(-4).map((event, idx) => (
            <div key={idx} className={styles.eventItem}>
              <span className={styles.eventTime}>{event.time.elapsed}'</span>
              <span className={styles.eventIcon}>{renderEventIcon(event)}</span>
              <span className={styles.eventPlayer}>{event.player.name}</span>
            </div>
          ))}
        </div>
      )}
    </Link>
  );
};
