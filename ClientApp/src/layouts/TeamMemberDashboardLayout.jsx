import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import {
    LayoutDashboard,
    CheckSquare,
    Megaphone,
    BarChart3,
    Calendar,
    MessageSquare,
    Clock,
    User,
    Settings,
    Menu,
    X,
    Bell,
    Search,
    LogOut,
    Home
} from "lucide-react";
import { authAPI } from "../services/api";
import Logo from "../assets/logos/Group.svg";

export default function TeamMemberDashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [userInfo, setUserInfo] = useState(null);
    const [teamMemberInfo, setTeamMemberInfo] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const user = authAPI.getCurrentUser();
        if (!user) {
            navigate("/login");
            return;
        }
        
        // Check if user is a team member (not admin)
        if (user.roles && user.roles.includes('Admin')) {
            navigate("/dashboard");
            return;
        }
        
        setUserInfo(user);
        
        // Fetch team member info based on email
        fetchTeamMemberInfo(user.email);
    }, [navigate]);

    const fetchTeamMemberInfo = async (email) => {
        try {
            const { teamMembersAPI } = await import("../services/api");
            const response = await teamMembersAPI.getAll({ searchTerm: email });
            const teamMember = response.items?.find(tm => tm.email?.toLowerCase() === email?.toLowerCase());
            if (teamMember) {
                setTeamMemberInfo(teamMember);
            }
        } catch (error) {
            console.error("Error fetching team member info:", error);
        }
    };

    const handleLogout = () => {
        authAPI.logout();
        navigate("/");
    };

    const menuItems = [
        { path: "/team-dashboard", label: "Dashboard", icon: LayoutDashboard },
        { path: "/team-dashboard/tasks", label: "My Tasks", icon: CheckSquare },
        { path: "/team-dashboard/campaigns", label: "Campaigns", icon: Megaphone },
        { path: "/team-dashboard/performance", label: "Performance", icon: BarChart3 },
        { path: "/team-dashboard/calendar", label: "Calendar", icon: Calendar },
        { path: "/team-dashboard/communication", label: "Communication", icon: MessageSquare },
        { path: "/team-dashboard/activity", label: "Activity & Time", icon: Clock },
        { path: "/team-dashboard/profile", label: "Profile & Settings", icon: Settings },
    ];

    const isActive = (path) => {
        if (path === "/team-dashboard") {
            return location.pathname === "/team-dashboard";
        }
        return location.pathname.startsWith(path);
    };

    if (!userInfo) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <div className="text-white text-lg">Loading...</div>
            </div>
        );
    }

    const displayName = teamMemberInfo 
        ? `${teamMemberInfo.firstName || ''} ${teamMemberInfo.lastName || ''}`.trim() || userInfo.email
        : `${userInfo.firstName || ''} ${userInfo.lastName || ''}`.trim() || userInfo.email;
    
    const role = teamMemberInfo?.role || "Team Member";

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
                        <Link to="/team-dashboard" className="flex items-center gap-3">
                            <img src={Logo} alt="Logo" className="h-8" />
                            <span className="text-white font-bold text-lg">Team Dashboard</span>
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
                                    {displayName}
                                </p>
                                <p className="text-slate-400 text-xs truncate">{role}</p>
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
                                    placeholder="Search tasks, campaigns..."
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
                    <Outlet context={{ userInfo, teamMemberInfo }} />
                </main>
            </div>
        </div>
    );
}
