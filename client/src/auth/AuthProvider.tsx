import React, { useEffect, useState, useMemo, useCallback } from "react";
import { api } from "../api/axios";
import axios from "axios";
import type { AxiosError } from "axios";

import { AuthContext } from './AuthContext';

import type { User } from './authTypes';
import type { ApiResponse } from "../api/apiTypes";
import { authApi } from "../api/authApi";

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

    const login = useCallback((identifier: string, password: string): Promise<ApiResponse<User | string>> => {
        return api
            .post<ApiResponse<User | string>>("/auth/login/email", { identifier, password })
            .then((res) => {
                if (res.data.success) {
                    setUser(res.data.data as User);
                }
                return res.data;
            })
            .catch((error: Error | AxiosError): ApiResponse<User | string> => {
                if (axios.isAxiosError(error) && error.response?.data) {
                    return error.response.data as ApiResponse<User>;
                }
                return {
                    success: false,
                    data: "An unknown error occurred",
                };
            });
    }, []);

    const loginWithGoogle = useCallback(async (code: string): Promise<ApiResponse<User | string>> => {
        const requestResponse = await authApi.loginWithGoogle(code);
        if (requestResponse.success) {
            setUser(requestResponse.data as User);
        }
        return requestResponse;
    }, []);

    const logout = useCallback((): Promise<ApiResponse<string>> => {
        return api.post<ApiResponse<string>>("/auth/logout")
            .then((res) => {
                if (res.data.success) {
                    setUser(null);
                }
                return res.data;
            })
            .catch((error: Error | AxiosError): ApiResponse<string> => {
                if (axios.isAxiosError(error) && error.response?.data) {
                    return error.response.data as ApiResponse<string>;
                }
                return {
                    success: false,
                    data: "An unknown error occurred",
                };
            });
    }, []);

    return (
        <AuthContext.Provider
            value={useMemo(() => ({ user, loading, login, loginWithGoogle, logout }), [user, loading, login, loginWithGoogle, logout])}
        >
        {children}
        </AuthContext.Provider>
    );
};

