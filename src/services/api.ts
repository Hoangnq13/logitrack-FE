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

// Thêm Interceptor để xử lý lỗi (ví dụ: Token hết hạn 401)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Xóa state trong Zustand
            useAuthStore.getState().logout();
            // Điều hướng về trang Login
            if (typeof window !== 'undefined') {
                window.location.href = '/login?session_expired=true';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
