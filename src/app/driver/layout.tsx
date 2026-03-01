import { ReactNode } from 'react';

export default function DriverLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col bg-gray-100 dark:bg-zinc-950">
            {/* Mobile App Simulator Container */}
            <div className="mx-auto flex h-screen w-full max-w-md flex-col overflow-hidden bg-white shadow-xl dark:bg-zinc-900 sm:h-[850px] sm:mt-10 sm:rounded-3xl sm:border">
                {/* Status Bar Fake */}
                <div className="flex h-8 w-full items-center justify-between bg-black px-4 text-xs font-medium text-white">
                    <span>9:41</span>
                    <div className="flex items-center space-x-2">
                        <span>5G</span>
                        <span>100%</span>
                    </div>
                </div>

                {/* App Content */}
                <div className="flex-1 overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}
