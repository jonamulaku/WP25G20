import { useState } from "react";
import { Save, Eye, EyeOff, History, User, Shield, Bell, Globe, Lock } from "lucide-react";
import { authAPI } from "../../services/api";

export default function AccountSettings() {
    const currentUser = authAPI.getCurrentUser();

    const [activeTab, setActiveTab] = useState("profile");
    const [showPassword, setShowPassword] = useState(false);
    
    // Profile Settings
    const [profileData, setProfileData] = useState({
        companyName: "Tech Corp",
        contactPerson: `${currentUser?.firstName || ""} ${currentUser?.lastName || ""}`,
        email: currentUser?.email || "",
        phone: "+1 234-567-8900",
        address: "123 Business St, City, State 12345"
    });

    // Preferences
    const [preferences, setPreferences] = useState({
        emailNotifications: true,
        smsNotifications: false,
        reportFrequency: "weekly",
        language: "en",
        currency: "USD"
    });

    // Security
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    // Login History
    const [loginHistory] = useState([
        { id: 1, ip: "192.168.1.1", location: "New York, USA", device: "Chrome on Windows", timestamp: "2025-01-17T14:30:00", status: "Success" },
        { id: 2, ip: "192.168.1.2", location: "New York, USA", device: "Chrome on Windows", timestamp: "2025-01-16T09:15:00", status: "Success" },
        { id: 3, ip: "192.168.1.3", location: "New York, USA", device: "Safari on Mac", timestamp: "2025-01-15T16:45:00", status: "Success" }
    ]);

    // Access Control - Users
    const [users] = useState([
        { id: 1, name: "John Doe", email: "john@techcorp.com", role: "Admin", lastActive: "2025-01-17T10:00:00" },
        { id: 2, name: "Jane Smith", email: "jane@techcorp.com", role: "Viewer", lastActive: "2025-01-16T15:30:00" },
        { id: 3, name: "Bob Wilson", email: "bob@techcorp.com", role: "Editor", lastActive: "2025-01-17T12:00:00" }
    ]);

    const handleProfileSave = (e) => {
        e.preventDefault();
        // TODO: Implement API call to save profile
        console.log("Saving profile:", profileData);
    };

    const handlePreferencesSave = (e) => {
        e.preventDefault();
        // TODO: Implement API call to save preferences
        console.log("Saving preferences:", preferences);
    };

    const handlePasswordChange = (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        // TODO: Implement API call to change password
        console.log("Changing password");
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    };

    const tabs = [
        { id: "profile", label: "Profile Settings", icon: User },
        { id: "preferences", label: "Preferences", icon: Bell },
        { id: "security", label: "Security", icon: Shield },
        { id: "access", label: "Access Control", icon: Lock }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Account Settings</h1>
                <p className="text-slate-400">Manage your account settings and preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-1">
                    <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 space-y-2">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                        activeTab === tab.id
                                            ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30"
                                            : "text-slate-400 hover:bg-slate-700/50 hover:text-white"
                                    }`}
                                >
                                    <Icon size={20} />
                                    <span className="font-medium text-sm">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3">
                    {/* Profile Settings */}
                    {activeTab === "profile" && (
                        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                            <h2 className="text-xl font-bold text-white mb-6">Profile Settings</h2>
                            <form onSubmit={handleProfileSave} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-slate-400 text-sm mb-2 block">Company Name</label>
                                        <input
                                            type="text"
                                            value={profileData.companyName}
                                            onChange={(e) => setProfileData({ ...profileData, companyName: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-slate-400 text-sm mb-2 block">Contact Person</label>
                                        <input
                                            type="text"
                                            value={profileData.contactPerson}
                                            onChange={(e) => setProfileData({ ...profileData, contactPerson: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-slate-400 text-sm mb-2 block">Email</label>
                                        <input
                                            type="email"
                                            value={profileData.email}
                                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-slate-400 text-sm mb-2 block">Phone</label>
                                        <input
                                            type="tel"
                                            value={profileData.phone}
                                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-slate-400 text-sm mb-2 block">Address</label>
                                    <textarea
                                        value={profileData.address}
                                        onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                                        rows={3}
                                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all flex items-center gap-2"
                                >
                                    <Save size={20} />
                                    Save Changes
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Preferences */}
                    {activeTab === "preferences" && (
                        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                            <h2 className="text-xl font-bold text-white mb-6">Preferences</h2>
                            <form onSubmit={handlePreferencesSave} className="space-y-6">
                                <div>
                                    <h3 className="text-white font-semibold mb-4">Notification Preferences</h3>
                                    <div className="space-y-4">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={preferences.emailNotifications}
                                                onChange={(e) => setPreferences({ ...preferences, emailNotifications: e.target.checked })}
                                                className="w-5 h-5 rounded bg-slate-700/50 border-slate-600/50 text-emerald-600 focus:ring-emerald-500/50"
                                            />
                                            <span className="text-white">Email Notifications</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={preferences.smsNotifications}
                                                onChange={(e) => setPreferences({ ...preferences, smsNotifications: e.target.checked })}
                                                className="w-5 h-5 rounded bg-slate-700/50 border-slate-600/50 text-emerald-600 focus:ring-emerald-500/50"
                                            />
                                            <span className="text-white">SMS Notifications</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-slate-400 text-sm mb-2 block">Report Frequency</label>
                                        <select
                                            value={preferences.reportFrequency}
                                            onChange={(e) => setPreferences({ ...preferences, reportFrequency: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                        >
                                            <option value="daily">Daily</option>
                                            <option value="weekly">Weekly</option>
                                            <option value="monthly">Monthly</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-slate-400 text-sm mb-2 block">Language</label>
                                        <select
                                            value={preferences.language}
                                            onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                        >
                                            <option value="en">English</option>
                                            <option value="es">Spanish</option>
                                            <option value="fr">French</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-slate-400 text-sm mb-2 block">Currency</label>
                                        <select
                                            value={preferences.currency}
                                            onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                        >
                                            <option value="USD">USD ($)</option>
                                            <option value="EUR">EUR (€)</option>
                                            <option value="GBP">GBP (£)</option>
                                        </select>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all flex items-center gap-2"
                                >
                                    <Save size={20} />
                                    Save Preferences
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Security */}
                    {activeTab === "security" && (
                        <div className="space-y-6">
                            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                                <h2 className="text-xl font-bold text-white mb-6">Change Password</h2>
                                <form onSubmit={handlePasswordChange} className="space-y-6">
                                    <div>
                                        <label className="text-slate-400 text-sm mb-2 block">Current Password</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={passwordData.currentPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 pr-12"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                                            >
                                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-slate-400 text-sm mb-2 block">New Password</label>
                                        <input
                                            type="password"
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-slate-400 text-sm mb-2 block">Confirm New Password</label>
                                        <input
                                            type="password"
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all flex items-center gap-2"
                                    >
                                        <Lock size={20} />
                                        Change Password
                                    </button>
                                </form>
                            </div>

                            {/* Login History */}
                            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                                <div className="flex items-center gap-2 mb-6">
                                    <History className="text-emerald-400" size={24} />
                                    <h2 className="text-xl font-bold text-white">Login History</h2>
                                </div>
                                <div className="space-y-4">
                                    {loginHistory.map((login) => (
                                        <div key={login.id} className="bg-slate-700/30 rounded-xl p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-white font-medium">{login.device}</span>
                                                <span className="text-emerald-400 text-xs px-2 py-1 bg-emerald-500/20 rounded-full">
                                                    {login.status}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <span className="text-slate-400">IP Address: </span>
                                                    <span className="text-white">{login.ip}</span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-400">Location: </span>
                                                    <span className="text-white">{login.location}</span>
                                                </div>
                                                <div className="col-span-2">
                                                    <span className="text-slate-400">Date: </span>
                                                    <span className="text-white">{new Date(login.timestamp).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Access Control */}
                    {activeTab === "access" && (
                        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                            <h2 className="text-xl font-bold text-white mb-6">Access Control</h2>
                            <p className="text-slate-400 mb-6">View users under your company and manage permissions (limited)</p>
                            
                            <div className="bg-slate-700/30 rounded-xl overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-slate-700/50">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">User</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Email</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Role</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Last Active</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-700/50">
                                            {users.map((user) => (
                                                <tr key={user.id} className="hover:bg-slate-700/20 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-emerald-600/20 flex items-center justify-center">
                                                                <User className="text-emerald-400" size={20} />
                                                            </div>
                                                            <span className="text-white font-medium">{user.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-slate-300">{user.email}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                            user.role === "Admin"
                                                                ? "bg-emerald-500/20 text-emerald-400"
                                                                : user.role === "Editor"
                                                                ? "bg-blue-500/20 text-blue-400"
                                                                : "bg-slate-500/20 text-slate-400"
                                                        }`}>
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-slate-300 text-sm">
                                                            {new Date(user.lastActive).toLocaleDateString()}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
