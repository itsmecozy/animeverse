export interface Anime {
  id: string;
  title: string;
  englishTitle?: string;
  synopsis: string;
  coverImage: string;
  bannerImage?: string;
  type: 'TV' | 'Movie' | 'OVA' | 'ONA' | 'Special';
  episodes?: number;
  duration?: number;
  status: 'Ongoing' | 'Finished' | 'Not Yet Aired';
  season?: 'Winter' | 'Spring' | 'Summer' | 'Fall';
  year?: number;
  genres: string[];
  studios: string[];
  rating?: number;
  popularity?: number;
  source?: string;
  aired?: {
    from?: string;
    to?: string;
  };
}

export interface Manga {
  id: string;
  title: string;
  englishTitle?: string;
  synopsis: string;
  coverImage: string;
  type: 'Manga' | 'Light Novel' | 'One Shot';
  chapters?: number;
  volumes?: number;
  status: 'Ongoing' | 'Finished' | 'Not Yet Published';
  genres: string[];
  authors: string[];
  rating?: number;
  popularity?: number;
}

export type WatchStatus = 'watching' | 'completed' | 'on_hold' | 'dropped' | 'plan_to_watch';

export interface WatchlistEntry {
  id: string;
  animeId: string;
  status: WatchStatus;
  progress: number;
  score?: number;
  startDate?: string;
  finishDate?: string;
  rewatchCount: number;
  notes?: string;
  anime: Anime;
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  joinedAt: string;
  stats: UserStats;
  badges: Badge[];
}

export interface UserStats {
  totalAnime: number;
  totalEpisodes: number;
  totalManga: number;
  totalChapters: number;
  meanScore: number;
  watching: number;
  completed: number;
  onHold: number;
  dropped: number;
  planToWatch: number;
  topGenres: { genre: string; count: number }[];
  topStudios: { studio: string; count: number }[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Review {
  id: string;
  userId: string;
  animeId: string;
  content: string;
  score: number;
  likes: number;
  replies: ReviewReply[];
  createdAt: string;
  user: User;
  anime: Anime;
}

export interface ReviewReply {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
  user: User;
}

export interface Activity {
  id: string;
  userId: string;
  type: 'watched' | 'completed' | 'dropped' | 'reviewed' | 'scored' | 'plan_to_watch';
  animeId?: string;
  mangaId?: string;
  details?: string;
  createdAt: string;
  user: User;
  anime?: Anime;
  manga?: Manga;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'seasonal' | 'thematic' | 'streak';
  startDate: string;
  endDate: string;
  requirements: ChallengeRequirement[];
  rewards: Badge[];
  participants: number;
  progress?: number;
  joined: boolean;
  thumbnail: string;
}

export interface ChallengeRequirement {
  type: 'watch_count' | 'genre_count' | 'studio_count' | 'streak_days';
  target: number;
  current: number;
}

export interface CuratedList {
  id: string;
  userId: string;
  title: string;
  description: string;
  animeIds: string[];
  likes: number;
  comments: number;
  isPublic: boolean;
  createdAt: string;
  user: User;
  anime: Anime[];
}

export interface DiscussionThread {
  id: string;
  title: string;
  content: string;
  userId: string;
  category: string;
  replies: DiscussionReply[];
  views: number;
  createdAt: string;
  user: User;
}

export interface DiscussionReply {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
  user: User;
}

export interface GenreData {
  name: string;
  count: number;
  anime: Anime[];
  color: string;
}

export interface TimelineEntry {
  date: string;
  anime: Anime;
  status: WatchStatus;
  progress: number;
}

export interface YearInReview {
  year: number;
  animeCompleted: number;
  episodesWatched: number;
  minutesWatched: number;
  topGenres: { genre: string; count: number }[];
  topStudios: { studio: string; count: number }[];
  topAnime: Anime[];
  badgesEarned: Badge[];
  streakDays: number;
}
