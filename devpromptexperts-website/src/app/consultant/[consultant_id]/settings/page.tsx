"use client";

import { useSession } from "next-auth/react";
import PaymentSettings from "@/components/consultant/settings/PaymentSettings";
import LoadingSpinner from "@/components/LoadingSpinner";
import { UserRoles } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ConsultantSettingsPage({ params }: { params: { consultant_id: string } }) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/login/consultant");
        } else if (session?.user?.role !== UserRoles.CONSULTANT && session?.user?.role !== UserRoles.ADMIN) {
            // If they are not a consultant or admin, they shouldn't be here
            // But let's be flexible if they are accessing their own id
        }
    }, [status, session, router]);

    if (status === "loading") return <LoadingSpinner />;

    return (
        <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Account Settings</h1>
                    <p className="text-slate-500 mt-1">Manage your professional profile and payment preferences.</p>
                </div>

                <div className="space-y-8">
                    {/* Payment Settings Section */}
                    <section>
                        <PaymentSettings userId={params.consultant_id} />
                    </section>

                    {/* Other settings can be added here later (e.g., Profile Details, Notifications) */}
                    <div className="p-8 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-6">
                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                            <span className="text-xl">🛠️</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-blue-900">More Settings Coming Soon</h3>
                            <p className="text-sm text-blue-700">We're working on more profile customization options. Stay tuned!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
