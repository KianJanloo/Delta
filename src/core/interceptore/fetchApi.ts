/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSession } from 'next-auth/react';
import { API_BASE_URL } from '@/core/config/constants';
import { refreshSession } from './tokenRefresh';

const parseJson = async (response: Response) => {
    const text = await response.text();
    if (!text) return null;

    try {
        return JSON.parse(text);
    } catch {
        return text as unknown as Record<string, unknown>;
    }
};

const buildHeaders = async (options: RequestInit = {}) => {
    const session = await getSession();
    const token = (session as any)?.accessToken as string | undefined;

    const headers = new Headers(options.headers || {});

    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
    }

    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
};

const performRequest = async (url: string, options: RequestInit, attempt = 0): Promise<any> => {
    const headers = await buildHeaders(options);

    const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers,
    });

    if ((response.status === 401 || response.status === 403) && attempt < 1) {
        const refreshed = await refreshSession();

        if (refreshed?.accessToken) {
            const retryHeaders = new Headers(options.headers || {});

            if (!retryHeaders.has('Content-Type') && !(options.body instanceof FormData)) {
                retryHeaders.set('Content-Type', 'application/json');
            }

            retryHeaders.set('Authorization', `Bearer ${refreshed.accessToken}`);

            return performRequest(url, { ...options, headers: retryHeaders }, attempt + 1);
        }

        throw new Error('Unauthorized');
    }

    const data = await parseJson(response);

    if (!response.ok) {
        const message = (data && typeof data === 'object' && 'message' in data)
            ? (data as Record<string, string>).message
            : `HTTP error! status: ${response.status}`;

        throw new Error(message);
    }

    return data;
};

export const fetchApi = {
    get: <T>(url: string, options?: RequestInit): Promise<T> =>
        performRequest(url, { ...options, method: 'GET' }),

    post: <T>(url: string, data?: any, options?: RequestInit): Promise<T> =>
        performRequest(url, {
            ...options,
            method: 'POST',
            body:
                data instanceof FormData
                    ? data
                    : typeof data === 'string'
                        ? data
                        : data !== undefined
                            ? JSON.stringify(data)
                            : undefined,
        }),

    put: <T>(url: string, data?: any, options?: RequestInit): Promise<T> =>
        performRequest(url, {
            ...options,
            method: 'PUT',
            body:
                data instanceof FormData
                    ? data
                    : typeof data === 'string'
                        ? data
                        : data !== undefined
                            ? JSON.stringify(data)
                            : undefined,
        }),

    delete: <T>(url: string, options?: RequestInit): Promise<T> =>
        performRequest(url, { ...options, method: 'DELETE' }),
}; 