import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, Briefcase, X, Save, DollarSign } from "lucide-react";
import { servicesAPI } from "../../services/api";

export default function ServicesPage() {
    const [services, setServices] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [showModal, setShowModal] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        deliverables: "",
        basePrice: "",
        pricingType: "Fixed",
        isActive: true
    });

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const response = await servicesAPI.getAll({ pageSize: 1000 });
            setServices(response.items || []);
        } catch (error) {
            console.error('Error fetching services:', error);
            alert('Failed to fetch services. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (service = null) => {
        if (service) {
            setEditingService(service);
            setFormData({
                name: service.name || "",
                description: service.description || "",
                deliverables: service.deliverables || "",
                basePrice: service.basePrice?.toString() || "",
                pricingType: service.pricingType || "Fixed",
                isActive: service.isActive !== undefined ? service.isActive : true
            });
        } else {
            setEditingService(null);
            setFormData({
                name: "",
                description: "",
                deliverables: "",
                basePrice: "",
                pricingType: "Fixed",
                isActive: true
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingService(null);
        setFormData({
            name: "",
            description: "",
            deliverables: "",
            basePrice: "",
            pricingType: "Fixed",
            isActive: true
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const submitData = {
                name: formData.name,
                description: formData.description || null,
                deliverables: formData.deliverables || null,
                basePrice: formData.basePrice ? parseFloat(formData.basePrice) : null,
                pricingType: formData.pricingType
            };

            if (editingService) {
                // Include isActive for updates
                await servicesAPI.update(editingService.id, {
                    ...submitData,
                    isActive: formData.isActive
                });
            } else {
                await servicesAPI.create(submitData);
            }
            await fetchServices();
            handleCloseModal();
        } catch (error) {
            console.error('Error saving service:', error);
            alert(error.message || 'Failed to save service. Please try again.');
        }
    };

    const handleToggleStatus = async (service) => {
        try {
            await servicesAPI.update(service.id, {
                name: service.name,
                description: service.description,
                deliverables: service.deliverables,
                basePrice: service.basePrice,
                pricingType: service.pricingType,
                isActive: !service.isActive
            });
            await fetchServices();
        } catch (error) {
            console.error('Error updating service status:', error);
            alert(error.message || 'Failed to update service status. Please try again.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
            return;
        }
        try {
            await servicesAPI.delete(id);
            await fetchServices();
        } catch (error) {
            console.error('Error deleting service:', error);
            alert(error.message || 'Failed to delete service. Please try again.');
        }
    };

    const filteredServices = services.filter(service => {
        const matchesSearch = 
            service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.deliverables?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === "all" || 
            (statusFilter === "active" && service.isActive) ||
            (statusFilter === "inactive" && !service.isActive);
        
        return matchesSearch && matchesStatus;
    });

    const formatPrice = (price, pricingType) => {
        if (!price) return "N/A";
        const formatted = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
        
        const typeLabels = {
            "Fixed": "",
            "Monthly": "/month",
            "Hourly": "/hour",
            "ProjectBased": "/project"
        };
        
        return `${formatted}${typeLabels[pricingType] || ""}`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-slate-400">Loading services...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Services Management</h1>
                    <p className="text-slate-400">Manage your agency's services and pricing</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all flex items-center gap-2"
                >
                    <Plus size={20} />
                    Add New Service
                </button>
            </div>

            {/* Search and Filters */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-center gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search services..."
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

            {/* Services Table */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-700/30">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Service Name</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Description</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Price</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Campaigns</th>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50">
                            {filteredServices.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                                        No services found
                                    </td>
                                </tr>
                            ) : (
                                filteredServices.map((service) => (
                                    <tr key={service.id} className="hover:bg-slate-700/20 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                                    <Briefcase className="text-emerald-400" size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium">{service.name}</p>
                                                    {service.deliverables && (
                                                        <p className="text-slate-400 text-sm line-clamp-1">{service.deliverables}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-slate-300 text-sm line-clamp-2 max-w-md">
                                                {service.description || "No description"}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <DollarSign className="text-emerald-400" size={16} />
                                                <span className="text-white font-medium">
                                                    {formatPrice(service.basePrice, service.pricingType)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleToggleStatus(service)}
                                                className={`px-3 py-1 rounded-full text-xs font-medium transition-all hover:opacity-80 cursor-pointer ${
                                                    service.isActive
                                                        ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                                                        : "bg-slate-500/20 text-slate-400 hover:bg-slate-500/30"
                                                }`}
                                                title={`Click to mark as ${service.isActive ? "Inactive" : "Active"}`}
                                            >
                                                {service.isActive ? "Active" : "Inactive"}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-white font-medium">{service.campaignCount || 0}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    onClick={() => handleOpenModal(service)}
                                                    className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-700/50 rounded-lg transition-all"
                                                    title="Edit"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(service.id)}
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
                                {editingService ? "Edit Service" : "Add New Service"}
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
                                    Service Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                    placeholder="e.g., Digital Marketing"
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
                                    className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                    placeholder="Describe what this service includes..."
                                />
                            </div>
                            <div>
                                <label className="block text-slate-300 text-sm font-medium mb-2">
                                    Deliverables
                                </label>
                                <textarea
                                    value={formData.deliverables}
                                    onChange={(e) => setFormData({ ...formData, deliverables: e.target.value })}
                                    rows={2}
                                    className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                    placeholder="List key deliverables..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-slate-300 text-sm font-medium mb-2">
                                        Base Price
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={formData.basePrice}
                                        onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-300 text-sm font-medium mb-2">
                                        Pricing Type *
                                    </label>
                                    <select
                                        required
                                        value={formData.pricingType}
                                        onChange={(e) => setFormData({ ...formData, pricingType: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                    >
                                        <option value="Fixed">Fixed</option>
                                        <option value="Monthly">Monthly</option>
                                        <option value="Hourly">Hourly</option>
                                        <option value="ProjectBased">Project Based</option>
                                    </select>
                                </div>
                            </div>
                            {editingService && (
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
                                    {editingService ? "Update" : "Create"} Service
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
