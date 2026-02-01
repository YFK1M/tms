import { Navigate } from 'react-router-dom';
import type { PropsWithChildren } from "react";
import {useAuthContext} from "@app/shared/auth/useAuthContext.ts";

export const ProtectedRoute = ({ children }: PropsWithChildren) => {
    const { isAuthenticated } = useAuthContext();

    if (!isAuthenticated) {
        return <Navigate to="/auth" replace />;
    }

    return children;
};
