"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";
import api from "@/services/api";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleGoogleLogin = async () => {
        try {
            setIsLoading(true);
            setError("");

            // 1. Đăng nhập bằng Firebase Popup
            const provider = new GoogleAuthProvider();
            const userCredential = await signInWithPopup(auth, provider);

            // 2. Lấy ID Token từ Firebase
            const idToken = await userCredential.user.getIdToken();

            // 3. Gửi Token sang Backend Logitrack để xác thực và cấp Session JWT
            const response = await api.post("/auth/login", { idToken });

            const { accessToken, user } = response.data.data || response.data;

            // 4. Lưu vào Zustand Global Store & LocalStorage
            setAuth(user, accessToken);

            // 5. Điều hướng vào trang Dashboard
            router.push("/admin");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error("Login failed", err);
            setError(err?.response?.data?.message || err.message || "Đăng nhập thất bại");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-screen items-center justify-center bg-gray-50 dark:bg-zinc-900">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">LogiTrack</h1>
                    <p className="text-sm text-muted-foreground">
                        Hệ thống quản lý chuỗi cung ứng logistics
                    </p>
                </div>

                <div className="grid gap-6">
                    <Button
                        variant="outline"
                        type="button"
                        disabled={isLoading}
                        onClick={handleGoogleLogin}
                        className="w-full"
                    >
                        {isLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <svg role="img" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
                                <path
                                    fill="currentColor"
                                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                />
                            </svg>
                        )}
                        Google Sign-in
                    </Button>

                    {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                </div>
            </div>
        </div>
    );
}
