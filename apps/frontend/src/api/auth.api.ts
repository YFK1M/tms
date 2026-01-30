import { apiFetch, setAccessToken } from './http';

export async function login(email: string, password: string) {
    const res = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error('Login failed');

    const data = await res.json();
    setAccessToken(data.accessToken);
    return data;
}
