import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, Eye, Mail, Phone, Building2, X, Save } from "lucide-react";
import { clientsAPI } from "../../services/api";

export default function ClientsPage() {
    const [clients, setClients] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [showModal, setShowModal] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        companyName: "",
        contactPerson: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        notes: "",
        isActive: true
    });

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            setLoading(true);
            const response = await clientsAPI.getAll({ pageSize: 1000 });
            setClients(response.items || []);
        } catch (error) {
            console.error('Error fetching clients:', error);
            alert('Failed to fetch clients. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (client = null) => {
        if (client) {
            setEditingClient(client);
            setFormData({
                companyName: client.companyName || "",
                contactPerson: client.contactPerson || "",
                email: client.email || "",
                password: "", // Don't show password when editing
                phone: client.phone || "",
                address: client.address || "",
                notes: client.notes || "",
                isActive: client.isActive !== undefined ? client.isActive : true
            });
        } else {
            setEditingClient(null);
            setFormData({
                companyName: "",
                contactPerson: "",
                email: "",
                password: "",
                phone: "",
                address: "",
                notes: "",
                isActive: true
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingClient(null);
        setFormData({
            companyName: "",
            contactPerson: "",
            email: "",
            password: "",
            phone: "",
            address: "",
            notes: "",
            isActive: true
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingClient) {
                // Don't send password when updating
                const updateData = { ...formData };
                delete updateData.password;
                await clientsAPI.update(editingClient.id, updateData);
            } else {
                // Password is required for creating new clients
                if (!formData.password || formData.password.length < 6) {
                    alert('Password is required and must be at least 6 characters long.');
                    return;
                }
                await clientsAPI.create(formData);
            }
            await fetchClients();
            handleCloseModal();
        } catch (error) {
            console.error('Error saving client:', error);
            alert(error.message || 'Failed to save client. Please try again.');
        }
    };

    const handleToggleStatus = async (client) => {
        try {
            await clientsAPI.update(client.id, {
                companyName: client.companyName,
                contactPerson: client.contactPerson,
                email: client.email,
                phone: client.phone,
                address: client.address,
                notes: client.notes,
                isActive: !client.isActive
            });
            await fetchClients();
        } catch (error) {
            console.error('Error updating client status:', error);
            alert(error.message || 'Failed to update client status. Please try again.');
        }
    };

    const handleDelete = async (id) => {
        // Clients with id = 0 don't have a Client entity, so they can't be deleted
        if (id === 0) {
            alert('This client does not have a Client entity yet. Please update the client first to create the entity, then you can delete it.');
            return;
        }
        
        if (!window.confirm('Are you sure you want to delete this client?')) {
            return;
        }
        try {
            await clientsAPI.delete(id);
            await fetchClients();
        } catch (error) {
            console.error('Error deleting client:', error);
            // Surface backend reason if available (e.g. permissions)
            alert(error.message || 'Failed to delete client. Please try again.');
        }
    };

    const filteredClients = clients.filter(client => {
        const matchesSearch = 
            client.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === "all" || 
            (statusFilter === "active" && client.isActive) ||
            (statusFilter === "inactive" && !client.isActive);
        
        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-slate-400">Loading clients...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Client Management</h1>
                    <p className="text-slate-400">Manage your agency's clients and their information</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
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
                    <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    >
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
                            {filteredClients.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                                        No clients found
                                    </td>
                                </tr>
                            ) : (
                                filteredClients.map((client) => (
                                    <tr key={client.id} className="hover:bg-slate-700/20 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                                    <Building2 className="text-emerald-400" size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium">{client.companyName}</p>
                                                    {client.contactPerson && (
                                                        <p className="text-slate-400 text-sm">{client.contactPerson}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-slate-300 text-sm">
                                                    <Mail size={14} />
                                                    {client.email}
                                                </div>
                                                {client.phone && (
                                                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                                                        <Phone size={14} />
                                                        {client.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleToggleStatus(client)}
                                                className={`px-3 py-1 rounded-full text-xs font-medium transition-all hover:opacity-80 cursor-pointer ${
                                                    client.isActive
                                                        ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                                                        : "bg-slate-500/20 text-slate-400 hover:bg-slate-500/30"
                                                }`}
                                                title={`Click to mark as ${client.isActive ? "Inactive" : "Active"}`}
                                            >
                                                {client.isActive ? "Active" : "Inactive"}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-white font-medium">{client.campaignCount || 0}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    onClick={() => handleOpenModal(client)}
                                                    className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-700/50 rounded-lg transition-all"
                                                    title="Edit"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(client.id)}
                                                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700/50 rounded-lg transition-all"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-800 rounded-2xl border border-slate-700/50 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-slate-800 border-b border-slate-700/50 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-white">
                                {editingClient ? "Edit Client" : "Add New Client"}
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
                                    Company Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.companyName}
                                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-300 text-sm font-medium mb-2">
                                    Contact Person
                                </label>
                                <input
                                    type="text"
                                    value={formData.contactPerson}
                                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-300 text-sm font-medium mb-2">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                />
                            </div>
                            {!editingClient && (
                                <div>
                                    <label className="block text-slate-300 text-sm font-medium mb-2">
                                        Password *
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                        placeholder="Minimum 6 characters"
                                        minLength={6}
                                    />
                                    <p className="text-slate-400 text-xs mt-1">Password must be at least 6 characters long</p>
                                </div>
                            )}
                            <div>
                                <label className="block text-slate-300 text-sm font-medium mb-2">
                                    Phone
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-300 text-sm font-medium mb-2">
                                    Address
                                </label>
                                <textarea
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    rows={2}
                                    className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                />
                            </div>
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
                            {editingClient && (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="isActive"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                        className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-emerald-600 focus:ring-emerald-500"
                                    />
                                    <label htmlFor="isActive" className="text-slate-300 text-sm">
                                        Active
                                    </label>
                                </div>
                            )}
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
                                    {editingClient ? "Update" : "Create"} Client
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
