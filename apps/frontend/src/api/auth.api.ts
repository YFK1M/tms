import type { AuthResponse } from '@tms/shared-types/src/generated/types.gen.ts';

const API_URL = import.meta.env.VITE_API_URL;

export async function loginRequest(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
        throw new Error('Login failed');
    }

    return res.json();
}

export async function registerRequest(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
        throw new Error('Register failed');
    }

    return res.json();
}

export async function refreshRequest(): Promise<{ accessToken: string }> {
    const res = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
    });

    if (!res.ok) {
        throw new Error('Unauthorized');
    }

    return res.json();
}
