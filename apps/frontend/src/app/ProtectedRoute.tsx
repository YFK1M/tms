import { Navigate } from 'react-router-dom';
import type { PropsWithChildren } from "react";
import { useAuth } from "../shared/auth/useAuth.ts";

export const ProtectedRoute = ({ children }: PropsWithChildren) => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/auth" replace />;
    }

    return children;
};
