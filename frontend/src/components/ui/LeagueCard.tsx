import { Link } from 'react-router-dom';
import styles from './LeagueCard.module.css';
import type { League } from '../../types/football';

interface LeagueCardProps {
  league: League;
}

export const LeagueCard = ({ league }: LeagueCardProps) => {
  return (
    <Link to={`/league/${league.id}`} className={styles.card}>
      <div className={styles.logoContainer}>
        {league.logo && <img src={league.logo} alt={league.name} className={styles.logo} loading="lazy" />}
      </div>
      <div className={styles.info}>
        <h3 className={styles.name}>{league.name}</h3>
        <span className={styles.country}>{league.country}</span>
      </div>
    </Link>
  );
};
