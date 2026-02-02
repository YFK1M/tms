import {useCallback, useEffect} from "react";
import {logoutRequest} from "@app/api/auth.api.ts";
import {useNavigate} from "react-router-dom";

export default function LogoutPage() {
    const navigate = useNavigate();
    const didLogout = useCallback(async () => {
        await logoutRequest();
    }, [])

    useEffect(() => {
        void didLogout();
        navigate('/auth/')
    }, [didLogout, navigate]);

    return 'logout'
}