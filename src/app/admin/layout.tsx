"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const { isAuthenticated, user, logout } = useAuthStore();

    useEffect(() => {
        // Nếu chưa đăng nhập, tự động đá về trang /login nhưng có mang theo param `?redirect=/admin/xxx`
        if (!isAuthenticated) {
            router.push(`/login?redirect=${pathname}`);
        }
    }, [isAuthenticated, pathname, router]);

    // Trong lúc chờ check token, có thể hiển thị loading trắng
    if (!isAuthenticated) return null;

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-zinc-900">
            {/* Cấu trúc Sidebar Menu */}
            <aside className="w-64 bg-white dark:bg-zinc-950 border-r border-gray-200 dark:border-zinc-800 hidden md:flex flex-col">
                <div className="p-4 h-16 flex items-center border-b border-gray-200 dark:border-zinc-800 font-bold text-xl">
                    LogiTrack Admin
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {/* Active Navigation later */}
                    <div className="bg-gray-100 dark:bg-zinc-800 px-3 py-2 rounded-md font-medium">Dashboard</div>
                </nav>
                <div className="p-4 border-t border-gray-200 dark:border-zinc-800">
                    <button
                        onClick={() => { logout(); router.push('/login'); }}
                        className="w-full text-left text-red-500 font-medium px-3 py-2 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-md transition"
                    >
                        Đăng xuất
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
                <header className="h-16 bg-white dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between px-6">
                    <div className="font-semibold text-gray-800 dark:text-gray-200">
                        {/* Page title placeholder */}
                        Hệ thống Quản lý
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">{user?.fullName || 'Admin User'}</span>
                    </div>
                </header>

                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
