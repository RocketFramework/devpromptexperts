export default function AdminPage() {
    return (
        <div className="p-6">
            {/* Industrial Grade Income & Revenue Section */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
                {/* Total Revenue Card */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">$1,284,563</h3>
                        </div>
                        <div className="p-2 bg-green-100 rounded-lg">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                        <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded">+12.5%</span>
                        <span className="text-sm text-gray-500">from last month</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Projected</span>
                            <span className="font-medium text-gray-900">$1.5M</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                            <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                    </div>
                </div>

                {/* Net Income Card */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Net Income</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">$842,250</h3>
                        </div>
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                        <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded">+8.3%</span>
                        <span className="text-sm text-gray-500">profit margin</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Operating Expenses</span>
                            <span className="font-medium text-gray-900">$442,313</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                            <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: '34%' }}></div>
                        </div>
                    </div>
                </div>

                {/* Cash Flow Card */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Cash Flow</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">$324,890</h3>
                        </div>
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                            </svg>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                        <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded">+5.2%</span>
                        <span className="text-sm text-gray-500">operational cash</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Free Cash Flow</span>
                            <span className="font-medium text-gray-900">$187,432</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                            <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '57%' }}></div>
                        </div>
                    </div>
                </div>

                {/* ARR Card */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Annual Recurring</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">$2.1M</h3>
                        </div>
                        <div className="p-2 bg-amber-100 rounded-lg">
                            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                        <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded">+23.1%</span>
                        <span className="text-sm text-gray-500">YoY growth</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Net Retention</span>
                            <span className="font-medium text-gray-900">108%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                            <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: '108%' }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}