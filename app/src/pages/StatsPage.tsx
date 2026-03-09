import { Film, Clock, Star, Flame } from 'lucide-react';
import { currentUser, yearInReviewData } from '@/data/mockData';

export const StatsPage = () => {
  const stats = currentUser.stats;
  const review = yearInReviewData;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-['Sora']" style={{ color: 'var(--text-primary)' }}>Your Stats</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          {review.year} Year in Review
        </p>
      </div>

      {/* Key numbers */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Film,  label: 'Anime Completed', value: review.animeCompleted,                  color: '#4A6FA5' },
          { icon: Clock, label: 'Episodes Watched', value: review.episodesWatched.toLocaleString(), color: '#38BDF8' },
          { icon: Star,  label: 'Mean Score',       value: stats.meanScore,                        color: '#F59E0B' },
          { icon: Flame, label: 'Streak Days',      value: review.streakDays,                      color: '#EF4444' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="stats-card text-center">
            <div className="w-9 h-9 rounded-xl mx-auto mb-3 flex items-center justify-center"
              style={{ background: `${color}18` }}>
              <Icon className="w-4.5 h-4.5" style={{ color }} />
            </div>
            <p className="stats-number" style={{ color }}>{value}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Top genres */}
      <div className="stats-card space-y-4">
        <h2 className="font-semibold font-['Sora']" style={{ color: 'var(--text-primary)' }}>Top Genres</h2>
        {review.topGenres.map(({ genre, count }, i) => {
          const max = review.topGenres[0].count;
          return (
            <div key={genre}>
              <div className="flex justify-between text-sm mb-1">
                <span style={{ color: 'var(--text-primary)' }}>{genre}</span>
                <span style={{ color: 'var(--text-muted)' }}>{count} anime</span>
              </div>
              <div className="progress-bar">
                <div className="progress-bar-fill transition-all duration-700"
                  style={{ width: `${(count / max) * 100}%`, opacity: 1 - i * 0.15 }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Top studios */}
      <div className="stats-card space-y-3">
        <h2 className="font-semibold font-['Sora']" style={{ color: 'var(--text-primary)' }}>Top Studios</h2>
        {review.topStudios.map(({ studio, count }) => (
          <div key={studio} className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0">
            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{studio}</span>
            <span className="pill">{count} watched</span>
          </div>
        ))}
      </div>

      {/* Badges */}
      <div className="stats-card space-y-3">
        <h2 className="font-semibold font-['Sora']" style={{ color: 'var(--text-primary)' }}>Badges Earned</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {currentUser.badges.map((badge) => (
            <div key={badge.id} className={`badge flex-col items-start gap-1 p-3 badge-rarity-${badge.rarity}`}>
              <span className="text-xl">{badge.icon}</span>
              <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{badge.name}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{badge.description}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
