'use client';

export default function AnalyticsPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <header className="flex justify-between items-end mb-8">
                <div>
                    <span className="text-xs uppercase tracking-widest text-surface-800 font-medium mb-1 block">
                        Mastery Tracking
                    </span>
                    <h1 className="text-4xl font-serif text-surface-900 leading-none">Your Progress</h1>
                </div>

                <div className="flex gap-4">
                    <select className="bg-surface-50 border border-surface-200 text-surface-900 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300">
                        <option>All Courses</option>
                        <option>Advanced Calculus</option>
                        <option>Physics 101</option>
                    </select>
                    <select className="bg-surface-50 border border-surface-200 text-surface-900 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300">
                        <option>Last 30 Days</option>
                        <option>This Semester</option>
                        <option>All Time</option>
                    </select>
                </div>
            </header>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass p-6 rounded-3xl shadow-soft">
                    <p className="text-sm text-surface-800 font-medium mb-2">Overall Mastery</p>
                    <div className="flex items-end gap-3">
                        <h4 className="text-4xl font-serif text-surface-900">76%</h4>
                        <span className="text-sm font-medium text-green-600 mb-1 flex items-center">
                            <svg className="w-4 h-4 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                            </svg> +4%
                        </span>
                    </div>
                </div>
                <div className="glass p-6 rounded-3xl shadow-soft">
                    <p className="text-sm text-surface-800 font-medium mb-2">Questions Asked</p>
                    <h4 className="text-4xl font-serif text-surface-900">142</h4>
                </div>
                <div className="glass p-6 rounded-3xl shadow-soft">
                    <p className="text-sm text-surface-800 font-medium mb-2">Study Time (AI Context)</p>
                    <h4 className="text-4xl font-serif text-surface-900">
                        14<span className="text-lg text-surface-500 font-sans ml-1">hrs</span> 20<span
                            className="text-lg text-surface-500 font-sans ml-1">mins</span>
                    </h4>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Mastery Chart */}
                <div className="glass p-8 rounded-3xl shadow-soft border-t border-white/60 flex flex-col items-center">
                    <div className="w-full flex justify-between items-center mb-8">
                        <h3 className="text-lg font-serif text-surface-900">Topic Acquisition Rate</h3>
                        <button className="p-1.5 text-surface-500 hover:text-surface-900 rounded bg-surface-100">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                            </svg>
                        </button>
                    </div>

                    {/* Chart Container style (mockup specific inline styles handled with tailwind mostly) */}
                    <div className="w-full h-40 flex items-end gap-2 pt-5 border-b border-surface-200">
                        <div className="flex flex-col items-center gap-2 flex-1 justify-end h-full">
                            <div className="w-full rounded-t relative transition-all duration-500 bg-surface-300" style={{ height: '20%' }} data-val="Oct 1"></div>
                            <span className="text-xs text-surface-500">W1</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 flex-1 justify-end h-full">
                            <div className="w-full rounded-t relative transition-all duration-500 bg-surface-300" style={{ height: '35%' }} data-val="Oct 8"></div>
                            <span className="text-xs text-surface-500">W2</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 flex-1 justify-end h-full">
                            <div className="w-full rounded-t relative transition-all duration-500 bg-brand-300" style={{ height: '45%' }} data-val="Oct 15"></div>
                            <span className="text-xs text-surface-500">W3</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 flex-1 justify-end h-full">
                            <div className="w-full rounded-t relative transition-all duration-500 bg-brand-400" style={{ height: '60%' }} data-val="Oct 22"></div>
                            <span className="text-xs text-surface-800 font-medium">W4</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 flex-1 justify-end h-full">
                            <div className="w-full rounded-t relative transition-all duration-500 bg-brand-500 shadow-float" style={{ height: '85%' }} data-val="Oct 29"></div>
                            <span className="text-xs text-brand-700 font-medium">W5</span>
                        </div>
                    </div>
                </div>

                {/* Focus Areas */}
                <div className="glass p-8 rounded-3xl shadow-soft flex flex-col">
                    <h3 className="text-lg font-serif text-surface-900 mb-6">Current Concept Focus</h3>

                    <div className="space-y-6 flex-1">

                        {/* Item */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-surface-900">Derivatives (Calculus)</span>
                                <span className="text-xs font-semibold text-brand-700">92%</span>
                            </div>
                            <div className="w-full bg-surface-200 h-2 rounded-full overflow-hidden">
                                <div className="bg-brand-500 h-full rounded-full" style={{ width: '92%' }}></div>
                            </div>
                        </div>

                        {/* Item */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-surface-900">Kinematics (Physics)</span>
                                <span className="text-xs font-semibold text-brand-600">75%</span>
                            </div>
                            <div className="w-full bg-surface-200 h-2 rounded-full overflow-hidden">
                                <div className="bg-brand-400 h-full rounded-full" style={{ width: '75%' }}></div>
                            </div>
                        </div>

                        {/* Item */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-surface-900 flex items-center gap-2">
                                    Limits at Infinity
                                    <span className="bg-surface-200 text-surface-600 text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wide">
                                        Needs Review
                                    </span>
                                </span>
                                <span className="text-xs font-semibold text-surface-600">40%</span>
                            </div>
                            <div className="w-full bg-surface-200 h-2 rounded-full overflow-hidden">
                                <div className="bg-surface-400 h-full rounded-full" style={{ width: '40%' }}></div>
                            </div>
                        </div>

                    </div>

                    <button className="w-full bg-surface-50 border border-surface-200 text-surface-900 px-4 py-3 rounded-2xl font-medium hover:bg-surface-100 transition-colors mt-6 text-sm">
                        Generate Study Plan
                    </button>
                </div>

            </div>

        </div>
    );
}
