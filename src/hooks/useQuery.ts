import { useState, useEffect, useCallback, useRef } from 'react';

export interface QueryState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export function useQuery<T>(
    fetcher: () => Promise<T>,
    deps: unknown[] = []
): QueryState<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [trigger, setTrigger] = useState(0);

    const fetcherRef = useRef(fetcher);
    fetcherRef.current = fetcher;

    const refetch = useCallback(() => setTrigger((n) => n + 1), []);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);

        fetcherRef
            .current()
            .then((res) => {
                if (!cancelled) {
                    setData(res);
                    setLoading(false);
                }
            })
            .catch((err: unknown) => {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : 'Erro inesperado');
                    setLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [trigger, ...deps]);

    return { data, loading, error, refetch };
}
