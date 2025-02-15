
export const setToken = (token: string) => {
    localStorage.setItem('auth_token', token);
};

export const getToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('auth_token');
    }
    return null;
};

export const removeToken = () => {
    localStorage.removeItem('auth_token');
};

export const isAuthenticated = () => {
    return !!getToken();
};