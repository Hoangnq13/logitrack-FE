"use client";

import { useAuthStore } from "@/stores/authStore";

export default function DashboardPage() {
    const user = useAuthStore((state) => state.user);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Trang Tổng Quan (Dashboard)</h1>

            <div className="grid gap-4 md:grid-cols-3">
                {/* Card Placeholder 1 */}
                <div className="rounded-xl border bg-card text-card-foreground shadow">
                    <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">Tài xế sẵn sàng</h3>
                    </div>
                    <div className="p-6 pt-0">
                        <div className="text-2xl font-bold">12 / 24</div>
                        <p className="text-xs text-muted-foreground">+2 so với hôm qua</p>
                    </div>
                </div>

                {/* Card Placeholder 2 */}
                <div className="rounded-xl border bg-card text-card-foreground shadow">
                    <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">Đơn hàng luân chuyển</h3>
                    </div>
                    <div className="p-6 pt-0">
                        <div className="text-2xl font-bold">+120 đơn</div>
                        <p className="text-xs text-muted-foreground">Tăng 30% tháng trước</p>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Thông tin đăng nhập</h2>
                <div className="p-4 bg-white dark:bg-zinc-950 border rounded-lg shadow-sm">
                    <pre className="text-sm overflow-auto text-green-600 dark:text-green-400">
                        {JSON.stringify(user, null, 2)}
                    </pre>
                </div>
            </div>
        </div>
    );
}
