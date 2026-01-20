import { useState } from "react";
import { Plus, Search, Download, Eye, CheckCircle2, Clock, XCircle } from "lucide-react";

export default function InvoicesPage() {
    const [invoices, setInvoices] = useState([
        { id: 1, client: "Tech Corp", amount: 15000, date: "2025-01-15", dueDate: "2025-02-15", status: "Paid" },
        { id: 2, client: "Design Studio", amount: 25000, date: "2025-01-20", dueDate: "2025-02-20", status: "Pending" },
        { id: 3, client: "Marketing Pro", amount: 18000, date: "2025-01-10", dueDate: "2025-02-10", status: "Overdue" },
    ]);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredInvoices = invoices.filter(invoice =>
        invoice.client.toLowerCase().includes(searchTerm.toLowerCase())
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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Billing & Invoices</h1>
                    <p className="text-slate-400">Manage invoices and track payments</p>
                </div>
                <button className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all flex items-center gap-2">
                    <Plus size={20} />
                    Create Invoice
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                    <p className="text-slate-400 text-sm mb-2">Total Revenue</p>
                    <p className="text-3xl font-bold text-white">$58,000</p>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                    <p className="text-slate-400 text-sm mb-2">Pending Payments</p>
                    <p className="text-3xl font-bold text-amber-400">$25,000</p>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                    <p className="text-slate-400 text-sm mb-2">Overdue</p>
                    <p className="text-3xl font-bold text-red-400">$18,000</p>
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
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Invoice #</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Client</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Amount</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Date</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Due Date</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Status</th>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50">
                            {filteredInvoices.map((invoice) => (
                                <tr key={invoice.id} className="hover:bg-slate-700/20 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="text-white font-medium">#{invoice.id.toString().padStart(4, '0')}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-white">{invoice.client}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-white font-semibold">${invoice.amount.toLocaleString()}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-slate-300">{invoice.date}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-slate-300">{invoice.dueDate}</span>
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
                                            <button className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700/50 rounded-lg transition-all">
                                                <Eye size={18} />
                                            </button>
                                            <button className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-700/50 rounded-lg transition-all">
                                                <Download size={18} />
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
