import { useState, useEffect } from "react";
import { DollarSign, Clock, Headphones, Plus, Edit, Trash2, X, Save, Search } from "lucide-react";
import { pricingPackages } from "../../data/pricingPackages";
import { servicesAPI } from "../../services/api";

export default function PricingPage() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingPackage, setEditingPackage] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        period: "per month",
        timeline: "",
        support: ""
    });

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const response = await servicesAPI.getAll({ pageSize: 1000 });
            // Filter services that match pricing packages or show all
            setServices(response.items || []);
        } catch (error) {
            console.error('Error fetching services:', error);
            alert('Failed to fetch pricing packages. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (pkg = null) => {
        if (pkg) {
            // Find matching service
            const matchingService = services.find(s => 
                s.name.toLowerCase() === pkg.name.toLowerCase()
            );
            
            if (matchingService) {
                setEditingPackage(matchingService);
                setFormData({
                    name: matchingService.name,
                    price: matchingService.basePrice?.toString() || "",
                    period: "per month",
                    timeline: extractTimeline(matchingService.description || ""),
                    support: extractSupport(matchingService.description || "")
                });
            } else {
                // Use pricing package data
                setEditingPackage({ id: pkg.id, isNew: true });
                setFormData({
                    name: pkg.name,
                    price: pkg.price.replace(/[^0-9.]/g, ''),
                    period: pkg.period,
                    timeline: pkg.timeline,
                    support: pkg.support
                });
            }
        } else {
            setEditingPackage(null);
            setFormData({
                name: "",
                price: "",
                period: "per month",
                timeline: "",
                support: ""
            });
        }
        setShowModal(true);
    };

    const extractTimeline = (description) => {
        // Try to extract timeline from description or use default
        const match = description.match(/(\d+-\d+\s*weeks?)/i);
        return match ? match[0] : "1-2 weeks setup";
    };

    const extractSupport = (description) => {
        // Try to extract support info or use default
        if (description.toLowerCase().includes("dedicated")) return "Dedicated account manager";
        if (description.toLowerCase().includes("priority")) return "Priority support";
        return "Email support";
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingPackage(null);
        setFormData({
            name: "",
            price: "",
            period: "per month",
            timeline: "",
            support: ""
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const serviceData = {
                name: formData.name,
                description: `Pricing package: ${formData.name} - $${formData.price} ${formData.period}. ${formData.timeline}. ${formData.support}.`,
                deliverables: `Includes all services for ${formData.name} package`,
                basePrice: parseFloat(formData.price) || 0,
                pricingType: "Monthly",
                isActive: true
            };

            if (editingPackage && !editingPackage.isNew) {
                await servicesAPI.update(editingPackage.id, serviceData);
            } else {
                await servicesAPI.create(serviceData);
            }
            
            await fetchServices();
            handleCloseModal();
        } catch (error) {
            console.error('Error saving pricing package:', error);
            alert(error.message || 'Failed to save pricing package. Please try again.');
        }
    };

    const handleDelete = async (service) => {
        if (!window.confirm(`Are you sure you want to delete the "${service.name}" pricing package?`)) {
            return;
        }
        try {
            await servicesAPI.delete(service.id);
            await fetchServices();
        } catch (error) {
            console.error('Error deleting pricing package:', error);
            alert('Failed to delete pricing package. Please try again.');
        }
    };

    // Match services to pricing packages
    const getPackageData = () => {
        return pricingPackages.map(pkg => {
            const matchingService = services.find(s => 
                s.name.toLowerCase() === pkg.name.toLowerCase()
            );
            return {
                ...pkg,
                service: matchingService,
                id: matchingService?.id || pkg.id
            };
        });
    };

    const filteredPackages = getPackageData().filter(pkg =>
        pkg.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-slate-400">Loading pricing packages...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Pricing Packages</h1>
                    <p className="text-slate-400">Manage your pricing packages and their details</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all flex items-center gap-2"
                >
                    <Plus size={20} />
                    Add Package
                </button>
            </div>

            {/* Search */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search pricing packages..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                </div>
            </div>

            {/* Pricing Summary Table */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-700/30">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Package</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Price</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Setup Timeline</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Support Level</th>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50">
                            {filteredPackages.map((pkg) => (
                                <tr key={pkg.id} className="hover:bg-slate-700/20 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                                <DollarSign className="text-emerald-400" size={20} />
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">{pkg.name}</p>
                                                <p className="text-slate-400 text-xs">Package ID: {pkg.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-white font-bold text-lg">{pkg.price}</span>
                                            <span className="text-slate-400 text-sm">{pkg.period}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-slate-300 text-sm">
                                            <Clock className="text-emerald-400" size={16} />
                                            <span>{pkg.timeline}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-slate-300 text-sm">
                                            <Headphones className="text-emerald-400" size={16} />
                                            <span className="line-clamp-1">{pkg.support}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleOpenModal(pkg)}
                                                className="p-2 bg-emerald-600/20 text-emerald-400 rounded-lg hover:bg-emerald-600/30 transition-all"
                                                title="Edit"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            {pkg.service && (
                                                <button
                                                    onClick={() => handleDelete(pkg.service)}
                                                    className="p-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-all"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
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
                                {editingPackage ? "Edit Pricing Package" : "Create Pricing Package"}
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
                                    Package Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-slate-300 text-sm font-medium mb-2">
                                        Price *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-300 text-sm font-medium mb-2">
                                        Period *
                                    </label>
                                    <select
                                        required
                                        value={formData.period}
                                        onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                    >
                                        <option value="per month">per month</option>
                                        <option value="per year">per year</option>
                                        <option value="one-time">one-time</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-slate-300 text-sm font-medium mb-2">
                                    Setup Timeline *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.timeline}
                                    onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                                    placeholder="e.g., 1-2 weeks setup, ongoing monthly service"
                                    className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-300 text-sm font-medium mb-2">
                                    Support Level *
                                </label>
                                <textarea
                                    required
                                    value={formData.support}
                                    onChange={(e) => setFormData({ ...formData, support: e.target.value })}
                                    rows={2}
                                    placeholder="e.g., Email support with 48-hour response time"
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
                                    {editingPackage ? "Update" : "Create"} Package
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
