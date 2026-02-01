import {useContext} from "react";
import {AuthContext} from "@app/shared/auth/auth.context.tsx";

export const useAuthContext = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth must be used inside AuthProvider');
    }
    return ctx;
};