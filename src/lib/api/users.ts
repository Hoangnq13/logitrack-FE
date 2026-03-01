import api from '@/services/api';

export interface User {
    _id: string;
    firebaseUid: string;
    email?: string;
    phoneNumber?: string;
    fullName?: string;
    roles: string[];
    isActive: boolean;
}

export const userApi = {
    getAll: async (): Promise<User[]> => {
        const response = await api.get(`/auth/users`);
        return response.data.data || response.data;
    },
};
