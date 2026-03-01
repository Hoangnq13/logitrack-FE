'use client';

import { useState } from 'react';
import { Driver, driverApi } from '@/lib/api/drivers';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Edit, Trash } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DriverActionsProps {
    driver: Driver;
}

export function DriverActions({ driver }: DriverActionsProps) {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!confirm('Bạn có chắc chắn muốn xoá tài xế này?')) return;
        try {
            setLoading(true);
            await driverApi.delete(driver._id);
            window.location.reload(); // Simple refresh for now, can use router.refresh() 
        } catch (error) {
            console.error(error);
            alert('Xoá thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0" disabled={loading}>
                    <span className="sr-only">Mở menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(driver._id)}>
                    Copy ID Tài xế
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => alert('Tính năng Edit đang phát triển')}>
                    <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600" onClick={handleDelete}>
                    <Trash className="mr-2 h-4 w-4" /> Xoá
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
