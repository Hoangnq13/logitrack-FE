import api from '@/services/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface Driver {
    _id: string;
    user: {
        _id: string;
        email?: string;
        fullName?: string;
    };
    vehicle: {
        plateNumber: string;
        type: string;
        model: string;
        color?: string;
    };
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



export const driverApi = {
    getAll: async (status?: string, isAvailable?: boolean): Promise<Driver[]> => {
        const params = new URLSearchParams();
        if (status) params.append('status', status);
        if (isAvailable !== undefined) params.append('isAvailable', String(isAvailable));

        const response = await api.get(`/drivers`, { params });
        return response.data.data;
    },

    getMe: async (): Promise<Driver> => {
        const response = await api.get(`/drivers/me`);
        return response.data.data;
    },

    getById: async (id: string): Promise<Driver> => {
        const response = await api.get(`/drivers/${id}`);
        return response.data.data;
    },

    create: async (data: CreateDriverDto): Promise<Driver> => {
        const payload = {
            user: data.userId,
            vehicle: {
                plateNumber: data.licensePlate, // Changed from licensePlate to plateNumber
                type: data.vehicleType,
                model: 'Generic Model' // Temporary mock, as backend expects 'model'
            }
        };
        const response = await api.post(`/drivers`, payload);
        return response.data.data;
    },

    update: async (id: string, data: UpdateDriverDto): Promise<Driver> => {
        const response = await api.put(`/drivers/${id}`, data);
        return response.data.data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/drivers/${id}`);
    },

    updateLocation: async (id: string, lat: number, lng: number): Promise<{ success: boolean; data: { lat: number; lng: number } }> => {
        const response = await api.post(`/drivers/${id}/location`, { lat, lng });
        return response.data.data;
    },
};
