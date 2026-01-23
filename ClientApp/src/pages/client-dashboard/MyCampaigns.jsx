import { useState, useEffect } from "react";
import { Search, Filter, ArrowUpDown, X, Calendar, DollarSign, TrendingUp } from "lucide-react";
import { campaignsAPI } from "../../services/api";
import { useOutletContext } from "react-router-dom";

export default function MyCampaigns() {
    const { userInfo } = useOutletContext();
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortBy, setSortBy] = useState("name");
    const [sortOrder, setSortOrder] = useState("asc");
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchCampaigns();
    }, [userInfo]);

    const fetchCampaigns = async () => {
        try {
            setLoading(true);
            // Fetch campaigns for the current client user
            const response = await campaignsAPI.getAll({ pageSize: 1000 });
            // Filter campaigns for the current client (if backend doesn't filter by user)
            const userCampaigns = response.items || [];
            setCampaigns(userCampaigns);
        } catch (error) {
            console.error('Error fetching campaigns:', error);
            alert('Failed to fetch campaigns. Please try again.');
            setCampaigns([]);
        } finally {
            setLoading(false);
        }
    };

    const statusOptions = ["all", "Active", "Completed", "Pending"];

    const filteredCampaigns = campaigns
        .filter(campaign => {
            const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                campaign.type.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === "all" || campaign.status === statusFilter;
            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            let comparison = 0;
            if (sortBy === "budget") {
                comparison = a.budget - b.budget;
            } else if (sortBy === "startDate") {
                comparison = new Date(a.startDate) - new Date(b.startDate);
            } else if (sortBy === "endDate") {
                comparison = new Date(a.endDate) - new Date(b.endDate);
            } else {
                comparison = a.name.localeCompare(b.name);
            }
            return sortOrder === "asc" ? comparison : -comparison;
        });

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(field);
            setSortOrder("asc");
        }
    };

    const openModal = (campaign) => {
        setSelectedCampaign(campaign);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedCampaign(null);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Active":
                return "bg-emerald-500/20 text-emerald-400";
            case "Completed":
                return "bg-blue-500/20 text-blue-400";
            case "Pending":
                return "bg-amber-500/20 text-amber-400";
            default:
                return "bg-slate-500/20 text-slate-400";
        }
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
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">My Campaigns</h1>
                <p className="text-slate-400">View and manage all your marketing campaigns</p>
            </div>

            {/* Search and Filters */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search campaigns by name or type..."
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

            {/* Campaigns Table */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-700/30">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Type</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Status</th>
                                <th 
                                    className="px-6 py-4 text-left text-sm font-semibold text-slate-300 cursor-pointer hover:text-white transition-colors"
                                    onClick={() => handleSort("budget")}
                                >
                                    <div className="flex items-center gap-2">
                                        Budget
                                        <ArrowUpDown size={16} />
                                    </div>
                                </th>
                                <th 
                                    className="px-6 py-4 text-left text-sm font-semibold text-slate-300 cursor-pointer hover:text-white transition-colors"
                                    onClick={() => handleSort("startDate")}
                                >
                                    <div className="flex items-center gap-2">
                                        Start Date
                                        <ArrowUpDown size={16} />
                                    </div>
                                </th>
                                <th 
                                    className="px-6 py-4 text-left text-sm font-semibold text-slate-300 cursor-pointer hover:text-white transition-colors"
                                    onClick={() => handleSort("endDate")}
                                >
                                    <div className="flex items-center gap-2">
                                        End Date
                                        <ArrowUpDown size={16} />
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50">
                            {filteredCampaigns.map((campaign) => (
                                <tr 
                                    key={campaign.id} 
                                    className="hover:bg-slate-700/20 transition-colors cursor-pointer"
                                    onClick={() => openModal(campaign)}
                                >
                                    <td className="px-6 py-4">
                                        <span className="text-white font-medium">Package: {campaign.serviceName || campaign.type || "N/A"}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                                            {campaign.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-white font-semibold">${(campaign.budget || 0).toLocaleString()}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-slate-300">{campaign.startDate ? new Date(campaign.startDate).toLocaleDateString() : "N/A"}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-slate-300">{campaign.endDate ? new Date(campaign.endDate).toLocaleDateString() : "N/A"}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openModal(campaign);
                                                }}
                                                className="px-4 py-2 bg-emerald-600/20 text-emerald-400 rounded-lg hover:bg-emerald-600/30 transition-all text-sm font-medium"
                                            >
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

            {/* Campaign Detail Modal */}
            {showModal && selectedCampaign && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-800 border border-slate-700/50 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-slate-800 border-b border-slate-700/50 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-white">{selectedCampaign.name}</h2>
                            <button
                                onClick={closeModal}
                                className="text-slate-400 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <h3 className="text-sm font-semibold text-slate-400 mb-2">Description</h3>
                                <p className="text-white">{selectedCampaign.description || "No description provided"}</p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-400 mb-2">Start Date</h3>
                                    <div className="flex items-center gap-2 text-white">
                                        <Calendar size={18} className="text-emerald-400" />
                                        <span>{selectedCampaign.startDate ? new Date(selectedCampaign.startDate).toLocaleDateString() : "N/A"}</span>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-400 mb-2">End Date</h3>
                                    <div className="flex items-center gap-2 text-white">
                                        <Calendar size={18} className="text-emerald-400" />
                                        <span>{selectedCampaign.endDate ? new Date(selectedCampaign.endDate).toLocaleDateString() : "N/A"}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-6 pt-4 border-t border-slate-700/50">
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-400 mb-2">Total Budget</h3>
                                    <div className="flex items-center gap-2">
                                        <DollarSign size={18} className="text-emerald-400" />
                                        <span className="text-2xl font-bold text-white">${(selectedCampaign.budget || 0).toLocaleString()}</span>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-400 mb-2">Spent So Far</h3>
                                    <div className="flex items-center gap-2">
                                        <TrendingUp size={18} className="text-amber-400" />
                                        <span className="text-2xl font-bold text-white">${((selectedCampaign.spent || 0)).toLocaleString()}</span>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-400 mb-2">Remaining Budget</h3>
                                    <div className="flex items-center gap-2">
                                        <DollarSign size={18} className="text-blue-400" />
                                        <span className="text-2xl font-bold text-white">${((selectedCampaign.budget || 0) - (selectedCampaign.spent || 0)).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {selectedCampaign.budget > 0 && (
                                <div className="pt-4 border-t border-slate-700/50">
                                    <div className="w-full bg-slate-700/50 rounded-full h-3 mb-2">
                                        <div
                                            className="h-3 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                                            style={{ width: `${((selectedCampaign.spent || 0) / selectedCampaign.budget) * 100}%` }}
                                        />
                                    </div>
                                    <p className="text-sm text-slate-400 text-center">
                                        {(((selectedCampaign.spent || 0) / selectedCampaign.budget) * 100).toFixed(1)}% of budget used
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
