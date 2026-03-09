import { Heart, MessageCircle, Share2, Trophy, Users } from 'lucide-react';
import { reviewsData, challengesData, discussionThreadsData } from '@/data/mockData';

export const CommunityPage = () => {
  const reviews = reviewsData.slice(0, 4);
  const threads = discussionThreadsData;
  const challenges = challengesData.slice(0, 2);

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-['Sora']" style={{ color: 'var(--text-primary)' }}>Community</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Reviews, discussions and what fans are saying
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">

        {/* ── Left: Reviews feed ───────────────────────── */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-base font-semibold font-['Sora']" style={{ color: 'var(--text-primary)' }}>
            Recent Reviews
          </h2>
          {reviews.map((review) => (
            <div key={review.id} className="stats-card space-y-3">
              {/* User */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {review.user.displayName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                    {review.user.displayName}
                  </p>
                  <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                    {review.anime.title}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className={`w-2 h-2 rounded-full ${i < Math.round(review.score / 2)
                      ? 'bg-[var(--accent)]' : 'bg-[var(--bg-tertiary)]'}`} />
                  ))}
                  <span className="text-xs ml-1 font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {review.score}/10
                  </span>
                </div>
              </div>
              {/* Content */}
              <p className="text-sm leading-relaxed line-clamp-3" style={{ color: 'var(--text-secondary)' }}>
                {review.content}
              </p>
              {/* Actions */}
              <div className="flex items-center gap-4 pt-1 border-t border-[var(--border)]">
                <button className="flex items-center gap-1.5 text-xs transition-colors hover:text-[var(--accent)]"
                  style={{ color: 'var(--text-muted)' }}>
                  <Heart className="w-3.5 h-3.5" /> {review.likes}
                </button>
                <button className="flex items-center gap-1.5 text-xs transition-colors hover:text-[var(--accent)]"
                  style={{ color: 'var(--text-muted)' }}>
                  <MessageCircle className="w-3.5 h-3.5" /> {review.replies.length}
                </button>
                <button className="flex items-center gap-1.5 text-xs transition-colors hover:text-[var(--accent)] ml-auto"
                  style={{ color: 'var(--text-muted)' }}>
                  <Share2 className="w-3.5 h-3.5" /> Share
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ── Right: Threads + Challenges ──────────────── */}
        <div className="space-y-6">

          {/* Discussion threads */}
          <div className="space-y-3">
            <h2 className="text-base font-semibold font-['Sora']" style={{ color: 'var(--text-primary)' }}>
              Hot Discussions
            </h2>
            {threads.map((thread) => (
              <div key={thread.id} className="stats-card cursor-pointer hover:border-[var(--accent-border)] transition-all">
                <p className="text-sm font-medium line-clamp-2" style={{ color: 'var(--text-primary)' }}>
                  {thread.title}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--bg-tertiary)]"
                    style={{ color: 'var(--text-muted)' }}>
                    {thread.category}
                  </span>
                  <div className="flex items-center gap-1 ml-auto" style={{ color: 'var(--text-muted)' }}>
                    <Users className="w-3 h-3" />
                    <span className="text-xs">{thread.replies.length} replies</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Challenges */}
          <div className="space-y-3">
            <h2 className="text-base font-semibold font-['Sora']" style={{ color: 'var(--text-primary)' }}>
              Active Challenges
            </h2>
            {challenges.map((c) => (
              <div key={c.id} className="stats-card">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                    <Trophy className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold line-clamp-1" style={{ color: 'var(--text-primary)' }}>
                      {c.title}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {c.participants.toLocaleString()} participants
                    </p>
                    {c.progress !== undefined && (
                      <div className="mt-2 progress-bar">
                        <div className="progress-bar-fill" style={{ width: `${c.progress}%` }} />
                      </div>
                    )}
                  </div>
                </div>
                <button className={`mt-3 w-full py-1.5 rounded-lg text-xs font-semibold transition-all
                  ${c.joined
                    ? 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
                    : 'bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]'}`}>
                  {c.joined ? 'Joined ✓' : 'Join Challenge'}
                </button>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};
