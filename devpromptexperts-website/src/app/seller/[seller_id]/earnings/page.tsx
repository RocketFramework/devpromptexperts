"use client";

import EarningsView from "@/components/earnings/EarningsView";

export default function SellerEarningsPage({ params }: { params: { seller_id: string } }) {
    return (
        <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <EarningsView userId={params.seller_id} userRole="seller" />
            </div>
        </div>
    );
}
