import { api } from "./axios";
import axios from "axios";
import type { AxiosError } from "axios";

import type { ApiResponse } from "../api/apiTypes";

// TODO: Refactor: move the loginWithEmail/logout api calls from AuthProvider into authApi

export const authApi = {
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
    }
}