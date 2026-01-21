import { useState } from "react";
import { Search, Download, Eye, CheckCircle2, Clock, XCircle, CreditCard, DollarSign, FileText } from "lucide-react";

export default function BillingInvoices() {
    const [invoices, setInvoices] = useState([
        { 
            id: 1, 
            invoice: "INV-2025-001", 
            period: "January 2025", 
            amount: 25000, 
            status: "Paid",
            date: "2025-01-15",
            dueDate: "2025-02-15",
            services: [
                { name: "Social Media Campaign Management", amount: 15000 },
                { name: "Content Creation", amount: 7000 },
                { name: "Analytics & Reporting", amount: 3000 }
            ],
            taxes: 2500,
            total: 27500,
            paymentMethod: "Credit Card ending in 4242",
            paymentDate: "2025-01-20"
        },
        { 
            id: 2, 
            invoice: "INV-2025-002", 
            period: "February 2025", 
            amount: 35000, 
            status: "Pending",
            date: "2025-02-01",
            dueDate: "2025-03-01",
            services: [
                { name: "Brand Awareness Campaign", amount: 25000 },
                { name: "Video Production", amount: 8000 },
                { name: "Media Buying", amount: 2000 }
            ],
            taxes: 3500,
            total: 38500,
            paymentMethod: null,
            paymentDate: null
        },
        { 
            id: 3, 
            invoice: "INV-2025-003", 
            period: "Q1 2025", 
            amount: 15000, 
            status: "Overdue",
            date: "2025-01-10",
            dueDate: "2025-02-10",
            services: [
                { name: "Email Marketing Campaign", amount: 10000 },
                { name: "Template Design", amount: 5000 }
            ],
            taxes: 1500,
            total: 16500,
            paymentMethod: null,
            paymentDate: null
        }
    ]);

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [showDetail, setShowDetail] = useState(false);
    const [showPayment, setShowPayment] = useState(false);

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

    const handlePayment = (invoice) => {
        // TODO: Integrate with Stripe/PayPal
        setShowPayment(true);
    };

    const summaryStats = {
        totalRevenue: invoices.reduce((sum, inv) => inv.status === "Paid" ? sum + inv.total : sum, 0),
        pendingPayments: invoices.reduce((sum, inv) => inv.status === "Pending" ? sum + inv.total : sum, 0),
        overdue: invoices.reduce((sum, inv) => inv.status === "Overdue" ? sum + inv.total : sum, 0)
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Billing & Invoices</h1>
                <p className="text-slate-400">View and manage your invoices and payments</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <DollarSign className="text-emerald-400" size={24} />
                        <CheckCircle2 className="text-emerald-400" size={20} />
                    </div>
                    <p className="text-slate-400 text-sm mb-2">Total Paid</p>
                    <p className="text-3xl font-bold text-white">${summaryStats.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <Clock className="text-amber-400" size={24} />
                        <Clock className="text-amber-400" size={20} />
                    </div>
                    <p className="text-slate-400 text-sm mb-2">Pending Payments</p>
                    <p className="text-3xl font-bold text-amber-400">${summaryStats.pendingPayments.toLocaleString()}</p>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
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

                            {/* Campaign Breakdown */}
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-4">Campaign Breakdown</h3>
                                <div className="bg-slate-900/50 rounded-xl p-4 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-400">Subtotal</span>
                                        <span className="text-white">${selectedInvoice.amount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-400">Taxes (10%)</span>
                                        <span className="text-white">${selectedInvoice.taxes.toLocaleString()}</span>
                                    </div>
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
                                            <select className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
                                                <option>Stripe (Credit Card)</option>
                                                <option>PayPal</option>
                                            </select>
                                        </div>
                                        <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                                            <span className="text-white font-bold">Amount to Pay</span>
                                            <span className="text-2xl font-bold text-emerald-400">${selectedInvoice.total.toLocaleString()}</span>
                                        </div>
                                        <button className="w-full px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all">
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
