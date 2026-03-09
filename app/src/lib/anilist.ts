const ANILIST_URL = 'https://graphql.anilist.co';

export async function anilistQuery<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const res = await fetch(ANILIST_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`AniList error: ${res.status}`);
  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0].message);
  return json.data as T;
}

// ── Shared media fragment ───────────────────────────────────────────────────
const MEDIA_FIELDS = `
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
`;

// ── Queries ─────────────────────────────────────────────────────────────────

export const TRENDING_QUERY = `
  query Trending($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      media(sort: TRENDING_DESC, type: ANIME, isAdult: false) {
        ${MEDIA_FIELDS}
      }
    }
  }
`;

export const FEATURED_QUERY = `
  query Featured {
    Page(page: 1, perPage: 1) {
      media(sort: POPULARITY_DESC, type: ANIME, isAdult: false, status: RELEASING) {
        ${MEDIA_FIELDS}
      }
    }
  }
`;

export const SEARCH_QUERY = `
  query Search($search: String, $genre: String, $year: Int, $format: MediaFormat, $page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      pageInfo { total currentPage lastPage hasNextPage }
      media(
        search: $search
        genre: $genre
        seasonYear: $year
        format: $format
        type: ANIME
        isAdult: false
        sort: POPULARITY_DESC
      ) {
        ${MEDIA_FIELDS}
      }
    }
  }
`;

export const SEASONAL_QUERY = `
  query Seasonal($season: MediaSeason, $year: Int, $page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      media(season: $season, seasonYear: $year, type: ANIME, isAdult: false, sort: POPULARITY_DESC) {
        ${MEDIA_FIELDS}
      }
    }
  }
`;

export const SCHEDULE_QUERY = `
  query Schedule($weekStart: Int, $weekEnd: Int) {
    Page(page: 1, perPage: 50) {
      airingSchedules(airingAt_greater: $weekStart, airingAt_lesser: $weekEnd, sort: TIME) {
        airingAt
        episode
        media {
          ${MEDIA_FIELDS}
        }
      }
    }
  }
`;

// ── Types ────────────────────────────────────────────────────────────────────

export interface AniListMedia {
  id: number;
  title: { romaji: string; english: string | null };
  coverImage: { large: string; extraLarge: string };
  bannerImage: string | null;
  averageScore: number | null;
  episodes: number | null;
  format: string | null;
  status: string;
  season: string | null;
  seasonYear: number | null;
  genres: string[];
  studios: { nodes: { name: string }[] };
  description: string | null;
  nextAiringEpisode: { airingAt: number; episode: number } | null;
}

export interface AiringSchedule {
  airingAt: number;
  episode: number;
  media: AniListMedia;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

export function getTitle(media: AniListMedia): string {
  return media.title.english || media.title.romaji;
}

export function getRating(media: AniListMedia): string {
  return media.averageScore ? (media.averageScore / 10).toFixed(1) : 'N/A';
}

export function getStudio(media: AniListMedia): string {
  return media.studios.nodes[0]?.name ?? 'Unknown';
}

export function getCurrentSeason(): { season: string; year: number } {
  const month = new Date().getMonth() + 1;
  const year  = new Date().getFullYear();
  const season =
    month <= 3  ? 'WINTER' :
    month <= 6  ? 'SPRING' :
    month <= 9  ? 'SUMMER' : 'FALL';
  return { season, year };
}

export function getWeekRange(): { weekStart: number; weekEnd: number } {
  const now   = Math.floor(Date.now() / 1000);
  const start = now - (now % 86400); // start of today
  return { weekStart: start, weekEnd: start + 7 * 86400 };
}

export function groupByDay(schedules: AiringSchedule[]): Record<string, AiringSchedule[]> {
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const grouped: Record<string, AiringSchedule[]> = {};
  for (const s of schedules) {
    const day = days[new Date(s.airingAt * 1000).getDay()];
    if (!grouped[day]) grouped[day] = [];
    grouped[day].push(s);
  }
  return grouped;
}
