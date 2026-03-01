import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

// Tạo một Axios instance cấu hình sẵn Base URL của NestJS Backend
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Thêm Interceptor để tự động nhét Token vào mọi Request gửi đi
api.interceptors.request.use(
    (config) => {
        // Lấy token từ Zustand global store
        const token = useAuthStore.getState().accessToken;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
