import { apiFetch } from './http';

export async function getTasks(params: {
    status?: string;
    sortBy?: string;
    order?: string;
}) {
    const q = new URLSearchParams(params as any).toString();
    const res = await apiFetch(`/tasks?${q}`);
    return res.json();
}
