import type { ApiResponse } from "../api/apiTypes";

export type User = {
    id: string;
    username: string;
    email: string;
};

export type AuthContextType = {
    user: User | null;
    loading: boolean;
    login: (username: string, password: string) => Promise<ApiResponse<User | string>>;
    logout: () => Promise<ApiResponse<string>>;
};