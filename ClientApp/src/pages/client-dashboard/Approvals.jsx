import { useState, useEffect } from "react";
import { Search, Filter, CheckCircle2, XCircle, ChevronDown, ChevronUp, List } from "lucide-react";
import { campaignsAPI, tasksAPI, messagesAPI, approvalsAPI } from "../../services/api";
import { useOutletContext } from "react-router-dom";

export default function Approvals() {
    const { userInfo } = useOutletContext();
    const [campaigns, setCampaigns] = useState([]);
    const [taskApprovals, setTaskApprovals] = useState({}); // { taskId: { status: "Approved"|"Rejected", approvalId: number } }
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [expandedCampaigns, setExpandedCampaigns] = useState(new Set());
    const [processing, setProcessing] = useState({});

    useEffect(() => {
        fetchData();
    }, [userInfo]);

    // Auto-expand campaigns that have tasks on initial load
    useEffect(() => {
        if (campaigns.length > 0 && expandedCampaigns.size === 0 && !loading) {
            const campaignsWithTasks = campaigns.filter(c => c.tasks && c.tasks.length > 0);
            if (campaignsWithTasks.length > 0) {
                setExpandedCampaigns(new Set(campaignsWithTasks.map(c => c.id)));
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [campaigns.length, loading]);

    const fetchData = async () => {
        try {
            setLoading(true);
            // Fetch campaigns
            const campaignsResponse = await campaignsAPI.getAll({ pageSize: 1000 });
            const campaignsData = campaignsResponse.items || [];
            
            // Fetch all tasks for these campaigns - only show completed tasks
            const tasksResponse = await tasksAPI.getAll({ pageSize: 1000 });
            const allTasks = tasksResponse.items || [];
            
            // Filter to only show completed tasks
            const completedTasks = allTasks.filter(task => task.status === "Completed");
            
            // Group tasks by campaign
            const campaignsWithTasks = campaignsData.map(campaign => ({
                ...campaign,
                tasks: completedTasks.filter(task => task.campaignId === campaign.id)
            }));
            
            setCampaigns(campaignsWithTasks);
            
            // Fetch existing approval requests to restore approval status
            const approvalsResponse = await approvalsAPI.getAll({ pageSize: 1000 });
            const approvals = approvalsResponse.items || [];
            
            // Map approvals by taskId
            const approvalsMap = {};
            approvals.forEach(approval => {
                if (approval.taskId) {
                    approvalsMap[approval.taskId] = {
                        status: approval.status,
                        approvalId: approval.id
                    };
                }
            });
            
            setTaskApprovals(approvalsMap);
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('Failed to fetch data. Please try again.');
            setCampaigns([]);
            setTaskApprovals({});
        } finally {
            setLoading(false);
        }
    };

    const toggleCampaign = (campaignId) => {
        const newExpanded = new Set(expandedCampaigns);
        if (newExpanded.has(campaignId)) {
            newExpanded.delete(campaignId);
        } else {
            newExpanded.add(campaignId);
        }
        setExpandedCampaigns(newExpanded);
    };

    const getTaskStatus = (taskId) => {
        const status = taskApprovals[taskId]?.status;
        if (!status) return null;
        // Normalize status - ensure first letter is uppercase, rest lowercase
        const normalized = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
        // Map common variations
        if (normalized === "Pending") return "Pending";
        if (normalized === "Approved") return "Approved";
        if (normalized === "Rejected") return "Rejected";
        return normalized;
    };

    const checkCampaignApproval = async (campaign) => {
        // Check if all tasks are approved
        const allTasksApproved = campaign.tasks.every(task => {
            const status = getTaskStatus(task.id);
            return status === "Approved";
        });

        if (allTasksApproved && campaign.tasks.length > 0) {
            // Check if campaign approval message already sent
            const campaignApprovalExists = campaign.tasks.some(task => {
                const approval = taskApprovals[task.id];
                return approval && approval.campaignApproved;
            });

            if (!campaignApprovalExists) {
                // Send message that campaign is fully approved
                const clientName = userInfo?.firstName && userInfo?.lastName 
                    ? `${userInfo.firstName} ${userInfo.lastName}`.trim()
                    : userInfo?.email || "Client";
                
                const taskList = campaign.tasks.map(t => `- ${t.title}`).join('\n');
                const messageContent = `${clientName} has approved ALL tasks for campaign "${campaign.name}".\n\nThe campaign is now fully approved with all ${campaign.tasks.length} tasks approved:\n${taskList}`;

                try {
                    await messagesAPI.create({
                        subject: `Campaign Fully Approved: ${campaign.name}`,
                        content: messageContent,
                        type: "ClientToAdmin",
                        senderName: clientName,
                        senderEmail: userInfo?.email,
                        clientId: campaign.clientId,
                        relatedEntityId: campaign.id,
                        relatedEntityType: "Campaign"
                    });

                    // Mark that campaign approval was sent
                    const updatedApprovals = { ...taskApprovals };
                    campaign.tasks.forEach(task => {
                        if (updatedApprovals[task.id]) {
                            updatedApprovals[task.id] = {
                                ...updatedApprovals[task.id],
                                campaignApproved: true
                            };
                        }
                    });
                    setTaskApprovals(updatedApprovals);
                    return true; // Campaign was just approved
                } catch (error) {
                    console.error('Error sending campaign approval message:', error);
                    return false;
                }
            }
            return true; // Campaign was already approved
        }
        return false; // Not all tasks approved yet
    };

    const handleTaskApprove = async (task, campaign) => {
        const currentStatus = getTaskStatus(task.id);
        const wasRejected = currentStatus === "Rejected";
        const confirmMessage = wasRejected 
            ? `Re-approve task "${task.title}"? (This task was previously rejected)`
            : `Approve task "${task.title}"?`;
        
        if (!window.confirm(confirmMessage)) {
            return;
        }

        const taskKey = `task-${task.id}`;
        try {
            setProcessing(prev => ({ ...prev, [taskKey]: true }));

            // Check if approval request already exists
            let approvalId = taskApprovals[task.id]?.approvalId;
            
            if (!approvalId) {
                // Create approval request
                const newApproval = await approvalsAPI.create({
                    campaignId: campaign.id,
                    taskId: task.id,
                    itemName: task.title,
                    description: task.description || `Task: ${task.title}`,
                    itemType: "Task"
                });
                approvalId = newApproval.id;
            }

            // Process the approval (this will update status from Rejected to Approved if needed)
            await approvalsAPI.processApproval(approvalId, "Approved", null);

            // Update local state
            setTaskApprovals(prev => ({
                ...prev,
                [task.id]: {
                    status: "Approved",
                    approvalId: approvalId,
                    campaignApproved: false
                }
            }));

            // Send individual task approval message
            const clientName = userInfo?.firstName && userInfo?.lastName 
                ? `${userInfo.firstName} ${userInfo.lastName}`.trim()
                : userInfo?.email || "Client";
            
            const messageContent = wasRejected
                ? `${clientName} has re-approved the task "${task.title}" for campaign "${campaign.name}" after previously rejecting it.\n\nTask Details:\n${task.description || 'No description provided'}`
                : `${clientName} has approved the task "${task.title}" for campaign "${campaign.name}".\n\nTask Details:\n${task.description || 'No description provided'}`;

            await messagesAPI.create({
                subject: wasRejected ? `Task Re-Approved: ${task.title}` : `Task Approved: ${task.title}`,
                content: messageContent,
                type: "ClientToAdmin",
                senderName: clientName,
                senderEmail: userInfo?.email,
                clientId: campaign.clientId,
                relatedEntityId: task.id,
                relatedEntityType: "Task"
            });

            // Check if campaign should be approved (all tasks approved) - this will send campaign message only if all tasks are approved
            const allApproved = await checkCampaignApproval(campaign);

            if (allApproved) {
                alert('All tasks approved! Campaign is now fully approved. Admin has been notified.');
            } else {
                alert('Task approved successfully! Admin has been notified.');
            }
        } catch (error) {
            console.error('Error approving task:', error);
            alert(error.message || 'Failed to approve task. Please try again.');
        } finally {
            setProcessing(prev => ({ ...prev, [taskKey]: false }));
        }
    };

    const handleTaskReject = async (task, campaign) => {
        const comment = window.prompt(`Reject task "${task.title}"? Please provide a reason:`, "");
        if (comment === null) return; // User cancelled
        if (!comment.trim()) {
            alert('Please provide a reason for rejection.');
            return;
        }

        const taskKey = `task-${task.id}`;
        try {
            setProcessing(prev => ({ ...prev, [taskKey]: true }));

            // Check if approval request already exists
            let approvalId = taskApprovals[task.id]?.approvalId;
            
            if (!approvalId) {
                // Create approval request
                const newApproval = await approvalsAPI.create({
                    campaignId: campaign.id,
                    taskId: task.id,
                    itemName: task.title,
                    description: task.description || `Task: ${task.title}`,
                    itemType: "Task"
                });
                approvalId = newApproval.id;
            }

            // Process the rejection
            await approvalsAPI.processApproval(approvalId, "Rejected", comment);

            // Update local state
            setTaskApprovals(prev => ({
                ...prev,
                [task.id]: {
                    status: "Rejected",
                    approvalId: approvalId,
                    campaignApproved: false
                }
            }));

            // Send message to admin
            const clientName = userInfo?.firstName && userInfo?.lastName 
                ? `${userInfo.firstName} ${userInfo.lastName}`.trim()
                : userInfo?.email || "Client";
            
            const messageContent = `${clientName} has rejected the task "${task.title}" for campaign "${campaign.name}".\n\nTask Details:\n${task.description || 'No description provided'}\n\nRejection Reason:\n${comment}`;

            await messagesAPI.create({
                subject: `Task Rejected: ${task.title}`,
                content: messageContent,
                type: "ClientToAdmin",
                senderName: clientName,
                senderEmail: userInfo?.email,
                clientId: campaign.clientId,
                relatedEntityId: task.id,
                relatedEntityType: "Task"
            });

            alert('Task rejected successfully! Admin has been notified.');
        } catch (error) {
            console.error('Error rejecting task:', error);
            alert(error.message || 'Failed to reject task. Please try again.');
        } finally {
            setProcessing(prev => ({ ...prev, [taskKey]: false }));
        }
    };

    const filteredCampaigns = campaigns.filter(campaign => {
        const matchesSearch = campaign.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            campaign.description?.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Filter by status - show campaigns with pending tasks if statusFilter is "Pending"
        if (statusFilter === "Pending") {
            const hasPendingTasks = campaign.tasks.some(task => {
                const status = getTaskStatus(task.id);
                return !status || status === null;
            });
            return matchesSearch && hasPendingTasks;
        }
        
        return matchesSearch;
    });

    const getCampaignApprovalStatus = (campaign) => {
        if (campaign.tasks.length === 0) return null;
        
        const allApproved = campaign.tasks.every(task => getTaskStatus(task.id) === "Approved");
        const hasRejected = campaign.tasks.some(task => getTaskStatus(task.id) === "Rejected");
        const allPending = campaign.tasks.every(task => !getTaskStatus(task.id));
        
        if (allApproved) return "Approved";
        if (hasRejected) return "Partially Rejected";
        if (allPending) return "Pending";
        return "In Progress";
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-slate-400">Loading approvals...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Approvals</h1>
                <p className="text-slate-400">Review and approve campaigns and their tasks</p>
            </div>

            {/* Search and Filters */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search campaigns..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter className="text-slate-400" size={20} />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                        >
                            <option value="all">All Status</option>
                            <option value="Pending">Pending Only</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Campaigns List */}
            <div className="space-y-4">
                {filteredCampaigns.length === 0 ? (
                    <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5 text-center">
                        <p className="text-slate-400">No campaigns found</p>
                    </div>
                ) : (
                    filteredCampaigns.map((campaign) => {
                        const isExpanded = expandedCampaigns.has(campaign.id);
                        const pendingTasksCount = campaign.tasks.filter(task => {
                            const status = getTaskStatus(task.id);
                            return !status || status === null;
                        }).length;
                        const campaignStatus = getCampaignApprovalStatus(campaign);

                        return (
                            <div
                                key={campaign.id}
                                className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden"
                            >
                                {/* Campaign Header */}
                                <div className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-xl font-bold text-white">{campaign.name}</h3>
                                                {pendingTasksCount > 0 && (
                                                    <span className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded-lg text-xs font-medium">
                                                        {pendingTasksCount} Pending
                                                    </span>
                                                )}
                                                {campaignStatus === "Approved" && (
                                                    <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-xs font-medium">
                                                        Campaign Approved
                                                    </span>
                                                )}
                                            </div>
                                            {campaign.description && (
                                                <p className="text-slate-400 text-sm mb-2">{campaign.description}</p>
                                            )}
                                            <div className="flex items-center gap-4 text-sm text-slate-400">
                                                <span>{campaign.tasks.length} Tasks</span>
                                                {campaign.tasks.length > 0 && (
                                                    <span>
                                                        {campaign.tasks.filter(t => getTaskStatus(t.id) === "Approved").length} Approved, {" "}
                                                        {campaign.tasks.filter(t => getTaskStatus(t.id) === "Rejected").length} Rejected
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => toggleCampaign(campaign.id)}
                                                className="p-2 text-slate-400 hover:text-white transition-colors"
                                            >
                                                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Tasks List */}
                                {isExpanded && campaign.tasks.length > 0 && (
                                    <div className="border-t border-slate-700/50 px-6 py-4 bg-slate-900/30">
                                        <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                                            <List size={16} />
                                            Tasks ({campaign.tasks.length})
                                        </h4>
                                        <div className="space-y-3">
                                            {campaign.tasks.map((task) => {
                                                const taskStatus = getTaskStatus(task.id);
                                                const taskKey = `task-${task.id}`;
                                                const isProcessing = processing[taskKey];

                                                return (
                                                    <div
                                                        key={task.id}
                                                        className="bg-slate-700/30 rounded-lg p-4"
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-3 mb-1">
                                                                    <span className="text-white font-medium">{task.title}</span>
                                                                    {taskStatus && taskStatus !== "Pending" && (
                                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                                                                            taskStatus === "Approved" 
                                                                                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                                                                : "bg-red-500/20 text-red-400 border-red-500/30"
                                                                        }`}>
                                                                            {taskStatus}
                                                                        </span>
                                                                    )}
                                                                    {taskStatus === "Pending" && (
                                                                        <span className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded-lg text-xs font-medium border border-amber-500/30">
                                                                            Pending
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                {task.description && (
                                                                    <p className="text-slate-400 text-sm mt-1">{task.description}</p>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-2 ml-4">
                                                                {/* Always show approve/reject buttons - allow changing status */}
                                                                <button
                                                                    onClick={() => handleTaskApprove(task, campaign)}
                                                                    disabled={isProcessing}
                                                                    className="p-2 bg-emerald-600/20 text-emerald-400 rounded-lg hover:bg-emerald-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                                    title={taskStatus === "Rejected" ? "Approve Task (Previously Rejected)" : "Approve Task"}
                                                                >
                                                                    <CheckCircle2 size={20} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleTaskReject(task, campaign)}
                                                                    disabled={isProcessing}
                                                                    className="p-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                                    title={taskStatus === "Approved" ? "Reject Task (Previously Approved)" : "Reject Task"}
                                                                >
                                                                    <XCircle size={20} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {isExpanded && campaign.tasks.length === 0 && (
                                    <div className="border-t border-slate-700/50 px-6 py-4 bg-slate-900/30">
                                        <p className="text-slate-500 text-sm italic">No tasks for this campaign</p>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
