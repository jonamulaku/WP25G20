import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
    ArrowUpRight,
    ArrowDownRight,
    CheckCircle2,
    Clock,
    FileEdit,
    BarChart3,
    Calendar,
    Award
} from "lucide-react";
import { tasksAPI, campaignsAPI } from "../../services/api";
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function Performance() {
    const { userInfo, teamMemberInfo } = useOutletContext();
    const [metrics, setMetrics] = useState({});
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timePeriod, setTimePeriod] = useState("month");

    useEffect(() => {
        fetchPerformanceData();
    }, [userInfo, teamMemberInfo, timePeriod]);

    const fetchPerformanceData = async () => {
        try {
            setLoading(true);
            
            if (!userInfo || !userInfo.id) {
                console.warn("User info not available");
                setMetrics({});
                setChartData([]);
                setLoading(false);
                return;
            }
            
            const [tasksResponse, campaignsResponse] = await Promise.all([
                tasksAPI.getMyTasks({ pageSize: 1000 }),
                campaignsAPI.getAll({ pageSize: 1000 })
            ]);
            
            const tasks = tasksResponse.items || [];
            const allCampaigns = campaignsResponse.items || [];
            
            // Filter tasks based on time period
            const now = new Date();
            let startDate = new Date(0); // Default: all time
            
            switch (timePeriod) {
                case 'week':
                    startDate = new Date(now);
                    startDate.setDate(now.getDate() - 7);
                    break;
                case 'month':
                    startDate = new Date(now);
                    startDate.setMonth(now.getMonth() - 1);
                    break;
                case 'quarter':
                    startDate = new Date(now);
                    startDate.setMonth(now.getMonth() - 3);
                    break;
                case 'year':
                    startDate = new Date(now);
                    startDate.setFullYear(now.getFullYear() - 1);
                    break;
                case 'all':
                default:
                    startDate = new Date(0); // All time
                    break;
            }
            
            // Filter tasks within the selected time period
            const filteredTasks = tasks.filter(t => {
                if (timePeriod === 'all') return true;
                const taskDate = t.createdAt ? new Date(t.createdAt) : new Date(0);
                return taskDate >= startDate;
            });
            
            // Calculate metrics based on actual tasks and completions
            const completedTasks = filteredTasks.filter(t => t.status === 'Completed');
            const totalTasks = filteredTasks.length;
            
            // Assets/Deliverables Delivered (completed tasks)
            const assetsDelivered = completedTasks.length;
            
            // Revisions per Asset (tasks that went through on-hold or review status)
            const tasksWithRevisions = filteredTasks.filter(t => 
                t.status === 'OnHold' || t.status === 'Review' || 
                (t.status === 'Completed' && (t.updatedAt && t.createdAt && 
                    new Date(t.updatedAt).getTime() - new Date(t.createdAt).getTime() > 0))
            ).length;
            const revisionsPerAsset = assetsDelivered > 0 
                ? parseFloat((tasksWithRevisions / assetsDelivered).toFixed(1)) 
                : 1.2; // Default if no completed tasks
            
            // Approval Rate - tasks that are completed (approved) vs tasks that need revision (on hold)
            // Completed tasks are considered approved, OnHold tasks are considered needing revision
            const onHoldTasks = filteredTasks.filter(t => t.status === 'OnHold').length;
            const approvedTasks = completedTasks.length;
            const totalReviewedTasks = approvedTasks + onHoldTasks;
            // Approval rate = approved / (approved + refused/needs revision)
            const approvalRate = totalReviewedTasks > 0 
                ? Math.round((approvedTasks / totalReviewedTasks) * 100) 
                : (completedTasks.length > 0 ? 100 : 0); // If no reviewed tasks but have completed, show 100%
            
            // Average Turnaround Time (for completed tasks)
            let avgTurnaroundTime = 3.5;
            if (completedTasks.length > 0) {
                const turnaroundTimes = completedTasks
                    .filter(t => t.completedAt && t.createdAt)
                    .map(t => {
                        const created = new Date(t.createdAt);
                        const completed = new Date(t.completedAt);
                        return (completed - created) / (1000 * 60 * 60 * 24); // days
                    });
                if (turnaroundTimes.length > 0) {
                    avgTurnaroundTime = turnaroundTimes.reduce((a, b) => a + b, 0) / turnaroundTimes.length;
                }
            }
            
            setMetrics({
                assetsDelivered,
                revisionsPerAsset,
                approvalRate,
                avgTurnaroundTime: parseFloat(avgTurnaroundTime.toFixed(1))
            });
            
            // Generate chart data based on selected time period
            let chartDataPoints = [];
            
            if (timePeriod === 'week') {
                // Last 7 days
                chartDataPoints = Array.from({ length: 7 }, (_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() - (6 - i));
                    date.setHours(0, 0, 0, 0);
                    
                    const delivered = completedTasks.filter(t => {
                        if (!t.completedAt) return false;
                        const completed = new Date(t.completedAt);
                        completed.setHours(0, 0, 0, 0);
                        return completed.getTime() === date.getTime();
                    }).length;
                    
                    return {
                        name: date.toLocaleDateString('en-US', { weekday: 'short' }),
                        delivered: delivered || 0,
                        approved: delivered || 0
                    };
                });
            } else if (timePeriod === 'month') {
                // Last 4 weeks
                chartDataPoints = Array.from({ length: 4 }, (_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() - (3 - i) * 7);
                    const weekStart = new Date(date);
                    weekStart.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
                    weekStart.setHours(0, 0, 0, 0);
                    const weekEnd = new Date(weekStart);
                    weekEnd.setDate(weekStart.getDate() + 6);
                    weekEnd.setHours(23, 59, 59, 999);
                    
                    const delivered = completedTasks.filter(t => {
                        if (!t.completedAt) return false;
                        const completed = new Date(t.completedAt);
                        return completed >= weekStart && completed <= weekEnd;
                    }).length;
                    
                    return {
                        name: `Week ${i + 1}`,
                        delivered: delivered || 0,
                        approved: delivered || 0
                    };
                });
            } else if (timePeriod === 'quarter') {
                // Last 3 months
                chartDataPoints = Array.from({ length: 3 }, (_, i) => {
                    const date = new Date();
                    date.setMonth(date.getMonth() - (2 - i));
                    const month = date.getMonth();
                    const year = date.getFullYear();
                    
                    const delivered = completedTasks.filter(t => {
                        if (!t.completedAt) return false;
                        const completed = new Date(t.completedAt);
                        return completed.getMonth() === month && completed.getFullYear() === year;
                    }).length;
                    
                    return {
                        name: date.toLocaleDateString('en-US', { month: 'short' }),
                        delivered: delivered || 0,
                        approved: delivered || 0
                    };
                });
            } else if (timePeriod === 'year') {
                // Last 12 months
                chartDataPoints = Array.from({ length: 12 }, (_, i) => {
                    const date = new Date();
                    date.setMonth(date.getMonth() - (11 - i));
                    const month = date.getMonth();
                    const year = date.getFullYear();
                    
                    const delivered = completedTasks.filter(t => {
                        if (!t.completedAt) return false;
                        const completed = new Date(t.completedAt);
                        return completed.getMonth() === month && completed.getFullYear() === year;
                    }).length;
                    
                    return {
                        name: date.toLocaleDateString('en-US', { month: 'short' }),
                        delivered: delivered || 0,
                        approved: delivered || 0
                    };
                });
            } else {
                // All time - last 6 months
                chartDataPoints = Array.from({ length: 6 }, (_, i) => {
                    const date = new Date();
                    date.setMonth(date.getMonth() - (5 - i));
                    const month = date.getMonth();
                    const year = date.getFullYear();
                    
                    const delivered = completedTasks.filter(t => {
                        if (!t.completedAt) return false;
                        const completed = new Date(t.completedAt);
                        return completed.getMonth() === month && completed.getFullYear() === year;
                    }).length;
                    
                    return {
                        name: date.toLocaleDateString('en-US', { month: 'short' }),
                        delivered: delivered || 0,
                        approved: delivered || 0
                    };
                });
            }
            
            setChartData(chartDataPoints);
        } catch (error) {
            console.error("Error fetching performance data:", error);
            setMetrics({
                assetsDelivered: 0,
                revisionsPerAsset: 0,
                approvalRate: 0,
                avgTurnaroundTime: 0
            });
            setChartData([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-slate-400">Loading performance data...</div>
            </div>
        );
    }

    // Calculate trends (mock for now, could be calculated from historical data)
    const trends = {
        assetsDelivered: { change: 8.0, isPositive: true },
        revisionsPerAsset: { change: -0.3, isPositive: true },
        approvalRate: { change: 5.2, isPositive: true },
        avgTurnaroundTime: { change: -1.2, isPositive: true }
    };

    return (
        <div className="space-y-6">
            {/* Page Header with Filters */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Performance & Analytics</h1>
                    <p className="text-slate-400 mt-1">Track your performance metrics and analytics</p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Time Period Filter */}
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <select
                            value={timePeriod}
                            onChange={(e) => setTimePeriod(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none"
                            style={{ backgroundColor: '#334155' }}
                        >
                            <option value="week" style={{ backgroundColor: '#1e293b', color: '#fff' }}>This Week</option>
                            <option value="month" style={{ backgroundColor: '#1e293b', color: '#fff' }}>This Month</option>
                            <option value="quarter" style={{ backgroundColor: '#1e293b', color: '#fff' }}>This Quarter</option>
                            <option value="year" style={{ backgroundColor: '#1e293b', color: '#fff' }}>This Year</option>
                            <option value="all" style={{ backgroundColor: '#1e293b', color: '#fff' }}>All Time</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Key Metrics Cards - Same structure as Sarah's page */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <EnhancedMetricCard
                    title="Assets Delivered"
                    value={metrics.assetsDelivered || 0}
                    icon={FileEdit}
                    color="blue"
                    trend={trends.assetsDelivered}
                />
                <EnhancedMetricCard
                    title="Revisions per Asset"
                    value={metrics.revisionsPerAsset || 0}
                    icon={FileEdit}
                    color="amber"
                    trend={trends.revisionsPerAsset}
                />
                <EnhancedMetricCard
                    title="Approval Rate"
                    value={`${metrics.approvalRate || 0}%`}
                    icon={CheckCircle2}
                    color="emerald"
                    trend={trends.approvalRate}
                />
                <EnhancedMetricCard
                    title="Avg Turnaround"
                    value={`${metrics.avgTurnaroundTime || 0} days`}
                    icon={Clock}
                    color="purple"
                    trend={trends.avgTurnaroundTime}
                />
            </div>

            {/* Charts Grid - Same structure as Sarah's page */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Assets Delivered Over Time */}
                <div className="bg-slate-800/50 rounded-xl shadow-sm border border-slate-700/50 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-white">Assets Delivered Over Time</h2>
                        <BarChart3 className="text-slate-400" size={20} />
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                            <XAxis 
                                dataKey="name" 
                                stroke="#94a3b8"
                                style={{ fontSize: '11px' }}
                            />
                            <YAxis 
                                stroke="#94a3b8"
                                style={{ fontSize: '11px' }}
                            />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: '#1e293b', 
                                    border: '1px solid #475569',
                                    borderRadius: '8px',
                                    color: '#fff'
                                }}
                            />
                            <Legend 
                                wrapperStyle={{ color: '#cbd5e1', fontSize: '11px' }}
                            />
                            <Bar dataKey="delivered" fill="#3b82f6" name="Delivered" radius={[8, 8, 0, 0]} />
                            <Bar dataKey="approved" fill="#10b981" name="Approved" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Approval Status */}
                <div className="bg-slate-800/50 rounded-xl shadow-sm border border-slate-700/50 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-white">Approval Status</h2>
                        <Award className="text-slate-400" size={20} />
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={[
                                    { name: 'Approved', value: metrics.approvalRate || 0 },
                                    { name: 'Pending Review', value: 100 - (metrics.approvalRate || 0) }
                                ]}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                <Cell fill="#10b981" />
                                <Cell fill="#f59e0b" />
                            </Pie>
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: '#1e293b', 
                                    border: '1px solid #475569',
                                    borderRadius: '8px',
                                    color: '#fff'
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Insights Section */}
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl border border-blue-600/30 p-6">
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-600/30 rounded-lg">
                        <Award className="text-blue-400" size={20} />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">Performance Insights</h3>
                        <ul className="space-y-2 text-slate-300 text-sm">
                            <li className="flex items-start gap-2">
                                <ArrowUpRight className="text-emerald-400 mt-0.5" size={16} />
                                <span>Approval rate {trends.approvalRate.isPositive ? 'improved' : 'decreased'} by {Math.abs(trends.approvalRate.change).toFixed(1)}% - {trends.approvalRate.isPositive ? 'great work on quality!' : 'focus on meeting requirements'}</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <ArrowUpRight className="text-emerald-400 mt-0.5" size={16} />
                                <span>Average turnaround time {trends.avgTurnaroundTime.isPositive ? 'decreased' : 'increased'} by {Math.abs(trends.avgTurnaroundTime.change).toFixed(1)} days</span>
                            </li>
                            <li className="flex items-start gap-2">
                                {trends.revisionsPerAsset.isPositive ? (
                                    <ArrowUpRight className="text-emerald-400 mt-0.5" size={16} />
                                ) : (
                                    <ArrowDownRight className="text-amber-400 mt-0.5" size={16} />
                                )}
                                <span>Revisions per asset {trends.revisionsPerAsset.isPositive ? 'decreased' : 'increased'} - {trends.revisionsPerAsset.isPositive ? 'excellent efficiency!' : 'consider clearer briefs'}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

function EnhancedMetricCard({ title, value, icon: Icon, color = "blue", trend }) {
    const colorClasses = {
        blue: { bg: "bg-blue-500", light: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-600/30" },
        green: { bg: "bg-green-500", light: "bg-green-500/20", text: "text-green-400", border: "border-green-600/30" },
        purple: { bg: "bg-purple-500", light: "bg-purple-500/20", text: "text-purple-400", border: "border-purple-600/30" },
        emerald: { bg: "bg-emerald-500", light: "bg-emerald-500/20", text: "text-emerald-400", border: "border-emerald-600/30" },
        amber: { bg: "bg-amber-500", light: "bg-amber-500/20", text: "text-amber-400", border: "border-amber-600/30" },
        red: { bg: "bg-red-500", light: "bg-red-500/20", text: "text-red-400", border: "border-red-600/30" }
    };

    const colors = colorClasses[color] || colorClasses.blue;
    const isPositive = trend?.isPositive ?? true;
    const change = trend?.change ?? 0;

    return (
        <div className={`bg-slate-800/50 rounded-xl shadow-lg border ${colors.border} p-6 hover:shadow-xl transition-all group`}>
            <div className="flex items-center justify-between mb-4">
                <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">{title}</p>
                <div className={`${colors.light} p-2 rounded-lg group-hover:scale-110 transition-transform`}>
                    <Icon className={colors.text} size={20} />
                </div>
            </div>
            <div className="flex items-end justify-between">
                <div>
                    <p className="text-3xl font-bold text-white">{value}</p>
                    {trend && (
                        <div className={`flex items-center gap-1 mt-2 ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                            {isPositive ? (
                                <ArrowUpRight size={14} />
                            ) : (
                                <ArrowDownRight size={14} />
                            )}
                            <span className="text-xs font-medium">{Math.abs(change).toFixed(1)}%</span>
                            <span className="text-xs text-slate-400 ml-1">vs last period</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

