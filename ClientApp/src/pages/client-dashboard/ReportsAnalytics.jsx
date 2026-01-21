import { useState, useEffect } from "react";
import { TrendingUp, Eye, MousePointerClick, Users, BarChart3, PieChart } from "lucide-react";

export default function ReportsAnalytics() {
    const [metrics, setMetrics] = useState({
        impressions: 0,
        clicks: 0,
        conversions: 0,
        reach: 0
    });

    useEffect(() => {
        // TODO: Fetch real data from API
        setTimeout(() => {
            setMetrics({
                impressions: 1250000,
                clicks: 45000,
                conversions: 1250,
                reach: 850000
            });
        }, 500);
    }, []);

    const metricCards = [
        {
            title: "Total Impressions",
            value: metrics.impressions.toLocaleString(),
            icon: Eye,
            color: "blue",
            change: "+12.5%"
        },
        {
            title: "Total Clicks",
            value: metrics.clicks.toLocaleString(),
            icon: MousePointerClick,
            color: "emerald",
            change: "+8.3%"
        },
        {
            title: "Conversions",
            value: metrics.conversions.toLocaleString(),
            icon: TrendingUp,
            color: "green",
            change: "+15.2%"
        },
        {
            title: "Reach",
            value: metrics.reach.toLocaleString(),
            icon: Users,
            color: "amber",
            change: "+10.1%"
        }
    ];

    const campaignPerformance = [
        { name: "Q1 Social Media", impressions: 450000, clicks: 18000, conversions: 450, budget: 25000 },
        { name: "Brand Awareness", impressions: 350000, clicks: 14000, conversions: 350, budget: 35000 },
        { name: "Email Marketing", impressions: 250000, clicks: 8500, conversions: 250, budget: 15000 },
        { name: "Product Launch", impressions: 200000, clicks: 4500, conversions: 200, budget: 45000 },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Reports & Analytics</h1>
                <p className="text-slate-400">Comprehensive insights into your campaign performance</p>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metricCards.map((card, index) => {
                    const Icon = card.icon;
                    const colorClasses = {
                        emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
                        blue: "bg-blue-500/10 border-blue-500/20 text-blue-400",
                        green: "bg-green-500/10 border-green-500/20 text-green-400",
                        amber: "bg-amber-500/10 border-amber-500/20 text-amber-400"
                    };
                    return (
                        <div
                            key={index}
                            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600/50 transition-all"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-xl ${colorClasses[card.color]}`}>
                                    <Icon size={24} />
                                </div>
                                <span className="text-sm text-emerald-400 font-medium">{card.change}</span>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-1">{card.value}</h3>
                            <p className="text-slate-400 text-sm">{card.title}</p>
                        </div>
                    );
                })}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Performance Chart */}
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-white mb-1">Campaign Performance</h2>
                            <p className="text-slate-400 text-sm">Last 6 months</p>
                        </div>
                        <BarChart3 className="text-emerald-400" size={24} />
                    </div>
                    <div className="h-64 flex items-end justify-between gap-2">
                        {[45000, 62000, 58000, 75000, 89000, 125000].map((value, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center">
                                <div
                                    className="w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg mb-2 transition-all hover:opacity-80 cursor-pointer"
                                    style={{ height: `${(value / 125000) * 100}%` }}
                                />
                                <span className="text-xs text-slate-400">M{index + 1}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Campaign Distribution */}
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-white mb-1">Budget Distribution</h2>
                            <p className="text-slate-400 text-sm">By campaign type</p>
                        </div>
                        <PieChart className="text-emerald-400" size={24} />
                    </div>
                    <div className="space-y-4">
                        {[
                            { name: "Social Media", value: 35, color: "emerald" },
                            { name: "Brand Awareness", value: 28, color: "blue" },
                            { name: "Email Marketing", value: 22, color: "amber" },
                            { name: "Product Launch", color: "green", value: 15 }
                        ].map((item, index) => (
                            <div key={index}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-slate-300">{item.name}</span>
                                    <span className="text-white font-semibold">{item.value}%</span>
                                </div>
                                <div className="w-full bg-slate-700/50 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full bg-${item.color}-500`}
                                        style={{ width: `${item.value}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Campaign Performance Table */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-slate-700/50">
                    <h2 className="text-xl font-bold text-white">Campaign Performance Details</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-700/30">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Campaign</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Impressions</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Clicks</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Conversions</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">CTR</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Budget</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50">
                            {campaignPerformance.map((campaign, index) => {
                                const ctr = ((campaign.clicks / campaign.impressions) * 100).toFixed(2);
                                return (
                                    <tr key={index} className="hover:bg-slate-700/20 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="text-white font-medium">{campaign.name}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-white">{campaign.impressions.toLocaleString()}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-white">{campaign.clicks.toLocaleString()}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-white">{campaign.conversions.toLocaleString()}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-emerald-400 font-semibold">{ctr}%</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-white">${campaign.budget.toLocaleString()}</span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
