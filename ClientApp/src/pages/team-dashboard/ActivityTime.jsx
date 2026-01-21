import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
    Clock,
    Activity,
    FileText,
    CheckSquare,
    Calendar,
    TrendingUp,
    Filter
} from "lucide-react";
import { tasksAPI } from "../../services/api";
import { generateMockTasks, generateMockActivityLog } from "../../services/mockData";

export default function ActivityTime() {
    const { userInfo, teamMemberInfo } = useOutletContext();
    const [activities, setActivities] = useState([]);
    const [timeTracking, setTimeTracking] = useState({});
    const [selectedPeriod, setSelectedPeriod] = useState("week");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [userInfo, selectedPeriod]);

    const fetchData = async () => {
        try {
            setLoading(true);
            
            if (!userInfo || !userInfo.id) {
                console.warn("User info not available");
                setLoading(false);
                return;
            }
            
            // TODO: Replace with real API call when backend is ready
            // const tasksResponse = await tasksAPI.getMyTasks();
            
            // Use mock data for now
            const tasks = generateMockTasks(userInfo.id, teamMemberInfo?.role);
            
            // Generate activity log from tasks
            const activityLog = generateMockActivityLog(tasks);
            
            // Map activity types to icons and ensure createdAt is a Date object
            const activityLogWithIcons = activityLog.map(activity => ({
                ...activity,
                createdAt: new Date(activity.createdAt), // Ensure it's a Date object
                icon: activity.type === 'task_created' || activity.type === 'task_completed' 
                    ? CheckSquare 
                    : activity.type === 'file_uploaded'
                    ? FileText
                    : Activity
            }));

            setActivities(activityLogWithIcons);

            // Calculate time tracking
            const completedTasks = tasks.filter(t => t.status === 'Completed' && t.completedAt);
            const totalTime = completedTasks.reduce((sum, task) => {
                if (task.createdAt && task.completedAt) {
                    const created = new Date(task.createdAt);
                    const completed = new Date(task.completedAt);
                    return sum + (completed - created) / (1000 * 60 * 60); // hours
                }
                return sum;
            }, 0);

            const timeByTask = completedTasks.map(task => ({
                taskId: task.id,
                taskTitle: task.title,
                timeSpent: task.createdAt && task.completedAt
                    ? (new Date(task.completedAt) - new Date(task.createdAt)) / (1000 * 60 * 60)
                    : 0,
                campaignName: task.campaignName
            }));

            const timeByCampaign = timeByTask.reduce((acc, item) => {
                const campaign = item.campaignName || 'Unassigned';
                if (!acc[campaign]) {
                    acc[campaign] = 0;
                }
                acc[campaign] += item.timeSpent;
                return acc;
            }, {});

            // Weekly summary
            const now = new Date();
            const weekStart = new Date(now);
            weekStart.setDate(now.getDate() - now.getDay());
            weekStart.setHours(0, 0, 0, 0);

            const weeklyTasks = completedTasks.filter(task => {
                const completed = new Date(task.completedAt);
                return completed >= weekStart;
            });

            const weeklyTime = weeklyTasks.reduce((sum, task) => {
                if (task.createdAt && task.completedAt) {
                    const created = new Date(task.createdAt);
                    const completed = new Date(task.completedAt);
                    return sum + (completed - created) / (1000 * 60 * 60);
                }
                return sum;
            }, 0);

            setTimeTracking({
                totalTime: totalTime,
                timeByTask: timeByTask,
                timeByCampaign: timeByCampaign,
                weeklyTime: weeklyTime,
                weeklyTasks: weeklyTasks.length
            });
        } catch (error) {
            console.error("Error fetching activity data:", error);
            // Set empty arrays on error to prevent blank page
            setActivities([]);
            setTimeTracking({});
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (hours) => {
        if (hours < 1) return `${Math.round(hours * 60)} minutes`;
        const h = Math.floor(hours);
        const m = Math.round((hours - h) * 60);
        return `${h}h ${m}m`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-slate-400">Loading activity data...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white">Activity & Time</h1>
                <p className="text-slate-400 mt-1">Track your activity log and time spent</p>
            </div>

            {/* Time Tracking Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-slate-800/50 rounded-xl shadow-sm border border-slate-700/50 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 text-sm font-medium">Total Time</p>
                            <p className="text-3xl font-bold text-white mt-2">
                                {formatTime(timeTracking.totalTime || 0)}
                            </p>
                        </div>
                        <div className="bg-emerald-500 p-3 rounded-lg">
                            <Clock className="text-white" size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-slate-800/50 rounded-xl shadow-sm border border-slate-700/50 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 text-sm font-medium">Weekly Time</p>
                            <p className="text-3xl font-bold text-white mt-2">
                                {formatTime(timeTracking.weeklyTime || 0)}
                            </p>
                        </div>
                        <div className="bg-blue-500 p-3 rounded-lg">
                            <Calendar className="text-white" size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-slate-800/50 rounded-xl shadow-sm border border-slate-700/50 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 text-sm font-medium">Tasks Completed</p>
                            <p className="text-3xl font-bold text-white mt-2">
                                {timeTracking.timeByTask?.length || 0}
                            </p>
                        </div>
                        <div className="bg-purple-500 p-3 rounded-lg">
                            <CheckSquare className="text-white" size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-slate-800/50 rounded-xl shadow-sm border border-slate-700/50 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 text-sm font-medium">This Week</p>
                            <p className="text-3xl font-bold text-white mt-2">
                                {timeTracking.weeklyTasks || 0}
                            </p>
                        </div>
                        <div className="bg-amber-500 p-3 rounded-lg">
                            <TrendingUp className="text-white" size={24} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Activity Log */}
                <div className="bg-slate-800/50 rounded-xl shadow-sm border border-slate-700/50 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-white">Activity Log</h2>
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <select
                                value={selectedPeriod}
                                onChange={(e) => setSelectedPeriod(e.target.value)}
                                className="pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                            >
                                <option value="week">This Week</option>
                                <option value="month">This Month</option>
                                <option value="all">All Time</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {activities.length === 0 ? (
                            <p className="text-slate-400 text-center py-8">No activities found</p>
                        ) : (
                            activities.map((activity) => {
                                const Icon = activity.icon || Activity;
                                return (
                                    <div
                                        key={activity.id}
                                        className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg"
                                    >
                                        <div className="p-2 bg-emerald-600/20 rounded-lg">
                                            <Icon className="text-emerald-400" size={18} />
                                        </div>
                                        <div className="flex-1">
                                        <p className="text-sm text-white">{activity.description}</p>
                                        <p className="text-xs text-slate-400 mt-1">
                                                {activity.createdAt.toLocaleDateString()} at{' '}
                                                {activity.createdAt.toLocaleTimeString()}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Time Tracking */}
                <div className="space-y-6">
                    {/* Time by Task */}
                    <div className="bg-slate-800/50 rounded-xl shadow-sm border border-slate-700/50 p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">Time by Task</h2>
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                            {timeTracking.timeByTask?.length === 0 ? (
                                <p className="text-slate-400 text-sm">No time tracked</p>
                            ) : (
                                timeTracking.timeByTask?.slice(0, 10).map((item) => (
                                    <div
                                        key={item.taskId}
                                        className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-white truncate">
                                                {item.taskTitle}
                                            </p>
                                            {item.campaignName && (
                                                <p className="text-xs text-slate-400 truncate">
                                                    {item.campaignName}
                                                </p>
                                            )}
                                        </div>
                                        <span className="text-sm font-semibold text-emerald-600 ml-4">
                                            {formatTime(item.timeSpent)}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Time by Campaign */}
                    <div className="bg-slate-800/50 rounded-xl shadow-sm border border-slate-700/50 p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">Time by Campaign</h2>
                        <div className="space-y-3">
                            {Object.keys(timeTracking.timeByCampaign || {}).length === 0 ? (
                                <p className="text-slate-400 text-sm">No campaign time tracked</p>
                            ) : (
                                Object.entries(timeTracking.timeByCampaign || {})
                                    .sort(([, a], [, b]) => b - a)
                                    .map(([campaign, time]) => (
                                        <div
                                            key={campaign}
                                        className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg"
                                    >
                                        <span className="text-sm font-medium text-white">
                                                {campaign}
                                            </span>
                                            <span className="text-sm font-semibold text-emerald-600">
                                                {formatTime(time)}
                                            </span>
                                        </div>
                                    ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
