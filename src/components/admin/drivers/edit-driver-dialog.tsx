'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { driverApi, Driver } from '@/lib/api/drivers';

const formSchema = z.object({
    licensePlate: z.string().min(1, 'Biển số xe là bắt buộc'),
    vehicleType: z.string().min(1, 'Loại xe là bắt buộc'),
    status: z.enum(['ONLINE', 'OFFLINE', 'IN_RIDE']),
    isAvailable: z.boolean()
});

interface EditDriverDialogProps {
    driver: Driver | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function EditDriverDialog({ driver, open, onOpenChange, onSuccess }: EditDriverDialogProps) {
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            licensePlate: '',
            vehicleType: '',
            status: 'OFFLINE',
            isAvailable: false
        },
    });

    useEffect(() => {
        if (driver && open) {
            form.reset({
                licensePlate: driver.vehicle?.plateNumber || '',
                vehicleType: driver.vehicle?.type || '',
                status: driver.status || 'OFFLINE',
                isAvailable: driver.isAvailable || false
            });
        }
    }, [driver, open, form]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!driver) return;
        try {
            setLoading(true);
            await driverApi.update(driver._id, {
                vehicle: {
                    plateNumber: values.licensePlate,
                    type: values.vehicleType,
                    model: driver.vehicle?.model || 'Generic' // Keeping existing
                },
                status: values.status,
                isAvailable: values.isAvailable
            });
            onOpenChange(false);
            onSuccess();
        } catch (error) {
            console.error('Failed to update driver', error);
            alert('Cập nhật thất bại. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Chỉnh sửa thông tin Tài xế</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Trạng thái</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn trạng thái" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="ONLINE">ONLINE</SelectItem>
                                            <SelectItem value="OFFLINE">OFFLINE</SelectItem>
                                            <SelectItem value="IN_RIDE">IN_RIDE</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="isAvailable"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Sẵn sàng nhận cuốc</FormLabel>
                                    <Select onValueChange={(v) => field.onChange(v === 'true')} defaultValue={field.value ? 'true' : 'false'}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sẵn sàng" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="true">Có</SelectItem>
                                            <SelectItem value="false">Không</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="licensePlate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Biển số xe</FormLabel>
                                    <FormControl>
                                        <Input placeholder="VD: 29A-123.45" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="vehicleType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Loại xe</FormLabel>
                                    <FormControl>
                                        <Input placeholder="VD: Xe tải 5 tấn, Xe tải lạnh..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full mt-6" disabled={loading}>
                            {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
