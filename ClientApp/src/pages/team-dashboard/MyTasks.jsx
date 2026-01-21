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
    Low: "bg-slate-600/30 text-slate-300 border border-slate-600",
    Medium: "bg-blue-600/30 text-blue-300 border border-blue-600",
    High: "bg-amber-600/30 text-amber-300 border border-amber-600",
    Urgent: "bg-red-600/30 text-red-300 border border-red-600"
};

const STATUS_COLORS = {
    Pending: "bg-slate-600/30 text-slate-300 border border-slate-600",
    InProgress: "bg-blue-600/30 text-blue-300 border border-blue-600",
    Review: "bg-purple-600/30 text-purple-300 border border-purple-600",
    OnHold: "bg-amber-600/30 text-amber-300 border border-amber-600",
    Completed: "bg-emerald-600/30 text-emerald-300 border border-emerald-600",
    Cancelled: "bg-red-600/30 text-red-300 border border-red-600"
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
            // TODO: Replace with real API call when backend is ready
            // await tasksAPI.update(taskId, { status: newStatus });
            
            // Update local state for now
            setTasks(prevTasks => 
                prevTasks.map(task => 
                    task.id === taskId ? { ...task, status: newStatus } : task
                )
            );
            
            // Update filtered tasks
            setFilteredTasks(prevTasks => 
                prevTasks.map(task => 
                    task.id === taskId ? { ...task, status: newStatus } : task
                )
            );
            
            // Update selected task if it's the one being updated
            if (selectedTask?.id === taskId) {
                setSelectedTask(prev => prev ? { ...prev, status: newStatus } : null);
            }
        } catch (error) {
            console.error("Error updating task status:", error);
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
                <button
                    onClick={() => {
                        // TODO: Implement add new task functionality
                        alert("Add New Task feature - to be implemented");
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium shadow-lg shadow-emerald-600/20"
                >
                    <Plus size={20} />
                    <span>Add New Task</span>
                </button>
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
                            style={{ backgroundColor: '#334155' }}
                        >
                            <option value="All" style={{ backgroundColor: '#1e293b', color: '#fff' }}>All Statuses</option>
                            <option value="Pending" style={{ backgroundColor: '#1e293b', color: '#fff' }}>Pending</option>
                            <option value="InProgress" style={{ backgroundColor: '#1e293b', color: '#fff' }}>In Progress</option>
                            <option value="Review" style={{ backgroundColor: '#1e293b', color: '#fff' }}>Review</option>
                            <option value="OnHold" style={{ backgroundColor: '#1e293b', color: '#fff' }}>On Hold</option>
                            <option value="Completed" style={{ backgroundColor: '#1e293b', color: '#fff' }}>Completed</option>
                        </select>
                    </div>

                    {/* Priority Filter */}
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <select
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none"
                            style={{ backgroundColor: '#334155' }}
                        >
                            <option value="All" style={{ backgroundColor: '#1e293b', color: '#fff' }}>All Priorities</option>
                            <option value="Low" style={{ backgroundColor: '#1e293b', color: '#fff' }}>Low</option>
                            <option value="Medium" style={{ backgroundColor: '#1e293b', color: '#fff' }}>Medium</option>
                            <option value="High" style={{ backgroundColor: '#1e293b', color: '#fff' }}>High</option>
                            <option value="Urgent" style={{ backgroundColor: '#1e293b', color: '#fff' }}>Urgent</option>
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
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
                    <style>{`
                        .scrollbar-thin::-webkit-scrollbar {
                            height: 8px;
                        }
                        .scrollbar-thin::-webkit-scrollbar-track {
                            background: #1e293b;
                        }
                        .scrollbar-thin::-webkit-scrollbar-thumb {
                            background: #475569;
                            border-radius: 4px;
                        }
                        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
                            background: #64748b;
                        }
                    `}</style>
                    <table className="w-full">
                        <thead className="bg-slate-900/50 border-b border-slate-700/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                    Title
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                    Campaign
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                    Priority
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                    Deadline
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                    Assigned By
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
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
                                            <select
                                                value={task.status || "Pending"}
                                                onChange={(e) => handleUpdateStatus(task.id, e.target.value)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-medium border focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all ${
                                                    task.status === 'Completed' ? 'bg-emerald-600/30 text-emerald-300 border-emerald-600' :
                                                    task.status === 'InProgress' ? 'bg-blue-600/30 text-blue-300 border-blue-600' :
                                                    task.status === 'Review' ? 'bg-purple-600/30 text-purple-300 border-purple-600' :
                                                    task.status === 'OnHold' ? 'bg-amber-600/30 text-amber-300 border-amber-600' :
                                                    'bg-slate-600/30 text-slate-300 border-slate-600'
                                                }`}
                                                style={{ backgroundColor: task.status === 'Completed' ? 'rgba(5, 150, 105, 0.2)' :
                                                                    task.status === 'InProgress' ? 'rgba(59, 130, 246, 0.2)' :
                                                                    task.status === 'Review' ? 'rgba(147, 51, 234, 0.2)' :
                                                                    task.status === 'OnHold' ? 'rgba(245, 158, 11, 0.2)' :
                                                                    'rgba(71, 85, 105, 0.3)' }}
                                            >
                                                <option value="Pending" style={{ backgroundColor: '#1e293b', color: '#fff' }}>Pending</option>
                                                <option value="InProgress" style={{ backgroundColor: '#1e293b', color: '#fff' }}>In Progress</option>
                                                <option value="Review" style={{ backgroundColor: '#1e293b', color: '#fff' }}>Review</option>
                                                <option value="OnHold" style={{ backgroundColor: '#1e293b', color: '#fff' }}>On Hold</option>
                                                <option value="Completed" style={{ backgroundColor: '#1e293b', color: '#fff' }}>Completed</option>
                                            </select>
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
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 rounded-lg font-medium text-sm transition-colors border border-emerald-600/30"
                                            >
                                                <Eye size={14} />
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700/50 px-6 py-5 flex items-center justify-between">
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-white mb-1">{task.title}</h2>
                        <div className="flex items-center gap-3 mt-2">
                            <span className={`px-3 py-1 rounded-lg text-xs font-medium ${STATUS_COLORS[task.status] || STATUS_COLORS.Pending}`}>
                                {task.status || "Pending"}
                            </span>
                            <span className={`px-3 py-1 rounded-lg text-xs font-medium ${PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.Medium}`}>
                                {task.priority || "Medium"}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="ml-4 p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                    >
                        <span className="text-2xl leading-none">&times;</span>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
                    <style>{`
                        .scrollbar-thin::-webkit-scrollbar {
                            width: 8px;
                        }
                        .scrollbar-thin::-webkit-scrollbar-track {
                            background: #1e293b;
                        }
                        .scrollbar-thin::-webkit-scrollbar-thumb {
                            background: #475569;
                            border-radius: 4px;
                        }
                        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
                            background: #64748b;
                        }
                    `}</style>
                    <div className="p-6 space-y-6">
                    {/* Task Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Campaign</label>
                            <p className="text-white mt-2 font-medium">{task.campaignName || "N/A"}</p>
                        </div>
                        <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Deadline</label>
                            <p className="text-white mt-2 font-medium">
                                {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric', 
                                    year: 'numeric' 
                                }) : "No deadline"}
                            </p>
                        </div>
                        <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Status</label>
                            <select
                                value={status}
                                onChange={(e) => handleStatusChange(e.target.value)}
                                className="mt-2 w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                                style={{ backgroundColor: '#1e293b' }}
                            >
                                <option value="Pending" style={{ backgroundColor: '#1e293b', color: '#fff' }}>Pending</option>
                                <option value="InProgress" style={{ backgroundColor: '#1e293b', color: '#fff' }}>In Progress</option>
                                <option value="Review" style={{ backgroundColor: '#1e293b', color: '#fff' }}>Review</option>
                                <option value="OnHold" style={{ backgroundColor: '#1e293b', color: '#fff' }}>On Hold</option>
                                <option value="Completed" style={{ backgroundColor: '#1e293b', color: '#fff' }}>Completed</option>
                            </select>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-slate-700/30 rounded-lg p-5 border border-slate-600/50">
                        <label className="text-sm font-semibold text-slate-300 mb-3 block">Description</label>
                        <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">{task.description || "No description provided"}</p>
                    </div>

                    {/* Requirements Checklist */}
                    {task.requirements && task.requirements.length > 0 && (
                        <div className="bg-slate-700/30 rounded-lg p-5 border border-slate-600/50">
                            <label className="text-sm font-semibold text-slate-300 mb-4 block">Requirements Checklist</label>
                            <div className="space-y-2">
                                {task.requirements.map((req, index) => (
                                    <label key={index} className="flex items-center gap-3 cursor-pointer hover:bg-slate-600/30 p-3 rounded-lg transition-colors">
                                        <input 
                                            type="checkbox" 
                                            className="rounded w-5 h-5 text-emerald-600 focus:ring-emerald-500 border-slate-600 bg-slate-800" 
                                            defaultChecked={index < 2}
                                        />
                                        <span className="text-slate-200">{req}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Attachments */}
                    <div className="bg-slate-700/30 rounded-lg p-5 border border-slate-600/50">
                        <div className="flex items-center justify-between mb-4">
                            <label className="text-sm font-semibold text-slate-300">Attachments ({task.attachments?.length || 0})</label>
                            <button className="flex items-center gap-2 px-3 py-1.5 text-sm border border-slate-600 rounded-lg hover:bg-slate-600/50 text-slate-300 transition-colors">
                                <Paperclip size={16} />
                                <span>Upload File</span>
                            </button>
                        </div>
                        {task.attachments && task.attachments.length > 0 ? (
                            <div className="space-y-2">
                                {task.attachments.map((file) => (
                                    <div key={file.id} className="flex items-center justify-between p-3 bg-slate-800/50 hover:bg-slate-800 rounded-lg border border-slate-600/30 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-slate-700/50 rounded-lg">
                                                <FileText className="text-slate-300" size={18} />
                                            </div>
                                            <div>
                                                <p className="text-sm text-white font-medium">{file.name}</p>
                                                <p className="text-xs text-slate-400">
                                                    {(file.size / 1024).toFixed(2)} KB • {new Date(file.uploadedAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <button className="px-3 py-1.5 text-sm bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 rounded-lg border border-emerald-600/30 transition-colors">
                                            Download
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-slate-800/50 rounded-lg p-8 text-center border border-slate-600/30">
                                <Paperclip className="mx-auto text-slate-500 mb-2" size={24} />
                                <p className="text-slate-400 text-sm">No attachments yet</p>
                            </div>
                        )}
                    </div>

                    {/* Comments Thread */}
                    <div className="bg-slate-700/30 rounded-lg p-5 border border-slate-600/50">
                        <label className="text-sm font-semibold text-slate-300 mb-4 block">Comments ({task.comments?.length || 0})</label>
                        <div className="space-y-3">
                            {/* Comments List */}
                            {task.comments && task.comments.length > 0 ? (
                                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
                                    {task.comments.map((comment) => (
                                        <div key={comment.id} className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/30">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="p-1.5 bg-slate-700/50 rounded-full">
                                                        <User className="text-slate-300" size={14} />
                                                    </div>
                                                    <span className="text-sm font-semibold text-white">{comment.author}</span>
                                                </div>
                                                <span className="text-xs text-slate-400">
                                                    {new Date(comment.createdAt).toLocaleString()}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-200 ml-8 leading-relaxed">{comment.message}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-slate-800/50 rounded-lg p-8 text-center border border-slate-600/30 mb-4">
                                    <MessageSquare className="mx-auto text-slate-500 mb-2" size={24} />
                                    <p className="text-slate-400 text-sm">No comments yet</p>
                                </div>
                            )}
                            
                            {/* Add Comment */}
                            <div className="flex gap-3 pt-4 border-t border-slate-600/50">
                                <input
                                    type="text"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Add a comment... (Use @ to mention someone)"
                                    className="flex-1 px-4 py-2.5 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                                    onKeyPress={(e) => e.key === 'Enter' && handleSubmitComment()}
                                />
                                <button
                                    onClick={handleSubmitComment}
                                    className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 font-medium"
                                >
                                    <MessageSquare size={18} />
                                    <span>Send</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Status History */}
                    {task.statusHistory && task.statusHistory.length > 0 && (
                        <div className="bg-slate-700/30 rounded-lg p-5 border border-slate-600/50">
                            <label className="text-sm font-semibold text-slate-300 mb-4 block">Status History</label>
                            <div className="space-y-3">
                                {task.statusHistory.map((history, index) => (
                                    <div key={index} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-600/30">
                                        <div className={`w-3 h-3 rounded-full ${
                                            history.status === 'Completed' ? 'bg-emerald-500' :
                                            history.status === 'InProgress' ? 'bg-blue-500' :
                                            history.status === 'Review' ? 'bg-purple-500' :
                                            'bg-slate-500'
                                        }`} />
                                        <div className="flex-1">
                                            <span className="text-white font-semibold">{history.status}</span>
                                            <span className="text-slate-400 ml-2 text-sm">by {history.changedBy}</span>
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
                        <div className="bg-slate-700/30 rounded-lg p-5 border border-slate-600/50">
                            <label className="text-sm font-semibold text-slate-300 mb-3 block">Time Spent</label>
                            <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg border border-slate-600/30">
                                <div className="p-2 bg-emerald-600/20 rounded-lg">
                                    <Clock className="text-emerald-400" size={20} />
                                </div>
                                <div>
                                    <span className="text-white font-bold text-lg">{task.timeSpent} hours</span>
                                    <span className="text-slate-400 text-sm ml-3">
                                        ({task.timeSpent < 8 ? 'Under estimate' : task.timeSpent > 12 ? 'Over estimate' : 'On track'})
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                    </div>
                </div>
            </div>
        </div>
    );
}
