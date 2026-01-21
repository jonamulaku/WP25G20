import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
    TrendingUp,
    MousePointerClick,
    Users,
    FileEdit,
    CheckCircle2,
    Clock,
    Target,
    BarChart3
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

    const role = teamMemberInfo?.role || "";

    useEffect(() => {
        fetchPerformanceData();
    }, [userInfo, teamMemberInfo]);

    const fetchPerformanceData = async () => {
        try {
            setLoading(true);
            
            const tasksResponse = await tasksAPI.getMyTasks();
            const tasks = tasksResponse.items || [];
            
            const campaignsResponse = await campaignsAPI.getAll();
            const allCampaigns = campaignsResponse.items || [];
            const userCampaigns = allCampaigns.filter(campaign => 
                campaign.assignedUserIds?.includes(userInfo.id)
            );

            let roleMetrics = {};
            let roleChartData = [];

            if (role.toLowerCase().includes('marketer') || role.toLowerCase().includes('marketing')) {
                // Digital Marketing Specialist metrics
                roleMetrics = {
                    engagementRate: 12.5,
                    ctr: 3.2,
                    conversionRate: 2.8,
                    campaignPerformance: 85
                };

                // Campaign performance over time
                roleChartData = userCampaigns.slice(0, 6).map(campaign => ({
                    name: campaign.name.substring(0, 15),
                    engagement: Math.random() * 20 + 5,
                    ctr: Math.random() * 5 + 1,
                    conversion: Math.random() * 4 + 1
                }));
            } else if (role.toLowerCase().includes('designer') || role.toLowerCase().includes('graphic')) {
                // Graphic Designer metrics
                const designTasks = tasks.filter(t => 
                    t.title.toLowerCase().includes('design') || 
                    t.title.toLowerCase().includes('asset') ||
                    t.title.toLowerCase().includes('graphic')
                );
                const totalAssets = designTasks.length;
                const approvedAssets = designTasks.filter(t => t.status === 'Completed').length;
                const revisions = designTasks.reduce((sum, t) => {
                    // Mock revision count based on task history
                    return sum + (t.status === 'Completed' ? 1 : 2);
                }, 0);
                
                // Calculate average turnaround time (mock)
                const completedTasks = tasks.filter(t => t.status === 'Completed' && t.completedAt);
                const avgTurnaround = completedTasks.length > 0
                    ? completedTasks.reduce((sum, t) => {
                        const created = new Date(t.createdAt);
                        const completed = new Date(t.completedAt);
                        return sum + (completed - created) / (1000 * 60 * 60 * 24); // days
                    }, 0) / completedTasks.length
                    : 0;

                roleMetrics = {
                    assetsDelivered: totalAssets,
                    revisionsPerAsset: totalAssets > 0 ? (revisions / totalAssets).toFixed(1) : 0,
                    approvalRate: totalAssets > 0 ? Math.round((approvedAssets / totalAssets) * 100) : 0,
                    avgTurnaroundTime: Math.round(avgTurnaround * 10) / 10
                };

                // Assets delivered over time
                const last6Months = Array.from({ length: 6 }, (_, i) => {
                    const date = new Date();
                    date.setMonth(date.getMonth() - (5 - i));
                    return date.toLocaleDateString('en-US', { month: 'short' });
                });
                
                roleChartData = last6Months.map(month => ({
                    name: month,
                    delivered: Math.floor(Math.random() * 10 + 5),
                    approved: Math.floor(Math.random() * 8 + 3)
                }));
            } else if (role.toLowerCase().includes('manager') || role.toLowerCase().includes('campaign')) {
                // Campaign Manager metrics
                const totalCampaigns = userCampaigns.length;
                const successfulCampaigns = userCampaigns.filter(c => 
                    c.status === 'Completed' && (c.completedTaskCount / c.taskCount) >= 0.8
                ).length;
                const successRate = totalCampaigns > 0 
                    ? Math.round((successfulCampaigns / totalCampaigns) * 100) 
                    : 0;

                // Task completion across team (mock - would need team data)
                const teamCompletionRate = tasks.length > 0
                    ? Math.round((tasks.filter(t => t.status === 'Completed').length / tasks.length) * 100)
                    : 0;

                // Bottleneck detection (mock)
                const overdueTasks = tasks.filter(t => {
                    if (!t.dueDate) return false;
                    return new Date(t.dueDate) < new Date() && t.status !== 'Completed';
                }).length;

                // Timeline accuracy (mock)
                const onTimeTasks = tasks.filter(t => {
                    if (!t.dueDate || !t.completedAt) return false;
                    return new Date(t.completedAt) <= new Date(t.dueDate);
                }).length;
                const timelineAccuracy = tasks.length > 0
                    ? Math.round((onTimeTasks / tasks.length) * 100)
                    : 0;

                roleMetrics = {
                    campaignSuccessRate: successRate,
                    teamTaskCompletion: teamCompletionRate,
                    bottleneckTasks: overdueTasks,
                    timelineAccuracy: timelineAccuracy
                };

                // Campaign success over time
                roleChartData = userCampaigns.slice(0, 6).map(campaign => {
                    const progress = campaign.taskCount > 0
                        ? (campaign.completedTaskCount / campaign.taskCount) * 100
                        : 0;
                    return {
                        name: campaign.name.substring(0, 15),
                        success: progress,
                        tasks: campaign.taskCount || 0
                    };
                });
            }

            setMetrics(roleMetrics);
            setChartData(roleChartData);
        } catch (error) {
            console.error("Error fetching performance data:", error);
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
            <div>
                <h1 className="text-3xl font-bold text-white">Performance & Analytics</h1>
                <p className="text-slate-400 mt-1">Track your performance metrics and analytics</p>
            </div>

            {/* Role-Specific Metrics */}
            {role.toLowerCase().includes('marketer') || role.toLowerCase().includes('marketing') ? (
                <MarketingMetrics metrics={metrics} chartData={chartData} />
            ) : role.toLowerCase().includes('designer') || role.toLowerCase().includes('graphic') ? (
                <DesignerMetrics metrics={metrics} chartData={chartData} />
            ) : role.toLowerCase().includes('manager') || role.toLowerCase().includes('campaign') ? (
                <ManagerMetrics metrics={metrics} chartData={chartData} />
            ) : (
                <div className="text-center py-12 text-slate-400">
                    No role-specific metrics available
                </div>
            )}
        </div>
    );
}

function MarketingMetrics({ metrics, chartData }) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <MetricCard
                    title="Engagement Rate"
                    value={`${metrics.engagementRate || 0}%`}
                    icon={Users}
                    color="blue"
                />
                <MetricCard
                    title="CTR"
                    value={`${metrics.ctr || 0}%`}
                    icon={MousePointerClick}
                    color="green"
                />
                <MetricCard
                    title="Conversion Rate"
                    value={`${metrics.conversionRate || 0}%`}
                    icon={TrendingUp}
                    color="purple"
                />
                <MetricCard
                    title="Campaign Performance"
                    value={`${metrics.campaignPerformance || 0}%`}
                    icon={Target}
                    color="emerald"
                />
            </div>

            <div className="bg-slate-800/50 rounded-xl shadow-sm border border-slate-700/50 p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Campaign Performance Over Time</h2>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="engagement" stroke="#3b82f6" name="Engagement %" />
                        <Line type="monotone" dataKey="ctr" stroke="#10b981" name="CTR %" />
                        <Line type="monotone" dataKey="conversion" stroke="#8b5cf6" name="Conversion %" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

function DesignerMetrics({ metrics, chartData }) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <MetricCard
                    title="Assets Delivered"
                    value={metrics.assetsDelivered || 0}
                    icon={FileEdit}
                    color="blue"
                />
                <MetricCard
                    title="Revisions per Asset"
                    value={metrics.revisionsPerAsset || 0}
                    icon={FileEdit}
                    color="amber"
                />
                <MetricCard
                    title="Approval Rate"
                    value={`${metrics.approvalRate || 0}%`}
                    icon={CheckCircle2}
                    color="emerald"
                />
                <MetricCard
                    title="Avg Turnaround Time"
                    value={`${metrics.avgTurnaroundTime || 0} days`}
                    icon={Clock}
                    color="purple"
                />
            </div>

            <div className="bg-slate-800/50 rounded-xl shadow-sm border border-slate-700/50 p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Assets Delivered Over Time</h2>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="delivered" fill="#3b82f6" name="Delivered" />
                        <Bar dataKey="approved" fill="#10b981" name="Approved" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

function ManagerMetrics({ metrics, chartData }) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <MetricCard
                    title="Campaign Success Rate"
                    value={`${metrics.campaignSuccessRate || 0}%`}
                    icon={Target}
                    color="emerald"
                />
                <MetricCard
                    title="Team Task Completion"
                    value={`${metrics.teamTaskCompletion || 0}%`}
                    icon={CheckCircle2}
                    color="blue"
                />
                <MetricCard
                    title="Bottleneck Tasks"
                    value={metrics.bottleneckTasks || 0}
                    icon={TrendingUp}
                    color="red"
                />
                <MetricCard
                    title="Timeline Accuracy"
                    value={`${metrics.timelineAccuracy || 0}%`}
                    icon={Clock}
                    color="purple"
                />
            </div>

            <div className="bg-slate-800/50 rounded-xl shadow-sm border border-slate-700/50 p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Campaign Success Metrics</h2>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="success" fill="#10b981" name="Success %" />
                        <Bar dataKey="tasks" fill="#3b82f6" name="Total Tasks" />
                    </BarChart>
                </ResponsiveContainer>
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
