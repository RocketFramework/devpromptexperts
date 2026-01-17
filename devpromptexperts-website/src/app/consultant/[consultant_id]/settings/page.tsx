"use client";
import NotificationPreferencesForm from "@/components/settings/NotificationPreferencesForm";
import { useSession } from "next-auth/react";
import PaymentSettings from "@/components/consultant/settings/PaymentSettings";
import BillingSettings from "@/components/consultant/BillingSettings";
import PrivacySecuritySettings from "@/components/settings/PrivacySecuritySettings";
import SettingsTabs from "@/components/settings/SettingsTabs";
import { HiBell, HiCreditCard, HiLockClosed } from "react-icons/hi";
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

                <SettingsTabs
                    tabs={[
                        { name: "Payments & Payouts", icon: HiCreditCard },
                        { name: "Notifications", icon: HiBell },
                        { name: "Privacy & Security", icon: HiLockClosed },
                    ]}
                >
                    {/* Tab 1: Payments */}
                    <div className="space-y-6">
                        <section>
                            <PaymentSettings userId={params.consultant_id} />
                        </section>
                        <section>
                            <BillingSettings />
                        </section>
                    </div>

                    {/* Tab 2: Notifications */}
                    <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <NotificationPreferencesForm userId={params.consultant_id} role={UserRoles.CONSULTANT} />
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
