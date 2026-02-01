export type AuthUser = {
    id: string;
    email: string;
    createdAt: string;
};

export type AuthContextValue = {
    user: AuthUser | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => void;
};