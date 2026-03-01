import { ColumnDef } from '@tanstack/react-table';
import { Driver } from '@/lib/api/drivers';
import { Badge } from '@/components/ui/badge';
import { DriverActions } from './driver-actions';

export const columns: ColumnDef<Driver>[] = [
    {
        accessorKey: 'userId', // In a real app we'd populate this with User Name
        header: 'Tài khoản (UserID)',
    },
    {
        accessorKey: 'licensePlate',
        header: 'Biển số xe',
    },
    {
        accessorKey: 'vehicleType',
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
