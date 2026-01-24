import { useState, useEffect } from "react";
import { Plus, Search, CheckCircle2, Clock, AlertCircle, User, Edit, Trash2, X, Save, CheckSquare, Check, XCircle } from "lucide-react";
import { tasksAPI, campaignsAPI, teamMembersAPI, messagesAPI, usersAPI } from "../../services/api";

export default function TasksPage() {
    const [tasks, setTasks] = useState([]);
    const [campaigns, setCampaigns] = useState([]);
    const [teamMembers, setTeamMembers] = useState([]);
    const [taskApprovalStatus, setTaskApprovalStatus] = useState({}); // { taskId: 'approved' | 'refused' | null }
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        campaignId: "",
        assignedToId: "",
        dueDate: "",
        priority: "Medium",
        status: "Pending",
        notes: ""
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [tasksRes, campaignsRes, teamMembersRes, messagesRes] = await Promise.all([
                tasksAPI.getAll({ pageSize: 1000 }),
                campaignsAPI.getAll({ pageSize: 1000 }),
                teamMembersAPI.getAll({ pageSize: 1000 }),
                messagesAPI.getAll({ type: "AdminToTeam", pageSize: 1000 })
            ]);
            setTasks(tasksRes.items || []);
            setCampaigns(campaignsRes.items || []);
            setTeamMembers(teamMembersRes.items || []);
            
            // Check approval/rejection status from messages
            const approvalStatus = {};
            const messages = messagesRes.items || [];
            messages.forEach(msg => {
                if (msg.relatedEntityType === "Task" && msg.relatedEntityId) {
                    const taskId = msg.relatedEntityId;
                    if (msg.subject?.includes("Approved")) {
                        approvalStatus[taskId] = 'approved';
                    } else if (msg.subject?.includes("Revision") || msg.subject?.includes("Refused")) {
                        approvalStatus[taskId] = 'refused';
                    }
                }
            });
            setTaskApprovalStatus(approvalStatus);
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('Failed to fetch data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (task = null) => {
        if (task) {
            setEditingTask(task);
            setFormData({
                title: task.title || "",
                description: task.description || "",
                campaignId: task.campaignId?.toString() || "",
                assignedToTeamMemberId: task.assignedToTeamMemberId?.toString() || "",
                dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : "",
                priority: task.priority || "Medium",
                status: task.status || "Pending",
                notes: task.notes || ""
            });
        } else {
            setEditingTask(null);
            setFormData({
                title: "",
                description: "",
                campaignId: "",
                assignedToTeamMemberId: "",
                dueDate: "",
                priority: "Medium",
                status: "Pending",
                notes: ""
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingTask(null);
        setFormData({
            title: "",
            description: "",
            campaignId: "",
            assignedToTeamMemberId: "",
            dueDate: "",
            priority: "Medium",
            status: "Pending",
            notes: ""
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const submitData = {
                ...formData,
                campaignId: parseInt(formData.campaignId),
                assignedToTeamMemberId: formData.assignedToTeamMemberId ? parseInt(formData.assignedToTeamMemberId) : null,
                dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null
            };

            if (editingTask) {
                await tasksAPI.update(editingTask.id, submitData);
            } else {
                await tasksAPI.create(submitData);
            }
            await fetchData();
            handleCloseModal();
        } catch (error) {
            console.error('Error saving task:', error);
            alert(error.message || 'Failed to save task. Please try again.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this task?')) {
            return;
        }
        try {
            await tasksAPI.delete(id);
            await fetchData();
        } catch (error) {
            console.error('Error deleting task:', error);
            alert('Failed to delete task. Please try again.');
        }
    };

    const handleApprove = async (task) => {
        if (!window.confirm(`Approve task "${task.title}"?`)) {
            return;
        }
        try {
            // Task is already "Completed", so we just need to notify the team member
            // Create a notification message for the team member
            if (task.assignedToTeamMemberId) {
                // Get the team member
                const teamMember = teamMembers.find(tm => tm.id === task.assignedToTeamMemberId);
                if (teamMember && teamMember.email) {
                    // Find user by email
                    try {
                        const usersResponse = await usersAPI.getAll({ searchTerm: teamMember.email, pageSize: 100 });
                        const user = usersResponse.items?.find(u => u.email?.toLowerCase() === teamMember.email?.toLowerCase());
                        
                        if (user && user.id) {
                            await messagesAPI.create({
                                subject: `Task Approved: ${task.title}`,
                                content: `Your task "${task.title}" has been approved by the admin. Great work!`,
                                type: "AdminToTeam",
                                recipientUserId: user.id,
                                teamMemberId: task.assignedToTeamMemberId,
                                relatedEntityId: task.id,
                                relatedEntityType: "Task"
                            });
                        }
                    } catch (userError) {
                        console.error('Error finding user:', userError);
                        // Continue even if we can't find the user - the task is still approved
                    }
                }
            }
            
            // Update approval status immediately
            setTaskApprovalStatus(prev => ({
                ...prev,
                [task.id]: 'approved'
            }));
            
            alert('Task approved! The team member has been notified.');
            await fetchData();
        } catch (error) {
            console.error('Error approving task:', error);
            alert('Failed to approve task. Please try again.');
        }
    };

    const handleRefuse = async (task) => {
        if (!window.confirm(`Refuse task "${task.title}"? The task will be set to "On Hold" and the team member will be notified.`)) {
            return;
        }
        try {
            // Update task status to OnHold
            await tasksAPI.update(task.id, {
                ...task,
                status: "OnHold"
            });

            // Create a notification message for the team member
            if (task.assignedToTeamMemberId) {
                const teamMember = teamMembers.find(tm => tm.id === task.assignedToTeamMemberId);
                if (teamMember && teamMember.email) {
                    // Find user by email
                    try {
                        const usersResponse = await usersAPI.getAll({ searchTerm: teamMember.email, pageSize: 100 });
                        const user = usersResponse.items?.find(u => u.email?.toLowerCase() === teamMember.email?.toLowerCase());
                        
                        if (user && user.id) {
                            await messagesAPI.create({
                                subject: `Task Needs Revision: ${task.title}`,
                                content: `Your task "${task.title}" has been reviewed and needs revision. Please review the requirements and update the task accordingly.`,
                                type: "AdminToTeam",
                                recipientUserId: user.id,
                                teamMemberId: task.assignedToTeamMemberId,
                                relatedEntityId: task.id,
                                relatedEntityType: "Task"
                            });
                        }
                    } catch (userError) {
                        console.error('Error finding user:', userError);
                        // Continue even if we can't find the user - the task is still refused
                    }
                }
            }
            
            // Update approval status immediately
            setTaskApprovalStatus(prev => ({
                ...prev,
                [task.id]: 'refused'
            }));
            
            alert('Task refused. The task has been set to "On Hold" and the team member has been notified.');
            await fetchData();
        } catch (error) {
            console.error('Error refusing task:', error);
            alert('Failed to refuse task. Please try again.');
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "Completed":
                return <CheckCircle2 className="text-emerald-400" size={20} />;
            case "In Progress":
                return <Clock className="text-blue-400" size={20} />;
            default:
                const now = new Date();
                return <Clock className="text-amber-400" size={20} />;
        }
    };

    const isOverdue = (task) => {
        if (task.status === "Completed" || !task.dueDate) return false;
        return new Date(task.dueDate) < new Date();
    };

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = 
            task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.assignedToName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.campaignName?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-slate-400">Loading tasks...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Task Management</h1>
                    <p className="text-slate-400">Track and manage tasks across all campaigns</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all flex items-center gap-2"
                >
                    <Plus size={20} />
                    Create Task
                </button>
            </div>

            {/* Search */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                </div>
            </div>

            {/* Tasks List */}
            {filteredTasks.length === 0 ? (
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-12 text-center">
                    <CheckSquare className="mx-auto text-slate-400 mb-4" size={48} />
                    <p className="text-slate-400">No tasks found</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredTasks.map((task) => {
                        const overdue = isOverdue(task);
                        return (
                            <div key={task.id} className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600/50 transition-all">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className="mt-1">
                                            {overdue ? (
                                                <AlertCircle className="text-red-400" size={20} />
                                            ) : (
                                                getStatusIcon(task.status)
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-white font-semibold text-lg mb-2">{task.title}</h3>
                                            {task.description && (
                                                <p className="text-slate-400 text-sm mb-2">{task.description}</p>
                                            )}
                                            <div className="flex items-center gap-4 text-sm flex-wrap">
                                                <div className="text-slate-400">
                                                    Campaign: <span className="text-slate-300">{task.campaignName}</span>
                                                </div>
                                                {task.assignedToTeamMemberName && (
                                                    <div className="flex items-center gap-2 text-slate-400">
                                                        <User size={16} />
                                                        {task.assignedToTeamMemberName} {task.assignedToTeamMemberRole && `(${task.assignedToTeamMemberRole})`}
                                                    </div>
                                                )}
                                                {task.dueDate && (
                                                    <div className={`${overdue ? 'text-red-400' : 'text-slate-400'}`}>
                                                        Due: {new Date(task.dueDate).toLocaleDateString()}
                                                    </div>
                                                )}
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                    task.priority === "High"
                                                        ? "bg-red-500/20 text-red-400"
                                                        : task.priority === "Medium"
                                                        ? "bg-amber-500/20 text-amber-400"
                                                        : "bg-blue-500/20 text-blue-400"
                                                }`}>
                                                    {task.priority}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            task.status === "Completed"
                                                ? "bg-emerald-500/20 text-emerald-400"
                                                : task.status === "In Progress" || task.status === "InProgress"
                                                ? "bg-blue-500/20 text-blue-400"
                                                : overdue
                                                ? "bg-red-500/20 text-red-400"
                                                : "bg-amber-500/20 text-amber-400"
                                        }`}>
                                            {overdue ? "Overdue" : task.status}
                                        </span>
                                        {/* Approve/Refuse buttons for completed tasks */}
                                        {task.status === "Completed" && task.assignedToTeamMemberId && (
                                            <>
                                                <button
                                                    onClick={() => handleApprove(task)}
                                                    className={`p-2 rounded-lg transition-all ${
                                                        taskApprovalStatus[task.id] === 'approved'
                                                            ? 'bg-emerald-500/30 text-emerald-400 border border-emerald-500/50'
                                                            : 'text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/20'
                                                    }`}
                                                    title={taskApprovalStatus[task.id] === 'approved' ? "Task Approved" : "Approve Task"}
                                                >
                                                    <Check size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleRefuse(task)}
                                                    className={`p-2 rounded-lg transition-all ${
                                                        taskApprovalStatus[task.id] === 'refused'
                                                            ? 'bg-red-500/30 text-red-400 border border-red-500/50'
                                                            : 'text-slate-400 hover:text-red-400 hover:bg-red-500/20'
                                                    }`}
                                                    title={taskApprovalStatus[task.id] === 'refused' ? "Task Refused" : "Refuse Task"}
                                                >
                                                    <XCircle size={18} />
                                                </button>
                                            </>
                                        )}
                                        <button
                                            onClick={() => handleOpenModal(task)}
                                            className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-700/50 rounded-lg transition-all"
                                            title="Edit"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(task.id)}
                                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700/50 rounded-lg transition-all"
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-800 rounded-2xl border border-slate-700/50 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-slate-800 border-b border-slate-700/50 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-white">
                                {editingTask ? "Edit Task" : "Create Task"}
                            </h2>
                            <button
                                onClick={handleCloseModal}
                                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-slate-300 text-sm font-medium mb-2">
                                    Task Title *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-300 text-sm font-medium mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-slate-300 text-sm font-medium mb-2">
                                        Campaign *
                                    </label>
                                    <select
                                        required
                                        value={formData.campaignId}
                                        onChange={(e) => setFormData({ ...formData, campaignId: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                    >
                                        <option value="">Select Campaign</option>
                                        {campaigns.map(campaign => (
                                            <option key={campaign.id} value={campaign.id}>
                                                {campaign.name} - {campaign.clientName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-slate-300 text-sm font-medium mb-2">
                                        Assign To Team Member
                                    </label>
                                    <select
                                        value={formData.assignedToTeamMemberId}
                                        onChange={(e) => setFormData({ ...formData, assignedToTeamMemberId: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                    >
                                        <option value="">Unassigned</option>
                                        {teamMembers.filter(tm => tm.isActive).map(teamMember => (
                                            <option key={teamMember.id} value={teamMember.id}>
                                                {teamMember.firstName} {teamMember.lastName} - {teamMember.role}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-slate-300 text-sm font-medium mb-2">
                                        Due Date
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.dueDate}
                                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-300 text-sm font-medium mb-2">
                                        Priority *
                                    </label>
                                    <select
                                        required
                                        value={formData.priority}
                                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                </div>
                            </div>
                            {editingTask && (
                                <div>
                                    <label className="block text-slate-300 text-sm font-medium mb-2">
                                        Status *
                                    </label>
                                    <select
                                        required
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="InProgress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                        <option value="OnHold">On Hold</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </div>
                            )}
                            <div>
                                <label className="block text-slate-300 text-sm font-medium mb-2">
                                    Notes
                                </label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                />
                            </div>
                            <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-700/50">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-6 py-2.5 text-slate-300 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all flex items-center gap-2"
                                >
                                    <Save size={18} />
                                    {editingTask ? "Update" : "Create"} Task
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
