import { Download, Filter, TrendingUp, BarChart3, PieChart } from "lucide-react";

export default function ReportsPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Reports & Analytics</h1>
                    <p className="text-slate-400">Generate comprehensive reports and analyze performance metrics</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-6 py-3 bg-slate-700/50 text-white rounded-xl font-semibold hover:bg-slate-700 transition-all flex items-center gap-2">
                        <Filter size={20} />
                        Filter
                    </button>
                    <button className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all flex items-center gap-2">
                        <Download size={20} />
                        Export Report
                    </button>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-white mb-1">Revenue Growth</h2>
                            <p className="text-slate-400 text-sm">Last 12 months</p>
                        </div>
                        <TrendingUp className="text-emerald-400" size={24} />
                    </div>
                    <div className="h-64 flex items-end justify-between gap-2">
                        {[35000, 42000, 38000, 45000, 52000, 58000, 62000, 68000, 72000, 78000, 85000, 92000].map((value, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center">
                                <div
                                    className="w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg mb-2 transition-all hover:opacity-80"
                                    style={{ height: `${(value / 92000) * 100}%` }}
                                />
                                <span className="text-xs text-slate-400">{['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][index]}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Campaign Performance */}
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-white mb-1">Campaign Performance</h2>
                            <p className="text-slate-400 text-sm">By status</p>
                        </div>
                        <BarChart3 className="text-blue-400" size={24} />
                    </div>
                    <div className="h-64 flex items-end justify-between gap-4">
                        {[
                            { label: "Active", value: 12, colorClass: "from-emerald-500 to-emerald-400" },
                            { label: "Completed", value: 8, colorClass: "from-blue-500 to-blue-400" },
                            { label: "Pending", value: 3, colorClass: "from-amber-500 to-amber-400" }
                        ].map((item, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center">
                                <div className="flex flex-col items-center mb-2">
                                    <span className="text-2xl font-bold text-white mb-1">{item.value}</span>
                                    <span className="text-xs text-slate-400">{item.label}</span>
                                </div>
                                <div
                                    className={`w-full bg-gradient-to-t ${item.colorClass} rounded-t-lg transition-all hover:opacity-80`}
                                    style={{ height: `${(item.value / 12) * 100}%` }}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Task Completion */}
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-white mb-1">Task Completion</h2>
                            <p className="text-slate-400 text-sm">Overall statistics</p>
                        </div>
                        <PieChart className="text-purple-400" size={24} />
                    </div>
                    <div className="space-y-4">
                        {[
                            { label: "Completed", value: 45, colorClass: "bg-emerald-500", percentage: 65 },
                            { label: "In Progress", value: 18, colorClass: "bg-blue-500", percentage: 26 },
                            { label: "Pending", value: 6, colorClass: "bg-amber-500", percentage: 9 }
                        ].map((item, index) => (
                            <div key={index}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-slate-300">{item.label}</span>
                                    <span className="text-white font-semibold">{item.value}</span>
                                </div>
                                <div className="w-full bg-slate-700/50 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full ${item.colorClass}`}
                                        style={{ width: `${item.percentage}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Client Growth */}
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-white mb-1">Client Growth</h2>
                            <p className="text-slate-400 text-sm">New clients over time</p>
                        </div>
                        <TrendingUp className="text-emerald-400" size={24} />
                    </div>
                    <div className="h-64 flex items-end justify-between gap-2">
                        {[2, 3, 2, 4, 3, 5, 4, 6, 5, 7, 6, 8].map((value, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center">
                                <div
                                    className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg mb-2 transition-all hover:opacity-80"
                                    style={{ height: `${(value / 8) * 100}%` }}
                                />
                                <span className="text-xs text-slate-400">{['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][index]}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
