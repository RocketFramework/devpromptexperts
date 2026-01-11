"use client";

import { useSession } from "next-auth/react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { UserRoles } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import NotificationPreferencesForm from "@/components/settings/NotificationPreferencesForm";
import ClientDashboardLayout from "@/components/client/ClientDashboardLayout";
import PrivacySecuritySettings from "@/components/settings/PrivacySecuritySettings";
import SettingsTabs from "@/components/settings/SettingsTabs";
import ClientPaymentSettings from "@/components/client/ClientPaymentSettings";
import { HiBell, HiCreditCard, HiLockClosed } from "react-icons/hi";

export default function ClientSettingsPage({ params }: { params: { client_id: string } }) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/login/client");
        }
    }, [status, router]);

    if (status === "loading") return <LoadingSpinner />;

    return (
        <ClientDashboardLayout>
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
                    <p className="text-slate-500 dark:text-gray-400 mt-1">Manage your account preferences and notifications.</p>
                </div>

                <SettingsTabs
                    tabs={[
                        { name: "Notifications", icon: HiBell },
                        { name: "Privacy & Security", icon: HiLockClosed },
                        { name: "Billing Methods", icon: HiCreditCard },
                    ]}
                >
                    {/* Tab 1: Notifications */}
                    <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <NotificationPreferencesForm userId={params.client_id} role={UserRoles.CLIENT} />
                    </section>

                    {/* Tab 2: Privacy */}
                    <section>
                        <PrivacySecuritySettings />
                    </section>

                    {/* Tab 3: Billing */}
                    <section>
                        <ClientPaymentSettings />
                    </section>
                </SettingsTabs>
            </div>
        </ClientDashboardLayout>
    );
}
