import { useState, useEffect } from "react";
import { Filter, TrendingUp, BarChart3, PieChart } from "lucide-react";
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

            // Debug: Log unique task statuses to verify what we're getting
            const uniqueStatuses = [...new Set(tasks.map(t => t.status))];
            console.log('Task statuses found:', uniqueStatuses);

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

            // Task completion - normalize status values (handle both 'InProgress' and 'In Progress')
            const normalizeStatus = (status) => {
                if (!status) return status;
                // Normalize common variations
                if (status === 'In Progress' || status === 'InProgress') return 'InProgress';
                return status;
            };

            const taskData = {
                completed: tasks.filter(t => normalizeStatus(t.status) === 'Completed').length,
                inProgress: tasks.filter(t => normalizeStatus(t.status) === 'InProgress').length,
                pending: tasks.filter(t => normalizeStatus(t.status) === 'Pending').length
            };

            // Debug: Log task counts
            console.log('Task counts:', taskData);

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

    // For campaign performance, ensure bars are visible with high contrast
    const maxCampaigns = Math.max(campaignData.active, campaignData.completed, campaignData.pending, 1);
    // Scale so max value uses ~100% of height for maximum prominence
    const campaignScale = maxCampaigns > 0 ? maxCampaigns : 1;
    
    // For client growth, ensure bars are visible with high contrast
    const maxClients = clientGrowth.length > 0 
        ? Math.max(...clientGrowth.map(d => d.value), 1) 
        : 1;
    // Scale so max value uses ~100% of height for maximum prominence
    const clientScale = maxClients > 0 ? maxClients : 1;

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
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-white mb-1">Revenue Growth</h2>
                            <p className="text-slate-400 text-sm">Last 12 months</p>
                        </div>
                        <TrendingUp className="text-emerald-400" size={24} />
                    </div>
                    {revenueData.length > 0 ? (
                        <div className="h-64 flex items-end justify-between gap-1">
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
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5">
                    {/* Header - Fixed at top with proper spacing */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-xl font-bold text-white mb-1">Campaign Performance</h2>
                            <p className="text-slate-400 text-sm">By status</p>
                        </div>
                        <BarChart3 className="text-blue-400 flex-shrink-0" size={24} />
                    </div>
                    
                    {/* Graph Area - Bars starting from bottom */}
                    <div className="mb-6">
                        <div className="h-44 flex items-end justify-between gap-4">
                            {[
                                { label: "Active", value: campaignData.active, colorClass: "from-emerald-500 to-emerald-400" },
                                { label: "Completed", value: campaignData.completed, colorClass: "from-blue-500 to-blue-400" },
                                { label: "Pending", value: campaignData.pending, colorClass: "from-amber-500 to-amber-400" }
                            ].map((item, index) => {
                                // Calculate height in pixels - proportional scaling based on max value
                                // Container height is 176px (h-44 = 11rem = 176px)
                                let barHeight = 0;
                                if (item.value > 0 && campaignScale > 0) {
                                    // Direct proportional scaling: value 2 = 176px, value 1 = 88px, etc.
                                    barHeight = (item.value / campaignScale) * 176;
                                    // Ensure it doesn't exceed container height
                                    barHeight = Math.min(barHeight, 176);
                                } else if (item.value === 0) {
                                    // Zero values get a small visible indicator
                                    barHeight = 4;
                                }
                                return (
                                    <div key={index} className="flex-1 flex flex-col items-center h-full">
                                        {/* Bar Container - aligned to bottom */}
                                        <div className="w-full h-44 flex items-end">
                                            <div
                                                className={`w-full bg-gradient-to-t ${item.colorClass} rounded-t-lg transition-all hover:opacity-80 ${item.value === 0 ? 'opacity-50' : ''}`}
                                                style={{ 
                                                    height: `${barHeight}px`, 
                                                    minHeight: item.value === 0 ? '4px' : '0px'
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        
                        {/* Labels Below Bars - Separate row */}
                        <div className="flex justify-between gap-4 mt-4">
                            {[
                                { label: "Active", value: campaignData.active },
                                { label: "Completed", value: campaignData.completed },
                                { label: "Pending", value: campaignData.pending }
                            ].map((item, index) => (
                                <div key={index} className="flex-1 flex flex-col items-center">
                                    <span className="text-2xl font-bold text-white">{item.value}</span>
                                    <span className="text-xs text-slate-400 mt-1">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Stats Section - Clear separation with border */}
                    <div className="pt-6 mt-6 border-t border-slate-700/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm mb-1">Total Campaigns</p>
                                <p className="text-xl font-bold text-white">
                                    {campaignData.active + campaignData.completed + campaignData.pending}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-slate-400 text-sm mb-1">Completion Rate</p>
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
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5">
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
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-white mb-1">Client Growth</h2>
                            <p className="text-slate-400 text-sm">New clients over time</p>
                        </div>
                        <TrendingUp className="text-emerald-400" size={24} />
                    </div>
                    {clientGrowth.length > 0 ? (
                        <div className="h-64 flex items-end justify-between gap-1">
                            {clientGrowth.map((data, index) => {
                                // Calculate height percentage - ensure bars are visible
                                let heightPercent = 0;
                                if (data.value > 0 && clientScale > 0) {
                                    // Direct proportional scaling - max value gets 100% height
                                    heightPercent = (data.value / clientScale) * 100;
                                    // Cap at 100% for the maximum value
                                    heightPercent = Math.min(heightPercent, 100);
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
                                                title={`${data.month}: ${data.value} new client${data.value !== 1 ? 's' : ''}`}
                                            />
                                        </div>
                                        <span className="text-xs text-slate-400 mt-2">{data.month}</span>
                                        <span className="text-xs text-slate-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {data.value}
                                        </span>
                                    </div>
                                );
                            })}
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
                                <p className="text-xl font-bold text-emerald-400">
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
