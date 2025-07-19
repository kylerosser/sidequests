import { api } from "./axios";
import axios from "axios";
import type { AxiosError } from "axios";

import type { ApiResponse } from "../api/apiTypes";

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
    }
}