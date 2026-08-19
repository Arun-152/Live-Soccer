import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import styles from './MatchCard.module.css';
import type { Match } from '../../types/football';

interface MatchCardProps {
  match: Match;
}

export const MatchCard = ({ match }: MatchCardProps) => {
  const { fixture, league, teams, goals } = match;
  
  const isLive = ['1H', '2H', 'HT', 'ET', 'P'].includes(fixture.status.short);
  const isFinished = ['FT', 'AET', 'PEN'].includes(fixture.status.short);
  const isNotStarted = fixture.status.short === 'NS';

  const matchStatus = isNotStarted
    ? new Date(fixture.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : fixture.status.elapsed ? `${fixture.status.elapsed}'` : fixture.status.short;

  const homeWins = isFinished && goals.home !== null && goals.away !== null && goals.home > goals.away;
  const awayWins = isFinished && goals.home !== null && goals.away !== null && goals.away > goals.home;

  return (
    <Link
      to={`/match/${fixture.id}`}
      className={`${styles.card} ${isLive ? styles.cardLive : ''}`}
    >
      <div className={styles.header}>
        <div className={styles.leagueInfo}>
          {league.logo && <img src={league.logo} alt={league.name} className={styles.leagueLogo} loading="lazy" />}
          <span className={styles.leagueName}>{league.name}</span>
        </div>
        <div className={styles.statusContainer}>
          {isLive ? (
            <span className={styles.liveBadge}>
              <span className={styles.liveIndicator}></span>
              {matchStatus}
            </span>
          ) : (
            <span className={`${styles.statusText} ${isFinished ? styles.ftText : ''} ${isNotStarted ? styles.nsText : ''}`}>
              {matchStatus}
            </span>
          )}
        </div>
      </div>
      
      <div className={styles.teamsContainer}>
        <div className={styles.team}>
          <img src={teams.home.logo} alt={teams.home.name} className={styles.teamLogo} loading="lazy" />
          <span className={styles.teamName}>{teams.home.name}</span>
          <span className={`${styles.score} ${homeWins ? styles.scoreWinner : ''}`}>
            {goals.home !== null ? goals.home : '-'}
          </span>
        </div>
        
        <div className={styles.team}>
          <img src={teams.away.logo} alt={teams.away.name} className={styles.teamLogo} loading="lazy" />
          <span className={styles.teamName}>{teams.away.name}</span>
          <span className={`${styles.score} ${awayWins ? styles.scoreWinner : ''}`}>
            {goals.away !== null ? goals.away : '-'}
          </span>
        </div>
      </div>

      <div className={styles.footer}>
        <span className={styles.viewDetails}>
          View details <ChevronRight size={14} className={styles.viewArrow} />
        </span>
      </div>
    </Link>
  );
};
