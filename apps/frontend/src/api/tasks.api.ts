import type {GetTasksData, PaginatedTasks, PostTasksData} from '@tms/shared-types/src/generated/types.gen.ts';
import {apiDeleteRequest, apiGetRequest, apiPostRequest, apiPutRequest} from "@app/api/api.ts";

export async function getTasks(query: GetTasksData['query']): Promise<PaginatedTasks> {
    return await apiGetRequest(`/tasks?limit=${query?.limit ?? 10}${query?.page ? `&page=${query.page}` : ''}${query?.search ? `&search=${query.search}` : ''}${query?.priority ? `&priority=${query.priority}` : ''}`)
}

export async function postTaskCreate(data: PostTasksData['body']) {
    return await apiPostRequest('/tasks', data)
}

export async function putTaskUpdateById(taskId: string, data: PostTasksData['body']) {
    return await apiPutRequest(`/tasks/${taskId}`, data)
}

export async function deleteTaskById(taskId: string) {
    return await apiDeleteRequest(`/tasks/${taskId}`)
}