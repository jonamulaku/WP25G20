import { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import {
    CheckSquare,
    Calendar,
    AlertCircle,
    Search,
    Filter,
    Eye,
    MessageSquare,
    Paperclip,
    Plus,
    Clock,
    User,
    FileText
} from "lucide-react";
import { tasksAPI } from "../../services/api";
import { generateMockTasks, generateMockComments } from "../../services/mockData";

const PRIORITY_COLORS = {
    Low: "bg-slate-100 text-slate-700",
    Medium: "bg-blue-100 text-blue-700",
    High: "bg-amber-100 text-amber-700",
    Urgent: "bg-red-100 text-red-700"
};

const STATUS_COLORS = {
    Pending: "bg-slate-100 text-slate-700",
    InProgress: "bg-blue-100 text-blue-700",
    Review: "bg-purple-100 text-purple-700",
    OnHold: "bg-amber-100 text-amber-700",
    Completed: "bg-emerald-100 text-emerald-700",
    Cancelled: "bg-red-100 text-red-700"
};

export default function MyTasks() {
    const { userInfo, teamMemberInfo } = useOutletContext();
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [priorityFilter, setPriorityFilter] = useState("All");
    const [selectedTask, setSelectedTask] = useState(null);
    const [showTaskDetail, setShowTaskDetail] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTasks();
    }, [userInfo]);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            // TODO: Replace with real API call when backend is ready
            // const response = await tasksAPI.getMyTasks();
            // const userTasks = response.items || [];
            
            // Use mock data for now
            const userTasks = generateMockTasks(userInfo.id, teamMemberInfo?.role);
            setTasks(userTasks);
            setFilteredTasks(userTasks);
        } catch (error) {
            console.error("Error fetching tasks:", error);
            // Fallback to mock data on error
            const userTasks = generateMockTasks(userInfo.id, teamMemberInfo?.role);
            setTasks(userTasks);
            setFilteredTasks(userTasks);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let filtered = tasks;

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(task =>
                task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                task.campaignName?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Status filter
        if (statusFilter !== "All") {
            filtered = filtered.filter(task => task.status === statusFilter);
        }

        // Priority filter
        if (priorityFilter !== "All") {
            filtered = filtered.filter(task => task.priority === priorityFilter);
        }

        setFilteredTasks(filtered);
    }, [tasks, searchTerm, statusFilter, priorityFilter]);

    const handleViewTask = async (taskId) => {
        try {
            // TODO: Replace with real API call when backend is ready
            // const task = await tasksAPI.getById(taskId);
            
            // Use mock data for now
            const task = tasks.find(t => t.id === taskId) || tasks[0];
            if (task) {
                // Enhance task with additional details
                const enhancedTask = {
                    ...task,
                    requirements: [
                        "Review brand guidelines",
                        "Ensure responsive design",
                        "Get stakeholder approval",
                        "Final quality check"
                    ],
                    attachments: Array.from({ length: task.fileCount || 0 }, (_, i) => ({
                        id: `${task.id}-file-${i}`,
                        name: `attachment_${i + 1}.pdf`,
                        size: Math.floor(Math.random() * 2000) + 100,
                        uploadedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString()
                    })),
                    comments: generateMockComments([task]),
                    statusHistory: [
                        { status: 'Pending', changedAt: task.createdAt, changedBy: 'System' },
                        ...(task.updatedAt ? [{ status: task.status, changedAt: task.updatedAt, changedBy: 'You' }] : []),
                        ...(task.completedAt ? [{ status: 'Completed', changedAt: task.completedAt, changedBy: 'You' }] : [])
                    ],
                    timeSpent: task.completedAt && task.createdAt 
                        ? Math.round((new Date(task.completedAt) - new Date(task.createdAt)) / (1000 * 60 * 60)) 
                        : null
                };
                setSelectedTask(enhancedTask);
                setShowTaskDetail(true);
            }
        } catch (error) {
            console.error("Error fetching task details:", error);
        }
    };

    const handleUpdateStatus = async (taskId, newStatus) => {
        try {
            const task = tasks.find(t => t.id === taskId);
            if (!task) return;

            await tasksAPI.update(taskId, {
                ...task,
                status: newStatus
            });
            
            await fetchTasks();
            if (selectedTask?.id === taskId) {
                const updated = await tasksAPI.getById(taskId);
                setSelectedTask(updated);
            }
        } catch (error) {
            console.error("Error updating task status:", error);
            alert("Failed to update task status");
        }
    };

    const handleAddComment = async (taskId, comment) => {
        // This would call a comments API endpoint
        // For now, we'll just refresh the task
        try {
            const updated = await tasksAPI.getById(taskId);
            setSelectedTask(updated);
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-slate-400">Loading tasks...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">My Tasks</h1>
                    <p className="text-slate-400 mt-1">Manage your assigned tasks</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-slate-800/50 rounded-xl shadow-sm border border-slate-700/50 p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none"
                        >
                            <option value="All">All Statuses</option>
                            <option value="Pending">Pending</option>
                            <option value="InProgress">In Progress</option>
                            <option value="Review">Review</option>
                            <option value="OnHold">On Hold</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>

                    {/* Priority Filter */}
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <select
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none"
                        >
                            <option value="All">All Priorities</option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="Urgent">Urgent</option>
                        </select>
                    </div>

                    {/* Task Count */}
                    <div className="flex items-center justify-end text-slate-300">
                        <span className="font-medium">{filteredTasks.length} task(s)</span>
                    </div>
                </div>
            </div>

            {/* Tasks Table */}
            <div className="bg-slate-800/50 rounded-xl shadow-sm border border-slate-700/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-900/50 border-b border-slate-700/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                    Title
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                    Campaign
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                    Priority
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                    Deadline
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                    Assigned By
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-slate-800/30 divide-y divide-slate-700/50">
                            {filteredTasks.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-slate-500">
                                        No tasks found
                                    </td>
                                </tr>
                            ) : (
                                filteredTasks.map((task) => (
                                    <tr key={task.id} className="hover:bg-slate-700/30 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <CheckSquare size={18} className="text-slate-400" />
                                                <span className="font-medium text-white">{task.title}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-slate-300">
                                            {task.campaignName || "N/A"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.Medium}`}>
                                                {task.priority || "Medium"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[task.status] || STATUS_COLORS.Pending}`}>
                                                {task.status || "Pending"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {task.dueDate ? (
                                                <div className="flex items-center gap-1 text-slate-300">
                                                    <Calendar size={14} />
                                                    <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                                                </div>
                                            ) : (
                                                <span className="text-slate-400">No deadline</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-slate-300">
                                            {task.createdBy || "System"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleViewTask(task.id)}
                                                className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Task Detail Modal */}
            {showTaskDetail && selectedTask && (
                <TaskDetailModal
                    task={selectedTask}
                    onClose={() => {
                        setShowTaskDetail(false);
                        setSelectedTask(null);
                    }}
                    onUpdateStatus={handleUpdateStatus}
                    onAddComment={handleAddComment}
                />
            )}
        </div>
    );
}

function TaskDetailModal({ task, onClose, onUpdateStatus, onAddComment }) {
    const [comment, setComment] = useState("");
    const [status, setStatus] = useState(task.status);

    const handleStatusChange = (newStatus) => {
        setStatus(newStatus);
        onUpdateStatus(task.id, newStatus);
    };

    const handleSubmitComment = () => {
        if (comment.trim()) {
            onAddComment(task.id, comment);
            setComment("");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-slate-800 border-b border-slate-700/50 p-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">{task.title}</h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-200"
                    >
                        <span className="text-2xl">&times;</span>
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Task Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-slate-400">Campaign</label>
                            <p className="text-white mt-1">{task.campaignName || "N/A"}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-400">Priority</label>
                            <p className="text-white mt-1">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.Medium}`}>
                                    {task.priority || "Medium"}
                                </span>
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-400">Deadline</label>
                            <p className="text-white mt-1">
                                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No deadline"}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-400">Status</label>
                            <select
                                value={status}
                                onChange={(e) => handleStatusChange(e.target.value)}
                                        className="mt-1 px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            >
                                <option value="Pending">Pending</option>
                                <option value="InProgress">In Progress</option>
                                <option value="Review">Review</option>
                                <option value="OnHold">On Hold</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                            <label className="text-sm font-medium text-slate-400">Description</label>
                            <p className="text-white mt-1 whitespace-pre-wrap">{task.description || "No description"}</p>
                    </div>

                    {/* Requirements Checklist */}
                    {task.requirements && task.requirements.length > 0 && (
                        <div>
                            <label className="text-sm font-medium text-slate-400 mb-2 block">Requirements Checklist</label>
                            <div className="space-y-2 bg-slate-700/30 rounded-lg p-4">
                                {task.requirements.map((req, index) => (
                                    <label key={index} className="flex items-center gap-3 cursor-pointer hover:bg-slate-700/50 p-2 rounded">
                                        <input 
                                            type="checkbox" 
                                            className="rounded w-4 h-4 text-emerald-600 focus:ring-emerald-500" 
                                            defaultChecked={index < 2}
                                        />
                                        <span className="text-slate-300">{req}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Attachments */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium text-slate-400">Attachments ({task.attachments?.length || 0})</label>
                            <button className="flex items-center gap-2 px-3 py-1.5 text-sm border border-slate-600 rounded-lg hover:bg-slate-700/50 text-slate-300">
                                <Paperclip size={16} />
                                <span>Upload File</span>
                            </button>
                        </div>
                        {task.attachments && task.attachments.length > 0 ? (
                            <div className="space-y-2 bg-slate-700/30 rounded-lg p-4">
                                {task.attachments.map((file) => (
                                    <div key={file.id} className="flex items-center justify-between p-2 hover:bg-slate-700/50 rounded">
                                        <div className="flex items-center gap-3">
                                            <FileText className="text-slate-400" size={18} />
                                            <div>
                                                <p className="text-sm text-white">{file.name}</p>
                                                <p className="text-xs text-slate-400">
                                                    {(file.size / 1024).toFixed(2)} KB • {new Date(file.uploadedAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <button className="text-emerald-400 hover:text-emerald-300 text-sm">Download</button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-slate-700/30 rounded-lg p-4 text-center text-slate-400 text-sm">
                                No attachments yet
                            </div>
                        )}
                    </div>

                    {/* Comments Thread */}
                    <div>
                        <label className="text-sm font-medium text-slate-400 mb-2 block">Comments ({task.comments?.length || 0})</label>
                        <div className="space-y-3">
                            {/* Comments List */}
                            {task.comments && task.comments.length > 0 ? (
                                <div className="space-y-3 bg-slate-700/30 rounded-lg p-4 max-h-64 overflow-y-auto">
                                    {task.comments.map((comment) => (
                                        <div key={comment.id} className="border-b border-slate-600/50 pb-3 last:border-0">
                                            <div className="flex items-start justify-between mb-1">
                                                <div className="flex items-center gap-2">
                                                    <User className="text-slate-400" size={16} />
                                                    <span className="text-sm font-medium text-white">{comment.author}</span>
                                                </div>
                                                <span className="text-xs text-slate-400">
                                                    {new Date(comment.createdAt).toLocaleString()}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-300 ml-6">{comment.message}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-slate-700/30 rounded-lg p-4 text-center text-slate-400 text-sm">
                                    No comments yet
                                </div>
                            )}
                            
                            {/* Add Comment */}
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Add a comment... (Use @ to mention someone)"
                                    className="flex-1 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    onKeyPress={(e) => e.key === 'Enter' && handleSubmitComment()}
                                />
                                <button
                                    onClick={handleSubmitComment}
                                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                                >
                                    <MessageSquare size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Status History */}
                    {task.statusHistory && task.statusHistory.length > 0 && (
                        <div>
                            <label className="text-sm font-medium text-slate-400 mb-2 block">Status History</label>
                            <div className="space-y-2 bg-slate-700/30 rounded-lg p-4">
                                {task.statusHistory.map((history, index) => (
                                    <div key={index} className="flex items-center gap-3 text-sm">
                                        <div className={`w-2 h-2 rounded-full ${
                                            history.status === 'Completed' ? 'bg-emerald-500' :
                                            history.status === 'InProgress' ? 'bg-blue-500' :
                                            history.status === 'Review' ? 'bg-purple-500' :
                                            'bg-slate-500'
                                        }`} />
                                        <div className="flex-1">
                                            <span className="text-white font-medium">{history.status}</span>
                                            <span className="text-slate-400 ml-2">by {history.changedBy}</span>
                                        </div>
                                        <span className="text-slate-400 text-xs">
                                            {new Date(history.changedAt).toLocaleString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Time Spent */}
                    {task.timeSpent !== null && (
                        <div>
                            <label className="text-sm font-medium text-slate-400 mb-2 block">Time Spent</label>
                            <div className="bg-slate-700/30 rounded-lg p-4">
                                <div className="flex items-center gap-2">
                                    <Clock className="text-emerald-400" size={18} />
                                    <span className="text-white font-medium">{task.timeSpent} hours</span>
                                    <span className="text-slate-400 text-sm ml-2">
                                        ({task.timeSpent < 8 ? 'Under estimate' : task.timeSpent > 12 ? 'Over estimate' : 'On track'})
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
