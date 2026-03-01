import { ColumnDef } from '@tanstack/react-table';
import { Driver } from '@/lib/api/drivers';
import { Badge } from '@/components/ui/badge';
import { DriverActions } from './driver-actions';

export const columns: ColumnDef<Driver>[] = [
    {
        accessorKey: 'user', // Populated User object
        header: 'Tài khoản (Tên/Email)',
        cell: ({ row }) => {
            const user = row.getValue('user') as any;
            return user?.fullName || user?.email || user?._id || 'Không xác định';
        }
    },
    {
        accessorKey: 'vehicle.plateNumber',
        header: 'Biển số xe',
    },
    {
        accessorKey: 'vehicle.type',
        header: 'Loại xe',
    },
    {
        accessorKey: 'status',
        header: 'Trạng thái',
        cell: ({ row }) => {
            const status = row.getValue('status') as string;
            return (
                <Badge variant={status === 'ACTIVE' ? 'default' : 'destructive'}>
                    {status === 'ACTIVE' ? 'Hoạt động' : 'Ngừng hoạt động'}
                </Badge>
            );
        },
    },
    {
        accessorKey: 'isAvailable',
        header: 'Sẵn sàng',
        cell: ({ row }) => {
            const isAvailable = row.getValue('isAvailable') as boolean;
            return (
                <Badge variant={isAvailable ? 'outline' : 'secondary'} className={isAvailable ? 'text-green-600 border-green-600' : ''}>
                    {isAvailable ? 'Sẵn sàng' : 'Đang bận'}
                </Badge>
            );
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => <DriverActions driver={row.original} />,
    },
];
