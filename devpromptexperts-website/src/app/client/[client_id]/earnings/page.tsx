"use client";

import { useSession } from "next-auth/react";
import EarningsView from "@/components/earnings/EarningsView";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function ClientEarningsPage({ params }: { params: { client_id: string } }) {
    return (
        <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <EarningsView userId={params.client_id} userRole="client" />
            </div>
        </div>
    );
}
