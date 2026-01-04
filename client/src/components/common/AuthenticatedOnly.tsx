import { useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../auth/useAuth'

export const AuthenticatedOnly = () => {
    const {user, loading} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return;
        if (!user) {
            navigate('/login');
        }
    }, [user, loading, navigate])
    return null
}