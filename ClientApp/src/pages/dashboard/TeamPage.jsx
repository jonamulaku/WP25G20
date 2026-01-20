import { useState } from "react";
import { Plus, Search, Edit, Trash2, User, Mail, Shield } from "lucide-react";

export default function TeamPage() {
    const [teamMembers, setTeamMembers] = useState([
        { id: 1, name: "John Doe", email: "john@agency.com", role: "Designer", status: "Active" },
        { id: 2, name: "Jane Smith", email: "jane@agency.com", role: "Social Media Manager", status: "Active" },
        { id: 3, name: "Mike Johnson", email: "mike@agency.com", role: "Analyst", status: "Active" },
        { id: 4, name: "Sarah Wilson", email: "sarah@agency.com", role: "Project Manager", status: "Active" },
    ]);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredMembers = teamMembers.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Team Management</h1>
                    <p className="text-slate-400">Manage team members, roles, and permissions</p>
                </div>
                <button className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all flex items-center gap-2">
                    <Plus size={20} />
                    Add Team Member
                </button>
            </div>

            {/* Search */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search team members..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                </div>
            </div>

            {/* Team Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMembers.map((member) => (
                    <div key={member.id} className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600/50 transition-all">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                                    <User className="text-emerald-400" size={32} />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-lg">{member.name}</h3>
                                    <p className="text-slate-400 text-sm">{member.role}</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-slate-400 text-sm">
                                <Mail size={16} />
                                {member.email}
                            </div>
                            <div className="flex items-center gap-2 text-slate-400 text-sm">
                                <Shield size={16} />
                                {member.role}
                            </div>
                        </div>
                        <div className="flex items-center gap-2 pt-4 border-t border-slate-700/50">
                            <button className="flex-1 px-4 py-2 bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-700 transition-all text-sm font-medium flex items-center justify-center gap-2">
                                <Edit size={16} />
                                Edit
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
