import { createContext } from 'react';
import type {AuthContextValue} from "@app/shared/auth/auth.types.ts";

export const AuthContext = createContext<AuthContextValue | null>(null);
