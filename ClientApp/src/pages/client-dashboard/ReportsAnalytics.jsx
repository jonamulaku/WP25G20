import { useState, useEffect } from "react";
import { TrendingUp, Eye, MousePointerClick, Users, BarChart3, PieChart } from "lucide-react";
import { campaignsAPI, tasksAPI } from "../../services/api";
import { useOutletContext } from "react-router-dom";

export default function ReportsAnalytics() {
    const { userInfo } = useOutletContext();
    const [campaigns, setCampaigns] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [metrics, setMetrics] = useState({
        impressions: 0,
        clicks: 0,
        conversions: 0,
        reach: 0
    });

    useEffect(() => {
        fetchData();
    }, [userInfo]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [campaignsRes, tasksRes] = await Promise.all([
                campaignsAPI.getAll({ pageSize: 1000 }),
                tasksAPI.getAll({ pageSize: 1000 })
            ]);
            
            const campaignsData = campaignsRes.items || [];
            const tasksData = tasksRes.items || [];
            
            setCampaigns(campaignsData);
            setTasks(tasksData);
            
            // Calculate metrics from campaigns (using budget as base for mock metrics)
            const totalBudget = campaignsData.reduce((sum, c) => sum + (c.budget || 0), 0);
            
            // Generate metrics based on campaigns (mock data for now, can be replaced with real analytics API later)
            const impressions = Math.floor(totalBudget * 50); // Mock: 50 impressions per dollar
            const clicks = Math.floor(impressions * 0.036); // Mock: 3.6% CTR
            const conversions = Math.floor(clicks * 0.028); // Mock: 2.8% conversion rate
            const reach = Math.floor(impressions * 0.68); // Mock: 68% reach
            
            setMetrics({
                impressions,
                clicks,
                conversions,
                reach
            });
        } catch (error) {
            console.error('Error fetching reports data:', error);
            alert('Failed to fetch reports data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

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

    // Generate campaign performance data from real campaigns
    const campaignPerformance = campaigns.map(campaign => {
        // Calculate mock metrics based on campaign budget and tasks
        const campaignTasks = tasks.filter(t => t.campaignId === campaign.id);
        const completedTasks = campaignTasks.filter(t => t.status === "Completed").length;
        const totalTasks = campaignTasks.length;
        
        // Mock metrics based on budget and task completion
        const baseImpressions = Math.floor((campaign.budget || 0) * 50);
        const impressions = baseImpressions + (completedTasks * 5000); // More impressions for completed tasks
        const clicks = Math.floor(impressions * (0.03 + (completedTasks / totalTasks) * 0.02)); // Better CTR with more completed tasks
        const conversions = Math.floor(clicks * 0.025); // 2.5% conversion rate
        
        return {
            name: campaign.name,
            impressions,
            clicks,
            conversions,
            budget: campaign.budget || 0,
            taskCount: totalTasks,
            completedTasks
        };
    });

    // Fake performance data for last 6 months
    const performanceData = [
        { month: "Aug", value: 45000 },
        { month: "Sep", value: 62000 },
        { month: "Oct", value: 58000 },
        { month: "Nov", value: 75000 },
        { month: "Dec", value: 89000 },
        { month: "Jan", value: 125000 }
    ];
    const maxValue = Math.max(...performanceData.map(d => d.value), 1);

    // Calculate budget distribution by campaign
    const totalBudget = campaigns.reduce((sum, c) => sum + (c.budget || 0), 0);
    const budgetDistribution = campaigns
        .filter(c => (c.budget || 0) > 0)
        .map(c => ({
            name: c.name,
            value: totalBudget > 0 ? Math.round(((c.budget || 0) / totalBudget) * 100) : 0,
            budget: c.budget || 0
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 4); // Top 4 campaigns

    const colorClasses = {
        emerald: "bg-emerald-500",
        blue: "bg-blue-500",
        amber: "bg-amber-500",
        green: "bg-green-500",
        purple: "bg-purple-500"
    };

    const colorNames = ["emerald", "blue", "amber", "green", "purple"];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-slate-400">Loading reports...</div>
            </div>
        );
    }

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
                            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 hover:border-slate-600/50 transition-all"
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
                    {performanceData.length > 0 ? (
                        <div className="h-64 flex items-end justify-between gap-2 px-2">
                            {performanceData.map((data, index) => {
                                const heightPercent = maxValue > 0 ? (data.value / maxValue) * 100 : 0;
                                return (
                                    <div key={index} className="flex-1 flex flex-col items-center justify-end h-full">
                                        <div
                                            className="w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg transition-all hover:from-emerald-400 hover:to-emerald-300 cursor-pointer"
                                            style={{ 
                                                height: `${Math.max(heightPercent, 3)}%`,
                                                minHeight: '12px'
                                            }}
                                            title={`${data.month}: ${data.value.toLocaleString()} impressions`}
                                        />
                                        <span className="text-xs text-slate-400 mt-2">{data.month}</span>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="h-64 flex items-center justify-center">
                            <p className="text-slate-400">No performance data available</p>
                        </div>
                    )}
                </div>

                {/* Campaign Distribution */}
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-white mb-1">Budget Distribution</h2>
                            <p className="text-slate-400 text-sm">By campaign</p>
                        </div>
                        <PieChart className="text-emerald-400" size={24} />
                    </div>
                    {budgetDistribution.length > 0 ? (
                        <div className="space-y-4">
                            {budgetDistribution.map((item, index) => {
                                const color = colorNames[index % colorNames.length];
                                return (
                                    <div key={index}>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-slate-300 text-sm truncate pr-2" title={item.name}>
                                                {item.name}
                                            </span>
                                            <span className="text-white font-semibold">{item.value}%</span>
                                        </div>
                                        <div className="w-full bg-slate-700/50 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full ${colorClasses[color]}`}
                                                style={{ width: `${item.value}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="h-64 flex items-center justify-center">
                            <p className="text-slate-400">No budget data available</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Campaign Performance Table */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-slate-700/50">
                    <h2 className="text-xl font-bold text-white">Campaign Performance Details</h2>
                </div>
                {campaignPerformance.length > 0 ? (
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
                                    const ctr = campaign.impressions > 0 
                                        ? ((campaign.clicks / campaign.impressions) * 100).toFixed(2)
                                        : "0.00";
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
                ) : (
                    <div className="p-8 text-center">
                        <p className="text-slate-400">No campaigns found</p>
                    </div>
                )}
            </div>
        </div>
    );
}
