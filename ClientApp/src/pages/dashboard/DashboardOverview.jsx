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
import { clientsAPI, campaignsAPI, tasksAPI, invoicesAPI, paymentsAPI } from "../../services/api";

export default function DashboardOverview() {
    const [stats, setStats] = useState({
        activeClients: 0,
        activeCampaigns: 0,
        monthlyRevenue: 0,
        totalRevenue: 0,
        pendingTasks: 0,
        inProgressTasks: 0,
        completedTasks: 0,
        overdueTasks: 0
    });

    const [campaignStatuses, setCampaignStatuses] = useState({
        active: 0,
        completed: 0,
        pending: 0
    });

    const [revenueData, setRevenueData] = useState([]);
    const [recentActivities, setRecentActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const formatTimeAgo = (date) => {
        const now = new Date();
        const diff = now - new Date(date);
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return "Just now";
        if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
        return new Date(date).toLocaleDateString();
    };

    const fetchStats = async () => {
        try {
            setLoading(true);
            // Fetch all data
            const [clientsRes, campaignsRes, tasksRes, invoicesRes, paymentsRes] = await Promise.all([
                clientsAPI.getAll({ pageSize: 1000 }),
                campaignsAPI.getAll({ pageSize: 1000 }),
                tasksAPI.getAll({ pageSize: 1000 }),
                invoicesAPI.getAll({ pageSize: 1000 }).catch(() => ({ items: [] })),
                paymentsAPI.getAll({ pageSize: 1000 }).catch(() => ({ items: [] }))
            ]);

            const clients = clientsRes.items || [];
            const campaigns = campaignsRes.items || [];
            const tasks = tasksRes.items || [];
            const invoices = invoicesRes.items || [];
            const payments = paymentsRes.items || [];

            // Calculate stats
            const activeClients = clients.filter(c => c.isActive).length;
            const activeCampaigns = campaigns.filter(c => c.status === 'Active').length;
            
            // Calculate revenue from paid invoices and payments
            const paidInvoices = invoices.filter(inv => inv.status === 'Paid');
            const totalRevenue = paidInvoices.reduce((sum, inv) => sum + (parseFloat(inv.totalAmount) || 0), 0);
            
            // Calculate monthly revenue (current month)
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();
            const monthlyRevenue = paidInvoices
                .filter(inv => {
                    const paidDate = inv.paidDate ? new Date(inv.paidDate) : new Date(inv.issueDate);
                    return paidDate.getMonth() === currentMonth && paidDate.getFullYear() === currentYear;
                })
                .reduce((sum, inv) => sum + (parseFloat(inv.totalAmount) || 0), 0);

            // Calculate revenue for last 6 months
            const revenueByMonth = [];
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            
            for (let i = 5; i >= 0; i--) {
                const date = new Date();
                date.setMonth(date.getMonth() - i);
                const month = date.getMonth();
                const year = date.getFullYear();
                
                const monthRevenue = paidInvoices
                    .filter(inv => {
                        const paidDate = inv.paidDate ? new Date(inv.paidDate) : new Date(inv.issueDate);
                        return paidDate.getMonth() === month && paidDate.getFullYear() === year;
                    })
                    .reduce((sum, inv) => sum + (parseFloat(inv.totalAmount) || 0), 0);
                
                revenueByMonth.push({
                    month: monthNames[month],
                    value: monthRevenue,
                    fullMonth: `${monthNames[month]} ${year}`
                });
            }

            // Task stats
            const pendingTasks = tasks.filter(t => t.status === 'Pending').length;
            const inProgressTasks = tasks.filter(t => t.status === 'InProgress').length;
            const completedTasks = tasks.filter(t => t.status === 'Completed').length;
            const now = new Date();
            const overdueTasks = tasks.filter(t => {
                if (t.status === 'Completed') return false;
                if (!t.dueDate) return false;
                return new Date(t.dueDate) < now;
            }).length;

            // Campaign status counts
            const campaignStatuses = {
                active: campaigns.filter(c => c.status === 'Active').length,
                completed: campaigns.filter(c => c.status === 'Completed').length,
                pending: campaigns.filter(c => c.status === 'Pending' || c.status === 'Planning').length
            };

            // Generate recent activities from various sources
            const activities = [];
            
            // Add recent campaigns
            campaigns
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 3)
                .forEach(campaign => {
                    activities.push({
                        id: `campaign-${campaign.id}`,
                        type: "campaign",
                        message: `Campaign "${campaign.name}" ${campaign.status === 'Active' ? 'is active' : 'was created'}`,
                        time: formatTimeAgo(campaign.createdAt),
                        createdAt: campaign.createdAt
                    });
                });

            // Add recent tasks
            tasks
                .filter(t => t.status === 'Completed')
                .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
                .slice(0, 2)
                .forEach(task => {
                    activities.push({
                        id: `task-${task.id}`,
                        type: "task",
                        message: `Task "${task.title}" was completed`,
                        time: formatTimeAgo(task.updatedAt || task.createdAt),
                        createdAt: task.updatedAt || task.createdAt
                    });
                });

            // Add recent clients
            clients
                .filter(c => c.isActive)
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 2)
                .forEach(client => {
                    activities.push({
                        id: `client-${client.id}`,
                        type: "client",
                        message: `New client "${client.companyName}" added`,
                        time: formatTimeAgo(client.createdAt),
                        createdAt: client.createdAt
                    });
                });

            // Add recent paid invoices
            paidInvoices
                .sort((a, b) => new Date(b.paidDate || b.issueDate) - new Date(a.paidDate || a.issueDate))
                .slice(0, 2)
                .forEach(invoice => {
                    activities.push({
                        id: `invoice-${invoice.id}`,
                        type: "invoice",
                        message: `Invoice #${invoice.invoiceNumber} marked as paid ($${parseFloat(invoice.totalAmount || 0).toLocaleString()})`,
                        time: formatTimeAgo(invoice.paidDate || invoice.issueDate),
                        createdAt: invoice.paidDate || invoice.issueDate
                    });
                });

            // Sort all activities by date and take most recent 6
            activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            const recentActivities = activities.slice(0, 6);

            // Calculate growth percentage
            const previousMonthRevenue = revenueByMonth.length >= 2 
                ? revenueByMonth[revenueByMonth.length - 2].value 
                : 0;
            const growth = previousMonthRevenue > 0 
                ? ((monthlyRevenue - previousMonthRevenue) / previousMonthRevenue * 100).toFixed(1)
                : 0;

            setStats({
                activeClients,
                activeCampaigns,
                monthlyRevenue,
                totalRevenue,
                pendingTasks,
                inProgressTasks,
                completedTasks,
                overdueTasks
            });
            setCampaignStatuses(campaignStatuses);
            setRevenueData(revenueByMonth);
            setRecentActivities(recentActivities);
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        } finally {
            setLoading(false);
        }
    };

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
            change: stats.monthlyRevenue > 0 ? "+" : "",
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

    const maxRevenue = revenueData.length > 0 
        ? Math.max(...revenueData.map(d => d.value), 1) 
        : 1;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-slate-400">Loading dashboard...</div>
            </div>
        );
    }

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
                            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 hover:border-slate-600/50 transition-all"
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
                <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-white mb-1">Revenue Overview</h2>
                            <p className="text-slate-400 text-sm">Last 6 months</p>
                        </div>
                        <TrendingUp className="text-emerald-400" size={24} />
                    </div>
                    {revenueData.length > 0 ? (
                        <>
                            <div className="h-64 flex items-end justify-between gap-2">
                                {revenueData.map((data, index) => {
                                    // Calculate height percentage - ensure bars are visible
                                    let heightPercent = 0;
                                    if (data.value > 0 && maxRevenue > 0) {
                                        heightPercent = (data.value / maxRevenue) * 100;
                                        // Ensure minimum height for visibility (at least 10% for non-zero values)
                                        heightPercent = Math.max(heightPercent, 10);
                                    } else {
                                        // Zero values get a small visible indicator
                                        heightPercent = 2;
                                    }
                                    return (
                                        <div key={index} className="flex-1 flex flex-col items-center group h-full">
                                            <div className="w-full h-full flex items-end">
                                                <div
                                                    className="w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg mb-2 transition-all hover:opacity-80 cursor-pointer"
                                                    style={{ height: `${heightPercent}%`, minHeight: data.value === 0 ? '2px' : '8px' }}
                                                    title={`${data.fullMonth}: $${data.value.toLocaleString()}`}
                                                />
                                            </div>
                                            <span className="text-xs text-slate-400 mt-2">{data.month}</span>
                                            <span className="text-xs text-slate-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                ${data.value.toLocaleString()}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="mt-4 pt-4 border-t border-slate-700/50 flex items-center justify-between">
                                <div>
                                    <p className="text-slate-400 text-sm">Total Revenue (6 months)</p>
                                    <p className="text-2xl font-bold text-white">
                                        ${revenueData.reduce((sum, d) => sum + d.value, 0).toLocaleString()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-slate-400 text-sm">This Month</p>
                                    <p className="text-xl font-bold text-emerald-400">
                                        ${stats.monthlyRevenue.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="h-64 flex items-center justify-center">
                            <div className="text-center">
                                <p className="text-slate-400 mb-2">No revenue data available</p>
                                <p className="text-slate-500 text-sm">Revenue will appear here once invoices are paid</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Task Status */}
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5">
                    <h2 className="text-xl font-bold text-white mb-4">Task Status</h2>
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
                            <span className="text-white font-semibold">{stats.inProgressTasks}</span>
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
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5">
                    <h2 className="text-xl font-bold text-white mb-4">Campaign Performance</h2>
                    <div className="space-y-4">
                        {[
                            { name: "Active", count: campaignStatuses.active, color: "emerald" },
                            { name: "Completed", count: campaignStatuses.completed, color: "blue" },
                            { name: "Pending", count: campaignStatuses.pending, color: "amber" }
                        ].map((status, index) => {
                            const total = campaignStatuses.active + campaignStatuses.completed + campaignStatuses.pending;
                            const percentage = total > 0 ? (status.count / total) * 100 : 0;
                            return (
                                <div key={index}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-slate-300">{status.name}</span>
                                        <span className="text-white font-semibold">{status.count}</span>
                                    </div>
                                    <div className="w-full bg-slate-700/50 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full bg-${status.color}-500`}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-white">Recent Activity</h2>
                        <button className="text-sm text-emerald-400 hover:text-emerald-300">
                            View All
                        </button>
                    </div>
                    <div className="space-y-4">
                        {recentActivities.length > 0 ? (
                            recentActivities.map((activity) => (
                                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-700/30 hover:bg-slate-700/50 transition-all">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0"></div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-slate-300 text-sm">{activity.message}</p>
                                        <p className="text-slate-500 text-xs mt-1">{activity.time}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-slate-400">No recent activity</p>
                            </div>
                        )}
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
