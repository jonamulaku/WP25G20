import { useState, useEffect } from "react";
import {
    Users,
    Megaphone,
    DollarSign,
    CheckSquare,
    TrendingUp,
    Clock,
    AlertCircle,
    ArrowUpRight,
    ArrowDownRight
} from "lucide-react";

export default function DashboardOverview() {
    const [stats, setStats] = useState({
        activeClients: 0,
        activeCampaigns: 0,
        monthlyRevenue: 0,
        pendingTasks: 0,
        completedTasks: 0,
        overdueTasks: 0
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // TODO: Fetch real data from API
        // For now, using mock data
        setTimeout(() => {
            setStats({
                activeClients: 24,
                activeCampaigns: 18,
                monthlyRevenue: 125000,
                pendingTasks: 12,
                completedTasks: 45,
                overdueTasks: 3
            });
            setLoading(false);
        }, 500);
    }, []);

    const kpiCards = [
        {
            title: "Active Clients",
            value: stats.activeClients,
            icon: Users,
            color: "emerald",
            change: "+12%",
            trend: "up"
        },
        {
            title: "Active Campaigns",
            value: stats.activeCampaigns,
            icon: Megaphone,
            color: "blue",
            change: "+5",
            trend: "up"
        },
        {
            title: "Monthly Revenue",
            value: `$${stats.monthlyRevenue.toLocaleString()}`,
            icon: DollarSign,
            color: "green",
            change: "+18%",
            trend: "up"
        },
        {
            title: "Pending Tasks",
            value: stats.pendingTasks,
            icon: CheckSquare,
            color: "amber",
            change: "-3",
            trend: "down"
        }
    ];

    const recentActivities = [
        { id: 1, type: "campaign", message: "New campaign 'Q1 Social Media' created", time: "2 hours ago" },
        { id: 2, type: "task", message: "Task 'Design Logo' completed by John Doe", time: "4 hours ago" },
        { id: 3, type: "client", message: "New client 'Tech Corp' added", time: "1 day ago" },
        { id: 4, type: "invoice", message: "Invoice #1234 marked as paid", time: "2 days ago" },
    ];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
                <p className="text-slate-400">Welcome back! Here's what's happening with your agency today.</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpiCards.map((card, index) => {
                    const Icon = card.icon;
                    const colorClasses = {
                        emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
                        blue: "bg-blue-500/10 border-blue-500/20 text-blue-400",
                        green: "bg-green-500/10 border-green-500/20 text-green-400",
                        amber: "bg-amber-500/10 border-amber-500/20 text-amber-400"
                    };
                    return (
                        <div
                            key={index}
                            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600/50 transition-all"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-xl ${colorClasses[card.color]}`}>
                                    <Icon size={24} />
                                </div>
                                <div className={`flex items-center gap-1 text-sm ${
                                    card.trend === "up" ? "text-emerald-400" : "text-red-400"
                                }`}>
                                    {card.trend === "up" ? (
                                        <ArrowUpRight size={16} />
                                    ) : (
                                        <ArrowDownRight size={16} />
                                    )}
                                    <span>{card.change}</span>
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-1">{card.value}</h3>
                            <p className="text-slate-400 text-sm">{card.title}</p>
                        </div>
                    );
                })}
            </div>

            {/* Charts and Stats Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-white mb-1">Revenue Overview</h2>
                            <p className="text-slate-400 text-sm">Last 6 months</p>
                        </div>
                        <TrendingUp className="text-emerald-400" size={24} />
                    </div>
                    <div className="h-64 flex items-end justify-between gap-2">
                        {[45000, 62000, 58000, 75000, 89000, 125000].map((value, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center">
                                <div
                                    className="w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg mb-2 transition-all hover:opacity-80"
                                    style={{ height: `${(value / 125000) * 100}%` }}
                                />
                                <span className="text-xs text-slate-400">M{index + 1}</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-700/50 flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 text-sm">Total Revenue</p>
                            <p className="text-2xl font-bold text-white">$468,000</p>
                        </div>
                        <div className="text-right">
                            <p className="text-slate-400 text-sm">Growth</p>
                            <p className="text-xl font-bold text-emerald-400">+18.2%</p>
                        </div>
                    </div>
                </div>

                {/* Task Status */}
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-white mb-6">Task Status</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                                <span className="text-slate-300">Completed</span>
                            </div>
                            <span className="text-white font-semibold">{stats.completedTasks}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                <span className="text-slate-300">In Progress</span>
                            </div>
                            <span className="text-white font-semibold">{stats.pendingTasks}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <span className="text-slate-300">Overdue</span>
                            </div>
                            <span className="text-white font-semibold">{stats.overdueTasks}</span>
                        </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-slate-700/50">
                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                            <Clock size={16} />
                            <span>Last updated: Just now</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Campaign Performance & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Campaign Performance */}
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-white mb-6">Campaign Performance</h2>
                    <div className="space-y-4">
                        {[
                            { name: "Active", count: 12, color: "emerald" },
                            { name: "Completed", count: 8, color: "blue" },
                            { name: "Pending", count: 3, color: "amber" }
                        ].map((status, index) => (
                            <div key={index}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-slate-300">{status.name}</span>
                                    <span className="text-white font-semibold">{status.count}</span>
                                </div>
                                <div className="w-full bg-slate-700/50 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full bg-${status.color}-500`}
                                        style={{ width: `${(status.count / 23) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white">Recent Activity</h2>
                        <button className="text-sm text-emerald-400 hover:text-emerald-300">
                            View All
                        </button>
                    </div>
                    <div className="space-y-4">
                        {recentActivities.map((activity) => (
                            <div key={activity.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-700/30 hover:bg-slate-700/50 transition-all">
                                <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2"></div>
                                <div className="flex-1">
                                    <p className="text-slate-300 text-sm">{activity.message}</p>
                                    <p className="text-slate-500 text-xs mt-1">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Alerts Section */}
            {stats.overdueTasks > 0 && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6">
                    <div className="flex items-center gap-3">
                        <AlertCircle className="text-amber-400" size={24} />
                        <div>
                            <h3 className="text-white font-semibold">Action Required</h3>
                            <p className="text-slate-400 text-sm">
                                You have {stats.overdueTasks} overdue task{stats.overdueTasks > 1 ? 's' : ''} that need attention.
                            </p>
                        </div>
                        <button className="ml-auto px-4 py-2 bg-amber-500/20 text-amber-400 rounded-xl hover:bg-amber-500/30 transition-all text-sm font-medium">
                            View Tasks
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
