import { api } from "./axios";
import axios from "axios";
import type { AxiosError } from "axios";

import type { User } from '../auth/authTypes';
import type { ApiResponse } from "../api/apiTypes";

// TODO: Refactor: move the loginWithEmail/logout api calls from AuthProvider into authApi
// TODO: Refactor: create generic util functions for error handling

export const authApi = {
    loginWithGoogle: (code: string): Promise<ApiResponse<User | string>> => {
        return api
            .post<ApiResponse<User |string>>("/auth/login/google", { code })
            .then((res) => {
                return res.data;
            })
            .catch((error: Error | AxiosError): ApiResponse<User | string> => {
                if (axios.isAxiosError(error) && error.response?.data) {
                    return error.response.data as ApiResponse<string>;
                }
                return {
                    success: false,
                    data: "An unknown error occurred",
                };
            });
    },
    signupWithEmail: (username: string, email: string, password: string): Promise<ApiResponse<string>> => {
        return api
            .post<ApiResponse<string>>("/auth/signup/email", { username, email, password })
            .then((res) => {
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
    },
    verifyEmail: (token: string): Promise<ApiResponse<string>> => {
        return api
            .post<ApiResponse<string>>("/auth/verify", { token })
            .then((res) => {
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
    },
    requestPasswordResetEmail: (email: string) => {
        return api
            .post<ApiResponse<string>>("/auth/forgot-password", { email })
            .then((res) => {
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
    },
    resetPassword: (token: string, newPassword: string) => {
        return api
            .post<ApiResponse<string>>("/auth/reset-password", { token, newPassword })
            .then((res) => {
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
    },
}