import {getAccessToken, setAccessToken} from "@app/shared/auth/auth.token.service.ts";
import type {AccessToken} from '@tms/shared-types/src/generated/types.gen.ts';
import {refreshRequest} from "@app/api/auth.api.ts";

export const API_URL = import.meta.env.VITE_API_URL;

export async function apiRequest<TResponse>(method: string, url: string, body?: string): Promise<TResponse> {
    const token = getAccessToken();

    const res = await fetch(`${API_URL}${url}`, {
        method,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` })
        },
        body,
    });

    if (res.status === 401) {
        const { accessToken }: AccessToken = await refreshRequest()
        setAccessToken(accessToken);

        const retry = await fetch(`${API_URL}${url}`, {
            method,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body,
        });

        if (!retry.ok) throw new Error('Unauthorized');
        return retry.json();
    }

    if (!res.ok) {
        throw new Error('API error');
    }

    return res.json();
}

export async function apiPostRequest<TResponse>(url: string, body?: unknown): Promise<TResponse> {
    return await apiRequest('POST', url, JSON.stringify(body));
}

export async function apiPutRequest<TResponse>(url: string, body?: unknown): Promise<TResponse> {
    return await apiRequest('PUT', url, JSON.stringify(body));
}

export async function apiGetRequest<TResponse>(url: string): Promise<TResponse> {
    return await apiRequest('GET', url);
}

export async function apiDeleteRequest<TResponse>(url: string): Promise<TResponse> {
    return await apiRequest('DELETE', url);
}
