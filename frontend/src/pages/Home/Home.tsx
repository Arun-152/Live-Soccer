import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Clock, Trophy, ChevronLeft, ChevronRight, CalendarDays, CheckCircle2 } from 'lucide-react';
import styles from './Home.module.css';
import { useLiveMatches, useMatchesByDate } from '../../hooks/useMatches';
import { MatchCard } from '../../components/matches/MatchCard';
import { Skeleton } from '../../components/ui/Skeleton';
import type { Match } from '../../types/football';

const TRENDING_LEAGUE_IDS = [39, 140, 61, 78, 135, 2, 3];

const formatDate = (date: Date) => date.toISOString().split('T')[0];
const formatDateLabel = (date: Date) =>
  date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

type FilterType = 'All' | 'Live' | 'Upcoming' | 'Finished';

export const Home = () => {
  const today = new Date();
  const [dateOffset, setDateOffset] = useState(0);
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');

  const selectedDate = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() + dateOffset);
    return d;
  }, [dateOffset]);

  const dateString = formatDate(selectedDate);
  const isToday = dateOffset === 0;

  const { data: liveMatches, isLoading: liveLoading } = useLiveMatches();
  const { data: todayMatches, isLoading: todayLoading } = useMatchesByDate(dateString);

  const trendingMatches = todayMatches?.filter(m => TRENDING_LEAGUE_IDS.includes(m.league.id)) || [];
  const upcomingMatches = todayMatches?.filter(m => m.fixture.status.short === 'NS') || [];
  const recentMatches = todayMatches?.filter(m => ['FT', 'AET', 'PEN'].includes(m.fixture.status.short)) || [];

  const renderSkeletonCards = (count: number, layout: 'horizontal' | 'vertical' = 'horizontal') => (
    <div className={layout === 'horizontal' ? styles.horizontalScroll : styles.verticalList}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} type="card" width={layout === 'horizontal' ? '280px' : '100%'} height="140px" />
      ))}
    </div>
  );

  const renderEmptyState = (icon: React.ReactNode, message: string) => (
    <div className={styles.emptyState}>
      <div className={styles.emptyIcon}>{icon}</div>
      <p>{message}</p>
    </div>
  );

  const renderMatchGrid = (matches: Match[]) => (
    <div className={styles.filteredGrid}>
      {matches.map(match => <MatchCard key={match.fixture.id} match={match} />)}
    </div>
  );

  return (
    <div className={styles.container}>
      {/* Date Navigator */}
      <div className={styles.dateNav}>
        <button className={styles.dateArrow} onClick={() => setDateOffset(o => o - 1)} aria-label="Previous day">
          <ChevronLeft size={20} />
        </button>
        <div className={styles.dateCenter}>
          <CalendarDays size={16} />
          <span className={styles.dateLabel}>
            {isToday ? 'Today' : formatDateLabel(selectedDate)}
          </span>
          <span className={styles.dateString}>{dateString}</span>
        </div>
        <button className={styles.dateArrow} onClick={() => setDateOffset(o => o + 1)} aria-label="Next day">
          <ChevronRight size={20} />
        </button>
        {!isToday && (
          <button className={styles.todayButton} onClick={() => setDateOffset(0)}>
            Today
          </button>
        )}
      </div>

      <div className={styles.filtersContainer}>
        {(['All', 'Live', 'Upcoming', 'Finished'] as FilterType[]).map(filter => (
          <button
            key={filter}
            className={`${styles.filterButton} ${activeFilter === filter ? styles.active : ''}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {(activeFilter === 'All' || activeFilter === 'Live') && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.liveIndicator}></span>
              Live Now
            </h2>
            {activeFilter === 'All' && (
              <Link to="/live" className={styles.viewAll}>
                View all <ChevronRight size={14} />
              </Link>
            )}
          </div>
          {liveLoading ? renderSkeletonCards(4, activeFilter === 'All' ? 'horizontal' : 'vertical') : (
            liveMatches && liveMatches.length > 0 ? (
              activeFilter === 'All' ? (
                <div className={styles.horizontalScroll}>
                  {liveMatches.map(match => <MatchCard key={match.fixture.id} match={match} />)}
                </div>
              ) : (
                renderMatchGrid(liveMatches)
              )
            ) : renderEmptyState(<Activity size={32} />, 'No live matches at the moment.')
          )}
        </section>
      )}

      {activeFilter === 'All' && trendingMatches.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <Trophy size={20} />
              Trending Matches
            </h2>
          </div>
          {todayLoading ? renderSkeletonCards(4) : (
            <div className={styles.horizontalScroll}>
              {trendingMatches.map(match => <MatchCard key={match.fixture.id} match={match} />)}
            </div>
          )}
        </section>
      )}

      {activeFilter === 'All' && (
        <div className={styles.gridContainer}>
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <Clock size={20} />
                Upcoming
              </h2>
              <span className={styles.matchCount}>{upcomingMatches.length}</span>
            </div>
            {todayLoading ? renderSkeletonCards(3, 'vertical') : (
              upcomingMatches.length > 0 ? (
                <div className={styles.verticalList}>
                  {upcomingMatches.slice(0, 6).map(match => <MatchCard key={match.fixture.id} match={match} />)}
                </div>
              ) : renderEmptyState(<Clock size={28} />, 'No upcoming fixtures.')
            )}
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <CheckCircle2 size={20} />
                Results
              </h2>
              <span className={styles.matchCount}>{recentMatches.length}</span>
            </div>
            {todayLoading ? renderSkeletonCards(3, 'vertical') : (
              recentMatches.length > 0 ? (
                <div className={styles.verticalList}>
                  {recentMatches.slice(0, 6).map(match => <MatchCard key={match.fixture.id} match={match} />)}
                </div>
              ) : renderEmptyState(<Trophy size={28} />, 'No results yet.')
            )}
          </section>
        </div>
      )}

      {activeFilter === 'Upcoming' && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <Clock size={20} />
              Upcoming Matches
            </h2>
            <span className={styles.matchCount}>{upcomingMatches.length}</span>
          </div>
          {todayLoading ? renderSkeletonCards(8, 'vertical') : (
            upcomingMatches.length > 0 ? (
              renderMatchGrid(upcomingMatches)
            ) : renderEmptyState(<Clock size={28} />, 'No upcoming fixtures for this date.')
          )}
        </section>
      )}

      {activeFilter === 'Finished' && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <CheckCircle2 size={20} />
              Finished Matches
            </h2>
            <span className={styles.matchCount}>{recentMatches.length}</span>
          </div>
          {todayLoading ? renderSkeletonCards(8, 'vertical') : (
            recentMatches.length > 0 ? (
              renderMatchGrid(recentMatches)
            ) : renderEmptyState(<Trophy size={28} />, 'No finished matches for this date.')
          )}
        </section>
      )}

    </div>
  );
};
