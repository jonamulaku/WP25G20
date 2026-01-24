import { useState, useEffect } from "react";
import { Search, Download, Eye, CheckCircle2, Clock, XCircle, CreditCard, DollarSign, FileText } from "lucide-react";
import { invoicesAPI, paymentsAPI, campaignsAPI, servicesAPI } from "../../services/api";
import { useOutletContext } from "react-router-dom";

export default function BillingInvoices() {
    const { userInfo } = useOutletContext();
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [showDetail, setShowDetail] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [campaigns, setCampaigns] = useState([]);
    const [services, setServices] = useState([]);

    useEffect(() => {
        fetchData();
    }, [userInfo]);

    const fetchData = async () => {
        try {
            setLoading(true);
            
            // First, ensure invoices exist for all campaigns
            try {
                await invoicesAPI.ensureCampaignInvoices();
            } catch (error) {
                console.warn('Error ensuring campaign invoices:', error);
                // Continue even if this fails
            }
            
            // Fetch invoices (backend filters by client email)
            const invoicesRes = await invoicesAPI.getAll({ pageSize: 1000 });
            const fetchedInvoices = invoicesRes.items || [];
            
            // Fetch campaigns and services for invoice details
            const campaignsRes = await campaignsAPI.getAll({ pageSize: 1000 });
            const servicesRes = await servicesAPI.getAll({ pageSize: 1000 });
            
            setCampaigns(campaignsRes.items || []);
            setServices(servicesRes.items || []);
            
            // Map invoices to include campaign and service details
            const mappedInvoices = fetchedInvoices.map(inv => {
                const campaign = campaignsRes.items?.find(c => c.id === inv.campaignId);
                const service = servicesRes.items?.find(s => s.id === campaign?.serviceId);
                
                // Determine status (map from backend status)
                let status = inv.status;
                // Map "Sent" and "Draft" to "Pending" for display
                if (status === "Sent" || status === "Draft") status = "Pending";
                
                // Check if overdue (only for non-paid invoices)
                if (status === "Pending" && inv.dueDate) {
                    const dueDate = new Date(inv.dueDate);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    if (dueDate < today) {
                        status = "Overdue";
                    }
                }
                
                return {
                    id: inv.id,
                    invoice: inv.invoiceNumber,
                    period: campaign ? campaign.name : `Invoice ${inv.invoiceNumber}`,
                    amount: parseFloat(inv.amount),
                    status: status,
                    date: inv.issueDate ? new Date(inv.issueDate).toISOString().split('T')[0] : null,
                    dueDate: inv.dueDate ? new Date(inv.dueDate).toISOString().split('T')[0] : null,
                    services: service ? [{ name: service.name, amount: parseFloat(inv.amount) }] : [],
                    taxes: inv.taxAmount ? parseFloat(inv.taxAmount) : 0,
                    total: parseFloat(inv.totalAmount),
                    paymentMethod: inv.status === "Paid" ? "Online Payment" : null,
                    paymentDate: inv.paidDate ? new Date(inv.paidDate).toISOString().split('T')[0] : null,
                    campaignName: campaign?.name,
                    campaignId: inv.campaignId
                };
            });
            
            setInvoices(mappedInvoices);
        } catch (error) {
            console.error('Error fetching invoices:', error);
            alert('Failed to fetch invoices. Please try again.');
            setInvoices([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredInvoices = invoices.filter(invoice =>
        invoice.invoice.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.period.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusIcon = (status) => {
        switch (status) {
            case "Paid":
                return <CheckCircle2 className="text-emerald-400" size={20} />;
            case "Pending":
                return <Clock className="text-amber-400" size={20} />;
            case "Overdue":
                return <XCircle className="text-red-400" size={20} />;
            default:
                return <Clock className="text-slate-400" size={20} />;
        }
    };

    const openDetail = (invoice) => {
        setSelectedInvoice(invoice);
        setShowDetail(true);
        setShowPayment(false);
    };

    const closeDetail = () => {
        setShowDetail(false);
        setSelectedInvoice(null);
        setShowPayment(false);
    };

    const handleDownload = (invoice) => {
        // TODO: Implement actual PDF download
        console.log("Downloading invoice:", invoice.invoice);
    };

    const handlePayment = async (invoice) => {
        try {
            // Create payment record
            const paymentData = {
                invoiceId: invoice.id,
                amount: invoice.total,
                method: "Stripe", // Default to Stripe for online payments
                transactionId: `TXN-${Date.now()}`,
                notes: `Payment for invoice ${invoice.invoice}`
            };
            
            await paymentsAPI.create(paymentData);
            
            // Refresh invoices to show updated status
            await fetchData();
            
            alert('Payment processed successfully!');
            setShowPayment(false);
            closeDetail();
        } catch (error) {
            console.error('Error processing payment:', error);
            alert(error.message || 'Failed to process payment. Please try again.');
        }
    };

    const summaryStats = {
        totalRevenue: invoices.reduce((sum, inv) => inv.status === "Paid" ? sum + inv.total : sum, 0),
        pendingPayments: invoices.reduce((sum, inv) => inv.status === "Pending" ? sum + inv.total : sum, 0),
        overdue: invoices.reduce((sum, inv) => inv.status === "Overdue" ? sum + inv.total : sum, 0)
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-slate-400">Loading invoices...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Billing & Invoices</h1>
                <p className="text-slate-400">View and manage your invoices and payments</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <DollarSign className="text-emerald-400" size={24} />
                        <CheckCircle2 className="text-emerald-400" size={20} />
                    </div>
                    <p className="text-slate-400 text-sm mb-2">Total Paid</p>
                    <p className="text-3xl font-bold text-white">${summaryStats.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <Clock className="text-amber-400" size={24} />
                        <Clock className="text-amber-400" size={20} />
                    </div>
                    <p className="text-slate-400 text-sm mb-2">Pending Payments</p>
                    <p className="text-3xl font-bold text-amber-400">${summaryStats.pendingPayments.toLocaleString()}</p>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <XCircle className="text-red-400" size={24} />
                        <XCircle className="text-red-400" size={20} />
                    </div>
                    <p className="text-slate-400 text-sm mb-2">Overdue</p>
                    <p className="text-3xl font-bold text-red-400">${summaryStats.overdue.toLocaleString()}</p>
                </div>
            </div>

            {/* Search */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search invoices..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                </div>
            </div>

            {/* Invoices Table */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-700/30">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Invoice</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Period</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Amount</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Status</th>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50">
                            {filteredInvoices.map((invoice) => (
                                <tr key={invoice.id} className="hover:bg-slate-700/20 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="text-white font-medium">{invoice.invoice}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-white">{invoice.period}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-white font-semibold">${invoice.amount.toLocaleString()}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(invoice.status)}
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                invoice.status === "Paid"
                                                    ? "bg-emerald-500/20 text-emerald-400"
                                                    : invoice.status === "Pending"
                                                    ? "bg-amber-500/20 text-amber-400"
                                                    : "bg-red-500/20 text-red-400"
                                            }`}>
                                                {invoice.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => openDetail(invoice)}
                                                className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700/50 rounded-lg transition-all"
                                                title="View Details"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDownload(invoice)}
                                                className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-700/50 rounded-lg transition-all"
                                                title="Download Invoice"
                                            >
                                                <Download size={18} />
                                            </button>
                                            {(invoice.status === "Pending" || invoice.status === "Overdue") && (
                                                <button
                                                    onClick={() => handlePayment(invoice)}
                                                    className="px-4 py-2 bg-emerald-600/20 text-emerald-400 rounded-lg hover:bg-emerald-600/30 transition-all text-sm font-medium flex items-center gap-2"
                                                >
                                                    <CreditCard size={16} />
                                                    Pay
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

            {/* Invoice Detail Modal */}
            {showDetail && selectedInvoice && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-800 border border-slate-700/50 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-slate-800 border-b border-slate-700/50 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-white">{selectedInvoice.invoice}</h2>
                            <button
                                onClick={closeDetail}
                                className="text-slate-400 hover:text-white transition-colors"
                            >
                                <XCircle size={24} />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Invoice Info */}
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-400 mb-2">Period</h3>
                                    <p className="text-white">{selectedInvoice.period}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-400 mb-2">Due Date</h3>
                                    <p className="text-white">{new Date(selectedInvoice.dueDate).toLocaleDateString()}</p>
                                </div>
                            </div>

                            {/* Services Provided */}
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-4">Services Provided</h3>
                                <div className="bg-slate-900/50 rounded-xl p-4 space-y-3">
                                    {selectedInvoice.services.map((service, index) => (
                                        <div key={index} className="flex items-center justify-between pb-3 border-b border-slate-700/50 last:border-0">
                                            <span className="text-white">{service.name}</span>
                                            <span className="text-white font-semibold">${service.amount.toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Campaign Info */}
                            {selectedInvoice.campaignName && (
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-400 mb-2">Campaign</h3>
                                    <p className="text-white">{selectedInvoice.campaignName}</p>
                                </div>
                            )}

                            {/* Invoice Breakdown */}
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-4">Invoice Breakdown</h3>
                                <div className="bg-slate-900/50 rounded-xl p-4 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-400">Subtotal</span>
                                        <span className="text-white">${selectedInvoice.amount.toLocaleString()}</span>
                                    </div>
                                    {selectedInvoice.taxes > 0 && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-400">Taxes</span>
                                            <span className="text-white">${selectedInvoice.taxes.toLocaleString()}</span>
                                        </div>
                                    )}
                                    <div className="pt-3 border-t border-slate-700/50 flex items-center justify-between">
                                        <span className="text-white font-bold text-lg">Total</span>
                                        <span className="text-white font-bold text-lg">${selectedInvoice.total.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            {selectedInvoice.paymentMethod && (
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-400 mb-2">Payment Method</h3>
                                    <div className="flex items-center gap-2 text-white">
                                        <CreditCard size={18} className="text-emerald-400" />
                                        <span>{selectedInvoice.paymentMethod}</span>
                                    </div>
                                    {selectedInvoice.paymentDate && (
                                        <p className="text-slate-400 text-sm mt-2">
                                            Paid on {new Date(selectedInvoice.paymentDate).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex items-center gap-4 pt-4 border-t border-slate-700/50">
                                <button
                                    onClick={() => handleDownload(selectedInvoice)}
                                    className="flex-1 px-6 py-3 bg-slate-700/50 text-white rounded-xl font-semibold hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
                                >
                                    <Download size={20} />
                                    Download Invoice
                                </button>
                                {(selectedInvoice.status === "Pending" || selectedInvoice.status === "Overdue") && (
                                    <button
                                        onClick={() => handlePayment(selectedInvoice)}
                                        className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                                    >
                                        <CreditCard size={20} />
                                        Pay Online
                                    </button>
                                )}
                            </div>

                            {/* Payment Form (shown when Pay button is clicked) */}
                            {showPayment && (
                                <div className="pt-4 border-t border-slate-700/50 space-y-4">
                                    <h3 className="text-lg font-semibold text-white mb-4">Payment</h3>
                                    <div className="bg-slate-900/50 rounded-xl p-6 space-y-4">
                                        <div>
                                            <label className="text-slate-400 text-sm mb-2 block">Payment Method</label>
                                            <select 
                                                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                                defaultValue="Stripe"
                                            >
                                                <option value="Stripe">Stripe (Credit Card)</option>
                                                <option value="PayPal">PayPal</option>
                                            </select>
                                        </div>
                                        <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                                            <span className="text-white font-bold">Amount to Pay</span>
                                            <span className="text-2xl font-bold text-emerald-400">${selectedInvoice.total.toLocaleString()}</span>
                                        </div>
                                        <button 
                                            onClick={() => handlePayment(selectedInvoice)}
                                            className="w-full px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all"
                                        >
                                            Process Payment
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
