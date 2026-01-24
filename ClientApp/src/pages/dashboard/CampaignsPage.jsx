import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, Eye, Calendar, X, Save, Megaphone } from "lucide-react";
import { campaignsAPI, clientsAPI, servicesAPI } from "../../services/api";
import { pricingPackages } from "../../data/pricingPackages";

export default function CampaignsPage() {
    const [campaigns, setCampaigns] = useState([]);
    const [clients, setClients] = useState([]);
    const [services, setServices] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        clientId: "",
        pricingPackageId: "",
        startDate: "",
        endDate: "",
        budget: "",
        notes: "",
        status: "Planning"
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [campaignsRes, clientsRes, servicesRes] = await Promise.all([
                campaignsAPI.getAll({ pageSize: 1000 }),
                clientsAPI.getAll({ pageSize: 1000 }),
                servicesAPI.getAll({ pageSize: 1000 })
            ]);
            setCampaigns(campaignsRes.items || []);
            setClients(clientsRes.items || []);
            setServices(servicesRes.items || []);
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('Failed to fetch data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (campaign = null) => {
        if (campaign) {
            setEditingCampaign(campaign);
            // Try to get pricing package ID from serviceName
            let pricingPackageId = "";
            if (campaign.serviceName) {
                // Try exact match first (case-insensitive)
                let pkg = pricingPackages.find(p => 
                    p.name.toLowerCase() === campaign.serviceName.toLowerCase()
                );
                
                // If no exact match, try partial match
                if (!pkg) {
                    pkg = pricingPackages.find(p => 
                        campaign.serviceName.toLowerCase().includes(p.name.toLowerCase()) ||
                        p.name.toLowerCase().includes(campaign.serviceName.toLowerCase())
                    );
                }
                
                pricingPackageId = pkg?.id || "";
            }
            
            setFormData({
                name: campaign.name || "",
                description: campaign.description || "",
                clientId: campaign.clientId?.toString() || "",
                pricingPackageId: pricingPackageId,
                startDate: campaign.startDate ? new Date(campaign.startDate).toISOString().split('T')[0] : "",
                endDate: campaign.endDate ? new Date(campaign.endDate).toISOString().split('T')[0] : "",
                budget: campaign.budget?.toString() || "",
                notes: campaign.notes || "",
                status: campaign.status || "Planning"
            });
        } else {
            setEditingCampaign(null);
            setFormData({
                name: "",
                description: "",
                clientId: "",
                pricingPackageId: "",
                startDate: "",
                endDate: "",
                budget: "",
                notes: "",
                status: "Planning"
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingCampaign(null);
        setFormData({
            name: "",
            description: "",
            clientId: "",
            pricingPackageId: "",
            startDate: "",
            endDate: "",
            budget: "",
            notes: "",
            status: "Planning"
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const selectedPackage = pricingPackages.find(p => p.id === formData.pricingPackageId);
            if (!selectedPackage) {
                alert('Please select a pricing package');
                return;
            }

            let serviceId = null;

            // If editing and campaign already has a serviceId, check if pricing package changed
            if (editingCampaign && editingCampaign.serviceId) {
                // Check if the pricing package matches the existing service
                const existingService = services.find(s => s.id === editingCampaign.serviceId);
                if (existingService) {
                    // Check if the service name matches the selected package
                    const serviceMatchesPackage = 
                        existingService.name.toLowerCase() === selectedPackage.name.toLowerCase() ||
                        existingService.name.toLowerCase().includes(selectedPackage.name.toLowerCase()) ||
                        selectedPackage.name.toLowerCase().includes(existingService.name.toLowerCase());
                    
                    if (serviceMatchesPackage) {
                        // Use existing serviceId if it matches
                        serviceId = editingCampaign.serviceId;
                    }
                }
            }

            // If we don't have a serviceId yet, find or create one
            if (!serviceId) {
                // Find a service that matches the pricing package name
                // Try exact match first, then case-insensitive, then partial
                let matchingService = services.find(s => 
                    s.name.toLowerCase() === selectedPackage.name.toLowerCase()
                );
                
                if (!matchingService) {
                    matchingService = services.find(s => 
                        s.name.toLowerCase().includes(selectedPackage.name.toLowerCase()) ||
                        selectedPackage.name.toLowerCase().includes(s.name.toLowerCase())
                    );
                }

                // If service doesn't exist, create it automatically
                if (!matchingService) {
                    try {
                        // Auto-create the service matching the pricing package
                        const newService = await servicesAPI.create({
                            name: selectedPackage.name,
                            description: `Pricing package: ${selectedPackage.name} - ${selectedPackage.price} ${selectedPackage.period}`,
                            deliverables: `Includes all services for ${selectedPackage.name} package`,
                            basePrice: parseFloat(selectedPackage.price.replace(/[^0-9.]/g, '')) || 0,
                            pricingType: "Monthly",
                            isActive: true
                        });
                        matchingService = newService;
                        // Refresh services list
                        const servicesRes = await servicesAPI.getAll({ pageSize: 1000 });
                        setServices(servicesRes.items || []);
                    } catch (error) {
                        console.error('Error creating service:', error);
                        alert(`Failed to create service "${selectedPackage.name}". Please create it manually in the Services page first.`);
                        return;
                    }
                }

                serviceId = matchingService.id;
            }

            // Validate serviceId is valid
            if (!serviceId || serviceId === 0) {
                alert('Invalid service. Please select a valid pricing package.');
                return;
            }

            // Validate clientId is valid
            const parsedClientId = parseInt(formData.clientId);
            if (!parsedClientId || isNaN(parsedClientId)) {
                alert('Please select a valid client.');
                return;
            }

            const submitData = {
                name: formData.name,
                description: formData.description || "",
                clientId: parsedClientId,
                serviceId: serviceId,
                budget: parseFloat(formData.budget) || 0,
                startDate: new Date(formData.startDate).toISOString(),
                endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
                notes: formData.notes || "",
                status: formData.status || "Planning"
            };

            if (editingCampaign) {
                await campaignsAPI.update(editingCampaign.id, submitData);
            } else {
                await campaignsAPI.create(submitData);
            }
            await fetchData();
            handleCloseModal();
        } catch (error) {
            console.error('Error saving campaign:', error);
            alert(error.message || 'Failed to save campaign. Please try again.');
        }
    };

    const handleStatusChange = async (campaign, newStatus) => {
        try {
            // Include all required fields for the update
            await campaignsAPI.update(campaign.id, {
                name: campaign.name,
                description: campaign.description || "",
                serviceId: campaign.serviceId, // Required field
                clientId: campaign.clientId, // Required for validation
                startDate: campaign.startDate,
                endDate: campaign.endDate || null,
                budget: campaign.budget || 0,
                notes: campaign.notes || "",
                status: newStatus
            });
            await fetchData();
        } catch (error) {
            console.error('Error updating campaign status:', error);
            alert(error.message || 'Failed to update campaign status. Please try again.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this campaign?')) {
            return;
        }
        try {
            await campaignsAPI.delete(id);
            await fetchData();
        } catch (error) {
            console.error('Error deleting campaign:', error);
            alert('Failed to delete campaign. Please try again.');
        }
    };

    const filteredCampaigns = campaigns.filter(campaign =>
        campaign.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.clientName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Campaign Management</h1>
                    <p className="text-slate-400">Create and manage marketing campaigns for your clients</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all flex items-center gap-2"
                >
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
            {filteredCampaigns.length === 0 ? (
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-12 text-center">
                    <Megaphone className="mx-auto text-slate-400 mb-4" size={48} />
                    <p className="text-slate-400">No campaigns found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCampaigns.map((campaign) => (
                        <div key={campaign.id} className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600/50 transition-all">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="text-white font-bold text-lg mb-1">{campaign.name}</h3>
                                    <p className="text-slate-400 text-sm">{campaign.clientName}</p>
                                    <p className="text-slate-500 text-xs mt-1">
                                        Package: {campaign.serviceName || "Not assigned"}
                                    </p>
                                </div>
                                <select
                                    value={campaign.status}
                                    onChange={(e) => handleStatusChange(campaign, e.target.value)}
                                    className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-all hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                                        campaign.status === "Active"
                                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                            : campaign.status === "Completed"
                                            ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                            : campaign.status === "Cancelled"
                                            ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                            : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                    }`}
                                    style={{ 
                                        appearance: 'none',
                                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23ffffff' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'right 8px center',
                                        paddingRight: '28px'
                                    }}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Active">Active</option>
                                    <option value="Paused">Paused</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>
                            <div className="space-y-3 mb-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-400 text-sm">Budget</span>
                                    <span className="text-white font-semibold">${parseFloat(campaign.budget || 0).toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-400 text-sm">
                                    <Calendar size={16} />
                                    <span>
                                        {campaign.startDate ? new Date(campaign.startDate).toLocaleDateString() : 'N/A'}
                                        {campaign.endDate && ` - ${new Date(campaign.endDate).toLocaleDateString()}`}
                                    </span>
                                </div>
                                <div className="text-slate-400 text-xs">
                                    Tasks: {campaign.completedTaskCount || 0}/{campaign.taskCount || 0} completed
                                </div>
                            </div>
                            <div className="flex items-center gap-2 pt-4 border-t border-slate-700/50">
                                <button
                                    onClick={() => handleOpenModal(campaign)}
                                    className="flex-1 px-4 py-2 bg-emerald-600/20 text-emerald-400 rounded-lg hover:bg-emerald-600/30 transition-all text-sm font-medium flex items-center justify-center gap-2"
                                >
                                    <Edit size={16} />
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(campaign.id)}
                                    className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-all"
                                    title="Delete"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
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
                                {editingCampaign ? "Edit Campaign" : "Create Campaign"}
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
                                    Campaign Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
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
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-slate-300 text-sm font-medium mb-2">
                                        Client *
                                    </label>
                                    <select
                                        required
                                        value={formData.clientId}
                                        onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                    >
                                        <option value="">Select Client</option>
                                        {clients.filter(c => c.isActive).map(client => (
                                            <option key={client.id} value={client.id}>
                                                {client.companyName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-slate-300 text-sm font-medium mb-2">
                                        Pricing Package *
                                    </label>
                                    <select
                                        required
                                        value={formData.pricingPackageId}
                                        onChange={(e) => setFormData({ ...formData, pricingPackageId: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                    >
                                        <option value="">Select Pricing Package</option>
                                        {pricingPackages.map(pkg => (
                                            <option key={pkg.id} value={pkg.id}>
                                                {pkg.name} - {pkg.price} {pkg.period}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-slate-300 text-sm font-medium mb-2">
                                        Start Date *
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-300 text-sm font-medium mb-2">
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-slate-300 text-sm font-medium mb-2">
                                        Budget *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        step="0.01"
                                        value={formData.budget}
                                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                    />
                                </div>
                                {editingCampaign && (
                                    <div>
                                        <label className="block text-slate-300 text-sm font-medium mb-2">
                                            Status *
                                        </label>
                                        <select
                                            required
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                        >
                                            <option value="Planning">Planning</option>
                                            <option value="Active">Active</option>
                                            <option value="Completed">Completed</option>
                                            <option value="On Hold">On Hold</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                )}
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
                                    {editingCampaign ? "Update" : "Create"} Campaign
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
