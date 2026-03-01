import axios from 'axios';
import { getAuth } from 'firebase/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface Driver {
    _id: string;
    userId: string;
    licensePlate: string;
    vehicleType: string;
    status: 'ONLINE' | 'OFFLINE' | 'IN_RIDE';
    isAvailable: boolean;
    currentLocation?: {
        lat: number;
        lng: number;
        updatedAt: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface CreateDriverDto {
    userId: string;
    licensePlate: string;
    vehicleType: string;
}

export interface UpdateDriverDto {
    licensePlate?: string;
    vehicleType?: string;
    status?: 'ONLINE' | 'OFFLINE' | 'IN_RIDE';
    isAvailable?: boolean;
}

const getHeaders = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
        throw new Error('User not authenticated');
    }
    const token = await user.getIdToken();
    return {
        Authorization: `Bearer ${token}`,
    };
};

export const driverApi = {
    getAll: async (status?: string, isAvailable?: boolean): Promise<Driver[]> => {
        const headers = await getHeaders();
        const params = new URLSearchParams();
        if (status) params.append('status', status);
        if (isAvailable !== undefined) params.append('isAvailable', String(isAvailable));

        const response = await axios.get(`${API_URL}/drivers`, {
            headers,
            params,
        });
        return response.data;
    },

    getMe: async (): Promise<Driver> => {
        const headers = await getHeaders();
        const response = await axios.get(`${API_URL}/drivers/me`, { headers });
        return response.data;
    },

    getById: async (id: string): Promise<Driver> => {
        const headers = await getHeaders();
        const response = await axios.get(`${API_URL}/drivers/${id}`, { headers });
        return response.data;
    },

    create: async (data: CreateDriverDto): Promise<Driver> => {
        const headers = await getHeaders();
        const response = await axios.post(`${API_URL}/drivers`, data, { headers });
        return response.data;
    },

    update: async (id: string, data: UpdateDriverDto): Promise<Driver> => {
        const headers = await getHeaders();
        const response = await axios.put(`${API_URL}/drivers/${id}`, data, { headers });
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        const headers = await getHeaders();
        await axios.delete(`${API_URL}/drivers/${id}`, { headers });
    },

    updateLocation: async (id: string, lat: number, lng: number): Promise<{ success: boolean; data: { lat: number; lng: number } }> => {
        const headers = await getHeaders();
        const response = await axios.post(`${API_URL}/drivers/${id}/location`, { lat, lng }, { headers });
        return response.data;
    },
};
