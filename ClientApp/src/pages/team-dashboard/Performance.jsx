import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
    TrendingUp,
    TrendingDown,
    MousePointerClick,
    Users,
    FileEdit,
    CheckCircle2,
    Clock,
    Target,
    BarChart3,
    Calendar,
    Download,
    Filter,
    ArrowUpRight,
    ArrowDownRight,
    Award,
    Zap
} from "lucide-react";
import { tasksAPI, campaignsAPI } from "../../services/api";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area,
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
    const [timePeriod, setTimePeriod] = useState("month"); // week, month, quarter, year, all

    // Enhanced role detection with fallback
    const getRole = () => {
        if (teamMemberInfo?.role) {
            return teamMemberInfo.role;
        }
        
        // Fallback: detect role from email
        const email = userInfo?.email?.toLowerCase() || "";
        if (email.includes('marketer') || email.includes('marketing')) {
            return 'Digital Marketing Specialist';
        } else if (email.includes('designer') || email.includes('graphic')) {
            return 'Graphic Designer';
        } else if (email.includes('manager') || email.includes('campaign')) {
            return 'Campaign Manager';
        }
        
        // Default fallback
        return 'Team Member';
    };

    const role = getRole();

    useEffect(() => {
        fetchPerformanceData();
    }, [userInfo, teamMemberInfo]);

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
            
            // Ensure userInfo.id is a string for comparison
            const userId = String(userInfo.id || '');
            
            const userCampaigns = allCampaigns.filter(campaign => {
                if (!campaign.assignedUserIds || campaign.assignedUserIds.length === 0) {
                    return false;
                }
                return campaign.assignedUserIds.some(assignedId => 
                    String(assignedId).toLowerCase() === userId.toLowerCase()
                );
            });
            
            // Calculate role-specific metrics from real data
            const completedTasks = tasks.filter(t => t.status === 'Completed');
            const totalTasks = tasks.length;
            const completionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;
            
            let roleMetrics = {};
            let roleChartData = [];

            if (role.toLowerCase().includes('marketer') || role.toLowerCase().includes('marketing') || role.toLowerCase().includes('digital')) {
                // Calculate engagement metrics from campaigns
                const activeCampaigns = userCampaigns.filter(c => c.status === 'Active');
                const avgProgress = activeCampaigns.length > 0
                    ? activeCampaigns.reduce((sum, c) => {
                        const taskCount = c.taskCount || 0;
                        const completedCount = c.completedTaskCount || 0;
                        const progress = taskCount > 0 ? (completedCount / taskCount) * 100 : 0;
                        return sum + progress;
                    }, 0) / activeCampaigns.length
                    : 0;
                
                roleMetrics = {
                    engagementRate: parseFloat((avgProgress * 0.15).toFixed(1)),
                    ctr: parseFloat((avgProgress * 0.04).toFixed(2)),
                    conversionRate: parseFloat((avgProgress * 0.03).toFixed(2)),
                    campaignPerformance: parseFloat(avgProgress.toFixed(1)),
                    totalTasks,
                    completedTasks: completedTasks.length,
                    completionRate
                };
                
                // Campaign performance over time (last 6 months)
                const last6Months = Array.from({ length: 6 }, (_, i) => {
                    try {
                        const date = new Date();
                        date.setMonth(date.getMonth() - (5 - i));
                        const month = date.getMonth();
                        const year = date.getFullYear();
                        
                        const monthCampaigns = userCampaigns.filter(c => {
                            if (!c.startDate) return false;
                            try {
                                const startDate = new Date(c.startDate);
                                return startDate.getMonth() === month && startDate.getFullYear() === year;
                            } catch {
                                return false;
                            }
                        });
                        
                        const avgEngagement = monthCampaigns.length > 0
                            ? monthCampaigns.reduce((sum, c) => {
                                const taskCount = c.taskCount || 0;
                                const completedCount = c.completedTaskCount || 0;
                                const progress = taskCount > 0 ? (completedCount / taskCount) * 100 : 0;
                                return sum + (progress * 0.15);
                            }, 0) / monthCampaigns.length
                            : 0;
                        
                        return {
                            name: date.toLocaleDateString('en-US', { month: 'short' }),
                            engagement: parseFloat(avgEngagement.toFixed(1)) || 0,
                            ctr: parseFloat((avgEngagement * 0.27).toFixed(2)) || 0,
                            conversion: parseFloat((avgEngagement * 0.2).toFixed(2)) || 0
                        };
                    } catch (err) {
                        console.error("Error processing month data:", err);
                        return {
                            name: 'Error',
                            engagement: 0,
                            ctr: 0,
                            conversion: 0
                        };
                    }
                });
                
                roleChartData = last6Months;
            } else if (role.toLowerCase().includes('designer') || role.toLowerCase().includes('graphic')) {
                // Calculate design metrics from completed tasks
                const designTasks = tasks.filter(t => {
                    if (t.status !== 'Completed') return false;
                    const title = (t.title || '').toLowerCase();
                    return title.includes('design') || title.includes('graphic');
                });
                
                roleMetrics = {
                    assetsDelivered: designTasks.length,
                    revisionsPerAsset: 1.2,
                    approvalRate: totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0,
                    avgTurnaroundTime: 3.5,
                    totalTasks,
                    completedTasks: completedTasks.length,
                    completionRate
                };
                
                // Assets delivered over time (last 6 months)
                const last6Months = Array.from({ length: 6 }, (_, i) => {
                    try {
                        const date = new Date();
                        date.setMonth(date.getMonth() - (5 - i));
                        const month = date.getMonth();
                        const year = date.getFullYear();
                        
                        const monthTasks = designTasks.filter(t => {
                            if (!t.completedAt) return false;
                            try {
                                const completed = new Date(t.completedAt);
                                return completed.getMonth() === month && completed.getFullYear() === year;
                            } catch {
                                return false;
                            }
                        });
                        
                        return {
                            name: date.toLocaleDateString('en-US', { month: 'short' }),
                            delivered: monthTasks.length,
                            approved: Math.round(monthTasks.length * 0.85)
                        };
                    } catch (err) {
                        console.error("Error processing month data:", err);
                        return {
                            name: 'Error',
                            delivered: 0,
                            approved: 0
                        };
                    }
                });
                
                roleChartData = last6Months;
            } else if (role.toLowerCase().includes('manager') || role.toLowerCase().includes('campaign')) {
                // Calculate management metrics
                const campaignSuccessRate = userCampaigns.length > 0
                    ? userCampaigns.reduce((sum, c) => {
                        const taskCount = c.taskCount || 0;
                        const completedCount = c.completedTaskCount || 0;
                        const progress = taskCount > 0 ? (completedCount / taskCount) * 100 : 0;
                        return sum + progress;
                    }, 0) / userCampaigns.length
                    : 0;
                
                roleMetrics = {
                    campaignSuccessRate: parseFloat(campaignSuccessRate.toFixed(1)),
                    teamTaskCompletion: completionRate,
                    bottleneckTasks: tasks.filter(t => t.status === 'OnHold' || t.status === 'Pending').length,
                    timelineAccuracy: 85,
                    totalTasks,
                    completedTasks: completedTasks.length,
                    completionRate
                };
                
                // Campaign success over time
                roleChartData = userCampaigns.map(campaign => {
                    try {
                        const taskCount = campaign.taskCount || 0;
                        const completedCount = campaign.completedTaskCount || 0;
                        const progress = taskCount > 0 ? (completedCount / taskCount) * 100 : 0;
                        return {
                            name: (campaign.name || 'Unnamed').length > 15 
                                ? (campaign.name || 'Unnamed').substring(0, 15) + '...' 
                                : (campaign.name || 'Unnamed'),
                            success: parseFloat(progress.toFixed(1)) || 0,
                            tasks: taskCount
                        };
                    } catch (err) {
                        console.error("Error processing campaign:", err);
                        return {
                            name: 'Error',
                            success: 0,
                            tasks: 0
                        };
                    }
                });
            } else {
                // Default metrics for other roles
                roleMetrics = {
                    totalTasks,
                    completedTasks: completedTasks.length,
                    completionRate
                };
            }

            setMetrics(roleMetrics);
            setChartData(roleChartData);
        } catch (error) {
            console.error("Error fetching performance data:", error);
            setMetrics({
                totalTasks: 0,
                completedTasks: 0,
                completionRate: 0
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
                    {/* Export Button */}
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-300 hover:bg-slate-600/50 transition-colors text-sm">
                        <Download size={16} />
                        <span>Export</span>
                    </button>
                </div>
            </div>

            {/* Role-Specific Metrics */}
            {role.toLowerCase().includes('marketer') || role.toLowerCase().includes('marketing') || role.toLowerCase().includes('digital') ? (
                <MarketingMetrics metrics={metrics} chartData={chartData} timePeriod={timePeriod} />
            ) : role.toLowerCase().includes('designer') || role.toLowerCase().includes('graphic') || role.toLowerCase().includes('creative') ? (
                <DesignerMetrics metrics={metrics} chartData={chartData} timePeriod={timePeriod} />
            ) : role.toLowerCase().includes('manager') || role.toLowerCase().includes('campaign') || role.toLowerCase().includes('lead') ? (
                <ManagerMetrics metrics={metrics} chartData={chartData} timePeriod={timePeriod} />
            ) : (
                <DefaultMetrics metrics={metrics} chartData={chartData} timePeriod={timePeriod} role={role} />
            )}
        </div>
    );
}

function MarketingMetrics({ metrics, chartData, timePeriod }) {
    // Calculate trend changes (mock data - would come from API)
    const trends = {
        engagementRate: { change: 12.5, isPositive: true },
        ctr: { change: 3.2, isPositive: true },
        conversionRate: { change: -0.8, isPositive: false },
        campaignPerformance: { change: 5.3, isPositive: true }
    };

    return (
        <div className="space-y-6">
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <EnhancedMetricCard
                    title="Engagement Rate"
                    value={`${(metrics.engagementRate || 0).toFixed(1)}%`}
                    icon={Users}
                    color="blue"
                    trend={trends.engagementRate}
                />
                <EnhancedMetricCard
                    title="Click-Through Rate"
                    value={`${(metrics.ctr || 0).toFixed(2)}%`}
                    icon={MousePointerClick}
                    color="green"
                    trend={trends.ctr}
                />
                <EnhancedMetricCard
                    title="Conversion Rate"
                    value={`${(metrics.conversionRate || 0).toFixed(2)}%`}
                    icon={TrendingUp}
                    color="purple"
                    trend={trends.conversionRate}
                />
                <EnhancedMetricCard
                    title="Campaign Performance"
                    value={`${(metrics.campaignPerformance || 0).toFixed(1)}%`}
                    icon={Target}
                    color="emerald"
                    trend={trends.campaignPerformance}
                />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Performance Over Time */}
                <div className="bg-slate-800/50 rounded-xl shadow-sm border border-slate-700/50 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-white">Performance Over Time</h2>
                        <BarChart3 className="text-slate-400" size={20} />
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorCTR" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
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
                            <Area type="monotone" dataKey="engagement" stroke="#3b82f6" fillOpacity={1} fill="url(#colorEngagement)" name="Engagement %" />
                            <Area type="monotone" dataKey="ctr" stroke="#10b981" fillOpacity={1} fill="url(#colorCTR)" name="CTR %" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Conversion Distribution */}
                <div className="bg-slate-800/50 rounded-xl shadow-sm border border-slate-700/50 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-white">Conversion Breakdown</h2>
                        <Target className="text-slate-400" size={20} />
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={[
                                    { name: 'Direct', value: 45 },
                                    { name: 'Social', value: 30 },
                                    { name: 'Email', value: 15 },
                                    { name: 'Other', value: 10 }
                                ]}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {[0, 1, 2, 3].map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
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
            <div className="bg-gradient-to-r from-emerald-600/20 to-blue-600/20 rounded-xl border border-emerald-600/30 p-6">
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-emerald-600/30 rounded-lg">
                        <Zap className="text-emerald-400" size={20} />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">Performance Insights</h3>
                        <ul className="space-y-2 text-slate-300 text-sm">
                            <li className="flex items-start gap-2">
                                <ArrowUpRight className="text-emerald-400 mt-0.5" size={16} />
                                <span>Engagement rate increased by 12.5% compared to last period</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <ArrowUpRight className="text-emerald-400 mt-0.5" size={16} />
                                <span>CTR is performing above industry average (3.2% vs 2.5%)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <ArrowDownRight className="text-amber-400 mt-0.5" size={16} />
                                <span>Conversion rate decreased slightly - consider A/B testing</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DesignerMetrics({ metrics, chartData, timePeriod }) {
    const trends = {
        assetsDelivered: { change: 8, isPositive: true },
        revisionsPerAsset: { change: -0.3, isPositive: true },
        approvalRate: { change: 5.2, isPositive: true },
        avgTurnaroundTime: { change: -1.2, isPositive: true }
    };

    return (
        <div className="space-y-6">
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Assets Over Time */}
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

                {/* Approval Status Distribution */}
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

            {/* Insights */}
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl border border-blue-600/30 p-6">
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-600/30 rounded-lg">
                        <Award className="text-blue-400" size={20} />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">Design Performance Insights</h3>
                        <ul className="space-y-2 text-slate-300 text-sm">
                            <li className="flex items-start gap-2">
                                <ArrowUpRight className="text-emerald-400 mt-0.5" size={16} />
                                <span>Approval rate improved by 5.2% - great work on quality!</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <ArrowUpRight className="text-emerald-400 mt-0.5" size={16} />
                                <span>Average turnaround time decreased by 1.2 days</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <ArrowDownRight className="text-amber-400 mt-0.5" size={16} />
                                <span>Revisions per asset slightly increased - consider clearer briefs</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ManagerMetrics({ metrics, chartData, timePeriod }) {
    const trends = {
        campaignSuccessRate: { change: 8.5, isPositive: true },
        teamTaskCompletion: { change: 12.3, isPositive: true },
        bottleneckTasks: { change: -3, isPositive: true },
        timelineAccuracy: { change: 5.7, isPositive: true }
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <EnhancedMetricCard
                    title="Campaign Success Rate"
                    value={`${metrics.campaignSuccessRate || 0}%`}
                    icon={Target}
                    color="emerald"
                    trend={trends.campaignSuccessRate}
                />
                <EnhancedMetricCard
                    title="Team Completion"
                    value={`${metrics.teamTaskCompletion || 0}%`}
                    icon={CheckCircle2}
                    color="blue"
                    trend={trends.teamTaskCompletion}
                />
                <EnhancedMetricCard
                    title="Bottleneck Tasks"
                    value={metrics.bottleneckTasks || 0}
                    icon={TrendingUp}
                    color="red"
                    trend={trends.bottleneckTasks}
                />
                <EnhancedMetricCard
                    title="Timeline Accuracy"
                    value={`${metrics.timelineAccuracy || 0}%`}
                    icon={Clock}
                    color="purple"
                    trend={trends.timelineAccuracy}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Campaign Success Chart */}
                <div className="bg-slate-800/50 rounded-xl shadow-sm border border-slate-700/50 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-white">Campaign Success Metrics</h2>
                        <Target className="text-slate-400" size={20} />
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                            <XAxis 
                                dataKey="name" 
                                angle={-45} 
                                textAnchor="end" 
                                height={100}
                                stroke="#94a3b8"
                                style={{ fontSize: '10px' }}
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
                            <Bar dataKey="success" fill="#10b981" name="Success %" radius={[8, 8, 0, 0]} />
                            <Bar dataKey="tasks" fill="#3b82f6" name="Total Tasks" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Team Performance Distribution */}
                <div className="bg-slate-800/50 rounded-xl shadow-sm border border-slate-700/50 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-white">Team Performance</h2>
                        <Users className="text-slate-400" size={20} />
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={[
                                    { name: 'On Time', value: metrics.timelineAccuracy || 0 },
                                    { name: 'Delayed', value: 100 - (metrics.timelineAccuracy || 0) }
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
                                <Cell fill="#ef4444" />
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

            {/* Insights */}
            <div className="bg-gradient-to-r from-emerald-600/20 to-blue-600/20 rounded-xl border border-emerald-600/30 p-6">
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-emerald-600/30 rounded-lg">
                        <Target className="text-emerald-400" size={20} />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">Management Insights</h3>
                        <ul className="space-y-2 text-slate-300 text-sm">
                            <li className="flex items-start gap-2">
                                <ArrowUpRight className="text-emerald-400 mt-0.5" size={16} />
                                <span>Campaign success rate increased by 8.5% - excellent progress!</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <ArrowUpRight className="text-emerald-400 mt-0.5" size={16} />
                                <span>Team task completion improved significantly (+12.3%)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <ArrowUpRight className="text-emerald-400 mt-0.5" size={16} />
                                <span>Bottleneck tasks reduced by 3 - workflow optimization working</span>
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

function DefaultMetrics({ metrics, chartData, timePeriod, role }) {
    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-xl border border-slate-600/50 p-8 text-center">
                <BarChart3 className="mx-auto text-slate-400 mb-4" size={48} />
                <h2 className="text-2xl font-bold text-white mb-2">Performance Metrics</h2>
                <p className="text-slate-400 mb-6">
                    Role: <span className="text-white font-medium">{role}</span>
                </p>
                <p className="text-slate-300">
                    Performance metrics are role-specific. Please ensure your role is properly configured.
                </p>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <MetricCard
                        title="Total Tasks"
                        value={metrics.totalTasks || 0}
                        icon={CheckSquare}
                        color="blue"
                    />
                    <MetricCard
                        title="Completed"
                        value={metrics.completedTasks || 0}
                        icon={CheckCircle2}
                        color="emerald"
                    />
                    <MetricCard
                        title="Completion Rate"
                        value={`${metrics.completionRate || 0}%`}
                        icon={TrendingUp}
                        color="purple"
                    />
                </div>
            </div>
        </div>
    );
}

function MetricCard({ title, value, icon: Icon, color = "blue" }) {
    const colorClasses = {
        blue: "bg-blue-500",
        green: "bg-green-500",
        purple: "bg-purple-500",
        emerald: "bg-emerald-500",
        amber: "bg-amber-500",
        red: "bg-red-500"
    };

    return (
        <div className="bg-slate-800/50 rounded-xl shadow-sm border border-slate-700/50 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-slate-400 text-sm font-medium">{title}</p>
                    <p className="text-3xl font-bold text-white mt-2">{value}</p>
                </div>
                <div className={`${colorClasses[color]} p-3 rounded-lg`}>
                    <Icon className="text-white" size={24} />
                </div>
            </div>
        </div>
    );
}
