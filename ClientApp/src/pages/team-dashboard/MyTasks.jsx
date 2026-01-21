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
            const response = await tasksAPI.getMyTasks();
            const userTasks = response.items || [];
            setTasks(userTasks);
            setFilteredTasks(userTasks);
        } catch (error) {
            console.error("Error fetching tasks:", error);
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
            const task = await tasksAPI.getById(taskId);
            setSelectedTask(task);
            setShowTaskDetail(true);
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

                    {/* Requirements Checklist (mock) */}
                    <div>
                            <label className="text-sm font-medium text-slate-400 mb-2 block">Requirements</label>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" className="rounded" />
                                    <span className="text-slate-300">Requirement 1</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="checkbox" className="rounded" />
                                    <span className="text-slate-300">Requirement 2</span>
                            </label>
                        </div>
                    </div>

                    {/* Attachments */}
                    <div>
                        <label className="text-sm font-medium text-slate-400 mb-2 block">Attachments ({task.fileCount || 0})</label>
                        <button className="flex items-center gap-2 px-4 py-2 border border-slate-600 rounded-lg hover:bg-slate-700/50 text-slate-300">
                            <Paperclip size={18} />
                            <span>Upload File</span>
                        </button>
                    </div>

                    {/* Comments */}
                    <div>
                            <label className="text-sm font-medium text-slate-400 mb-2 block">Comments ({task.commentCount || 0})</label>
                            <div className="space-y-3">
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Add a comment..."
                                        className="flex-1 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                                <button
                                    onClick={handleSubmitComment}
                                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="text-sm text-slate-500">Comments thread would appear here</div>
                        </div>
                    </div>

                    {/* Status History (mock) */}
                    <div>
                            <label className="text-sm font-medium text-slate-400 mb-2 block">Status History</label>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-slate-300">
                                <Clock size={14} />
                                <span>Created on {new Date(task.createdAt).toLocaleDateString()}</span>
                            </div>
                            {task.completedAt && (
                                <div className="flex items-center gap-2 text-slate-300">
                                    <Clock size={14} />
                                    <span>Completed on {new Date(task.completedAt).toLocaleDateString()}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
