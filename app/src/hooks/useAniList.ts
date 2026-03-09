import { useState, useEffect, useRef } from 'react';
import { anilistQuery } from '@/lib/anilist';

interface UseAniListResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useAniList<T>(
  query: string,
  variables?: Record<string, unknown>
): UseAniListResult<T> {
  const [data,    setData]    = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const [tick,    setTick]    = useState(0);

  // stable ref so variables changes re-fetch correctly
  const variablesRef = useRef(variables);
  variablesRef.current = variables;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    anilistQuery<T>(query, variablesRef.current)
      .then((result) => { if (!cancelled) { setData(result); setLoading(false); } })
      .catch((err)   => { if (!cancelled) { setError(err.message); setLoading(false); } });

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, tick]);

  const refetch = () => setTick((t) => t + 1);

  return { data, loading, error, refetch };
}
