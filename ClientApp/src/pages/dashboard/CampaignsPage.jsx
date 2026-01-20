import { useState } from "react";
import { Plus, Search, Edit, Trash2, Eye, TrendingUp, Calendar } from "lucide-react";

export default function CampaignsPage() {
    const [campaigns, setCampaigns] = useState([
        { id: 1, name: "Q1 Social Media", client: "Tech Corp", budget: 15000, status: "Active", startDate: "2025-01-01", endDate: "2025-03-31" },
        { id: 2, name: "Brand Awareness", client: "Design Studio", budget: 25000, status: "Active", startDate: "2025-02-01", endDate: "2025-04-30" },
        { id: 3, name: "Product Launch", client: "Marketing Pro", budget: 35000, status: "Completed", startDate: "2024-12-01", endDate: "2024-12-31" },
    ]);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredCampaigns = campaigns.filter(campaign =>
        campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.client.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Campaign Management</h1>
                    <p className="text-slate-400">Create and manage marketing campaigns for your clients</p>
                </div>
                <button className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all flex items-center gap-2">
                    <Plus size={20} />
                    Create Campaign
                </button>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCampaigns.map((campaign) => (
                    <div key={campaign.id} className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600/50 transition-all">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-white font-bold text-lg mb-1">{campaign.name}</h3>
                                <p className="text-slate-400 text-sm">{campaign.client}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                campaign.status === "Active"
                                    ? "bg-emerald-500/20 text-emerald-400"
                                    : campaign.status === "Completed"
                                    ? "bg-blue-500/20 text-blue-400"
                                    : "bg-amber-500/20 text-amber-400"
                            }`}>
                                {campaign.status}
                            </span>
                        </div>
                        <div className="space-y-3 mb-4">
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400 text-sm">Budget</span>
                                <span className="text-white font-semibold">${campaign.budget.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-400 text-sm">
                                <Calendar size={16} />
                                <span>{campaign.startDate} - {campaign.endDate}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 pt-4 border-t border-slate-700/50">
                            <button className="flex-1 px-4 py-2 bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-700 transition-all text-sm font-medium flex items-center justify-center gap-2">
                                <Eye size={16} />
                                View
                            </button>
                            <button className="px-4 py-2 bg-emerald-600/20 text-emerald-400 rounded-lg hover:bg-emerald-600/30 transition-all">
                                <Edit size={16} />
                            </button>
                            <button className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-all">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
