let accessToken: string | null = null;

export function setAccessToken(token: string) {
    accessToken = token;
}

export async function apiFetch(
    input: string,
    init?: RequestInit,
) {
    const res = await fetch(`http://localhost:3000/api/v1${input}`, {
        ...init,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
            ...init?.headers,
        },
    });

    if (res.status === 401) {
        const refresh = await fetch(
            'http://localhost:3000/api/v1/auth/refresh',
            { method: 'POST', credentials: 'include' },
        );

        if (refresh.ok) {
            const data = await refresh.json();
            setAccessToken(data.accessToken);
            return apiFetch(input, init);
        }
    }

    return res;
}
