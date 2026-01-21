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
import { generateMockTasks, generateMockCampaigns, generateRoleSpecificMetrics } from "../../services/mockData";
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
            
            // TODO: Replace with real API calls when backend is ready
            // const tasksResponse = await tasksAPI.getMyTasks();
            // const campaignsResponse = await campaignsAPI.getAll();
            
            // Use mock data for now
            const tasks = generateMockTasks(userInfo.id, role);
            const userCampaigns = generateMockCampaigns(userInfo.id);
            
            // Get role-specific metrics
            const roleMetrics = generateRoleSpecificMetrics(role, tasks, userCampaigns);
            let roleChartData = [];

            if (role.toLowerCase().includes('marketer') || role.toLowerCase().includes('marketing')) {
                // Campaign performance over time (last 6 months)
                const last6Months = Array.from({ length: 6 }, (_, i) => {
                    const date = new Date();
                    date.setMonth(date.getMonth() - (5 - i));
                    return date.toLocaleDateString('en-US', { month: 'short' });
                });
                
                roleChartData = last6Months.map(month => ({
                    name: month,
                    engagement: (roleMetrics.engagementRate || 0) + (Math.random() * 5 - 2.5),
                    ctr: (roleMetrics.ctr || 0) + (Math.random() * 1 - 0.5),
                    conversion: (roleMetrics.conversionRate || 0) + (Math.random() * 1 - 0.5)
                }));
            } else if (role.toLowerCase().includes('designer') || role.toLowerCase().includes('graphic')) {
                // Assets delivered over time (last 6 months)
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
                // Campaign success over time
                roleChartData = userCampaigns.map(campaign => {
                    const progress = campaign.taskCount > 0
                        ? (campaign.completedTaskCount / campaign.taskCount) * 100
                        : 0;
                    return {
                        name: campaign.name.length > 15 ? campaign.name.substring(0, 15) + '...' : campaign.name,
                        success: progress,
                        tasks: campaign.taskCount || 0
                    };
                });
            }

            setMetrics(roleMetrics);
            setChartData(roleChartData);
        } catch (error) {
            console.error("Error fetching performance data:", error);
            // Fallback to mock data
            const tasks = generateMockTasks(userInfo.id, role);
            const userCampaigns = generateMockCampaigns(userInfo.id);
            const roleMetrics = generateRoleSpecificMetrics(role, tasks, userCampaigns);
            setMetrics(roleMetrics);
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
                        <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                        <XAxis 
                            dataKey="name" 
                            stroke="#94a3b8"
                            style={{ fontSize: '12px' }}
                        />
                        <YAxis 
                            stroke="#94a3b8"
                            style={{ fontSize: '12px' }}
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
                            wrapperStyle={{ color: '#cbd5e1', fontSize: '12px' }}
                        />
                        <Line type="monotone" dataKey="engagement" stroke="#3b82f6" name="Engagement %" strokeWidth={2} />
                        <Line type="monotone" dataKey="ctr" stroke="#10b981" name="CTR %" strokeWidth={2} />
                        <Line type="monotone" dataKey="conversion" stroke="#8b5cf6" name="Conversion %" strokeWidth={2} />
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
                        <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                        <XAxis 
                            dataKey="name" 
                            stroke="#94a3b8"
                            style={{ fontSize: '12px' }}
                        />
                        <YAxis 
                            stroke="#94a3b8"
                            style={{ fontSize: '12px' }}
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
                            wrapperStyle={{ color: '#cbd5e1', fontSize: '12px' }}
                        />
                        <Bar dataKey="delivered" fill="#3b82f6" name="Delivered" radius={[8, 8, 0, 0]} />
                        <Bar dataKey="approved" fill="#10b981" name="Approved" radius={[8, 8, 0, 0]} />
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
                        <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                        <XAxis 
                            dataKey="name" 
                            angle={-45} 
                            textAnchor="end" 
                            height={100}
                            stroke="#94a3b8"
                            style={{ fontSize: '11px' }}
                        />
                        <YAxis 
                            stroke="#94a3b8"
                            style={{ fontSize: '12px' }}
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
                            wrapperStyle={{ color: '#cbd5e1', fontSize: '12px' }}
                        />
                        <Bar dataKey="success" fill="#10b981" name="Success %" radius={[8, 8, 0, 0]} />
                        <Bar dataKey="tasks" fill="#3b82f6" name="Total Tasks" radius={[8, 8, 0, 0]} />
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
