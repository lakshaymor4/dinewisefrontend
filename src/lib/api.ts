import { getToken } from "./auth"
import { redirect } from 'next/navigation';

const BASE_URL = 'https://backend-dine-wise.vercel.app';

export const api = async (endpoint: string, options: RequestInit = {}) => {
    const token = getToken();

    const defaultHeaders: HeadersInit = {
        'Content-Type': 'application/json',
    };

    if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    });

    if (!response.ok) {
        if (response.status === 401) {
            redirect('/auth/login');

        }
        throw new Error('API request failed');
    }

    return response.json();
};