import React, { useEffect, useState } from "react";
import { api } from "../api/axios";

import { AuthContext } from './AuthContext';

import type { User } from './authTypes';
import type { ApiResponse } from "../api/apiTypes";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch current user on mount
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get<ApiResponse<User>>("/users/me");
                setUser(res.data.data);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const login = async (identifier: string, password: string) => {
        const res = await api.post<ApiResponse<User>>("/auth/login", { identifier, password });
        setUser(res.data.data); // save public user info
    };

    const logout = async () => {
        await api.post("/logout");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
        {children}
        </AuthContext.Provider>
    );
};

