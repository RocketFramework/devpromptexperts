"use client";

import { useState, useEffect } from "react";
import { SettingsService, UserSettings, NotificationPreferences } from "@/services/extended/SettingsService";
import { UserRoles, UserRole } from "@/types";
import { Switch } from "@headlessui/react";
import LoadingSpinner from "@/components/LoadingSpinner";

interface Props {
    userId: string;
    role: UserRole;
}

export default function NotificationPreferencesForm({ userId, role }: Props) {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState<UserSettings | null>(null);

    useEffect(() => {
        loadSettings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    const loadSettings = async () => {
        try {
            setLoading(true);
            const data = await SettingsService.getSettings(userId);
            setSettings(data);
        } catch (error) {
            console.error("Error loading settings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (key: keyof NotificationPreferences) => {
        if (!settings) return;

        const newPreferences = {
            ...settings.notification_preferences,
            [key]: !settings.notification_preferences?.[key],
        };

        // Optimistic update
        setSettings({ ...settings, notification_preferences: newPreferences });

        try {
            setSaving(true);
            await SettingsService.updateSettings(userId, {
                notification_preferences: newPreferences,
            });
        } catch (error) {
            console.error("Error updating settings:", error);
            // Revert if failed
            loadSettings();
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-6">
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Notification Preferences</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Decide which communications you&#39;d like to receive via email.
                </p>
            </div>

            <div className="space-y-4">
                {/* Common Notifications */}
                <ToggleItem
                    label="New Messages"
                    description="Receive emails when you get new messages in projects or proposals."
                    enabled={settings?.notification_preferences?.notify_new_message ?? true}
                    onChange={() => handleToggle('notify_new_message')}
                />

                <ToggleItem
                    label="Review Received"
                    description="Get notified when someone leaves you a review."
                    enabled={settings?.notification_preferences?.notify_review_received ?? true}
                    onChange={() => handleToggle('notify_review_received')}
                />

                <ToggleItem
                    label="Project Completed"
                    description="Notification when a project is marked as completed."
                    enabled={settings?.notification_preferences?.notify_project_completed ?? true}
                    onChange={() => handleToggle('notify_project_completed')}
                />

                {/* Consultant Specific */}
                {role === UserRoles.CONSULTANT && (
                    <>
                        <ToggleItem
                            label="New Projects (RFPs)"
                            description="Be notified when new projects matching your skills are published."
                            enabled={settings?.notification_preferences?.notify_rfp_published ?? true}
                            onChange={() => handleToggle('notify_rfp_published')}
                        />
                        <ToggleItem
                            label="Proposal Shortlisted"
                            description="Get alerted when your proposal is shortlisted by a client."
                            enabled={settings?.notification_preferences?.notify_proposal_shortlisted ?? true}
                            onChange={() => handleToggle('notify_proposal_shortlisted')}
                        />
                        <ToggleItem
                            label="Payment Released"
                            description="Notification when a client releases a milestone payment."
                            enabled={settings?.notification_preferences?.notify_payment_released ?? true}
                            onChange={() => handleToggle('notify_payment_released')}
                        />
                        <ToggleItem
                            label="Onboarding Interviews"
                            description="Updates about your onboarding interview schedule."
                            enabled={settings?.notification_preferences?.notify_ob_interview_scheduled ?? true}
                            onChange={() => handleToggle('notify_ob_interview_scheduled')}
                        />
                    </>
                )}

                {/* Client Specific */}
                {role === UserRoles.CLIENT && (
                    <>
                        <ToggleItem
                            label="New Proposals"
                            description="Receive an email when a consultant submits a proposal for your project."
                            enabled={settings?.notification_preferences?.notify_proposal_submitted ?? true}
                            onChange={() => handleToggle('notify_proposal_submitted')}
                        />
                    </>
                )}

                {/* Seller Specific */}
                {role === UserRoles.SELLER && (
                    <>
                        <ToggleItem
                            label="Commission Calculated"
                            description="Get notified when a new commission is calculated for you."
                            enabled={settings?.notification_preferences?.notify_commission_calculated ?? true}
                            onChange={() => handleToggle('notify_commission_calculated')}
                        />
                    </>
                )}
            </div>

            {saving && (
                <p className="text-sm text-gray-500 italic text-right">Saving changes...</p>
            )}
        </div>
    );
}

function ToggleItem({ label, description, enabled, onChange }: { label: string, description: string, enabled: boolean, onChange: () => void }) {
    return (
        <Switch.Group as="div" className="flex items-center justify-between py-4">
            <span className="flex flex-col flex-grow">
                <Switch.Label as="span" className="text-sm font-medium text-gray-900 dark:text-gray-200" passive>
                    {label}
                </Switch.Label>
                <Switch.Description as="span" className="text-sm text-gray-500 dark:text-gray-400">
                    {description}
                </Switch.Description>
            </span>
            <Switch
                checked={enabled}
                onChange={onChange}
                className={`${enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
                <span
                    aria-hidden="true"
                    className={`${enabled ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                />
            </Switch>
        </Switch.Group>
    );
}
