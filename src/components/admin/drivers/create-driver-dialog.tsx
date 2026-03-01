'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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
import { driverApi, CreateDriverDto } from '@/lib/api/drivers';

const formSchema = z.object({
    userId: z.string().min(1, 'User ID là bắt buộc'),
    licensePlate: z.string().min(1, 'Biển số xe là bắt buộc'),
    vehicleType: z.string().min(1, 'Loại xe là bắt buộc'),
});

interface CreateDriverDialogProps {
    onSuccess: () => void;
}

export function CreateDriverDialog({ onSuccess }: CreateDriverDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            userId: '',
            licensePlate: '',
            vehicleType: '',
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setLoading(true);
            const data: CreateDriverDto = {
                userId: values.userId, // Normally we fetch user from dropdown, just input for now
                licensePlate: values.licensePlate,
                vehicleType: values.vehicleType,
            };
            await driverApi.create(data);
            form.reset();
            setOpen(false);
            onSuccess();
        } catch (error) {
            console.error('Failed to create driver', error);
            // In real app add proper toast notification
            alert('Tạo tài xế thất bại. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Thêm tài xế mới</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Thêm tài xế mới</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                        <FormField
                            control={form.control}
                            name="userId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>User ID (Firebase UID)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nhập Firebase UID của User" {...field} />
                                    </FormControl>
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
                            {loading ? 'Đang tạo...' : 'Xác nhận tạo'}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
