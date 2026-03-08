import { useState, useCallback } from 'react';
import { watchlistData } from '@/data/mockData';
import type { WatchlistEntry, WatchStatus } from '@/types';

export const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState<WatchlistEntry[]>(watchlistData);

  const addToWatchlist = useCallback((animeId: string, status: WatchStatus = 'plan_to_watch') => {
    // Mock add
    console.log('Added to watchlist:', animeId, status);
  }, []);

  const updateProgress = useCallback((entryId: string, progress: number) => {
    setWatchlist(prev =>
      prev.map(entry =>
        entry.id === entryId ? { ...entry, progress } : entry
      )
    );
  }, []);

  const updateStatus = useCallback((entryId: string, status: WatchStatus) => {
    setWatchlist(prev =>
      prev.map(entry =>
        entry.id === entryId ? { ...entry, status } : entry
      )
    );
  }, []);

  const updateScore = useCallback((entryId: string, score: number) => {
    setWatchlist(prev =>
      prev.map(entry =>
        entry.id === entryId ? { ...entry, score } : entry
      )
    );
  }, []);

  const getByStatus = useCallback((status: WatchStatus) => {
    return watchlist.filter(entry => entry.status === status);
  }, [watchlist]);

  const getStats = useCallback(() => {
    const total = watchlist.length;
    const watching = watchlist.filter(e => e.status === 'watching').length;
    const completed = watchlist.filter(e => e.status === 'completed').length;
    const onHold = watchlist.filter(e => e.status === 'on_hold').length;
    const dropped = watchlist.filter(e => e.status === 'dropped').length;
    const planToWatch = watchlist.filter(e => e.status === 'plan_to_watch').length;
    const totalEpisodes = watchlist.reduce((sum, e) => sum + e.progress, 0);
    const meanScore = watchlist.filter(e => e.score).reduce((sum, e) => sum + (e.score || 0), 0) / watchlist.filter(e => e.score).length || 0;

    return {
      total,
      watching,
      completed,
      onHold,
      dropped,
      planToWatch,
      totalEpisodes,
      meanScore: Math.round(meanScore * 10) / 10,
    };
  }, [watchlist]);

  return {
    watchlist,
    addToWatchlist,
    updateProgress,
    updateStatus,
    updateScore,
    getByStatus,
    getStats,
  };
};
