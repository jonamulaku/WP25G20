import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import {
    LayoutDashboard,
    Megaphone,
    BarChart3,
    CheckCircle2,
    MessageSquare,
    Receipt,
    Settings,
    Menu,
    X,
    Bell,
    Search,
    LogOut,
    User,
    Home
} from "lucide-react";
import { authAPI } from "../services/api";
import Logo from "../assets/logos/Group.svg";

export default function ClientDashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [userInfo, setUserInfo] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const user = authAPI.getCurrentUser();
        if (!user) {
            navigate("/login");
            return;
        }
        
        // Check if user is client
        if (!user.roles || !user.roles.includes('Client')) {
            console.warn('User does not have Client role. Current roles:', user.roles);
            alert('Access Denied: You must have the Client role to access this dashboard.');
            navigate("/");
            return;
        }
        
        setUserInfo(user);
    }, [navigate]);

    const handleLogout = () => {
        authAPI.logout();
        navigate("/");
    };

    const menuItems = [
        { path: "/client-dashboard", label: "Dashboard", icon: LayoutDashboard },
        { path: "/client-dashboard/campaigns", label: "My Campaigns", icon: Megaphone },
        { path: "/client-dashboard/reports", label: "Reports & Analytics", icon: BarChart3 },
        { path: "/client-dashboard/approvals", label: "Approvals", icon: CheckCircle2 },
        { path: "/client-dashboard/messages", label: "Messages", icon: MessageSquare },
        { path: "/client-dashboard/billing", label: "Billing & Invoices", icon: Receipt },
        { path: "/client-dashboard/settings", label: "Account Settings", icon: Settings },
    ];

    const isActive = (path) => {
        if (path === "/client-dashboard") {
            return location.pathname === "/client-dashboard";
        }
        return location.pathname.startsWith(path);
    };

    if (!userInfo) {
        return null; // Or a loading spinner
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full bg-slate-900/95 backdrop-blur-xl border-r border-slate-700/50 z-50 transition-transform duration-300 ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                } lg:translate-x-0 w-64`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo & Close Button */}
                    <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
                        <Link to="/client-dashboard" className="flex items-center gap-3">
                            <img src={Logo} alt="Logo" className="h-8" />
                            <span className="text-white font-bold text-lg">Client Portal</span>
                        </Link>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden text-slate-400 hover:text-white"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Navigation Menu */}
                    <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.path);
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                                        active
                                            ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30"
                                            : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                                    }`}
                                >
                                    <Icon size={20} />
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Profile Section */}
                    <div className="p-4 border-t border-slate-700/50">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-600/20 flex items-center justify-center">
                                <User className="text-emerald-400" size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white font-medium text-sm truncate">
                                    {userInfo.firstName} {userInfo.lastName}
                                </p>
                                <p className="text-slate-400 text-xs truncate">{userInfo.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-4 py-2 rounded-xl text-slate-400 hover:bg-slate-800/50 hover:text-red-400 transition-all"
                        >
                            <LogOut size={18} />
                            <span className="text-sm font-medium">Log Out</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className={`lg:pl-64 transition-all duration-300`}>
                {/* Top Header */}
                <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50">
                    <div className="flex items-center justify-between p-4 lg:p-6">
                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden text-slate-400 hover:text-white p-2"
                        >
                            <Menu size={24} />
                        </button>

                        {/* Search Bar */}
                        <div className="flex-1 max-w-2xl mx-4">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search campaigns, files, messages..."
                                    className="w-full pl-12 pr-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
                                />
                            </div>
                        </div>

                        {/* Right Side Actions */}
                        <div className="flex items-center gap-4">
                            {/* Back to Homepage Button */}
                            <Link
                                to="/"
                                className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-xl transition-all text-sm font-medium"
                            >
                                <Home size={18} />
                                <span className="hidden sm:inline">Back to Homepage</span>
                            </Link>

                            {/* Notifications */}
                            <button className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl transition-all">
                                <Bell size={20} />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>

                            {/* Profile Dropdown */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-emerald-600/20 flex items-center justify-center border border-emerald-500/30">
                                    <User className="text-emerald-400" size={20} />
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 lg:p-6">
                    <Outlet context={{ userInfo }} />
                </main>
            </div>
        </div>
    );
}
