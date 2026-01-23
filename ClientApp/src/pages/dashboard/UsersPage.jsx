import { useState, useEffect } from "react";
import { Search, Edit, Trash2, User, Mail, Shield, X, Save, CheckCircle2, XCircle } from "lucide-react";
import { usersAPI } from "../../services/api";

const AVAILABLE_ROLES = ["Admin", "Client", "Team", "User"];

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        email: "",
        firstName: "",
        lastName: "",
        isActive: true,
        roles: []
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await usersAPI.getAll({ pageSize: 1000 });
            setUsers(response.items || []);
        } catch (error) {
            console.error('Error fetching users:', error);
            alert('Failed to fetch users. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (user = null) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                email: user.email || "",
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                isActive: user.isActive !== undefined ? user.isActive : true,
                roles: user.roles || []
            });
        } else {
            setEditingUser(null);
            setFormData({
                email: "",
                firstName: "",
                lastName: "",
                isActive: true,
                roles: []
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingUser(null);
        setFormData({
            email: "",
            firstName: "",
            lastName: "",
            isActive: true,
            roles: []
        });
    };

    const handleRoleToggle = (role) => {
        setFormData(prev => {
            const currentRoles = prev.roles || [];
            if (currentRoles.includes(role)) {
                return { ...prev, roles: currentRoles.filter(r => r !== role) };
            } else {
                return { ...prev, roles: [...currentRoles, role] };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingUser) {
                await usersAPI.update(editingUser.id, {
                    email: formData.email,
                    firstName: formData.firstName || null,
                    lastName: formData.lastName || null,
                    isActive: formData.isActive,
                    roles: formData.roles
                });
            }
            await fetchUsers();
            handleCloseModal();
        } catch (error) {
            console.error('Error saving user:', error);
            alert(error.message || 'Failed to save user. Please try again.');
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            return;
        }

        try {
            await usersAPI.delete(userId);
            await fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            alert(error.message || 'Failed to delete user. Please try again.');
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = 
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastName?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesRole = roleFilter === "all" || (user.roles && user.roles.includes(roleFilter));
        
        return matchesSearch && matchesRole;
    });

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case "Admin":
                return "bg-purple-500/20 text-purple-300 border-purple-500/30";
            case "Client":
                return "bg-blue-500/20 text-blue-300 border-blue-500/30";
            case "Team":
                return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
            case "User":
                return "bg-slate-500/20 text-slate-300 border-slate-500/30";
            default:
                return "bg-slate-500/20 text-slate-300 border-slate-500/30";
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-white text-lg">Loading users...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
                    <p className="text-slate-400">Manage system users and their roles</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
                    />
                </div>
                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
                >
                    <option value="all">All Roles</option>
                    {AVAILABLE_ROLES.map(role => (
                        <option key={role} value={role}>{role}</option>
                    ))}
                </select>
            </div>

            {/* Users Table */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-900/50 border-b border-slate-700/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">User</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Email</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Roles</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Created</th>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                                        {searchTerm || roleFilter !== "all" 
                                            ? "No users found matching your filters." 
                                            : "No users found."}
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-700/20 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-emerald-600/20 flex items-center justify-center">
                                                    <User className="text-emerald-400" size={20} />
                                                </div>
                                                <div>
                                                    <div className="text-white font-medium">
                                                        {user.firstName && user.lastName
                                                            ? `${user.firstName} ${user.lastName}`
                                                            : user.email}
                                                    </div>
                                                    {user.firstName && user.lastName && (
                                                        <div className="text-slate-400 text-sm">{user.email}</div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-slate-300">{user.email}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-2">
                                                {user.roles && user.roles.length > 0 ? (
                                                    user.roles.map((role) => (
                                                        <span
                                                            key={role}
                                                            className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(role)}`}
                                                        >
                                                            {role}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-slate-500 text-sm">No roles</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.isActive ? (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                                    <CheckCircle2 size={12} />
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-300 border border-red-500/30">
                                                    <XCircle size={12} />
                                                    Inactive
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-slate-400 text-sm">
                                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleOpenModal(user)}
                                                    className="p-2 text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition-colors"
                                                    title="Edit user"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                                                    title="Delete user"
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

            {/* Edit User Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white">
                                {editingUser ? "Edit User" : "Create User"}
                            </h2>
                            <button
                                onClick={handleCloseModal}
                                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-slate-300 text-sm font-medium mb-2">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    disabled={!!editingUser}
                                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-slate-300 text-sm font-medium mb-2">First Name</label>
                                    <input
                                        type="text"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-300 text-sm font-medium mb-2">Last Name</label>
                                    <input
                                        type="text"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-slate-300 text-sm font-medium mb-2">Roles</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {AVAILABLE_ROLES.map((role) => (
                                        <label
                                            key={role}
                                            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                                                formData.roles.includes(role)
                                                    ? "bg-emerald-500/20 border-emerald-500/50"
                                                    : "bg-slate-900/50 border-slate-700/50 hover:border-slate-600/50"
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={formData.roles.includes(role)}
                                                onChange={() => handleRoleToggle(role)}
                                                className="w-4 h-4 text-emerald-600 bg-slate-700 border-slate-600 rounded focus:ring-emerald-500 focus:ring-2"
                                            />
                                            <span className="text-white font-medium">{role}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                        className="w-4 h-4 text-emerald-600 bg-slate-700 border-slate-600 rounded focus:ring-emerald-500 focus:ring-2"
                                    />
                                    <span className="text-slate-300 text-sm font-medium">Active</span>
                                </label>
                            </div>

                            <div className="flex items-center justify-end gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-6 py-3 bg-slate-700/50 text-white rounded-xl font-medium hover:bg-slate-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2"
                                >
                                    <Save size={18} />
                                    {editingUser ? "Update User" : "Create User"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
