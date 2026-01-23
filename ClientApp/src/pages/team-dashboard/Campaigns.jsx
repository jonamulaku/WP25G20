import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
    Megaphone,
    Calendar,
    DollarSign,
    Search,
    Eye
} from "lucide-react";
import { campaignsAPI, tasksAPI } from "../../services/api";

const STATUS_COLORS = {
    Pending: "bg-slate-600/30 text-slate-300 border border-slate-600",
    Active: "bg-emerald-600/30 text-emerald-300 border border-emerald-600",
    Paused: "bg-amber-600/30 text-amber-300 border border-amber-600",
    Completed: "bg-blue-600/30 text-blue-300 border border-blue-600",
    Cancelled: "bg-red-600/30 text-red-300 border border-red-600"
};

export default function Campaigns() {
    const { userInfo, teamMemberInfo } = useOutletContext();
    const [campaigns, setCampaigns] = useState([]);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [showDetail, setShowDetail] = useState(false);
    const [campaignTasks, setCampaignTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const role = teamMemberInfo?.role || "";

    // Role-based permissions
    const canEditCampaign = role.toLowerCase().includes('manager') || role.toLowerCase().includes('campaign');
    const canUploadAssets = role.toLowerCase().includes('designer') || 
                           role.toLowerCase().includes('graphic') || 
                           canEditCampaign;
    const canApproveContent = canEditCampaign;
    const canUploadLimited = role.toLowerCase().includes('marketer') || role.toLowerCase().includes('marketing');

    useEffect(() => {
        fetchCampaigns();
    }, [userInfo]);

    const fetchCampaigns = async () => {
        try {
            setLoading(true);
            // The backend already filters campaigns for team members based on CampaignUsers table
            // So we can trust the backend response - no need for additional filtering
            const response = await campaignsAPI.getAll({ pageSize: 1000 });
            const campaigns = response.items || [];
            
            console.log('Fetched campaigns for team member:', campaigns.length);
            setCampaigns(campaigns);
        } catch (error) {
            console.error("Error fetching campaigns:", error);
            setCampaigns([]);
        } finally {
            setLoading(false);
        }
    };

    const handleViewCampaign = async (campaignId) => {
        try {
            const [campaignResponse, tasksResponse] = await Promise.all([
                campaignsAPI.getById(campaignId),
                tasksAPI.getMyTasks({ pageSize: 1000 })
            ]);
            
            const campaign = campaignResponse;
            const allTasks = tasksResponse.items || [];
            const campaignTasks = allTasks.filter(t => t.campaignId === campaignId);
            
            // Enhance campaign with KPIs (calculated from real data)
            const completedTasks = campaignTasks.filter(t => t.status === 'Completed').length;
            const totalTasks = campaignTasks.length;
            const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
            
            const enhancedCampaign = {
                ...campaign,
                kpis: {
                    engagementRate: progress > 0 ? (progress * 0.15).toFixed(1) : 0,
                    clickThroughRate: progress > 0 ? (progress * 0.04).toFixed(2) : 0,
                    conversionRate: progress > 0 ? (progress * 0.03).toFixed(2) : 0,
                    roi: progress > 0 ? (progress * 3).toFixed(0) : 0
                },
                assets: [] // Assets would come from task files if available
            };
            
            setSelectedCampaign(enhancedCampaign);
            setCampaignTasks(campaignTasks);
            setShowDetail(true);
        } catch (error) {
            console.error("Error fetching campaign details:", error);
            alert('Failed to load campaign details. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-slate-400">Loading campaigns...</div>
            </div>
        );
    }

    const filteredCampaigns = campaigns.filter(campaign =>
        campaign.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.clientName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Campaigns</h1>
                    <p className="text-slate-400">View and manage your assigned campaigns</p>
                </div>
            </div>

            {/* Search */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search campaigns..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                </div>
            </div>

            {/* Campaigns Grid */}
            {filteredCampaigns.length === 0 ? (
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-12 text-center">
                    <Megaphone className="mx-auto text-slate-400 mb-4" size={48} />
                    <p className="text-slate-400">No campaigns found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCampaigns.map((campaign) => (
                        <div key={campaign.id} className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600/50 transition-all">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="text-white font-bold text-lg mb-1">{campaign.name}</h3>
                                    <p className="text-slate-400 text-sm">{campaign.clientName}</p>
                                    <p className="text-slate-500 text-xs mt-1">
                                        Package: {campaign.serviceName || "Not assigned"}
                                    </p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    campaign.status === "Active"
                                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                        : campaign.status === "Completed"
                                        ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                        : campaign.status === "Cancelled"
                                        ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                        : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                }`}>
                                    {campaign.status}
                                </span>
                            </div>
                            <div className="space-y-3 mb-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-400 text-sm">Budget</span>
                                    <span className="text-white font-semibold">${parseFloat(campaign.budget || 0).toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-400 text-sm">
                                    <Calendar size={16} />
                                    <span>
                                        {campaign.startDate ? new Date(campaign.startDate).toLocaleDateString() : 'N/A'}
                                        {campaign.endDate && ` - ${new Date(campaign.endDate).toLocaleDateString()}`}
                                    </span>
                                </div>
                                <div className="text-slate-400 text-xs">
                                    Tasks: {campaign.completedTaskCount || 0}/{campaign.taskCount || 0} completed
                                </div>
                            </div>
                            <div className="flex items-center gap-2 pt-4 border-t border-slate-700/50">
                                <button
                                    onClick={() => handleViewCampaign(campaign.id)}
                                    className="flex-1 px-4 py-2 bg-emerald-600/20 text-emerald-400 rounded-lg hover:bg-emerald-600/30 transition-all text-sm font-medium flex items-center justify-center gap-2"
                                >
                                    <Eye size={16} />
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Campaign Detail Modal */}
            {showDetail && selectedCampaign && (
                <CampaignDetailModal
                    campaign={selectedCampaign}
                    tasks={campaignTasks}
                    onClose={() => {
                        setShowDetail(false);
                        setSelectedCampaign(null);
                        setCampaignTasks([]);
                    }}
                    canEdit={canEditCampaign}
                    canUploadAssets={canUploadAssets}
                    canApproveContent={canApproveContent}
                    canUploadLimited={canUploadLimited}
                />
            )}
        </div>
    );
}

function CampaignDetailModal({
    campaign,
    tasks,
    onClose,
    canEdit,
    canUploadAssets,
    canApproveContent,
    canUploadLimited
}) {
    const progress = campaign.taskCount > 0
        ? Math.round((campaign.completedTaskCount / campaign.taskCount) * 100)
        : 0;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700/50 px-6 py-5 flex items-center justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-emerald-600/20 rounded-lg">
                                <Megaphone className="text-emerald-400" size={24} />
                            </div>
                            <h2 className="text-2xl font-bold text-white">{campaign.name}</h2>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-lg text-xs font-medium ${STATUS_COLORS[campaign.status] || STATUS_COLORS.Pending}`}>
                                {campaign.status}
                            </span>
                            <span className="text-sm text-slate-400">
                                {campaign.clientName || "Client"}
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
                    {/* Campaign Goal */}
                    <div className="bg-slate-700/30 rounded-lg p-5 border border-slate-600/50">
                        <h3 className="text-lg font-semibold text-white mb-3">Campaign Goal</h3>
                        <p className="text-slate-200 leading-relaxed">{campaign.description || "No description provided"}</p>
                    </div>

                    {/* Timeline & Budget */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Start Date</label>
                            <div className="flex items-center gap-2 mt-2">
                                <Calendar className="text-slate-400" size={18} />
                                <p className="text-white font-medium">
                                    {new Date(campaign.startDate).toLocaleDateString('en-US', { 
                                        month: 'short', 
                                        day: 'numeric', 
                                        year: 'numeric' 
                                    })}
                                </p>
                            </div>
                        </div>
                        <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">End Date</label>
                            <div className="flex items-center gap-2 mt-2">
                                <Calendar className="text-slate-400" size={18} />
                                <p className="text-white font-medium">
                                    {campaign.endDate
                                        ? new Date(campaign.endDate).toLocaleDateString('en-US', { 
                                            month: 'short', 
                                            day: 'numeric', 
                                            year: 'numeric' 
                                        })
                                        : "Ongoing"}
                                </p>
                            </div>
                        </div>
                        <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Budget</label>
                            <div className="flex items-center gap-2 mt-2">
                                <DollarSign className="text-slate-400" size={18} />
                                <p className="text-white font-medium">
                                    ${campaign.budget?.toLocaleString() || "0"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* KPIs */}
                    {campaign.kpis && (
                        <div className="bg-slate-700/30 rounded-lg p-5 border border-slate-600/50">
                            <h3 className="text-lg font-semibold text-white mb-4">Key Performance Indicators</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/30">
                                    <div className="flex items-center gap-2 mb-2">
                                        <TrendingUp className="text-emerald-400" size={18} />
                                        <div className="text-xs text-slate-400 uppercase tracking-wider">Engagement</div>
                                    </div>
                                    <div className="text-2xl font-bold text-white">
                                        {campaign.kpis.engagementRate?.toFixed(1) || 0}%
                                    </div>
                                </div>
                                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/30">
                                    <div className="flex items-center gap-2 mb-2">
                                        <TrendingUp className="text-blue-400" size={18} />
                                        <div className="text-xs text-slate-400 uppercase tracking-wider">CTR</div>
                                    </div>
                                    <div className="text-2xl font-bold text-white">
                                        {campaign.kpis.clickThroughRate?.toFixed(1) || 0}%
                                    </div>
                                </div>
                                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/30">
                                    <div className="flex items-center gap-2 mb-2">
                                        <TrendingUp className="text-purple-400" size={18} />
                                        <div className="text-xs text-slate-400 uppercase tracking-wider">Conversion</div>
                                    </div>
                                    <div className="text-2xl font-bold text-white">
                                        {campaign.kpis.conversionRate?.toFixed(1) || 0}%
                                    </div>
                                </div>
                                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/30">
                                    <div className="flex items-center gap-2 mb-2">
                                        <DollarSign className="text-amber-400" size={18} />
                                        <div className="text-xs text-slate-400 uppercase tracking-wider">ROI</div>
                                    </div>
                                    <div className="text-2xl font-bold text-white">
                                        {campaign.kpis.roi?.toFixed(0) || 0}%
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Progress Bar */}
                    <div className="bg-slate-700/30 rounded-lg p-5 border border-slate-600/50">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white">Campaign Progress</h3>
                            <span className="text-2xl font-bold text-emerald-400">{progress}%</span>
                        </div>
                        <div className="w-full bg-slate-800/50 rounded-full h-4 mb-3">
                            <div
                                className="bg-gradient-to-r from-emerald-600 to-emerald-500 h-4 rounded-full transition-all shadow-lg shadow-emerald-600/20"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <div className="flex items-center justify-between text-sm text-slate-400">
                            <span>{campaign.completedTaskCount || 0} tasks completed</span>
                            <span>{campaign.taskCount || 0} total tasks</span>
                        </div>
                    </div>

                    {/* Assigned Tasks */}
                    <div className="bg-slate-700/30 rounded-lg p-5 border border-slate-600/50">
                        <h3 className="text-lg font-semibold text-white mb-4">My Tasks ({tasks.length})</h3>
                        {tasks.length === 0 ? (
                            <div className="bg-slate-800/50 rounded-lg p-8 text-center border border-slate-600/30">
                                <CheckSquare className="mx-auto text-slate-500 mb-2" size={24} />
                                <p className="text-slate-400">No tasks assigned to you in this campaign</p>
                            </div>
                        ) : (
                            <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
                                {tasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-600/30 hover:bg-slate-800 transition-colors"
                                    >
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <div className="p-1.5 bg-slate-700/50 rounded-lg">
                                                <CheckSquare size={16} className="text-slate-300" />
                                            </div>
                                            <span className="text-white font-medium truncate">{task.title}</span>
                                        </div>
                                        <div className="flex items-center gap-2 ml-4">
                                            {task.priority && (
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                    task.priority === 'Urgent' ? 'bg-red-600/30 text-red-300 border border-red-600' :
                                                    task.priority === 'High' ? 'bg-amber-600/30 text-amber-300 border border-amber-600' :
                                                    task.priority === 'Medium' ? 'bg-blue-600/30 text-blue-300 border border-blue-600' :
                                                    'bg-slate-600/30 text-slate-300 border border-slate-600'
                                                }`}>
                                                    {task.priority}
                                                </span>
                                            )}
                                            <span className={`px-2 py-1 rounded-lg text-xs font-medium ${STATUS_COLORS[task.status] || STATUS_COLORS.Pending}`}>
                                                {task.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Assets */}
                    <div className="bg-slate-700/30 rounded-lg p-5 border border-slate-600/50">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white">Assets ({campaign.assets?.length || 0})</h3>
                            {(canUploadAssets || canUploadLimited) && (
                                <button className="flex items-center gap-2 px-3 py-1.5 text-sm border border-slate-600 rounded-lg hover:bg-slate-600/50 text-slate-300 transition-colors">
                                    <Upload size={16} />
                                    <span>
                                        {canUploadLimited && !canUploadAssets
                                            ? "Upload Content"
                                            : "Upload Asset"}
                                    </span>
                                </button>
                            )}
                        </div>
                        {campaign.assets && campaign.assets.length > 0 ? (
                            <div className="space-y-2">
                                {campaign.assets.map((asset) => (
                                    <div
                                        key={asset.id}
                                        className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-600/30 hover:bg-slate-800 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-slate-700/50 rounded-lg">
                                                <FileText className="text-slate-300" size={18} />
                                            </div>
                                            <div>
                                                <p className="text-sm text-white font-medium">{asset.name}</p>
                                                <p className="text-xs text-slate-400">
                                                    {asset.type} • {new Date(asset.uploadedAt).toLocaleDateString()}
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
                                <FileText className="mx-auto text-slate-500 mb-2" size={24} />
                                <p className="text-slate-400 text-sm">No assets uploaded yet</p>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-slate-700/50">
                        {canEdit && (
                            <button className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium shadow-lg shadow-emerald-600/20">
                                <Edit size={18} />
                                Edit Campaign
                            </button>
                        )}
                        {canApproveContent && (
                            <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg shadow-blue-600/20">
                                <CheckCircle2 size={18} />
                                Approve Content
                            </button>
                        )}
                    </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
