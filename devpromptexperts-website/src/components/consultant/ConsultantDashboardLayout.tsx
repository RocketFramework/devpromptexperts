"use client";

import { ReactNode } from 'react';

interface ConsultantDashboardLayoutProps {
    children: ReactNode;
}

export default function ConsultantDashboardLayout({
    children,
}: ConsultantDashboardLayoutProps) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
            {/* Page Content */}
            <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto w-full">
                    {children}
                </div>
            </main>
        </div>
    );
}
