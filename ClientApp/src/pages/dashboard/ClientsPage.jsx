import { useState } from "react";
import { Plus, Search, Edit, Trash2, Eye, Mail, Phone, Building2 } from "lucide-react";

export default function ClientsPage() {
    const [clients, setClients] = useState([
        { id: 1, name: "Tech Corp", email: "contact@techcorp.com", phone: "+1 234-567-8900", status: "Active", campaigns: 5 },
        { id: 2, name: "Design Studio", email: "hello@designstudio.com", phone: "+1 234-567-8901", status: "Active", campaigns: 3 },
        { id: 3, name: "Marketing Pro", email: "info@marketingpro.com", phone: "+1 234-567-8902", status: "Inactive", campaigns: 2 },
    ]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);

    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Client Management</h1>
                    <p className="text-slate-400">Manage your agency's clients and their information</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all flex items-center gap-2"
                >
                    <Plus size={20} />
                    Add New Client
                </button>
            </div>

            {/* Search and Filters */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-center gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search clients..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                        />
                    </div>
                    <select className="px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>

            {/* Clients Table */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-700/30">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Client Name</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Contact</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Campaigns</th>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50">
                            {filteredClients.map((client) => (
                                <tr key={client.id} className="hover:bg-slate-700/20 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                                <Building2 className="text-emerald-400" size={20} />
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">{client.name}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-slate-300 text-sm">
                                                <Mail size={14} />
                                                {client.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-400 text-sm">
                                                <Phone size={14} />
                                                {client.phone}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            client.status === "Active"
                                                ? "bg-emerald-500/20 text-emerald-400"
                                                : "bg-slate-500/20 text-slate-400"
                                        }`}>
                                            {client.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-white font-medium">{client.campaigns}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700/50 rounded-lg transition-all">
                                                <Eye size={18} />
                                            </button>
                                            <button className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-700/50 rounded-lg transition-all">
                                                <Edit size={18} />
                                            </button>
                                            <button className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700/50 rounded-lg transition-all">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
