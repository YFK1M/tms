import type {AccessToken, AuthResponse} from '@tms/shared-types/src/generated/types.gen.ts';
import {API_URL, apiPostRequest} from "@app/api/api.ts";

export async function loginRequest(email: string, password: string): Promise<AuthResponse> {
    return await apiPostRequest<AuthResponse>('/auth/login', { email, password })
}

export async function registerRequest(email: string, password: string): Promise<AuthResponse> {
    return await apiPostRequest<AuthResponse>('/auth/register', { email, password })
}

export async function refreshRequest(): Promise<AccessToken> {
    const newTokenResponse = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!newTokenResponse.ok) {
        throw new Error('Unauthorized');
    }

    return newTokenResponse.json();
}
