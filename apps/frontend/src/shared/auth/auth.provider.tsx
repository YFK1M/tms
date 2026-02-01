import {useEffect, useState} from "react";
import {loginRequest, refreshRequest, registerRequest} from "@app/api/auth.api.ts";
import {AuthContext} from "@app/shared/auth/auth.context.tsx";
import type {AuthUser} from "@app/shared/auth/auth.types.ts";
import {getAccessToken, setAccessToken} from "@app/shared/auth/auth.token.service.ts";
import {useNavigate} from "react-router-dom";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState<AuthUser | null>(null);
    const [initialized, setInitialized] = useState(false);
    const accessToken = getAccessToken();

    async function login(email: string, password: string) {
        const data = await loginRequest(email, password);
        setUser({ id: data.id as string, email: data.email as string, createdAt: data.createdAt as string });
        setAccessToken(data.accessToken);
        navigate('/');
    }

    async function register(email: string, password: string) {
        const data = await registerRequest(email, password);
        setUser({ id: data.id as string, email: data.email as string, createdAt: data.createdAt as string });
        setAccessToken(data.accessToken);
        navigate('/');
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
        return null;
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
