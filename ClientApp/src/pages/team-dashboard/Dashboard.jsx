import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
    CheckSquare,
    Calendar,
    TrendingUp,
    Megaphone,
    MousePointerClick,
    Users,
    CheckCircle2,
    FileEdit,
    Activity,
    Target
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

export default function Dashboard() {
    const { userInfo, teamMemberInfo } = useOutletContext();
    const [stats, setStats] = useState({
        assignedTasks: 0,
        tasksDueToday: 0,
        completionRate: 0,
        activeCampaigns: 0
    });
    const [taskStatusData, setTaskStatusData] = useState([]);
    const [productivityData, setProductivityData] = useState([]);
    const [campaignContribution, setCampaignContribution] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, [userInfo, teamMemberInfo]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            
            // Fetch real data from API
            const [tasksResponse, campaignsResponse] = await Promise.all([
                tasksAPI.getMyTasks({ pageSize: 1000 }),
                campaignsAPI.getAll({ pageSize: 1000 })
            ]);
            
            const tasks = tasksResponse.items || [];
            // The backend already filters campaigns for team members based on CampaignUsers table
            // So we can trust the backend response - no need for additional filtering
            const userCampaigns = campaignsResponse.items || [];
            
            // Calculate task statistics
            const assignedTasks = tasks.length;
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tasksDueToday = tasks.filter(task => {
                if (!task.dueDate) return false;
                const dueDate = new Date(task.dueDate);
                dueDate.setHours(0, 0, 0, 0);
                return dueDate.getTime() === today.getTime();
            }).length;
            
            const completedTasks = tasks.filter(t => t.status === 'Completed').length;
            const completionRate = assignedTasks > 0 ? Math.round((completedTasks / assignedTasks) * 100) : 0;
            const activeCampaigns = userCampaigns.filter(c => c.status === 'Active').length;
            
            // Task status distribution
            const statusCounts = {
                'To Do': tasks.filter(t => t.status === 'Pending').length,
                'In Progress': tasks.filter(t => t.status === 'InProgress').length,
                'On Hold': tasks.filter(t => t.status === 'OnHold').length,
                'Completed': tasks.filter(t => t.status === 'Completed').length
            };
            setTaskStatusData(Object.entries(statusCounts).map(([name, value]) => ({ name, value })));
            
            // Weekly productivity (last 7 days) - based on real task completion data
            const last7Days = Array.from({ length: 7 }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - (6 - i));
                date.setHours(0, 0, 0, 0);
                return date;
            });
            
            const productivity = last7Days.map((date) => {
                // Count tasks actually completed on this date
                const completedOnDate = tasks.filter(t => {
                    if (!t.completedAt || t.status !== 'Completed') return false;
                    try {
                        const completedDate = new Date(t.completedAt);
                        completedDate.setHours(0, 0, 0, 0);
                        return completedDate.getTime() === date.getTime();
                    } catch {
                        return false;
                    }
                }).length;
                
                return {
                    date: date.toLocaleDateString('en-US', { weekday: 'short' }),
                    tasks: completedOnDate
                };
            });
            setProductivityData(productivity);
            
            // Campaign contribution - show all user campaigns
            const campaignData = userCampaigns.map(campaign => {
                const campaignTasks = tasks.filter(t => t.campaignId === campaign.id);
                const completed = campaignTasks.filter(t => t.status === 'Completed').length;
                return {
                    name: campaign.name.length > 20 ? campaign.name.substring(0, 20) + '...' : campaign.name,
                    tasks: campaignTasks.length || campaign.taskCount,
                    completed: completed || campaign.completedTaskCount
                };
            });
            setCampaignContribution(campaignData);
            
            setStats({
                assignedTasks,
                tasksDueToday,
                completionRate,
                activeCampaigns
            });
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            // Set empty data on error
            setStats({
                assignedTasks: 0,
                tasksDueToday: 0,
                completionRate: 0,
                activeCampaigns: 0
            });
            
            setTaskStatusData([]);
            setProductivityData([]);
            setCampaignContribution([]);
        } finally {
            setLoading(false);
        }
    };

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
                <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                <p className="text-slate-400 mt-1">Welcome back, {teamMemberInfo?.firstName || userInfo.firstName || 'Team Member'}</p>
            </div>

            {/* KPI Cards - Same for all team members */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard
                    title="Assigned Tasks"
                    value={stats.assignedTasks}
                    icon={CheckSquare}
                    color="emerald"
                />
                <KPICard
                    title="Tasks Due Today"
                    value={stats.tasksDueToday}
                    icon={Calendar}
                    color="amber"
                />
                <KPICard
                    title="Completion Rate"
                    value={`${stats.completionRate}%`}
                    icon={TrendingUp}
                    color="blue"
                />
                <KPICard
                    title="Active Campaigns"
                    value={stats.activeCampaigns}
                    icon={Megaphone}
                    color="purple"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Task Status Chart */}
                <div className="bg-slate-800/50 rounded-xl shadow-sm border border-slate-700/50 p-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Task Status Distribution</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={taskStatusData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {taskStatusData.map((entry, index) => (
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
                            <Legend 
                                wrapperStyle={{ color: '#cbd5e1', fontSize: '12px' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Weekly Productivity Graph */}
                <div className="bg-slate-800/50 rounded-xl shadow-sm border border-slate-700/50 p-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Weekly Productivity</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={productivityData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                            <XAxis 
                                dataKey="date" 
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
                            <Bar dataKey="tasks" fill="#10b981" name="Tasks Completed" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Campaign Contribution */}
            {campaignContribution.length > 0 && (
                <div className="bg-slate-800/50 rounded-xl shadow-sm border border-slate-700/50 p-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Campaign Contribution</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={campaignContribution}>
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
                            <Bar dataKey="tasks" fill="#3b82f6" name="Total Tasks" radius={[8, 8, 0, 0]} />
                            <Bar dataKey="completed" fill="#10b981" name="Completed" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}

function KPICard({ title, value, icon: Icon, color = "emerald" }) {
    const colorClasses = {
        emerald: "bg-emerald-500",
        amber: "bg-amber-500",
        blue: "bg-blue-500",
        purple: "bg-purple-500",
        indigo: "bg-indigo-500",
        pink: "bg-pink-500",
        green: "bg-green-500",
        orange: "bg-orange-500",
        teal: "bg-teal-500"
    };

    return (
        <div className="bg-slate-800/50 rounded-xl shadow-sm border border-slate-700/50 p-6 hover:shadow-md transition-shadow">
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
