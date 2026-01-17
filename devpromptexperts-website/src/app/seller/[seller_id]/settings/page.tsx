"use client";

import { useSession } from "next-auth/react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { UserRoles } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import NotificationPreferencesForm from "@/components/settings/NotificationPreferencesForm";
import PrivacySecuritySettings from "@/components/settings/PrivacySecuritySettings";
import SettingsTabs from "@/components/settings/SettingsTabs";
import PaymentSettings from "@/components/consultant/settings/PaymentSettings";
import { HiBell, HiCreditCard, HiLockClosed } from "react-icons/hi";

export default function SellerSettingsPage({ params }: { params: { seller_id: string } }) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/login/seller");
        }
    }, [status, router]);

    if (status === "loading") return <LoadingSpinner />;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-gray-900 p-6 lg:p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
                    <p className="text-slate-500 dark:text-gray-400 mt-1">Manage your seller account preferences.</p>
                </div>

                <SettingsTabs
                    tabs={[
                        { name: "Commission Payouts", icon: HiCreditCard },
                        { name: "Notifications", icon: HiBell },
                        { name: "Privacy & Security", icon: HiLockClosed },
                    ]}
                >
                    {/* Tab 1: Payouts */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Payout Preferences</h3>
                            <p className="text-sm text-gray-500 mb-6">Manage where your commission payments should be sent.</p>
                            {/* Reusing PaymentSettings with seller userId, assuming it works for any user type generally */}
                            <PaymentSettings userId={params.seller_id} />
                        </div>
                    </div>

                    {/* Tab 2: Notifications */}
                    <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <NotificationPreferencesForm userId={params.seller_id} role={UserRoles.SELLER} />
                    </section>

                    {/* Tab 3: Privacy */}
                    <section>
                        <PrivacySecuritySettings />
                    </section>
                </SettingsTabs>
            </div>
        </div>
    );
}
