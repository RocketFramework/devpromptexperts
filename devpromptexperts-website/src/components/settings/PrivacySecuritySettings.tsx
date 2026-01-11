"use client";

import { useState } from "react";
import { HiLockClosed, HiShieldCheck, HiFingerPrint, HiDatabase } from "react-icons/hi";

export default function PrivacySecuritySettings() {
    const [downloading, setDownloading] = useState(false);

    const handleDownloadData = () => {
        setDownloading(true);
        // Simulate data preparation
        setTimeout(() => {
            setDownloading(false);
            alert("Your data copy has been compiled and emailed to you.");
        }, 2000);
    };

    return (
        <div className="space-y-6">
            {/* Password & Authentication */}
            <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Security & Authentication</h3>

                <div className="space-y-6">
                    <div className="flex items-center justify-between pb-6 border-b border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-500">
                                <HiLockClosed className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">Password</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Last changed 3 months ago</p>
                            </div>
                        </div>
                        <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 border border-blue-200 rounded-lg px-4 py-2 hover:bg-blue-50 transition-colors">
                            Change Password
                        </button>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-500">
                                <HiFingerPrint className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security to your account</p>
                            </div>
                        </div>
                        <button className="text-sm font-semibold text-gray-600 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors bg-gray-50 opacity-50 cursor-not-allowed" disabled>
                            Coming Soon
                        </button>
                    </div>
                </div>
            </section>

            {/* Privacy & Data */}
            <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Privacy & Data</h3>

                <div className="space-y-6">
                    <div className="flex items-center justify-between pb-6 border-b border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-500">
                                <HiShieldCheck className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">Profile Visibility</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Control who can see your profile details</p>
                            </div>
                        </div>
                        <select className="text-sm border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-900 dark:border-gray-600">
                            <option>Public (Recommended)</option>
                            <option>Platform Only</option>
                            <option>Private</option>
                        </select>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-500">
                                <HiDatabase className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">Data Export</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Download a copy of your personal data</p>
                            </div>
                        </div>
                        <button
                            onClick={handleDownloadData}
                            disabled={downloading}
                            className="text-sm font-semibold text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors"
                        >
                            {downloading ? "Preparing..." : "Request Data"}
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
