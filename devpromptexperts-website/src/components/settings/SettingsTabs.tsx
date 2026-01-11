"use client";

import { Tab } from "@headlessui/react";
import { Fragment } from "react";
import { HiBell, HiCreditCard, HiLockClosed, HiUser } from "react-icons/hi";

interface SettingsTabsProps {
    children: React.ReactNode[];
    tabs: {
        name: string;
        icon: any;
    }[];
}

export default function SettingsTabs({ children, tabs }: SettingsTabsProps) {
    return (
        <Tab.Group>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-1">
                    <Tab.List className="flex flex-col space-y-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-2">
                        {tabs.map((tab, idx) => (
                            <Tab as={Fragment} key={idx}>
                                {({ selected }) => (
                                    <button
                                        className={`
                      group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 outline-none
                      ${selected
                                                ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 shadow-sm'
                                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                                            }
                    `}
                                    >
                                        <tab.icon
                                            className={`
                        mr-3 h-5 w-5 transition-colors duration-200
                        ${selected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 group-hover:text-gray-500'}
                      `}
                                        />
                                        {tab.name}
                                    </button>
                                )}
                            </Tab>
                        ))}
                    </Tab.List>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3">
                    <Tab.Panels>
                        {children.map((child, idx) => (
                            <Tab.Panel
                                key={idx}
                                className="outline-none animate-in fade-in slide-in-from-right-4 duration-300"
                            >
                                {child}
                            </Tab.Panel>
                        ))}
                    </Tab.Panels>
                </div>
            </div>
        </Tab.Group>
    );
}
