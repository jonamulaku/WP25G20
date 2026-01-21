import { useState } from "react";
import { Search, Filter, CheckCircle2, XCircle, MessageSquare, Clock, History, Eye, Send, Image, Video, FileText } from "lucide-react";

export default function Approvals() {
    const [approvals, setApprovals] = useState([
        { 
            id: 1, 
            item: "Social Media Post - Instagram", 
            campaign: "Q1 Social Media Campaign", 
            type: "Image", 
            status: "Pending", 
            due: "2025-01-20",
            preview: { type: "image", url: "https://via.placeholder.com/400x400" },
            explanation: "This Instagram post introduces our new product line with vibrant visuals and compelling copy.",
            ctaDescription: "Click to learn more about our new products",
            platformSpecs: "1080x1080px, JPEG/PNG, Max 8MB",
            history: [
                { action: "Created", user: "Agency Team", timestamp: "2025-01-15T10:00:00", comment: "Initial submission for review" }
            ]
        },
        { 
            id: 2, 
            item: "Video Ad - YouTube", 
            campaign: "Brand Awareness Campaign", 
            type: "Video", 
            status: "Pending", 
            due: "2025-01-22",
            preview: { type: "video", url: "https://via.placeholder.com/400x225" },
            explanation: "YouTube video ad showcasing our brand story and values.",
            ctaDescription: "Visit our website",
            platformSpecs: "1920x1080px, MP4, 30 seconds max",
            history: []
        },
        { 
            id: 3, 
            item: "Email Template", 
            campaign: "Email Marketing Drive", 
            type: "Email", 
            status: "Approved", 
            due: "2025-01-18",
            preview: { type: "text", content: "Email preview content here..." },
            explanation: "Monthly newsletter template for our subscribers.",
            ctaDescription: "Subscribe to our newsletter",
            platformSpecs: "600px width, HTML, Responsive design",
            history: [
                { action: "Created", user: "Agency Team", timestamp: "2025-01-10T14:00:00", comment: "Initial submission" },
                { action: "Approved", user: "Client", timestamp: "2025-01-12T09:00:00", comment: "Looks great!" }
            ]
        },
        { 
            id: 4, 
            item: "Facebook Ad Creative", 
            campaign: "Q1 Social Media Campaign", 
            type: "Image", 
            status: "Changes Requested", 
            due: "2025-01-21",
            preview: { type: "image", url: "https://via.placeholder.com/400x400" },
            explanation: "Facebook ad creative for product promotion.",
            ctaDescription: "Shop Now",
            platformSpecs: "1200x628px, JPEG/PNG, Max 8MB",
            history: [
                { action: "Created", user: "Agency Team", timestamp: "2025-01-14T11:00:00", comment: "Initial submission" },
                { action: "Changes Requested", user: "Client", timestamp: "2025-01-16T15:00:00", comment: "Please adjust colors to match brand guidelines" },
                { action: "Updated", user: "Agency Team", timestamp: "2025-01-17T10:00:00", comment: "Colors updated per feedback" }
            ]
        }
    ]);

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedApproval, setSelectedApproval] = useState(null);
    const [showDetail, setShowDetail] = useState(false);
    const [comment, setComment] = useState("");
    const [showHistory, setShowHistory] = useState(false);

    const statusOptions = ["all", "Pending", "Approved", "Changes Requested", "Rejected"];

    const filteredApprovals = approvals.filter(approval => {
        const matchesSearch = approval.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
            approval.campaign.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || approval.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case "Approved":
                return "bg-emerald-500/20 text-emerald-400";
            case "Pending":
                return "bg-amber-500/20 text-amber-400";
            case "Changes Requested":
                return "bg-blue-500/20 text-blue-400";
            case "Rejected":
                return "bg-red-500/20 text-red-400";
            default:
                return "bg-slate-500/20 text-slate-400";
        }
    };

    const openDetail = (approval) => {
        setSelectedApproval(approval);
        setShowDetail(true);
        setShowHistory(false);
    };

    const closeDetail = () => {
        setShowDetail(false);
        setSelectedApproval(null);
        setComment("");
    };

    const handleAction = (action, approvalId) => {
        // TODO: Implement API call to update approval status
        const updatedApprovals = approvals.map(approval => {
            if (approval.id === approvalId) {
                const newHistory = [...approval.history, {
                    action: action,
                    user: "Client",
                    timestamp: new Date().toISOString(),
                    comment: comment || `${action} by client`
                }];
                return { ...approval, status: action === "Approved" ? "Approved" : action === "Rejected" ? "Rejected" : "Changes Requested", history: newHistory };
            }
            return approval;
        });
        setApprovals(updatedApprovals);
        setComment("");
        setShowDetail(false);
        setSelectedApproval(null);
    };

    const getPreviewIcon = (type) => {
        switch (type) {
            case "image":
            case "Image":
                return <Image size={24} className="text-blue-400" />;
            case "video":
            case "Video":
                return <Video size={24} className="text-red-400" />;
            default:
                return <FileText size={24} className="text-emerald-400" />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Approvals</h1>
                <p className="text-slate-400">Review and approve campaign materials</p>
            </div>

            {/* Search and Filters */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search approvals..."
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
                            {statusOptions.map(status => (
                                <option key={status} value={status}>
                                    {status === "all" ? "All Status" : status}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Approvals Table */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-700/30">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Item</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Campaign</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Type</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Due</th>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50">
                            {filteredApprovals.map((approval) => (
                                <tr key={approval.id} className="hover:bg-slate-700/20 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {getPreviewIcon(approval.type)}
                                            <span className="text-white font-medium">{approval.item}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-slate-300">{approval.campaign}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-slate-300">{approval.type}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(approval.status)}`}>
                                            {approval.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-slate-300">
                                            <Clock size={14} />
                                            <span>{new Date(approval.due).toLocaleDateString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end">
                                            <button
                                                onClick={() => openDetail(approval)}
                                                className="px-4 py-2 bg-emerald-600/20 text-emerald-400 rounded-lg hover:bg-emerald-600/30 transition-all text-sm font-medium flex items-center gap-2"
                                            >
                                                <Eye size={16} />
                                                View Details
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Approval Detail View Modal */}
            {showDetail && selectedApproval && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-800 border border-slate-700/50 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-slate-800 border-b border-slate-700/50 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-white">{selectedApproval.item}</h2>
                            <button
                                onClick={closeDetail}
                                className="text-slate-400 hover:text-white transition-colors"
                            >
                                <XCircle size={24} />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Preview Section */}
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-4">Preview</h3>
                                <div className="bg-slate-900/50 rounded-xl p-6 flex items-center justify-center min-h-[300px]">
                                    {selectedApproval.preview.type === "image" && (
                                        <img src={selectedApproval.preview.url} alt="Preview" className="max-w-full max-h-[400px] rounded-lg" />
                                    )}
                                    {selectedApproval.preview.type === "video" && (
                                        <div className="w-full aspect-video bg-slate-700/50 rounded-lg flex items-center justify-center">
                                            <Video size={48} className="text-slate-400" />
                                            <span className="ml-2 text-slate-400">Video Preview</span>
                                        </div>
                                    )}
                                    {selectedApproval.preview.type === "text" && (
                                        <div className="w-full bg-white text-slate-900 p-8 rounded-lg">
                                            <p>{selectedApproval.preview.content}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Details Section */}
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-400 mb-2">Campaign</h3>
                                    <p className="text-white">{selectedApproval.campaign}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-400 mb-2">Type</h3>
                                    <p className="text-white">{selectedApproval.type}</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-slate-400 mb-2">Explanation from Agency</h3>
                                <p className="text-white">{selectedApproval.explanation}</p>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-slate-400 mb-2">CTA Description</h3>
                                <p className="text-white">{selectedApproval.ctaDescription}</p>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-slate-400 mb-2">Platform Specifications</h3>
                                <p className="text-white">{selectedApproval.platformSpecs}</p>
                            </div>

                            {/* Comment Section */}
                            <div>
                                <h3 className="text-sm font-semibold text-slate-400 mb-2">Add Comment</h3>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Add your comment or feedback..."
                                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 min-h-[100px]"
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-4 pt-4 border-t border-slate-700/50">
                                <button
                                    onClick={() => handleAction("Approved", selectedApproval.id)}
                                    className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                                >
                                    <CheckCircle2 size={20} />
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleAction("Changes Requested", selectedApproval.id)}
                                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                                >
                                    <MessageSquare size={20} />
                                    Request Changes
                                </button>
                                <button
                                    onClick={() => handleAction("Rejected", selectedApproval.id)}
                                    className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                                >
                                    <XCircle size={20} />
                                    Reject
                                </button>
                            </div>

                            {/* Approval History */}
                            <div className="pt-4 border-t border-slate-700/50">
                                <button
                                    onClick={() => setShowHistory(!showHistory)}
                                    className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors mb-4"
                                >
                                    <History size={20} />
                                    <span className="font-medium">View Approval History ({selectedApproval.history.length})</span>
                                </button>
                                {showHistory && (
                                    <div className="space-y-3">
                                        {selectedApproval.history.map((entry, index) => (
                                            <div key={index} className="bg-slate-700/30 rounded-xl p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-white font-medium">{entry.action}</span>
                                                    <span className="text-slate-400 text-sm">
                                                        {new Date(entry.timestamp).toLocaleString()}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-slate-400 text-sm">By:</span>
                                                    <span className="text-slate-300 text-sm">{entry.user}</span>
                                                </div>
                                                {entry.comment && (
                                                    <p className="text-slate-300 text-sm mt-2">{entry.comment}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
