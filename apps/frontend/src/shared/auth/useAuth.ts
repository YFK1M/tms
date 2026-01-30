import { useAuthContext } from './auth.context';

export const useAuth = () => {
    const {
        user,
        accessToken,
        isAuthenticated,
        login,
        register,
        logout,
    } = useAuthContext();

    return {
        user,
        accessToken,
        isAuthenticated,
        login,
        register,
        logout,
    };
};