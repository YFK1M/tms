import {useCallback, useEffect, useState} from 'react';

type ApiFn<T> = () => Promise<T>;

type HookReturnType<TApiModel> = [
    TApiModel | null,
    boolean,
    () => void
];

export function useApiGetHandler<T>(apiFn: ApiFn<T>): HookReturnType<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const didFetch = useCallback(async () => {
        try {
            setLoading(true);

            const res = await apiFn();
            setData(res);
        } catch (err) {
            console.error(err);
        } finally {
           setLoading(false);
        }
    }, [apiFn])

    useEffect(() => {
        void didFetch();
    }, [apiFn, didFetch]);


    return [data, loading, didFetch];
}
