import { Trophy, Users, Check, Clock } from 'lucide-react';
import { challengesData } from '@/data/mockData';

export const ChallengesPage = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold font-['Sora']" style={{ color: 'var(--text-primary)' }}>Challenges</h1>
      <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
        Join seasonal watch challenges and earn badges
      </p>
    </div>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {challengesData.map((c) => (
        <div key={c.id} className="stats-card-large flex flex-col gap-4">
          <div className="relative rounded-xl overflow-hidden h-32">
            <img src={c.thumbnail} alt={c.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-2 left-3">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 capitalize">
                {c.type}
              </span>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-base font-['Sora']" style={{ color: 'var(--text-primary)' }}>{c.title}</h3>
            <p className="text-sm mt-1 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{c.description}</p>
          </div>
          <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
            <div className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {c.participants.toLocaleString()}</div>
            <div className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Ends {new Date(c.endDate).toLocaleDateString()}</div>
          </div>
          {c.progress !== undefined && (
            <div>
              <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                <span>Progress</span><span>{c.progress}%</span>
              </div>
              <div className="progress-bar"><div className="progress-bar-fill" style={{ width: `${c.progress}%` }} /></div>
            </div>
          )}
          <button className={`w-full py-2 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2
            ${c.joined ? 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]' : 'bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]'}`}>
            {c.joined ? <><Check className="w-4 h-4" /> Joined</> : <><Trophy className="w-4 h-4" /> Join Challenge</>}
          </button>
        </div>
      ))}
    </div>
  </div>
);
