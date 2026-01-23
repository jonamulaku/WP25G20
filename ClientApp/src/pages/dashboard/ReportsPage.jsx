import { useState, useEffect } from "react";
import { Download, Filter, TrendingUp, BarChart3, PieChart } from "lucide-react";
import { campaignsAPI, tasksAPI, invoicesAPI, clientsAPI } from "../../services/api";

export default function ReportsPage() {
    const [loading, setLoading] = useState(true);
    const [revenueData, setRevenueData] = useState([]);
    const [campaignData, setCampaignData] = useState({ active: 0, completed: 0, pending: 0 });
    const [taskData, setTaskData] = useState({ completed: 0, inProgress: 0, pending: 0 });
    const [clientGrowth, setClientGrowth] = useState([]);

    useEffect(() => {
        fetchReportData();
    }, []);

    const fetchReportData = async () => {
        try {
            setLoading(true);
            const [campaignsRes, tasksRes, invoicesRes, clientsRes] = await Promise.all([
                campaignsAPI.getAll({ pageSize: 1000 }),
                tasksAPI.getAll({ pageSize: 1000 }),
                invoicesAPI.getAll({ pageSize: 1000 }).catch(() => ({ items: [] })),
                clientsAPI.getAll({ pageSize: 1000 })
            ]);

            const campaigns = campaignsRes.items || [];
            const tasks = tasksRes.items || [];
            const invoices = invoicesRes.items || [];
            const clients = clientsRes.items || [];

            // Calculate revenue for last 12 months
            const paidInvoices = invoices.filter(inv => inv.status === 'Paid');
            const monthNames = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
            const revenueByMonth = [];
            
            for (let i = 11; i >= 0; i--) {
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

            // Campaign performance
            const campaignData = {
                active: campaigns.filter(c => c.status === 'Active').length,
                completed: campaigns.filter(c => c.status === 'Completed').length,
                pending: campaigns.filter(c => c.status === 'Pending' || c.status === 'Planning').length
            };

            // Task completion
            const taskData = {
                completed: tasks.filter(t => t.status === 'Completed').length,
                inProgress: tasks.filter(t => t.status === 'In Progress').length,
                pending: tasks.filter(t => t.status === 'Pending').length
            };

            // Client growth (last 12 months)
            const clientGrowthData = [];
            for (let i = 11; i >= 0; i--) {
                const date = new Date();
                date.setMonth(date.getMonth() - i);
                const month = date.getMonth();
                const year = date.getFullYear();
                
                const newClients = clients.filter(c => {
                    const createdDate = new Date(c.createdAt);
                    return createdDate.getMonth() === month && createdDate.getFullYear() === year;
                }).length;
                
                clientGrowthData.push({
                    month: monthNames[month],
                    value: newClients
                });
            }

            setRevenueData(revenueByMonth);
            setCampaignData(campaignData);
            setTaskData(taskData);
            setClientGrowth(clientGrowthData);
        } catch (error) {
            console.error('Error fetching report data:', error);
        } finally {
            setLoading(false);
        }
    };

    const maxRevenue = revenueData.length > 0 
        ? Math.max(...revenueData.map(d => d.value), 1) 
        : 1;

    const maxCampaigns = Math.max(campaignData.active, campaignData.completed, campaignData.pending, 1);
    const maxClients = clientGrowth.length > 0 
        ? Math.max(...clientGrowth.map(d => d.value), 1) 
        : 1;

    const totalTasks = taskData.completed + taskData.inProgress + taskData.pending;
    const taskPercentages = {
        completed: totalTasks > 0 ? (taskData.completed / totalTasks) * 100 : 0,
        inProgress: totalTasks > 0 ? (taskData.inProgress / totalTasks) * 100 : 0,
        pending: totalTasks > 0 ? (taskData.pending / totalTasks) * 100 : 0
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-slate-400">Loading reports...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Reports & Analytics</h1>
                    <p className="text-slate-400">Comprehensive reports and performance metrics</p>
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
                    {revenueData.length > 0 ? (
                        <div className="h-64 flex items-end justify-between gap-1">
                            {revenueData.map((data, index) => (
                                <div key={index} className="flex-1 flex flex-col items-center group">
                                    <div className="w-full relative">
                                        <div
                                            className="w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg mb-2 transition-all hover:opacity-80 cursor-pointer"
                                            style={{ height: `${(data.value / maxRevenue) * 100}%`, minHeight: '4px' }}
                                            title={`${data.fullMonth}: $${data.value.toLocaleString()}`}
                                        />
                                    </div>
                                    <span className="text-xs text-slate-400">{data.month}</span>
                                    <span className="text-xs text-slate-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        ${data.value.toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-64 flex items-center justify-center">
                            <p className="text-slate-400">No revenue data available</p>
                        </div>
                    )}
                    <div className="mt-4 pt-4 border-t border-slate-700/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm">Total Revenue</p>
                                <p className="text-xl font-bold text-white">
                                    ${revenueData.reduce((sum, d) => sum + d.value, 0).toLocaleString()}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-slate-400 text-sm">Average/Month</p>
                                <p className="text-xl font-bold text-emerald-400">
                                    ${revenueData.length > 0 ? Math.round(revenueData.reduce((sum, d) => sum + d.value, 0) / revenueData.length).toLocaleString() : 0}
                                </p>
                            </div>
                        </div>
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
                            { label: "Active", value: campaignData.active, colorClass: "from-emerald-500 to-emerald-400" },
                            { label: "Completed", value: campaignData.completed, colorClass: "from-blue-500 to-blue-400" },
                            { label: "Pending", value: campaignData.pending, colorClass: "from-amber-500 to-amber-400" }
                        ].map((item, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center">
                                <div className="flex flex-col items-center mb-2">
                                    <span className="text-2xl font-bold text-white mb-1">{item.value}</span>
                                    <span className="text-xs text-slate-400">{item.label}</span>
                                </div>
                                <div
                                    className={`w-full bg-gradient-to-t ${item.colorClass} rounded-t-lg transition-all hover:opacity-80`}
                                    style={{ height: `${(item.value / maxCampaigns) * 100}%`, minHeight: '4px' }}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-700/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm">Total Campaigns</p>
                                <p className="text-xl font-bold text-white">
                                    {campaignData.active + campaignData.completed + campaignData.pending}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-slate-400 text-sm">Completion Rate</p>
                                <p className="text-xl font-bold text-emerald-400">
                                    {campaignData.active + campaignData.completed + campaignData.pending > 0
                                        ? Math.round((campaignData.completed / (campaignData.active + campaignData.completed + campaignData.pending)) * 100)
                                        : 0}%
                                </p>
                            </div>
                        </div>
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
                            { label: "Completed", value: taskData.completed, colorClass: "bg-emerald-500", percentage: taskPercentages.completed },
                            { label: "In Progress", value: taskData.inProgress, colorClass: "bg-blue-500", percentage: taskPercentages.inProgress },
                            { label: "Pending", value: taskData.pending, colorClass: "bg-amber-500", percentage: taskPercentages.pending }
                        ].map((item, index) => (
                            <div key={index}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-slate-300">{item.label}</span>
                                    <span className="text-white font-semibold">{item.value} ({item.percentage.toFixed(1)}%)</span>
                                </div>
                                <div className="w-full bg-slate-700/50 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full ${item.colorClass} transition-all`}
                                        style={{ width: `${item.percentage}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 pt-6 border-t border-slate-700/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm">Total Tasks</p>
                                <p className="text-xl font-bold text-white">{totalTasks}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-slate-400 text-sm">Completion Rate</p>
                                <p className="text-xl font-bold text-emerald-400">
                                    {totalTasks > 0 ? Math.round((taskData.completed / totalTasks) * 100) : 0}%
                                </p>
                            </div>
                        </div>
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
                    {clientGrowth.length > 0 ? (
                        <div className="h-64 flex items-end justify-between gap-1">
                            {clientGrowth.map((data, index) => (
                                <div key={index} className="flex-1 flex flex-col items-center group">
                                    <div className="w-full relative">
                                        <div
                                            className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg mb-2 transition-all hover:opacity-80 cursor-pointer"
                                            style={{ height: `${(data.value / maxClients) * 100}%`, minHeight: '4px' }}
                                            title={`${data.month}: ${data.value} new client${data.value !== 1 ? 's' : ''}`}
                                        />
                                    </div>
                                    <span className="text-xs text-slate-400">{data.month}</span>
                                    <span className="text-xs text-slate-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {data.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-64 flex items-center justify-center">
                            <p className="text-slate-400">No client growth data available</p>
                        </div>
                    )}
                    <div className="mt-4 pt-4 border-t border-slate-700/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm">Total New Clients</p>
                                <p className="text-xl font-bold text-white">
                                    {clientGrowth.reduce((sum, d) => sum + d.value, 0)}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-slate-400 text-sm">Average/Month</p>
                                <p className="text-xl font-bold text-blue-400">
                                    {clientGrowth.length > 0 
                                        ? (clientGrowth.reduce((sum, d) => sum + d.value, 0) / clientGrowth.length).toFixed(1)
                                        : 0}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
