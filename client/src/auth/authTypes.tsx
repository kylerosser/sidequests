export type User = {
    id: string;
    username: string;
    email: string;
};

export type AuthContextType = {
    user: User | null;
    loading: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
};