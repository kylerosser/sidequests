import { useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../auth/useAuth'

export const AuthenticatedOnly = () => {
    const {user} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user])
    return null
}