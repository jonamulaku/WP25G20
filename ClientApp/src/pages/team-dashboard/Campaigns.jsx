import { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import {
    Megaphone,
    Calendar,
    DollarSign,
    Users,
    CheckSquare,
    FileText,
    Edit,
    Upload,
    CheckCircle2,
    Eye,
    TrendingUp
} from "lucide-react";
import { campaignsAPI, tasksAPI } from "../../services/api";
import { generateMockCampaigns, generateMockTasks } from "../../services/mockData";

const STATUS_COLORS = {
    Pending: "bg-slate-100 text-slate-700",
    Active: "bg-emerald-100 text-emerald-700",
    Paused: "bg-amber-100 text-amber-700",
    Completed: "bg-blue-100 text-blue-700",
    Cancelled: "bg-red-100 text-red-700"
};

export default function Campaigns() {
    const { userInfo, teamMemberInfo } = useOutletContext();
    const [campaigns, setCampaigns] = useState([]);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [showDetail, setShowDetail] = useState(false);
    const [campaignTasks, setCampaignTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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
            // TODO: Replace with real API call when backend is ready
            // const response = await campaignsAPI.getAll();
            // const allCampaigns = response.items || [];
            // const userCampaigns = allCampaigns.filter(campaign => 
            //     campaign.assignedUserIds?.includes(userInfo.id)
            // );
            
            // Use mock data for now
            const userCampaigns = generateMockCampaigns(userInfo.id);
            setCampaigns(userCampaigns);
        } catch (error) {
            console.error("Error fetching campaigns:", error);
            // Fallback to mock data
            const userCampaigns = generateMockCampaigns(userInfo.id);
            setCampaigns(userCampaigns);
        } finally {
            setLoading(false);
        }
    };

    const handleViewCampaign = async (campaignId) => {
        try {
            // TODO: Replace with real API calls when backend is ready
            // const campaign = await campaignsAPI.getById(campaignId);
            // const tasksResponse = await tasksAPI.getAll();
            
            // Use mock data for now
            const campaign = campaigns.find(c => c.id === campaignId) || campaigns[0];
            const mockTasks = generateMockTasks(userInfo.id, teamMemberInfo?.role);
            const campaignTasks = mockTasks.filter(t => t.campaignId === campaignId);
            
            // Enhance campaign with KPIs and assets
            const enhancedCampaign = {
                ...campaign,
                kpis: {
                    engagementRate: 12.5 + Math.random() * 5,
                    clickThroughRate: 3.2 + Math.random() * 2,
                    conversionRate: 2.8 + Math.random() * 1.5,
                    roi: 250 + Math.random() * 100
                },
                assets: Array.from({ length: Math.floor(Math.random() * 5) + 2 }, (_, i) => ({
                    id: `asset-${campaign.id}-${i}`,
                    name: `Campaign Asset ${i + 1}.${i % 2 === 0 ? 'jpg' : 'pdf'}`,
                    type: i % 2 === 0 ? 'image' : 'document',
                    uploadedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString()
                }))
            };
            
            setSelectedCampaign(enhancedCampaign);
            setCampaignTasks(campaignTasks);
            setShowDetail(true);
        } catch (error) {
            console.error("Error fetching campaign details:", error);
        }
    };

    const calculateProgress = (campaign) => {
        if (campaign.taskCount === 0) return 0;
        return Math.round((campaign.completedTaskCount / campaign.taskCount) * 100);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-slate-400">Loading campaigns...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-white">Campaigns</h1>
                <p className="text-slate-400 mt-1">View and manage your assigned campaigns</p>
            </div>

            {/* Campaigns List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {campaigns.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-slate-400">
                        No campaigns assigned
                    </div>
                ) : (
                    campaigns.map((campaign) => {
                        const progress = calculateProgress(campaign);
                        return (
                            <div
                                key={campaign.id}
                                className="bg-slate-800/50 rounded-xl shadow-sm border border-slate-700/50 p-6 hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => handleViewCampaign(campaign.id)}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-white mb-1">
                                            {campaign.name}
                                        </h3>
                                        <p className="text-sm text-slate-300 line-clamp-2">
                                            {campaign.description || "No description"}
                                        </p>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[campaign.status] || STATUS_COLORS.Pending}`}>
                                        {campaign.status}
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm text-slate-300">
                                        <Calendar size={16} />
                                        <span>
                                            {new Date(campaign.startDate).toLocaleDateString()} -{" "}
                                            {campaign.endDate
                                                ? new Date(campaign.endDate).toLocaleDateString()
                                                : "Ongoing"}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-slate-300">
                                        <DollarSign size={16} />
                                        <span>${campaign.budget?.toLocaleString()}</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-slate-300">
                                        <CheckSquare size={16} />
                                        <span>
                                            {campaign.completedTaskCount || 0} / {campaign.taskCount || 0} tasks
                                        </span>
                                    </div>

                                    {/* Progress Bar */}
                                    <div>
                                        <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                                            <span>Progress</span>
                                            <span>{progress}%</span>
                                        </div>
                                        <div className="w-full bg-slate-200 rounded-full h-2">
                                            <div
                                                className="bg-emerald-600 h-2 rounded-full transition-all"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleViewCampaign(campaign.id);
                                    }}
                                    className="mt-4 w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Eye size={16} />
                                    View Details
                                </button>
                            </div>
                        );
                    })
                )}
            </div>

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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-slate-800 border-b border-slate-700/50 p-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white">{campaign.name}</h2>
                        <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[campaign.status] || STATUS_COLORS.Pending}`}>
                            {campaign.status}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600"
                    >
                        <span className="text-2xl">&times;</span>
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Campaign Goal */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-2">Campaign Goal</h3>
                        <p className="text-slate-300">{campaign.description || "No description provided"}</p>
                    </div>

                    {/* Timeline */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-2">Timeline</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-slate-400">Start Date</label>
                                <p className="text-white mt-1">
                                    {new Date(campaign.startDate).toLocaleDateString()}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-400">End Date</label>
                                <p className="text-white mt-1">
                                    {campaign.endDate
                                        ? new Date(campaign.endDate).toLocaleDateString()
                                        : "Ongoing"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* KPIs */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Key Performance Indicators</h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-slate-700/30 rounded-lg p-4">
                                <div className="text-sm text-slate-400">Budget</div>
                                <div className="text-2xl font-bold text-white mt-1">
                                    ${campaign.budget?.toLocaleString()}
                                </div>
                            </div>
                            <div className="bg-slate-700/30 rounded-lg p-4">
                                <div className="text-sm text-slate-400">Tasks</div>
                                <div className="text-2xl font-bold text-white mt-1">
                                    {campaign.taskCount || 0}
                                </div>
                            </div>
                            <div className="bg-slate-700/30 rounded-lg p-4">
                                <div className="text-sm text-slate-400">Completed</div>
                                <div className="text-2xl font-bold text-white mt-1">
                                    {campaign.completedTaskCount || 0}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-2">Progress</h3>
                        <div className="flex items-center justify-between text-sm text-slate-300 mb-2">
                            <span>Overall Completion</span>
                            <span>{progress}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-3">
                            <div
                                className="bg-emerald-600 h-3 rounded-full transition-all"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    {/* Assigned Tasks */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">My Tasks</h3>
                        {tasks.length === 0 ? (
                            <p className="text-slate-400">No tasks assigned to you in this campaign</p>
                        ) : (
                            <div className="space-y-2">
                                {tasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg"
                                    >
                                        <div className="flex items-center gap-3">
                                            <CheckSquare size={18} className="text-slate-400" />
                                            <span className="text-white">{task.title}</span>
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[task.status] || STATUS_COLORS.Pending}`}>
                                            {task.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Assets */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Assets</h3>
                        <div className="space-y-2">
                            {(canUploadAssets || canUploadLimited) && (
                                <button className="flex items-center gap-2 px-4 py-2 border border-slate-600 rounded-lg hover:bg-slate-700/50 text-slate-300">
                                    <Upload size={18} />
                                    <span>
                                        {canUploadLimited && !canUploadAssets
                                            ? "Upload Content (Limited)"
                                            : "Upload Asset"}
                                    </span>
                                </button>
                            )}
                            <p className="text-sm text-slate-400">Assets would be listed here</p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-slate-700/50">
                        {canEdit && (
                            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                                <Edit size={18} />
                                Edit Campaign
                            </button>
                        )}
                        {canApproveContent && (
                            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                <CheckCircle2 size={18} />
                                Approve Content
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
