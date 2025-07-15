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
    id: string;
    title: string;
    description: string;
    location: {
        type: string;
        coordinates: [number, number];
    };
    creator: {
        id: string,
        username: string
    };
    checkList: CheckListItem[];
    createdAt: Date;
};

export type QuestMarkerInfo = {
    id: string;
    title: string;
    location: {
        type: string;
        coordinates: [number, number];
    };
};

export const questsApi = {
    fetchQuestsWithinBounds: (minLng: number, minLat: number, maxLng: number, maxLat: number): Promise<ApiResponse<QuestMarkerInfo[] | string>> => {
        return api
            .get<ApiResponse<QuestMarkerInfo[] | string>>(`/quests?minLat=${minLat}&minLng=${minLng}&maxLat=${maxLat}&maxLng=${maxLng}`)
            .then((res) => {
                return res.data;
            })
            .catch((error: Error | AxiosError): ApiResponse<QuestMarkerInfo[] | string> => {
                if (axios.isAxiosError(error) && error.response?.data) {
                    return error.response.data as ApiResponse<string>;
                }
                return {
                    success: false,
                    data: "An unknown error occurred",
                };
            });
    },
    fetchQuestById: (id: string) => {
        return api
            .get<ApiResponse<Quest | string>>(`/quests/${id}`)
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
    }
}