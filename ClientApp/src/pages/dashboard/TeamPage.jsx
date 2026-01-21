import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, User, Mail, Shield, Crown, Phone, X, Save, ChevronDown, ChevronUp } from "lucide-react";
import { teamMembersAPI, authAPI } from "../../services/api";

export default function TeamPage() {
    const [teamMembers, setTeamMembers] = useState([]);
    const [adminUser, setAdminUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        role: "",
        description: "",
        phone: ""
    });
    const [expandedDescriptions, setExpandedDescriptions] = useState(new Set());

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const user = authAPI.getCurrentUser();
            if (user) {
                setAdminUser(user);
            }
            
            const response = await teamMembersAPI.getAll({ pageSize: 1000 });
            setTeamMembers(response.items || []);
        } catch (error) {
            console.error('Error fetching team members:', error);
            alert('Failed to fetch team members. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (member = null) => {
        if (member) {
            setEditingMember(member);
            setFormData({
                firstName: member.firstName || "",
                lastName: member.lastName || "",
                email: member.email || "",
                role: member.role || "",
                description: member.description || "",
                phone: member.phone || ""
            });
        } else {
            setEditingMember(null);
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                role: "",
                description: "",
                phone: ""
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingMember(null);
        setFormData({
            firstName: "",
            lastName: "",
            email: "",
            role: "",
            description: "",
            phone: ""
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingMember) {
                await teamMembersAPI.update(editingMember.id, {
                    ...formData,
                    isActive: editingMember.isActive
                });
            } else {
                await teamMembersAPI.create(formData);
            }
            await fetchData();
            handleCloseModal();
        } catch (error) {
            console.error('Error saving team member:', error);
            alert(error.message || 'Failed to save team member. Please try again.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this team member?')) {
            return;
        }
        try {
            await teamMembersAPI.delete(id);
            await fetchData();
        } catch (error) {
            console.error('Error deleting team member:', error);
            alert('Failed to delete team member. Please try again.');
        }
    };

    const toggleDescription = (memberId) => {
        setExpandedDescriptions(prev => {
            const newExpanded = new Set(prev);
            if (newExpanded.has(memberId)) {
                newExpanded.delete(memberId);
            } else {
                newExpanded.add(memberId);
            }
            return newExpanded;
        });
    };

    const allMembers = adminUser ? [
        {
            id: 'admin',
            firstName: adminUser.firstName || 'Admin',
            lastName: adminUser.lastName || 'User',
            email: adminUser.email,
            role: 'Manager / CEO',
            description: 'Main administrator and manager of the marketing agency',
            phone: adminUser.phoneNumber || '',
            isActive: adminUser.isActive !== false,
            isAdmin: true
        },
        ...teamMembers
    ] : teamMembers;

    const filteredMembers = allMembers.filter(member => {
        const fullName = `${member.firstName} ${member.lastName}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase()) ||
               member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
               member.role.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Team Management</h1>
                    <p className="text-slate-400">Manage team members, roles, and permissions</p>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all flex items-center gap-2"
                >
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
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="text-slate-400">Loading team members...</div>
                </div>
            ) : filteredMembers.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                    No team members found.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMembers.map((member) => (
                        <div 
                            key={member.id} 
                            className={`bg-slate-800/50 backdrop-blur-xl border rounded-2xl p-6 hover:border-slate-600/50 transition-all ${
                                member.isAdmin 
                                    ? 'border-amber-500/50 bg-gradient-to-br from-amber-900/20 to-slate-800/50' 
                                    : 'border-slate-700/50'
                            }`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center border ${
                                        member.isAdmin
                                            ? 'bg-amber-500/20 border-amber-500/30'
                                            : 'bg-emerald-500/20 border-emerald-500/30'
                                    }`}>
                                        {member.isAdmin ? (
                                            <Crown className="text-amber-400" size={32} />
                                        ) : (
                                            <User className="text-emerald-400" size={32} />
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-white font-bold text-lg">
                                                {member.firstName} {member.lastName}
                                            </h3>
                                            {member.isAdmin && (
                                                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded text-xs font-medium">
                                                    Admin
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-slate-400 text-sm">{member.role}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-slate-400 text-sm">
                                    <Mail size={16} />
                                    {member.email}
                                </div>
                                {member.phone && (
                                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                                        <Phone size={16} />
                                        {member.phone}
                                    </div>
                                )}
                                {member.description && (
                                    <div className="mt-2">
                                        <p className={`text-slate-500 text-xs ${
                                            expandedDescriptions.has(member.id) ? '' : 'line-clamp-2'
                                        }`}>
                                            {member.description}
                                        </p>
                                        {member.description.length > 100 && (
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    toggleDescription(member.id);
                                                }}
                                                className="mt-1.5 text-slate-500 hover:text-slate-300 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                                            >
                                                {expandedDescriptions.has(member.id) ? (
                                                    <>
                                                        <ChevronUp size={14} />
                                                        View Less
                                                    </>
                                                ) : (
                                                    <>
                                                        <ChevronDown size={14} />
                                                        View More
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                )}
                                <div className="flex items-center gap-2 pt-2">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                        member.isActive !== false
                                            ? "bg-emerald-500/20 text-emerald-400"
                                            : "bg-slate-500/20 text-slate-400"
                                    }`}>
                                        {member.isActive !== false ? "Active" : "Inactive"}
                                    </span>
                                    {member.assignedTaskCount !== undefined && (
                                        <span className="px-2 py-1 rounded text-xs font-medium bg-blue-500/20 text-blue-400">
                                            {member.assignedTaskCount} Tasks
                                        </span>
                                    )}
                                </div>
                            </div>
                            {!member.isAdmin && (
                                <div className="flex items-center gap-2 pt-4 border-t border-slate-700/50">
                                    <button 
                                        onClick={() => handleOpenModal(member)}
                                        className="flex-1 px-4 py-2 bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-700 transition-all text-sm font-medium flex items-center justify-center gap-2"
                                    >
                                        <Edit size={16} />
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(member.id)}
                                        className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-800 rounded-2xl border border-slate-700/50 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-slate-800 border-b border-slate-700/50 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-white">
                                {editingMember ? "Edit Team Member" : "Add Team Member"}
                            </h2>
                            <button
                                onClick={handleCloseModal}
                                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-slate-300 text-sm font-medium mb-2">
                                        First Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-300 text-sm font-medium mb-2">
                                        Last Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                    />
                                </div>
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
                                    className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-300 text-sm font-medium mb-2">
                                    Role *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    placeholder="e.g., Digital Marketing Specialist"
                                    className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-300 text-sm font-medium mb-2">
                                    Phone
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
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
                                    placeholder="Brief description of responsibilities..."
                                    className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
                                />
                            </div>
                            <div className="flex items-center gap-4 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                                >
                                    <Save size={20} />
                                    {editingMember ? "Update" : "Create"} Team Member
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-6 py-3 bg-slate-700/50 text-slate-300 rounded-xl font-semibold hover:bg-slate-700 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
