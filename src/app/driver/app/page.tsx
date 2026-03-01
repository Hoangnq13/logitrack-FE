'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { driverApi, Driver } from '@/lib/api/drivers';
import { Button } from '@/components/ui/button';
import { Loader2, Navigation, Power, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function DriverApp() {
    const router = useRouter();
    const { user, isAuthenticated } = useAuthStore();
    const [driver, setDriver] = useState<Driver | null>(null);
    const [loading, setLoading] = useState(true);
    const [isOnline, setIsOnline] = useState(false);
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [error, setError] = useState('');

    const watchIdRef = useRef<number | null>(null);

    useEffect(() => {
        // [TEMP] Bypassing auth for testing Driver App
        /*
        if (!isAuthenticated || !user) {
            router.push('/login');
            return;
        }

        // Check if user is a driver
        if (!user.roles.includes('DRIVER')) {
            setError('Tài khoản của bạn không có quyền Tài xế.');
            setLoading(false);
            return;
        }
        */

        const fetchDriverProfile = async () => {
            try {
                // [TEMP] Hardcoding a driver ID for testing
                // This ID should exist in your database. If not, the API will fail.
                // You can replace this with a valid ID from your MongoDB.
                // For now we just mock the driver state directly to test UI.

                const mockDriver: Driver = {
                    _id: '60d5ecb8b311234567890123', // Fake or real ID
                    userId: 'user123',
                    licensePlate: '29A-123.45',
                    vehicleType: 'TRUCK',
                    status: 'OFFLINE',
                    isAvailable: true,
                    currentLocation: { lat: 21.0285, lng: 105.8542 },
                    stats: {
                        totalOrders: 12,
                        totalDistance: 150.5,
                        rating: 4.8
                    },
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };

                setDriver(mockDriver);
                setIsOnline(false); // Default to offline for testing

                // If you want to actually call the API, uncomment below and comment out mock:
                // const profile = await driverApi.getMe();
                // setDriver(profile);
                // setIsOnline(profile.status === 'ONLINE');

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                console.error('Failed to load driver profile', err);
                setError('Không thể lấy thông tin tài xế. Vui lòng thử lại.');
            } finally {
                setLoading(false);
            }
        };

        fetchDriverProfile();
    }, []); // Removed deps for temp testing

    const stopTracking = () => {
        if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }
    };

    const startTracking = () => {
        if (!navigator.geolocation) {
            alert('Trình duyệt của bạn không hỗ trợ Geolocation.');
            return;
        }

        watchIdRef.current = navigator.geolocation.watchPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ lat: latitude, lng: longitude });

                if (driver && isOnline) {
                    try {
                        // Send location to backend
                        await driverApi.updateLocation(driver._id, latitude, longitude);
                    } catch (err) {
                        console.error('Failed to update location to server', err);
                    }
                }
            },
            (error) => {
                console.error('Geolocation error', error);
                if (error.code === error.PERMISSION_DENIED) {
                    alert('Vui lòng cấp quyền truy cập vị trí để hoạt động.');
                    setIsOnline(false);
                }
            },
            {
                enableHighAccuracy: true,
                maximumAge: 10000,
                timeout: 5000,
            }
        );
    };

    // Whenever `isOnline` changes, toggle tracking
    useEffect(() => {
        if (isOnline) {
            startTracking();
        } else {
            stopTracking();
        }

        return () => {
            stopTracking();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOnline, driver]);

    const handleToggleStatus = async () => {
        if (!driver) return;

        try {
            setLoading(true);

            // We should ideally call an API to update status, but for now we'll just toggle locally
            // pending a real backend status toggle endpoint.
            // In a real app we would call: await driverApi.update(driver._id, { status: newStatus });

            setIsOnline(!isOnline);
        } catch (err) {
            console.error('Failed to update status', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !driver && !error) {
        return (
            <div className="flex h-full flex-col items-center justify-center p-6">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="mt-4 text-sm text-muted-foreground">Đang tải ứng dụng...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
                <h2 className="text-xl font-bold">Lỗi truy cập</h2>
                <p className="mt-2 text-muted-foreground">{error}</p>
                <Button className="mt-6" onClick={() => router.push('/login')}>Quay lại đăng nhập</Button>
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col">
            {/* Header */}
            <header className="flex items-center justify-between border-b bg-white p-4 dark:bg-zinc-900">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Navigation className="h-5 w-5" />
                    </div>
                    <div>
                        <h1 className="font-semibold">{user?.fullName || 'Tài xế'}</h1>
                        <p className="text-xs text-muted-foreground">{driver?.licensePlate} • {driver?.vehicleType}</p>
                    </div>
                </div>
                <Badge variant={isOnline ? 'default' : 'secondary'} className={isOnline ? 'bg-green-500 hover:bg-green-600' : ''}>
                    {isOnline ? 'ĐANG LÀM VIỆC' : 'NGHỈ NGƠI'}
                </Badge>
            </header>

            {/* Map Area Simulation */}
            <div className="relative flex-1 bg-gray-100 dark:bg-zinc-800">
                {/* Fake Map Background */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at center, #9ca3af 2px, transparent 2px)', backgroundSize: '20px 20px' }} />

                {/* Current Location Indicator */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <div className="relative flex items-center justify-center">
                        <div className="absolute h-16 w-16 animate-ping rounded-full bg-blue-500/30"></div>
                        <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-blue-500 shadow-lg">
                            <Navigation className="h-4 w-4 text-white" />
                        </div>
                    </div>
                    {location ? (
                        <div className="mt-4 rounded-full bg-white/90 px-4 py-1.5 text-xs font-medium shadow-sm backdrop-blur-sm dark:bg-black/80">
                            {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
                        </div>
                    ) : (
                        <div className="mt-4 rounded-full bg-white/90 px-4 py-1.5 text-xs font-medium shadow-sm backdrop-blur-sm dark:bg-black/80">
                            Đang tìm vị trí...
                        </div>
                    )}
                </div>

                {/* Driver Stats Overlay */}
                <div className="absolute left-4 right-4 top-4 flex justify-between gap-4">
                    <div className="flex-1 rounded-2xl bg-white p-3 shadow-md dark:bg-zinc-900">
                        <p className="text-xs text-muted-foreground">Chuyến h.nay</p>
                        <p className="text-lg font-bold">12</p>
                    </div>
                    <div className="flex-1 rounded-2xl bg-white p-3 shadow-md dark:bg-zinc-900">
                        <p className="text-xs text-muted-foreground">Thu nhập</p>
                        <p className="text-lg font-bold text-green-600">850k</p>
                    </div>
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="rounded-t-3xl border-t bg-white p-6 shadow-lg dark:bg-zinc-900">
                <Button
                    size="lg"
                    className={`w-full rounded-full py-6 text-lg font-bold shadow-lg transition-all ${isOnline ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                        }`}
                    onClick={handleToggleStatus}
                    disabled={loading}
                >
                    <Power className="mr-2 h-6 w-6" />
                    {isOnline ? 'CHỐT CA LÀM VIỆC' : 'BẮT ĐẦU NHẬN CHUYẾN'}
                </Button>

                {isOnline && (
                    <div className="mt-6 space-y-4">
                        <div className="flex items-center gap-4 rounded-2xl border p-4 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-900/50">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
                                <Loader2 className="h-6 w-6 animate-spin" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-blue-900 dark:text-blue-200">Đang dò tìm đơn hàng...</h3>
                                <p className="text-sm text-blue-700/80 dark:text-blue-300">Giữ ứng dụng luôn mở định vị ở chế độ nền</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
