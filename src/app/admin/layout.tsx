"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
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
        if (!isAuthenticated) {
            router.push(`/login?redirect=${pathname}`);
        }
    }, [isAuthenticated, pathname, router]);

    if (!isAuthenticated) return null;

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-zinc-900">
            {/* Cấu trúc Sidebar Menu */}
            <aside className="w-64 bg-white dark:bg-zinc-950 border-r border-gray-200 dark:border-zinc-800 hidden md:flex flex-col">
                <div className="p-4 h-16 flex items-center border-b border-gray-200 dark:border-zinc-800 font-bold text-xl">
                    LogiTrack Admin
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <Link href="/admin">
                        <div className={`px-3 py-2 rounded-md font-medium transition ${pathname === '/admin' ? 'bg-gray-100 dark:bg-zinc-800' : 'hover:bg-gray-50 dark:hover:bg-zinc-900'}`}>
                            Dashboard
                        </div>
                    </Link>
                    <Link href="/admin/drivers">
                        <div className={`px-3 py-2 rounded-md font-medium transition ${pathname.startsWith('/admin/drivers') ? 'bg-gray-100 dark:bg-zinc-800' : 'hover:bg-gray-50 dark:hover:bg-zinc-900'}`}>
                            Quản lý Tài xế
                        </div>
                    </Link>
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
