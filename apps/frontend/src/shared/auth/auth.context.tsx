import { createContext, useContext, useEffect, useState } from 'react';
import { loginRequest, registerRequest, refreshRequest } from '@app/api/auth.api';

type AuthUser = {
    id: string;
    email: string;
    createdAt: string;
};

type AuthContextValue = {
    user: AuthUser | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [initialized, setInitialized] = useState(false);

    async function login(email: string, password: string) {
        const data = await loginRequest(email, password);
        setUser({ id: data.id as string, email: data.email as string, createdAt: data.createdAt as string });
        setAccessToken(data.accessToken);
    }

    async function register(email: string, password: string) {
        const data = await registerRequest(email, password);
        setUser({ id: data.id as string, email: data.email as string, createdAt: data.createdAt as string });
        setAccessToken(data.accessToken);
    }

    function logout() {
        setUser(null);
        setAccessToken(null);
    }

    // silent refresh on app start
    useEffect(() => {
        (async () => {
            try {
                const { accessToken } = await refreshRequest();
                setAccessToken(accessToken);
            } catch {
                logout();
            } finally {
                setInitialized(true);
            }
        })();
    }, []);

    if (!initialized) {
        return null; // или лоадер
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                accessToken,
                isAuthenticated: !!accessToken,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth must be used inside AuthProvider');
    }
    return ctx;
};
