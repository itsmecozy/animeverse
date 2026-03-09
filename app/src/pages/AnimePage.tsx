import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Play, BookMarked } from 'lucide-react';
import { Spinner, ErrorState } from '@/components/Spinner';
import { anilistQuery, getTitle, getRating, getStudio } from '@/lib/anilist';
import type { AniListMedia } from '@/lib/anilist';
import { useState, useEffect } from 'react';

const DETAIL_QUERY = `
  query Detail($id: Int) {
    Media(id: $id, type: ANIME) {
      id
      title { romaji english }
      coverImage { large extraLarge }
      bannerImage
      averageScore
      episodes
      format
      status
      season
      seasonYear
      genres
      studios(isMain: true) { nodes { name } }
      description(asHtml: false)
      nextAiringEpisode { airingAt episode }
      characters(sort: ROLE, perPage: 6) {
        nodes { name { full } image { medium } }
      }
      relations {
        edges {
          relationType
          node { id title { romaji english } coverImage { large } format }
        }
      }
    }
  }
`;

interface DetailMedia extends AniListMedia {
  characters: { nodes: { name: { full: string }; image: { medium: string } }[] };
  relations: {
    edges: {
      relationType: string;
      node: { id: number; title: { romaji: string; english: string | null }; coverImage: { large: string }; format: string | null };
    }[];
  };
}

interface DetailData { Media: DetailMedia }

function splitTitle(title: string): [string, string] {
  const words = title.trim().split(' ');
  if (words.length === 1) return ['', title];
  return [words.slice(0, -1).join(' ') + ' ', words[words.length - 1]];
}

function cleanDesc(desc: string): string {
  return desc.replace(/<[^>]*>/g, '').replace(/\n/g, ' ').trim();
}

export const AnimePage = () => {
  const { id }   = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData]     = useState<DetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    anilistQuery<DetailData>(DETAIL_QUERY, { id: parseInt(id) })
      .then((d) => { setData(d); setLoading(false); })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, [id]);

  if (loading) return <Spinner message="Loading anime..." />;
  if (error || !data) return <ErrorState message={error ?? 'Not found'} onRetry={() => navigate(-1)} />;

  const media  = data.Media;
  const title  = getTitle(media);
  const [titleMain, titleAccent] = splitTitle(title);
  const rating  = getRating(media);
  const studio  = getStudio(media);
  const desc    = media.description ? cleanDesc(media.description) : '';
  const statusLabel = media.status === 'RELEASING' ? 'Airing' : media.status === 'FINISHED' ? 'Finished' : media.status === 'NOT_YET_RELEASED' ? 'Upcoming' : media.status;

  return (
    <div className="-mt-8 -mx-4 md:-mx-8">

      {/* ── Cinematic Hero ──────────────────────────────────────── */}
      <div className="detail-hero">
        <img
          src={media.bannerImage ?? media.coverImage.extraLarge}
          alt={title}
          className="detail-hero-img"
        />
        <div className="detail-hero-overlay" />

        {/* Ghost episode/year number */}
        <div className="ghost-number absolute right-8 bottom-0 leading-none hidden md:block"
          style={{ fontSize: '22rem', opacity: 0.10 }}>
          {media.episodes ?? media.seasonYear}
        </div>

        {/* Back button */}
        <button onClick={() => navigate(-1)}
          className="absolute top-6 left-6 flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-white bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-all">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Bottom-left: status metadata */}
        <div className="absolute bottom-6 left-6 flex flex-wrap gap-2">
          <span className="card-meta-tl relative static text-xs">{statusLabel}</span>
          {media.format && <span className="card-meta-tl relative static text-xs">{media.format}</span>}
        </div>

        {/* Bottom-right: genre metadata */}
        <div className="absolute bottom-6 right-6 flex flex-wrap gap-2 justify-end">
          {media.genres.slice(0, 3).map((g) => (
            <span key={g} className="card-meta-br relative static text-xs">{g}</span>
          ))}
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────── */}
      <div className="px-4 md:px-8 pb-16">
        <div className="max-w-5xl mx-auto">

          {/* Title + Actions */}
          <div className="flex flex-col md:flex-row md:items-end gap-6 mt-8 mb-8">
            {/* Cover + title */}
            <div className="flex gap-5 items-end flex-1">
              <img src={media.coverImage.extraLarge} alt={title}
                className="w-28 md:w-36 rounded-xl border border-[var(--border-strong)] shadow-lg shrink-0 -mt-16 relative z-10" />
              <div>
                <span className="label-text text-[var(--accent)]">{studio}</span>
                <h1 className="cinematic-title text-2xl md:text-4xl mt-1">
                  {titleMain}<span className="title-accent">{titleAccent}</span>
                </h1>
                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <span className="text-2xl font-black" style={{ color: 'var(--accent)' }}>★ {rating}</span>
                  <span className="pill">{media.seasonYear}</span>
                  {media.episodes && <span className="pill">{media.episodes} EP</span>}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 shrink-0">
              <button className="btn-primary"><Plus className="w-4 h-4" /> Add to List</button>
              <button className="btn-secondary"><BookMarked className="w-4 h-4" /></button>
              <button className="btn-secondary"><Play className="w-4 h-4" /></button>
            </div>
          </div>

          {/* Two-column layout */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Left: description + characters */}
            <div className="md:col-span-2 space-y-8">
              {desc && (
                <div>
                  <h2 className="text-base font-bold mb-3 font-['Sora']" style={{ color: 'var(--text-primary)' }}>Synopsis</h2>
                  <p className="text-sm leading-relaxed line-clamp-6" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
                </div>
              )}

              {/* Characters */}
              {media.characters.nodes.length > 0 && (
                <div>
                  <h2 className="text-base font-bold mb-3 font-['Sora']" style={{ color: 'var(--text-primary)' }}>Characters</h2>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {media.characters.nodes.map((char, i) => (
                      <div key={i} className="text-center">
                        <img src={char.image.medium} alt={char.name.full}
                          className="w-full aspect-square object-cover rounded-xl border border-[var(--border)]" />
                        <p className="text-xs mt-1.5 font-medium line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                          {char.name.full}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: info + relations */}
            <div className="space-y-6">
              {/* Info card */}
              <div className="stats-card space-y-3">
                <h2 className="text-sm font-bold font-['Sora']" style={{ color: 'var(--text-primary)' }}>Info</h2>
                {[
                  { label: 'Studio',   value: studio },
                  { label: 'Season',   value: media.season ? `${media.season[0]}${media.season.slice(1).toLowerCase()} ${media.seasonYear}` : '—' },
                  { label: 'Format',   value: media.format ?? '—' },
                  { label: 'Episodes', value: media.episodes ? String(media.episodes) : '—' },
                  { label: 'Status',   value: statusLabel },
                  { label: 'Score',    value: media.averageScore ? `${media.averageScore}/100` : '—' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center py-1.5 border-b border-[var(--border)] last:border-0">
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</span>
                    <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{value}</span>
                  </div>
                ))}
              </div>

              {/* Genres */}
              <div className="stats-card">
                <h2 className="text-sm font-bold mb-3 font-['Sora']" style={{ color: 'var(--text-primary)' }}>Genres</h2>
                <div className="flex flex-wrap gap-1.5">
                  {media.genres.map((g) => <span key={g} className="pill">{g}</span>)}
                </div>
              </div>

              {/* Related */}
              {media.relations.edges.length > 0 && (
                <div className="space-y-2">
                  <h2 className="text-sm font-bold font-['Sora']" style={{ color: 'var(--text-primary)' }}>Related</h2>
                  {media.relations.edges.slice(0, 4).map((edge, i) => (
                    <button key={i} onClick={() => navigate(`/anime/${edge.node.id}`)}
                      className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-all text-left">
                      <img src={edge.node.coverImage.large} alt=""
                        className="w-10 h-12 object-cover rounded-md shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                          {edge.node.title.english ?? edge.node.title.romaji}
                        </p>
                        <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                          {edge.relationType.replace(/_/g, ' ')}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
