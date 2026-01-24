import { useState, useEffect } from "react";
import {
    Megaphone,
    DollarSign,
    CheckCircle2,
    Clock,
    TrendingUp,
    AlertCircle,
    ArrowUpRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { campaignsAPI, approvalsAPI, tasksAPI } from "../../services/api";
import { useOutletContext } from "react-router-dom";

export default function ClientDashboard() {
    const { userInfo } = useOutletContext();
    const [stats, setStats] = useState({
        activeCampaigns: 0,
        totalBudget: 0,
        spent: 0,
        pendingApprovals: 0,
        approvedItems: 0,
        pendingInvoices: 0
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, [userInfo]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [campaignsRes] = await Promise.all([
                campaignsAPI.getAll({ pageSize: 1000 })
            ]);
            const campaigns = campaignsRes.items || [];
            
            // Calculate stats from real data
            const activeCampaigns = campaigns.filter(c => c.status === 'Active').length;
            const totalBudget = campaigns.reduce((sum, c) => sum + (c.budget || 0), 0);
            const totalTasks = campaigns.reduce((sum, c) => sum + (c.taskCount || 0), 0);
            const completedTasks = campaigns.reduce((sum, c) => sum + (c.completedTaskCount || 0), 0);
            
            // Get pending approvals count - count completed tasks that haven't been approved yet
            let pendingApprovals = 0;
            try {
                // Fetch all tasks for client's campaigns
                const tasksRes = await tasksAPI.getAll({ pageSize: 1000 });
                const allTasks = tasksRes.items || [];
                
                // Get client's campaign IDs
                const clientCampaignIds = campaigns.map(c => c.id);
                
                // Filter to completed tasks in client's campaigns
                const clientCompletedTasks = allTasks.filter(task => 
                    task.status === "Completed" && 
                    clientCampaignIds.includes(task.campaignId)
                );
                
                // Fetch approval requests to see which tasks are approved
                const approvalsRes = await approvalsAPI.getAll({ pageSize: 1000 });
                const approvedTaskIds = new Set(
                    (approvalsRes.items || [])
                        .filter(a => a.taskId && a.status === "Approved")
                        .map(a => a.taskId)
                );
                
                // Count completed tasks that haven't been approved yet
                pendingApprovals = clientCompletedTasks.filter(task => !approvedTaskIds.has(task.id)).length;
            } catch (error) {
                console.warn('Could not fetch approvals:', error);
            }
            
            setStats({
                activeCampaigns,
                totalBudget,
                spent: 0, // Budget spent tracking can be added later
                pendingApprovals,
                approvedItems: completedTasks,
                pendingInvoices: 0 // TODO: Implement when invoices API is ready
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            alert('Failed to fetch dashboard data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const kpiCards = [
        {
            title: "Active Campaigns",
            value: stats.activeCampaigns,
            icon: Megaphone,
            color: "blue",
            link: "/client-dashboard/campaigns"
        },
        {
            title: "Total Budget",
            value: `$${stats.totalBudget.toLocaleString()}`,
            icon: DollarSign,
            color: "green"
        },
        {
            title: "Spent",
            value: `$${stats.spent.toLocaleString()}`,
            icon: DollarSign,
            color: "emerald",
            subValue: `${((stats.spent / stats.totalBudget) * 100).toFixed(1)}% of budget`
        },
        {
            title: "Pending Approvals",
            value: stats.pendingApprovals,
            icon: CheckCircle2,
            color: "amber",
            link: "/client-dashboard/approvals"
        }
    ];

    const recentActivities = [
        // TODO: Replace with real activity feed from API
        { id: 1, type: "campaign", message: "View your campaigns", time: "Recently", link: "/client-dashboard/campaigns" },
    ];

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
                <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
                <p className="text-slate-400">Welcome back! Here's an overview of your campaigns and activities.</p>
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
                    const CardWrapper = card.link ? Link : "div";
                    const cardProps = card.link ? { to: card.link } : {};
                    
                    return (
                        <CardWrapper
                            key={index}
                            {...cardProps}
                            className={`bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600/50 transition-all ${card.link ? 'cursor-pointer' : ''}`}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-xl ${colorClasses[card.color]}`}>
                                    <Icon size={24} />
                                </div>
                                {card.subValue && (
                                    <span className="text-xs text-slate-400">{card.subValue}</span>
                                )}
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-1">{card.value}</h3>
                            <p className="text-slate-400 text-sm">{card.title}</p>
                        </CardWrapper>
                    );
                })}
            </div>

            {/* Budget Overview & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Budget Overview */}
                <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-white mb-1">Budget Overview</h2>
                            <p className="text-slate-400 text-sm">All active campaigns</p>
                        </div>
                        <TrendingUp className="text-emerald-400" size={24} />
                    </div>
                    <div className="space-y-4">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-slate-300">Spent</span>
                                <span className="text-white font-semibold">${stats.spent.toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-slate-700/50 rounded-full h-3">
                                <div
                                    className="h-3 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                                    style={{ width: `${(stats.spent / stats.totalBudget) * 100}%` }}
                                />
                            </div>
                            <div className="flex items-center justify-between mt-2">
                                <span className="text-slate-400 text-sm">Total Budget</span>
                                <span className="text-slate-400 text-sm">${stats.totalBudget.toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-slate-700/50 grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-slate-400 text-sm">Remaining</p>
                                <p className="text-xl font-bold text-white">${(stats.totalBudget - stats.spent).toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm">Approved Items</p>
                                <p className="text-xl font-bold text-emerald-400">{stats.approvedItems}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white">Recent Activity</h2>
                    </div>
                    <div className="space-y-4">
                        {recentActivities.map((activity) => (
                            <Link
                                key={activity.id}
                                to={activity.link}
                                className="flex items-start gap-3 p-3 rounded-xl bg-slate-700/30 hover:bg-slate-700/50 transition-all block"
                            >
                                <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2"></div>
                                <div className="flex-1">
                                    <p className="text-slate-300 text-sm">{activity.message}</p>
                                    <p className="text-slate-500 text-xs mt-1">{activity.time}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Alerts Section */}
            {stats.pendingApprovals > 0 && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6">
                    <div className="flex items-center gap-3">
                        <AlertCircle className="text-amber-400" size={24} />
                        <div className="flex-1">
                            <h3 className="text-white font-semibold">Action Required</h3>
                            <p className="text-slate-400 text-sm">
                                You have {stats.pendingApprovals} pending approval{stats.pendingApprovals > 1 ? 's' : ''} that need your attention.
                            </p>
                        </div>
                        <Link
                            to="/client-dashboard/approvals"
                            className="px-4 py-2 bg-amber-500/20 text-amber-400 rounded-xl hover:bg-amber-500/30 transition-all text-sm font-medium"
                        >
                            Review Approvals
                        </Link>
                    </div>
                </div>
            )}

            {stats.pendingInvoices > 0 && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
                    <div className="flex items-center gap-3">
                        <AlertCircle className="text-blue-400" size={24} />
                        <div className="flex-1">
                            <h3 className="text-white font-semibold">Pending Invoices</h3>
                            <p className="text-slate-400 text-sm">
                                You have {stats.pendingInvoices} invoice{stats.pendingInvoices > 1 ? 's' : ''} waiting for payment.
                            </p>
                        </div>
                        <Link
                            to="/client-dashboard/billing"
                            className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-xl hover:bg-blue-500/30 transition-all text-sm font-medium"
                        >
                            View Invoices
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
