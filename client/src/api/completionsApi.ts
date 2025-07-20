import { api } from "./axios";
import axios from "axios";
import type { AxiosError } from "axios";

import type { ApiResponse } from "../api/apiTypes";

export type Completion = {
    id: string;
    comment: string;
    completer: string;
    completedQuest: string;
    checkListIndex: number;
    createdAt: string;
}

export const completionsApi = {
    logNewCompletion: (completedQuest: string, comment: string, checkListIndex: number) => {
        return api
            .post<ApiResponse<string>>(`/completions`, {completedQuest, comment, checkListIndex})
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
    fetchCompletions: (completedQuest: string | undefined, completer: string | undefined, cursor: string | undefined, limit: number | undefined) => {
        const params = { completedQuest, completer, cursor, limit }
        return api
            .get<ApiResponse<Completion[] | string>>('/completions', { params })
            .then((res) => {
                return res.data;
            })
            .catch((error: Error | AxiosError): ApiResponse<Completion[] | string> => {
                if (axios.isAxiosError(error) && error.response?.data) {
                    return error.response.data as ApiResponse<Completion[] | string>;
                }
                return {
                    success: false,
                    data: "An unknown error occurred",
                };
            });
    }
}