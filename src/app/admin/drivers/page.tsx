'use client';

import { useEffect, useState, useCallback } from 'react';
import { driverApi, Driver } from '@/lib/api/drivers';
import { columns } from './columns';
import { DataTable as TableComponent } from './data-table';
import { CreateDriverDialog } from '@/components/admin/drivers/create-driver-dialog';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default function DriversPage() {
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDrivers = useCallback(async () => {
        try {
            setLoading(true);
            const data = await driverApi.getAll();
            setDrivers(data);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch drivers:', err);
            setError('Lỗi kết nối hoặc phiên đăng nhập hết hạn.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const auth = getAuth();
        // Wait for Firebase auth to be ready before calling API
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchDrivers();
            } else {
                setLoading(false);
                setError('Yêu cầu đăng nhập quản trị viên.');
            }
        });

        return () => unsubscribe();
    }, [fetchDrivers]);

    return (
        <div className="container mx-auto py-10 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Quản lý Tài xế</h1>
                    <p className="text-muted-foreground mt-2">
                        Theo dõi, thêm mới và quản lý thông tin các tài xế trong hệ thống LogiTrack.
                    </p>
                </div>
                <CreateDriverDialog onSuccess={fetchDrivers} />
            </div>

            {loading ? (
                <div className="text-center py-10">Đang tải dữ liệu tài xế...</div>
            ) : error ? (
                <div className="text-center py-10 text-red-500">{error}</div>
            ) : (
                <TableComponent columns={columns} data={drivers} />
            )}
        </div>
    );
}
