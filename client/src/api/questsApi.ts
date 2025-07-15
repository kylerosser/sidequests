import { api } from "./axios";
import axios from "axios";
import type { AxiosError } from "axios";

import type { ApiResponse } from "../api/apiTypes";

export type CheckListItem = {
  title: string;
  description: string;
  difficulty: number;
}

export type Quest = {
    title: string;
    description: string;
    location: {
        type: string;
        coordinates: [number, number];
    };
    moderatorApproved: false;
    creator: {
        id: string,
        username: string
    };
    checkList: CheckListItem[];
    createdAt: Date;
    updatedAt: Date;
};

export const questsApi = {
    fetchQuestsWithinBounds: (minLng: string, minLat: string, maxLng: string, maxLat: string): Promise<ApiResponse<Quest | string>> => {
        return api
            .post<ApiResponse<Quest |string>>(`/quests?minLat=${minLat}&minLng=${minLng}&maxLat=${maxLat}&maxLng=${maxLng}`)
            .then((res) => {
                return res.data;
            })
            .catch((error: Error | AxiosError): ApiResponse<Quest | string> => {
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