import { useState } from 'react';
import { Plus, Star, MoreHorizontal, BookMarked } from 'lucide-react';
import { watchlistData, currentUser } from '@/data/mockData';
import type { WatchStatus } from '@/types';

const TABS: { id: WatchStatus; label: string }[] = [
  { id: 'watching',      label: 'Watching'       },
  { id: 'completed',     label: 'Completed'       },
  { id: 'plan_to_watch', label: 'Plan to Watch'   },
  { id: 'on_hold',       label: 'On Hold'         },
  { id: 'dropped',       label: 'Dropped'         },
];

const STATUS_COUNTS: Record<WatchStatus, number> = {
  watching:      currentUser.stats.watching,
  completed:     currentUser.stats.completed,
  plan_to_watch: currentUser.stats.planToWatch,
  on_hold:       currentUser.stats.onHold,
  dropped:       currentUser.stats.dropped,
};

export const ListsPage = () => {
  const [activeTab, setActiveTab] = useState<WatchStatus>('watching');
  const filtered = watchlistData.filter((e) => e.status === activeTab);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-['Sora']" style={{ color: 'var(--text-primary)' }}>My Lists</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            {currentUser.stats.totalAnime} anime tracked
          </p>
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4" /> Add Anime
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
        {TABS.map(({ id, label }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={`stats-card text-center transition-all ${activeTab === id ? 'border-[var(--accent)] bg-[var(--accent-subtle)]' : ''}`}>
            <p className="stats-number text-2xl">{STATUS_COUNTS[id]}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
          </button>
        ))}
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 border-b border-[var(--border)] overflow-x-auto">
        {TABS.map(({ id, label }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-all -mb-px
              ${activeTab === id
                ? 'border-[var(--accent)] text-[var(--accent)]'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>
            {label}
            <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full bg-[var(--bg-tertiary)]"
              style={{ color: 'var(--text-muted)' }}>
              {STATUS_COUNTS[id]}
            </span>
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length > 0 ? (
        <div className="space-y-2">
          {filtered.map((entry) => (
            <div key={entry.id} className="watchlist-row">
              <img src={entry.anime.coverImage} alt={entry.anime.title}
                className="w-12 h-16 object-cover rounded-lg shrink-0" />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                  {entry.anime.title}
                </h4>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {entry.anime.type} • {entry.anime.episodes || '?'} EP
                </p>
                {/* Progress bar */}
                {entry.anime.episodes && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="progress-bar flex-1">
                      <div className="progress-bar-fill"
                        style={{ width: `${(entry.progress / entry.anime.episodes) * 100}%` }} />
                    </div>
                    <span className="text-xs shrink-0" style={{ color: 'var(--text-muted)' }}>
                      {entry.progress}/{entry.anime.episodes}
                    </span>
                  </div>
                )}
              </div>
              {entry.score && (
                <div className="flex items-center gap-1 shrink-0">
                  <Star className="w-3.5 h-3.5 fill-[var(--accent)] text-[var(--accent)]" />
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {entry.score}
                  </span>
                </div>
              )}
              <button className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] transition-all shrink-0"
                style={{ color: 'var(--text-muted)' }}>
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <BookMarked className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
          <p className="font-semibold" style={{ color: 'var(--text-secondary)' }}>Nothing here yet</p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Add anime to this list to track your progress</p>
          <button className="btn-primary mt-4"><Plus className="w-4 h-4" /> Add Anime</button>
        </div>
      )}

    </div>
  );
};
